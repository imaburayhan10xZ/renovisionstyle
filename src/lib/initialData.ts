import { collection, addDoc, serverTimestamp, getDocs, query, limit } from 'firebase/firestore';
import { db } from './firebase';

export const insertInitialData = async () => {
  if (!db) return;

  // Check if already initialized
  const q = query(collection(db, 'services'), limit(1));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) return;

  const services = [
    {
      title: 'Light & Fan Installation',
      description: 'Installation and repair of ceiling lights, LED lights, fans and switches.',
      icon: 'Hammer',
      image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?q=80&w=1000&auto=format&fit=crop',
      active: true
    },
    {
      title: 'Door Lock Installation & Unlock Service',
      description: 'Door lock installation, replacement and emergency unlock service.',
      icon: 'Settings',
      image: 'https://images.unsplash.com/photo-1510797215324-95aa89f29732?q=80&w=1000&auto=format&fit=crop',
      active: true
    },
    {
      title: 'Room Painting Service',
      description: 'Interior room painting with clean finishing and quality materials.',
      icon: 'Paintbrush',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
      active: true
    },
    {
      title: 'Tile Fixing & Replacement',
      description: 'Broken tile repair, tile replacement and bathroom/kitchen tile installation service.',
      icon: 'Hammer',
      image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=1000&auto=format&fit=crop',
      active: true
    },
    {
      title: 'Leak Detection & Waterproofing',
      description: 'Professional leak detection and waterproofing solutions for bathroom, roof and walls.',
      icon: 'Droplets',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1000&auto=format&fit=crop',
      active: true
    },
    {
      title: 'Toilet & Basin Repair',
      description: 'Repair toilet flushing issues, basin leaks, pipe blockage and replacement services.',
      icon: 'Wrench',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop',
      active: true
    },
    {
      title: 'Plumbing & Pipe Repair',
      description: 'Fix leaking pipes, clogged drains and damaged plumbing systems quickly and efficiently.',
      icon: 'Wrench',
      image: 'https://images.unsplash.com/photo-1542013936693-884638332954?q=80&w=1000&auto=format&fit=crop',
      active: true
    },
    {
      title: 'Electrical Repair & Wiring',
      description: 'Expert electrical troubleshooting, wiring repair, socket replacement & light installation.',
      icon: 'Settings',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop',
      active: true
    },
    {
      title: 'Water Heater Installation',
      description: 'Safe and secure water heater installation with proper wiring and plumbing connection.',
      icon: 'Settings',
      image: 'https://images.unsplash.com/photo-1585136671314-718161c69b40?q=80&w=1000&auto=format&fit=crop',
      active: true
    },
    {
      title: 'Aircond Service & Installation',
      description: 'Professional aircond servicing, gas top-up, cleaning & new unit installation. Fast response & affordable pricing.',
      icon: 'Settings',
      image: 'https://images.unsplash.com/photo-1631545866282-2f363fffe217?q=80&w=1000&auto=format&fit=crop',
      active: true
    }
  ];

  const projects = [
    {
      title: 'Modern Apartment Renovation',
      description: 'Complete interior renovation including painting, flooring, and electrical upgrades.',
      category: 'Residential',
      beforeImage: 'https://images.unsplash.com/photo-1581578731117-104f8a3d46a8?q=80&w=1000&auto=format&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1600585154340-be6199f7d009?q=80&w=1000&auto=format&fit=crop',
      active: true
    },
    {
      title: 'Office Plumbing Overhaul',
      description: 'Replaced aging pipe systems and installed new high-efficiency basins.',
      category: 'Commercial',
      beforeImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1000&auto=format&fit=crop',
      active: true
    }
  ];

  const posts = [
    {
      title: 'How to Maintain Your Home Electrical System',
      excerpt: 'Simple steps to ensure your home wiring stays safe and efficient.',
      content: 'Electrical safety is paramount. Regularly check for flickering lights, warm sockets, and tripped breakers...',
      category: 'Electrical',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop',
      author: 'Admin',
      active: true
    },
    {
      title: 'Signs You Need Professional Waterproofing',
      excerpt: 'Don\'t wait for a flood. Learn the early warning signs of water damage.',
      content: 'Damp spots on walls, peeling paint, and musty odors are all signs that your waterproofing might be failing...',
      category: 'Waterproofing',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1000&auto=format&fit=crop',
      author: 'Admin',
      active: true
    }
  ];

  const testimonials = [
    {
      name: 'Rahim Ahmed',
      role: 'Homeowner',
      content: 'The aircond service was excellent. They arrived on time and fixed the cooling issue immediately.',
      rating: 5,
      approved: true,
      active: true
    },
    {
      name: 'Lina Tan',
      role: 'Property Manager',
      content: 'Very professional plumbing and electrical work. Highly recommended for any home repairs.',
      rating: 5,
      approved: true,
      active: true
    }
  ];

  const faqs = [
    {
      question: 'How quickly can you respond to an emergency?',
      answer: 'We typically respond within 1-2 hours for emergency plumbing or electrical issues.',
      active: true
    },
    {
      question: 'Do you provide a warranty for your services?',
      answer: 'Yes, we provide a satisfaction guarantee and warranty on all our installation and repair works.',
      active: true
    }
  ];

  // Insert all
  const collections = {
    services,
    projects,
    posts,
    testimonials,
    faqs
  };

  for (const [colName, data] of Object.entries(collections)) {
    for (const item of data) {
      await addDoc(collection(db, colName), {
        ...item,
        createdAt: serverTimestamp()
      });
    }
  }
};
