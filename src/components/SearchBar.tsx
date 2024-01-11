import React, { useState } from 'react';
import { fetchListings } from './utility/listingService';
import DOMPurify from 'dompurify';
import LocationTypeahead from './LocationTypeahead';
import './searchBar.css';

interface SearchParams {
  location: string;
  propertyType: string;
  bedrooms: string;
}

function SearchBar() {
  const [bedrooms, setBedrooms] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [searchError, setSearchError] = useState('');

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    setSearchError('');
    // Sanitize inputs
    const searchParams: SearchParams = {
      location: DOMPurify.sanitize(location),
      propertyType: DOMPurify.sanitize(propertyType),
      bedrooms: bedrooms === 'any' ? '' : DOMPurify.sanitize(bedrooms),
    };
    console.log('search params ', searchParams)
    // Validate inputs
    if (!searchParams.location && !searchParams.propertyType && !searchParams.bedrooms) {
      setSearchError('Please enter some search criteria.');
      return;
    }

    try {
      // Proceed with the API call
      const listings = await fetchListings(searchParams);
      // Do something with the listings, like updating state or navigating to a results page
      console.log(listings);
    } catch (error) {
      // Handle errors, such as displaying a user-friendly error message
      console.error('Search failed:', error);
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
