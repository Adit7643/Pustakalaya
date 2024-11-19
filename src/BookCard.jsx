import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const BookCard = ({ image, title, author, buyLink }) => {
  return (
    <Card
      sx={{
        display: 'flex',
        borderRadius: 2,
        boxShadow: 3,
        margin: 0,
        overflow: 'hidden',
        maxWidth: 600,
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }}
    >
      {/* Left section: Book Image */}
      <CardMedia
        component="img"
        image={image}
        alt={title}
        sx={{
          width: '50%',
          height: 250,
          objectFit: 'cover',
        }}
      />

      {/* Right section: Book details */}
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 2,
          width: '50%',
        }}
      >
        {/* Book Title and Author */}
        <Box>
          <Typography variant="h6" component="div" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            by {author}
          </Typography>
        </Box>

        {/* Add to Cart Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: 'auto' }}>
          <Button
            variant="contained"
            color="primary"
            href={buyLink}
            startIcon={<ShoppingCartIcon />}
            sx={{ alignSelf: 'flex-end', fontSize:10 }}
          >
            Add to Cart
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BookCard;
