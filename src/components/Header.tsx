import SearchBar from './SearchBar'; // Make sure the path is correct
import './header.css'; // Assuming styling is in this file

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <a href="/">YourLogo</a>
      </div>
      <nav className="navigation">
        <ul>
          <li><a href="/listings">Browse Listings</a></li>
          <li><a href="/post-listing">Post Listing</a></li>
          <li><a href="/how-it-works">How It Works</a></li>
          <li><a href="/contact">Contact Us</a></li>
        </ul>
      </nav>
      <SearchBar />
      <div className="user-authentication">
        <a href="/signin">Sign In/Sign Up</a>
      </div>
    </header>
  );
}

export default Header;
