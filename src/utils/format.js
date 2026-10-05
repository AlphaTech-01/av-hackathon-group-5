/**
 * Utility functions for formatting currencies and percentages using Indian numbering conventions.
 */

// Formatter instance for Indian Rupee amounts
const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/**
 * Format a number as Indian Rupee currency (e.g. ₹2,73,333).
 */
export function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  return inrFormatter.format(Math.round(amount));
}

/**
 * Format a decimal ratio into a display percentage (e.g. 0.1709 -> 17.1%).
 */
export function formatPercent(ratio, decimals = 1) {
  if (ratio === undefined || ratio === null || isNaN(ratio)) {
    return '0%';
  }
  return `${(ratio * 100).toFixed(decimals)}%`;
}

/**
 * Format an already multiplied percentage number (e.g. 21.21 -> 21.2%).
 */
export function formatPctValue(pct, decimals = 1) {
  if (pct === undefined || pct === null || isNaN(pct)) {
    return '0%';
  }
  return `${Number(pct).toFixed(decimals)}%`;
}
