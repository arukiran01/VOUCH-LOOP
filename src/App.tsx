import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './views/Home';
import About from './views/About';
import Contact from './views/Contact';
import Terms from './views/Terms';
import Privacy from './views/Privacy';
import Stores from './views/Stores';
import GiftCards from './views/GiftCards';
import Auth from './views/Auth';
import Wallet from './views/Wallet';
import Cart from './views/Cart';
import Wishlist from './views/Wishlist';
import SellGiftCard from './views/SellGiftCard';
import Referrals from './views/Referrals';
import KYCVerification from './views/KYCVerification';
import TransactionDashboard from './views/TransactionDashboard';
import AdminView from './views/AdminView';
import MyVouchers from './views/MyVouchers';
import ProtectedRoute from './components/ProtectedRoute';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AppProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-900">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/stores" element={<Stores />} />
                <Route path="/gift-cards" element={<GiftCards />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/cart" element={<Cart />} />
                
                <Route path="/sell-gift-card" element={<ProtectedRoute requireKyc={true}><SellGiftCard /></ProtectedRoute>} />
                <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                <Route path="/my-vouchers" element={<ProtectedRoute><MyVouchers /></ProtectedRoute>} />
                <Route path="/referrals" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />
                <Route path="/kyc" element={<ProtectedRoute><KYCVerification /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><TransactionDashboard /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminView /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AppProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
