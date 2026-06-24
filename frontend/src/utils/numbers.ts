const integerFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

export function formatInteger(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? integerFormatter.format(value) : '';
}

export function formatDecimal(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? decimalFormatter.format(value) : '';
}

export function parseNullableNumber(value: string) {
  const normalizedValue = value.trim().replace(',', '.');

  if (!normalizedValue) {
    return null;
  }

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}
