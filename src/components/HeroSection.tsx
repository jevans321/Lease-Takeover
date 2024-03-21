import React, { useState } from 'react';
import Slider from 'react-slick';
import LocationTypeahead from './LocationTypeahead';
import { HomeProps } from './utility/componentTypes';
import { fetchListings } from './utility/listingService';
import { getSanitizedCityState } from './utility/helpers';
import { useNavigate } from 'react-router-dom';
import './heroSection.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import searchIcon from '../assets/search-13-48.png';
import slide1 from '../assets/jGggmwPHncRNy6B5BTvipD_v3.jpg';
import slide2 from '../assets/modern-apartment-design-hidden-lighting-111019-1249-01-800x408.jpg';

function HeroSection({ onSearch }: HomeProps) {
  const [isLocationValid, setIsLocationValid] = useState(false);
  const [location, setLocation] = useState('');
  const [searchError, setSearchError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (event: React.FormEvent) => {
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
            onValidSelectionMade={setIsLocationValid}
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