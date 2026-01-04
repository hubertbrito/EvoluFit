import React from 'react';
import { X, CheckCircle } from 'lucide-react';

const FoodAddedModal = ({ foodName, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } 
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes scale-bounce { 0% { transform: scale(0.95); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        .animate-scale-bounce { animation: scale-bounce 0.4s ease-out; }
      `}</style>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-bounce">
        <div className="p-4 border-b bg-emerald-50 flex justify-between items-center">
          <h3 className="font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle size={20} />
            Alimento Adicionado!
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-emerald-100 rounded-full transition-colors text-emerald-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-gray-700 text-center">
            O alimento "<strong>{foodName}</strong>" foi adicionado com sucesso à sua dispensa!
          </p>
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-xs text-blue-800">
            <strong>Dica:</strong> Você pode encontrá-lo usando a busca ou no final da lista da categoria "Industrializados".
          </div>
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-transform active:scale-95 shadow-md"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodAddedModal;