import React, { useState } from 'react';
import { Copy, X, AlertTriangle } from 'lucide-react';

const CloneDayModal = ({ sourceDay, onClose, onConfirm, mealSchedule }) => {
  const [targetType, setTargetType] = useState('weekday'); // 'weekday' | 'date'
  const [targetDay, setTargetDay] = useState('Segunda');
  const [targetDate, setTargetDate] = useState('');
  const [conflictCount, setConflictCount] = useState(null);

  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const handleNext = () => {
    const dayToCheck = targetType === 'weekday' ? targetDay : 'Datas Marcadas';
    const dateToCheck = targetType === 'date' ? targetDate : null;

    if (targetType === 'date' && !targetDate) return alert('Selecione uma data.');
    if (targetType === 'weekday' && targetDay === sourceDay) return alert('O dia de destino deve ser diferente da origem.');

    // Verifica se já existem refeições ESPECÍFICAS no destino (ignorando 'Todos')
    const existing = mealSchedule.filter(m => {
        if (m.dayOfWeek !== dayToCheck) return false;
        if (dayToCheck === 'Datas Marcadas') return m.specificDate === dateToCheck;
        return true;
    });

    if (existing.length > 0) {
        setConflictCount(existing.length);
    } else {
        onConfirm(dayToCheck, dateToCheck, 'replace');
        onClose();
    }
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
        <div className="p-4 border-b bg-indigo-50 flex justify-between items-center">
          <h3 className="font-bold text-indigo-800 flex items-center gap-2">
            <Copy size={20} /> Clonar Dia: {sourceDay}
          </h3>
          <button onClick={onClose}><X size={20} className="text-indigo-600" /></button>
        </div>
        
        <div className="p-6">
          {!conflictCount ? (
            <>
              <p className="text-sm text-gray-600 mb-4">Para onde deseja copiar as refeições de <strong>{sourceDay}</strong>?</p>
              
              <div className="flex gap-2 mb-4">
                <button onClick={() => setTargetType('weekday')} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${targetType === 'weekday' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-gray-500 border-gray-200'}`}>Dia da Semana</button>
                <button onClick={() => setTargetType('date')} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${targetType === 'date' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-gray-500 border-gray-200'}`}>Data Específica</button>
              </div>

              {targetType === 'weekday' ? (
                <div className="grid grid-cols-3 gap-2">
                  {days.map(day => (
                    <button 
                      key={day} 
                      onClick={() => setTargetDay(day)} 
                      disabled={day === sourceDay}
                      className={`p-2 rounded-lg text-xs font-bold transition-colors ${targetDay === day ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} ${day === sourceDay ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              ) : (
                <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full p-3 border rounded-xl bg-gray-50 text-gray-900" />
              )}
            </>
          ) : (
            <div className="text-center">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="text-amber-600" size={24} />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Conflito Encontrado</h4>
              <p className="text-sm text-gray-600 mb-6">
                O dia de destino já possui <strong>{conflictCount} refeições</strong> agendadas. O que deseja fazer?
              </p>
              <div className="flex flex-col gap-2">
                <button onClick={() => { onConfirm(targetType === 'weekday' ? targetDay : 'Datas Marcadas', targetDate, 'replace'); onClose(); }} className="w-full py-3 bg-rose-500 text-white rounded-xl font-bold text-sm hover:bg-rose-600">Substituir (Apagar existentes)</button>
                <button onClick={() => { onConfirm(targetType === 'weekday' ? targetDay : 'Datas Marcadas', targetDate, 'append'); onClose(); }} className="w-full py-3 bg-indigo-500 text-white rounded-xl font-bold text-sm hover:bg-indigo-600">Adicionar (Manter existentes)</button>
              </div>
            </div>
          )}
        </div>
        {!conflictCount && <div className="p-4 border-t bg-gray-50 flex justify-end gap-2"><button onClick={onClose} className="px-4 py-2 text-gray-500 font-bold text-sm">Cancelar</button><button onClick={handleNext} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm shadow-md hover:bg-indigo-700">Continuar</button></div>}
      </div>
    </div>
  );
};

export default CloneDayModal;