// Mock exchange rates (replace with real API later)
// These rates should be updated daily from a real exchange rate API
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 1.1, // 1 EUR = 1.1 USD
  UZS: 0.00008, // 1 USD = ~12,500 UZS
}

export function convertCurrency(
  amount: number,
  from: string,
  to: string
): number {
  if (from === to) return amount
  if (!EXCHANGE_RATES[from] || !EXCHANGE_RATES[to]) {
    console.warn(`Unknown currency: ${from} or ${to}`)
    return amount
  }
  const usdAmount = amount * EXCHANGE_RATES[from]
  return Math.round(usdAmount / EXCHANGE_RATES[to])
}

export function formatPrice(amount: number, currency: string): string {
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return `${formatted} ${currency}`
}

export function getExchangeRate(from: string, to: string): number {
  if (from === to) return 1
  if (!EXCHANGE_RATES[from] || !EXCHANGE_RATES[to]) {
    return 1
  }
  return EXCHANGE_RATES[from] / EXCHANGE_RATES[to]
}

// TODO: Replace with real API call
export async function fetchExchangeRates(): Promise<Record<string, number>> {
  // Example: fetch from https://api.exchangerate-api.com/v4/latest/USD
  // For now, return mock rates
  return EXCHANGE_RATES
}
