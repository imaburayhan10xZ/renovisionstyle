import { collection, addDoc, serverTimestamp, getDocs, query, limit, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

export const insertInitialData = async () => {
  if (!db) return;

  const services = [
    {
      title: 'Light & Fan Installation',
      description: 'Installation and repair of ceiling lights, LED lights, fans and switches. We ensure safe wiring and perfect mounting for a bright and comfortable home.',
      icon: 'Hammer',
      image: 'https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=1000&auto=format&fit=crop',
      active: true
    },
    {
      title: 'Door Lock Installation & Unlock Service',
      description: 'Door lock installation, replacement and emergency unlock service. Our experts handle all types of locks with precision and care for your security.',
      icon: 'Settings',
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1000&auto=format&fit=crop',
      active: true
    },
    {
      title: 'Room Painting Service',
      description: 'Interior room painting with clean finishing and quality materials. Transform your living space with vibrant colors and professional workmanship.',
      icon: 'Paintbrush',
      image: 'https://images.unsplash.com/photo-1562591176-3293d003a751?q=80&w=1000&auto=format&fit=crop',
      active: true
    },
    {
      title: 'Tile Fixing & Replacement',
      description: 'Broken tile repair, tile replacement and bathroom/kitchen tile installation service. We provide seamless finishes that look brand new.',
      icon: 'Hammer',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop',
      active: true
    },
    {
      title: 'Leak Detection & Waterproofing',
      description: 'Professional leak detection and waterproofing solutions for bathroom, roof and walls. Stop water damage before it becomes a major problem.',
      icon: 'Droplets',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1000&auto=format&fit=crop',
      active: true
    },
    {
      title: 'Toilet & Basin Repair',
      description: 'Repair toilet flushing issues, basin leaks, pipe blockage and replacement services. Quick and efficient solutions for your bathroom fixtures.',
      icon: 'Wrench',
      image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=1000&auto=format&fit=crop',
      active: true
    },
    {
      title: 'Plumbing & Pipe Repair',
      description: 'Fix leaking pipes, clogged drains and damaged plumbing systems quickly and efficiently. Our plumbers are available for all your repair needs.',
      icon: 'Wrench',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1000&auto=format&fit=crop',
      active: true
    },
    {
      title: 'Electrical Repair & Wiring',
      description: 'Expert electrical troubleshooting, wiring repair, socket replacement & light installation. Safe and reliable electrical services for your home.',
      icon: 'Settings',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop',
      active: true
    },
    {
      title: 'Water Heater Installation',
      description: 'Safe and secure water heater installation with proper wiring and plumbing connection. Enjoy hot water with peace of mind.',
      icon: 'Settings',
      image: 'https://images.unsplash.com/photo-1585136671314-718161c69b40?q=80&w=1000&auto=format&fit=crop',
      active: true
    },
    {
      title: 'Aircond Service & Installation',
      description: 'Professional aircond servicing, gas top-up, cleaning & new unit installation. Fast response & affordable pricing for your comfort.',
      icon: 'Settings',
      image: 'https://images.unsplash.com/photo-1631545866282-2f363fffe217?q=80&w=1000&auto=format&fit=crop',
      active: true
    }
  ];

  const projects = [
    {
      title: 'Modern Apartment Renovation',
      description: 'Complete interior renovation including painting, flooring, and electrical upgrades in a luxury apartment.',
      category: 'Residential',
      beforeImage: 'https://images.unsplash.com/photo-1581578731117-104f8a3d46a8?q=80&w=1000&auto=format&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1600585154340-be6199f7d009?q=80&w=1000&auto=format&fit=crop',
      active: true
    },
    {
      title: 'Office Plumbing Overhaul',
      description: 'Replaced aging pipe systems and installed new high-efficiency basins for a corporate office.',
      category: 'Commercial',
      beforeImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1000&auto=format&fit=crop',
      active: true
    }
  ];

  const posts = [
    {
      title: 'How to Maintain Your Home Electrical System',
      excerpt: 'Simple steps to ensure your home wiring stays safe and efficient throughout the year.',
      content: 'Electrical safety is paramount for every homeowner. Regularly check for flickering lights, warm sockets, and tripped breakers. Ensure that all appliances are plugged in correctly and that there are no exposed wires. If you notice any unusual smells or sounds coming from your electrical panel, contact a professional immediately...',
      category: 'Electrical',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop',
      author: 'Admin',
      active: true
    },
    {
      title: 'Signs You Need Professional Waterproofing',
      excerpt: 'Don\'t wait for a flood. Learn the early warning signs of water damage in your home.',
      content: 'Damp spots on walls, peeling paint, and musty odors are all signs that your waterproofing might be failing. Water leakage can cause significant structural damage over time and lead to mold growth, which is a health hazard. Professional waterproofing solutions protect your investment and ensure a dry, safe environment...',
      category: 'Waterproofing',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1000&auto=format&fit=crop',
      author: 'Admin',
      active: true
    },
    {
      title: 'The Benefits of Regular Aircond Servicing',
      excerpt: 'Improve air quality and reduce energy bills with routine air conditioner maintenance.',
      content: 'Regular aircond servicing is essential for maintaining peak performance and energy efficiency. A clean unit works less hard to cool your space, saving you money on electricity bills. It also ensures that the air you breathe is free from dust and allergens. We recommend servicing your unit every 6 months for optimal results...',
      category: 'Aircond',
      image: 'https://images.unsplash.com/photo-1631545866282-2f363fffe217?q=80&w=1000&auto=format&fit=crop',
      author: 'Admin',
      active: true
    },
    {
      title: 'Choosing the Right Paint for Your Interior',
      excerpt: 'A guide to selecting colors and finishes that transform your living space.',
      content: 'The right paint can make a world of difference in your home. Consider the mood you want to create in each room. Soft blues and greens are perfect for bedrooms, while vibrant yellows and oranges can energize a kitchen. Don\'t forget to choose the right finish—matte for low-traffic areas and semi-gloss for kitchens and bathrooms...',
      category: 'Painting',
      image: 'https://images.unsplash.com/photo-1562591176-3293d003a751?q=80&w=1000&auto=format&fit=crop',
      author: 'Admin',
      active: true
    }
  ];

  const testimonials = [
    {
      name: 'Tan Wei Ming',
      role: 'Condo Owner, Mont Kiara',
      content: 'I called them for an urgent aircond servicing as my unit was leaking. They arrived within 2 hours and fixed it perfectly. Very clean and professional work. Highly recommended!',
      rating: 5,
      approved: true,
      active: true
    },
    {
      name: 'Aishah binti Hassan',
      role: 'Housewife, Shah Alam',
      content: 'Sangat puas hati dengan servis baiki paip bocor di dapur saya. Pekerjanya sangat sopan dan harganya juga sangat berpatutan. Terima kasih!',
      rating: 5,
      approved: true,
      active: true
    },
    {
      name: 'Jason Low',
      role: 'Cafe Owner, Bangsar',
      content: 'We needed custom track lighting installed for our new cafe. The team did a fantastic job with the wiring and placement. It looks exactly how we envisioned it.',
      rating: 5,
      approved: true,
      active: true
    },
    {
      name: 'Nisha Raj',
      role: 'Apartment Resident, PJ',
      content: 'Locked myself out of my apartment late at night. The emergency unlock service was a lifesaver! They were professional and didn\'t damage the door at all.',
      rating: 5,
      approved: true,
      active: true
    },
    {
      name: 'Mohd Faizal',
      role: 'Real Estate Agent',
      content: 'I always recommend this team to my clients for touch-up painting and minor repairs before selling their properties. They are reliable and deliver high-quality results every time.',
      rating: 5,
      approved: true,
      active: true
    },
    {
      name: 'Chong Siew Lan',
      role: 'Homeowner, Cheras',
      content: 'The tile fixing in my bathroom was done very neatly. You can\'t even tell where the old tiles were replaced. Very impressed with the craftsmanship.',
      rating: 5,
      approved: true,
      active: true
    },
    {
      name: 'Arun Subramaniam',
      role: 'Office Manager',
      content: 'We had a persistent roof leak that other contractors couldn\'t fix. This team found the source immediately and applied a waterproofing solution that actually works.',
      rating: 5,
      approved: true,
      active: true
    },
    {
      name: 'Siti Aminah',
      role: 'Resident, Subang Jaya',
      content: 'Installed 3 ceiling fans and changed all the light switches in my house. The work was done quickly and they even cleaned up the dust afterwards. Very happy!',
      rating: 5,
      approved: true,
      active: true
    },
    {
      name: 'Kevin Tan',
      role: 'New Homeowner',
      content: 'Great service for water heater installation. They were very careful with the plumbing and electrical connections. Safe and professional work.',
      rating: 5,
      approved: true,
      active: true
    },
    {
      name: 'Nurul Izzah',
      role: 'Boutique Owner',
      content: 'The interior painting for my boutique was flawless. They helped me choose the right shades and the finishing is very smooth. My shop looks beautiful now.',
      rating: 5,
      approved: true,
      active: true
    },
    {
      name: 'Robert Smith',
      role: 'Expat, KLCC',
      content: 'Reliable handyman services are hard to find. These guys are my go-to for everything from fixing a leaky faucet to electrical troubleshooting. Honest and efficient.',
      rating: 5,
      approved: true,
      active: true
    },
    {
      name: 'Lee Kah Hoong',
      role: 'Restaurant Manager',
      content: 'Had a major pipe blockage during peak hours. They came out immediately and cleared it without disrupting our operations. Truly professional emergency service.',
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

  const collections = {
    services,
    projects,
    posts,
    testimonials,
    faqs
  };

  for (const [colName, data] of Object.entries(collections)) {
    const snapshot = await getDocs(collection(db, colName));
    const existingTitles = new Set(snapshot.docs.map(doc => {
      const d = doc.data();
      return d.title || d.name || d.question;
    }));

    for (const item of data) {
      const anyItem = item as any;
      const identifier = anyItem.title || anyItem.name || anyItem.question;
      
      // Find if exists
      const existingDoc = snapshot.docs.find(doc => {
        const d = doc.data();
        return (d.title || d.name || d.question) === identifier;
      });

      if (existingDoc) {
        // Update existing to ensure new images/descriptions are applied
        const { createdAt, ...updateData } = item as any;
        await updateDoc(doc(db, colName, existingDoc.id), updateData);
      } else {
        // Add new
        await addDoc(collection(db, colName), {
          ...item,
          createdAt: serverTimestamp()
        });
      }
    }
  }
};
