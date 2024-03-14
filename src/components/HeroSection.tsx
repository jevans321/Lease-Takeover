import DOMPurify from 'dompurify';
import React, { useState } from 'react';
import Slider from 'react-slick';
import LocationTypeahead from './LocationTypeahead';
import { HomeProps } from './utility/componentTypes';
import { fetchListings } from './utility/listingService';
import { useNavigate } from 'react-router-dom';

import './heroSection.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import searchIcon from '../assets/search-13-48.png';
import slide1 from '../assets/jGggmwPHncRNy6B5BTvipD_v3.jpg';
import slide2 from '../assets/modern-apartment-design-hidden-lighting-111019-1249-01-800x408.jpg';

function HeroSection({ onSearch }: HomeProps) {
  const [location, setLocation] = useState('');
  const [searchError, setSearchError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (event: React.FormEvent) => {
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

    try {
      // Proceed with the API call
      const listings = await fetchListings({ city: sanitizedCity, state: sanitizedState });
      onSearch(listings); // Update App's state
      navigate('/listings'); // Navigate to the listings page
    } catch (error) {
      // Handle errors, such as displaying a user-friendly error message
      console.error('Search failed:', error);
    }
  };
  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear"
  };

  return (
    <section className="hero-section">
      <Slider {...settings}>
        <div className="slide" key="slide1">
          <img src={slide1} alt="Slide 1" />
          <div className="slide-content">
            <h2>Find Your Perfect Space</h2>
          </div>
        </div>
        <div className="slide" key="slide2">
          <img src={slide2} alt="Slide 2" />
          <div className="slide-content">
            <h2>Seamless Lease Transfers</h2>
          </div>
        </div>
      </Slider>

      <div className="hero-search">
        <form onSubmit={handleSearch}>
          <LocationTypeahead
            value={location}
            onChange={setLocation}
          />
          <button type="submit">
            <img src={searchIcon} alt="Search" />
          </button>
          {searchError && <div className="search-error">{searchError}</div>}
        </form>
      </div>
    </section>
  );
}

export default HeroSection;