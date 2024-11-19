import React from 'react';
import Slider from 'react-slick';
import { Box } from '@mui/material';
import CarouselSlide from './CarouselSlide';

const OfferCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
    pauseOnHover: true,
    arrows: false, // Hide arrows if not needed
  };

  return (
    <Box sx={{ width: '100%', margin: 0, padding: 0 }}>
      <Slider {...settings}>
        <CarouselSlide
          title="Big Diwali Sale!"
          description="Get up to 50% off on your favorite books!"
          background="linear-gradient(45deg, #FE6B8B, #FF8E53)"
          buttonLink="#shop"
        />
        <CarouselSlide
          title="New Year, New Books!"
          description="Flat 30% off on all newly released books!"
          background="linear-gradient(45deg, #2196F3, #21CBF3)"
          buttonLink="#shop"
        />
        <CarouselSlide
          title="Christmas Special!"
          description="Buy 2 Get 1 Free on selected categories!"
          background="linear-gradient(45deg, #66BB6A, #43A047)"
          buttonLink="#shop"
        />
      </Slider>
    </Box>
  );
};

export default OfferCarousel;
