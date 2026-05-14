import type React from 'react';
import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Check, X, Trash2 } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    const q = query(collection(db, 'categories'), orderBy('sequence', 'asc'));
    const snapshot = await getDocs(q);
    setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };
  
  const deduplicateCategories = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, 'categories'));
    const all = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
    const seen = new Set();
    const toDelete: any[] = [];
    
    all.forEach(cat => {
        if (seen.has(cat.name)) {
            toDelete.push(cat.id);
        } else {
            seen.add(cat.name);
        }
    });
    
    await Promise.all(toDelete.map(id => deleteDoc(doc(db, 'categories', id))));
    await fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSequenceChange = async (id: string, newSequence: number) => {
    await updateDoc(doc(db, 'categories', id), {
      sequence: Number(newSequence)
    });
    fetchCategories();
  };

  if (loading) return <div className="text-center py-10">Loading categories...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif">Manage Category Order</h3>
        <button onClick={deduplicateCategories} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 uppercase text-[10px] tracking-widest hover:bg-red-700 transition-colors">
          <Trash2 className="w-4 h-4" /> Deduplicate
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="flex justify-between items-center bg-white p-4 border border-brand-black/10">
            <span className="font-serif text-lg">{cat.name}</span>
            <input 
              type="number" 
              value={cat.sequence} 
              onChange={(e) => handleSequenceChange(cat.id, parseInt(e.target.value))}
              className="w-20 border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent" 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
