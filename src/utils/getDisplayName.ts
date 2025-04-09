/**
 * Generates a display name based on the provided full name.
 *
 * If the full name consists of multiple words, it attempts to use the first
 * and second words as the display name, provided their combined length
 * does not exceed 12 characters. Otherwise, it defaults to using only
 * the first word.
 *
 * @param fullName - The full name of the user as a string.
 * @returns A string representing the display name. Returns an empty string
 *          if the input is falsy or contains no valid words.
 */
export function getDisplayName(fullName: string): string {
  if (!fullName) return '';

  const words = fullName.trim().split(/\s+/);
  if (words.length === 0) return '';

  const first = words[0];
  const second = words[1] || '';

  return (first.length + second.length) <= 12 ? `${first} ${second}`.trim() : first;
}
