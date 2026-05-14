import type React from 'react';
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Save } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    businessHours: 'Everyday — 10:00 AM to 10:00 PM',
    phone1: '+91 9643522754',
    phone2: '+91 7678544244',
    whatsapp: '917678544244',
    address: 'Gurugram, India',
    mapsLink: 'https://maps.app.goo.gl/uS2d4pQkcoweDyWZ8',
    heroHeadline: 'Beauty Attraction',
    heroSubheadline: 'Parlor',
    heroDescription: 'Experience premium beauty treatments in a luxury environment exclusively for women.',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, 'global', 'content');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setSettings(prev => ({ ...prev, ...snap.data() }));
      }
      setLoaded(true);
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'global', 'content'), settings);
      alert('Settings saved successfully!');
    } catch (error: any) {
      alert('Failed to save settings: ' + error.message);
    }
    setIsSaving(false);
  };

  if (!loaded) return <div className="text-center py-10">Loading settings...</div>;

  return (
    <div className="bg-white border border-brand-black/10 p-8 shadow-sm">
      <div className="flex justify-between items-center mb-8">
         <h3 className="text-2xl font-serif tracking-tight">Global Content & Contact</h3>
      </div>
      
      <form onSubmit={handleSave} className="space-y-10">
        
        <div>
          <h4 className="uppercase text-[10px] tracking-widest text-brand-gold font-medium mb-4 border-b border-brand-black/5 pb-2">Hero Section</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Headline</label>
              <input type="text" value={settings.heroHeadline} onChange={e => setSettings({...settings, heroHeadline: e.target.value})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent" />
            </div>
             <div>
              <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Subheadline</label>
              <input type="text" value={settings.heroSubheadline} onChange={e => setSettings({...settings, heroSubheadline: e.target.value})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent" />
            </div>
             <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Description</label>
              <textarea rows={2} value={settings.heroDescription} onChange={e => setSettings({...settings, heroDescription: e.target.value})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent"></textarea>
            </div>
          </div>
        </div>

        <div>
          <h4 className="uppercase text-[10px] tracking-widest text-brand-gold font-medium mb-4 border-b border-brand-black/5 pb-2">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Primary Phone</label>
              <input type="text" value={settings.phone1} onChange={e => setSettings({...settings, phone1: e.target.value})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Secondary Phone</label>
              <input type="text" value={settings.phone2} onChange={e => setSettings({...settings, phone2: e.target.value})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">WhatsApp Number (Digits only for Link)</label>
              <input type="text" value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent" />
            </div>
            <div>
               <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Business Hours</label>
              <input type="text" value={settings.businessHours} onChange={e => setSettings({...settings, businessHours: e.target.value})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent" />
            </div>
            <div className="md:col-span-2">
               <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Physical Address</label>
              <input type="text" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent" />
            </div>
             <div className="md:col-span-2">
               <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Google Maps Link</label>
              <input type="url" value={settings.mapsLink} onChange={e => setSettings({...settings, mapsLink: e.target.value})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-brand-black/10 flex justify-end">
          <button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-brand-black text-brand-ivory px-8 py-4 uppercase text-xs tracking-[0.1em] hover:bg-brand-gold transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>

      </form>
    </div>
  );
}
