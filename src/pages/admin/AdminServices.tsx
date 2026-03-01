import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  active?: boolean;
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', icon: 'Hammer' });
  const { t } = useLanguage();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    if (!db) {
      setServices([
        { id: '1', title: 'Kitchen Remodeling', description: 'Complete kitchen overhaul.', icon: 'Hammer' },
        { id: '2', title: 'Bathroom Renovation', description: 'Modern bathroom designs.', icon: 'Droplets' },
      ]);
      setLoading(false);
      return;
    }

    try {
      const querySnapshot = await getDocs(collection(db, 'services'));
      const fetchedServices = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
      setServices(fetchedServices);
    } catch (error) {
      console.error("Error fetching services: ", error);
      // Fallback for demo
      setServices([
        { id: '1', title: 'Kitchen Remodeling', description: 'Complete kitchen overhaul.', icon: 'Hammer' },
        { id: '2', title: 'Bathroom Renovation', description: 'Modern bathroom designs.', icon: 'Droplets' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) {
      toast.error('Database not configured');
      return;
    }
    try {
      if (editingService) {
        await updateDoc(doc(db, 'services', editingService.id), formData);
        toast.success('Service updated');
      } else {
        await addDoc(collection(db, 'services'), {
          ...formData,
          active: true,
          createdAt: serverTimestamp()
        });
        toast.success('Service added');
      }
      setIsModalOpen(false);
      setEditingService(null);
      setFormData({ title: '', description: '', icon: 'Hammer' });
      fetchServices();
    } catch (error) {
      console.error(error);
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'services', id));
      toast.success('Service deleted');
      fetchServices();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const openModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({ title: service.title, description: service.description, icon: service.icon });
    } else {
      setEditingService(null);
      setFormData({ title: '', description: '', icon: 'Hammer' });
    }
    setIsModalOpen(true);
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.manage')} {t('admin.services')}</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> {t('admin.add')} {t('admin.services')}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{t('admin.title')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{t('admin.description')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white text-right">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{service.title}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{service.description}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => openModal(service)}
                    className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 p-1"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-red-600 hover:text-red-800 dark:hover:text-red-400 p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingService ? `${t('admin.edit')} ${t('admin.services')}` : `${t('admin.add')} ${t('admin.services')}`}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.title')}</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.description')}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={3}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                {editingService ? t('admin.update') : t('admin.create')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
