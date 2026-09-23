import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getArtworks } from '../../api/artworks';
import { submitTestimonial } from '../../api/testimonials';

const TestimonialSubmission = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [artworks, setArtworks] = useState([]);
  const [formData, setFormData] = useState({
    client_name: '',
    content: '',
    artwork_id: searchParams.get('artwork') || '',
    honeypot: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getArtworks().then(setArtworks).catch(() => setArtworks([]));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await submitTestimonial({
        ...formData,
        artwork_id: formData.artwork_id === '' ? null : Number(formData.artwork_id),
      });
      setIsSubmitted(true);
    } catch (requestError) {
      setError(t('testimonialForm.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-4xl font-bold text-ink">{t('testimonialForm.successTitle')}</h1>
        <p className="mt-4 text-muted">{t('testimonialForm.successDescription')}</p>
        <Link to="/" className="mt-8 inline-flex rounded-full bg-brand px-6 py-3 font-medium text-white transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
          {t('testimonialForm.backHome')}
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 md:py-20">
      <h1 className="font-display text-4xl font-bold text-ink">{t('testimonialForm.title')}</h1>
      <p className="mt-3 text-muted">{t('testimonialForm.description')}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-2xl bg-white p-6 shadow-sm md:p-8">
        {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}

        <div>
          <label htmlFor="testimonial-name" className="mb-2 block text-sm font-medium text-ink">{t('testimonialForm.nameLabel')}</label>
          <input
            id="testimonial-name"
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            className="w-full rounded-lg border border-ink/20 px-4 py-3 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>

        <div>
          <label htmlFor="testimonial-artwork" className="mb-2 block text-sm font-medium text-ink">{t('testimonialForm.artworkLabel')}</label>
          <select
            id="testimonial-artwork"
            name="artwork_id"
            value={formData.artwork_id}
            onChange={handleChange}
            className="w-full rounded-lg border border-ink/20 bg-white px-4 py-3 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            <option value="">{t('testimonialForm.artworkPlaceholder')}</option>
            {artworks.map((artwork) => <option key={artwork.id} value={artwork.id}>{artwork.title}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="testimonial-content" className="mb-2 block text-sm font-medium text-ink">{t('testimonialForm.contentLabel')}</label>
          <textarea
            id="testimonial-content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            minLength={10}
            maxLength={1000}
            rows={6}
            className="w-full resize-y rounded-lg border border-ink/20 px-4 py-3 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>

        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="testimonial-website">Website</label>
          <input id="testimonial-website" name="honeypot" value={formData.honeypot} onChange={handleChange} tabIndex="-1" autoComplete="off" />
        </div>

        <button type="submit" disabled={isSubmitting} className="rounded-full bg-brand px-6 py-3 font-medium text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
          {isSubmitting ? `${t('testimonialForm.submit')}…` : t('testimonialForm.submit')}
        </button>
      </form>
    </section>
  );
};

export default TestimonialSubmission;
