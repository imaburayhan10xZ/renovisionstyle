import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, FileText, Image, MessageSquare, Calendar, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';
import { insertInitialData } from '@/lib/initialData';

export default function Dashboard() {
  const [stats, setStats] = useState({
    services: 0,
    projects: 0,
    posts: 0,
    leads: 0,
    bookings: 0
  });
  const { t } = useLanguage();

  useEffect(() => {
    const initializeAndFetch = async () => {
      if (!db) return;
      try {
        // Run initial data insertion once if empty
        await insertInitialData();

        const servicesCount = await getCountFromServer(collection(db, 'services'));
        const projectsCount = await getCountFromServer(collection(db, 'projects'));
        const postsCount = await getCountFromServer(collection(db, 'posts'));
        const leadsCount = await getCountFromServer(collection(db, 'leads'));
        const bookingsCount = await getCountFromServer(collection(db, 'bookings'));

        setStats({
          services: servicesCount.data().count,
          projects: projectsCount.data().count,
          posts: postsCount.data().count,
          leads: leadsCount.data().count,
          bookings: bookingsCount.data().count
        });
      } catch (error) {
        console.error("Error in dashboard:", error);
      }
    };

    initializeAndFetch();
  }, []);

  const data = [
    { name: 'Jan', leads: 4, projects: 2 },
    { name: 'Feb', leads: 3, projects: 1 },
    { name: 'Mar', leads: 2, projects: 3 },
    { name: 'Apr', leads: 7, projects: 4 },
    { name: 'May', leads: 5, projects: 2 },
    { name: 'Jun', leads: 8, projects: 5 },
  ];

  const statCards = [
    { label: t('admin.services'), value: stats.services, icon: FileText, color: 'bg-blue-500' },
    { label: t('admin.projects'), value: stats.projects, icon: Image, color: 'bg-purple-500' },
    { label: t('admin.blog'), value: stats.posts, icon: FileText, color: 'bg-green-500' },
    { label: t('admin.leads'), value: stats.leads, icon: MessageSquare, color: 'bg-orange-500' },
    { label: t('admin.bookings'), value: stats.bookings, icon: Calendar, color: 'bg-pink-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.dashboard')}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t('admin.welcome')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg text-white shadow-lg shadow-current/20`}>
                <stat.icon size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('admin.chart.leads')}</h2>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                  itemStyle={{ color: '#F3F4F6' }}
                />
                <Bar dataKey="leads" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('admin.chart.projects')}</h2>
            <TrendingUp className="text-purple-500" size={20} />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                  itemStyle={{ color: '#F3F4F6' }}
                />
                <Line type="monotone" dataKey="projects" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
