import React, { useEffect } from 'react';
import Slider from 'react-slick';
import { Box, Typography, IconButton } from '@mui/material';
import BookCard from './BookCard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const RecommendedSection = () => {
  const books = [
    {
      title: "Book Title 1",
      description: "Description of Book 1.",
      image: "src/assets/book-6.jpg", // Replace with actual image URL
      buyLink: "#",
    },
    {
      title: "Book Title 2",
      description: "Description of Book 2.",
      image: "src/assets/book-7.jpg", // Replace with actual image URL
      buyLink: "#",
    },
    {
      title: "Book Title 3",
      description: "Description of Book 3.",
      image: "src/assets/book-8.jpg", // Replace with actual image URL
      buyLink: "#",
    },
    {
      title: "Book Title 4",
      description: "Description of Book 4.",
      image: "src/assets/book-9.jpg", // Replace with actual image URL
      buyLink: "#",
    },
    {
      title: "Book Title 5",
      description: "Description of Book 5.",
      image: "src/assets/book-10.jpg", // Replace with actual image URL
      buyLink: "#",
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    nextArrow: <ArrowButton direction="right" />,
    prevArrow: <ArrowButton direction="left" />,
  };

  return (
    <>
    <Typography variant="h4" sx={{paddingLeft: '80px',paddingTop:'80px', paddingBottom:4, marginBottom:0}} gutterBottom>
        Recommended For You
      </Typography>
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
      }}
    >
      <Box sx={{ width: '100%',maxWidth:'85rem' }}>
        <Slider {...settings}>
          {books.map((book, index) => (
            <BookCard 
              key={index} 
              title={book.title} 
              description={book.description} 
              image={book.image} 
              buyLink={book.buyLink} 
            />
          ))}
        </Slider>
      </Box>
    </Box>
    </>
  );
};

// Arrow button component
const ArrowButton = ({ direction, onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        background: 'transparent',
        color: 'primary.main',
        position: 'absolute',
        top: '50%',
        [direction === 'left' ? 'left' : 'right']: '10px',
        transform: 'translateY(-50%)',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.5)',
        },
      }}
    >
      {direction === 'left' ? <ArrowBackIcon /> : <ArrowForwardIcon />}
    </IconButton>
  );
};

export default RecommendedSection;
