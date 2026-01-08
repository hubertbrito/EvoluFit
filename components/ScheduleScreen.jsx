import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Clock, AlertCircle, Zap, Wheat, Droplets, Calendar, ArrowUp, ArrowDown, Trash2, Plus, Info, Eraser, Edit, CalendarDays, Users, MapPin, CalendarCheck2, StickyNote, X, CheckCircle, Check, Trophy, Undo2, GripVertical, Share2, Activity, FileDown, Copy } from 'lucide-react';
import { UNIT_WEIGHTS, getFoodUnitWeight } from '../constants';
import CustomSelect from './CustomSelect';

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

const dayColors = {
  Segunda: 'bg-red-100 text-red-800 border border-red-200',
  Terça: 'bg-orange-100 text-orange-800 border border-orange-200',
  Quarta: 'bg-amber-100 text-amber-800 border border-amber-200',
  Quinta: 'bg-lime-100 text-lime-800 border border-lime-200',
  Sexta: 'bg-sky-100 text-sky-800 border border-sky-200',
  Sábado: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  Domingo: 'bg-purple-100 text-purple-800 border border-purple-200',
  Todos: 'bg-slate-100 text-slate-800 border border-slate-200',
  'Datas Marcadas': 'bg-teal-100 text-teal-800 border border-teal-200',
};

const DayCompleteModal = ({ onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-bounce text-center">
      <div className="bg-emerald-500 p-6 flex justify-center">
        <div className="bg-white p-4 rounded-full shadow-lg">
          <Trophy size={48} className="text-emerald-500" />
        </div>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-black text-gray-800 mb-2">Dia Concluído!</h2>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          Parabéns! Você seguiu seu plano perfeitamente hoje. <br/>
          <span className="font-bold text-emerald-600">Esse é o caminho para a saúde!</span>
          <br/>Continue assim amanhã.
        </p>
        <button 
          onClick={onClose}
          className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-md hover:bg-emerald-700 transition-transform active:scale-95"
        >
          Continuar Focado
        </button>
      </div>
    </div>
  </div>
);

const NutritionalSummaryModal = ({ title, meals, allFoods, onClose }) => {
  const totals = useMemo(() => {
    return meals.reduce((acc, meal) => {
      const mealNutrients = meal.plate.reduce((n, item) => {
        const food = allFoods.find(f => String(f.id) === String(item.foodId));
        if (!food) return n;
        const weight = getFoodUnitWeight(food, item.unit) * item.quantity;
        const factor = weight / 100;
        return {
          calories: n.calories + (food.calories || 0) * factor,
          protein: n.protein + (food.protein || 0) * factor,
          carbs: n.carbs + (food.carbs || 0) * factor,
          fat: n.fat + (food.fat || 0) * factor,
          fiber: n.fiber + (food.fiber || 0) * factor,
        };
      }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

      return {
        calories: acc.calories + mealNutrients.calories,
        protein: acc.protein + mealNutrients.protein,
        carbs: acc.carbs + mealNutrients.carbs,
        fat: acc.fat + mealNutrients.fat,
        fiber: acc.fiber + mealNutrients.fiber,
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  }, [meals, allFoods]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-bounce">
        <div className="p-4 border-b dark:border-gray-700 bg-emerald-50 dark:bg-emerald-900/20 flex justify-between items-center">
          <h3 className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
            <Activity size={20} />
            Resumo Nutricional
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-full transition-colors text-emerald-600 dark:text-emerald-400">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
            <h4 className="text-center font-black text-gray-800 dark:text-gray-100 text-lg mb-1 capitalize">{title}</h4>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mb-6">{meals.length} refeições planejadas</p>

            <div className="flex justify-center mb-6">
                <div className="text-center">
                    <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{Math.round(totals.calories)}</span>
                    <span className="text-sm font-bold text-gray-400 block">kcal totais</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Proteínas</span>
                    </div>
                    <span className="text-lg font-black text-gray-800 dark:text-gray-100">{Math.round(totals.protein)}g</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Carbos</span>
                    </div>
                    <span className="text-lg font-black text-gray-800 dark:text-gray-100">{Math.round(totals.carbs)}g</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Gorduras</span>
                    </div>
                    <span className="text-lg font-black text-gray-800 dark:text-gray-100">{Math.round(totals.fat)}g</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Fibras</span>
                    </div>
                    <span className="text-lg font-black text-gray-800 dark:text-gray-100">{Math.round(totals.fiber)}g</span>
                </div>
            </div>
        </div>
        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-end">
          <button onClick={onClose} className="w-full py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-md hover:bg-emerald-700 transition-transform active:scale-95">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

const ScheduleScreen = ({ meals, onUpdateMeals, allFoods, onAddMeal, onEditMeal, onClearMeal, onReorderMeal, onDeleteMeal, scheduleWarnings, onClearWarnings, unitWeights = UNIT_WEIGHTS, showTour, tourStep, waterIntake, onUpdateWater, waterGoal, onUpdateWaterGoal, triggerConfetti, onMealDone, movedMealId, profile, onExportSpecificPDF, onCloneDay }) => {
  const [now, setNow] = useState(new Date());
  const [activeDays, setActiveDays] = useState(() => {
    const daysMap = { 0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado' };
    return [daysMap[new Date().getDay()]];
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(waterGoal);
  const [hasCelebratedWater, setHasCelebratedWater] = useState(false);
  const [showDayCompleteModal, setShowDayCompleteModal] = useState(false);
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    setTempGoal(waterGoal);
  }, [waterGoal]);

  const handleSaveGoal = () => {
    onUpdateWaterGoal(tempGoal);
    setIsEditingGoal(false);
  };

  const goalMet = waterIntake >= waterGoal;

  useEffect(() => {
    if (goalMet && !hasCelebratedWater) {
      triggerConfetti();
      setHasCelebratedWater(true);
    }
  }, [goalMet, hasCelebratedWater, triggerConfetti]);

  const waterGoalOptions = [
    { value: '500', label: '500 ml' },
    { value: '1500', label: '1,5 Litros' },
    { value: '2000', label: '2 Litros' },
    { value: '2500', label: '2,5 Litros' },
    { value: '3000', label: '3 Litros' },
    { value: '3500', label: '3,5 Litros' },
    { value: '4000', label: '4 Litros' },
    { value: '4500', label: '4,5 Litros' },
    { value: '5000', label: '5 Litros' },
    { value: '6000', label: '6 Litros' },
    { value: '7000', label: '7 Litros' },
    { value: '8000', label: '8 Litros' },
    { value: '9000', label: '9 Litros' },
  ];

  const waterOptions = [150, 200, 250, 300, 350, 478, 500, 600, 750, 1000, 1500, 2000];

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

  const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const specialDay = 'Datas Marcadas';
  const currentTimeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const toggleDay = (day) => {
    setActiveDays([day]);
    scrollToTop();
  };

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

  const calculateMealNutrients = useCallback((plate) => {
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
  }, [allFoods]);

  const filteredMeals = useMemo(() => {
    const result = meals.filter(m => {
    // If 'Avulso' is selected, only show ad-hoc meals
    if (activeDays.includes('Datas Marcadas')) {
      // Mostra apenas refeições que são explicitamente 'Avulso' E têm uma data específica.
      // Ordena por data.
      return m.dayOfWeek === 'Datas Marcadas' && m.specificDate;
    }
    
    // Se for um dos dias ativos, mostra
    if (activeDays.includes(m.dayOfWeek)) return true;
    
    // Se for 'Todos' (template), mostra APENAS SE for relevante para algum dos dias ativos
    // e NÃO houver override (card específico) naquele dia
    if (m.dayOfWeek === 'Todos') {
      if (activeDays.includes('Datas Marcadas')) return false; // Don't show templates on Datas Marcadas page
      return activeDays.some(day => {
        const hasOverride = meals.some(om => om.dayOfWeek === day && om.name === m.name);
        return !hasOverride;
      });
    }
    return false;
    });

    // Ordena as refeições avulsas por data
    if (activeDays.includes('Datas Marcadas')) {
      result.sort((a, b) => new Date(a.specificDate) - new Date(b.specificDate));
    }
    return result;
  }, [meals, activeDays]);

  // Lógica de Planejamento Total (Soma de tudo agendado para o dia, feito ou não)
  const totalPlannedCalories = useMemo(() => {
    return filteredMeals.reduce((total, meal) => {
      return total + calculateMealNutrients(meal.plate).calories;
    }, 0);
  }, [filteredMeals, calculateMealNutrients]);

  // Lógica de Progresso do Dia
  const dayProgress = useMemo(() => {
    if (filteredMeals.length === 0) return 0;
    const doneCount = filteredMeals.filter(m => m.isDone).length;
    return (doneCount / filteredMeals.length) * 100;
  }, [filteredMeals]);

  // Lógica de Progresso de Calorias Consumidas
  const caloriesProgress = useMemo(() => {
    const consumedCalories = filteredMeals
      .filter(m => m.isDone)
      .reduce((total, meal) => total + calculateMealNutrients(meal.plate).calories, 0);
    
    // Usando a prop 'profile' diretamente
    const { weight, height, age, gender, activityLevel, activityDays, targetWeight, weeks } = profile;
    
    let dailyGoal = 2000; // Default goal
    if (weight && height && age && gender && activityLevel && targetWeight && weeks) {
      let bmr = (10 * weight) + (6.25 * height) - (5 * age) + (gender === 'M' ? 5 : -161);
      const intensityFactors = { 'Sedentário': 0, 'Leve': 0.035, 'Moderada': 0.05, 'Pesada': 0.075, 'Atleta': 0.1 };
      const activityAddon = (intensityFactors[activityLevel] || 0) * (activityDays || 0);
      const tdee = bmr * (1.2 + activityAddon);
      const dailyAdjustment = ((weight - targetWeight) * 7700) / (weeks * 7);
      dailyGoal = Math.max(1200, tdee - dailyAdjustment);
    }
    return {
      consumed: Math.round(consumedCalories),
      goal: Math.round(dailyGoal),
      percentage: dailyGoal > 0 ? Math.min(100, (consumedCalories / dailyGoal) * 100) : 0,
    };
  }, [filteredMeals, profile, calculateMealNutrients]);

  const isOverPlanned = totalPlannedCalories > caloriesProgress.goal && caloriesProgress.goal > 0;

  const handleToggleDone = (meal) => {
    const newStatus = !meal.isDone;
    updateMeal(meal.id, { isDone: newStatus });

    if (newStatus && onMealDone) {
      onMealDone(meal);
    }

    // Verifica se completou o dia com essa ação
    if (newStatus) {
      const otherMeals = filteredMeals.filter(m => m.id !== meal.id);
      const allOthersDone = otherMeals.every(m => m.isDone);
      
      if (allOthersDone && otherMeals.length === filteredMeals.length - 1) {
        // Se todas as outras estavam prontas e essa era a última
        triggerConfetti();
        setShowDayCompleteModal(true);
      }
    }
  };

  const handleDragStart = (e, index) => {
    // Permite arrastar apenas se o handle for clicado
    if (!e.target.closest('.drag-handle')) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessário para permitir o drop
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndexStr = e.dataTransfer.getData('text/plain');
    if (!sourceIndexStr) return;
    
    const sourceIndex = parseInt(sourceIndexStr, 10);
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

    const sourceMeal = filteredMeals[sourceIndex];
    const targetMeal = filteredMeals[targetIndex];

    const newMeals = [...meals];
    const sourceOriginalIndex = newMeals.findIndex(m => m.id === sourceMeal.id);
    const [movedItem] = newMeals.splice(sourceOriginalIndex, 1);
    const targetOriginalIndex = newMeals.findIndex(m => m.id === targetMeal.id);
    
    newMeals.splice(sourceIndex < targetIndex ? targetOriginalIndex + 1 : targetOriginalIndex, 0, movedItem);
    onUpdateMeals(newMeals);
  };

  const handleShareDay = () => {
    if (activeDays.length === 0) return;
    const day = activeDays[0];
    
    if (filteredMeals.length === 0) {
      alert('Não há refeições agendadas para este dia.');
      return;
    }

    let message = `📅 *Cardápio de ${day === 'Datas Marcadas' ? 'Datas Específicas' : day} - EvoluFit*\n\n`;

    filteredMeals.forEach(meal => {
      message += `⏰ *${meal.time} - ${meal.name}*`;
      if (meal.specificDate) {
         const dateStr = new Date(meal.specificDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
         message += ` (${dateStr})`;
      }
      message += `\n`;

      if (meal.plate.length > 0) {
        meal.plate.forEach(item => {
          const food = allFoods.find(f => String(f.id) === String(item.foodId));
          if (food) {
             message += `• ${formatFoodQuantity(item.quantity, item.unit, food.name)}\n`;
          }
        });
      } else {
        message += `_(Vazio)_\n`;
      }
      
      if (meal.withWhom) message += `👥 Com: ${meal.withWhom}\n`;
      if (meal.eventLocation) message += `📍 Local: ${meal.eventLocation}\n`;
      if (meal.description) message += `📝 Nota: ${meal.description}\n`;
      
      message += `\n`;
    });

    message += `_Gerado pelo App EvoluFit_`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShowSummary = (title, mealsForSummary) => {
      setSummaryData({ title, meals: mealsForSummary });
  };

  return (
    <div className="p-4 space-y-6 pb-28">
      <style>{`
        @keyframes highlight-move {
          0% { box-shadow: 0 0 0 0px rgba(255, 165, 0, 0); }
          50% { box-shadow: 0 0 15px 5px rgba(255, 165, 0, 0.7); }
          100% { box-shadow: 0 0 0 0px rgba(255, 165, 0, 0); }
        }
        .highlight-move-animation {
          animation: highlight-move 2s ease-out;
        }
      `}</style>

      {/* Aviso de Planejamento Excedido (Fixo) */}
      {isOverPlanned && (
        <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-start gap-3 shadow-sm animate-pulse">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-xs text-rose-800">
            <strong>Atenção ao Planejamento:</strong> A soma das refeições agendadas ({Math.round(totalPlannedCalories)} kcal) ultrapassa sua meta diária ({caloriesProgress.goal} kcal). Considere ajustar as quantidades.
          </p>
        </div>
      )}

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

      <div className="sticky top-0 z-10 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm -mx-4 px-4 pt-1 pb-3 shadow-sm border-b-2 border-gray-100 dark:border-gray-800">
        <div className="flex flex-col gap-2">
            {/* Primeira linha com 5 botões */}
            <div className="grid grid-cols-5 gap-2">
                {weekDays.slice(0, 5).map(d => {
                    const isActive = activeDays.includes(d);
                    const btnClass = `h-9 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center text-center border-2 ${
                        isActive 
                        ? "bg-emerald-100 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-100 shadow-md scale-105" 
                        : "bg-white dark:bg-gray-800 border-indigo-200 dark:border-gray-700 text-indigo-400 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:border-indigo-400"
                    }`;
                    return <button key={d} onClick={() => toggleDay(d)} className={btnClass}>{d.slice(0, 3)}</button>;
                })}
            </div>
            {/* Segunda linha com 3 botões */}
            <div className="grid grid-cols-4 gap-2">
                {weekDays.slice(5).map(d => {
                    const isActive = activeDays.includes(d);
                    const btnClass = `h-9 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center text-center border-2 ${
                        isActive 
                        ? "bg-emerald-100 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-100 shadow-md scale-105" 
                        : "bg-white dark:bg-gray-800 border-indigo-200 dark:border-gray-700 text-indigo-400 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:border-indigo-400"
                    }`;
                    return <button key={d} onClick={() => toggleDay(d)} className={btnClass}>{d.slice(0, 3)}</button>;
                })}
                <button 
                    onClick={() => toggleDay(specialDay)} 
                    className={`col-span-2 h-9 rounded-xl text-[9px] leading-tight font-black uppercase transition-all flex items-center justify-center text-center border-2 ${
                        activeDays.includes(specialDay) 
                        ? "bg-blue-400/80 border-blue-500 text-white shadow-lg scale-105" 
                        : "bg-white dark:bg-gray-800 border-fuchsia-200 dark:border-fuchsia-900 text-fuchsia-400 dark:text-fuchsia-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/30 hover:border-fuchsia-400"
                    }`}
                >{specialDay}</button>
            </div>
        </div>
      </div>

      <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl border border-blue-200 dark:border-blue-800 flex items-start gap-2 shadow-sm">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800 dark:text-blue-200">
          <strong>Dica:</strong> Renomeie, reordene ou exclua refeições. Clique em "+ Adicionar" para criar novos horários no dia selecionado.
        </p>
      </div>

      {/* Widget de Hidratação */}
      <div className="bg-cyan-50 dark:bg-cyan-900/10 p-4 rounded-2xl border border-cyan-100 dark:border-cyan-800 shadow-sm">
        <div className="mb-2">
            <h3 className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider flex items-center gap-1">
                <Info size={12} /> Controle de Consumo de Água
            </h3>
        </div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white dark:bg-cyan-900 rounded-full text-cyan-500 shadow-sm"><Droplets size={14} /></div>
            
            {isEditingGoal ? (
                <div className="flex items-center gap-2">
                    <div className="w-28">
                        <CustomSelect
                            value={tempGoal}
                            onChange={(val) => setTempGoal(val)}
                            options={waterGoalOptions}
                            placeholder="Meta"
                            className="text-xs py-1 px-2"
                        />
                    </div>
                    <button 
                        onClick={handleSaveGoal} 
                        className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500 text-white rounded-lg shadow-sm hover:bg-emerald-600"
                    >Salvar</button>
                </div>
            ) : (
                <div className="group flex flex-col items-start cursor-pointer" onClick={() => setIsEditingGoal(true)} title="Clique para editar a meta">
                    <span className="text-[8px] text-cyan-600 font-bold mb-0.5 leading-tight">Editar meta de<br/>consumo de agua/dia</span>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-cyan-900 dark:text-cyan-100 text-xs">Meta: {waterGoal}ml</p>
                        <Edit size={12} className="text-cyan-700 hover:text-cyan-900 transition-colors" />
                    </div>
                </div>
            )}
          </div>
          <div className="text-right">
             <p className="text-[10px] text-cyan-600 font-bold uppercase mb-0.5">Total Hoje</p>
             <span className="font-black text-cyan-700 dark:text-cyan-300 text-base">{waterIntake} ml</span>
          </div>
        </div>
        <button 
          onClick={() => setShowWaterModal(true)}
          className="w-full py-1.5 bg-cyan-500 text-white rounded-xl font-bold text-xs shadow-md hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Registrar Consumo
        </button>

        {goalMet && (
          <div className="mt-3 text-center bg-emerald-100 border border-emerald-200 text-emerald-800 p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle size={14} />
            <span>Parabéns! Meta de hoje atingida!</span>
          </div>
        )}
      </div>

      {/* Modal de Registro de Água */}
      {showWaterModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-bounce">
            <div className="p-3 border-b bg-cyan-50 flex justify-between items-center">
              <h3 className="font-bold text-cyan-800 flex items-center gap-2 text-base">
                <Droplets size={20} /> Registrar Água
              </h3>
              <button onClick={() => setShowWaterModal(false)}><X size={20} className="text-cyan-600" /></button>
            </div>
            <div className="p-4">
              <div className="text-center mb-4">
                <p className="text-gray-500 text-xs uppercase font-bold mb-1">Total Hoje</p>
                <p className="text-2xl font-black text-cyan-600">{waterIntake} <span className="text-sm text-gray-400">ml</span></p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {waterOptions.map(amount => (
                  <button 
                    key={amount}
                    onClick={() => onUpdateWater(waterIntake + amount)}
                    className="py-2 rounded-xl border-2 border-cyan-100 text-cyan-700 font-bold text-xs hover:bg-cyan-50 hover:border-cyan-300 transition-all active:scale-95"
                  >
                    {amount >= 1000 ? `${amount/1000} L` : `${amount} ml`}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50">
              <button 
                onClick={() => setShowWaterModal(false)}
                className="w-full py-2.5 bg-cyan-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-cyan-700 transition-transform active:scale-95"
              >
                Salvar Registro
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end">
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <h2 
                        onClick={() => {
                            if (activeDays.length === 1 && activeDays[0] !== 'Datas Marcadas') {
                                handleShowSummary(activeDays[0], filteredMeals);
                            }
                        }}
                        className={`text-2xl font-black text-gray-800 dark:text-gray-100 tracking-tighter ${activeDays.length === 1 && activeDays[0] !== 'Datas Marcadas' ? 'cursor-pointer hover:text-emerald-600 transition-colors' : ''}`}
                        title={activeDays.length === 1 && activeDays[0] !== 'Datas Marcadas' ? "Ver Resumo Nutricional do Dia" : ""}
                    >
                    {activeDays.length === 1 && activeDays[0] !== 'Datas Marcadas'
                        ? `Agenda de ${activeDays[0]}` 
                        : activeDays[0] === 'Datas Marcadas' ? 'Agenda de Datas Marcadas' : 'Agenda'}
                    </h2>
                    <button 
                        onClick={handleShareDay}
                        className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors shadow-sm"
                        title="Compartilhar Cardápio no WhatsApp"
                    >
                        <Share2 size={18} />
                    </button>
                    {activeDays.includes('Datas Marcadas') && (
                        <button 
                            onClick={onExportSpecificPDF}
                            className="p-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-full hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors shadow-sm"
                            title="Exportar Datas Marcadas para PDF"
                        >
                            <FileDown size={18} />
                        </button>
                    )}
                    {activeDays.length === 1 && activeDays[0] !== 'Datas Marcadas' && (
                        <button 
                            onClick={() => onCloneDay(activeDays[0])}
                            className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors shadow-sm"
                            title="Clonar Refeições deste Dia"
                        >
                            <Copy size={18} />
                        </button>
                    )}
                </div>
                {/* Barras de Progresso */}
                {activeDays.length === 1 && activeDays[0] !== 'Datas Marcadas' && filteredMeals.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <div>
                      <label className="text-[9px] font-bold text-gray-500">Conclusão de Refeições</label>
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden max-w-[150px]">
                          <div 
                            className={`h-full transition-all duration-500 ${dayProgress === 100 ? 'bg-emerald-500' : 'bg-yellow-400'}`}
                            style={{ width: `${dayProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">{Math.round(dayProgress)}%</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-500">Meta de Calorias</label>
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden max-w-[150px]">
                          <div 
                            className={`h-full transition-all duration-500 ${caloriesProgress.percentage >= 100 ? 'bg-emerald-500' : 'bg-orange-400'}`}
                            style={{ width: `${caloriesProgress.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">{caloriesProgress.consumed} / {caloriesProgress.goal} kcal</span>
                      </div>
                    </div>
                  </div>
                )}
            </div>
            <p className="text-emerald-600 font-bold text-[10px] uppercase flex items-center mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping mr-2"></span>
              Agora: {currentTimeStr}
            </p>
        </div>
      </div>

      <div className="space-y-4">
        {activeDays.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold text-sm">Selecione um dia no menu acima para começar</p>
          </div>
        )}
        {filteredMeals.map((meal, index) => {
          const [mealHour] = meal.time.split(':');
          const [currentHour] = currentTimeStr.split(':');
          const todayName = weekDays[new Date().getDay() - 1] || 'Domingo';
          const isCurrent = mealHour === currentHour && (meal.dayOfWeek === 'Todos' || meal.dayOfWeek === todayName);
          const isFixed = fixedMealNames.includes(meal.name);
          const nutrients = calculateMealNutrients(meal.plate);
          const isMoved = meal.id === movedMealId;

          // Se a refeição tem um groupId, encontra todos os outros no mesmo grupo para exibir seus dias.
          // Caso contrário, mostra apenas o seu próprio dia. Isso torna a UI reativa às mudanças no grupo.
          const scheduledDays = meal.plate.length === 0
            ? ['Todos'] // Se o prato está vazio, o card volta a representar o template padrão 'Todos os Dias'.
            : meal.groupId
              ? meals.filter(m => m.groupId === meal.groupId).map(m => m.dayOfWeek).sort((a, b) => weekDays.indexOf(a) - weekDays.indexOf(b))
              : [meal.dayOfWeek];

            return (
            <React.Fragment key={meal.id}>
            {activeDays.includes('Datas Marcadas') && meal.specificDate && (index === 0 || filteredMeals[index - 1].specificDate !== meal.specificDate) && (
                <div 
                    onClick={() => handleShowSummary(
                        new Date(meal.specificDate + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }),
                        filteredMeals.filter(m => m.specificDate === meal.specificDate)
                    )}
                    className="sticky top-14 z-10 bg-emerald-50/95 dark:bg-emerald-900/90 backdrop-blur-sm p-2 rounded-lg border border-emerald-200 dark:border-emerald-800 shadow-sm mb-4 mt-2 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors flex justify-between items-center group"
                >
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2 capitalize">
                        <CalendarCheck2 size={16} />
                        {new Date(meal.specificDate + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold group-hover:underline">Ver Resumo</span>
                </div>
            )}
            <div 
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`p-4 rounded-[2rem] border-2 transition-all relative overflow-hidden 
                  ${isMoved ? 'highlight-move-animation' : ''} 
                  ${meal.isDone ? 'opacity-75 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' : (isCurrent ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-400 shadow-xl ring-4 ring-orange-400/10' : 'bg-white dark:bg-gray-800 border-indigo-50 dark:border-gray-700 shadow-sm hover:border-orange-300')}`}
            >
              <div className="flex justify-between items-start mb-5 gap-3">
                <div className="drag-handle mt-2 p-1 -ml-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-grab active:cursor-grabbing text-gray-300 hover:text-emerald-600 transition-colors" title="Arrastar para reordenar (Computador)">
                    <GripVertical size={20} />
                </div>
                <label className="flex items-center space-x-2 cursor-pointer group shrink-0 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 p-1.5 rounded-xl transition-colors shadow-sm">
                    <div className={`p-1.5 rounded-lg transition-colors ${isCurrent ? 'bg-orange-600 text-white shadow-md' : 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm'}`}>
                        <Clock size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-indigo-800 dark:text-indigo-300 uppercase leading-none mb-0.5">Mudar Hora</span>
                      <input 
                          type="time" 
                          value={meal.time}
                          onChange={(e) => updateMeal(meal.id, { time: e.target.value })}
                          className="font-black text-base bg-transparent border-none outline-none focus:ring-0 p-0 text-indigo-950 dark:text-indigo-100 leading-none cursor-pointer appearance-none block"
                      />
                    </div>
                </label>
                <div className="flex flex-col items-end min-w-0 flex-1">
                  <label className="text-xs font-black text-indigo-500 dark:text-indigo-400 uppercase mr-1 w-full text-right truncate">Nome da Refeição</label>
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
                    className="text-right font-black text-indigo-950 dark:text-indigo-100 text-sm uppercase tracking-tight bg-transparent border-none outline-none focus:ring-0 p-0 w-full min-w-[50px] max-w-full placeholder:text-indigo-300 dark:placeholder:text-indigo-700 placeholder:italic placeholder:font-normal placeholder:text-sm"
                  />
                  {nutrients.calories > 0 && (
                    <span className="text-orange-800 dark:text-orange-300 font-black text-sm tracking-tighter mt-1">{Math.round(nutrients.calories)} kcal</span>
                  )}
                </div>
              </div>

              {meal.plate.length > 0 ? (
                <div className="space-y-4 pt-4 border-t border-gray-100/50 dark:border-gray-700/50">
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
                                            if (meal.dayOfWeek === 'Todos' && !activeDays.includes('Todos')) {
                                                // Se editando um 'Todos' em uma view de dia específico, cria override para o primeiro dia ativo
                                                const newMeal = { ...meal, id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, dayOfWeek: activeDays[0], plate: newPlate, isDone: false };
                                                onUpdateMeals([...meals, newMeal]);
                                            } else {
                                                updateMeal(meal.id, { plate: newPlate });
                                            }
                                        }
                                    }}
                                    className="bg-white dark:bg-gray-700 border border-indigo-200 dark:border-gray-600 px-3 py-1.5 rounded-xl text-xs font-black text-indigo-700 dark:text-indigo-300 shadow-sm hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-colors flex items-center gap-1 group"
                                    title="Clique para remover item"
                                >
                                    {food ? formatFoodQuantity(p.quantity, p.unit, food.name) : 'Item desconhecido'}
                                    <Trash2 size={10} className="text-indigo-200 group-hover:text-rose-500 transition-colors" />
                                </button>
                            );
                        })}
                    </div>
                    
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-3xl p-3 flex justify-around items-center border border-orange-100 dark:border-orange-800 shadow-inner">
                      <div className="flex flex-col items-center">
                        <Zap size={10} className="text-emerald-600 mb-0.5" />
                        <span className="text-xs font-black text-indigo-500 dark:text-indigo-400 uppercase">Prot</span>
                        <span className="text-sm font-black text-emerald-800 dark:text-emerald-300">{Math.round(nutrients.protein)}g</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Wheat size={10} className="text-amber-600 mb-0.5" />
                        <span className="text-xs font-black text-indigo-500 dark:text-indigo-400 uppercase">Carb</span>
                        <span className="text-sm font-black text-amber-800 dark:text-amber-300">{Math.round(nutrients.carbs)}g</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Droplets size={10} className="text-blue-600 mb-0.5" />
                        <span className="text-xs font-black text-indigo-500 dark:text-indigo-400 uppercase">Gord</span>
                        <span className="text-sm font-black text-blue-800 dark:text-blue-300">{Math.round(nutrients.fat)}g</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                        <CalendarDays size={12} className="text-indigo-400" />
                        {scheduledDays.map(day => (
                            <span 
                                key={day} 
                                className={`px-1.5 py-0.5 rounded text-[10px] font-black ${dayColors[day] || dayColors['Datas Marcadas']}`}
                            >
                                {day === 'Todos' ? 'TODOS OS DIAS' : day.substring(0, 3).toUpperCase()}
                            </span>
                        ))}
                    </div>

                    {/* Exibe a data específica, se houver */}
                    {meal.specificDate && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <CalendarCheck2 size={12} className="text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-700">
                          {new Date(meal.specificDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                    )}

                    {/* --- FASE 3: Exibição das Anotações Sociais --- */}
                    {(meal.withWhom || meal.eventLocation || meal.description) && (
                      <div className="mt-3 pt-3 border-t border-indigo-200/50 dark:border-indigo-800/50 text-sm text-indigo-900 dark:text-indigo-200 space-y-1.5">
                        {meal.withWhom && (
                          <div className="flex items-center gap-2">
                            <Users size={14} className="text-indigo-500 shrink-0" />
                            <span className="font-semibold">{meal.withWhom}</span>
                          </div>
                        )}
                        {meal.eventLocation && (
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-indigo-500 shrink-0" />
                            <span className="font-semibold">{meal.eventLocation}</span>
                          </div>
                        )}
                        {meal.description && (
                          <div className="flex items-start gap-2 mt-1.5 bg-yellow-50 p-2 rounded-lg border border-yellow-100 text-yellow-800">
                            <StickyNote size={14} className="shrink-0 mt-0.5" />
                            <span className="italic leading-tight">{meal.description}</span>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-sm font-bold text-indigo-400 dark:text-indigo-500 uppercase italic py-3 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-800">
                    <div className="flex items-center gap-2">
                        <AlertCircle size={14}/>
                        <span>Vazio</span>
                    </div>
                    <div className="flex items-center gap-1 flex-wrap justify-center px-2">
                        {scheduledDays.map(day => (
                            <span key={day} className={`px-1.5 py-0.5 rounded text-[10px] font-black not-italic ${dayColors[day] || dayColors.Avulso}`}>
                                {day === 'Todos' ? 'TODOS OS DIAS' : day.substring(0, 3).toUpperCase()}
                            </span>
                        ))}
                    </div>
                </div>
              )}

              {/* Botões de Status da Refeição */}
              <div className="mt-4 pt-3 border-t border-indigo-50 dark:border-indigo-900/50 flex items-center justify-between gap-3">
                 {/* Status Indicator */}
                 <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-bold transition-colors ${meal.isDone ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800' : 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800'}`}>
                    {meal.isDone ? <Check size={14} /> : <Clock size={14} />}
                    <span>{meal.isDone ? 'OK' : 'Pendente'}</span>
                 </div>

                 {!meal.isDone ? (
                   <button 
                      onClick={() => {
                          if (window.confirm('Deseja marcar esta refeição como consumida?')) {
                            handleToggleDone(meal);
                          }
                      }}
                      disabled={meal.plate.length === 0}
                      className="flex-1 py-2 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-700 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                   >
                      Marcar Consumida
                   </button>
                 ) : (
                   <button 
                      onClick={() => {
                        if (window.confirm('Deseja reverter o status desta refeição para "Pendente"?')) {
                          handleToggleDone(meal);
                        }
                      }}
                      className="flex-1 py-2 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
                      title="Reverter status para pendente"
                   >
                      <Undo2 size={14} />
                      Reverter
                   </button>
                 )}
              </div>

              <div className="flex justify-end items-center gap-2 mt-3 pt-2 border-t border-dashed border-indigo-50/50 dark:border-indigo-800/50">
                  <span className="text-xs font-bold text-indigo-400 dark:text-indigo-500 uppercase mr-auto">Ações</span>
                  
                  <button onClick={() => onReorderMeal(meal.id, 'up', activeDays[0])} disabled={index === 0} className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400 disabled:opacity-30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors" title="Mover para cima">
                    <ArrowUp size={16} />
                  </button>
                  <button onClick={() => onReorderMeal(meal.id, 'down', activeDays[0])} disabled={index === filteredMeals.length - 1} className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400 disabled:opacity-30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors" title="Mover para baixo">
                    <ArrowDown size={16} />
                  </button>
                  
                  <button 
                    onClick={() => onEditMeal(meal)}
                    disabled={meal.plate.length === 0}
                    className="px-2.5 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-700 dark:text-blue-300 disabled:opacity-30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-0.5 text-[10px] font-bold" 
                    title="Editar Prato (Move para montagem)"
                  >
                    <Edit size={11} />
                    <span>Editar</span>
                  </button>

                  <button 
                    onClick={() => {
                      onClearMeal(meal, activeDays[0]);
                    }}
                    disabled={meal.plate.length === 0}
                    className="px-2.5 py-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-700 dark:text-amber-300 disabled:opacity-30 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors flex items-center gap-0.5 text-[10px] font-bold" 
                    title="Limpar Prato"
                  >
                    <Eraser size={11} />
                    <span>Limpar</span>
                  </button>

                  {!isFixed && (
                    <>
                      <div className="w-px h-6 bg-indigo-100 mx-1"></div>
                      <button 
                        onClick={() => {
                          onDeleteMeal(meal, activeDays[0]);
                        }} 
                        className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-xl text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors" 
                        title="Excluir Refeição"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
              </div>
            </div>
            </React.Fragment>
          );
        })}
      </div>

      <div data-tour-id="schedule-add-meal">
        <button
          onClick={() => onAddMeal(activeDays[0])}
          className="w-full mt-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Adicionar Nova Refeição
        </button>
      </div>
      
      <div className="mt-8 px-2 space-y-5 text-gray-600 dark:text-gray-400">
        <h3 className="text-sm font-black text-gray-800 dark:text-gray-200 border-b dark:border-gray-700 pb-2 uppercase">Como criar uma nova refeição:</h3>
        
        <div>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">PASSO 1</p>
            <p className="text-sm leading-snug">
                Clique no botão acima para abrir o menu de criação.
            </p>
        </div>
        
        <div>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">PASSO 2</p>
            <p className="text-sm leading-snug">
                Selecione os dias desejados (ex: Segunda, Quarta e Sexta) e confirme para criar o card.
            </p>
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-4 p-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-all z-30 animate-bounce"
          title="Voltar ao Topo"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {showDayCompleteModal && <DayCompleteModal onClose={() => setShowDayCompleteModal(false)} />}
      {summaryData && <NutritionalSummaryModal title={summaryData.title} meals={summaryData.meals} allFoods={allFoods} onClose={() => setSummaryData(null)} />}
    </div>
  );
};

export default ScheduleScreen;
