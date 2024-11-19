import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import {
    Box,
    Typography,
    Button,
    Rating,
    Card,
    CardContent,
    CardActions,
    List,
    ListItem,
    Divider,
    Checkbox,
    FormControlLabel,
    ButtonGroup,
    Slider,
    CardMedia
} from '@mui/material';
import Navbar from './Nav';
import { initializeApp } from 'firebase/app';
import { getDocs,getDoc, getFirestore, collection } from 'firebase/firestore';
import { firebaseConfig } from '../config';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const D2CComponent = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState({});
    const [sortOption, setSortOption] = useState('default');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [books, setBooks] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 10000]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const booksCollection = collection(db, 'Books');
                const booksSnapshot = await getDocs(booksCollection);
                const booksData = booksSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setBooks(booksData);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();
    }, []);

    const handleAddToCart = async (bookId) => {
        setCart((prev) => {
            const newCart = {
                ...prev,
                [bookId]: (prev[bookId] || 0) + 1,
            };

            // Update Firestore with the new cart state
            updateCartInFirestore(bookId, newCart[bookId]);
            return newCart;
        });
    };

    const handleQuantityChange = async (bookId, amount) => {
        setCart((prev) => {
            const newQuantity = Math.max(0, (prev[bookId] || 0) + amount);
            const newCart = {
                ...prev,
                [bookId]: newQuantity,
            };

            // Update Firestore with the new cart state
            updateCartInFirestore(bookId, newQuantity);
            return newCart;
        });
    };

    const updateCartInFirestore = async (bookId, quantity) => {
        try {
            const userEmail = localStorage.getItem('user'); // Assume user data is stored locally after login

            if (!userEmail) {
                alert("User Not exist! Redirecting to Login.....");
                navigate('/');
                return;
            }

            // Reference to the user's cart collection
            const userCartRef = doc(db, 'user', userEmail, 'cart', bookId);

            // Get the current cart data for the book
            const cartDocSnapshot = await getDoc(userCartRef);

            if (cartDocSnapshot.exists()) {
                // If the item exists in the cart, get the current quantity
                const currentQuantity = cartDocSnapshot.data().quantity || 0;
                const updatedQuantity = currentQuantity + quantity;

                if (updatedQuantity > 0) {
                    // Update or set the cart item in Firestore with the updated quantity
                    await setDoc(userCartRef, { quantity: updatedQuantity }, { merge: true });
                } else {
                    // Remove the item from Firestore if the updated quantity is 0 or less
                    await deleteDoc(userCartRef);
                }
            } else {
                // If the item doesn't exist in the cart, simply add it (only if quantity > 0)
                if (quantity > 0) {
                    await setDoc(userCartRef, { quantity, bookId });
                }
            }

        } catch (error) {
            console.error('Error updating cart in Firestore:', error);
        }
    };


    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((cat) => cat !== category)
                : [...prev, category]
        );
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const filteredBooks = books
        .filter((book) => {
            const isCategoryMatch = selectedCategories.length === 0 || selectedCategories.includes(book.category);
            const bookPrice = parseFloat(book.price);
            const isPriceInRange = bookPrice >= priceRange[0] && bookPrice <= priceRange[1];

            return isCategoryMatch && isPriceInRange;
        });

    const sortedBooks = [...filteredBooks].sort((a, b) => {
        if (sortOption === 'price') {
            const priceA = parseFloat(a.price);
            const priceB = parseFloat(b.price);
            return priceA - priceB;
        }
        return 0;
    });

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            <Box sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 1 }}>
                <Navbar />
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexGrow: 1,
                    paddingTop: '64px',
                }}
            >
                <Box
                    sx={{
                        borderRight: '1px solid #ccc',
                        padding: 2,
                        width: '200px',
                        backgroundColor: '#f9f9f9',
                        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
                        height: 'calc(100vh - 64px)',
                        overflowY: 'auto',
                        position: 'fixed',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Filter & Sort
                    </Typography>
                    <Divider sx={{ margin: '16px 0' }} />

                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Sort By:
                    </Typography>
                    <select
                        onChange={handleSortChange}
                        value={sortOption}
                        style={{ marginBottom: '16px', padding: '4px' }}
                    >
                        <option value="default">Default</option>
                        <option value="price">Price</option>
                    </select>

                    <Typography variant="body1" sx={{ fontWeight: 'bold', marginTop: 2 }}>
                        Price Range:
                    </Typography>
                    <Slider
                        value={priceRange}
                        onChange={handlePriceChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={10000}
                        sx={{ marginBottom: 2 }}
                    />

                    <Typography variant="body1" sx={{ marginTop: 2, fontWeight: 'bold' }}>
                        Genres:
                    </Typography>
                    <List>
                        {['Literature & Fiction', 'Science & Technology', 'History & Geography', 'Computers & IT', 'Educational', 'Arts & Crafts', 'Sports', 'Children & Teen', 'Psychology & Self-Help', 'Law & Government'].map(
                            (category) => (
                                <ListItem key={category} sx={{ padding: '4px 0' }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedCategories.includes(category)}
                                                onChange={() => handleCategoryChange(category)}
                                            />
                                        }
                                        label={category}
                                    />
                                </ListItem>
                            )
                        )}
                    </List>
                </Box>

                <Box
                    sx={{
                        flexGrow: 1,
                        padding: 2,
                        marginLeft: '240px',
                        overflowY: 'auto',
                        height: 'calc(100vh - 64px)',
                        borderLeft: '1px solid #ccc',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2,
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                    }}
                >
                    {sortedBooks.length === 0 ? (
                        <Typography variant="h6">No books found</Typography>
                    ) : (
                        sortedBooks.map((book) => (
                            <Card
                                key={book.id}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    padding: 2,
                                    maxWidth: '100%',
                                    minWidth: '300px',
                                    flex: '1 1 300px', // Makes cards responsive with a minimum width
                                    height: '300px', // Fixed height for consistent card sizes
                                    boxShadow: '2px 2px 10px rgba(0,0,0,0.1)',
                                    backgroundColor: 'transparent',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    },
                                }}
                            >
                                {/* Left Section - Image */}
                                <Box sx={{ width: '50%', position: 'relative' }}>
                                    <CardMedia
                                        component="img"
                                        image={book.image || 'default-image.jpg'}
                                        alt={book.name}
                                        sx={{
                                            objectFit: 'cover',
                                            borderRadius: 1,
                                            height: '100%',
                                        }}
                                    />
                                </Box>

                                {/* Right Section - Book Details */}
                                <Box sx={{ width: '50%', paddingLeft: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <CardContent sx={{ paddingBottom: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            {book.name}
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ color: 'gray' }}>
                                            by {book.author}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Publisher: {book.publisher}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            ISBN: {book.isbn}
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold', marginTop: 1 }}>
                                            ₹{book.price}
                                        </Typography>

                                        {/* Rating */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                                            <Rating name="read-only" value={book.rating || 4} readOnly />
                                        </Box>
                                    </CardContent>

                                    <CardActions sx={{ padding: '0 0 0 0' }}>
                                        {!cart[book.id] || cart[book.id] === 0 ? (
                                            <Button variant="contained" onClick={() => handleAddToCart(book.id)}>
                                                Add to Cart
                                            </Button>
                                        ) : (
                                            <ButtonGroup>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => handleQuantityChange(book.id, -1)}
                                                >
                                                    -
                                                </Button>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        display: 'inline-block',
                                                        minWidth: '30px',
                                                        textAlign: 'center',
                                                        lineHeight: '2.5',
                                                        border: '1px solid #ccc',
                                                        borderRadius: '4px',
                                                        margin: '0 5px',
                                                    }}
                                                >
                                                    {cart[book.id]}
                                                </Typography>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => handleQuantityChange(book.id, 1)}
                                                >
                                                    +
                                                </Button>
                                            </ButtonGroup>
                                        )}
                                    </CardActions>


                                </Box>
                            </Card>
                        ))
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default D2CComponent;
