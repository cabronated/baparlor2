import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Trash2, CheckCircle, X, Check } from 'lucide-react';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setInquiries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'inquiries', id));
    setDeletingId(null);
  };

  const handleMarkDone = async (id: string) => {
    await updateDoc(doc(db, 'inquiries', id), { status: 'completed' });
  };

  if (inquiries.length === 0) {
    return (
      <div className="bg-white border border-brand-black/5 p-10 text-center text-brand-black/50 font-light">
        No inquiries yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {inquiries.map((inq) => (
        <div key={inq.id} className={`bg-white border ${inq.status === 'completed' ? 'border-green-500/30 bg-green-50/10' : 'border-brand-black/5'} shadow-sm p-6 hover:shadow-md transition-shadow relative group`}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-serif text-xl text-brand-gold mb-1 truncate pr-8">{inq.name}</h3>
            <span className="text-[10px] uppercase tracking-widest text-brand-black/40 whitespace-nowrap ml-2">
              {new Date(inq.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="space-y-2 mb-4 text-sm font-light">
            <p className="flex justify-between"><span className="text-brand-black/50">Phone:</span> <span>{inq.phone}</span></p>
            <p className="flex justify-between"><span className="text-brand-black/50">Service:</span> <span>{inq.service}</span></p>
            <p className="flex justify-between"><span className="text-brand-black/50">Status:</span> <span className={inq.status === 'completed' ? 'text-green-600' : 'text-amber-600'}>{inq.status || 'new'}</span></p>
          </div>
          {inq.message && (
            <div className="pt-4 border-t border-brand-black/5">
              <p className="text-[10px] uppercase tracking-widest text-brand-black/50 mb-2">Message</p>
              <p className="text-sm font-light text-brand-black/80 leading-relaxed bg-brand-ivory/50 p-3 rounded-sm">{inq.message}</p>
            </div>
          )}
          
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {inq.status !== 'completed' && deletingId !== inq.id && (
              <button onClick={() => handleMarkDone(inq.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Mark as completed">
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
            {deletingId === inq.id ? (
              <div className="flex items-center gap-1 bg-white shadow-sm border border-red-200 rounded px-1">
                <span className="text-[9px] text-red-500 font-medium px-1 uppercase">Sure?</span>
                <button onClick={() => handleDelete(inq.id)} className="p-1 text-red-500 hover:bg-red-50 rounded" title="Confirm Delete">
                  <Check className="w-3 h-3" />
                </button>
                <button onClick={() => setDeletingId(null)} className="p-1 text-brand-black/50 hover:bg-brand-black/5 rounded" title="Cancel">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button onClick={() => setDeletingId(inq.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
