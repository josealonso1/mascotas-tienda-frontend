import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getArtworks } from '../../api/artworks';
import { getTestimonials } from '../../api/testimonials';

const ArtworkModal = ({ artwork, testimonials, onClose }) => {
  const { t } = useTranslation();
  const artworkTestimonials = testimonials.filter(
    (testimonial) => testimonial.artwork_id === artwork.id
  );

  useEffect(() => {
    const savedOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = savedOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="artwork-modal-title"
        className="bg-cream rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start gap-4 mb-4">
            <h2 id="artwork-modal-title" className="font-display text-2xl md:text-3xl font-bold text-ink">{artwork.title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('gallery.close')}
              autoFocus
              className="shrink-0 w-10 h-10 rounded-full text-2xl leading-none text-muted hover:text-ink hover:bg-sand transition"
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
