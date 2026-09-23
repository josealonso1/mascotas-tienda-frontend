import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const focusRingClasses = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand';

  const navLinkClasses = ({ isActive }) =>
  `pb-1 border-b-2 font-medium transition ${focusRingClasses} ${
    isActive
      ? 'text-brand border-brand'
      : 'text-ink hover:text-brand border-transparent'
  }`;

  return (
    <nav className="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b border-sand">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-x-5">
          <NavLink to="/" end className={navLinkClasses}>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/galeria" className={navLinkClasses}>
            {t('nav.gallery')}
          </NavLink>
        </div>
        <div className="ml-auto flex items-center gap-x-5">
          <NavLink to="/contacto" className={navLinkClasses}>
            {t('nav.contact')}
          </NavLink>
          <div className="flex rounded-full border border-sand overflow-hidden">
            <button
              type="button"
              onClick={() => i18n.changeLanguage('es')}
              aria-pressed={i18n.resolvedLanguage === 'es'}
              className={`px-3 py-1 text-sm font-medium transition focus-visible:relative focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                i18n.resolvedLanguage === 'es'
                  ? 'bg-brand text-white'
                  : 'text-muted hover:text-ink'
              }`}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => i18n.changeLanguage('en')}
              aria-pressed={i18n.resolvedLanguage === 'en'}
              className={`px-3 py-1 text-sm font-medium transition focus-visible:relative focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                i18n.resolvedLanguage === 'en'
                  ? 'bg-brand text-white'
                  : 'text-muted hover:text-ink'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-sand border-t border-sand">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-muted">
        {t('footer.copyright')}
      </div>
    </footer>
  );
};

const PublicLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-50 rounded-lg bg-ink px-4 py-3 font-medium text-white shadow-lg focus:not-sr-only focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {t('nav.skipToContent')}
      </a>
      <Navbar />
      <main id="main-content" className="flex-1 scroll-mt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
