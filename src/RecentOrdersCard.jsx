import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    Avatar,
    Chip,
    Divider,
    IconButton,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import {
    LocalShipping as ShippingIcon,
    Visibility as ViewIcon,
    CheckCircle as CompleteIcon,
    Pending as PendingIcon,
} from '@mui/icons-material';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from '../config';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const getStatusColor = (status) => {
    switch (status) {
        case 'Delivered':
            return 'success.main';
        case 'Pending':
            return 'warning.main';
        default:
            return 'text.secondary';
    }
};

const getStatusIcon = (status) => {
    switch (status) {
        case 'Completed':
            return <CompleteIcon />;
        case 'Pending':
            return <PendingIcon />;
        case 'Shipped':
            return <ShippingIcon />;
        default:
            return null;
    }
};

const RecentOrdersCard = ({ sellerEmail }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
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
    }, [sellerEmail]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Card
            sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
                borderRadius: 3,
                padding: '16px',
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        Recent Orders
                    </Typography>
                    <Chip label={`Total: ${orders.length}`} color="primary" size="small" sx={{ fontWeight: 'bold' }} />
                </Box>

                {/* Scrollable Orders */}
                <Box
                    sx={{
                        maxHeight: 300, // Adjust height as needed
                        overflowY: 'auto',
                        pr: 1, // Padding to prevent scrollbar overlap
                    }}
                >
                    {orders.map((order, index) => (
                        <Box key={order.id} sx={{ mb: 2 }}>
                            <Grid container spacing={2} alignItems="center">
                                {/* Numbered Icon */}
                                <Grid item xs={2}>
                                    <Avatar
                                        sx={{
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            width: 40,
                                            height: 40,
                                        }}
                                    >
                                        {index + 1}
                                    </Avatar>
                                </Grid>
                                <Grid item xs={7}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                        Order #{order.id.slice(-6)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {order.userEmail} | {order.date}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        ₹{order.totalAmount.toFixed(2)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3} sx={{ textAlign: 'right' }}>
                                    <Chip
                                        icon={getStatusIcon(order.orderStatus)}
                                        label={order.orderStatus}
                                        color="primary"
                                        variant="outlined"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: getStatusColor(order.orderStatus),
                                            borderColor: getStatusColor(order.orderStatus),
                                        }}
                                    />
                                    <Tooltip title="View Order">
                                        <IconButton color="primary" sx={{ mt: 1 }}>
                                            <ViewIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <Divider sx={{ my: 1, opacity: 0.5 }} />
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};

export default RecentOrdersCard;
