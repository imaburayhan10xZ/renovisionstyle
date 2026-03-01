import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { Trash2, Loader2, Calendar, Check, X, Clock } from 'lucide-react';
import { Booking } from '@/types';
import { format } from 'date-fns';

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    if (!db) {
      setLoading(false);
      return;
    }
    try {
      const q = query(collection(db, 'bookings'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      setBookings(fetched);
    } catch (error) {
      console.error("Error fetching bookings: ", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Booking['status']) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'bookings', id));
      toast.success('Booking deleted');
      fetchBookings();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Bookings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase
                  ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                  ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                  ${booking.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
                `}>
                  {booking.status}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Calendar size={14} /> {format(new Date(booking.date), 'MMM d, yyyy')}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock size={14} /> {booking.time}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{booking.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{booking.email}</p>
              {booking.notes && (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic mt-2 bg-gray-50 dark:bg-gray-900 p-2 rounded">
                  "{booking.notes}"
                </p>
              )}
            </div>
            
            <div className="flex sm:flex-col gap-2 justify-center sm:justify-start">
              {booking.status === 'pending' && (
                <>
                  <button
                    onClick={() => updateStatus(booking.id, 'confirmed')}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Check size={16} /> Confirm
                  </button>
                  <button
                    onClick={() => updateStatus(booking.id, 'rejected')}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <X size={16} /> Reject
                  </button>
                </>
              )}
              <button
                onClick={() => handleDelete(booking.id)}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
            No bookings found.
          </div>
        )}
      </div>
    </div>
  );
}
