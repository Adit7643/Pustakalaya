import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    Box,
    Typography,
    Divider,
    Button,
    ButtonGroup,
    IconButton,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { initializeApp } from 'firebase/app';
import { getDocs, increment, getFirestore, setDoc, deleteDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from '../config';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
// ... rest of your imports remain the same

const Cart = () => {
    // ... previous state and logic remain the same
    const userEmail = localStorage.getItem('user');
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');

    useEffect(() => {
        const fetchCartAndBookDetails = async () => {
            try {
                const cartRef = collection(db, 'user', userEmail, 'cart');
                const cartSnapshot = await getDocs(cartRef);

                const updatedCartItems = [];
                let total = 0;

                for (const docSnapshot of cartSnapshot.docs) {
                    const cartData = docSnapshot.data();
                    const { bookId, quantity } = cartData;

                    const bookRef = doc(db, 'Books', bookId);
                    const bookSnapshot = await getDoc(bookRef);

                    if (bookSnapshot.exists()) {
                        const bookData = bookSnapshot.data();
                        const { name, author, price, image, seller_email } = bookData;

                        updatedCartItems.push({
                            bookId,
                            name,
                            author,
                            price,
                            image,
                            quantity,
                            seller_email
                        });

                        total += price * quantity;
                    }
                }

                setCartItems(updatedCartItems);
                setTotalAmount(total);

            } catch (error) {
                console.error("Error fetching cart and book details:", error);
            }
        };

        const fetchAddresses = async () => {
            try {
                const addressCollection = collection(db, 'user', userEmail, 'savedAddress');
                const addressSnapshot = await getDocs(addressCollection);
                setAddresses(addressSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        };

        fetchAddresses();
        fetchCartAndBookDetails();
    }, [userEmail]);
    console.log(addresses);
    const handleQuantityChange = async (bookId, amount) => {
        setCartItems((prevItems) => {
            const updatedCartItems = prevItems.map((item) => {
                if (item.bookId === bookId) {
                    const updatedQuantity = Math.max(1, item.quantity + amount);
                    updateCartInFirestore(bookId, updatedQuantity);
                    return { ...item, quantity: updatedQuantity };
                }
                return item;
            });

            const total = updatedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
            setTotalAmount(total);
            return updatedCartItems;
        });
    };

    const updateCartInFirestore = async (bookId, quantity) => {
        try {
            if (!userEmail) {
                alert("User not found! Redirecting to login...");
                window.location.href = '/';
                return;
            }

            const userCartRef = doc(db, 'user', userEmail, 'cart', bookId);

            if (quantity > 0) {
                await setDoc(userCartRef, { bookId, quantity }, { merge: true });
            } else {
                await deleteDoc(userCartRef);
            }
        } catch (error) {
            console.error('Error updating cart in Firestore:', error);
        }
    };

    const handleRemoveItem = async (bookId) => {
        try {
            setCartItems((prevItems) => {
                const updatedCart = prevItems.filter(item => item.bookId !== bookId);
                updateCartInFirestore(bookId, 0);
                return updatedCart;
            });
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const handleProceedToPay = async () => {
        if (!userEmail) {
            alert("User not found! Redirecting to login...");
            window.location.href = '/';
            return;
        }

        const orderItems = cartItems.map(item => ({
            bookId: item.bookId,
            quantity: item.quantity,
            price: item.price,
            seller_email: item.seller_email
        }));

        const orderInfo = {
            cartItems: orderItems,
            totalAmount,
            userEmail,
            selectedAddress: selectedAddress || 'No address selected', // Use selected address or default
            date: new Date().toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            })
        };

        console.log(orderInfo);

        // Razorpay integration and Firestore logic omitted for brevity
        const options = {
            key: `${import.meta.env.VITE_RAZORPAY_KEY}`, // Your key here
            key_secret: `${import.meta.env.VITE_KEY_SECRET}`, // Your key secret here
            amount: totalAmount * 100, // Razorpay expects the amount in paise
            currency: "INR",
            name: "AdityaDev",
            description: "for testing purpose",
            handler: async function (response) {
                toast.success('Payment Successful');
                const paymentId = response.razorpay_payment_id;

                try {
                    // Store the order details in Firestore for each item in the cart
                    const groupedOrders = cartItems.reduce((acc, item) => {
                        const { seller_email } = item;
                        if (!acc[seller_email]) {
                            acc[seller_email] = [];
                        }
                        acc[seller_email].push(item);
                        return acc;
                    }, {});

                    // Store the order details in Firestore for each seller
                    for (const [sellerEmail, items] of Object.entries(groupedOrders)) {
                        const sellerOrderRef = doc(
                            db,
                            'sellers',
                            sellerEmail,
                            'orders',
                            `${userEmail}_${paymentId}`
                        );
                        const userDocRef = doc(
                            db,
                            'user',
                            userEmail,
                            'orders',
                            `${sellerEmail}_${paymentId}`
                        );
                        const sellerOrderDocRef = doc(db, 'sellers', sellerEmail);
                        await setDoc(sellerOrderDocRef, {
                            pending: increment(1)
                        }, { merge: true });

                        const totalSellerAmount = items.reduce(
                            (total, item) => total + item.price * item.quantity,
                            0
                        );

                        await setDoc(sellerOrderRef, {
                            orderItems: items, // Only items for this seller
                            totalAmount: totalSellerAmount, // Total for this seller
                            userEmail,
                            paymentId,
                            date: new Date().toLocaleString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                            }),
                        });
                        await setDoc(userDocRef, {
                            orderItems: items, // Only items for this seller
                            totalAmount: totalSellerAmount, // Total for this seller
                            userEmail,
                            paymentId,
                            date: new Date().toLocaleString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                            }),
                        });
                    }


                    console.log("Orders stored successfully!");

                    // Clear the cart after successful payment
                    const cartRef = collection(db, 'user', userEmail, 'cart');
                    const cartSnapshot = await getDocs(cartRef);

                    // Iterate through each document and set `quantity` to zero
                    for (const docSnapshot of cartSnapshot.docs) {
                        const docRef = doc(db, 'user', userEmail, 'cart', docSnapshot.id);
                        await deleteDoc(docRef);
                    }

                    console.log("Cart quantities reset successfully!");

                    setCartItems([]);
                    setTotalAmount(0);

                } catch (error) {
                    console.error("Error storing order in Firestore:", error);
                }
            },
            theme: {
                color: "#3399cc"
            }
        };

        const pay = new window.Razorpay(options);
        pay.open();
    };


    return (
        <Box sx={{ 
            flexGrow: 1, 
            padding: 3, 
            backgroundColor: '#f4f4f4', 
            minHeight: '100vh' 
        }}>
            <Grid container spacing={3}>
                {/* Left Side - Cart Items */}
                <Grid item xs={12} md={8}>
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            padding: 3, 
                            borderRadius: 2 
                        }}
                    >
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            marginBottom: 2 
                        }}>
                            <ShoppingCartCheckoutIcon 
                                sx={{ 
                                    marginRight: 2, 
                                    color: 'primary.main' 
                                }} 
                            />
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    fontWeight: 'bold', 
                                    color: 'text.primary' 
                                }}
                            >
                                Your Shopping Cart
                            </Typography>
                        </Box>

                        <Divider sx={{ marginBottom: 2 }} />

                        {cartItems.length === 0 ? (
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                height: 300 
                            }}>
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        color: 'text.secondary', 
                                        marginBottom: 2 
                                    }}
                                >
                                    Your cart is empty
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    color="primary"
                                    onClick={() => window.location.href = '/buy '}
                                >
                                    Continue Shopping
                                </Button>
                            </Box>
                        ) : (
                            cartItems.map((item) => (
                                <Card 
                                    key={item.bookId} 
                                    sx={{ 
                                        display: 'flex', 
                                        marginBottom: 2, 
                                        boxShadow: 1,
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.01)'
                                        }
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={item.image}
                                        alt={item.name}
                                        sx={{ 
                                            width: 150, 
                                            height: 200, 
                                            objectFit: 'cover' 
                                        }}
                                    />
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        flexGrow: 1, 
                                        padding: 2 
                                    }}>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography 
                                                variant="h6" 
                                                sx={{ fontWeight: 'bold' }}
                                            >
                                                {item.name}
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary"
                                            >
                                                by {item.author}
                                            </Typography>
                                            <Typography 
                                                variant="body1" 
                                                sx={{ 
                                                    fontWeight: 'bold', 
                                                    color: 'primary.main',
                                                    marginTop: 1 
                                                }}
                                            >
                                                ₹{item.price}
                                            </Typography>
                                        </CardContent>

                                        <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center' 
                                        }}>
                                            <ButtonGroup 
                                                variant="outlined" 
                                                size="small"
                                            >
                                                <Button 
                                                    onClick={() => handleQuantityChange(item.bookId, -1)}
                                                >
                                                    -
                                                </Button>
                                                <Typography 
                                                    sx={{ 
                                                        padding: '0 10px', 
                                                        display: 'flex', 
                                                        alignItems: 'center' 
                                                    }}
                                                >
                                                    {item.quantity}
                                                </Typography>
                                                <Button 
                                                    onClick={() => handleQuantityChange(item.bookId, 1)}
                                                >
                                                    +
                                                </Button>
                                            </ButtonGroup>
                                            <Typography 
                                                variant="subtitle1" 
                                                sx={{ fontWeight: 'bold' }}
                                            >
                                                ₹{item.price * item.quantity}
                                            </Typography>
                                            <IconButton 
                                                onClick={() => handleRemoveItem(item.bookId)} 
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Card>
                            ))
                        )}
                    </Paper>
                </Grid>

                {/* Right Side - Order Summary */}
                <Grid item xs={12} md={4}>
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            padding: 3, 
                            borderRadius: 2,
                            position: 'sticky',
                            top: 20
                        }}
                    >
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            marginBottom: 2 
                        }}>
                            <LocalShippingIcon 
                                sx={{ 
                                    marginRight: 2, 
                                    color: 'primary.main' 
                                }} 
                            />
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontWeight: 'bold', 
                                    color: 'text.primary' 
                                }}
                            >
                                Order Summary
                            </Typography>
                        </Box>

                        <Divider sx={{ marginBottom: 2 }} />

                        {cartItems.map((item) => (
                            <Box 
                                key={item.bookId} 
                                sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    marginBottom: 1 
                                }}
                            >
                                <Typography variant="body2">
                                    {item.name} x {item.quantity}
                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    ₹{item.price * item.quantity}
                                </Typography>
                            </Box>
                        ))}

                        <Divider sx={{ marginY: 2 }} />

                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            marginBottom: 2 
                        }}>
                            <Typography variant="subtitle1">Total Items</Typography>
                            <Typography variant="subtitle1">
                                {cartItems.reduce((total, item) => total + item.quantity, 0)}
                            </Typography>
                        </Box>

                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            marginBottom: 2 
                        }}>
                            <Typography 
                                variant="h6" 
                                sx={{ fontWeight: 'bold' }}
                            >
                                Total Amount
                            </Typography>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontWeight: 'bold', 
                                    color: 'primary.main' 
                                }}
                            >
                                ₹{totalAmount}
                            </Typography>
                        </Box>

                        <FormControl 
                            fullWidth 
                            variant="outlined" 
                            sx={{ marginBottom: 2 }}
                        >
                            <InputLabel id="address-select-label">
                                Select Delivery Address
                            </InputLabel>
                            <Select
                                labelId="address-select-label"
                                value={selectedAddress}
                                onChange={(e) => setSelectedAddress(e.target.value)}
                                label="Select Delivery Address"
                            >
                                {addresses.map((address) => (
                                    <MenuItem key={address.id} value={address}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                {address.addressName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {address.address}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                                <MenuItem value="">No Address Selected</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<ShoppingCartCheckoutIcon />}
                            onClick={handleProceedToPay}
                            sx={{
                                padding: 1.5,
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-3px)',
                                    boxShadow: 3
                                }
                            }}
                            disabled={cartItems.length === 0}
                        >
                            Proceed to Checkout
                        </Button>

                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                                marginTop: 2, 
                                textAlign: 'center' 
                            }}
                        >
                            Secure checkout with Razorpay
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Cart;