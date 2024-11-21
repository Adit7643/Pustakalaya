import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { firebaseConfig } from '../config';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem('user');

    const fetchWishlist = async () => {
      try {
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

  const handleBack = () => {
    navigate('/');
  };

  const handleOpenDialog = (book) => {
    setSelectedBook(book);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedBook(null);
  };

  const removeFromWishlist = async (bookId) => {
    try {
      const userEmail = localStorage.getItem('user');
      const wishlistDocRef = doc(db, 'user', userEmail, 'wishlist', bookId);
      
      await deleteDoc(wishlistDocRef);
      
      // Update local state
      setWishlist(prevWishlist => 
        prevWishlist.filter(book => book.docId !== bookId)
      );
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  return (
    <>
      <Box
        sx={{
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '100vh',
        }}
      >
        {/* Background Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '300px',
            background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
            clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)',
            zIndex: 0,
          }}
        />

        {/* Content Container */}
        <Box
          sx={{
            padding: { xs: '10px', sm: '20px' },
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <IconButton
              onClick={handleBack}
              sx={{
                position: 'absolute',
                top: { xs: '10px', sm: '20px' },
                left: { xs: '10px', sm: '20px' },
                zIndex: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </motion.div>

          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography
              variant="h4"
              sx={{
                textAlign: 'center',
                marginTop: '150px',
                marginBottom: '30px',
                fontWeight: 700,
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              My Wishlist
            </Typography>
          </motion.div>

          {/* Loading State */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
              <CircularProgress size={60} thickness={4} color="secondary" />
            </Box>
          ) : wishlist.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '60vh',
                  color: 'white',
                  background: 'linear-gradient(45deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))',
                  borderRadius: 3,
                  p: 4,
                }}
              >
                <Typography variant="h5" sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
                  Your wishlist is empty
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', textAlign: 'center' }}>
                  Start exploring and add books to your wishlist!
                </Typography>
              </Box>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '20px',
              }}
            >
              {wishlist.map((book) => (
                <motion.div
                  key={book.docId}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      background: 'linear-gradient(to right, #ffffff 0%, #f0f0f0 100%)',
                      borderRadius: '16px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      height: '350px', // Fixed height
                      width: '250px', // Fixed width
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
                      },
                    }}
                  >
                    <CardContent sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600} color="primary">
                          {book.name}
                        </Typography>
                        <IconButton onClick={() => removeFromWishlist(book.docId)} color="error">
                          <FavoriteIcon />
                        </IconButton>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Author: {book.author}
                      </Typography>

                      <Typography variant="h6" fontWeight={700} color="primary">
                        Price: ₹{book.price}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, mt: 2, overflow: 'hidden' }}>
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '8px',
                            overflow: 'hidden',
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
                        </Box>
                      </Box>
                    </CardContent>

                    <CardActions sx={{
                      justifyContent: 'center',
                      p: 2,
                      borderTop: '1px solid rgba(0,0,0,0.1)'
                    }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleOpenDialog(book)}
                        sx={{ borderRadius: '8px' }}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Book Details Dialog */}
          {selectedBook && (
            <Dialog
              open={dialogOpen}
              onClose={handleCloseDialog}
              fullWidth
              maxWidth="sm"
              PaperProps={{
                sx: {
                  borderRadius: '16px',
                }
              }}
            >
              <DialogTitle sx={{
                fontWeight: 700,
                color: 'primary.main',
                borderBottom: '1px solid rgba(0,0,0,0.1)'
              }}>
                Book Details
              </DialogTitle>
              <DialogContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1">
                    Book: <strong>{selectedBook.name}</strong>
                  </Typography>
                  <Typography variant="subtitle1" color="primary">
                    Price: ₹{selectedBook.price}
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  Author: {selectedBook.author}
                </Typography>

                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  border: '1px solid rgba(0,0, 0,0.1)',
                  borderRadius: '12px',
                }}>
                  <img
                    src={selectedBook.image}
                    alt={selectedBook.name}
                    style={{
                      width: 70,
                      height: 70,
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                  <Typography variant="body1" fontWeight={600}>
                    {selectedBook.name}
                  </Typography>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseDialog}
                  color="primary"
                  variant="contained"
                  sx={{ borderRadius: '8px' }}
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default Wishlist;