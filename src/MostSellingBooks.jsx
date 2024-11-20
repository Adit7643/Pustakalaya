import React, { useState } from "react";
import Slider from "react-slick";
import { Box, Typography, IconButton, useMediaQuery, useTheme } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Book1 from './assets/book-1.jpg';
import Book2 from './assets/book-2.jpg';
import Book3 from './assets/book-3.jpg';
import Book4 from './assets/book-4.jpg';
import Book5 from './assets/book-5.jpg';
import Book6 from './assets/book-6.jpg';
import Book7 from './assets/book-7.jpg';
import Book8 from './assets/book-8.jpg';
import Book9 from './assets/book-9.jpg';
import Book10 from './assets/book-10.jpg';
import Book11 from './assets/book-11.jpg';
import Book12 from './assets/book-12.jpg';

// Dummy data for books
const allBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    publication: "Scribner",
    price: 12.99,
    image: Book1
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    publication: "J.B. Lippincott & Co.",
    price: 14.99,
    image: Book2
  },
  {
    title: "1984",
    author: "George Orwell",
    publication: "Penguin Books",
    price: 10.50,
    image: Book3
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    publication: "T. Egerton, Whitehall",
    price: 9.99,
    image: Book4
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    publication: "Little, Brown and Company",
    price: 11.25,
    image: Book5
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    publication: "Chatto & Windus",
    price: 13.75,
    image: Book6
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    publication: "George Allen & Unwin",
    price: 15.50,
    image: Book7
  },
  {
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    publication: "Ballantine Books",
    price: 10.99,
    image: Book8
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    publication: "HarperOne",
    price: 12.50,
    image: Book9
  },
  {
    title: "Animal Farm",
    author: "George Orwell",
    publication: "Secker and Warburg",
    price: 8.99,
    image: Book10
  },
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    publication: "Doubleday",
    price: 14.25,
    image: Book11
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    publication: "Chilton Books",
    price: 16.99,
    image: Book12
  },
  {
    title: "The Martian",
    author: "Andy Weir",
    publication: "Crown Publishing Group",
    price: 13.50,
    image: Book3
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    publication: "Harper",
    price: 17.99,
    image: Book4
  },
  {
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    publication: "Norstedts Förlag",
    price: 12.75,
    image: Book5
  }
];

const MostSellingBooks = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: isSmallScreen ? 1 : 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <ArrowButton direction="right" />,
    prevArrow: <ArrowButton direction="left" />,
    beforeChange: (current, next) => setCurrentSlide(next),
    cssEase: "ease-out",
  };

  return (
    <Box
      sx={{
        position: "relative",
        padding: "40px 20px",
        background: "linear-gradient(45deg, #f3e5f5, #e8eaf6)",
        overflow: "hidden",
      }}
    >
      {/* Section Title */}
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          mb: 5,
          fontWeight: "bold",
          color: "primary.main",
        }}
      >
        Most Selling Books
      </Typography>

      {/* Slider */}
      <Box sx={{ maxWidth: "1400px", margin: "0 auto" }}>
        <Slider {...settings}>
          {allBooks.map((book, index) => (
            <BookCard key={index} book={book} isActive={index === currentSlide} />
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

// Book Card Component
const BookCard = ({ book, isActive }) => {
  return (
    <Box
      sx={{
        padding: 2,
        textAlign: "center",
        transform: isActive ? "scale(1)" : "scale(0.9)",
        opacity: isActive ? 1 : 0.8,
        transition: "all 0.5s ease",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 4,
          padding: 3,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.2)",
            transform: "scale(1.05)",
          },
        }}
      >
        <Box
          sx={{
            height: { xs: "150px", sm: "200px" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            borderRadius: 2,
            mb: 2,
          }}
        >
          <img
            src={book.image}
            alt={book.title}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1rem", sm: "1.25rem" },
            mb: 1,
          }}
        >
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {book.author}
        </Typography>
        <Typography variant="subtitle1" color="primary">
          ${book.price.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

// Custom Arrow Button Component
const ArrowButton = ({ direction, onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        [direction === "left" ? "left" : "right"]: "20px",
        backgroundColor: "rgba(0,0,0,0.5)",
        color: "#fff",
        zIndex: 10,
        "&:hover": {
          backgroundColor: "rgba(0,0,0,0.7)",
        },
      }}
    >
      {direction === "left" ? <ArrowBackIcon /> : <ArrowForwardIcon />}
    </IconButton>
  );
};

export default MostSellingBooks;
