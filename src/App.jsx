import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Catalog from './components/Catalog';
import ProductPage from './components/ProductPage';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import ProfilePage from './components/ProfilePage';
import SuccessModal from './components/SuccessModal';
import { useUserStore } from './store/userStore';
import { useCartStore } from './store/cartStore';

function App() {
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [currentView, setCurrentView] = useState('catalog');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [checkoutAfterAuth, setCheckoutAfterAuth] = useState(false);

  const user = useUserStore((state) => state.user);
  const login = useUserStore((state) => state.login);
  const addOrder = useUserStore((state) => state.addOrder);
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (isCartOpen || isAuthOpen || isSuccessOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen, isAuthOpen, isSuccessOpen]);

  const handleGoHome = () => {
    setSelectedProductId(null);
    setCurrentView('catalog');
    setIsCartOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (username) => {
    login(`${username}@example.com`, username); 
    setIsAuthOpen(false);
    
    if (checkoutAfterAuth && cartItems.length > 0) {
      const totalPrice = cartItems.reduce(
        (sum, item) => sum + (item.product.discountedPrice || item.product.price) * item.quantity, 
        0
      );
      addOrder(cartItems, totalPrice);
      clearCart();
      setIsSuccessOpen(true);
    } else {
      setSelectedProductId(null);
      setCurrentView('profile');
    }
    
    setCheckoutAfterAuth(false);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar 
        onCartOpen={() => setIsCartOpen(true)} 
        onGoHome={handleGoHome} 
        onAuthOpen={() => setIsAuthOpen(true)}
        onOpenProfile={() => {
          if (!user) {
            setCheckoutAfterAuth(false);
            setIsAuthOpen(true);
          } else {
            setSelectedProductId(null);
            setCurrentView('profile');
          }
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <main className="px-4 py-8 max-w-5xl mx-auto w-full">
        {selectedProductId ? (
          <ProductPage productId={selectedProductId} onBack={() => setSelectedProductId(null)} />
        ) : currentView === 'profile' && user ? (
          <ProfilePage />
        ) : (
          <Catalog onProductClick={setSelectedProductId} searchQuery={searchQuery} />
        )}
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onOpenAuth={() => {
          setCheckoutAfterAuth(true);
          setIsAuthOpen(true);
        }}
        onOrderSuccess={() => setIsSuccessOpen(true)}
      />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={handleLogin} />
      <SuccessModal isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} />
    </div>
  );
}

export default App;