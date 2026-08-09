// src/lib/msisdn.ts
//
// Mobile money numbers reach the payment gateway as the `accountnumber` it
// pushes the approval prompt to, and it expects digits in international form.
// USSD gets this for free (the telco hands it 233XXXXXXXXX), but on the web the
// buyer types whatever they like — so normalise before sending.

/**
 * Normalises a Ghana mobile number to 233XXXXXXXXX.
 *
 * Accepts 0XXXXXXXXX, 233XXXXXXXXX, and the bare 9-digit subscriber number.
 * Returns null when the input can't be a Ghana MSISDN, so callers can block
 * submission instead of letting the gateway reject it later.
 */
export const normaliseMsisdn = (raw: string): string | null => {
  const digits = (raw || '').replace(/\D/g, '');
  if (/^0\d{9}$/.test(digits)) return `233${digits.slice(1)}`;
  if (/^233\d{9}$/.test(digits)) return digits;
  if (/^\d{9}$/.test(digits)) return `233${digits}`;
  return null;
};

/**
 * `network` is passed through to the gateway as the mobile money `accounttype`,
 * so these values must match what CalPay expects — the same set the USSD buyer
 * flow sends.
 */
export const MOMO_NETWORKS = [
  { value: 'MTN', label: 'MTN MoMo' },
  { value: 'VODAFONE', label: 'Telecel Cash (Vodafone)' },
  { value: 'AIRTELTIGO', label: 'AirtelTigo Money' }
];
