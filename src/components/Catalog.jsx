import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard';
import { fetchProducts, fetchCategories } from '../api/shopApi';
import { AlertCircle } from 'lucide-react';

export default function Catalog({ onProductClick, searchQuery }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 12; 

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const loadCategories = async () => {
      const response = await fetchCategories();
      
      if (Array.isArray(response)) {
        setCategories(response);
      } else if (response && Array.isArray(response.items)) {
        setCategories(response.items);
      } else if (response && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    setProducts([]);
    setOffset(0);
    setTotal(0);
    setErrorMessage('');
  }, [selectedCategory, debouncedSearch]);

  useEffect(() => {
    const loadProducts = async () => {
      if (offset === 0) setLoading(true);
      else setLoadingMore(true);
      setErrorMessage('');

      try {
        const data = await fetchProducts({
          category: selectedCategory,
          search: debouncedSearch,
          limit: limit,
          offset: offset
        });
        
        if (!data || !data.items) {
          setProducts([]);
          setTotal(0);
          return;
        }

        if (offset === 0) {
          setProducts(data.items);
        } else {
          setProducts(prev => [...prev, ...data.items]);
        }
        setTotal(data.total || 0);
      } catch (error) {
        setErrorMessage('Сеть недоступна или произошла ошибка сервера. Попробуйте позже.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
    loadProducts();
  }, [selectedCategory, debouncedSearch, offset]);

  return (
    <div className="flex flex-col gap-6">
      
      <div className="flex overflow-x-auto gap-6 pb-2 text-sm font-medium text-gray-400 scrollbar-none">
        <button 
          onClick={() => setSelectedCategory('')}
          className={`whitespace-nowrap pb-1 transition-all ${
            selectedCategory === '' ? 'text-black border-b-2 border-black font-bold' : 'hover:text-black'
          }`}
        >
          Все
        </button>
        {categories.map((cat) => (
          <button 
            key={cat.id || cat.slug} 
            onClick={() => setSelectedCategory(cat.slug)}
            className={`whitespace-nowrap pb-1 transition-all ${
              selectedCategory === cat.slug ? 'text-black border-b-2 border-black font-bold' : 'hover:text-black'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {errorMessage && (
        <div className="flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium border border-red-100">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : products.length === 0 && !errorMessage ? (
        <div className="text-center py-20 text-gray-400 uppercase tracking-wider text-sm font-medium">
          Ничего не найдено
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {products.map((product, index) => (
              <ProductCard 
                key={`${product.id}-${index}`} 
                product={product} 
                onClick={() => onProductClick(product.id)} 
              />
            ))}
          </div>
          
          {products.length < total && !errorMessage && (
            <div className="flex justify-center mt-8">
              <button 
                onClick={() => setOffset(prev => prev + limit)}
                disabled={loadingMore}
                className="px-8 py-4 bg-gray-100 text-black rounded-xl font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {loadingMore ? 'Загрузка...' : 'Показать ещё'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}