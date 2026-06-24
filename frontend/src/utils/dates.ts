const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function parseDateValue(value: string | Date | null | undefined) {
  if (!value) {
    return undefined;
  }

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function formatDate(value: string | Date | null | undefined) {
  const date = parseDateValue(value);

  return date ? dateFormatter.format(date) : '';
}

export function toDateInputValue(value: string | Date | null | undefined) {
  const date = parseDateValue(value);

  if (!date) {
    return '';
  }

  return date.toISOString().slice(0, 10);
}

export function getAge(value: string | Date | null | undefined, referenceDate = new Date()) {
  const birthDate = parseDateValue(value);

  if (!birthDate) {
    return undefined;
  }

  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const monthDelta = referenceDate.getMonth() - birthDate.getMonth();
  const hasBirthdayPassed =
    monthDelta > 0 || (monthDelta === 0 && referenceDate.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return age;
}
