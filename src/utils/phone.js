export const sanitizeWhatsapp = (value) => {
  // Eliminar todo excepto dígitos y "+"
  let sanitized = value.replace(/[^\d+]/g, '');
  
  // Eliminar cualquier "+" que no esté en la posición 0
  sanitized = sanitized.replace(/(?!^)\+/g, '');
  
  // Limitar a máximo 16 caracteres
  return sanitized.slice(0, 16);
};

export const isValidWhatsapp = (value) => {
  return /^\+[1-9]\d{6,14}$/.test(value);
};
