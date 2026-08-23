/**
 * Arabic character normalization rules
 */

// Normalization map for Arabic characters  
export const NORMALIZATION_MAP: Record<string, string> = {
  'أ': 'أ',
  'إ': 'أ',
  'آ': 'أأ',
  'ؤ': 'أ',
  'ئ': 'أ',
  'ء': 'أ',
  'ى': 'أ',
  'ا': 'أ',
  'ة': 'ت',
  'ه': 'ه',
};

// Arabic character range regex
export const ARABIC_REGEX = /^[\u0600-\u06FF\s]*$/;

/**
 * Normalize Arabic text according to the rules
 * @param text - Input Arabic text
 * @returns Normalized text with expanded characters
 */
export function normalizeArabicText(text: string): string {
  // Remove spaces
  let normalized = text.replace(/\s/g, '');

  // Apply normalization rules
  for (const [original, replacement] of Object.entries(NORMALIZATION_MAP)) {
    normalized = normalized.split(original).join(replacement);
  }

  return normalized;
}

/**
 * Validate that input contains only Arabic characters and spaces
 * @param text - Input text to validate
 * @returns true if valid, false otherwise
 */
export function validateArabicInput(text: string): boolean {
  return ARABIC_REGEX.test(text);
}

/**
 * Clean text by removing diacritics (tashkeel) and tatweel
 * @param text - Input text
 * @returns Cleaned text
 */
export function removeDiacritics(text: string): string {
  // Remove Arabic diacritics (U+064B to U+0652) and Tatweel (U+0640)
  return text.replace(/[\u064B-\u0652\u0640]/g, '');
}
