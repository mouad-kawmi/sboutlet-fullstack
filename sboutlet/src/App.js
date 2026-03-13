import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TopBanner from './components/TopBanner';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { AuthProvider } from './context/AuthContext';
import CartDrawer from './components/CartDrawer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Femme from './pages/Femme';
import Homme from './pages/Homme';
import Enfants from './pages/Enfants';
import Accessoires from './pages/Accessoires';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Register from './pages/Register';

// Wraps the storefront layout (hides Navbar/Footer on /admin)
const StoreLayout = () => {
  const { pathname } = useLocation();
  const isNoLayout = pathname.startsWith('/admin') || pathname === '/login' || pathname === '/register';

  if (isNoLayout) {
    return (
      <>
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ScrollToTop />
      <header className="sticky top-0 z-[100]">
        <TopBanner />
        <Navbar />
      </header>
      <CartDrawer />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/femme" element={<Femme />} />
          <Route path="/homme" element={<Homme />} />
          <Route path="/enfants" element={<Enfants />} />
          <Route path="/accessoires" element={<Accessoires />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <CartProvider>
          <Router>
            <StoreLayout />
          </Router>
        </CartProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
