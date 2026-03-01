import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SiteSettings } from '@/types';

const defaultSettings: SiteSettings = {
  siteName: 'Renovision & Repair Expert',
  logo: '',
  contactEmail: 'hello@renovision.com',
  contactPhone: '+1 (555) 123-4567',
  contactAddress: '123 Renovation Lane, Builder City, BC 12345',
  themeColor: '#2563eb',
  
  heroTitle: 'Crafting Your Dream Space',
  heroSubtitle: 'Premium renovation and repair services tailored to your lifestyle. We bring precision, quality, and passion to every project.',
  heroImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2831&auto=format&fit=crop',
  ctaTitle: 'Ready to Transform Your Home?',
  ctaSubtitle: "Let's discuss your vision and bring it to life. Schedule a consultation today.",
  
  aboutTitle: 'About Renovision',
  aboutDescription: 'Building dreams, one project at a time. We are a team of dedicated professionals committed to excellence in every renovation.',
  statYears: '15+',
  statProjects: '500+',
  statTeam: '40+',
  statSatisfaction: '99%',
  storyTitle: 'Our Story',
  storyContent: 'Founded in 2010, Renovision began with a simple mission: to bring high-quality craftsmanship and transparent pricing to the renovation industry.',
  storyImage: 'https://images.unsplash.com/photo-1581578731117-104f8a3d46a8?q=80&w=1000&auto=format&fit=crop',
  
  footerDescription: 'Transforming spaces with precision and passion. Your trusted partner for all renovation and repair needs.',
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'settings', 'general'), (doc) => {
      if (doc.exists()) {
        setSettings({ ...defaultSettings, ...doc.data() } as SiteSettings);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching settings:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { settings, loading };
}
