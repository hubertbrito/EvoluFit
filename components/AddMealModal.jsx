import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddMealModal = ({ onClose, onConfirm, title, buttonLabel, mealToEdit, context }) => {
  const [selectedDays, setSelectedDays] = useState(
    context && context !== 'Datas Marcadas' && context !== 'Todos' ? [context] : []
  );
  const [time, setTime] = useState(mealToEdit ? mealToEdit.time : '14:00');
  const [specificDate, setSpecificDate] = useState('');
  const [repeatCount, setRepeatCount] = useState(1);
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleConfirm = () => {
    if (context === 'Datas Marcadas') {
        if (!specificDate) return alert('Selecione uma data.');
        onConfirm(['Datas Marcadas'], time, specificDate, repeatCount);
    } else {
        if (selectedDays.length === 0) return alert('Selecione pelo menos um dia.');
        onConfirm(selectedDays, time);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } 
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes scale-bounce {
          0% { transform: scale(0.95); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-scale-bounce { animation: scale-bounce 0.4s ease-out; }
      `}</style>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-bounce">
        <div className="p-4 border-b bg-emerald-50 flex justify-between items-center">
          <h3 className="font-bold text-emerald-800">{title || "Adicionar Nova Refeição"}</h3>
          <button onClick={onClose}><X size={20} className="text-emerald-600" /></button>
        </div>
        <div className="p-6">
          {mealToEdit && (
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">Horário da Refeição</label>
              <input 
                  type="time" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white text-gray-900"
              />
            </div>
          )}
          
          {context === 'Datas Marcadas' ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Data Inicial</label>
                <input 
                    type="date" 
                    value={specificDate} 
                    onChange={(e) => setSpecificDate(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white text-gray-900"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Repetir por (dias)</label>
                <div className="flex items-center gap-3">
                    <input 
                        type="number" 
                        min="1" 
                        max="30"
                        value={repeatCount} 
                        onChange={(e) => setRepeatCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 p-2 border rounded-lg bg-white text-center font-bold text-emerald-600"
                    />
                    <span className="text-xs text-gray-500">
                        {repeatCount > 1 ? `Criar refeições até ${(() => {
                            if (!specificDate) return '...';
                            const d = new Date(specificDate + 'T00:00:00');
                            d.setDate(d.getDate() + repeatCount - 1);
                            return d.toLocaleDateString('pt-BR');
                        })()}` : 'Apenas nesta data'}
                    </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">Selecione os dias para esta refeição:</p>
              <div className="flex gap-2 mb-4">
                <button onClick={() => setSelectedDays(days)} className="flex-1 p-2 rounded-lg text-xs font-bold border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100">Todos os Dias</button>
                <button onClick={() => setSelectedDays([])} className="flex-1 p-2 rounded-lg text-xs font-bold border border-gray-200 text-gray-500 hover:bg-gray-50">Limpar</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {days.map(day => (
                  <button key={day} onClick={() => toggleDay(day)} className={`p-2 rounded-lg text-xs font-bold transition-colors ${selectedDays.includes(day) ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-500 font-bold text-sm">Cancelar</button>
          <button onClick={handleConfirm} className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm shadow-md hover:bg-emerald-700">{buttonLabel || "Criar"}</button>
        </div>
      </div>
    </div>
  );
};

export default AddMealModal;