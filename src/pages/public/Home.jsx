import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getArtworks } from '../../api/artworks';
import { getTestimonials } from '../../api/testimonials';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 text-center">
      <h1 className="text-5xl font-bold mb-4">{t('home.heroTitle')}</h1>
      <p className="text-xl text-gray-600">{t('home.heroSubtitle')}</p>
    </section>
  );
};

const HighlightsCarousel = () => {
  const { t } = useTranslation();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const data = await getArtworks();
        const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setArtworks(sorted.slice(0, 6));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  if (loading) {
    return <p className="text-center py-10">{t('home.loading')}</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-500">{t('home.error')}</p>;
  }

  const displayArtworks = [...artworks, ...artworks];

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-8">{t('home.highlightsTitle')}</h2>
      <div className="overflow-hidden">
        <div className="flex animate-scroll">
          {displayArtworks.map((artwork, index) => (
            <div key={`${artwork.id}-${index}`} className="flex-shrink-0 w-80 mx-4">
              <img
                src={artwork.image_url}
                alt={artwork.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <p className="mt-2 text-center font-medium">{artwork.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getTestimonials();
        setTestimonials(data.slice(0, 4));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return <p className="text-center py-10">{t('home.loading')}</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-500">{t('home.error')}</p>;
  }

  return (
    <section className="py-16 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-8">{t('home.testimonialsTitle')}</h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
            <p className="font-semibold text-gray-900">- {testimonial.client_name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const SocialLinks = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 text-center">
      <h2 className="text-3xl font-bold mb-8">{t('home.socialTitle')}</h2>
      <div className="flex justify-center gap-6">
        <a
          href="https://tiktok.com/@placeholder"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          {t('home.watchOnTikTok')}
        </a>
        <a
          href="https://twitch.tv/placeholder"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          {t('home.watchOnTwitch')}
        </a>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <>
      <Hero />
      <HighlightsCarousel />
      <Testimonials />
      <SocialLinks />
    </>
  );
};

export default Home;
