import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { createContactRequest, uploadPetImage } from '../../api/contactRequests';
import { getCountryOptions } from '../../utils/countries';
import { sanitizeWhatsapp, isValidWhatsapp } from '../../utils/phone';
import { getImageError } from '../../utils/image';

const labelClasses = 'block text-sm font-medium text-ink mb-2';
const getInputClasses = (hasError = false) => 'w-full px-4 py-3 bg-white border rounded-xl text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 transition ' + (hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-ink/20 focus:border-brand focus:ring-brand/30');

const IMAGE_ERROR_KEYS = {
  type: 'contact.imageTypeError',
  size: 'contact.imageSizeError',
  pixels: 'contact.imagePixelsError',
};

const Contact = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    client_name: '',
    email: '',
    whatsapp: '',
    country: '',
    pet_name: '',
    notes: '',
    wants_promotions: false,
    honeypot: '',
  });
  const [petImageFile, setPetImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    country: '',
    whatsapp: '',
  });
  const [fileError, setFileError] = useState('');

  const countryOptions = useMemo(() => getCountryOptions(i18n.language), [i18n.language]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'whatsapp') {
      setFormData((prev) => ({ ...prev, [name]: sanitizeWhatsapp(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = async (e) => {
    const input = e.target;
    const file = input.files?.[0];
    setFileError('');

    if (!file) {
      return;
    }

    const code = await getImageError(file);

    if (code) {
      setFileError(t(IMAGE_ERROR_KEYS[code]));
      setPetImageFile(null);
      input.value = '';
    } else {
      setPetImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setFieldErrors({ country: '', whatsapp: '' });

    // Validar país
    if (!formData.country) {
      setFieldErrors((prev) => ({ ...prev, country: t('contact.countryRequiredError') }));
      setIsSubmitting(false);
      return;
    }

    // Validar WhatsApp
    if (!isValidWhatsapp(formData.whatsapp)) {
      setFieldErrors((prev) => ({ ...prev, whatsapp: t('contact.whatsappInvalidError') }));
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl = null;

      if (petImageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', petImageFile);
        const uploadResult = await uploadPetImage(uploadFormData);
        imageUrl = uploadResult.url;
      }

      await createContactRequest({
        ...formData,
        pet_image_url: imageUrl,
      });

      setSubmitted(true);
      setFormData({
        client_name: '',
        email: '',
        whatsapp: '',
        country: '',
        pet_name: '',
        notes: '',
        wants_promotions: false,
        honeypot: '',
      });
      setPetImageFile(null);
    } catch (err) {
      setSubmitError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <div aria-hidden="true" className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-sage/15 text-3xl text-sage">✓</div>
          <h1 className="font-display text-3xl font-bold text-ink mb-4">{t('contact.title')}</h1>
          <p className="text-muted">{t('contact.success')}</p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-8 px-6 py-3 bg-brand text-white font-medium rounded-full hover:bg-brand-dark transition"
          >
            {t('contact.sendAnother')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="font-display text-4xl md:text-5xl font-bold text-center text-ink mb-10">{t('contact.title')}</h1>

      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-800">
          {t('contact.error')}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-sm p-6 md:p-10">
        <div>
          <label htmlFor="client_name" className={labelClasses}>
            {t('contact.clientNameLabel')} *
          </label>
          <input
            type="text"
            id="client_name"
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            placeholder={t('contact.clientNamePlaceholder')}
            required
            className={getInputClasses()}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClasses}>
            {t('contact.emailLabel')} *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t('contact.emailPlaceholder')}
            required
            className={getInputClasses()}
          />
        </div>

        <div>
          <label htmlFor="whatsapp" className={labelClasses}>
            {t('contact.whatsappLabel')} *
          </label>
          <input
            type="tel"
            id="whatsapp"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="+51987654321"
            inputMode="tel"
            autoComplete="tel"
            required
            className={getInputClasses(Boolean(fieldErrors.whatsapp))}
            aria-invalid={Boolean(fieldErrors.whatsapp)}
            aria-describedby={fieldErrors.whatsapp ? 'whatsapp-error' : undefined}
          />
          {fieldErrors.whatsapp && (
            <p id="whatsapp-error" className="mt-2 text-sm text-red-700">{fieldErrors.whatsapp}</p>
          )}
        </div>

        <div>
          <label htmlFor="country" className={labelClasses}>
            {t('contact.countryLabel')} *
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className={getInputClasses(Boolean(fieldErrors.country))}
            aria-invalid={Boolean(fieldErrors.country)}
            aria-describedby={fieldErrors.country ? 'country-error' : undefined}
          >
            <option value="" disabled>
              {t('contact.countrySelectPlaceholder')}
            </option>
            {countryOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.name}
              </option>
            ))}
          </select>
          {fieldErrors.country && (
            <p id="country-error" className="mt-2 text-sm text-red-700">{fieldErrors.country}</p>
          )}
        </div>

        <div>
          <label htmlFor="pet_name" className={labelClasses}>
            {t('contact.petNameLabel')}
          </label>
          <input
            type="text"
            id="pet_name"
            name="pet_name"
            value={formData.pet_name}
            onChange={handleChange}
            placeholder={t('contact.petNamePlaceholder')}
            className={getInputClasses()}
          />
        </div>

        <div>
          <label htmlFor="notes" className={labelClasses}>
            {t('contact.notesLabel')}
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder={t('contact.notesPlaceholder')}
            rows={4}
            className={getInputClasses()}
          />
        </div>

        <div>
          <label htmlFor="pet_image" className={labelClasses}>
            {t('contact.imageLabel')}
          </label>
          <input
            type="file"
            id="pet_image"
            name="pet_image"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            aria-invalid={Boolean(fileError)}
            aria-describedby={fileError ? 'pet-image-error' : undefined}
            className="w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-sand file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink hover:file:bg-sand/70 cursor-pointer"
          />
          {fileError && (
            <p id="pet-image-error" className="mt-2 text-sm text-red-700">{fileError}</p>
          )}
          {petImageFile && (
            <p className="mt-2 text-sm text-muted">{petImageFile.name}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="wants_promotions"
            name="wants_promotions"
            checked={formData.wants_promotions}
            onChange={handleCheckboxChange}
            className="w-5 h-5 rounded accent-brand"
          />
          <label htmlFor="wants_promotions" className="ml-3 text-sm text-ink">
            {t('contact.wantsPromotionsLabel')}
          </label>
        </div>

        <input
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleChange}
          className="hidden"
          tabIndex="-1"
          autoComplete="off"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-brand text-white font-medium rounded-full hover:bg-brand-dark transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('contact.submit') + '...' : t('contact.submit')}
        </button>

      </form>
    </div>
  );
};

export default Contact;
