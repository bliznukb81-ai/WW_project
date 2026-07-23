import { Check, X } from 'lucide-react';

export default function SuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
      />
      
      <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-black" strokeWidth={3} />
        </div>
        
        <h3 className="text-xl font-black uppercase tracking-wider mb-2">Заказ оформлен</h3>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Ваш заказ успешно создан. Отслеживать его статус и историю покупок можно в личном кабинете.
        </p>
        
        <button 
          onClick={onClose}
          className="w-full py-4 bg-black text-white rounded-xl font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors active:scale-[0.98]"
        >
          Отлично
        </button>
      </div>
    </div>
  );
}