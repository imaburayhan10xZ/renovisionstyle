import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Loader2, Upload } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
  active?: boolean;
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', icon: 'Hammer', image: '' });
  const { t } = useLanguage();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    if (!db) {
      setServices([]);
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
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, image: url }));
      toast.success('Image uploaded');
    } catch (error) {
      console.error('Upload failed', error);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
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
      setFormData({ title: '', description: '', icon: 'Hammer', image: '' });
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
      setFormData({ 
        title: service.title, 
        description: service.description, 
        icon: service.icon,
        image: service.image || ''
      });
    } else {
      setEditingService(null);
      setFormData({ title: '', description: '', icon: 'Hammer', image: '' });
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Image</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                  {formData.image ? (
                    <div className="relative">
                      <img src={formData.image} alt="Preview" className="h-32 w-full object-cover rounded" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded">
                        <span className="text-white font-medium">Click to change</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 py-4">
                      <Upload className="mx-auto mb-2" size={24} />
                      <span className="text-sm">Upload Service Image</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : (editingService ? t('admin.update') : t('admin.create'))}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
