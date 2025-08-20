/**
 * Utility functions for formatting Vietnamese currency (VND)
 */

/**
 * Format a number as Vietnamese currency
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show the ₫ symbol (default: true)
 * @returns {string} Formatted currency string
 */
export const formatVND = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return showSymbol ? '0 VNĐ' : '0';
  }
  
  const formatted = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
  
  return showSymbol ? `${formatted} VNĐ` : formatted;
};

/**
 * Format a number as Vietnamese currency with decimal places
 * @param {number} amount - The amount to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @param {boolean} showSymbol - Whether to show the ₫ symbol (default: true)
 * @returns {string} Formatted currency string
 */
export const formatVNDWithDecimals = (amount, decimals = 2, showSymbol = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return showSymbol ? '0 VNĐ' : '0';
  }
  
  const formatted = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount);
  
  return showSymbol ? `${formatted} VNĐ` : formatted;
};

/**
 * Format a number as Vietnamese currency for display in tables/charts
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string without symbol
 */
export const formatVNDForDisplay = (amount) => {
  return formatVND(amount, false);
};

/**
 * Format a number as Vietnamese currency for tooltips
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string with symbol
 */
export const formatVNDForTooltip = (amount) => {
  return formatVND(amount, true);
};

export default {
  formatVND,
  formatVNDWithDecimals,
  formatVNDForDisplay,
  formatVNDForTooltip
};
