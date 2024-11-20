import React, { useEffect } from 'react';
import Slider from 'react-slick';
import { Box, Typography, IconButton } from '@mui/material';
import BookCard from './BookCard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Book1Image from './assets/book-1.jpg';
import Book2Image from './assets/book-2.jpg';
import Book3Image from './assets/book-3.jpg';
import Book4Image from './assets/book-4.jpg';
import Book5Image from './assets/book-5.jpg';

const BookSection = () => {
  const books = [
    {
      title: "Book Title 1",
      description: "Description of Book 1.",
      image: Book1Image,
      buyLink: "#",
    },
    {
      title: "Book Title 2",
      description: "Description of Book 2.",
      image: Book2Image,
      buyLink: "#",
    },
    {
      title: "Book Title 3",
      description: "Description of Book 3.",
      image: Book3Image,
      buyLink: "#",
    },
    {
      title: "Book Title 4",
      description: "Description of Book 4.",
      image: Book4Image,
      buyLink: "#",
    },
    {
      title: "Book Title 5",
      description: "Description of Book 5.",
      image: Book5Image,
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
      <Typography variant="h4" sx={{ paddingLeft: '80px', paddingTop: '80px', paddingBottom: 4, marginBottom: 0 }} gutterBottom>
        Latest Trends
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '85rem' }}>
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

export default BookSection;
