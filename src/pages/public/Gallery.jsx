import { useTranslation } from 'react-i18next';

const Gallery = () => {
  const { t } = useTranslation();
  return <h1>{t('pages.gallery')}</h1>;
};

export default Gallery;
