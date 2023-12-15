import { useState, useEffect } from 'react';
import axios from 'axios';
import './browseListings.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Listing {
  id: number;
  title: string;
  price: string;
  imageUrl: string;
}

function BrowseListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/listings`);
        setListings(response.data);
      } catch (error) {
        setError('Failed to load listings.');
        console.error('There was an error fetching the listings:', error);
      }
      setIsLoading(false);
    };

    fetchListings();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="browse-listings">
      <h1>Browse Listings</h1>
      <div className="listings-container">
        {listings.map(listing => (
          <div key={listing.id} className="listing-card">
            <img src={listing.imageUrl} alt={listing.title} />
            <h3>{listing.title}</h3>
            <p>{listing.price}</p>
            {/* Additional details can be added here */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BrowseListings;