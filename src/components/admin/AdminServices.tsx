import type React from 'react';
import { useState, useEffect } from 'react';
import { collection, query, getDocs, deleteDoc, doc, addDoc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Edit2, Trash2, Plus, Check, X } from 'lucide-react';

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [customCategory, setCustomCategory] = useState('');
  const predefinedCategories = categories.map(c => c.name);

  const fetchServices = async () => {
    setLoading(true);
    const qServices = query(collection(db, 'services'), orderBy('sequence', 'asc'));
    const qCategories = query(collection(db, 'categories'), orderBy('sequence', 'asc'));
    
    const [snapshotServices, snapshotCategories] = await Promise.all([getDocs(qServices), getDocs(qCategories)]);
    
    setServices(snapshotServices.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    
    // If no categories in DB, initialize with defaults
    if (snapshotCategories.empty) {
        const defaults = ['Skin & Beauty', 'Hair Services', 'Makeup Services', 'Nail Services'];
        const savedCategories = await Promise.all(defaults.map((name, index) => addDoc(collection(db, 'categories'), { name, sequence: index })));
        setCategories(savedCategories.map((docRef, i) => ({ id: docRef.id, name: defaults[i], sequence: i })));
    } else {
        setCategories(snapshotCategories.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    
    setLoading(false);
  };
  
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'services', id));
    setDeletingId(null);
    fetchServices();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const catToSave = customCategory || currentService.category || predefinedCategories[0];
    
    if (currentService.id) {
      await updateDoc(doc(db, 'services', currentService.id), {
        ...currentService,
        category: catToSave,
        startingPrice: Number(currentService.startingPrice) || null,
        sequence: Number(currentService.sequence) || 0,
        updatedAt: Date.now()
      });
    } else {
      await addDoc(collection(db, 'services'), {
        ...currentService,
        category: catToSave,
        startingPrice: Number(currentService.startingPrice) || null,
        sequence: Number(currentService.sequence) || 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }
    setIsEditing(false);
    setCustomCategory('');
    fetchServices();
  };

  if (loading) return <div className="text-center py-10">Loading services...</div>;

  if (isEditing) {
    return (
      <div className="bg-white border border-brand-black/10 p-8 shadow-sm">
        <h3 className="text-2xl font-serif tracking-tight mb-8">{currentService.id ? 'Edit Service' : 'Add New Service'}</h3>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
              <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Service Name</label>
              <input type="text" required value={currentService.name || ''} onChange={e => setCurrentService({...currentService, name: e.target.value})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Category</label>
              <select 
                value={customCategory ? 'custom' : (currentService.category || predefinedCategories[0])} 
                onChange={e => {
                  if (e.target.value === 'custom') {
                    setCustomCategory('New Category');
                  } else {
                    setCustomCategory('');
                    setCurrentService({...currentService, category: e.target.value});
                  }
                }} 
                className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent mb-2"
              >
                {predefinedCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                {currentService.category && !predefinedCategories.includes(currentService.category) && !customCategory && (
                   <option value={currentService.category}>{currentService.category}</option>
                )}
                <option value="custom">+ Create New Category</option>
              </select>
              {customCategory !== '' && (
                <input 
                  type="text" 
                  autoFocus
                  required 
                  placeholder="Type new category name..."
                  value={customCategory === 'New Category' ? '' : customCategory} 
                  onChange={e => setCustomCategory(e.target.value)} 
                  className="w-full border-b border-brand-gold p-2 focus:outline-none text-brand-gold bg-transparent text-sm" 
                />
              )}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Starting Price (₹) - Optional</label>
              <input type="number" value={currentService.startingPrice || ''} onChange={e => setCurrentService({...currentService, startingPrice: e.target.value})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Sequence Order</label>
              <input type="number" value={currentService.sequence || 0} onChange={e => setCurrentService({...currentService, sequence: e.target.value})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Description</label>
            <textarea required rows={3} value={currentService.description || ''} onChange={e => setCurrentService({...currentService, description: e.target.value})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent"></textarea>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="submit" className="bg-brand-black text-brand-ivory px-8 py-3 uppercase text-xs tracking-widest hover:bg-brand-gold transition-colors">Save Service</button>
            <button type="button" onClick={() => { setIsEditing(false); setCustomCategory(''); }} className="border border-brand-black px-8 py-3 uppercase text-xs tracking-widest hover:bg-brand-black hover:text-brand-ivory transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif">All Services</h3>
        <input 
          type="text" 
          placeholder="Search services..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent text-sm w-64"
        />
        <button onClick={() => { setCurrentService({ category: predefinedCategories[0] }); setIsEditing(true); }} className="flex items-center gap-2 bg-brand-gold text-brand-ivory px-4 py-2 uppercase text-[10px] tracking-widest hover:bg-brand-black transition-colors">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>
      
      {filteredServices.length === 0 ? (
        <div className="bg-brand-ivory/50 p-10 text-center text-brand-black/50 border border-brand-black/5">
          {services.length === 0 ? "No services found." : "No services match your search."}
        </div>
      ) : (
        <div className="grid grid-cols-1 overflow-hidden border border-brand-black/10 bg-white">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-brand-black/10 bg-brand-ivory/30 text-[10px] uppercase tracking-widest text-brand-black/60 font-medium">
            <div className="col-span-4">Name</div>
            <div className="col-span-3">Category</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>
          {filteredServices.map((service, i) => (
            <div key={service.id} className={`grid grid-cols-12 gap-4 p-4 items-center ${i !== filteredServices.length - 1 ? 'border-b border-brand-black/5' : ''} hover:bg-brand-ivory/10 transition-colors`}>
              <div className="col-span-4 font-serif text-lg">{service.name}</div>
              <div className="col-span-3 text-sm font-light">{service.category}</div>
              <div className="col-span-2 text-sm text-brand-gold">₹{service.startingPrice || '-'}</div>
              <div className="col-span-3 flex justify-end gap-3">
                {deletingId === service.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-red-500 uppercase tracking-widest">Sure?</span>
                    <button onClick={() => handleDelete(service.id)} className="p-1.5 text-white bg-red-500 hover:bg-red-600 rounded" title="Confirm Delete">
                      <Check className="w-3 h-3" />
                    </button>
                    <button onClick={() => setDeletingId(null)} className="p-1.5 text-brand-black/50 hover:bg-brand-black/10 rounded" title="Cancel">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => { setCurrentService(service); setIsEditing(true); }} className="p-2 text-brand-black/50 hover:text-brand-gold transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeletingId(service.id)} className="p-2 text-brand-black/50 hover:text-red-500 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
