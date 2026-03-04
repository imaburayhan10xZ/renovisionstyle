import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Loader2, Check, XCircle } from 'lucide-react';
import { Testimonial } from '@/types';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '',
    role: '',
    content: '',
    rating: 5,
    approved: true,
    active: true
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    if (!db) {
      setLoading(false);
      return;
    }
    try {
      const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Testimonial[];
      setTestimonials(fetched);
    } catch (error) {
      console.error("Error fetching testimonials: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    try {
      const data = { 
        ...formData, 
        updatedAt: serverTimestamp(),
        active: formData.active ?? true 
      };
      
      if (editingId) {
        await updateDoc(doc(db, 'testimonials', editingId), data);
        toast.success('Testimonial updated successfully');
      } else {
        await addDoc(collection(db, 'testimonials'), {
          ...data,
          createdAt: serverTimestamp()
        });
        toast.success('Testimonial added successfully');
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ name: '', role: '', content: '', rating: 5, approved: true, active: true });
      fetchTestimonials();
    } catch (error) {
      console.error("Error saving testimonial:", error);
      toast.error('Failed to save testimonial');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      toast.success('Testimonial deleted');
      fetchTestimonials();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const toggleStatus = async (testimonial: Testimonial, field: 'approved' | 'active') => {
    if (!db) return;
    try {
      const newValue = !((testimonial as any)[field]);
      await updateDoc(doc(db, 'testimonials', testimonial.id), {
        [field]: newValue,
        updatedAt: serverTimestamp()
      });
      toast.success(`Testimonial ${field} status updated`);
      fetchTestimonials();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const openModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingId(testimonial.id);
      setFormData({
        name: testimonial.name,
        role: testimonial.role,
        content: testimonial.content,
        rating: testimonial.rating,
        approved: testimonial.approved,
        active: testimonial.active ?? true
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', role: '', content: '', rating: 5, approved: true, active: true });
    }
    setIsModalOpen(true);
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Testimonials</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => toggleStatus(testimonial, 'approved')}
                className={`p-1.5 rounded-full ${testimonial.approved ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'}`}
                title={testimonial.approved ? "Approved" : "Hidden"}
              >
                {testimonial.approved ? <Check size={16} /> : <XCircle size={16} />}
              </button>
              <button
                onClick={() => openModal(testimonial)}
                className="p-1.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(testimonial.id)}
                className="p-1.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-lg ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>★</span>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic mb-4">"{testimonial.content}"</p>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Name</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role / Project</label>
                <input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Homeowner"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Review</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={4}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="approved"
                  checked={formData.approved}
                  onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="approved" className="text-sm font-medium text-gray-700 dark:text-gray-300">Approved (Visible on site)</label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                {editingId ? 'Update Testimonial' : 'Add Testimonial'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
