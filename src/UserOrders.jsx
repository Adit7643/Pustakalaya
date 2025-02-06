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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from '../config';
import { useNavigate } from 'react-router-dom';
import SellerNavigation from './SellerNavigation';
import Footer from './Footer';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem('user');

    const fetchOrders = async () => {
      try {
        const sellerDocRef = collection(db, 'user', userEmail, 'orders');
        const ordersSnapshot = await getDocs(sellerDocRef);

        const ordersData = ordersSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            orderItems: data.orderItems || [],
            paymentId: data.paymentId,
            totalAmount: data.totalAmount,
            seller_email: [...new Set(data.orderItems.map((item) => item.seller_email))],
            date: data.date,
            orderStatus: data.orderStatus || 'Pending',
            image: data.image || '',
          };
        });

        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedOrder(null);
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
              Your Orders
            </Typography>
          </motion.div>

          {/* Loading State */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
              <CircularProgress size={60} thickness={4} color="secondary" />
            </Box>
          ) : orders.length === 0 ? (
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
                  No orders found
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', textAlign: 'center' }}>
                  Start exploring and place your first order!
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
              {orders.map((order) => (
                <motion.div
                  key={order.id}
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
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
                      },
                    }}
                  >
                    <CardContent sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600} color="primary">
                          Order ID: {order.id.slice(-6)}
                        </Typography>
                        {order.orderStatus === 'Delivered' ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <HourglassEmptyIcon color="warning" />
                        )}
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Seller: {order.seller_email}
                      </Typography>

                      <Typography variant="h6" fontWeight={700} color="primary">
                        Total: ₹{order.totalAmount}
                      </Typography>

                      {/* Order Items Preview */}
                      <Box sx={{ display: 'flex', gap: 1, mt: 2, overflow: 'auto' }}>
                        {order.orderItems.slice(0, 3).map((item, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: '8px',
                              overflow: 'hidden',
                            }}
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          </Box>
                        ))}
                        {order.orderItems.length > 3 && (
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: '8px',
                              backgroundColor: 'rgba(0,0,0,0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography variant="caption">
                              +{order.orderItems.length - 3}
                            </Typography>
                          </Box>
                        )}
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
                        onClick={() => handleOpenDialog(order)}
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

          {/* Order Details Dialog */}
          {selectedOrder && (
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
                Order Details
              </DialogTitle>
              <DialogContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1">
                    Order ID: <strong>{selectedOrder.id}</strong>
                  </Typography>
                  <Typography variant="subtitle1" color="primary">
                    Date: {selectedOrder.date}
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  Seller: {selectedOrder.seller_Email}
                </Typography>

                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  Total Amount: ₹{selectedOrder.totalAmount}
                </Typography>

                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Order Items:
                </Typography>

                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: 2
                }}>
                  {selectedOrder.orderItems.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        border: '1px solid rgba(0,0, 0,0.1)',
                        borderRadius: '12px',
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: 70,
                          height: 70,
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          by {item.author}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
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

export default UserOrders;