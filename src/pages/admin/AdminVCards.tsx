import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { VCardProfile } from '@/types';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Loader2, Link as LinkIcon } from 'lucide-react';

export default function AdminVCards() {
  const [vcards, setVcards] = useState<VCardProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    image: '',
    active: true
  });

  useEffect(() => {
    fetchVCards();
  }, []);

  const fetchVCards = async () => {
    if (!db) return;
    try {
      const snapshot = await getDocs(collection(db, 'vcards'));
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as VCardProfile[];
      setVcards(fetched);
    } catch (error) {
      console.error("Error fetching vcards:", error);
      toast.error("Failed to load vcards");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setIsSubmitting(true);

    try {
      if (editingId) {
        await updateDoc(doc(db, 'vcards', editingId), {
          ...formData
        });
        toast.success("vCard updated successfully");
      } else {
        await addDoc(collection(db, 'vcards'), {
          ...formData,
          createdAt: serverTimestamp()
        });
        toast.success("vCard created successfully");
      }
      setIsModalOpen(false);
      fetchVCards();
    } catch (error) {
      console.error("Error saving vcard:", error);
      toast.error("Failed to save vCard");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!db || !window.confirm("Are you sure you want to delete this vCard?")) return;
    try {
      await deleteDoc(doc(db, 'vcards', id));
      toast.success("vCard deleted successfully");
      fetchVCards();
    } catch (error) {
      console.error("Error deleting vcard:", error);
      toast.error("Failed to delete vCard");
    }
  };

  const openModal = (vcard?: VCardProfile) => {
    if (vcard) {
      setEditingId(vcard.id);
      setFormData({
        name: vcard.name,
        role: vcard.role,
        phone: vcard.phone,
        email: vcard.email,
        website: vcard.website,
        address: vcard.address,
        image: vcard.image || '',
        active: vcard.active
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        role: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        image: '',
        active: true
      });
    }
    setIsModalOpen(true);
  };

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/vcard/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage vCards</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Add vCard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vcards.map((vcard) => (
          <div key={vcard.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden shrink-0">
                {vcard.image ? (
                  <img src={vcard.image} alt={vcard.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-gray-400">{vcard.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{vcard.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{vcard.role}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <p><strong>Email:</strong> {vcard.email}</p>
              <p><strong>Phone:</strong> {vcard.phone}</p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => copyLink(vcard.id)}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
              >
                <LinkIcon size={16} /> Copy Link
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(vcard)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(vcard.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingId ? 'Edit vCard' : 'Add New vCard'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role / Title</label>
                  <input
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <input
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website URL</label>
                  <input
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="www.renovationexpert.my"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Image URL (Optional)</label>
                  <input
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Active (Visible to public)
                </label>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-70"
                >
                  {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                  {editingId ? 'Update vCard' : 'Create vCard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
