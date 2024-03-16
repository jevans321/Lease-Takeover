export interface Listing {
  city: string;
  id: number;
  imageUrl: string;
  rent: string;
  state: string;
  title: string;
}

export interface HomeProps {
  onSearch: (newListings: Listing[]) => void;
}