import React, { useState } from 'react';
import Slider from 'react-slick';
import { Box, Typography, IconButton, Select, MenuItem } from '@mui/material';
import BookCard from './BookCard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Dummy data for books
const allBooks = [
  { title: "Cooking 101", description: "Learn to cook with simple recipes.", genre: "Cooking", image: "src/assets/book-1.jpg", buyLink: "#" },
  { title: "The Art of French Cooking", description: "A classic cookbook with French recipes.", genre: "Cooking", image: "src/assets/book-2.jpg", buyLink: "#" },
  { title: "Fantasy Adventures", description: "A journey through fantasy worlds.", genre: "Fiction", image: "src/assets/book-1.jpg", buyLink: "#" },
  { title: "Mystery of the Lost Island", description: "An intriguing mystery novel.", genre: "Mystery", image: "src/assets/book-3.jpg", buyLink: "#" },
  { title: "Healthy Eating", description: "A guide to healthy recipes.", genre: "Cooking", image: "src/assets/book-4.jpg", buyLink: "#" },
  { title: "Space Odyssey", description: "Exploring the universe.", genre: "Science Fiction", image: "src/assets/book-5.jpg", buyLink: "#" },
  // Add more book entries as needed...
];

const MostSellingBooks = () => {
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Filter books based on selected genre
  const filteredBooks = selectedGenre === 'All' 
    ? allBooks 
    : allBooks.filter(book => book.genre === selectedGenre);

  const settings = {
    dots: false,
    infinite: filteredBooks.length > 4, // Allow infinite scrolling only if more than 5 books
    speed: 500,
    slidesToShow: filteredBooks.length < 4 ? filteredBooks.length : 4, // Adjust slides to show based on count
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    nextArrow: <ArrowButton direction="right" />,
    prevArrow: <ArrowButton direction="left" />,
  };

  return (
    <Box sx={{ padding: '40px 20px', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Most Selling Books
      </Typography>
      <Select
        value={selectedGenre}
        onChange={(e) => setSelectedGenre(e.target.value)}
        displayEmpty
        sx={{ marginBottom: 2 }}
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="Cooking">Cooking</MenuItem>
        <MenuItem value="Fiction">Fiction</MenuItem>
        <MenuItem value="Mystery">Mystery</MenuItem>
        <MenuItem value="Science Fiction">Science Fiction</MenuItem>
      </Select>
      {filteredBooks.length > 0 && ( // Render slider only if there are filtered books
        <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto' }}>
          <Slider {...settings}>
            {filteredBooks.map((book, index) => (
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
      )}
      {filteredBooks.length === 0 && ( // Optional: show a message when no books are available
        <Typography variant="body1" color="text.secondary">
          No books available for this genre.
        </Typography>
      )}
    </Box>
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

export default MostSellingBooks;
