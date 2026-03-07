import React from 'react';
import { 
  Facebook, Twitter, Instagram, Linkedin, Youtube, Github, 
  MessageCircle, Send, Mail, Phone, Globe, Slack, Twitch,
  Dribbble, Figma, Trello, Chrome, Laptop, Smartphone, MapPin
} from 'lucide-react';

interface SocialIconProps {
  platform: string;
  size?: number;
  className?: string;
}

export default function SocialIcon({ platform, size = 20, className = "" }: SocialIconProps) {
  const p = platform.toLowerCase().trim();
  
  // Generic icons fallback using Lucide
  const genericMapping: Record<string, React.ElementType> = {
    'mail': Mail,
    'email': Mail,
    'phone': Phone,
    'call': Phone,
    'website': Globe,
    'web': Globe,
    'globe': Globe,
    'location': MapPin,
    'address': MapPin,
  };

  // Check if it's a generic icon first
  for (const [key, Icon] of Object.entries(genericMapping)) {
    if (p === key || p.includes(key)) {
      return <Icon size={size} className={className} />;
    }
  }

  // For brands, use Simple Icons CDN for original logos
  // More robust slugification for Simple Icons
  const slug = p
    .replace(/\+/g, 'plus')
    .replace(/\./g, 'dot')
    .replace(/&/g, 'and')
    .replace(/ /g, '')
    .replace(/[^a-z0-9]/g, '');

  // Special cases for Simple Icons slugs
  const specialSlugs: Record<string, string> = {
    'facebook': 'facebook',
    'twitter': 'x',
    'x': 'x',
    'x.com': 'x',
    'instagram': 'instagram',
    'linkedin': 'linkedin',
    'youtube': 'youtube',
    'whatsapp': 'whatsapp',
    'telegram': 'telegram',
    'tiktok': 'tiktok',
    'snapchat': 'snapchat',
    'pinterest': 'pinterest',
    'reddit': 'reddit',
    'discord': 'discord',
    'twitch': 'twitch',
    'github': 'github',
    'slack': 'slack',
    'figma': 'figma',
    'dribbble': 'dribbble',
    'behance': 'behance',
    'messenger': 'facebookmessenger',
  };

  const finalSlug = specialSlugs[p] || slug;
  const iconUrl = `https://cdn.simpleicons.org/${finalSlug}`;

  return (
    <img 
      src={iconUrl} 
      alt={platform}
      style={{ width: size, height: size }}
      className={`${className} object-contain transition-transform hover:scale-110`}
      referrerPolicy="no-referrer"
      onError={(e) => {
        // Fallback to a nice initials avatar if icon doesn't exist
        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${platform}&backgroundColor=3b82f6&fontFamily=Arial&fontSize=40`;
      }}
    />
  );
}
