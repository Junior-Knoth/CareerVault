export function removeDiacritics(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function normalizeText(value: string) {
  return removeDiacritics(value).trim().replace(/\s+/g, ' ').toLowerCase();
}

export function slugify(value: string) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function isBlank(value: string | null | undefined) {
  return !value || value.trim().length === 0;
}
