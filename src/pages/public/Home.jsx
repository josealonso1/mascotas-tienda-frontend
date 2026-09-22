import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getArtworks } from '../../api/artworks';
import { getTestimonials } from '../../api/testimonials';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-cream py-20 md:py-28 px-4 text-center">
      <h1 className="font-display text-4xl md:text-6xl font-bold text-ink mb-6 max-w-3xl mx-auto">{t('home.heroTitle')}</h1>
      <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10">{t('home.heroSubtitle')}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link to="/contacto" className="px-8 py-3 bg-brand text-white font-medium rounded-full hover:bg-brand-dark transition">
          {t('home.heroCta')}
        </Link>
        <Link to="/galeria" className="px-8 py-3 border border-ink/20 text-ink font-medium rounded-full hover:border-brand hover:text-brand transition">
          {t('home.heroSecondaryCta')}
        </Link>
      </div>
    </section>
  );
};

const HighlightsCarousel = () => {
  const { t } = useTranslation();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      setError(null);

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
  }, [reloadCount]);

  if (loading) {
    return <p className="text-center py-10" aria-live="polite">{t('home.loading')}</p>;
  }

  if (error) {
    return (
      <section className="bg-cream px-4 py-16 text-center" aria-live="polite">
        <h2 className="font-display text-3xl font-bold text-ink mb-3">{t('home.highlightsTitle')}</h2>
        <p className="text-muted">{t('home.loadErrorDescription')}</p>
        <button type="button" onClick={() => setReloadCount((count) => count + 1)} className="mt-6 px-6 py-3 bg-brand text-white font-medium rounded-full hover:bg-brand-dark transition">
          {t('home.retry')}
        </button>
      </section>
    );
  }

  if (artworks.length === 0) return null;

  const displayArtworks = [...artworks, ...artworks, ...artworks, ...artworks];

  return (
    <section className="bg-cream py-16">
      <h2 className="font-display text-3xl font-bold text-center text-ink mb-10">{t('home.highlightsTitle')}</h2>
      <div className="overflow-hidden motion-reduce:overflow-x-auto">
        <div className="flex w-max animate-scroll hover:[animation-play-state:paused] motion-reduce:animate-none">
          {displayArtworks.map((artwork, index) => (
            <div key={`${artwork.id}-${index}`} className="shrink-0 w-80 mx-4">
              <img
                src={artwork.image_url}
                alt={artwork.title}
                className="w-full h-64 object-cover rounded-2xl shadow-sm"
              />
              <p className="mt-3 text-center font-medium text-ink">{artwork.title}</p>
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
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      setError(null);

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
  }, [reloadCount]);

  if (loading) {
    return <p className="text-center py-10" aria-live="polite">{t('home.loading')}</p>;
  }

  if (error) {
    return (
      <section className="bg-sand px-4 py-16 text-center" aria-live="polite">
        <h2 className="font-display text-3xl font-bold text-ink mb-3">{t('home.testimonialsTitle')}</h2>
        <p className="text-muted">{t('home.loadErrorDescription')}</p>
        <button type="button" onClick={() => setReloadCount((count) => count + 1)} className="mt-6 px-6 py-3 bg-brand text-white font-medium rounded-full hover:bg-brand-dark transition">
          {t('home.retry')}
        </button>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-sand py-16 px-4">
      <h2 className="font-display text-3xl font-bold text-center text-ink mb-10">{t('home.testimonialsTitle')}</h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white p-8 rounded-2xl shadow-sm">
            <span aria-hidden="true" className="font-display text-5xl leading-none text-brand">&ldquo;</span>
            <p className="font-display font-medium text-lg text-ink mb-4">{testimonial.content}</p>
            <p className="text-sm font-medium text-muted">— {testimonial.client_name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const SocialLinks = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-cream py-16 px-4 text-center">
      <h2 className="font-display text-3xl font-bold text-center text-ink mb-10">{t('home.socialTitle')}</h2>
      <div className="flex flex-wrap justify-center gap-4">
        <a
          href="https://tiktok.com/@placeholder"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 border border-ink/20 text-ink font-medium rounded-full hover:border-brand hover:text-brand transition"
        >
          {t('home.watchOnTikTok')}
        </a>
        <a
          href="https://twitch.tv/placeholder"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 border border-ink/20 text-ink font-medium rounded-full hover:border-brand hover:text-brand transition"
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
