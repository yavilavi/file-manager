/**
 * File Manager - Formatters
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
export const formatDate = (date: string | null | undefined): string => {
  if (!date) return 'No disponible';
  
  try {
    const dateObj = new Date(date);
    
    // Check if the date object is valid
    if (isNaN(dateObj.getTime())) {
      return 'Fecha inválida';
    }
    
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  } catch (error) {
    console.warn('Error formatting date:', error, 'Original value:', date);
    return 'Fecha inválida';
  }
};

export const formatCurrency = (amount: number, currency = 'COP'): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
  }).format(amount);
}; 