import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { createContactRequest, uploadPetImage } from '../../api/contactRequests';
import { getCountryOptions } from '../../utils/countries';
import { sanitizeWhatsapp, isValidWhatsapp } from '../../utils/phone';

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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPetImageFile(e.target.files[0]);
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
        honeypot: '',
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
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-green-800 mb-4">{t('contact.title')}</h1>
          <p className="text-green-700">{t('contact.success')}</p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            {t('contact.sendAnother')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">{t('contact.title')}</h1>
      
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
          {t('contact.error')}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="client_name" className="block text-sm font-medium mb-2">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium mb-2">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {fieldErrors.whatsapp && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.whatsapp}</p>
          )}
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium mb-2">
            {t('contact.countryLabel')} *
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <p className="mt-1 text-sm text-red-600">{fieldErrors.country}</p>
          )}
        </div>

        <div>
          <label htmlFor="pet_name" className="block text-sm font-medium mb-2">
            {t('contact.petNameLabel')}
          </label>
          <input
            type="text"
            id="pet_name"
            name="pet_name"
            value={formData.pet_name}
            onChange={handleChange}
            placeholder={t('contact.petNamePlaceholder')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-2">
            {t('contact.notesLabel')}
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder={t('contact.notesPlaceholder')}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="pet_image" className="block text-sm font-medium mb-2">
            {t('contact.imageLabel')}
          </label>
          <input
            type="file"
            id="pet_image"
            name="pet_image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {petImageFile && (
            <p className="mt-2 text-sm text-gray-600">{petImageFile.name}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="wants_promotions"
            name="wants_promotions"
            checked={formData.wants_promotions}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="wants_promotions" className="ml-2 text-sm">
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
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('contact.submit') + '...' : t('contact.submit')}
        </button>

      </form>
    </div>
  );
};

export default Contact;
