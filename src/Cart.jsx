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
    InputLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { initializeApp } from 'firebase/app';
import { getDocs, increment, getFirestore, setDoc, deleteDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from '../config';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const Cart = () => {
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
        <Box sx={{ display: 'flex', padding: 3 }}>
            <Box sx={{ flexGrow: 1, marginRight: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                    Shopping Cart
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />

                {cartItems.length === 0 ? (
                    <Typography variant="body1">Your cart is empty.</Typography>
                ) : (
                    cartItems.map((item) => (
                        <Card key={item.bookId} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                            <CardMedia
                                component="img"
                                image={item.image}
                                alt={item.name}
                                sx={{ width: 100, height: 100, marginRight: 2 }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6">{item.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    by {item.author}
                                </Typography>
                                <Typography variant="body2">
                                    ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                                </Typography>
                                <ButtonGroup variant="outlined" size="small" sx={{ marginTop: 1 }}>
                                    <Button onClick={() => handleQuantityChange(item.bookId, -1)}>-</Button>
                                    <Typography sx={{ padding: '0 10px', minWidth: '30px', textAlign: 'center' }}>{item.quantity}</Typography>
                                    <Button onClick={() => handleQuantityChange(item.bookId, 1)}>+</Button>
                                </ButtonGroup>
                            </CardContent>
                            <CardActions>
                                <IconButton onClick={() => handleRemoveItem(item.bookId)} color="secondary">
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    ))
                )}
            </Box>

            <Box
                sx={{
                    width: 300,
                    padding: 2,
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    backgroundColor: '#fafafa'
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                    Price Details
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />

                {cartItems.map((item) => (
                    <Box key={item.bookId} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
                        <Typography variant="body2">{item.name}</Typography>
                        <Typography variant="body2">₹{item.price * item.quantity}</Typography>
                    </Box>
                ))}

                <Divider sx={{ marginY: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Total Amount</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>₹{totalAmount}</Typography>
                </Box>

                <FormControl fullWidth>
                    <InputLabel id="address-select-label">Select Address</InputLabel>
                    <Select
                        labelId="address-select-label"
                        value={selectedAddress}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                    >
                        {addresses.map((address) => (
                            <MenuItem key={address.id} value={address}>
                                {`${address.addressName}, ${address.address}`}
                            </MenuItem>
                        ))}
                        <MenuItem value="">None</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ marginTop: 2 }}
                    color="primary"
                    onClick={handleProceedToPay}
                >
                    Proceed to Pay
                </Button>
            </Box>
        </Box>
    );
};

export default Cart;
