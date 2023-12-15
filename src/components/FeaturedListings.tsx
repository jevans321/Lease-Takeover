import React from 'react';
import './featuredListings.css'; // Ensure this CSS file is properly linked

// Mock data for listings
const listings = [
  {
    id: 1,
    title: 'Cozy Downtown Loft',
    description: '2 bed, 2 bath in the heart of the city',
    imageUrl: 'path-to-image-1.jpg',
    price: '$1,200/mo',
    bedrooms: 2,
    bathrooms: 2,
    area: 900,
    location: 'Downtown'
  },
  {
    id: 2,
    title: 'Suburban Studio',
    description: 'Peaceful, bright studio on the outskirts',
    imageUrl: 'path-to-image-2.jpg',
    price: '$800/mo',
    bedrooms: 1,
    bathrooms: 1,
    area: 500,
    location: 'Suburbs'
  },
  {
    id: 3,
    title: 'Modern City Apartment',
    description: 'Contemporary living with a stunning view',
    imageUrl: 'path-to-image-3.jpg',
    price: '$1,500/mo',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    location: 'Downtown'
  },
  // {
  //   id: 4,
  //   title: 'Charming Country House',
  //   description: 'Spacious and serene in a beautiful rural setting',
  //   imageUrl: 'path-to-image-4.jpg',
  //   price: '$2,000/mo',
  //   bedrooms: 4,
  //   bathrooms: 3,
  //   area: 2000,
  //   location: 'Countryside'
  // },
  // {
  //   id: 5,
  //   title: 'Beachside Bungalow',
  //   description: 'A tranquil retreat by the sea',
  //   imageUrl: 'path-to-image-5.jpg',
  //   price: '$2,500/mo',
  //   bedrooms: 3,
  //   bathrooms: 2,
  //   area: 1500,
  //   location: 'Beachfront'
  // },
  // {
  //   id: 6,
  //   title: 'Trendy Urban Flat',
  //   description: 'Hip and central, perfect for city enthusiasts',
  //   imageUrl: 'path-to-image-6.jpg',
  //   price: '$1,800/mo',
  //   bedrooms: 2,
  //   bathrooms: 2,
  //   area: 1100,
  //   location: 'City Center'
  // },
  // {
  //   id: 7,
  //   title: 'Luxurious Suburban Mansion',
  //   description: 'Elegance and comfort in a prestigious neighborhood',
  //   imageUrl: 'path-to-image-7.jpg',
  //   price: '$4,000/mo',
  //   bedrooms: 5,
  //   bathrooms: 4,
  //   area: 3000,
  //   location: 'Suburbs'
  // },
];


function FeaturedListings() {
  return (
    <section className="featured-listings">
      <h2>Featured Listings</h2>
      <div className="listings-container">
        {listings.map((listing) => (
          <div key={listing.id} className="listing">
            <img src={listing.imageUrl} alt={listing.title} />
            <h3>{listing.title}</h3>
            <p>{listing.description}</p>
            {/* Additional listing details */}
            <div className="listing-info">
              <p><strong>Price:</strong> {listing.price}</p>
              <p><strong>Bedrooms:</strong> {listing.bedrooms}</p>
              <p><strong>Bathrooms:</strong> {listing.bathrooms}</p>
              <p><strong>Area:</strong> {listing.area} sqft</p>
              <p><strong>Location:</strong> {listing.location}</p>
            </div>
            <button className="view-more">View More</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedListings;
