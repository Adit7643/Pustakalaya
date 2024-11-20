import React from 'react';
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
      title: "The Silent Patient",
      description: "A gripping psychological thriller about a woman's act of violence against her husband, and the therapist obsessed with uncovering her mystery.",
      image: Book1Image,
      buyLink: "#",
      author: "Alex Michaelides",
      genre: "Psychological Thriller",
      rating: 4.3,
      readTime: "~4 hrs",
      difficulty: "Intermediate"
    },
    {
      title: "Atomic Habits",
      description: "Transform your life with tiny changes. Learn how small, consistent improvements can lead to remarkable results in personal and professional growth.",
      image: Book2Image,
      buyLink: "#",
      author: "James Clear",
      genre: "Self-Improvement",
      rating: 4.7,
      readTime: "~3 hrs",
      difficulty: "Beginner Friendly"
    },
    {
      title: "The Midnight Library",
      description: "A novel exploring the infinite possibilities of life through a library where each book represents a different path not taken.",
      image: Book3Image,
      buyLink: "#",
      author: "Matt Haig",
      genre: "Contemporary Fiction",
      rating: 4.5,
      readTime: "~5 hrs",
      difficulty: "Easy"
    },
    {
      title: "Sapiens: A Brief History",
      description: "A provocative exploration of human history, examining how Homo sapiens became the dominant species on the planet.",
      image: Book4Image,
      buyLink: "#",
      author: "Yuval Noah Harari",
      genre: "Non-Fiction History",
      rating: 4.8,
      readTime: "~6 hrs",
      difficulty: "Advanced"
    },
    {
      title: "The Psychology of Money",
      description: "Uncover the strange ways people think about money and how to make better sense of one of life's most important topics.",
      image: Book5Image,
      buyLink: "#",
      author: "Morgan Housel",
      genre: "Finance",
      rating: 4.6,
      readTime: "~3 hrs",
      difficulty: "Intermediate"
    },
    {
      title: "Where the Crawdads Sing",
      description: "A haunting coming-of-age story set in the marshlands of North Carolina, blending murder mystery with a tale of survival and love.",
      image: Book1Image,  // You might want to use a different image
      buyLink: "#",
      author: "Delia Owens",
      genre: "Literary Fiction",
      rating: 4.4,
      readTime: "~5 hrs",
      difficulty: "Intermediate"
    },
    {
      title: "The Alchemist",
      description: "A magical story about following your dreams and listening to your heart, following a young shepherd's transformative journey.",
      image: Book2Image,  // You might want to use a different image
      buyLink: "#",
      author: "Paulo Coelho",
      genre: "Philosophical Fiction",
      rating: 4.6,
      readTime: "~2 hrs",
      difficulty: "Easy"
    }
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
        Latest Trends
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
              readTime={book.readTime}
              difficulty={book.difficulty}
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

export default BookSection;