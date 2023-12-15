import React, { useState } from 'react';
import { fetchListings } from './utility/listingService';
import DOMPurify from 'dompurify';
import './searchBar.css';

interface SearchParams {
  location: string;
  propertyType: string;
  keyword: string;
}

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  // Initialize state for each search criterion
  const [keyword, setKeyword] = useState('');
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
      keyword: DOMPurify.sanitize(keyword),
    };

    // Validate inputs
    if (!searchParams.location && !searchParams.propertyType && !searchParams.keyword) {
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
      <input
        type="text"
        placeholder="City, neighborhood, or ZIP"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <select
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
      >
        <option value="">Select Property Type</option>
        <option value="apartment">Apartment</option>
        <option value="house">House</option>
        <option value="condo">Condo</option>
        {/* Add other property types as options here */}
      </select>
      <input
        type="text"
        placeholder="Keyword (e.g., pool)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button type="submit">Search</button>
      {searchError && <div className="search-error">{searchError}</div>}
    </form>

  );
}

export default SearchBar;
