import { Routes, Route, useLocation } from 'react-router';
import { useEffect } from 'react';
import Navigation from './components/Navigation';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import CartDrawer from './components/shop/CartDrawer';
import HomePage from './routes/HomePage';
import ShopPage from './routes/ShopPage';
import ProductDetailPage from './routes/ProductDetailPage';
import CartPage from './routes/CartPage';
import AdminLayout from './routes/admin/AdminLayout';
import LoginPage from './routes/admin/LoginPage';
import DashboardPage from './routes/admin/DashboardPage';
import ProductsPage from './routes/admin/ProductsPage';
import OrdersPage from './routes/admin/OrdersPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <div className="relative bg-dark-bg min-h-screen noise-overlay">
      <ScrollToTop />

      {!isAdmin && <Navigation />}

      <main className="relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />

          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<OrdersPage />} />
          </Route>
        </Routes>
      </main>

      {!isAdmin && (
        <>
          <CartDrawer />
          <FloatingWhatsApp />
        </>
      )}
    </div>
  );
}
