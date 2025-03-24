// List of EU member states and Ukraine
export const EU_COUNTRIES = new Set([
    // EU countries
    'AT', // Austria
    'BE', // Belgium
    'BG', // Bulgaria
    'HR', // Croatia
    'CZ', // Czech Republic
    'DK', // Denmark
    'EE', // Estonia
    'FI', // Finland
    'FR', // France
    'DE', // Germany
    'GR', // Greece
    'HU', // Hungary
    'IE', // Ireland
    'IT', // Italy
    'LV', // Latvia
    'LT', // Lithuania
    'LU', // Luxembourg
    'MT', // Malta
    'NL', // Netherlands
    'PL', // Poland
    'PT', // Portugal
    'RO', // Romania
    'SK', // Slovakia
    'SI', // Slovenia
    'ES', // Spain
    'SE', // Sweden
    // Ukraine
    'UA'
]);

// Country names mapping
export const COUNTRY_NAMES: Record<string, string> = {
    'AT': 'Austria',
    'BE': 'Belgium',
    'BG': 'Bulgaria',
    'HR': 'Croatia',
    'CZ': 'Czech Republic',
    'DK': 'Denmark',
    'EE': 'Estonia',
    'FI': 'Finland',
    'FR': 'France',
    'DE': 'Germany',
    'GR': 'Greece',
    'HU': 'Hungary',
    'IE': 'Ireland',
    'IT': 'Italy',
    'LV': 'Latvia',
    'LT': 'Lithuania',
    'LU': 'Luxembourg',
    'MT': 'Malta',
    'NL': 'Netherlands',
    'PL': 'Poland',
    'PT': 'Portugal',
    'RO': 'Romania',
    'SK': 'Slovakia',
    'SI': 'Slovenia',
    'ES': 'Spain',
    'SE': 'Sweden',
    'UA': 'Ukraine'
};

/**
 * Check if a country code is in the EU or Ukraine
 */
export function isAllowedCountry(countryCode: string): boolean {
    return EU_COUNTRIES.has(countryCode.toUpperCase());
}

/**
 * Get the full country name from a country code
 */
export function getCountryName(countryCode: string): string {
    return COUNTRY_NAMES[countryCode.toUpperCase()] || countryCode;
}

/**
 * Get a list of all allowed countries with their codes and names
 */
export function getAllowedCountries(): Array<{ code: string; name: string }> {
    return Array.from(EU_COUNTRIES).map(code => ({
        code,
        name: COUNTRY_NAMES[code]
    }));
} 