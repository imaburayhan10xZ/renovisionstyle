import { useAuth } from '@/context/AuthContext';
import { Shield, ExternalLink, User, AlertTriangle } from 'lucide-react';

export default function AdminAccount() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">View your admin account details</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold">
              {user?.email?.[0].toUpperCase() || 'A'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Administrator</h2>
              <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email Address</label>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <User size={18} className="text-gray-400" />
                  {user?.email}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">User ID</label>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-sm">
                  <Shield size={18} className="text-gray-400" />
                  {user?.uid}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 p-6 flex items-start gap-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400 shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">Account Management Restricted</h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              For security reasons, creating new admin accounts or deleting existing ones is restricted to the Firebase Console. 
              You cannot add or remove administrators directly from this panel.
            </p>
            <a 
              href="https://console.firebase.google.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Go to Firebase Console <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
