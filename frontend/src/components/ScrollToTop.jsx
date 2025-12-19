import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 bg-pink-500 hover:bg-pink-600 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
          style={{
            backgroundColor: '#FF1493',
            boxShadow: '0 4px 12px rgba(255, 20, 147, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#FF69B4';
            e.target.style.boxShadow = '0 6px 16px rgba(255, 20, 147, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#FF1493';
            e.target.style.boxShadow = '0 4px 12px rgba(255, 20, 147, 0.4)';
          }}
        >
          <FaArrowUp className="text-lg" />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;




