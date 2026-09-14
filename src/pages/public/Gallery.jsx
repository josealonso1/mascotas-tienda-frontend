import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getArtworks } from '../../api/artworks';
import { getTestimonials } from '../../api/testimonials';

const ArtworkModal = ({ artwork, testimonials, onClose }) => {
  const { t } = useTranslation();
  const artworkTestimonials = testimonials.filter(
    (testimonial) => testimonial.artwork_id === artwork.id
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{artwork.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <img
            src={artwork.image_url}
            alt={artwork.title}
            className="w-full h-auto rounded-lg mb-4"
          />
          {artwork.description && (
            <p className="text-gray-700 mb-6">{artwork.description}</p>
          )}
          {artworkTestimonials.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">{t('gallery.testimonialsTitle')}</h3>
              <div className="space-y-4">
                {artworkTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-2">"{testimonial.content}"</p>
                    <p className="font-semibold text-gray-900">- {testimonial.client_name}</p>
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
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center mb-8">{t('pages.gallery')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-7xl mx-auto">
        {artworks.map((artwork) => (
          <div
            key={artwork.id}
            className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition"
            onClick={() => setSelectedArtwork(artwork)}
          >
            <img
              src={artwork.image_url}
              alt={artwork.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{artwork.title}</h3>
            </div>
          </div>
        ))}
      </div>
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
