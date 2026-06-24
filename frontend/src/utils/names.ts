import { normalizeText } from './strings';

export function normalizeName(value: string) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function getDisplayName(fullName: string, shortName?: string | null) {
  return shortName?.trim() || fullName;
}

export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}
