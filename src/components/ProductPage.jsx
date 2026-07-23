import { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { fetchProductById } from '../api/shopApi';
import { ChevronLeft, ChevronRight, ArrowLeft, Minus, Plus } from 'lucide-react';

export default function ProductPage({ productId, onBack }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const cartItems = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addToCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const data = await fetchProductById(productId);
      setProduct(data);
      setLoading(false);
    };
    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin w-10 h-10 border-4 border-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Товар не найден</h2>
        <button onClick={onBack} className="text-blue-500 underline">Вернуться в каталог</button>
      </div>
    );
  }

  const nextImage = () => setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));

  const handleAddToCart = () => {
    if (!selectedVariant && product.variants?.length > 0) return;
    addToCart(product, selectedVariant, 1);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 animate-fade-in w-full">
      
      <button 
        onClick={onBack}
        className="md:hidden flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-4"
      >
        <ArrowLeft className="w-5 h-5" /> Назад
      </button>

      {/* ГАЛЕРЕЯ */}
      <div className="w-full md:w-1/2">
        <button 
          onClick={onBack}
          className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-6 hover:text-gray-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Вернуться в каталог
        </button>

        <div className="bg-gray-50 rounded-3xl relative group overflow-hidden">
          <div className="relative aspect-square w-full">
            <img 
              src={product.images[currentImageIndex]} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            
            {product.images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {product.images.length > 1 && (
          <div className="flex gap-4 mt-4 overflow-x-auto scrollbar-none pb-2">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-colors ${
                  currentImageIndex === idx ? 'border-black' : 'borderrent'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full md:w-1/2 flex flex-col md:pt-12">
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4">{product.name}</h1>
        
        <div className="flex items-center gap-4 mb-8">
          {product.discountedPrice ? (
            <>
              <span className="text-3xl font-bold text-red-500">{product.discountedPrice} ₽</span>
              <span className="text-xl text-gray-400 line-through">{product.price} ₽</span>
              <span className="px-3 py-1 text-sm font-bold bg-red-500 text-white rounded-lg">-{product.discountPercent}%</span>
            </>
          ) : (
            <span className="text-3xl font-bold">{product.price} ₽</span>
          )}
        </div>

        {product.description && (
          <div 
            className="prose prose-gray mb-10"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )}

        <div className="mt-auto">
          {product.variants?.length > 0 && (
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-wider mb-4">Выберите размер</p>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => {
                  const isOutOfStock = variant.availability === 'out_of_stock';
                  const isSelected = selectedVariant?.id === variant.id;
                  
                  return (
                    <button
                      key={variant.id}
                      disabled={isOutOfStock}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-6 py-3 border-2 rounded-xl font-bold transition-all ${
                        isOutOfStock 
                          ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed opacity-50' 
                          : isSelected
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black border-gray-200 hover:border-black'
                      }`}
                    >
                      {variant.size || variant.color || 'Стандартный'}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {(() => {
            const hasVariants = product.variants?.length > 0;
            const isProductOutOfStock = product.availability === 'out_of_stock';
            const isSelectedVariantPreorder = selectedVariant?.availability === 'preorder';
            const isProductPreorder = !hasVariants && product.availability === 'preorder';
            
            const currentCartItem = cartItems.find(
              item => item.product.id === product.id && item.variant?.id === selectedVariant?.id
            );

            if (isProductOutOfStock) {
              return (
                <button disabled className="w-full py-5 bg-gray-100 text-gray-400 rounded-2xl font-bold uppercase tracking-widest cursor-not-allowed">
                  Нет в наличии
                </button>
              );
            }

            if (hasVariants && !selectedVariant) {
              return (
                <button disabled className="w-full py-5 bg-gray-100 text-gray-400 rounded-2xl font-bold uppercase tracking-widest cursor-not-allowed">
                  Выберите размер
                </button>
              );
            }

            if (currentCartItem) {
              return (
                <div className="flex items-center justi-transpafy-between w-full p-2 bg-gray-100 rounded-2xl h-[68px]">
            {currentCartItem ? (
              <div className="flex items-center justify-between w-full p-2 bg-gray-100 rounded-2xl h-[68px]">
                <button 
                  onClick={() => decreaseQuantity(selectedVariant?.id, product.id)}
                  className="h-full px-6 bg-white rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center shrink-0"
                >
                  <Minus className="w-5 h-5" />
                </button>
                
                <div className="flex flex-col items-center flex-1 mx-2">
                  <span className="text-xl font-bold leading-none">{currentCartItem.quantity}</span>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mt-1">В корзине</span>
                </div>
                
                <button 
                  onClick={() => increaseQuantity(selectedVariant?.id, product.id)}
                  disabled={currentCartItem.quantity >= 10}
                  className="h-full px-6 bg-white rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center shrink-0 disabled:opacity-50"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            ) : null}
            
                </div>
              );
            }

            const buttonText = (isSelectedVariantPreorder || isProductPreorder) ? 'Оформить предзаказ' : 'Добавить в корзину';

            return (
              <button 
                onClick={handleAddToCart}
                className="w-full py-5 bg-black text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors active:scale-[0.98] h-[68px]"
              >
                {buttonText}
              </button>
            );
          })()}
        </div>
      </div>
    </div>
  );
}