import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const Navbar = () => (
  <nav>
    <Link to="/">Home</Link>
    <Link to="/galeria">Galería</Link>
    <a href="#contacto">Contacto</a>
  </nav>
);

const Footer = () => (
  <footer>
    <p>© 2026 Mascotas Tienda - Arte de Mascotas</p>
  </footer>
);

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
