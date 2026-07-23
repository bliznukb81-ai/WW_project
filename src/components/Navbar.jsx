import { ShoppingBag, User, Search, X } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../store/cartStore';

export default function Navbar({ onCartOpen, onGoHome, onAuthOpen, onOpenProfile, searchQuery, setSearchQuery }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const SearchInput = ({ className = "" }) => (
    <div className={`relative ${className}`}>
      <input 
        type="text"
        placeholder="Поиск..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-gray-100 border-none rounded-full pl-4 pr-10 py-2.5 text-base focus:outline-none focus:ring-1 focus:ring-black/10"
      />
      {searchQuery && (
        <button 
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-5xl mx-auto flex flex-col">
        
        <header className="py-3 px-4 relative h-16 flex items-center justify-between w-full">
          <h1 onClick={onGoHome} className="text-lg font-black uppercase tracking-widest cursor-pointer select-none shrink-0 text-black">
            WASE WORM
          </h1>
          
          <div className="flex items-center gap-1 sm:gap-3">
            
            <div className="relative flex items-center hidden md:flex">
              <div 
                className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out ${
                  isSearchOpen ? 'w-64 opacity-100 visible' : 'w-0 opacity-0 invisible pointer-events-none'
                }`}
              >
                <SearchInput />
              </div>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)} 
                className={`p-2 rounded-full transition-colors ${isSearchOpen ? 'bg-gray-100 text-black' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
            </div>

            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
              className={`p-2 rounded-full transition-colors md:hidden ${isSearchOpen ? 'bg-gray-100 text-black' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}
            >
              {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>

            <button onClick={onOpenProfile} className="p-2 text-gray-500 hover:text-black hover:bg-gray-50 rounded-full transition-colors">
              <User className="w-5 h-5" />
            </button>
            
            <button onClick={onCartOpen} className="p-2 text-gray-500 hover:text-black hover:bg-gray-50 rounded-full transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-black text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white animate-in fade-in zoom-in duration-200">
                  {cartCount}
                </span>
              )}
            </button>
            
          </div>
        </header>
        
        <div className={`md:hidden px-4 transition-all duration-300 ease-in-out overflow-hidden ${
          isSearchOpen ? 'h-14 opacity-100 pb-3' : 'h-0 opacity-0 pb-0'
        }`}>
          <SearchInput />
        </div>

      </div>
    </div>
  );
}