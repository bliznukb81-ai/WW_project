import { useCartStore } from '../store/cartStore';
import { useUserStore } from '../store/userStore';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, onOpenAuth, onOrderSuccess }) {
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  
  const addOrder = useUserStore((state) => state.addOrder);
  const user = useUserStore((state) => state.user);

  if (!isOpen) return null;

  const totalPrice = items.reduce(
    (sum, item) => sum + (item.product.discountedPrice || item.product.price) * item.quantity, 
    0
  );

  const handleCheckout = () => {
    if (items.length === 0) return;

    if (!user) {
      onClose(); 
      onOpenAuth(); 
      return;
    }

    addOrder(items, totalPrice);
    clearCart();
    onClose();
    
    onOrderSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <h2 className="text-lg font-black uppercase tracking-wider">Корзина</h2>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full font-bold">
                {items.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
                <ShoppingBag className="w-16 h-16 stroke-1 mb-4" />
                <p className="text-base font-bold uppercase tracking-wider text-black">Ваша корзина пуста</p>
                <p className="text-xs mt-1">Добавьте что-нибудь из каталога</p>
              </div>
            ) : (
              items.map((item) => {
                const uniqueKey = `${item.product.id}-${item.variant?.id || 'default'}`;
                const itemPrice = item.product.discountedPrice || item.product.price;

                return (
                  <div key={uniqueKey} className="flex gap-4 items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name} 
                      className="w-16 h-16 object-cover rounded-xl shrink-0 bg-white"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold truncate">{item.product.name}</h4>
                      {item.variant && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Размер: <span className="font-bold text-black">{item.variant.size || item.variant.color}</span>
                        </p>
                      )}
                      <p className="text-sm font-black mt-1">{itemPrice} ₽</p>
                    </div>

                    <div className="flex flex-col items-end justify-between h-full gap-3">
                      <button 
                        onClick={() => removeFromCart(item.variant?.id, item.product.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-gray-200">
                        <button 
                          onClick={() => decreaseQuantity(item.variant?.id, item.product.id)}
                          className="text-gray-500 hover:text-black"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => increaseQuantity(item.variant?.id, item.product.id)}
                          className="text-gray-500 hover:text-black"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-gray-100 p-6 bg-gray-50 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold uppercase tracking-wider text-gray-500">Итого:</span>
                <span className="text-2xl font-black">{totalPrice} ₽</span>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors active:scale-[0.98]"
              >
                Оформить заказ
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}