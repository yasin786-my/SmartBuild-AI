import type { CurrencyCode } from "@/types";

/**
 * Currency formatting utilities using Intl.NumberFormat.
 */

const CURRENCY_LOCALES: Record<CurrencyCode, string> = {
  INR: "en-IN",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
};

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

/**
 * Format a number as currency using Intl.NumberFormat.
 * @param amount — numeric value in target currency
 * @param currency — currency code (default INR)
 */
export function formatCurrency(amount: number, currency: CurrencyCode = "INR"): string {
  const locale = CURRENCY_LOCALES[currency] || "en-IN";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Get the symbol for a currency code. */
export function getCurrencySymbol(currency: CurrencyCode): string {
  return CURRENCY_SYMBOLS[currency] || "₹";
}

/** All supported currencies for the dropdown. */
export const SUPPORTED_CURRENCIES: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: "INR", label: "Indian Rupee", symbol: "₹" },
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "GBP", label: "British Pound", symbol: "£" },
];
