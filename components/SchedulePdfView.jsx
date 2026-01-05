import React from 'react';
import { getFoodUnitWeight } from '../constants';

const dayColors = {
  Segunda: 'border-red-200 bg-red-50',
  Terça: 'border-orange-200 bg-orange-50',
  Quarta: 'border-amber-200 bg-amber-50',
  Quinta: 'border-lime-200 bg-lime-50',
  Sexta: 'border-sky-200 bg-sky-50',
  Sábado: 'border-indigo-200 bg-indigo-50',
  Domingo: 'border-purple-200 bg-purple-50',
};

const SchedulePdfView = ({ meals, allFoods, profile, dailyGoal }) => {
  const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const calculateMealCalories = (plate) => {
    return plate.reduce((acc, item) => {
      const food = allFoods.find(f => String(f.id) === String(item.foodId));
      if (!food) return acc;
      const weight = getFoodUnitWeight(food, item.unit) * (item.quantity || 0);
      return acc + ((food.calories / 100) * weight);
    }, 0);
  };

  return (
    <div 
      id="pdf-export-content" 
      className="absolute -left-[9999px] top-0 w-[210mm] min-h-[297mm] p-8 bg-white text-gray-800 font-sans"
      style={{ fontFamily: 'sans-serif' }}
    >
      <div className="flex justify-between items-center border-b-2 border-emerald-500 pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-emerald-600">EvoluFit - Plano Alimentar</h1>
          <p className="text-lg font-semibold text-gray-600">{profile.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">Meta Diária</p>
          <p className="text-2xl font-black text-emerald-700">{Math.round(dailyGoal)} kcal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {weekDays.map(day => {
          const mealsForDay = meals.filter(m => {
            if (m.dayOfWeek === day) return true;
            if (m.dayOfWeek === 'Todos') {
              const hasOverride = meals.some(om => om.dayOfWeek === day && om.name === m.name);
              return !hasOverride;
            }
            return false;
          }).sort((a, b) => a.time.localeCompare(b.time));

          const totalDayCalories = mealsForDay.reduce((sum, meal) => sum + calculateMealCalories(meal.plate), 0);

          if (mealsForDay.length === 0 || mealsForDay.every(m => m.plate.length === 0)) {
            return null; // Não renderiza o dia se não houver refeições com itens
          }

          return (
            <div key={day} className={`p-4 rounded-lg border-2 ${dayColors[day] || 'border-gray-200'}`}>
              <div className="flex justify-between items-baseline mb-3 border-b pb-2">
                <h2 className="text-xl font-extrabold text-gray-700">{day}</h2>
                <p className="text-sm font-bold text-gray-600">Total: <span className="text-base font-black text-emerald-700">{Math.round(totalDayCalories)} kcal</span></p>
              </div>
              
              <div className="space-y-4">
                {mealsForDay.map(meal => {
                  if (meal.plate.length === 0) return null;
                  const mealCalories = calculateMealCalories(meal.plate);
                  return (
                    <div key={meal.id} className="text-sm">
                      <div className="flex justify-between items-center bg-white/50 rounded-t-md px-3 py-1">
                        <p className="font-bold">{meal.time} - {meal.name}</p>
                        <p className="font-semibold">{Math.round(mealCalories)} kcal</p>
                      </div>
                      <ul className="list-disc list-inside bg-white/80 rounded-b-md p-3 text-xs space-y-1">
                        {meal.plate.map((item, index) => {
                          const food = allFoods.find(f => f.id === item.foodId);
                          return <li key={index}>{item.quantity} {item.unit} de {food ? food.name : 'Alimento não encontrado'}</li>;
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-center text-xs text-gray-400 mt-8">Gerado por EvoluFit em {new Date().toLocaleDateString('pt-BR')}</p>
    </div>
  );
};

export default SchedulePdfView;