import React, { useState } from 'react';
import { X, Eraser } from 'lucide-react';

const ClearMealModal = ({ onClose, onConfirm, meal, contextDay, groupMembers }) => {
  const allWeekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  
  const daysForSelection = groupMembers 
    ? groupMembers.map(m => m.dayOfWeek).sort((a, b) => allWeekDays.indexOf(a) - allWeekDays.indexOf(b))
    : (meal.dayOfWeek === 'Todos' ? allWeekDays : [meal.dayOfWeek]);

  const isGroupAction = !!groupMembers || meal.dayOfWeek === 'Todos';

  const [selectedDays, setSelectedDays] = useState(
    contextDay && daysForSelection.includes(contextDay) ? [contextDay] : []
  );

  const toggleDay = (day) => {
    if (!isGroupAction) return;
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleConfirm = () => {
    if (selectedDays.length === 0) return alert('Selecione pelo menos um dia para limpar.');
    onConfirm(selectedDays);
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
        <div className="p-4 border-b bg-amber-50 flex justify-between items-center">
          <h3 className="font-bold text-amber-800 flex items-center gap-2">
            <Eraser size={20} /> Limpar Prato
          </h3>
          <button onClick={onClose}><X size={20} className="text-amber-600" /></button>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4 text-sm">
            Selecione os dias para limpar os alimentos de <strong>"{meal.name}"</strong>:
          </p>
          
          {isGroupAction && (
            <div className="flex gap-2 mb-4">
              <button onClick={() => setSelectedDays(daysForSelection)} className="flex-1 p-2 rounded-lg text-xs font-bold border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100">Limpar Todos</button>
              <button onClick={() => setSelectedDays([])} className="flex-1 p-2 rounded-lg text-xs font-bold border border-gray-200 text-gray-500 hover:bg-gray-50">Nenhum</button>
            </div>
          )}

          <div className="grid grid-cols-4 gap-2">
            {daysForSelection.map(day => (
              <button key={day} onClick={() => toggleDay(day)} disabled={!isGroupAction && day !== meal.dayOfWeek} className={`p-2 rounded-lg text-xs font-bold transition-colors ${selectedDays.includes(day) ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} ${(!isGroupAction && day !== meal.dayOfWeek) ? 'opacity-30 cursor-not-allowed' : ''}`}>
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-500 font-bold text-sm">Cancelar</button>
          <button onClick={handleConfirm} className="px-6 py-2 bg-amber-500 text-white rounded-lg font-bold text-sm shadow-md hover:bg-amber-600">Limpar</button>
        </div>
      </div>
    </div>
  );
};

export default ClearMealModal;