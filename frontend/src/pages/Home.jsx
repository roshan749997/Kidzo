import React from 'react';
import Collections from '../components/Collections';
import MobileBottomNav from '../components/MobileBottomNav';
import HeroSlider from '../components/HeroSlider';
import TickNTrackSections from '../components/TickNTrackSections';

const Home = () => {
  return (
    <div className="min-h-screen pt-0 pb-16 md:pb-0 mt-0">
      {/* Hero Slider */}
      <HeroSlider
        slides={[
          {
            desktop: 'https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765019607/Desktop_-_1_8_rkwkq3.svg',
            alt: 'TickNTrack - Premium Shoes & Watches Collection',
          },
          {
            desktop: 'https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765023578/Desktop_-_1_9_gvj1rs.svg',
            alt: 'Festive Offer - TickNTrack',
          },
        ]}
        mobileSrc="https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765263320/1aec5eeb-e4e1-447c-9a8a-04e915142ec7_kt2uq8_481909.png"
      />

      {/* TickNTrack Sections */}
      <TickNTrackSections />

      {/* Featured Collections */}

       
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default Home;
