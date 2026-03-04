import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import ScrollToTop from '@/components/ScrollToTop';
import RootLayout from '@/layouts/RootLayout';
import AdminLayout from '@/layouts/AdminLayout';

// Public Pages
import Home from '@/pages/Home';
import Services from '@/pages/Services';
import Portfolio from '@/pages/Portfolio';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Blog from '@/pages/Blog';

// Admin Pages
import Login from '@/pages/admin/Login';
import Dashboard from '@/pages/admin/Dashboard';
import AdminServices from '@/pages/admin/AdminServices';
import AdminProjects from '@/pages/admin/AdminProjects';
import AdminBlog from '@/pages/admin/AdminBlog';
import AdminTestimonials from '@/pages/admin/AdminTestimonials';
import AdminFAQ from '@/pages/admin/AdminFAQ';
import AdminLeads from '@/pages/admin/AdminLeads';
import AdminBookings from '@/pages/admin/AdminBookings';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminAccount from '@/pages/admin/AdminAccount';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <LanguageProvider>
          <ThemeProvider>
            <Toaster position="top-right" />
            <Routes>
              {/* Public Routes */}
              <Route element={<RootLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/impowerfullboss/login" element={<Login />} />
              <Route path="/impowerfullboss" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="faq" element={<AdminFAQ />} />
                <Route path="leads" element={<AdminLeads />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="account" element={<AdminAccount />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="messages" element={<AdminLeads />} /> {/* Redirect messages to leads for now */}
              </Route>
            </Routes>
          </ThemeProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
