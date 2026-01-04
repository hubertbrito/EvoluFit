import React from 'react';
import { X, ClipboardList, AlertCircle } from 'lucide-react';

const dayColors = {
  Segunda: 'bg-red-100 text-red-800 border border-red-200',
  Terça: 'bg-orange-100 text-orange-800 border border-orange-200',
  Quarta: 'bg-amber-100 text-amber-800 border border-amber-200',
  Quinta: 'bg-lime-100 text-lime-800 border border-lime-200',
  Sexta: 'bg-sky-100 text-sky-800 border border-sky-200',
  Sábado: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  Domingo: 'bg-purple-100 text-purple-800 border border-purple-200',
  Todos: 'bg-slate-200 text-slate-800 border border-slate-300',
  Avulso: 'bg-gray-100 text-gray-800 border border-gray-200',
};

const allWeekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

const ScheduleSummaryModal = ({ meals, onClose }) => {
  // 1. Filtra apenas por refeições que têm pratos montados
  const scheduledMeals = meals.filter(m => m.plate && m.plate.length > 0);

  // 2. Agrupa as refeições por nome e ID de grupo
  const summary = scheduledMeals.reduce((acc, meal) => {
    // Para refeições em grupo, a chave é o groupId. Para refeições únicas, é o ID da própria refeição.
    const key = meal.groupId || meal.id;

    if (!acc[key]) {
      acc[key] = {
        name: meal.name,
        days: [],
        time: meal.time,
      };
    }
    acc[key].days.push(meal.dayOfWeek);
    return acc;
  }, {});

  // 3. Converte o objeto agrupado em uma lista ordenada para exibição
  const summaryList = Object.values(summary)
    .map(group => {
      // Ordena os dias de acordo com a ordem da semana
      group.days.sort((a, b) => allWeekDays.indexOf(a) - allWeekDays.indexOf(b));
      return group;
    })
    // Ordena a lista final por nome da refeição e depois por horário
    .sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      if (a.time < b.time) return -1;
      if (a.time > b.time) return 1;
      return 0;
    });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } 
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes scale-bounce { 0% { transform: scale(0.95); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        .animate-scale-bounce { animation: scale-bounce 0.4s ease-out; }
      `}</style>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden animate-scale-bounce">
        <div className="p-4 border-b flex justify-between items-center bg-emerald-50">
          <h2 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
            <ClipboardList size={20} />
            Resumo da Agenda
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-emerald-100 rounded-full transition-colors text-emerald-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-3 overflow-y-auto space-y-2">
          {summaryList.length > 0 ? (
            summaryList.map((item, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded-lg border border-gray-200 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 truncate">
                   <span className="font-bold text-emerald-700 shrink-0">{item.time}</span>
                   <span className="font-semibold text-gray-600 truncate">{item.name}</span>
                </div>
                <div className="flex gap-1 flex-wrap justify-end shrink-0">
                  {item.days.map(day => (
                    <span key={day} className={`px-1.5 py-0.5 rounded text-[9px] font-black ${dayColors[day] || dayColors.Avulso}`}>
                      {day === 'Todos' ? 'TODOS' : day.substring(0, 3).toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400 flex flex-col items-center gap-4">
              <AlertCircle size={32} />
              <p className="font-bold">Nenhuma refeição com prato montado.</p>
              <p className="text-sm">Vá para a aba "Prato" para montar e agendar suas refeições.</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-transform active:scale-95 shadow-md">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSummaryModal;