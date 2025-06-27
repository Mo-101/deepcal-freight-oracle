
/**
 * Formatting utilities for DeepCAL outputs (currency, weight, volume, days)
 */

export function formatCurrency(amount: number, currency: string = "USD") {
  if (isNaN(amount)) return "";
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

export function formatWeight(weight: number) {
  if (isNaN(weight)) return "";
  return `${weight.toLocaleString("en-US")} kg`;
}

export function formatVolume(volume: number) {
  if (isNaN(volume)) return "";
  return `${volume.toLocaleString("en-US", { maximumFractionDigits: 2 })} CBM`;
}

export function formatDays(days: number) {
  if (isNaN(days)) return "";
  return `${days.toFixed(1)} days`;
}
