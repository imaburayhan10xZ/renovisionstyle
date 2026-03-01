export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  active: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: any;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  gallery: string[];
  cost?: string;
  duration?: string;
  location?: string;
  featured: boolean;
  description: string;
  createdAt: any;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  status: 'draft' | 'published';
  metaTitle?: string;
  metaDescription?: string;
  author: string;
  publishedAt?: any;
  createdAt: any;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
  approved: boolean;
  createdAt: any;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  createdAt: any;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: 'new' | 'in-progress' | 'closed';
  createdAt: any;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  date: string; // ISO string
  time: string;
  status: 'pending' | 'confirmed' | 'rejected';
  notes?: string;
  createdAt: any;
}

export interface SiteSettings {
  siteName: string;
  logo?: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialFacebook?: string;
  socialTwitter?: string;
  socialInstagram?: string;
  socialLinkedin?: string;
  themeColor: string;
  
  // Home Page
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  ctaTitle?: string;
  ctaSubtitle?: string;
  
  // About Page
  aboutTitle?: string;
  aboutDescription?: string;
  statYears?: string;
  statProjects?: string;
  statTeam?: string;
  statSatisfaction?: string;
  storyTitle?: string;
  storyContent?: string;
  storyImage?: string;
  
  // Footer
  footerDescription?: string;
  footerCopyright?: string;
}
