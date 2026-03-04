import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Star, Quote, Hammer, Paintbrush, Wrench, Droplets, Settings, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Testimonial, Service } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

const iconMap: Record<string, any> = {
  'Hammer': Hammer,
  'Paintbrush': Paintbrush,
  'Wrench': Wrench,
  'Droplets': Droplets,
  'Settings': Settings,
};

export default function Home() {
  const { settings } = useSiteSettings();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      if (!db) return;
      try {
        // Fetch Testimonials
        const tQuery = query(collection(db, 'testimonials'), where('approved', '==', true));
        const tSnapshot = await getDocs(tQuery);
        const fetchedT = tSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Testimonial[];
        fetchedT.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setTestimonials(fetchedT.slice(0, 3));

        // Fetch Services
        const sQuery = query(collection(db, 'services'), where('active', '==', true), limit(6));
        const sSnapshot = await getDocs(sQuery);
        const fetchedS = sSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
        setServices(fetchedS);
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section id="hero" className="relative min-h-[90vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden py-20">
        <div className="absolute inset-0 z-0">
          <img
            src={settings.heroImage || "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2831&auto=format&fit=crop"}
            alt="Modern Interior"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            {settings.heroTitle || t('home.heroTitle')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto"
          >
            {settings.heroSubtitle || t('home.heroSubtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              {t('home.getQuote')} <ArrowRight size={20} />
            </Link>
            <Link
              to="/portfolio"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-full text-lg font-semibold transition-all flex items-center justify-center"
            >
              {t('home.viewWork')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('home.whyChoose')} {settings.siteName}?</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('home.whyChooseSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: t('home.feature.craftsmanship'),
                desc: t('home.feature.craftsmanship.desc'),
                icon: ShieldCheck,
              },
              {
                title: t('home.feature.materials'),
                desc: t('home.feature.materials.desc'),
                icon: CheckCircle,
              },
              {
                title: t('home.feature.delivery'),
                desc: t('home.feature.delivery.desc'),
                icon: Star,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow"
              >
                <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      {services.length > 0 && (
        <section id="services-overview" className="py-24 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('services.title')}</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('services.subtitle')}
                </p>
              </div>
              <Link
                to="/services"
                className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2 hover:gap-3 transition-all"
              >
                View All Services <ArrowRight size={20} />
              </Link>
            </div>

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
                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
                  >
                    <Link to={`/contact?service=${encodeURIComponent(service.title)}`} className="block h-full">
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={service.image || 'https://images.unsplash.com/photo-1581578731117-104f8a3d46a8?q=80&w=1000&auto=format&fit=crop'}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                          <IconComponent size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{service.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{service.description}</p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="py-24 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">{t('home.testimonials.title')}</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t('home.testimonials.subtitle')}
              </p>
            </div>

            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="break-inside-avoid bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 relative group hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors duration-300"
                >
                  <Quote className="absolute top-6 right-6 text-blue-200 dark:text-blue-800 opacity-20 group-hover:opacity-40 transition-opacity" size={40} />
                  
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className={`${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                    ))}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg leading-relaxed italic">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section id="cta" className="py-24 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{settings.ctaTitle || t('home.cta.title')}</h2>
          <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
            {settings.ctaSubtitle || t('home.cta.subtitle')}
          </p>
          <Link
            to="/contact"
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full text-lg font-bold transition-colors inline-flex items-center gap-2"
          >
            {t('home.cta.button')} <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
