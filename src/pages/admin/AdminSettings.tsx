import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { Loader2, Save, Globe, Home, Info, Phone, Share2, LayoutTemplate, X, ChevronRight, Upload } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { SiteSettings } from '@/types';
import { uploadToCloudinary } from '@/lib/cloudinary';

type SectionKey = 'general' | 'home' | 'about' | 'footer' | 'contact' | 'social';

interface SettingSection {
  id: SectionKey;
  title: string;
  description: string;
  icon: React.ElementType;
}

const sections: SettingSection[] = [
  { id: 'general', title: 'General Information', description: 'Site name and theme settings', icon: Globe },
  { id: 'home', title: 'Home Page', description: 'Hero section and CTA content', icon: Home },
  { id: 'about', title: 'About Page', description: 'Company story and statistics', icon: Info },
  { id: 'contact', title: 'Contact Details', description: 'Address, phone, and email', icon: Phone },
  { id: 'social', title: 'Social Media', description: 'Social network links', icon: Share2 },
  { id: 'footer', title: 'Footer Content', description: 'Footer description text', icon: LayoutTemplate },
];

export default function AdminSettings() {
  const { settings, loading: initialLoading } = useSiteSettings();
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof SiteSettings) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, [field]: url }));
      toast.success('Image uploaded');
    } catch (error) {
      console.error('Upload failed', error);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) {
      toast.error('Database not configured');
      return;
    }

    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'general'), formData, { merge: true });
      toast.success('Settings updated');
      setActiveSection(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site Name</label>
              <input
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo</label>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload(e, 'logo')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                    />
                    <div className="text-gray-500">
                      <Upload className="mx-auto mb-2" size={20} />
                      <span className="text-xs">Upload Logo</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Leave empty to use the default icon</p>
                </div>
                {formData.logo && (
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shrink-0 relative group">
                    <img 
                      src={formData.logo} 
                      alt="Logo Preview" 
                      className="h-10 w-auto object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }} 
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logo: '' })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Theme Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.themeColor}
                  onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                  className="h-10 w-20 rounded border border-gray-300 dark:border-gray-700 cursor-pointer"
                />
                <span className="text-sm text-gray-500">{formData.themeColor}</span>
              </div>
            </div>
          </div>
        );
      case 'home':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Title</label>
              <input
                value={formData.heroTitle || ''}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Subtitle</label>
              <textarea
                value={formData.heroSubtitle || ''}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Image</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  onChange={(e) => handleImageUpload(e, 'heroImage')}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                />
                {formData.heroImage ? (
                  <div className="relative">
                    <img src={formData.heroImage} alt="Hero Preview" className="h-40 w-full object-cover rounded" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded">
                      <span className="text-white font-medium">Click to change</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 py-8">
                    <Upload className="mx-auto mb-2" size={32} />
                    <span className="text-sm">Upload Hero Image</span>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CTA Title</label>
                <input
                  value={formData.ctaTitle || ''}
                  onChange={(e) => setFormData({ ...formData, ctaTitle: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CTA Subtitle</label>
                <input
                  value={formData.ctaSubtitle || ''}
                  onChange={(e) => setFormData({ ...formData, ctaSubtitle: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">About Title</label>
              <input
                value={formData.aboutTitle || ''}
                onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">About Description</label>
              <textarea
                value={formData.aboutDescription || ''}
                onChange={(e) => setFormData({ ...formData, aboutDescription: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Years Exp.</label>
                <input
                  value={formData.statYears || ''}
                  onChange={(e) => setFormData({ ...formData, statYears: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Projects</label>
                <input
                  value={formData.statProjects || ''}
                  onChange={(e) => setFormData({ ...formData, statProjects: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team Size</label>
                <input
                  value={formData.statTeam || ''}
                  onChange={(e) => setFormData({ ...formData, statTeam: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Satisfaction</label>
                <input
                  value={formData.statSatisfaction || ''}
                  onChange={(e) => setFormData({ ...formData, statSatisfaction: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Story Title</label>
              <input
                value={formData.storyTitle || ''}
                onChange={(e) => setFormData({ ...formData, storyTitle: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Story Content</label>
              <textarea
                value={formData.storyContent || ''}
                onChange={(e) => setFormData({ ...formData, storyContent: e.target.value })}
                rows={5}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Story Image</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  onChange={(e) => handleImageUpload(e, 'storyImage')}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                />
                {formData.storyImage ? (
                  <div className="relative">
                    <img src={formData.storyImage} alt="Story Preview" className="h-40 w-full object-cover rounded" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded">
                      <span className="text-white font-medium">Click to change</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 py-8">
                    <Upload className="mx-auto mb-2" size={32} />
                    <span className="text-sm">Upload Story Image</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
              <input
                value={formData.contactAddress}
                onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        );
      case 'social':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Facebook URL</label>
              <input
                value={formData.socialFacebook || ''}
                onChange={(e) => setFormData({ ...formData, socialFacebook: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twitter URL</label>
              <input
                value={formData.socialTwitter || ''}
                onChange={(e) => setFormData({ ...formData, socialTwitter: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instagram URL</label>
              <input
                value={formData.socialInstagram || ''}
                onChange={(e) => setFormData({ ...formData, socialInstagram: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn URL</label>
              <input
                value={formData.socialLinkedin || ''}
                onChange={(e) => setFormData({ ...formData, socialLinkedin: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://linkedin.com/..."
              />
            </div>
          </div>
        );
      case 'footer':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Footer Description</label>
              <textarea
                value={formData.footerDescription || ''}
                onChange={(e) => setFormData({ ...formData, footerDescription: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Footer Copyright</label>
              <input
                value={formData.footerCopyright || ''}
                onChange={(e) => setFormData({ ...formData, footerCopyright: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="© 2026 Renovision & Repair Expert. All rights reserved."
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Site Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your website content and configuration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className="flex flex-col items-start p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all text-left group"
          >
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
              <section.icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{section.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-1">{section.description}</p>
            <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium mt-auto">
              Edit Settings <ChevronRight size={16} className="ml-1" />
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {activeSection && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col relative">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                  {(() => {
                    const Icon = sections.find(s => s.id === activeSection)?.icon;
                    return Icon ? <Icon size={20} /> : null;
                  })()}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {sections.find(s => s.id === activeSection)?.title}
                </h2>
              </div>
              <button 
                onClick={() => setActiveSection(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto">
              {renderSectionContent()}
              
              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 p-4 -mx-6 -mb-6">
                <button
                  type="button"
                  onClick={() => setActiveSection(null)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
