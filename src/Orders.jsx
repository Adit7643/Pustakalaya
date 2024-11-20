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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { initializeApp } from 'firebase/app';
import { increment, getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from '../config';
import { useNavigate } from 'react-router-dom';
import SellerNavigation from './SellerNavigation';
import Footer from './Footer';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const sellerEmail = localStorage.getItem('seller');

    const fetchOrders = async () => {
      try {
        const sellerDocRef = collection(db, 'sellers', sellerEmail, 'orders');
        const ordersSnapshot = await getDocs(sellerDocRef);

        const ordersData = ordersSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            orderItems: data.orderItems || [],
            paymentId: data.paymentId,
            totalAmount: data.totalAmount,
            userEmail: data.userEmail,
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

  const markAsDelivered = async (orderId) => {
    const sellerEmail = localStorage.getItem('seller');
    const orderDocRef = doc(db, 'sellers', sellerEmail, 'orders', orderId);

    try {
      await updateDoc(orderDocRef, { orderStatus: 'Delivered' });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: 'Delivered' } : order
        )
      );
      const sellerDocRef = doc(db, 'sellers', sellerEmail);
      await updateDoc(sellerDocRef, { pending: increment(-1) });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleBack = () => {
    navigate('/sell');
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
      <SellerNavigation />
      <Box
        sx={{
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative'
        }}
      >
        {/* Background Image Section */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '300px',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url(src/assets/orders.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(2px) brightness(0.5)', // Slight blur and darkening
              transform: 'scale(1.1)',
              zIndex: -1,
            },
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
          <IconButton
            onClick={handleBack}
            sx={{
              position: 'absolute',
              top: { xs: '10px', sm: '20px' },
              left: { xs: '10px', sm: '20px' },
              zIndex: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              color: 'black',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          {/* Page Title */}
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              marginTop: '150px',
              marginBottom: '30px',
              fontWeight: 700,
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0)',
            }}
          >
            Your Orders
          </Typography>

          {/* Loading State */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
              <CircularProgress size={60} thickness={4} color="secondary" />
            </Box>
          ) : orders.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '60vh',
                color: 'white',
              }}
            >
              <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
                No orders found
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)'
                },
                gap: { xs: '15px', sm: '20px' },
              }}
            >
              {orders.map((order) => (
                <Card
                  key={order.id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                    borderRadius: '16px',
                    transition: 'all 0.3s ease',
                    height: '350px',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
                    },
                    background: 'white',
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
                      Buyer: {order.userEmail}
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
                    justifyContent: 'space-between',
                    p: 2,
                    pt: 0,
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

                    {order.orderStatus !== 'Delivered' && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => markAsDelivered(order.id)}
                        sx={{ borderRadius: '8px' }}
                      >
                        Mark Delivered
                      </Button>
                    )}
                  </CardActions>
                </Card>
              ))}
            </Box>
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
                  Buyer: {selectedOrder.userEmail}
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
                        border: '1px solid rgba(0,0,0,0.1)',
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

export default Orders;