import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, CircularProgress } from '@mui/material';
import { initializeApp } from 'firebase/app';
import { increment, getFirestore, collection, getDocs,getDoc, doc, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from '../config';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
            orderItems: data.orderItems || [], // Array of ordered items
            paymentId: data.paymentId,
            totalAmount: data.totalAmount,
            userEmail: data.userEmail,
            date: data.date,
            orderStatus: data.orderStatus || 'Pending', // Default to 'Pending' if not present
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
    const sellerDocSnap = await getDoc(orderDocRef);
    let monthlyEarnings = sellerDocSnap.data().monthly_earnings || Array(12).fill(0);
    orders.forEach((order) => {
      const orderDate = new Date(order.date); // Assuming order.date is a valid date string
      const monthIndex = orderDate.getMonth(); // Get the month index (0 for Jan, 1 for Feb, etc.)
      monthlyEarnings[monthIndex] += order.totalAmount; // Add the amount to the corresponding month
    });
    const sellerDocRef = doc(db,'sellers',sellerEmail);
    await updateDoc(sellerDocRef, { monthly_earnings: monthlyEarnings },{ merge:true });
    console.log(orders);

    try {
      await updateDoc(orderDocRef, { orderStatus: 'Delivered' });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: 'Delivered' } : order
        )
      );
      console.log('Order marked as delivered!');
      const sellerDocRef = doc(db,'sellers',sellerEmail);
      await updateDoc(sellerDocRef, {
        pending: increment(-1)
      }, { merge: true });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
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
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {orders.map((order) => (
          <Card
            key={order.id}
            sx={{
              width: '300px',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order ID: {order.id}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Buyer: {order.userEmail}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Payment ID: {order.paymentId}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Amount: ₹{order.totalAmount}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Date: {order.date}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Status: <strong>{order.orderStatus}</strong>
              </Typography>
              <Typography variant="body1" sx={{ marginTop: '10px' }}>
                Items:
              </Typography>
              {order.orderItems.map((item, index) => (
                <Box key={index} sx={{ marginBottom: '10px', paddingLeft: '10px' }}>
                  <Typography variant="body2" color="textSecondary">
                    - {item.name} by {item.author} (x{item.quantity})
                  </Typography>
                </Box>
              ))}
            </CardContent>
            {order.orderStatus !== 'Delivered' && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => markAsDelivered(order.id)}
                sx={{ alignSelf: 'center', marginTop: '10px' }}
              >
                Mark as Delivered
              </Button>
            )}
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Orders;
