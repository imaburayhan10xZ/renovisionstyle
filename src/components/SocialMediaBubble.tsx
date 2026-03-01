import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, X, Facebook, Twitter, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export default function SocialMediaBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSiteSettings();

  // Filter out social links that are not set
  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: Facebook, 
      url: settings.socialFacebook, 
      color: 'bg-[#1877F2]',
      textColor: 'text-white'
    },
    { 
      name: 'Twitter', 
      icon: Twitter, 
      url: settings.socialTwitter, 
      color: 'bg-[#1DA1F2]',
      textColor: 'text-white'
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      url: settings.socialInstagram, 
      color: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]',
      textColor: 'text-white'
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      url: settings.socialLinkedin, 
      color: 'bg-[#0A66C2]',
      textColor: 'text-white'
    }
  ].filter(link => link.url);

  if (socialLinks.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && socialLinks.map((link, index) => (
          <motion.a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg hover:scale-110 transition-transform ${link.color} ${link.textColor}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={link.name}
          >
            <link.icon size={20} />
          </motion.a>
        ))}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
}
