import React, { useState } from 'react';
import { HomeProps } from './utility/componentTypes';
import { fetchListings } from './utility/listingService';
import { getSanitizedCityState } from './utility/helpers';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import LocationTypeahead from './LocationTypeahead';
import './searchBar.css';

function SearchBar({ onSearch }: HomeProps) {
  const [bedrooms, setBedrooms] = useState('');
  const [isLocationValid, setIsLocationValid] = useState(false);
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [searchError, setSearchError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchError('');
    if (!isLocationValid) {
      setSearchError('Please select a location from the dropdown.');
      return;
    }
    const [sanitizedCity, sanitizedState] = getSanitizedCityState(location);

    if (!sanitizedCity) {
      setSearchError('Please enter a city.');
      return;
    }

    const validBedrooms = /^[0-9]+$/.test(bedrooms);
    const sanitizedBedrooms = bedrooms === 'any' || validBedrooms ? bedrooms : '';

    const validPropertyType = /^[a-zA-Z\s]+$/.test(propertyType);
    const sanitizedPropertyType = validPropertyType ? propertyType : '';

    const searchParams = {
      bedrooms: sanitizedBedrooms,
      city: sanitizedCity,
      propertyType: sanitizedPropertyType,
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
        onValidSelectionMade={setIsLocationValid}
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
