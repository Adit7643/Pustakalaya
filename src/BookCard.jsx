import React from 'react';
import {
  Box,
  Typography,
  Rating,
  Chip
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import TimerIcon from '@mui/icons-material/Timer';

const BookCard = ({
  title,
  description,
  image,
  author,
  genre,
  rating,
  readTime = "~3 hrs",
  difficulty = "Beginner Friendly"
}) => {
  return (
    <Box
      sx={{
        padding: 2,
        margin: 1,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-10px)',
          boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
        },
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Genre Chip */}
      <Chip
        icon={<LocalOfferIcon />}
        label={genre}
        size="small"
        color="primary"
        variant="outlined"
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 4
        }}
      />

      {/* Book Image Container */}
      <Box
        sx={{
          height: '250px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          borderRadius: 2,
          mb: 2,
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Gradient Overlay */}
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

        {/* Image with controlled sizing */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
            overflow: 'hidden'
          }}
        >
          <img
            src={image}
            alt={title}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              zIndex: 2
            }}
          />
        </Box>
      </Box>

      {/* Book Details */}
      <Box
        sx={{
          textAlign: 'center',
          px: 2,
          flex: 1,
          position: 'relative',
          zIndex: 2
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            mb: 1,
            height: '50px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            background: 'linear-gradient(45deg, #3f51b5, #2196f3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            height: '60px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {description}
        </Typography>

        {/* Book Metadata */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight="bold">
            {author}
          </Typography>
        </Box>

        {/* Rating and Additional Info */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            mb: 2
          }}
        >
          <Rating
            name="book-rating"
            value={rating}
            precision={0.5}
            readOnly
          />
          <Typography variant="body2" color="text.secondary">
            ({rating})
          </Typography>
        </Box>

        {/* Additional Interesting Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            background: 'linear-gradient(45deg, rgba(63,94,251,0.1) 0%, rgba(252,70,107,0.1) 100%)',
            borderRadius: 2,
            p: 1.5,
            mb: 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <LocalLibraryIcon
              fontSize="small"
              color="primary"
            />
            <Typography variant="caption">
              {difficulty}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <TimerIcon
              fontSize="small"
              color="primary"
            />
            <Typography variant="caption">
              {readTime}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BookCard;