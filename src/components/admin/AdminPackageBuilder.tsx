import type React from 'react';
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Save } from 'lucide-react';

export default function AdminPackageBuilder() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    enabled: true,
    tier1Count: 2,
    tier1DiscountPercent: 5,
    tier2Count: 3,
    tier2DiscountPercent: 15,
    tier3Count: 5,
    tier3DiscountPercent: 25,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'global', 'builder');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings({ ...settings, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching builder settings: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'global', 'builder'), {
        ...settings,
        updatedAt: Date.now()
      });
      alert('Package builder settings saved successfully!');
    } catch (error) {
      console.error("Error saving builder settings: ", error);
      alert('Error saving settings. Try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading package builder settings...</div>;

  return (
    <div className="bg-white border border-brand-black/10 p-8 shadow-sm">
      <div className="flex justify-between items-center mb-8 border-b border-brand-black/10 pb-6">
        <div>
          <h3 className="text-2xl font-serif tracking-tight mb-2">Custom Package Builder</h3>
          <p className="text-sm font-light text-brand-black/60">Configure discount logic for custom packages.</p>
        </div>
        <label className="flex items-center gap-3 cursor-pointer bg-brand-ivory/50 px-4 py-2 border border-brand-black/5 rounded">
          <span className="text-sm font-medium uppercase tracking-widest text-brand-black/80">Builder Enabled</span>
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={settings.enabled} onChange={(e) => setSettings({...settings, enabled: e.target.checked})} />
            <div className={`block w-10 h-6 rounded-full transition-colors ${settings.enabled ? 'bg-brand-gold' : 'bg-brand-black/20'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.enabled ? 'translate-x-4' : ''}`}></div>
          </div>
        </label>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <h4 className="uppercase tracking-widest text-xs font-semibold text-brand-black/50 mb-4">Discount Tiers</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-brand-ivory/30 p-6 border border-brand-black/5">
          <div className="md:col-span-2">
            <h5 className="font-serif text-lg mb-2">Tier 1 Discount</h5>
            <p className="text-xs font-light text-brand-black/50 uppercase tracking-widest mb-4">Smallest combo of services</p>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Minimum Services Included</label>
            <input type="number" required min="2" value={settings.tier1Count} onChange={e => setSettings({...settings, tier1Count: Number(e.target.value)})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Discount Percentage (%)</label>
            <input type="number" required min="0" max="100" value={settings.tier1DiscountPercent} onChange={e => setSettings({...settings, tier1DiscountPercent: Number(e.target.value)})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-brand-ivory/30 p-6 border border-brand-black/5">
          <div className="md:col-span-2">
            <h5 className="font-serif text-lg mb-2">Tier 2 Discount</h5>
            <p className="text-xs font-light text-brand-black/50 uppercase tracking-widest mb-4">Medium combo of services</p>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Minimum Services Included</label>
            <input type="number" required min={settings.tier1Count + 1} value={settings.tier2Count} onChange={e => setSettings({...settings, tier2Count: Number(e.target.value)})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Discount Percentage (%)</label>
            <input type="number" required min="0" max="100" value={settings.tier2DiscountPercent} onChange={e => setSettings({...settings, tier2DiscountPercent: Number(e.target.value)})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-brand-ivory/30 p-6 border border-brand-black/5">
          <div className="md:col-span-2">
            <h5 className="font-serif text-lg mb-2">Tier 3 Discount</h5>
            <p className="text-xs font-light text-brand-black/50 uppercase tracking-widest mb-4">Premium combo of services</p>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Minimum Services Included</label>
            <input type="number" required min={settings.tier2Count + 1} value={settings.tier3Count} onChange={e => setSettings({...settings, tier3Count: Number(e.target.value)})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-brand-black/60 mb-2">Discount Percentage (%)</label>
            <input type="number" required min="0" max="100" value={settings.tier3DiscountPercent} onChange={e => setSettings({...settings, tier3DiscountPercent: Number(e.target.value)})} className="w-full border-b border-brand-black/20 p-2 focus:outline-none focus:border-brand-gold bg-transparent" />
          </div>
        </div>

        <div className="pt-8">
          <button type="submit" disabled={saving} className="bg-brand-black text-brand-ivory px-8 py-4 uppercase text-xs tracking-[0.2em] hover:bg-brand-gold transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Builder Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
