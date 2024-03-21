export const getSanitizedCityState = (location: string): [string, string] => {
  const parts = location.split(',').map(part => part.trim());

  let sanitizedCity: string = '';
  let sanitizedState: string = '';

  if (parts.length === 2) {
    if (/^[a-zA-Z\s]*$/.test(parts[0]) && /^[a-zA-Z]*$/.test(parts[1])) {
      sanitizedCity = parts[0];
      sanitizedState = parts[1];
    }
  }

  return [sanitizedCity, sanitizedState];
};
