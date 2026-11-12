export function formatPrice(price: number): string {
  if (!price) return 'Price on Request';
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2).replace(/\.00$/, '')} Lac`;
  return `₹${price.toLocaleString('en-IN')}`;
}

export function formatArea(sqft?: number | null): string {
  if (!sqft) return 'N/A';
  return `${sqft.toLocaleString('en-IN')} sq.ft`;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function whatsappLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Simple EMI calculator: EMI = P x r x (1+r)^n / ((1+r)^n - 1)
export function calculateEMI(principal: number, annualRatePercent: number, tenureYears: number) {
  const r = annualRatePercent / 12 / 100;
  const n = tenureYears * 12;
  if (r === 0) return principal / n;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return emi;
}

export function propertyWhatsAppMessage(title: string, url: string, price?: string) {
  return `Hi BT_Jaipur_Homes, I'm interested in "${title}"${price ? ` (${price})` : ''}. Please share more details.\n${url}`;
}

export const toPlainText = (s?: string | null, max = 160) =>
  (s || '').replace(/\s+/g, ' ').trim().slice(0, max);
