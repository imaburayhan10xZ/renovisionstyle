import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useLanguage } from '@/context/LanguageContext';
import { useSearchParams } from 'react-router-dom';
import { Service } from '@/types';
import SocialIcon from '@/components/SocialIcon';

type FormData = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

export default function Contact() {
  const { settings } = useSiteSettings();
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service') || '';
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      service: initialService
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchServices = async () => {
      if (!db) return;
      try {
        const q = query(collection(db, 'services'), where('active', '==', true));
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
        setServices(fetched);
      } catch (error) {
        console.error("Error fetching services for contact form:", error);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (initialService) {
      setValue('service', initialService);
    }
  }, [initialService, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    if (!db) {
      toast.error('Database not configured');
      setIsSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(db, 'leads'), {
        ...data,
        status: 'new',
        createdAt: serverTimestamp()
      });
      toast.success(t('contact.success'));
      reset();
    } catch (error) {
      console.error('Firestore Error:', error);
      toast.error(t('contact.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-16 pb-24 bg-white dark:bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">{t('contact.title')}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('contact.info.title')}</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg text-blue-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{t('contact.info.office')}</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-line">{settings.contactAddress || "123 Renovation Lane,\nBuilder City, BC 12345"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg text-blue-600">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{t('contact.info.phone')}</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{settings.contactPhone || "+1 (555) 123-4567"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg text-blue-600">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{t('contact.info.email')}</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{settings.contactEmail || "hello@renovatepro.com"}</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                <h4 className="font-bold text-gray-900 dark:text-white mb-6">Follow Us</h4>
                <div className="flex flex-wrap gap-4">
                  {settings.socialLinks && settings.socialLinks.length > 0 ? (
                    settings.socialLinks.map((link, index) => (
                      <a 
                        key={index} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white transition-all"
                        title={link.platform}
                      >
                        <SocialIcon platform={link.platform} size={24} />
                      </a>
                    ))
                  ) : (
                    <>
                      {settings.socialFacebook && (
                        <a href={settings.socialFacebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                          <SocialIcon platform="Facebook" size={24} />
                        </a>
                      )}
                      {settings.socialTwitter && (
                        <a href={settings.socialTwitter} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                          <SocialIcon platform="Twitter" size={24} />
                        </a>
                      )}
                      {settings.socialInstagram && (
                        <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                          <SocialIcon platform="Instagram" size={24} />
                        </a>
                      )}
                      {settings.socialLinkedin && (
                        <a href={settings.socialLinkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                          <SocialIcon platform="LinkedIn" size={24} />
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('contact.form.name')}</label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="John Doe"
                  />
                  {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('contact.form.email')}</label>
                  <input
                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('contact.form.phone')}</label>
                  <input
                    {...register('phone', { required: 'Phone is required' })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && <span className="text-red-500 text-sm mt-1">{errors.phone.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('contact.form.service')}</label>
                  <select
                    {...register('service', { required: 'Please select a service' })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="">{t('contact.form.service.select')}</option>
                    {services.map(s => (
                      <option key={s.id} value={s.title}>{s.title}</option>
                    ))}
                    <option value="Other">{t('contact.form.service.other')}</option>
                  </select>
                  {errors.service && <span className="text-red-500 text-sm mt-1">{errors.service.message}</span>}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('contact.form.message')}</label>
                <textarea
                  {...register('message', { required: 'Message is required' })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  placeholder="Tell us about your project..."
                />
                {errors.message && <span className="text-red-500 text-sm mt-1">{errors.message.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> {t('contact.form.sending')}
                  </>
                ) : (
                  <>
                    <Send size={20} /> {t('contact.form.send')}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
