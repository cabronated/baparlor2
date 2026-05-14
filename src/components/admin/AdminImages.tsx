import type React from 'react';
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Save, Image as ImageIcon } from 'lucide-react';

export default function AdminImages() {
  const [images, setImages] = useState({
    heroBackground: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2000&auto=format&fit=crop',
    aboutSignature: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      const docRef = doc(db, 'global', 'images');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setImages(prev => ({ ...prev, ...snap.data() }));
      }
      setLoaded(true);
    };
    fetchImages();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'global', 'images'), images);
      alert('Images saved successfully!');
    } catch (error: any) {
      alert('Failed to save images: ' + error.message);
    }
    setIsSaving(false);
  };

  if (!loaded) return <div className="text-center py-10">Loading images...</div>;

  return (
    <div className="bg-white border border-brand-black/10 p-8 shadow-sm">
      <div className="flex justify-between items-center mb-8">
         <h3 className="text-2xl font-serif tracking-tight">Image Management</h3>
      </div>
      
      <p className="text-sm font-light text-brand-black/60 mb-8 border-l-2 border-brand-gold pl-4 bg-brand-ivory/30 p-2">
        Manage the primary images used across the website. Please provide high-quality direct image URLs (e.g., from Unsplash, Imgur, or your own hosting).
      </p>

      <form onSubmit={handleSave} className="space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hero Image */}
          <div className="space-y-4">
             <label className="block text-xs uppercase tracking-widest text-brand-black/60">Homepage Hero Image Background</label>
             <input type="url" required value={images.heroBackground} onChange={e => setImages({...images, heroBackground: e.target.value})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent text-sm" placeholder="https://..." />
             
             <div className="aspect-[16/9] w-full bg-brand-ivory border border-brand-black/5 overflow-hidden flex items-center justify-center relative">
               {images.heroBackground ? (
                 <img src={images.heroBackground} alt="Hero Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
               ) : (
                 <ImageIcon className="w-8 h-8 text-brand-black/20" />
               )}
             </div>
          </div>

          {/* About Image */}
          <div className="space-y-4">
             <label className="block text-xs uppercase tracking-widest text-brand-black/60">About Page Signature Image</label>
             <input type="url" required value={images.aboutSignature} onChange={e => setImages({...images, aboutSignature: e.target.value})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent text-sm" placeholder="https://..." />
             
             <div className="aspect-[3/4] w-full max-w-[250px] bg-brand-ivory border border-brand-black/5 overflow-hidden flex items-center justify-center relative">
               {images.aboutSignature ? (
                 <img src={images.aboutSignature} alt="About Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
               ) : (
                 <ImageIcon className="w-8 h-8 text-brand-black/20" />
               )}
             </div>
          </div>
        </div>

        <div className="pt-4 border-t border-brand-black/10 flex justify-end">
          <button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-brand-black text-brand-ivory px-8 py-4 uppercase text-xs tracking-[0.1em] hover:bg-brand-gold transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Images'}
          </button>
        </div>

      </form>
    </div>
  );
}
