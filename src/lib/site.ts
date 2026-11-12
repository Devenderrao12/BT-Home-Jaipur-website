// Single source of truth for business details. Values come from env, falling back to the
// details supplied by the business owner. Nothing here is invented.
const phone = process.env.NEXT_PUBLIC_CALL_NUMBER || '+919672439863';
const waDigits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919672439863').replace(/\D/g, '');

export const site = {
  name: 'BT_Jaipur_Homes',
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || 'https://btjaipurhomes.vercel.app').replace(/\/$/, ''),
  phone,
  phoneDisplay: phone.replace(/^\+91(\d{5})(\d{5})$/, '+91 $1 $2'),
  whatsapp: waDigits,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '', // optional – hidden when empty
  addressLine: 'Kalwar Road',
  city: 'Jaipur',
  region: 'Rajasthan',
  country: 'IN',
  mapsEmbed:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ||
    'https://www.google.com/maps?q=Kalwar+Road,+Jaipur&output=embed',
};

export const absoluteUrl = (path = '') => `${site.siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
