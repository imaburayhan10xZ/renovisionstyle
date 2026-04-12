import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Phone, Mail, MapPin, Download, Share2, Globe } from 'lucide-react';
import SocialIcon from '@/components/SocialIcon';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { VCardProfile } from '@/types';

export default function VCard() {
  const { id } = useParams<{ id: string }>();
  const { settings, loading: settingsLoading } = useSiteSettings();
  const [profile, setProfile] = useState<VCardProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(!!id);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id || !db) return;
      try {
        const docRef = doc(db, 'vcards', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile({ id: docSnap.id, ...docSnap.data() } as VCardProfile);
        }
      } catch (error) {
        console.error("Error fetching vcard profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (settingsLoading || loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Use dynamic profile if available, otherwise fallback to global settings
  const displayData = profile ? {
    name: profile.name,
    role: profile.role,
    phone: profile.phone,
    email: profile.email,
    website: profile.website,
    address: profile.address,
    image: profile.image,
    description: profile.role,
  } : {
    name: settings.siteName || 'Renovision & Repair Expert',
    role: '',
    phone: settings.contactPhone || '',
    email: settings.contactEmail || '',
    website: settings.contactWebsite || '',
    address: settings.contactAddress || '',
    image: settings.logo || '',
    description: settings.footerDescription || 'Professional Renovation & Repair Services',
  };

  const handleSaveContact = () => {
    // Generate VCF content
    const vcf = `BEGIN:VCARD
VERSION:3.0
FN:${displayData.name}
ORG:${settings.siteName || 'Renovision & Repair Expert'}
TITLE:${displayData.role}
TEL;TYPE=WORK,VOICE:${displayData.phone}
EMAIL;TYPE=WORK:${displayData.email}
URL:${displayData.website || window.location.origin}
NOTE:${displayData.description}
END:VCARD`;

    const blob = new Blob([vcf], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${displayData.name.replace(/\s+/g, '_')}_contact.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: displayData.name,
          text: displayData.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      // Fallback to copy link
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 relative">
        
        {/* Back to Home Link */}
        <Link to="/" className="absolute top-4 left-4 z-10 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white p-2 rounded-full transition-all">
          <Globe size={20} />
        </Link>

        {/* Header/Cover */}
        <div className="h-48 relative">
          <img 
            src={settings.heroImage || "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2831&auto=format&fit=crop"} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60"></div>
        </div>
        
        {/* Profile Info */}
        <div className="px-6 pb-8 relative">
          <div className="flex justify-center -mt-20 mb-4 relative z-10">
            <div className="w-36 h-36 bg-white dark:bg-gray-800 rounded-full p-2 shadow-xl border-4 border-white dark:border-gray-900">
              {displayData.image ? (
                <img src={displayData.image} alt="Profile" className="w-full h-full object-contain rounded-full bg-white" />
              ) : (
                <div className="w-full h-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center text-5xl font-bold">
                  {displayData.name?.charAt(0) || 'R'}
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{displayData.name}</h1>
            <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">{displayData.role}</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm px-4">{displayData.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button onClick={handleSaveContact} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-4 rounded-2xl font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
              <Download size={18} /> Save Contact
            </button>
            <button onClick={handleShare} className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white py-3.5 px-4 rounded-2xl font-semibold transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0">
              <Share2 size={18} /> Share
            </button>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 mb-8">
            {displayData.phone && (
              <a href={`tel:${displayData.phone}`} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors group border border-transparent hover:border-blue-100 dark:hover:border-gray-700">
                <div className="w-12 h-12 bg-white dark:bg-gray-900 shadow-sm text-blue-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium mb-0.5">Phone</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{displayData.phone}</p>
                </div>
              </a>
            )}
            
            {displayData.email && (
              <a href={`mailto:${displayData.email}`} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors group border border-transparent hover:border-blue-100 dark:hover:border-gray-700">
                <div className="w-12 h-12 bg-white dark:bg-gray-900 shadow-sm text-blue-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Mail size={20} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium mb-0.5">Email</p>
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{displayData.email}</p>
                </div>
              </a>
            )}

            {displayData.website && (
              <a href={displayData.website.startsWith('http') ? displayData.website : `https://${displayData.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors group border border-transparent hover:border-blue-100 dark:hover:border-gray-700">
                <div className="w-12 h-12 bg-white dark:bg-gray-900 shadow-sm text-blue-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Globe size={20} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium mb-0.5">Website</p>
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{displayData.website}</p>
                </div>
              </a>
            )}

            {displayData.address && (
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-transparent">
                <div className="w-12 h-12 bg-white dark:bg-gray-900 shadow-sm text-blue-600 rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium mb-0.5">Address</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{displayData.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Social Links */}
          {settings.socialLinks && settings.socialLinks.length > 0 && (
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-4 uppercase tracking-widest text-center">Connect With Us</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {settings.socialLinks.map((link, index) => (
                  <a 
                    key={index} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-700 hover:shadow-md transition-all hover:-translate-y-1"
                    title={link.platform}
                  >
                    <SocialIcon platform={link.platform} size={22} />
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
