import React from 'react';
import Slider from 'react-slick';
import { Box, Typography, IconButton } from '@mui/material';
import BookCard from './BookCard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Book6 from './assets/book-6.jpg';
import Book7 from './assets/book-7.jpg';
import Book8 from './assets/book-8.jpg';
import Book9 from './assets/book-9.jpg';
import Book10 from './assets/book-10.jpg';

const RecommendedSection = () => {
  const books = [
    {
      title: "The Midnight Library",
      description: "A novel about life's infinite possibilities, exploring the choices we make and the paths not taken.",
      image: Book6,
      buyLink: "#",
      author: "Matt Haig",
      genre: "Fiction",
      rating: 4.5,
    },
    {
      title: "Atomic Habits",
      description: "A proven framework for improving every day, revealing how small changes can lead to remarkable results.",
      image: Book7,
      buyLink: "#",
      author: "James Clear",
      genre: "Self-Help",
      rating: 4.7,
    },
    {
      title: "The Psychology of Money",
      description: "Timeless lessons about wealth, greed, and happiness told through unique stories and memorable lessons.",
      image: Book8,
      buyLink: "#",
      author: "Morgan Housel",
      genre: "Finance",
      rating: 4.6,
    },
    {
      title: "Sapiens: A Brief History",
      description: "A thought-provoking exploration of human history, from the earliest human societies to the present.",
      image: Book9,
      buyLink: "#",
      author: "Yuval Noah Harari",
      genre: "History",
      rating: 4.8,
    },
    {
      title: "The Alchemist",
      description: "A magical story about the essential wisdom of listening to our hearts and following our dreams.",
      image: Book10,
      buyLink: "#",
      author: "Paulo Coelho",
      genre: "Fiction",
      rating: 4.5,
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
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ],
    nextArrow: <ArrowButton direction="right" />,
    prevArrow: <ArrowButton direction="left" />,
  };

  return (
    <Box 
      sx={{ 
        padding: { xs: '20px', sm: '40px', md: '80px' },
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Gradient Overlay */}
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(63,94,251,0.1) 0%, rgba(252,70,107,0.1) 100%)',
          zIndex: 1
        }}
      />

      <Typography 
        variant="h4" 
        sx={{
          textAlign: 'center',
          marginBottom: 4,
          fontWeight: 'bold',
          color: 'primary.main',
          position: 'relative',
          zIndex: 2,
          background: 'linear-gradient(45deg, #3f51b5, #2196f3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block'
        }}
      >
        What You Should Read
      </Typography>
      
      <Box 
        sx={{ 
          width: '100%',
          maxWidth: '85rem',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2
        }}
      >
        <Slider {...settings}>
          {books.map((book, index) => (
            <BookCard 
              key={index} 
              title={book.title} 
              description={book.description} 
              image={book.image} 
              buyLink={book.buyLink}
              author={book.author}
              genre={book.genre}
              rating={book.rating}
            />
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

// Arrow button component with gradient
const ArrowButton = ({ direction, onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        background: 'linear-gradient(45deg, #3f51b5, #2196f3)',
        color: 'white',
        position: 'absolute',
        top: '50%',
        zIndex: 10,
        [direction === 'left' ? 'left' : 'right']: '10px',
        transform: 'translateY(-50%)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.16)',
        '&:hover': {
          background: 'linear-gradient(45deg, #2196f3, #3f51b5)',
          transform: 'translateY(-50%) scale(1.1)',
        },
        transition: 'all 0.3s ease'
      }}
    >
      {direction === 'left' ? <ArrowBackIcon /> : <ArrowForwardIcon />}
    </IconButton>
  );
};

export default RecommendedSection;