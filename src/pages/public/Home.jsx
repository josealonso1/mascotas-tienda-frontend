import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t('pages.home')}</h1>
      <section id="contacto">
        <h2>{t('pages.homeContactTitle')}</h2>
      </section>
    </>
  );
};

export default Home;
