import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import './heroSection.css';
import slide1 from '../assets/jGggmwPHncRNy6B5BTvipD_v3.jpg';
import slide2 from '../assets/jGggmwPHncRNy6B5BTvipD_v4.jpg';

function HeroSection() {
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
        <form>
          <input type="text" placeholder="Search listings..." />
          <button type="submit">Search</button>
        </form>
      </div>
    </section>
  );
}

export default HeroSection;