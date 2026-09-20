import { COUNTRY_CODES } from '../constants/countries';

export const getCountryOptions = (lang) => {
  const displayNames = new Intl.DisplayNames([lang], { type: 'region' });

  const options = COUNTRY_CODES.map((code) => ({
    code,
    name: displayNames.of(code) || code,
  }));

  return options.sort((a, b) => a.name.localeCompare(b.name, lang));
};

export const getCountryName = (code, lang = 'es') => {
  if (!code || code === '') {
    return '';
  }

  if (!/^[A-Z]{2}$/.test(code)) {
    return code;
  }

  try {
    const displayNames = new Intl.DisplayNames([lang], { type: 'region' });
    return displayNames.of(code) || code;
  } catch {
    return code;
  }
};
