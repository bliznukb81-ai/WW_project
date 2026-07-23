export default function ProductCard({ product, onClick }) {
  const isOutOfStock = product.availability === 'out_of_stock';
  
  let badgeText = null;
  let badgeColor = '';

  if (product.availability === 'preorder') {
    badgeText = 'Предзаказ';
    badgeColor = 'bg-blue-500 text-white';
  } else if (product.availability === 'low_stock') {
    badgeText = 'Осталось мало';
    badgeColor = 'bg-orange-500 text-white';
  }

  return (
    <div 
      onClick={isOutOfStock ? undefined : onClick}
      className={`w-full min-w-0 flex flex-col gap-2 group ${isOutOfStock ? 'cursor-default' : 'cursor-pointer'}`}
    >
      <div className="relative w-full aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden shrink-0">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className={`w-full h-full object-cover ${
            isOutOfStock 
              ? 'blur-md opacity-30' 
              : 'group-hover:scale-105 transition-transform duration-500'
          }`}
        />
        
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <span className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-widest text-center px-2">
              Нет в наличии
            </span>
          </div>
        )}
        
        {!isOutOfStock && badgeText && (
          <div className={`absolute top-2 left-2 px-2 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-lg z-10 ${badgeColor}`}>
            {badgeText}
          </div>
        )}

        {!isOutOfStock && product.discountPercent > 0 && (
          <div className="absolute bottom-2 left-2 px-2 py-1 text-[10px] md:text-xs font-bold bg-red-500 text-white rounded-lg z-10">
            -{product.discountPercent}%
          </div>
        )}
      </div>
      
      <div className={`flex flex-col truncate ${isOutOfStock ? 'opacity-50' : ''}`}>
        <h3 className="text-sm font-bold text-black leading-tight truncate">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mt-1">
          {product.discountedPrice ? (
            <>
              <span className="text-sm font-bold text-red-500">
                {product.discountedPrice} ₽
              </span>
              <span className="text-xs text-gray-400 line-through">
                {product.price} ₽
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-black">
              {product.price} ₽
            </span>
          )}
        </div>
      </div>
    </div>
  );
}