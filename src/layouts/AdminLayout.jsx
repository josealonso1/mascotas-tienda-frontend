import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const AdminNavbar = () => (
  <nav>
    <Link to="/admin">Dashboard</Link>
    <Link to="/admin/artworks">Artworks</Link>
    <Link to="/admin/testimonials">Testimonials</Link>
    <Link to="/admin/contact-requests">Contact Requests</Link>
  </nav>
);

const AdminLayout = () => {
  return (
    <>
      <AdminNavbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;
