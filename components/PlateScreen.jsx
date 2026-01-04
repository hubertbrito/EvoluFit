import React, { useState } from 'react';
import { Trash2, Plus, ChefHat, Calendar, Info, Clock, ChevronUp, ChevronDown, Users, MapPin } from 'lucide-react';
import { MEASURE_UNITS, UNIT_WEIGHTS, getFoodUnitWeight, inferFoodMeasures } from '../constants';

const PlateScreen = ({ plate, onRemove, onUpdate, allFoods, onAssignMeal, onAddMore, meals, showTour, tourStep, initialSelectedDays = [], editingMealInfo = null }) => {
  const [selectedDays, setSelectedDays] = useState(initialSelectedDays);
  const [selectedMealName, setSelectedMealName] = useState(() => editingMealInfo ? editingMealInfo.name : null);
  const [selectedTargetId, setSelectedTargetId] = useState(null);

  // Estado para a nova funcionalidade de contexto social, começando vazio
  const [withWhom, setWithWhom] = useState('');
  const [customWithWhom, setCustomWithWhom] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [customEventLocation, setCustomEventLocation] = useState('');

  const withWhomOptions = ['Sozinho(a)', 'Família', 'Amigos', 'Namorado(a)', 'Colegas', 'Cliente', 'Date', 'Trabalho'];
  const eventLocationOptions = ['Em casa', 'Restaurante', 'Trabalho', 'Na rua', 'Academia (pós-treino)', 'Parque / Piquenique', 'Encontro', 'Festa', 'Viagem'];

  // These variables will hold the final string to be saved later in Phase 2
  const finalWithWhom = withWhom === 'Outro...' ? customWithWhom : withWhom;
  const finalEventLocation = eventLocation === 'Outro...' ? customEventLocation : eventLocation;

  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const allWeekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
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

  const calculateTotal = () => {
    return plate.reduce((acc, item) => {
      const food = allFoods.find(f => f.id === item.foodId);
      if (!food) return acc;
      // Cálculo: (CaloriasBase / 100) * (PesoDaUnidade * Quantidade)
      const weight = getFoodUnitWeight(food, item.unit) * item.quantity;
      return acc + ((food.calories / 100) * weight);
    }, 0);
  };

  const toggleDay = (day) => {
    setSelectedDays(prev => {
      if (prev.includes(day)) {
        return prev.filter(d => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  const clearAll = () => setSelectedDays([]);

  // Exclui explicitamente as refeições fixas para evitar duplicação visual
  const customMeals = meals.filter(m => !fixedMealNames.includes(m.name));

  const handleSelectMeal = (mealName, targetId = null) => {
    setSelectedMealName(mealName);
    setSelectedTargetId(targetId);
  };

  const handleConfirmAssignment = () => {
    if (!selectedMealName && !selectedTargetId) return alert('Por favor, selecione uma refeição para classificar o prato.');
    if (selectedDays.length === 0 && !selectedTargetId) return alert('Por favor, selecione pelo menos um dia para agendar.');

    const daysToAssign = selectedDays.length === 7 ? ['Todos'] : selectedDays;
    onAssignMeal(selectedMealName, daysToAssign, selectedTargetId, finalWithWhom, finalEventLocation);
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-start gap-2">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700"><strong>Montagem do Prato:</strong> Ajuste as quantidades e medidas de cada item. O cálculo de calorias é atualizado na hora. Ao final, agende para um dia e refeição específicos.</p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-800">Seu Prato</h2>
        <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
          {plate.length === 0 && showTour ? 128 : Math.round(calculateTotal())} kcal
        </div>
      </div>

      {plate.length === 0 && !showTour ? (
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
          {/* Item de Exemplo para o Tour (Apenas visualização) */}
          {plate.length === 0 && showTour && (
            <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-dashed border-emerald-300 relative opacity-90" data-tour-id="plate-item-example">
              <div className="absolute -top-2.5 left-4 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                Exemplo de Item
              </div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-800">Arroz Integral</h3>
                  <p className="text-xs text-emerald-600 font-bold">128 kcal <span className="text-gray-400 font-normal">(100g)</span></p>
                </div>
                <button className="text-rose-300 p-1 cursor-not-allowed">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex gap-2 items-center">
                <div className="flex items-center border rounded-lg bg-gray-50">
                  <button className="p-2 text-gray-400 border-r cursor-not-allowed"><ChevronDown className="w-4 h-4" /></button>
                  <input type="number" value="4" readOnly className="w-12 py-2 text-center font-bold border-none outline-none bg-transparent text-gray-600" />
                  <button className="p-2 text-gray-400 border-l cursor-not-allowed"><ChevronUp className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 p-2 border rounded-lg bg-gray-50 text-gray-500">
                  Colher de Sopa
                </div>
              </div>
            </div>
          )}

          {plate.map((item, index) => {
            const food = allFoods.find(f => f.id === item.foodId);
            if (!food) return null;
            
            const itemWeight = getFoodUnitWeight(food, item.unit) * item.quantity;
            const itemCalories = (food.calories / 100) * itemWeight;

            // Define as unidades disponíveis de forma limpa e contextual
            let availableUnits = ['Gramas (g)', 'Mililitros (ml)'];
            
            if (food.measures) {
              availableUnits = [...availableUnits, ...Object.keys(food.measures)];
            } else {
              const inferred = inferFoodMeasures(food.name);
              if (inferred) {
                availableUnits = [...availableUnits, ...Object.keys(inferred)];
              } else {
                // Fallback minimalista para não mostrar opções sem sentido
                availableUnits = [...availableUnits, 'Unidade', 'Colher de Sopa', 'Xícara'];
              }
            }

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
                    {availableUnits.map(u => <option key={u} value={u}>{u}</option>)}
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

          {/* --- FASE 1: Social Context UI --- */}
          <div className="pt-4 space-y-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-3 text-blue-800 font-bold text-sm">
                <Users className="w-4 h-4" />
                Anotações da Refeição (Opcional)
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">Com quem?</label>
                  <select
                    value={withWhom}
                    onChange={(e) => setWithWhom(e.target.value)}
                    className={`w-full p-2 border-2 rounded-lg bg-white text-sm appearance-none focus:outline-none transition-all
                      ${withWhom ? 'text-gray-800 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'text-gray-400 border-gray-300'}
                    `}
                  >
                    <option value="" disabled>Selecione uma companhia...</option>
                    {withWhomOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    <option value="Outro...">Outro (digitar)</option>
                  </select>
                  {withWhom === 'Outro...' && (
                    <input 
                      type="text"
                      autoFocus
                      value={customWithWhom}
                      onChange={(e) => setCustomWithWhom(e.target.value)}
                      placeholder="Digite com quem..."
                      className="w-full p-2 border rounded-lg bg-white mt-2 text-sm"
                    />
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">Local / Evento</label>
                  <select
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className={`w-full p-2 border-2 rounded-lg bg-white text-sm appearance-none focus:outline-none transition-all
                      ${eventLocation ? 'text-gray-800 border-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.5)]' : 'text-gray-400 border-gray-300'}
                    `}
                  >
                    <option value="" disabled>Selecione um local...</option>
                    {eventLocationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    <option value="Outro...">Outro (digitar)</option>
                  </select>
                  {eventLocation === 'Outro...' && (
                    <input 
                      type="text"
                      autoFocus
                      value={customEventLocation}
                      onChange={(e) => setCustomEventLocation(e.target.value)}
                      placeholder="Digite o local/evento..."
                      className="w-full p-2 border rounded-lg bg-white mt-2 text-sm"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4" data-tour-id="plate-scheduling">
            <div className="bg-emerald-50 p-4 rounded-xl mb-4 border border-emerald-100">
              <div className="flex items-center gap-2 mb-2 text-emerald-800 font-bold text-sm">
                <Calendar className="w-4 h-4" />
                Agendar para (selecione vários):
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                <button
                  onClick={clearAll}
                  className="px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex-grow text-center bg-white text-gray-400 border border-gray-200 hover:bg-gray-50"
                >
                  Limpar
                </button>
              </div>
              <div className="flex gap-2 flex-wrap justify-center mt-2">
                {days.map(day => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex-grow text-center ${isSelected ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-gray-400 border border-gray-200'}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Classificar como:</h3>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {mealTypes.map(mealName => (
                <button
                  key={mealName}
                  onClick={() => handleSelectMeal(mealName)}
                  className={`p-3 rounded-xl font-bold text-sm transition-colors ${selectedMealName === mealName && !selectedTargetId ? 'bg-emerald-600 text-white shadow-lg' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                >
                  {mealName}
                </button>
              ))}
            </div>

            {/* Seção para Refeições Criadas na Agenda (Nova Refeição) - Movida para baixo */}
            {customMeals.length > 0 && (
              <div className="mb-6 pt-4 border-t border-gray-100">
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 mb-3">
                  <p className="text-xs text-blue-800 font-medium flex flex-col gap-1">
                    <span className="flex items-center gap-2 font-bold">
                        <Clock className="w-4 h-4" /> Refeições criadas por você
                    </span>
                    <span>Deseja inserir esse prato em alguma delas? Basta clicar em uma das opções abaixo para inserir.</span>
                  </p>
                </div>
                <div className="space-y-2 mb-4">
                  {customMeals.map(meal => (
                    <button
                      key={meal.id}
                      onClick={() => handleSelectMeal(meal.name, meal.id)}
                      className={`w-full p-3 rounded-xl font-bold text-sm transition-colors border text-left flex justify-between items-center ${selectedTargetId === meal.id ? 'bg-blue-600 text-white shadow-lg border-blue-600' : 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200'}`}
                    >
                      <span>Inserir em "{meal.name}" ({meal.dayOfWeek})</span>
                      <span className="text-xs bg-white px-2 py-1 rounded text-blue-600">{meal.time}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleConfirmAssignment}
              disabled={(!selectedMealName && !selectedTargetId) || (selectedDays.length === 0 && !selectedTargetId)}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
            >
              Confirmar Agendamento
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlateScreen;