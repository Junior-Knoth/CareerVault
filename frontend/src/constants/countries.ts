export interface CountryOption {
  code: string;
  name: string;
}

export const countryOptions: CountryOption[] = [
  { code: 'ar', name: 'Argentina' },
  { code: 'be', name: 'Belgica' },
  { code: 'br', name: 'Brasil' },
  { code: 'cl', name: 'Chile' },
  { code: 'co', name: 'Colombia' },
  { code: 'hr', name: 'Croacia' },
  { code: 'dk', name: 'Dinamarca' },
  { code: 'eg', name: 'Egito' },
  { code: 'gb-eng', name: 'Inglaterra' },
  { code: 'fr', name: 'Franca' },
  { code: 'de', name: 'Alemanha' },
  { code: 'it', name: 'Italia' },
  { code: 'jp', name: 'Japao' },
  { code: 'mx', name: 'Mexico' },
  { code: 'ma', name: 'Marrocos' },
  { code: 'nl', name: 'Holanda' },
  { code: 'ng', name: 'Nigeria' },
  { code: 'pt', name: 'Portugal' },
  { code: 'sa', name: 'Arabia Saudita' },
  { code: 'gb-sct', name: 'Escocia' },
  { code: 'sn', name: 'Senegal' },
  { code: 'rs', name: 'Servia' },
  { code: 'kr', name: 'Coreia do Sul' },
  { code: 'es', name: 'Espanha' },
  { code: 'ch', name: 'Suica' },
  { code: 'tr', name: 'Turquia' },
  { code: 'ua', name: 'Ucrania' },
  { code: 'uy', name: 'Uruguai' },
  { code: 'us', name: 'Estados Unidos' },
  { code: 'gb-wls', name: 'Pais de Gales' },
];

export const countrySelectOptions = countryOptions.map((country) => ({
  value: country.code,
  label: country.name,
}));

export function getCountryByCode(countryCode: string | null | undefined) {
  if (!countryCode) {
    return undefined;
  }

  return countryOptions.find((country) => country.code === countryCode);
}

export function getCountryName(countryCode: string | null | undefined) {
  return getCountryByCode(countryCode)?.name ?? countryCode ?? '';
}

export function getCountryFlagUrl(countryCode: string | null | undefined) {
  const country = getCountryByCode(countryCode);

  if (!country) {
    return undefined;
  }

  return `https://flagcdn.com/${country.code}.svg`;
}
