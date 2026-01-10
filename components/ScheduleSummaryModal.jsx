import React, { useMemo } from 'react';
import { X, Clock, Calendar, Users, MapPin, StickyNote, CheckCircle2 } from 'lucide-react';

const ScheduleSummaryModal = ({ meals, onClose }) => {
  
  // Agrupa as refeições para exibição no resumo
  const groupedMeals = useMemo(() => {
    const groups = {};
    
    meals.forEach(meal => {
      // Ignora refeições de datas específicas (Avulsas) se não quisermos misturar, 
      // mas mantendo a lógica de rotina semanal
      if (meal.dayOfWeek === 'Datas Marcadas') return;

      // Chave de agrupamento: groupId é o ideal.
      // Se não tiver groupId, usamos ID (único) ou Nome+Hora (para agrupar visuais idênticos).
      let key = meal.groupId;
      
      if (!key) {
        if (meal.dayOfWeek === 'Todos') {
            key = `todos-${meal.id}`;
        } else {
            // Tenta agrupar avulsos que parecem ser a mesma refeição (mesmo nome e hora)
            key = `${meal.name}-${meal.time}`;
        }
      }

      if (!groups[key]) {
        groups[key] = {
          representative: meal, // Guarda uma referência para pegar dados comuns (nome, hora, social)
          days: [],
          isEmpty: true, // Começa true, se achar algum prato cheio no grupo, vira false
          ids: []
        };
      }

      groups[key].days.push(meal.dayOfWeek);
      groups[key].ids.push(meal.id);
      
      // Se pelo menos uma refeição do grupo tem comida, o grupo não está "Vazio"
      if (meal.plate && meal.plate.length > 0) {
        groups[key].isEmpty = false;
      }
    });

    // Converte para array e ordena por horário
    return Object.values(groups).filter(g => !g.isEmpty).sort((a, b) => {
      return a.representative.time.localeCompare(b.representative.time);
    });
  }, [meals]);

  const formatDays = (days) => {
    if (days.includes('Todos')) return 'TODOS';
    
    // Ordena dias da semana
    const weekOrder = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    const sortedDays = [...new Set(days)].sort((a, b) => weekOrder.indexOf(a) - weekOrder.indexOf(b));
    
    if (sortedDays.length === 7) return 'TODOS';

    return sortedDays.map(d => d.substring(0, 3).toUpperCase()).join(' • ');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <style>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
      
      <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-sm max-h-[70vh] flex flex-col overflow-hidden animate-slide-up border-4 border-gray-200 dark:border-gray-800">
        {/* Header Tech */}
        <div className="p-4 bg-white dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500"></div>
          <div>
            <h2 className="text-lg font-black text-gray-800 dark:text-white tracking-tight uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Painel de Agenda
            </h2>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Visão Geral do Planejamento</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-gray-500 hover:text-rose-500 rounded-xl transition-all active:scale-95"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Lista de Cards */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-100 dark:bg-black/20">
          {groupedMeals.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50">
                <Calendar size={64} strokeWidth={1} className="mb-4" />
                <p className="font-bold text-sm">Nenhum agendamento com alimentos.</p>
            </div>
          ) : (
            groupedMeals.map((group, index) => {
              const { representative, days } = group;
              
              // Estilos (Sempre Ativo agora, pois filtramos vazios)
              const cardBaseClass = "relative p-3 rounded-2xl border-2 transition-all duration-300 group overflow-hidden";
              const activeClass = "bg-white dark:bg-gray-800 border-emerald-400 dark:border-emerald-500 shadow-[0_4px_20px_-5px_rgba(16,185,129,0.3)]";

              return (
                <div 
                  key={index} 
                  className={`${cardBaseClass} ${activeClass}`}
                >
                  {/* Decorative corner accent for active cards */}
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-emerald-400/20 rounded-full blur-xl"></div>

                  {/* Cabeçalho do Card: Hora e Dias */}
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-900/50 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700">
                        <Clock size={14} className="text-emerald-500" />
                        <span className="text-base font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                            {representative.time}
                        </span>
                    </div>
                    
                    <div className="px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider border bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                        {formatDays(days)}
                    </div>
                  </div>

                  {/* Conteúdo Principal: Nome */}
                  <div className="mb-3 pl-1 relative z-10">
                    <h3 className="text-base font-black uppercase tracking-tight leading-none text-gray-900 dark:text-white">
                        {representative.name}
                    </h3>
                  </div>

                  {/* Informações Sociais / Contexto */}
                  {(representative.withWhom || representative.eventLocation || representative.description) && (
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold relative z-10 text-gray-600 dark:text-gray-300">
                        {representative.withWhom && (
                            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 p-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                                <Users size={12} className="text-indigo-500" />
                                <span className="truncate">{representative.withWhom}</span>
                            </div>
                        )}
                        {representative.eventLocation && (
                            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 p-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                                <MapPin size={12} className="text-rose-500" />
                                <span className="truncate">{representative.eventLocation}</span>
                            </div>
                        )}
                        {representative.description && (
                            <div className="col-span-2 flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 p-1.5 rounded-lg border border-yellow-100 dark:border-yellow-800/30 text-yellow-700 dark:text-yellow-500">
                                <StickyNote size={12} />
                                <span className="truncate italic">{representative.description}</span>
                            </div>
                        )}
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3 z-0">
                    <CheckCircle2 size={20} className="text-emerald-500/10 dark:text-emerald-500/20" />
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {/* Footer */}
        <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <button onClick={onClose} className="w-full py-2.5 bg-gray-900 dark:bg-gray-700 text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition-transform active:scale-95 shadow-lg">
                Fechar Painel
            </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSummaryModal;