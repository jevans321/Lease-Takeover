import React, { useState } from 'react';
import { HomeProps } from './utility/componentTypes';
import { fetchListings } from './utility/listingService';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import LocationTypeahead from './LocationTypeahead';
import './searchBar.css';

function SearchBar({ onSearch }: HomeProps) {
  const [bedrooms, setBedrooms] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [searchError, setSearchError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchError('');
    // Split the location into parts, then try to identify city and state
    let parts = location.includes(',')
      ? location.split(',').map(part => part.trim())
      : location.split(' ').map(part => part.trim());

    let sanitizedCity, sanitizedState;
    if (parts.length > 1 && location.includes(',')) {
      // Case for "City, State"
      [sanitizedCity, sanitizedState] = parts;
    } else if (parts.length >= 2 && !location.includes(',')) {
      // Case for "City State" with city names possibly having multiple words
      sanitizedState = parts.pop() || ''; // Assumes last part is the state
      sanitizedCity = parts.join(' '); // The rest is considered as the city
    } else {
      // Single word, assume it's just the city or the user input is incomplete
      sanitizedCity = parts[0] || '';
      sanitizedState = ''; // No state information provided
    }

    // Further sanitization for security
    sanitizedCity = DOMPurify.sanitize(sanitizedCity);
    sanitizedState = DOMPurify.sanitize(sanitizedState);

    if (!sanitizedCity) {
      setSearchError('Please enter a city.');
      return;
    }
    const searchParams = {
      bedrooms: bedrooms === 'any' ? '' : DOMPurify.sanitize(bedrooms),
      city: sanitizedCity,
      propertyType: DOMPurify.sanitize(propertyType),
      state: sanitizedState,
    };
    if (!searchParams.city || !searchParams.state) {
      setSearchError('Please enter some search criteria.');
      return;
    }
    try {
      const listings = await fetchListings(searchParams);
      // Do something with the listings, like updating state or navigating to a results page
      onSearch(listings); // Update App's state
      navigate('/listings'); // Navigate to the listings page
    } catch (error: any) { // Typing error as 'any' due to TypeScript
      console.error('Search failed:', error);
      setSearchError('Search failed due to an unexpected error. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <LocationTypeahead
        value={location}
        onChange={setLocation}
      />
      <select
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
      >
        <option value="" disabled>Type</option>
        <option value="apartment">Apartment</option>
        <option value="house">House</option>
        <option value="condo">Condo</option>
      </select>
      <select
        value={bedrooms}
        onChange={(e) => setBedrooms(e.target.value)}
      >
        <option value="" disabled>Beds</option>
        <option value="any">Any</option>
        <option value="studio">Studio</option>
        <option value="1">1 Bedroom</option>
        <option value="2">2 Bedrooms</option>
        <option value="3">3 Bedrooms</option>
        <option value="4+">4+ Bedrooms</option>
      </select>
      <button type="submit">Search</button>
      {searchError && <div className="search-error">{searchError}</div>}
    </form>

  );
}

export default SearchBar;
