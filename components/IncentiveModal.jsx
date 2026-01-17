import React from 'react';
import { AlertTriangle } from 'lucide-react';

const IncentiveModal = ({ onClose, title, message }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-bounce text-center">
      <div className="bg-amber-400 p-6 flex justify-center">
        <div className="bg-white p-4 rounded-full shadow-lg">
          <AlertTriangle size={48} className="text-amber-500" />
        </div>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-black text-gray-800 mb-2">{title || "Não Desista!"}</h2>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">{message}</p>
        <button 
          onClick={onClose}
          className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold shadow-md hover:bg-amber-600 transition-transform active:scale-95"
        >
          Vou recuperar!
        </button>
      </div>
    </div>
  </div>
);

export default IncentiveModal;