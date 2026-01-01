import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle, Zap, Wheat, Droplets, CalendarDays, ArrowUp, ArrowDown, Trash2, Plus, Info, Eraser } from 'lucide-react';
import { UNIT_WEIGHTS, getFoodUnitWeight } from '../constants';

// Função auxiliar para formatar a quantidade e medida do alimento
const formatFoodQuantity = (quantity, measure, foodName) => {
  const qty = parseFloat(quantity);
  const meas = measure || 'unidade(s)';
  // Tenta calcular total se a medida começar com número (ex: "2 fatias")
  const match = meas.match(/^(\d+)\s+(.+)/);
  if (match && !isNaN(qty)) {
    const total = qty * parseInt(match[1], 10);
    return `${total} ${match[2]} de ${foodName}`;
  }
  return `${qty} ${meas} de ${foodName}`;
};

const ScheduleScreen = ({ meals, onUpdateMeals, allFoods, onAddMeal, onReorderMeal, onDeleteMeal, scheduleWarnings, onClearWarnings, unitWeights = UNIT_WEIGHTS }) => {
  const [now, setNow] = useState(new Date());
  const [activeDay, setActiveDay] = useState(() => {
    const daysMap = { 0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado' };
    return daysMap[new Date().getDay()];
  });
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => {
    const main = document.querySelector('main');
    if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const main = document.querySelector('main');
    if (!main) return;
    const handleScroll = () => setShowScrollTop(main.scrollTop > 300);
    main.addEventListener('scroll', handleScroll);
    return () => main.removeEventListener('scroll', handleScroll);
  }, []);

  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo', 'Todos', 'Avulso'];
  const currentTimeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const fixedMealNames = [
    'Café da Manhã', 
    'Lanche das 10h', 
    'Almoço', 
    'Chá das Três', 
    'Lanche das 17h', 
    'Jantar das 20h', 
    'Lanche das 22h', 
    'Ceia da Meia-noite'
  ];

  const updateMeal = (id, updates) => {
    onUpdateMeals(meals.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const calculateMealNutrients = (plate) => {
    return plate.reduce((acc, item) => {
      const food = allFoods.find(f => String(f.id) === String(item.foodId));
      if (!food) return acc;
      
      const qty = Number(item.quantity) || 0;
      const unitWeight = getFoodUnitWeight(food, item.unit);
      const weightFactor = (unitWeight * qty) / 100;

      return {
        calories: acc.calories + ((Number(food.calories) || 0) * weightFactor),
        protein: acc.protein + ((Number(food.protein) || 0) * weightFactor),
        carbs: acc.carbs + ((Number(food.carbs) || 0) * weightFactor),
        fat: acc.fat + ((Number(food.fat) || 0) * weightFactor),
        fiber: acc.fiber + ((Number(food.fiber) || 0) * weightFactor),
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };

  const filteredMeals = meals.filter(m => {
    if (activeDay === 'Todos') return m.dayOfWeek === 'Todos';
    
    // Se for o dia ativo, mostra sempre
    if (m.dayOfWeek === activeDay) return true;
    
    // Se for 'Todos', mostra APENAS SE NÃO houver um card específico com o mesmo nome neste dia
    // Isso evita cards duplicados (um vazio de 'Todos' e um preenchido de 'Segunda')
    return m.dayOfWeek === 'Todos' && !meals.some(om => om.dayOfWeek === activeDay && om.name === m.name);
  });

  return (
    <div className="p-4 space-y-6 pb-28">
      {scheduleWarnings && scheduleWarnings.length > 0 && (
        <div className="bg-amber-100 p-4 rounded-2xl border-2 border-dashed border-amber-400 flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                <h3 className="font-bold text-amber-900">Ajuste de Metas Necessário</h3>
            </div>
            <p className="text-xs text-amber-800">
                Seu perfil foi atualizado! O planejamento para <strong>{scheduleWarnings.join(', ')}</strong> não corresponde mais às suas novas metas calóricas.
            </p>
            <button onClick={onClearWarnings} className="text-xs font-bold text-amber-700 self-start bg-white border border-amber-200 px-3 py-1 rounded-md shadow-sm">
                Entendi
            </button>
        </div>
      )}

      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-4 px-4">
        {days.map(d => (
          <button 
            key={d}
            onClick={() => setActiveDay(d)}
            className={`flex-shrink-0 px-6 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${activeDay === d ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white text-indigo-400 border border-indigo-100 hover:bg-indigo-50'}`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="bg-blue-100 p-3 rounded-xl border border-blue-200 flex items-start gap-2 shadow-sm">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800">
          <strong>Dica:</strong> Renomeie, reordene ou exclua refeições. Clique em "+ Adicionar" para criar novos horários no dia selecionado.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tighter">Agenda {activeDay}</h2>
            <p className="text-emerald-600 font-bold text-[10px] uppercase flex items-center mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping mr-2"></span>
              Agora: {currentTimeStr}
            </p>
        </div>
      </div>

      <div className="space-y-4">
        {filteredMeals.map((meal, index) => {
          const [mealHour] = meal.time.split(':');
          const [currentHour] = currentTimeStr.split(':');
          const isCurrent = mealHour === currentHour && (activeDay === 'Todos' || activeDay === days[new Date().getDay()]);
          const isFixed = fixedMealNames.includes(meal.name);
          const nutrients = calculateMealNutrients(meal.plate);

          return (
            <div 
                key={meal.id} 
                className={`p-4 rounded-[2rem] border-2 transition-all relative overflow-hidden ${isCurrent ? 'bg-orange-50 border-orange-400 shadow-xl ring-4 ring-orange-400/10' : 'bg-white border-indigo-50 shadow-sm hover:border-orange-300'}`}
            >
              <div className="flex justify-between items-start mb-5 gap-3">
                <label className="flex items-center space-x-2 cursor-pointer group shrink-0 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 p-1.5 rounded-xl transition-colors shadow-sm">
                    <div className={`p-1.5 rounded-lg transition-colors ${isCurrent ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-indigo-600 shadow-sm'}`}>
                        <Clock size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-indigo-700 uppercase leading-none mb-0.5">Mudar Hora</span>
                      <input 
                          type="time" 
                          value={meal.time}
                          onChange={(e) => updateMeal(meal.id, { time: e.target.value })}
                          className="font-black text-sm bg-transparent border-none outline-none focus:ring-0 p-0 text-indigo-900 leading-none cursor-pointer appearance-none block"
                      />
                    </div>
                </label>
                
                <div className="flex flex-col items-end min-w-0 flex-1">
                  <label className="text-[10px] font-black text-indigo-300 uppercase mr-1 w-full text-right truncate">Nome da Refeição</label>
                  <input
                    type="text"
                    value={meal.name}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (isFixed && !fixedMealNames.includes(val)) {
                            alert("Não é permitido renomear refeições fixas.");
                            return;
                        }
                        if (fixedMealNames.includes(val) && !isFixed) {
                            alert("Este nome é reservado para refeições fixas.");
                            return;
                        }
                        updateMeal(meal.id, { name: val });
                    }}
                    placeholder="Ex: Chá das três"
                    className="text-right font-black text-indigo-900 text-xs uppercase tracking-tight bg-transparent border-none outline-none focus:ring-0 p-0 w-full min-w-[50px] max-w-full placeholder:text-indigo-200 placeholder:italic placeholder:font-normal placeholder:text-xs"
                  />
                  {nutrients.calories > 0 && (
                    <span className="text-orange-700 font-black text-xs tracking-tighter mt-1">{Math.round(nutrients.calories)} kcal</span>
                  )}
                </div>
              </div>

              {meal.plate.length > 0 ? (
                <div className="space-y-4 pt-4 border-t border-gray-100/50">
                    {/* Conteúdo do prato simplificado para JS */}
                    <div className="flex flex-wrap gap-2">
                        {meal.plate.map((p, i) => {
                            const food = allFoods.find(f => String(f.id) === String(p.foodId));
                            return (
                                <button 
                                    key={i} 
                                    onClick={() => {
                                        if (window.confirm(`Deseja remover "${food?.name}" desta refeição?`)) {
                                            const newPlate = meal.plate.filter((_, idx) => idx !== i);
                                            if (meal.dayOfWeek === 'Todos' && activeDay !== 'Todos') {
                                                const newMeal = { ...meal, id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, dayOfWeek: activeDay, plate: newPlate, isDone: false };
                                                onUpdateMeals([...meals, newMeal]);
                                            } else {
                                                updateMeal(meal.id, { plate: newPlate });
                                            }
                                        }
                                    }}
                                    className="bg-white border border-indigo-100 px-3 py-1.5 rounded-xl text-[11px] font-black text-indigo-600 shadow-sm hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors flex items-center gap-1 group"
                                    title="Clique para remover item"
                                >
                                    {food ? formatFoodQuantity(p.quantity, p.unit, food.name) : 'Item desconhecido'}
                                    <Trash2 size={10} className="text-indigo-200 group-hover:text-rose-500 transition-colors" />
                                </button>
                            );
                        })}
                    </div>
                    
                    <div className="bg-orange-50 rounded-3xl p-3 flex justify-around items-center border border-orange-100 shadow-inner">
                      <div className="flex flex-col items-center">
                        <Zap size={10} className="text-emerald-600 mb-0.5" />
                        <span className="text-[10px] font-black text-indigo-300 uppercase">Prot</span>
                        <span className="text-[11px] font-black text-emerald-700">{Math.round(nutrients.protein)}g</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Wheat size={10} className="text-amber-600 mb-0.5" />
                        <span className="text-[10px] font-black text-indigo-300 uppercase">Carb</span>
                        <span className="text-[11px] font-black text-amber-700">{Math.round(nutrients.carbs)}g</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Droplets size={10} className="text-blue-600 mb-0.5" />
                        <span className="text-[10px] font-black text-indigo-300 uppercase">Gord</span>
                        <span className="text-[11px] font-black text-blue-700">{Math.round(nutrients.fat)}g</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${meal.dayOfWeek === 'Todos' ? 'bg-blue-400' : 'bg-orange-500'}`}></span>
                        <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">{meal.dayOfWeek || 'Todos'}</span>
                      </div>
                    </div>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2 text-xs font-bold text-indigo-300 uppercase italic py-3 bg-indigo-50/50 rounded-2xl border border-dashed border-indigo-100">
                  <AlertCircle size={14}/>
                  <span>Vazio para {activeDay}</span>
                </div>
              )}

              <div className="flex justify-end items-center gap-2 mt-4 pt-3 border-t border-indigo-50">
                  <span className="text-[10px] font-bold text-indigo-200 uppercase mr-auto">Ações</span>
                  
                  <button onClick={() => onReorderMeal(meal.id, 'up', activeDay)} disabled={index === 0} className="p-2 bg-indigo-50 rounded-xl text-indigo-400 disabled:opacity-30 hover:bg-emerald-100 hover:text-emerald-600 transition-colors" title="Mover para cima">
                    <ArrowUp size={16} />
                  </button>
                  <button onClick={() => onReorderMeal(meal.id, 'down', activeDay)} disabled={index === filteredMeals.length - 1} className="p-2 bg-indigo-50 rounded-xl text-indigo-400 disabled:opacity-30 hover:bg-emerald-100 hover:text-emerald-600 transition-colors" title="Mover para baixo">
                    <ArrowDown size={16} />
                  </button>
                  
                  <button 
                    onClick={() => {
                        if (window.confirm('Deseja limpar todos os alimentos desta refeiçao?')) {
                            if (meal.dayOfWeek === 'Todos' && activeDay !== 'Todos') {
                                const newMeal = { ...meal, id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, dayOfWeek: activeDay, plate: [], isDone: false };
                                onUpdateMeals([...meals, newMeal]);
                            } else {
                                updateMeal(meal.id, { plate: [] });
                            }
                        }
                    }}
                    disabled={meal.plate.length === 0}
                    className="px-3 py-2 bg-amber-50 rounded-xl text-amber-500 disabled:opacity-30 hover:bg-amber-100 transition-colors flex items-center gap-1" 
                    title="Limpar Prato"
                  >
                    <Eraser size={16} />
                    <span className="text-[10px] font-bold">Limpar</span>
                  </button>

                  {!isFixed && (
                    <>
                      <div className="w-px h-6 bg-gray-100 mx-1"></div>
                      <button 
                        onClick={() => {
                          if (window.confirm('Tem certeza que deseja excluir esta refeição?')) {
                            onDeleteMeal(meal.id);
                          }
                        }} 
                        className="p-2 bg-rose-50 rounded-xl text-rose-500 hover:bg-rose-100 transition-colors" 
                        title="Excluir Refeição"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => onAddMeal(activeDay)}
        className="w-full mt-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-emerald-700 transition-colors"
      >
        <Plus className="w-4 h-4" /> Adicionar Refeição para {activeDay}
      </button>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-4 p-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-all z-30 animate-bounce"
          title="Voltar ao Topo"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ScheduleScreen;
