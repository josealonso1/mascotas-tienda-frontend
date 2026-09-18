import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/public/Home';
import Gallery from './pages/public/Gallery';
import Contact from './pages/public/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ArtworksManager from './pages/admin/ArtworksManager';
import TestimonialsManager from './pages/admin/TestimonialsManager';
import ContactRequestsManager from './pages/admin/ContactRequestsManager';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/galeria" element={<Gallery />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="*" element={<h1>Página no encontrada</h1>} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/artworks" element={<ArtworksManager />} />
          <Route path="/admin/testimonials" element={<TestimonialsManager />} />
          <Route path="/admin/contact-requests" element={<ContactRequestsManager />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
