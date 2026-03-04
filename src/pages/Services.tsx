import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hammer, Paintbrush, Wrench, Ruler, Home as HomeIcon, Droplets, Star, Settings, PenTool, ArrowRight } from 'lucide-react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Service } from '@/types';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';

// Icon mapping
const iconMap: Record<string, any> = {
  'Hammer': Hammer,
  'Paintbrush': Paintbrush,
  'Wrench': Wrench,
  'Ruler': Ruler,
  'Home': HomeIcon,
  'Droplets': Droplets,
  'Star': Star,
  'Settings': Settings,
  'PenTool': PenTool,
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchServices = async () => {
      if (!db) {
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, 'services'), where('active', '==', true));
        const querySnapshot = await getDocs(q);
        const fetchedServices = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Service[];
        
        // Sort client-side to avoid needing a composite index
        fetchedServices.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });
        
        setServices(fetchedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="pt-16 pb-24 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">{t('services.title')}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">{t('services.notFound')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Hammer;
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <Link to={`/contact?service=${encodeURIComponent(service.title)}`} className="block h-full">
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={service.image || 'https://images.unsplash.com/photo-1581578731117-104f8a3d46a8?q=80&w=1000&auto=format&fit=crop'}
                        alt={service.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581578731117-104f8a3d46a8?q=80&w=1000&auto=format&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <span className="text-white font-medium flex items-center gap-2">
                          {t('services.learnMore')} <ArrowRight size={18} />
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                        <IconComponent size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{service.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-3">{service.description}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
