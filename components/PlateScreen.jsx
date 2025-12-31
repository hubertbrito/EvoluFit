import React, { useState } from 'react';
import { Trash2, Plus, ChefHat, Calendar, Info, Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { MEASURE_UNITS, UNIT_WEIGHTS } from '../constants';

const PlateScreen = ({ plate, onRemove, onUpdate, allFoods, onAssignMeal, onAddMore, meals }) => {
  const [selectedDays, setSelectedDays] = useState(['Todos']);
  const days = ['Todos', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const mealTypes = [
    'Café da Manhã', 
    'Lanche das 10h', 
    'Almoço', 
    'Chá das Três', 
    'Lanche das 17h', 
    'Jantar das 20h', 
    'Lanche das 22h', 
    'Ceia da Meia-noite'
  ];

  const calculateTotal = () => {
    return plate.reduce((acc, item) => {
      const food = allFoods.find(f => f.id === item.foodId);
      if (!food) return acc;
      // Cálculo: (CaloriasBase / 100) * (PesoDaUnidade * Quantidade)
      const weight = (UNIT_WEIGHTS[item.unit] || 1) * item.quantity;
      return acc + ((food.calories / 100) * weight);
    }, 0);
  };

  const toggleDay = (day) => {
    if (day === 'Todos') {
      setSelectedDays(['Todos']);
      return;
    }
    setSelectedDays(prev => {
      const newSelection = prev.filter(d => d !== 'Todos'); // Remove 'Todos' se selecionar dia específico
      if (newSelection.includes(day)) {
        const filtered = newSelection.filter(d => d !== day);
        return filtered.length ? filtered : ['Todos']; // Volta para Todos se desmarcar tudo
      }
      return [...newSelection, day];
    });
  };

  // Filtra refeições criadas manualmente na agenda (aquelas que não são as padrão m1-m4 ou que têm nome "Nova Refeição")
  // Assumindo que IDs manuais começam com 'm-' e timestamp, ou filtramos pelo nome.
  const customMeals = meals.filter(m => m.name === 'Nova Refeição' || (m.id.startsWith('m-') && m.id.length > 5));

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-start gap-2">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700"><strong>Montagem do Prato:</strong> Ajuste as quantidades e medidas de cada item. O cálculo de calorias é atualizado na hora. Ao final, agende para um dia e refeição específicos.</p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-800">Seu Prato</h2>
        <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
          {Math.round(calculateTotal())} kcal
        </div>
      </div>

      {plate.length === 0 ? (
        <div className="text-center py-10 space-y-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
            <ChefHat className="w-10 h-10 text-gray-300" />
          </div>
          <p className="text-gray-400">Seu prato está vazio.</p>
          <button onClick={onAddMore} className="text-emerald-600 font-bold">
            Adicionar Alimentos
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {plate.map((item, index) => {
            const food = allFoods.find(f => f.id === item.foodId);
            if (!food) return null;
            
            const itemWeight = (UNIT_WEIGHTS[item.unit] || 1) * item.quantity;
            const itemCalories = (food.calories / 100) * itemWeight;

            return (
              <div key={`${item.foodId}-${index}`} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800">{food.name}</h3>
                    <p className="text-xs text-emerald-600 font-bold">{Math.round(itemCalories)} kcal <span className="text-gray-400 font-normal">({Math.round(itemWeight)}g)</span></p>
                  </div>
                  <button onClick={() => onRemove(item.foodId)} className="text-rose-400 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex gap-2 items-center">
                  <div className="flex items-center border rounded-lg bg-white">
                    <button 
                      onClick={() => onUpdate(item.foodId, { quantity: Math.max(0, (Number(item.quantity) || 0) - 1) })}
                      className="p-2 hover:bg-gray-50 text-gray-500 border-r"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <input 
                      type="number" 
                      min="0"
                      value={item.quantity || ''}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = e.target.value;
                        const numVal = val === '' ? '' : Number(val);
                        if (val === '' || numVal >= 0) onUpdate(item.foodId, { quantity: numVal });
                      }}
                      onBlur={(e) => { if (e.target.value === '') onUpdate(item.foodId, { quantity: 1 }); }}
                      className="w-12 py-2 text-center font-bold border-none outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button 
                      onClick={() => onUpdate(item.foodId, { quantity: (Number(item.quantity) || 0) + 1 })}
                      className="p-2 hover:bg-gray-50 text-gray-500 border-l"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <select 
                    value={item.unit}
                    onChange={(e) => onUpdate(item.foodId, { unit: e.target.value })}
                    className="flex-1 p-2 border rounded-lg bg-white"
                  >
                    {MEASURE_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            );
          })}

          <button 
            onClick={onAddMore}
            className="w-full py-3 border-2 border-dashed border-gray-200 text-gray-400 rounded-xl font-bold flex items-center justify-center gap-2 hover:border-emerald-200 hover:text-emerald-600 transition-colors"
          >
            <Plus className="w-4 h-4" /> Adicionar mais itens
          </button>

          <div className="pt-4">
            <div className="bg-emerald-50 p-4 rounded-xl mb-4 border border-emerald-100">
              <div className="flex items-center gap-2 mb-2 text-emerald-800 font-bold text-sm">
                <Calendar className="w-4 h-4" />
                Agendar para (selecione vários):
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                {days.map(day => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex-grow text-center ${selectedDays.includes(day) ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Seção para Refeições Criadas na Agenda (Nova Refeição) */}
            {customMeals.length > 0 && (
              <div className="mb-6">
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 mb-3">
                  <p className="text-xs text-emerald-800 font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Existe uma <strong>Nova Refeição</strong> criada na sua agenda. Gostaria de inserir este prato nela?
                  </p>
                </div>
                <div className="space-y-2 mb-4">
                  {customMeals.map(meal => (
                    <button
                      key={meal.id}
                      onClick={() => onAssignMeal(null, null, meal.id)}
                      className="w-full p-3 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-sm hover:bg-emerald-200 transition-colors border border-emerald-200 text-left flex justify-between items-center"
                    >
                      <span>Inserir em "{meal.name}" ({meal.dayOfWeek})</span>
                      <span className="text-xs bg-white px-2 py-1 rounded text-emerald-600">{meal.time}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Ou classificar como:</h3>
            <div className="grid grid-cols-2 gap-2">
              {mealTypes.map(mealName => (
                <button
                  key={mealName}
                  onClick={() => onAssignMeal(mealName, selectedDays)}
                  className="p-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-colors"
                >
                  {mealName}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlateScreen;