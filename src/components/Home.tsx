import { HomeProps } from './utility/componentTypes';
import HeroSection from './HeroSection';
import FeaturedListings from './FeaturedListings';
import HowItWorks from './HowItWorks';
import Testimonials from './Testimonials';

function Home({ onSearch }: HomeProps) {
  return (
    <div>
      <HeroSection onSearch={onSearch} />
      <FeaturedListings />
      <HowItWorks />
      <Testimonials />
    </div>
  );
}

export default Home;
