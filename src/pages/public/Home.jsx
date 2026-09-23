import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getArtworks } from '../../api/artworks';
import { getTestimonials } from '../../api/testimonials';
import heroPetIllustration from '../../assets/hero-pet-illustration.svg';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-cream px-4 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
        <div className="order-2 text-center md:order-1 md:text-left">
          <h1 className="font-display text-balance text-4xl font-bold text-ink md:text-6xl">{t('home.heroTitle')}</h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted md:mx-0 md:text-xl">{t('home.heroSubtitle')}</p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row md:items-start">
            <Link to="/contacto" className="px-8 py-3 bg-brand text-white font-medium rounded-full hover:bg-brand-dark transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
              {t('home.heroCta')}
            </Link>
            <Link to="/galeria" className="px-8 py-3 border border-ink/20 text-ink font-medium rounded-full hover:border-brand hover:text-brand transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
              {t('home.heroSecondaryCta')}
            </Link>
          </div>
        </div>
        <div className="order-1 mx-auto w-full max-w-md md:order-2">
          <img
            src={heroPetIllustration}
            alt=""
            aria-hidden="true"
            width="600"
            height="600"
            className="w-full drop-shadow-xl"
          />
        </div>
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
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    carouselRef.current?.scrollBy({
      left: direction * 360,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

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

  return (
    <section className="bg-cream py-16">
      <div className="mx-auto mb-10 flex max-w-6xl items-center justify-between gap-4 px-4">
        <h2 className="font-display text-3xl font-bold text-ink">{t('home.highlightsTitle')}</h2>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => scrollCarousel(-1)}
            aria-label={t('home.previousWorks')}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-xl text-ink hover:border-brand hover:text-brand transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            onClick={() => scrollCarousel(1)}
            aria-label={t('home.nextWorks')}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-xl text-ink hover:border-brand hover:text-brand transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <div
        ref={carouselRef}
        role="region"
        aria-label={t('home.worksCarousel')}
        tabIndex="0"
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 scroll-smooth focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      >
        {artworks.map((artwork) => (
          <div key={artwork.id} className="w-[min(86vw,26rem)] shrink-0 snap-start">
              <img
                src={artwork.image_url}
                alt={artwork.title}
                width="320"
                height="256"
                loading="lazy"
                className="h-74 w-full rounded-2xl object-cover shadow-sm"
              />
              <p className="mt-3 text-center font-medium text-ink">{artwork.title}</p>
          </div>
        ))}
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
