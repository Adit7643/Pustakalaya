import React, { useEffect, useState } from 'react';
import {
    Typography,
    Card,
    CardContent,
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
    CircularProgress,
} from '@mui/material';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const RecentOrdersCard = ({ sellerEmail }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (!sellerEmail) {
                    console.warn('Seller email not provided');
                    return;
                }

                const ordersCollectionRef = collection(db, 'sellers', sellerEmail, 'orders');
                const querySnapshot = await getDocs(ordersCollectionRef);

                const ordersData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log(ordersData);
                setOrders(ordersData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [sellerEmail]);

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">Recent Orders</Typography>
                <Box sx={{ mt: 2, maxHeight: 200, overflow: 'auto' }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : orders.length > 0 ? (
                        <List>
                            {orders.map((order) => (
                                <React.Fragment key={order.id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={`Order ID: ${order.id}`}
                                            secondary={`Products: ${order.orderItems.map(item => item.name).join(', ')}, Amount: ₹${order.totalAmount}, ${order.orderStatus || "Pending"}`}
                                            
                                             
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>

                    ) : (
                        <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                            No recent orders found.
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default RecentOrdersCard;
