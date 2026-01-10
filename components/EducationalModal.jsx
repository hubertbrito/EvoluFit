import React from 'react';
import { X, BookOpen } from 'lucide-react';

const EducationalModal = ({ title, message, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <style>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-bounce">
        <div className="p-4 border-b bg-green-50 dark:bg-green-900/20 flex justify-between items-center">
          <h3 className="font-bold text-green-800 dark:text-green-400 flex items-center gap-2"><BookOpen size={18}/> {title || "Dica Nutricional"}</h3>
          <button onClick={onClose} className="p-1 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-full transition-colors text-green-600 dark:text-green-400">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {message}
          </p>
        </div>
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-800 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold shadow-md hover:bg-green-700 transition-transform active:scale-95"
          >
            Entendi a Mudança
          </button>
        </div>
      </div>
    </div>
  );
};
export default EducationalModal;