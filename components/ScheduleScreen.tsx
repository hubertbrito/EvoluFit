
import React, { useEffect, useState } from 'react';
import { Clock, Trash2, AlertCircle, Info, Zap, Wheat, Droplets, Target, CalendarDays } from 'lucide-react';
import { MealSlot, FoodItem, DayOfWeek } from '../types';
import { MEASURE_GRAMS } from '../constants';

interface ScheduleProps {
  meals: MealSlot[];
  onUpdateMeals: (meals: MealSlot[]) => void;
  allFoods: FoodItem[];
}

const ScheduleScreen: React.FC<ScheduleProps> = ({ meals, onUpdateMeals, allFoods }) => {
  const [now, setNow] = useState(new Date());
  const [activeDay, setActiveDay] = useState<DayOfWeek>(() => {
    const daysMap: Record<number, DayOfWeek> = { 0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado' };
    return daysMap[new Date().getDay()];
  });

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const days: DayOfWeek[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo', 'Todos', 'Avulso'];
  const currentTimeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const updateMeal = (id: string, updates: Partial<MealSlot>) => {
    onUpdateMeals(meals.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const calculateMealNutrients = (plate: any[]) => {
    return plate.reduce((acc, item) => {
      const food = allFoods.find(f => f.id === item.foodId);
      if (!food) return acc;
      const weightFactor = (MEASURE_GRAMS[item.unit] * item.quantity * item.multiplier) / 100;
      return {
        calories: acc.calories + (food.calories * weightFactor),
        protein: acc.protein + (food.protein * weightFactor),
        carbs: acc.carbs + (food.carbs * weightFactor),
        fat: acc.fat + (food.fat * weightFactor),
        fiber: acc.fiber + (food.fiber * weightFactor),
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };

  // Filtramos as refeições para o dia ativo: o dia específico OU "Todos"
  const filteredMeals = meals.filter(m => m.dayOfWeek === activeDay || m.dayOfWeek === 'Todos');

  return (
    <div className="p-4 space-y-6 pb-28">
      {/* Navegação de Dias */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-4 px-4">
        {days.map(d => (
          <button 
            key={d}
            onClick={() => setActiveDay(d)}
            className={`flex-shrink-0 px-6 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${activeDay === d ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'}`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100 flex items-start space-x-3">
        <CalendarDays className="text-emerald-600 shrink-0 mt-0.5" size={18} />
        <p className="text-[11px] text-emerald-800 font-medium leading-tight">
          <strong>AGENDA SEMANAL:</strong> Você está vendo o planejamento de <strong>{activeDay}</strong>. Use o menu acima para alternar entre os dias e gerenciar sua semana.
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
        {filteredMeals.map(meal => {
          const [mealHour] = meal.time.split(':');
          const [currentHour] = currentTimeStr.split(':');
          const isCurrent = mealHour === currentHour && (activeDay === 'Todos' || activeDay === days[new Date().getDay()]);
          const nutrients = calculateMealNutrients(meal.plate);

          return (
            <div 
                key={meal.id} 
                className={`p-6 rounded-[2.5rem] border-2 transition-all relative ${isCurrent ? 'bg-emerald-50 border-emerald-400 shadow-xl ring-8 ring-emerald-400/5' : 'bg-white border-transparent shadow-sm hover:border-gray-100'}`}
            >
              <div className="flex justify-between items-start mb-5">
                <label className="flex items-center space-x-3 cursor-pointer group flex-1">
                    <div className={`p-2.5 rounded-2xl transition-colors ${isCurrent ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-gray-50 text-gray-300 group-hover:bg-emerald-100 group-hover:text-emerald-500'}`}>
                        <Clock size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-gray-400 uppercase ml-1">Relógio</span>
                      <input 
                          type="time" 
                          value={meal.time}
                          onChange={(e) => updateMeal(meal.id, { time: e.target.value })}
                          className="font-black text-2xl bg-transparent border-none outline-none focus:ring-0 p-0 text-gray-800 leading-none cursor-pointer appearance-none block"
                      />
                    </div>
                </label>
                
                <div className="flex flex-col items-end">
                  <label className="text-[8px] font-black text-gray-400 uppercase mr-1">Refeição</label>
                  <span className="text-right font-black text-gray-600 text-xs uppercase tracking-tight">{meal.name}</span>
                  {nutrients.calories > 0 && (
                    <span className="text-emerald-600 font-black text-lg tracking-tighter mt-1">{Math.round(nutrients.calories)} kcal</span>
                  )}
                </div>
              </div>

              {meal.plate.length > 0 ? (
                <div className="space-y-4 pt-4 border-t border-gray-100/50">
                    <div className="flex flex-wrap gap-2">
                        {meal.plate.map(p => {
                            const food = allFoods.find(f => f.id === p.foodId);
                            return (
                                <div key={p.foodId} className="bg-white border border-gray-100 px-3 py-1.5 rounded-xl text-[9px] font-black text-gray-500 shadow-sm">
                                    {food?.name}
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-gray-900/5 rounded-3xl p-3 flex justify-around items-center border border-white">
                      <div className="flex flex-col items-center">
                        <Zap size={10} className="text-emerald-500 mb-0.5" />
                        <span className="text-[9px] font-black text-emerald-600">{Math.round(nutrients.protein)}g</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Wheat size={10} className="text-amber-500 mb-0.5" />
                        <span className="text-[9px] font-black text-amber-600">{Math.round(nutrients.carbs)}g</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Droplets size={10} className="text-blue-500 mb-0.5" />
                        <span className="text-[9px] font-black text-blue-600">{Math.round(nutrients.fat)}g</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${meal.dayOfWeek === 'Todos' ? 'bg-blue-400' : 'bg-emerald-500'}`}></span>
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{meal.dayOfWeek || 'Todos'}</span>
                      </div>
                      <button 
                          onClick={() => updateMeal(meal.id, { plate: [], isDone: false })}
                          className="text-[8px] font-black text-rose-400 uppercase tracking-widest bg-rose-50 px-3 py-1.5 rounded-xl"
                      >
                          Limpar
                      </button>
                    </div>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2 text-[10px] font-bold text-gray-300 uppercase italic py-3 bg-gray-50/50 rounded-2xl border border-dashed border-gray-100">
                  <AlertCircle size={14}/>
                  <span>Vazio para {activeDay}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleScreen;
