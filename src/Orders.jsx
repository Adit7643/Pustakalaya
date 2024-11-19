import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { initializeApp } from 'firebase/app';
import { increment, getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from '../config';
import { useNavigate } from 'react-router-dom';
import { center } from '@cloudinary/url-gen/qualifiers/textAlignment';

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
      console.log('Order marked as delivered!');
      const sellerDocRef = doc(db, 'sellers', sellerEmail);
      await updateDoc(sellerDocRef, { pending: increment(-1) });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleBack = () => {
    navigate('/sell');
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
    <Box sx={{ padding: '', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      {/* Back Arrow and Cover Image */}
      <IconButton
        onClick={handleBack}
        sx={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '50%',
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Box
        sx={{
          backgroundImage: 'url(https://via.placeholder.com/1500x500)', // Replace with your actual cover image URL
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '200px',
          marginBottom: '20px',
          position: 'relative', // Ensure this container is positioned relative
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            position: 'absolute', // Absolutely position the title
            left: '20px',         // Position it to the left
            bottom: '20px',       // Position it at the bottom
            color: 'white',       // Ensure the text is visible
            fontWeight: 'bold',   // Add bold style for emphasis
            // Adjust the font size for responsiveness
            fontSize: {
              xs: '1.5rem',  // For extra-small screens (mobile)
              sm: '2rem',    // For small screens (tablet)
              md: '2.5rem',  // For medium screens (laptop)
            },
            // Add some padding for the text to not touch the edges on smaller screens
            padding: '0 10px',
          }}
        >
          Orders
        </Typography>
      </Box>

      <Box>
        {orders.map((order) => (
          <Accordion key={order.id} sx={{ marginBottom: '10px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: '#f5f5f5', padding: '10px' }}
            >
              <Typography variant="h6">Order ID: {order.id}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" gutterBottom>
                Buyer: {order.userEmail}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Amount: ₹{order.totalAmount}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Status: <strong>{order.orderStatus}</strong>
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleOpenDialog(order)}
                sx={{ marginTop: '10px' }}
              >
                View Details
              </Button>
              {order.orderStatus !== 'Delivered' && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => markAsDelivered(order.id)}
                  sx={{ marginTop: '10px', marginLeft: '10px' }}
                >
                  Mark as Delivered
                </Button>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>Order Details</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Order ID: {selectedOrder.id}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Buyer: {selectedOrder.userEmail}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Payment ID: {selectedOrder.paymentId}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Amount: ₹{selectedOrder.totalAmount}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Date: {selectedOrder.date}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Status: <strong>{selectedOrder.orderStatus}</strong>
            </Typography>
            <Typography variant="body1" sx={{ marginTop: '10px' }}>
              Items:
            </Typography>
            {selectedOrder.orderItems.map((item, index) => (
              <Box key={index} sx={{ marginBottom: '10px', paddingLeft: '10px' }}>
                <Typography variant="body2" color="textSecondary">
                  - {item.name} by {item.author} (x{item.quantity})
                </Typography>
              </Box>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Orders;
