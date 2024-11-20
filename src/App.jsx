import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './Nav';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import OfferCarousel from "./OfferCarousel";
import BookSection from "./BookSection";
import SellerDashboard from "./SellerDashboard";
import D2CComponent from "./D2CComponent";
import Cart from "./Cart";
import Listing from "./Listing";
import RecommendedSection from "./RecommendedSection";
import Footer from "./Footer";
import Profile from "./Profile";
import Orders from "./Orders";
import UserOrders from "./UserOrders";

const App = () => {
  const isUserLoggedIn = true; // Set this based on actual auth status

  return (
    <Router>
      <Routes>
        {/* Home Route: Navbar and BookSection will show on this route */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <OfferCarousel />
              <BookSection />
              <RecommendedSection />
              <Footer />
            </>
          }
        />

        {/* Seller Route: Only SellerDashboard will show on this route */}
        <Route
          path="/sell"
          element={<SellerDashboard />}
        />
        <Route
          path="/buy"
          element={
            <>
              <D2CComponent />
            </>}
        />
        <Route
          path="/cart"
          element={
            <>
              <Navbar />
              <Cart />
            </>}
        />
        <Route
          path="/profile"
          element={
            <>
              <Navbar />
              <Profile />
            </>
          }
        />
        <Route
          path="/orders"
          element={
            <>
              <Orders />
            </>
          }
        />
        <Route
          path="/user_order"
          element={
            <>
              <Navbar />
              <UserOrders/>
            </>
          }
        />
        <Route
          path="/list"
          element={
            <>
              <Listing />
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
