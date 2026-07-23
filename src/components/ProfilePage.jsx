import { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { Package, Edit2, Check, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const user = useUserStore((state) => state.user);
  const updateName = useUserStore((state) => state.updateName);
  const logout = useUserStore((state) => state.logout);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');

  if (!user) return null;

  const handleSaveName = () => {
    if (editName.trim()) {
      updateName(editName);
      setIsEditing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in w-full">
      <h1 className="text-3xl font-black uppercase tracking-widest mb-8">Личный кабинет</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="bg-gray-50 p-6 rounded-3xl h-fit border border-gray-100">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Мой Профиль</p>
          
          <div className="mb-6">
            {isEditing ? (
              <div className="flex items-center gap-2 mb-1">
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-black transition-colors"
                />
                <button onClick={handleSaveName} className="p-2 bg-black text-white rounded-xl hover:bg-gray-800">
                  <Check className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between mb-1 group">
                <p className="text-xl font-bold truncate pr-2">{user.name}</p>
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="p-2 text-gray-400 hover:text-black hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-200 text-gray-500 font-bold rounded-xl hover:border-black hover:text-black transition-colors uppercase text-xs tracking-wider"
          >
            <LogOut className="w-4 h-4" /> Выйти из аккаунта
          </button>
        </div>

        <div className="md:col-span-2">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4" /> История заказов
          </p>
          
          {!user.orders || user.orders.length === 0 ? (
            <div className="bg-gray-50 rounded-3xl p-10 text-center text-gray-400 text-sm font-medium border border-gray-100">
              Вы еще ничего не заказывали
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {user.orders.map((order) => (
                <div key={order.id} className="border border-gray-100 rounded-3xl p-6 hover:border-gray-200 transition-colors shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-black uppercase tracking-wider text-sm">Заказ #{order.id}</p>
                      <p className="text-xs text-gray-400 mt-1">{order.date}</p>
                    </div>
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                      {order.status}
                    </span>
                  </div>
                  <div className="flex overflow-x-auto gap-3 py-3 scrollbar-none border-t border-b border-gray-50 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="w-14 h-14 shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-200" title={item.product.name}>
                        <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Сумма заказа:</span>
                    <span className="font-bold text-lg">{order.total} ₽</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}