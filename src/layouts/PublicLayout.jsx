import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t, i18n } = useTranslation();

  return (
    <nav>
      <Link to="/">{t('nav.home')}</Link>
      <Link to="/galeria">{t('nav.gallery')}</Link>
      <Link to="/contacto">{t('nav.contact')}</Link>
      <button onClick={() => i18n.changeLanguage('es')}>ES</button>
      <button onClick={() => i18n.changeLanguage('en')}>EN</button>
    </nav>
  );
};

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer>
      <p>{t('footer.copyright')}</p>
    </footer>
  );
};

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
