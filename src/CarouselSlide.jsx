import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const CarouselSlide = ({ title, description, background, buttonLink }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: { xs: '300px', md: '400px' },
        color: 'white',
        background,
        padding: 4,
        textAlign: 'center',
        margin: 0,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        {title}
      </Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>
        {description}
      </Typography>

      <Button
        variant="contained"
        color="secondary"
        sx={{ textTransform: 'none', px: 4, py: 1.5, fontSize: '1rem' }}
        href={buttonLink}
      >
        Shop Now
      </Button>
    </Box>
  );
};

export default CarouselSlide;
