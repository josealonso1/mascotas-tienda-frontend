import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getArtworks } from '../../api/artworks';
import { getTestimonials } from '../../api/testimonials';

const ArtworkModal = ({ artwork, testimonials, onClose }) => {
  const { t } = useTranslation();
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const artworkTestimonials = testimonials.filter(
    (testimonial) => testimonial.artwork_id === artwork.id
  );

  useEffect(() => {
    const savedOverflow = document.body.style.overflow;
    const previouslyFocusedElement = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = savedOverflow;
      previouslyFocusedElement?.focus();
    };
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableElements = dialogRef.current?.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements.length - 1];

    if (!firstElement || !lastElement) return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm">
      <button
        type="button"
        onClick={onClose}
        aria-label={t('gallery.closeDialog')}
        className="absolute inset-0 cursor-default"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="artwork-modal-title"
        onKeyDown={handleKeyDown}
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-2xl bg-cream shadow-xl"
      >
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start gap-4 mb-4">
            <h2 id="artwork-modal-title" className="font-display text-2xl md:text-3xl font-bold text-ink">{artwork.title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('gallery.close')}
              ref={closeButtonRef}
              className="h-10 w-10 shrink-0 rounded-full text-2xl leading-none text-muted hover:bg-sand hover:text-ink transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              ×
            </button>
          </div>
          <img
            src={artwork.image_url}
            alt={artwork.title}
            className="w-full max-h-[65vh] object-contain rounded-xl bg-sand mb-6"
          />
          {artwork.description && (
            <p className="text-muted leading-relaxed mb-8">{artwork.description}</p>
          )}
          {artworkTestimonials.length > 0 && (
            <div>
              <h3 className="font-display text-xl font-bold text-ink mb-4">{t('gallery.testimonialsTitle')}</h3>
              <div className="space-y-4">
                {artworkTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="border-l-2 border-brand pl-4">
                    <p className="font-display text-ink mb-1">{testimonial.content}</p>
                    <p className="text-sm text-muted">— {testimonial.client_name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Link
            to={`/testimonio?artwork=${artwork.id}`}
            className="mt-8 inline-flex rounded-full border border-brand px-5 py-2.5 font-medium text-brand transition hover:bg-brand hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            {t('gallery.shareTestimonial')}
          </Link>
        </div>
      </div>
    </div>
  );
};

const Gallery = () => {
  const { t } = useTranslation();
  const [artworks, setArtworks] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artworksData, testimonialsData] = await Promise.all([
          getArtworks(),
          getTestimonials(),
        ]);
        const sortedArtworks = artworksData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setArtworks(sortedArtworks);
        setTestimonials(testimonialsData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center py-10">{t('gallery.loading')}</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-500">{t('gallery.error')}</p>;
  }

  return (
    <div className="py-12 px-4">
      <h1 className="font-display text-4xl md:text-5xl font-bold text-center text-ink mb-10">{t('pages.gallery')}</h1>
      {artworks.length === 0 ? (
        <p className="text-center text-muted py-10">{t('gallery.empty')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {artworks.map((artwork) => (
            <button
              type="button"
              key={artwork.id}
              onClick={() => setSelectedArtwork(artwork)}
              className="group text-left rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-sand shadow-sm group-hover:shadow-md transition">
                <img
                  src={artwork.image_url}
                  alt={artwork.title}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <h3 className="mt-3 font-display text-lg font-medium text-ink group-hover:text-brand transition">{artwork.title}</h3>
            </button>
          ))}
        </div>
      )}
      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          testimonials={testimonials}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </div>
  );
};

export default Gallery;
