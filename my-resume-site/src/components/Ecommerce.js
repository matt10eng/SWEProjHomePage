import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import '../ecommerce/Ecommerce.css';
import AmazonHeader from '../ecommerce/AmazonHeader';
import { AuthProvider } from '../ecommerce/AuthContext';
import { CartProvider } from '../ecommerce/CartContext';

// TODO: create these pages under src/ecommerce/
import ProductList from '../ecommerce/ProductList';
import ProductDetail from '../ecommerce/ProductDetail';
import CartPage from '../ecommerce/CartPage';
import OrdersList from '../ecommerce/OrdersList';
import OrderDetail from '../ecommerce/OrderDetail';
import Login from '../ecommerce/Login';
import Register from '../ecommerce/Register';
import CheckoutPage from '../ecommerce/CheckoutPage';
import TrackingPage from '../ecommerce/TrackingPage';
import ThankYouPage from '../ecommerce/ThankYouPage';

const Ecommerce = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <div className="ecommerce-page">
                    <AmazonHeader />
                    <div className="ecommerce-container">
                        <Routes>
                            <Route path="" element={<ProductList />} />
                            <Route path="products/:id" element={<ProductDetail />} />
                            <Route path="cart" element={<CartPage />} />
                            <Route path="checkout" element={<CheckoutPage />} />
                            <Route path="thankyou" element={<ThankYouPage />} />
                            <Route path="orders" element={<OrdersList />} />
                            <Route path="orders/:id" element={<OrderDetail />} />
                            <Route path="tracking" element={<TrackingPage />} />
                            <Route path="auth/login" element={<Login />} />
                            <Route path="auth/register" element={<Register />} />
                        </Routes>
                    </div>
                </div>
            </CartProvider>
        </AuthProvider>
    );
};

export default Ecommerce;

