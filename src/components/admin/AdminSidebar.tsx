import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Hammer, 
  Image, 
  FileText, 
  MessageSquare, 
  Settings, 
  Users, 
  User,
  HelpCircle, 
  Calendar, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import LanguageSwitcher from '../LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

export default function AdminSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const navItems = [
    { name: t('admin.dashboard'), path: '/impowerfullboss', icon: LayoutDashboard },
    { name: t('admin.services'), path: '/impowerfullboss/services', icon: Hammer },
    { name: t('admin.projects'), path: '/impowerfullboss/projects', icon: Image },
    { name: t('admin.blog'), path: '/impowerfullboss/blog', icon: FileText },
    { name: t('admin.testimonials'), path: '/impowerfullboss/testimonials', icon: Users },
    { name: t('admin.faq'), path: '/impowerfullboss/faq', icon: HelpCircle },
    { name: t('admin.messages'), path: '/impowerfullboss/leads', icon: Mail },
    { name: t('admin.bookings'), path: '/impowerfullboss/bookings', icon: Calendar },
    { name: t('admin.account'), path: '/impowerfullboss/account', icon: User },
    { name: t('admin.settings'), path: '/impowerfullboss/settings', icon: Settings },
  ];

  return (
    <aside 
      className={cn(
        "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 h-screen sticky top-0",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between h-16">
        {!collapsed && (
          <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
            {t('admin.panel')}
          </h1>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors",
              location.pathname === item.path
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
              collapsed && "justify-center"
            )}
            title={collapsed ? item.name : undefined}
          >
            <item.icon size={20} className="shrink-0" />
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
        <div className={cn("flex flex-col gap-2", collapsed && "items-center")}>
           {!collapsed && <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.language')}</p>}
           <LanguageSwitcher className={collapsed ? "w-10" : "w-full"} />
        </div>

        <button
          onClick={toggleTheme}
          className={cn(
            "flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg w-full transition-colors",
            collapsed && "justify-center"
          )}
          title={collapsed ? (theme === 'light' ? 'Dark Mode' : 'Light Mode') : undefined}
        >
          {theme === 'light' ? <Moon size={20} className="shrink-0" /> : <Sun size={20} className="shrink-0" />}
          {!collapsed && <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
        </button>

        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
            {user?.email?.[0].toUpperCase() || 'A'}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.email}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg w-full transition-colors",
            collapsed && "justify-center"
          )}
          title={collapsed ? t('nav.logout') : undefined}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span>{t('nav.logout')}</span>}
        </button>
      </div>
    </aside>
  );
}
