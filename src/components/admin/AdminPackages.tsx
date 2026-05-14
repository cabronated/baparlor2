import type React from 'react';
import { useState, useEffect } from 'react';
import { collection, query, getDocs, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Edit2, Trash2, Plus, X, Check } from 'lucide-react';

export default function AdminPackages() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<any>(null);
  const [newService, setNewService] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPackages = async () => {
    setLoading(true);
    const q = query(collection(db, 'packages'));
    const snapshot = await getDocs(q);
    setPackages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'packages', id));
    setDeletingId(null);
    fetchPackages();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPackage.id) {
      await updateDoc(doc(db, 'packages', currentPackage.id), {
        ...currentPackage,
        price: Number(currentPackage.price) || 0,
        originalPrice: Number(currentPackage.originalPrice) || 0,
        updatedAt: Date.now()
      });
    } else {
      await addDoc(collection(db, 'packages'), {
        ...currentPackage,
        price: Number(currentPackage.price) || 0,
        originalPrice: Number(currentPackage.originalPrice) || 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }
    setIsEditing(false);
    fetchPackages();
  };
  
  const addServiceItem = () => {
    if (newService.trim() === '') return;
    setCurrentPackage({
      ...currentPackage,
      services: [...(currentPackage.services || []), newService.trim()]
    });
    setNewService('');
  };
  
  const removeServiceItem = (index: number) => {
    const updated = [...(currentPackage.services || [])];
    updated.splice(index, 1);
    setCurrentPackage({...currentPackage, services: updated });
  };

  if (loading) return <div className="text-center py-10">Loading packages...</div>;

  if (isEditing) {
    return (
      <div className="bg-white border border-brand-black/10 p-8 shadow-sm">
        <h3 className="text-2xl font-serif tracking-tight mb-8">{currentPackage.id ? 'Edit Package' : 'Add New Package'}</h3>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
              <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Package Title</label>
              <input type="text" required value={currentPackage.title || ''} onChange={e => setCurrentPackage({...currentPackage, title: e.target.value})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Image URL</label>
              <input type="url" value={currentPackage.image || ''} onChange={e => setCurrentPackage({...currentPackage, image: e.target.value})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Original Price (₹)</label>
              <input type="number" required value={currentPackage.originalPrice || ''} onChange={e => setCurrentPackage({...currentPackage, originalPrice: e.target.value})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Package Price (₹)</label>
              <input type="number" required value={currentPackage.price || ''} onChange={e => setCurrentPackage({...currentPackage, price: e.target.value})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Description</label>
            <textarea required rows={2} value={currentPackage.description || ''} onChange={e => setCurrentPackage({...currentPackage, description: e.target.value})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent"></textarea>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={currentPackage.isPopular || false} onChange={e => setCurrentPackage({...currentPackage, isPopular: e.target.checked})} className="accent-brand-gold" />
              <span className="text-sm font-light uppercase tracking-widest">Mark as Popular</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={currentPackage.isBestValue || false} onChange={e => setCurrentPackage({...currentPackage, isBestValue: e.target.checked})} className="accent-brand-gold" />
              <span className="text-sm font-light uppercase tracking-widest">Mark as Best Value</span>
            </label>
          </div>
          
          <div className="pt-4 border-t border-brand-black/10">
             <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-4">Included Services List</label>
             <div className="space-y-3 mb-4">
               {(currentPackage.services || []).map((srv: string, idx: number) => (
                 <div key={idx} className="flex justify-between items-center bg-brand-ivory/50 p-3 border border-brand-black/5">
                   <span className="font-light text-sm">{srv}</span>
                   <button type="button" onClick={() => removeServiceItem(idx)} className="text-red-500 hover:bg-red-50 p-1"><X className="w-4 h-4"/></button>
                 </div>
               ))}
               {(currentPackage.services || []).length === 0 && (
                 <p className="text-sm font-light text-brand-black/40 italic">No services added yet.</p>
               )}
             </div>
             <div className="flex gap-2">
               <input type="text" value={newService} onChange={(e) => setNewService(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addServiceItem())} placeholder="Type a service and press Add" className="flex-grow border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent text-sm font-light" />
               <button type="button" onClick={addServiceItem} className="bg-brand-black/5 px-4 py-2 text-xs uppercase tracking-widest hover:bg-brand-black/10 transition-colors">Add</button>
             </div>
          </div>
          
          <div className="flex gap-4 pt-8">
            <button type="submit" className="bg-brand-black text-brand-ivory px-8 py-3 uppercase text-xs tracking-widest hover:bg-brand-gold transition-colors">Save Package</button>
            <button type="button" onClick={() => setIsEditing(false)} className="border border-brand-black px-8 py-3 uppercase text-xs tracking-widest hover:bg-brand-black hover:text-brand-ivory transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif">Premium Packages</h3>
        <button onClick={() => { setCurrentPackage({ services: [] }); setIsEditing(true); }} className="flex items-center gap-2 bg-brand-gold text-brand-ivory px-4 py-2 uppercase text-[10px] tracking-widest hover:bg-brand-black transition-colors">
          <Plus className="w-4 h-4" /> Add Package
        </button>
      </div>
      
      {packages.length === 0 ? (
        <div className="bg-brand-ivory/50 p-10 text-center text-brand-black/50 border border-brand-black/5">
          No packages found. Click 'Add Package' to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 overflow-hidden border border-brand-black/10 bg-white">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-brand-black/10 bg-brand-ivory/30 text-[10px] uppercase tracking-widest text-brand-black/60 font-medium">
            <div className="col-span-3">Title</div>
            <div className="col-span-3">Description</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Tags</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          {packages.map((pkg, i) => (
            <div key={pkg.id} className={`grid grid-cols-12 gap-4 p-4 items-center ${i !== packages.length - 1 ? 'border-b border-brand-black/5' : ''} hover:bg-brand-ivory/10 transition-colors`}>
              <div className="col-span-3 font-serif text-lg">{pkg.title}</div>
              <div className="col-span-3 text-sm font-light truncate pr-4">{pkg.description}</div>
              <div className="col-span-2 flex flex-col">
                <span className="text-sm text-brand-gold">₹{pkg.price}</span>
                {pkg.originalPrice && <span className="text-[10px] text-brand-black/40 line-through">₹{pkg.originalPrice}</span>}
              </div>
              <div className="col-span-2 flex flex-col gap-1">
                {pkg.isPopular && <span className="text-[10px] uppercase tracking-widest text-brand-gold">Popular</span>}
                {pkg.isBestValue && <span className="text-[10px] uppercase tracking-widest text-brand-gold">Best Value</span>}
              </div>
              <div className="col-span-2 flex justify-end gap-3">
                {deletingId === pkg.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-red-500 uppercase tracking-widest">Sure?</span>
                    <button onClick={() => handleDelete(pkg.id)} className="p-1.5 text-white bg-red-500 hover:bg-red-600 rounded" title="Confirm Delete">
                      <Check className="w-3 h-3" />
                    </button>
                    <button onClick={() => setDeletingId(null)} className="p-1.5 text-brand-black/50 hover:bg-brand-black/10 rounded" title="Cancel">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => { setCurrentPackage(pkg); setIsEditing(true); }} className="p-2 text-brand-black/50 hover:text-brand-gold transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeletingId(pkg.id)} className="p-2 text-brand-black/50 hover:text-red-500 transition-colors" title="Delete">
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
