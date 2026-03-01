import { motion } from 'framer-motion';
import { Users, Award, Clock, Shield } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useLanguage } from '@/context/LanguageContext';

export default function About() {
  const { settings } = useSiteSettings();
  const { t } = useLanguage();

  return (
    <div className="pt-16 pb-24 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">{settings.aboutTitle || t('about.title')}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {settings.aboutDescription || t('about.subtitle')}
          </p>
        </div>
      </div>

      {/* Stats/Values */}
      <div className="bg-white dark:bg-gray-800 py-16 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { label: t('about.stats.years'), value: settings.statYears || '15+', icon: Clock },
              { label: t('about.stats.projects'), value: settings.statProjects || '500+', icon: Award },
              { label: t('about.stats.team'), value: settings.statTeam || '40+', icon: Users },
              { label: t('about.stats.satisfaction'), value: settings.statSatisfaction || '99%', icon: Shield },
            ].map((stat, index) => (
              <div key={index} className="p-6">
                <div className="flex justify-center mb-4 text-blue-600">
                  <stat.icon size={32} />
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img
              src={settings.storyImage || "https://images.unsplash.com/photo-1581578731117-104f8a3d46a8?q=80&w=1000&auto=format&fit=crop"}
              alt="Our Team"
              className="rounded-2xl shadow-xl w-full object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{settings.storyTitle || t('about.story.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg leading-relaxed whitespace-pre-line">
              {settings.storyContent || t('about.story.content')}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
