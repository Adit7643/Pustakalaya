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
  Tooltip,
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Box sx={{ padding: '20px', textAlign: 'center' }}>
        <Typography variant="h5">No orders found.</Typography>
      </Box>
    );
  }

  return (
    <>
      <SellerNavigation />
      <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', position: 'relative' }}>
        <IconButton
          onClick={handleBack}
          sx={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '50%',
            '&:hover': { backgroundColor: '#e0e0e0' },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            marginBottom: '20px',
            background: 'linear-gradient(90deg, #ff7e5f, #feb47b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'fadeIn 1s',
          }}
        >
          Your Orders
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {orders.map((order) => (
            <Card
              key={order.id}
              sx={{
                boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
                borderRadius: '10px',
                overflow: 'hidden',
                animation: 'fadeIn 0.8s ease-in-out',
                background: 'linear-gradient(145deg, #f5f5f5, #e3e3e3)',
                '&:hover': { transform: 'scale(1.02)', transition: '0.3s ease-in-out' },
              }}
            >
              
              <CardContent>
                <Typography variant="h6">Order ID: {order.id}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Buyer: {order.userEmail}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Amount: ₹{order.totalAmount}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  Status:{' '}
                  {order.orderStatus === 'Delivered' ? (
                    <CheckCircleIcon color="success" sx={{ marginLeft: '5px' }} />
                  ) : (
                    <HourglassEmptyIcon color="warning" sx={{ marginLeft: '5px' }} />
                  )}
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" color="primary" onClick={() => handleOpenDialog(order)}>
                  View Details
                </Button>
                {order.orderStatus !== 'Delivered' && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => markAsDelivered(order.id)}
                    sx={{ marginLeft: 'auto' }}
                  >
                    Mark as Delivered
                  </Button>
                )}
              </CardActions>
            </Card>
          ))}
        </Box>

        {selectedOrder && (
          <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
            <DialogTitle>Order Details</DialogTitle>
            <DialogContent>
              <Typography variant="h6">Order ID: {selectedOrder.id}</Typography>
              <Typography variant="body1">Buyer: {selectedOrder.userEmail}</Typography>
              <Typography variant="body1">Total Amount: ₹{selectedOrder.totalAmount}</Typography>
              <Typography variant="body1">Date: {selectedOrder.date}</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                {selectedOrder.orderItems.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                      padding: '10px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                    <Box>
                      <Typography variant="body2">{item.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        by {item.author}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default Orders;
