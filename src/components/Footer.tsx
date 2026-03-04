import { Link } from 'react-router-dom';
import { Hammer, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { settings } = useSiteSettings();
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              {settings.logo ? (
                <img src={settings.logo} alt={settings.siteName} className="h-8 w-auto object-contain brightness-0 invert" />
              ) : (
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <Hammer className="h-6 w-6 text-white" />
                </div>
              )}
              <span className="text-xl font-bold text-white">
                {settings.siteName || t('app.name')}
              </span>
            </Link>
            <p className="text-sm text-gray-400">
              {settings.footerDescription || t('app.description')}
            </p>
            <div className="flex space-x-4">
              {settings.socialFacebook && <a href={settings.socialFacebook} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><Facebook size={20} /></a>}
              {settings.socialTwitter && <a href={settings.socialTwitter} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><Twitter size={20} /></a>}
              {settings.socialInstagram && <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><Instagram size={20} /></a>}
              {settings.socialLinkedin && <a href={settings.socialLinkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><Linkedin size={20} /></a>}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="hover:text-blue-500 transition-colors">{t('nav.services')}</Link></li>
              <li><Link to="/portfolio" className="hover:text-blue-500 transition-colors">{t('nav.portfolio')}</Link></li>
              <li><Link to="/about" className="hover:text-blue-500 transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/blog" className="hover:text-blue-500 transition-colors">{t('nav.blog')}</Link></li>
              <li><Link to="/faq" className="hover:text-blue-500 transition-colors">{t('admin.faq')}</Link></li>
              <li><Link to="/contact" className="hover:text-blue-500 transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.services')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="hover:text-blue-500 transition-colors">{t('service.kitchen')}</Link></li>
              <li><Link to="/services" className="hover:text-blue-500 transition-colors">{t('service.bathroom')}</Link></li>
              <li><Link to="/services" className="hover:text-blue-500 transition-colors">{t('service.repair')}</Link></li>
              <li><Link to="/services" className="hover:text-blue-500 transition-colors">{t('service.painting')}</Link></li>
              <li><Link to="/services" className="hover:text-blue-500 transition-colors">{t('service.flooring')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-500 mt-0.5" />
                <span>{settings.contactAddress || "123 Renovation Lane, Builder City, BC 12345"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-500" />
                <span>{settings.contactPhone || "+1 (555) 123-4567"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-500" />
                <span>{settings.contactEmail || "hello@renovatepro.com"}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            {settings.footerCopyright ? (
              settings.footerCopyright
            ) : (
              <>&copy; {new Date().getFullYear()} {settings.siteName || t('app.name')}. {t('footer.rights')}</>
            )}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{t('footer.language')}:</span>
            <LanguageSwitcher className="bottom-full mb-2" />
          </div>
        </div>
      </div>
    </footer>
  );
}
