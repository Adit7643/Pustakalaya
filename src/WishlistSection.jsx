import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../config';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const WishlistSection = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const userEmail = localStorage.getItem('user');
        if (!userEmail) {
          setLoading(false);
          return;
        }

        const wishlistRef = collection(db, 'user', userEmail, 'wishlist');
        const wishlistSnapshot = await getDocs(wishlistRef);

        const wishlistData = wishlistSnapshot.docs.map((doc) => ({
          ...doc.data(),
          docId: doc.id
        }));

        setWishlist(wishlistData);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (bookId) => {
    try {
      const userEmail = localStorage.getItem('seller');
      const wishlistDocRef = doc(db, 'user', userEmail, 'wishlist', bookId);
      
      await deleteDoc(wishlistDocRef);
      
      // Update local state
      setWishlist(prevWishlist => 
        prevWishlist.filter(book => book.id !== bookId)
      );
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (wishlist.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '300px',
        textAlign: 'center',
        p: 2
      }}>
        <Typography variant="h6" color="textSecondary">
          Your wishlist is empty
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Explore our collection and add books you love
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%', 
      px: { xs: 2, sm: 4, md: 6 },
      py: 4
    }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 4, 
          textAlign: 'center', 
          fontWeight: 700,
          color: 'primary.main'
        }}
      >
        My Wishlist
      </Typography>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {wishlist.map((book) => (
          <SwiperSlide key={book.id}>
            <Card 
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '400px',
                borderRadius: 3,
                boxShadow: 3,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              <Box 
                sx={{ 
                  position: 'relative', 
                  height: '250px', 
                  overflow: 'hidden' 
                }}
              >
                <img 
                  src={book.image} 
                  alt={book.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <IconButton
                  onClick={() => removeFromWishlist(book.id)}
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)'
                    }
                  }}
                >
                  <FavoriteIcon color="error" />
                </IconButton>
              </Box>

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 1, 
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {book.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mb: 1 }}
                >
                  by {book.author}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography 
                    variant="h6" 
                    color="primary" 
                    sx={{ fontWeight: 700 }}
                  >
                    ₹{book.price}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                  >
                    {book.category}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: 'center', p: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ borderRadius: 2 }}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default WishlistSection;