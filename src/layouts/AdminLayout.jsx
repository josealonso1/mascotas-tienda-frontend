import { NavLink, Outlet } from 'react-router-dom';

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition ${
    isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
  }`;

const AdminNavbar = () => (
  <nav className="bg-white border-b border-gray-200">
    <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap gap-2">
      <NavLink to="/admin" end className={navLinkClass}>Dashboard</NavLink>
      <NavLink to="/admin/artworks" className={navLinkClass}>Artworks</NavLink>
      <NavLink to="/admin/testimonials" className={navLinkClass}>Testimonials</NavLink>
      <NavLink to="/admin/contact-requests" className={navLinkClass}>Solicitudes</NavLink>
    </div>
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
