import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export interface GlobalSettings {
  businessHours: string;
  phone1: string;
  phone2: string;
  whatsapp: string;
  address: string;
  mapsLink: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroDescription: string;
}

export interface GlobalImages {
  heroBackground: string;
  aboutSignature: string;
}

const defaultSettings: GlobalSettings = {
  businessHours: 'Everyday — 10:00 AM to 10:00 PM',
  phone1: '+91 9643522754',
  phone2: '+91 7678544244',
  whatsapp: '917678544244',
  address: 'Gurugram, India',
  mapsLink: 'https://maps.app.goo.gl/uS2d4pQkcoweDyWZ8',
  heroHeadline: 'Beauty Attraction',
  heroSubheadline: 'Parlor',
  heroDescription: 'Experience premium beauty treatments in a luxury environment exclusively for women.',
};

const defaultImages: GlobalImages = {
  heroBackground: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2000&auto=format&fit=crop',
  aboutSignature: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop'
};

export function useGlobalSettings() {
  const [settings, setSettings] = useState<GlobalSettings>(defaultSettings);
  const [images, setImages] = useState<GlobalImages>(defaultImages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let contentLoaded = false;
    let imagesLoaded = false;

    const unsubContent = onSnapshot(doc(db, 'global', 'content'), (doc) => {
      if (doc.exists()) {
        setSettings({ ...defaultSettings, ...doc.data() as Partial<GlobalSettings> });
      }
      contentLoaded = true;
      if (contentLoaded && imagesLoaded) setLoading(false);
    });

    const unsubImages = onSnapshot(doc(db, 'global', 'images'), (doc) => {
      if (doc.exists()) {
        setImages({ ...defaultImages, ...doc.data() as Partial<GlobalImages> });
      }
      imagesLoaded = true;
      if (contentLoaded && imagesLoaded) setLoading(false);
    });

    return () => {
      unsubContent();
      unsubImages();
    };
  }, []);

  return { settings, images, loading };
}
