export const normalizeText = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};
