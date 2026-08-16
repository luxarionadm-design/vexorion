/**
 * Formatters - Formatting Functions
 * Reusable formatting utilities
 */

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @param {string} locale - Locale code
 * @returns {string} Formatted currency
 */
export function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '0.00';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
}

/**
 * Format date
 * @param {Date|string} date - Date to format
 * @param {string} format - Format string (default: 'YYYY-MM-DD')
 * @param {string} locale - Locale code
 * @returns {string} Formatted date
 */
export function formatDate(date, format = 'YYYY-MM-DD', locale = 'en-US') {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (!(d instanceof Date) || isNaN(d.getTime())) {
    return '';
  }
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  const replacements = {
    'YYYY': year,
    'YY': String(year).slice(-2),
    'MM': month,
    'DD': day,
    'HH': hours,
    'mm': minutes,
    'ss': seconds
  };
  
  let result = format;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(key, value);
  }
  
  return result;
}

/**
 * Format time
 * @param {number} seconds - Time in seconds
 * @param {string} format - Format string
 * @returns {string} Formatted time
 */
export function formatTime(seconds, format = 'HH:mm:ss') {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
    return '00:00:00';
  }
  
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  const replacements = {
    'HH': String(h).padStart(2, '0'),
    'H': String(h),
    'mm': String(m).padStart(2, '0'),
    'm': String(m),
    'ss': String(s).padStart(2, '0'),
    's': String(s)
  };
  
  let result = format;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(key, value);
  }
  
  return result;
}

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
export function formatFileSize(bytes, decimals = 2) {
  if (typeof bytes !== 'number' || isNaN(bytes) || bytes < 0) {
    return '0 B';
  }
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(decimals)} ${units[unitIndex]}`;
}

/**
 * Format number with thousand separators
 * @param {number} number - Number to format
 * @param {string} locale - Locale code
 * @returns {string} Formatted number
 */
export function formatNumber(number, locale = 'en-US') {
  if (typeof number !== 'number' || isNaN(number)) {
    return '0';
  }
  
  return new Intl.NumberFormat(locale).format(number);
}

/**
 * Format percentage
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimal places
 * @param {string} locale - Locale code
 * @returns {string} Formatted percentage
 */
export function formatPercentage(value, decimals = 2, locale = 'en-US') {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
}

/**
 * Truncate string
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add
 * @returns {string} Truncated string
 */
export function truncateString(str, maxLength = 50, suffix = '...') {
  if (!str || typeof str !== 'string') {
    return '';
  }
  
  if (str.length <= maxLength) {
    return str;
  }
  
  return str.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Camel case to title case
 * @param {string} str - String to convert
 * @returns {string} Title case string
 */
export function camelToTitle(str) {
  if (!str || typeof str !== 'string') {
    return '';
  }
  
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (match) => match.toUpperCase())
    .trim();
}

/**
 * Title case to camel case
 * @param {string} str - String to convert
 * @returns {string} Camel case string
 */
export function titleToCamel(str) {
  if (!str || typeof str !== 'string') {
    return '';
  }
  
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
}
