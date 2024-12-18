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
    ButtonGroup,
    Slider,
    CardMedia,
    IconButton
} from '@mui/material';
import Navbar from './Nav';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import ClearIcon from '@mui/icons-material/Clear';
import {
    Chip,
} from '@mui/material';
import { initializeApp } from 'firebase/app';
import { getDocs, getDoc, getFirestore, collection } from 'firebase/firestore';
import { firebaseConfig } from '../config';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { styled } from '@mui/material/styles';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

// Styled Wishlist Icon with Animation
const AnimatedWishlistIcon = styled(IconButton)(({ theme, isfavorite }) => ({
    transition: 'all 0.3s ease',
    color: isfavorite === 'true' ? theme.palette.error.main : theme.palette.grey[500],
    '&:hover': {
        transform: 'scale(1.2)',
        background: 'linear-gradient(45deg, rgba(255,0,0,0.1), rgba(255,0,0,0.2))',
    },
    '& .MuiIconButton-root': {
        transition: 'all 0.3s ease',
    },
}));


const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const D2CComponent = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState({});
    const [sortOption, setSortOption] = useState('default');
    const [books, setBooks] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [wishlist, setWishlist] = useState({});
    const location = useLocation();
    const selectedCategoryFromNavbar = location.state?.selectedCategory || null;

    // Initialize selectedCategories with the selectedCategory if it exists
    const [selectedCategories, setSelectedCategories] = useState(
        selectedCategoryFromNavbar ? [selectedCategoryFromNavbar] : []
    );

    useEffect(() => {
        if (location.state?.selectedCategory) {
            window.history.replaceState({}, document.title);
          }
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
        const fetchWishlist = async () => {
            try {
                const userEmail = localStorage.getItem('user');
                if (!userEmail) return;

                const wishlistRef = doc(db, 'user', userEmail);
                const wishlistSnapshot = await getDoc(wishlistRef);

                if (wishlistSnapshot.exists()) {
                    const wishlistData = wishlistSnapshot.data().wishlist || {};
                    setWishlist(wishlistData);
                }
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            }
        };

        fetchWishlist();
        fetchBooks();
    }, [location]);

    const handleWishlistToggle = async (book) => {
        try {
            const userEmail = localStorage.getItem('user');
            if (!userEmail) {
                alert("Please login to add to wishlist");
                return;
            }

            const wishlistRef = doc(db, 'user', userEmail, 'wishlist', book.id);

            setWishlist((prev) => {
                const newWishlist = { ...prev };

                if (newWishlist[book.id]) {
                    // Remove from wishlist
                    delete newWishlist[book.id];
                    deleteDoc(wishlistRef);
                } else {
                    // Add to wishlist
                    newWishlist[book.id] = book;
                    setDoc(wishlistRef, book);
                }

                return newWishlist;
            });
        } catch (error) {
            console.error('Error updating wishlist:', error);
        }
    };

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
        <>
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
                            borderRight: '1px solid #e0e0e0',
                            padding: 3,
                            maxWidth: 300,
                            backgroundColor: '#f7f9fc',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            height: 'calc(100vh - 64px)',
                            overflowY: 'auto',
                            borderRadius: '0 10px 10px 0',
                            '&::-webkit-scrollbar': {
                                width: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: '#f1f1f1',
                                borderRadius: '10px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: '#888',
                                borderRadius: '10px',
                            },
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: 3,
                            backgroundColor: '#e6f2ff',
                            padding: 2,
                            borderRadius: 2,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <FilterListIcon sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 'bold',
                                    color: 'primary.main',
                                    textTransform: 'uppercase',
                                    letterSpacing: 1
                                }}
                            >
                                Filters
                            </Typography>
                        </Box>

                        {/* Sort Section */}
                        <Box sx={{ marginBottom: 3 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 'bold',
                                    mb: 2,
                                    color: 'text.secondary',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <SortIcon sx={{ mr: 1, color: 'primary.main' }} />
                                Sort By
                            </Typography>

                            <ButtonGroup
                                variant="outlined"
                                fullWidth
                                sx={{
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    borderRadius: 2
                                }}
                            >
                                <Button
                                    variant={sortOption === 'default' ? 'contained' : 'outlined'}
                                    onClick={() => setSortOption('default')}
                                    sx={{ flexGrow: 1 }}
                                >
                                    Default
                                </Button>
                                <Button
                                    variant={sortOption === 'price' ? 'contained' : 'outlined'}
                                    onClick={() => setSortOption('price')}
                                    sx={{ flexGrow: 1 }}
                                >
                                    Price
                                </Button>
                            </ButtonGroup>
                        </Box>

                        {/* Price Range Section */}
                        <Box sx={{ marginBottom: 3 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 'bold',
                                    mb: 2,
                                    color: 'text.secondary',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <AttachMoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
                                Price Range
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 2
                            }}>
                                <Typography variant="body2" sx={{ mr: 2 }}>
                                    ₹{priceRange[0]}
                                </Typography>
                                <Slider
                                    value={priceRange}
                                    onChange={handlePriceChange}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={10000}
                                    sx={{
                                        color: 'primary.main',
                                        '& .MuiSlider-thumb': {
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                        }
                                    }}
                                />
                                <Typography variant="body2" sx={{ ml: 2 }}>
                                    ₹{priceRange[1]}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Genres Section */}
                        <Box>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 'bold',
                                    mb: 2,
                                    color: 'text.secondary',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <CategoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                                Genres
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1
                            }}>
                                {[
                                    'Literature & Fiction',
                                    'Science & Technology',
                                    'History & Geography',
                                    'Computers & IT',
                                    'Educational',
                                    'Arts & Crafts',
                                    'Sports',
                                    'Children & Teen',
                                    'Psychology & Self-Help',
                                    'Law & Government'
                                ].map((category) => (
                                    <Chip
                                        key={category}
                                        label={category}
                                        onClick={() => handleCategoryChange(category)}
                                        color={selectedCategories.includes(category) ? 'primary' : 'default'}
                                        variant={selectedCategories.includes(category) ? 'filled' : 'outlined'}
                                        sx={{
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>

                        {/* Reset Filters Button */}
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<ClearIcon />}
                                onClick={() => {
                                    setSelectedCategories([]);
                                    setPriceRange([0, 10000]);
                                    setSortOption('default');
                                }}
                                sx={{
                                    width: '100%',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                                    }
                                }}
                            >
                                Reset Filters
                            </Button>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            flexGrow: 1,
                            padding: 2,
                            overflowY: 'auto',
                            height: 'calc(100vh - 64px)',
                            borderLeft: '1px solid #ccc',
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr', // Single column on extra small screens
                                sm: 'repeat(2, 1fr)', // Two columns on small screens
                                md: 'repeat(2, 1fr)', // Two columns on medium screens
                                lg: 'repeat(3, 1fr)', // Three columns on large screens
                            },
                            gap: 2,
                            justifyContent: 'center',
                            alignItems: 'stretch',
                            '&::-webkit-scrollbar': {
                                display: 'none',
                            },
                        }}
                    >
                        {sortedBooks.length === 0 ? (
                            <Typography variant="h6" sx={{ gridColumn: 'span 4', textAlign: 'center' }}>
                                No books found
                            </Typography>
                        ) : (
                            sortedBooks.map((book) => (
                                <Card
                                    key={book.id}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        padding: 2,
                                        width: '100%', // Ensure full width of grid cell
                                        height: '300px', // Fixed height
                                        boxShadow: '2px 2px 10px rgba(0,0,0,0.1)',
                                        backgroundColor: 'transparent',
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                        },
                                    }}
                                >

                                    {/* Left Section - Image */}
                                    <Box sx={{
                                        width: '50%',
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'stretch'
                                    }}>
                                        <CardMedia
                                            component="img"
                                            image={book.image || 'default-image.jpg'}
                                            alt={book.name}
                                            sx={{
                                                objectFit: 'cover',
                                                borderRadius: 1,
                                                height: '100%',
                                                width: '100%'
                                            }}
                                        />
                                    </Box>

                                    {/* Right Section - Book Details */}
                                    <Box
                                        sx={{
                                            width: '50%',
                                            paddingLeft: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <AnimatedWishlistIcon
                                            isfavorite={(wishlist[book.id] ? 'true' : 'false')}
                                            onClick={() => handleWishlistToggle(book)}
                                            sx={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 12,
                                                background: 'rgba(255,255,255,0.7)',
                                                borderRadius: '50%',
                                            }}
                                        >
                                            {wishlist[book.id] ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                        </AnimatedWishlistIcon>
                                        <CardContent sx={{ paddingBottom: 1 }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {book.name}
                                            </Typography>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    color: 'gray',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
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
                                                <Button variant="contained" fullWidth onClick={() => handleAddToCart(book.id)}>
                                                    Add to Cart
                                                </Button>
                                            ) : (
                                                <ButtonGroup fullWidth>
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
            <Footer />
        </>
    );
};

export default D2CComponent;
