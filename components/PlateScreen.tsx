
import React, { useState } from 'react';
import { Trash2, CheckCircle2, ListChecks, Info, Plus, Calculator, ArrowLeft, Calendar } from 'lucide-react';
import { PlateItem, FoodItem, MeasureUnit, MealSlot, DayOfWeek } from '../types';
import { MEASURE_GRAMS } from '../constants';

interface PlateProps {
  plate: PlateItem[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<PlateItem>) => void;
  allFoods: FoodItem[];
  meals: MealSlot[];
  onAssignMeal: (mealId: string, day: DayOfWeek) => void;
  onAddMore: () => void;
}

const PlateScreen: React.FC<PlateProps> = ({ plate, onRemove, onUpdate, allFoods, meals, onAssignMeal, onAddMore }) => {
  const [selectedMealId, setSelectedMealId] = useState(meals[0]?.id || '');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Todos');

  const days: DayOfWeek[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo', 'Todos', 'Avulso'];

  if (plate.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-4">
        <div className="text-8xl opacity-10 grayscale">🍽️</div>
        <h2 className="text-xl font-black text-gray-300 uppercase tracking-tighter">O Prato está Vazio</h2>
        <p className="text-gray-400 text-xs font-bold leading-relaxed">
          Vá até a <strong>DISPENSA</strong> e use o <Plus size={12} className="inline" /> para escolher seus alimentos. Eles aparecerão aqui para ajuste de porção.
        </p>
        <button 
          onClick={onAddMore}
          className="mt-4 bg-emerald-500 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase shadow-xl"
        >
          Ir para Dispensa
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100 flex items-start space-x-3">
        <Calculator className="text-emerald-600 shrink-0 mt-0.5" size={18} />
        <p className="text-[11px] text-emerald-800 font-medium leading-tight">
          <strong>PASSO 2:</strong> Defina as quantidades e agende para um dia específico da semana ou use "Todos os Dias" para sua rotina fixa.
        </p>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tighter">Montagem do Prato</h2>
          <p className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest">Soma nutricional em tempo real</p>
        </div>
        <button 
          onClick={onAddMore}
          className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl text-[9px] font-black uppercase flex items-center space-x-1 border border-emerald-100 active:scale-95"
        >
          <ArrowLeft size={12} />
          <span>Adicionar Mais</span>
        </button>
      </div>

      <div className="space-y-3">
        {plate.map(item => {
          const food = allFoods.find(f => f.id === item.foodId);
          if (!food) return null;
          
          const totalWeight = MEASURE_GRAMS[item.unit] * item.quantity;

          return (
            <div key={item.foodId} className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-50 flex flex-col space-y-4 transition-all">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-black text-gray-700 text-lg tracking-tight leading-none mb-1">{food.name}</span>
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Peso: {totalWeight}g</span>
                </div>
                <button onClick={() => onRemove(item.foodId)} className="text-rose-300 p-2 hover:text-rose-500">
                  <Trash2 size={20} />
                </button>
              </div>
              
              <div className="flex space-x-2">
                <select 
                  value={item.unit}
                  onChange={(e) => onUpdate(item.foodId, { unit: e.target.value as MeasureUnit })}
                  className="flex-1 bg-gray-50 border-none rounded-2xl p-4 text-xs font-black text-gray-600 outline-none focus:ring-2 focus:ring-emerald-400 appearance-none cursor-pointer"
                >
                  {Object.keys(MEASURE_GRAMS).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <div className="flex bg-gray-100 rounded-2xl p-1 items-center space-x-4 px-6">
                    <button onClick={() => onUpdate(item.foodId, { quantity: Math.max(1, item.quantity - 1) })} className="text-2xl font-black text-emerald-600">-</button>
                    <span className="font-black text-sm text-gray-700 w-4 text-center">{item.quantity}</span>
                    <button onClick={() => onUpdate(item.foodId, { quantity: item.quantity + 1 })} className="text-2xl font-black text-emerald-600">+</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-emerald-900 text-white p-8 rounded-[3rem] shadow-2xl space-y-5 border-t-4 border-emerald-400">
        <div className="flex items-center space-x-3 text-emerald-400 font-black text-xs uppercase tracking-widest">
            <ListChecks size={20}/>
            <span>Agendar no Relógio</span>
        </div>
        
        <div className="space-y-3">
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={16} />
            <select 
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
                className="w-full bg-white/10 border-none rounded-2xl p-4 pl-12 text-sm font-black outline-none focus:ring-2 focus:ring-emerald-400 appearance-none cursor-pointer"
            >
                {days.map(d => <option key={d} value={d} className="text-black">{d}</option>)}
            </select>
          </div>

          <div className="relative">
            <select 
                value={selectedMealId}
                onChange={(e) => setSelectedMealId(e.target.value)}
                className="w-full bg-white/10 border-none rounded-2xl p-4 text-sm font-black outline-none focus:ring-2 focus:ring-emerald-400 appearance-none cursor-pointer"
            >
                {meals.map(m => (
                  <option key={m.id} value={m.id} className="text-black">
                    {m.time} - {m.name}
                  </option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">▼</div>
          </div>
        </div>

        <button 
            onClick={() => onAssignMeal(selectedMealId, selectedDay)}
            className="w-full bg-emerald-500 hover:bg-emerald-400 py-6 rounded-[2rem] font-black text-sm shadow-xl flex items-center justify-center space-x-3 transition-all active:scale-95 border-b-4 border-emerald-700"
        >
            <CheckCircle2 size={20} />
            <span>CONFIRMAR AGENDAMENTO</span>
        </button>
      </div>
    </div>
  );
};

export default PlateScreen;
