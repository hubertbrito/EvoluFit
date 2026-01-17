import React from 'react';
import { X } from 'lucide-react';

const WhatsNewModal = ({ onClose, onOpenManual }) => {
  const features = [
    "📅 Arraste e Solte na Agenda: Reorganize suas refeições facilmente.",
    "📤 Compartilhar Cardápio: Envie seu planejamento do dia pelo WhatsApp.",
    "💡 Sugestão de Alimentos: Não achou algo? Sugira diretamente pelo app.",
    "🍎 Categoria 'Meus Alimentos': Seus itens personalizados agora têm casa própria.",
    "💧 Histórico de Água: Acompanhe sua hidratação nos últimos 7 dias.",
    "🗑️ Lixeira Inteligente: Exclua itens da dispensa ou alimentos personalizados."
  ];
  
  const newFoods = [
    "Saputi", "Tamarindo", "Pão de Batata", "Bolo de Milho", "Salgados de Festa", "Pratos Feitos", "E mais 50 itens!"
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-bounce">
        <div className="p-4 border-b bg-emerald-50 flex justify-between items-center">
          <h3 className="font-bold text-emerald-800 flex items-center gap-2">
            ✨ Novidades da Atualização
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-emerald-100 rounded-full transition-colors text-emerald-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="mb-4">
            <h4 className="font-bold text-emerald-700 mb-2 text-sm uppercase">Novas Funcionalidades</h4>
            <ul className="list-disc list-inside text-xs text-gray-600 space-y-1.5">
              {features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>

          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-xs text-blue-800 leading-relaxed">
            <strong>Dica:</strong> Consulte o <strong>Manual de Uso</strong> para aprender a usar todas essas novidades detalhadamente.
          </div>
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button 
            onClick={() => { onClose(); onOpenManual(); }}
            className="px-4 py-2 text-emerald-600 font-bold text-xs hover:bg-emerald-50 rounded-lg transition-colors"
          >
            Ver Manual
          </button>
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold text-xs hover:bg-emerald-700 transition-transform active:scale-95 shadow-md"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsNewModal;