import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { Trash2, Loader2, Mail, Phone, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Lead } from '@/types';
import { format } from 'date-fns';

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    if (!db) {
      setLoading(false);
      return;
    }
    try {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lead[];
      setLeads(fetched);
    } catch (error) {
      console.error("Error fetching leads: ", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Lead['status']) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'leads', id), { status });
      toast.success('Status updated');
      fetchLeads();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'leads', id));
      toast.success('Lead deleted');
      fetchLeads();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Contact</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Service</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No leads found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {lead.createdAt?.seconds ? format(new Date(lead.createdAt.seconds * 1000), 'MMM d, yyyy') : '-'}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{lead.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1"><Mail size={12} /> {lead.email}</span>
                        <span className="flex items-center gap-1"><Phone size={12} /> {lead.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{lead.service}</td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value as Lead['status'])}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-none outline-none cursor-pointer
                          ${lead.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                          ${lead.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : ''}
                          ${lead.status === 'closed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : ''}
                        `}
                      >
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="text-red-600 hover:text-red-800 dark:hover:text-red-400 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
