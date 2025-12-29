
import React, { useState } from 'react';
import { Target, Zap, Waves, Flame, TrendingDown, TrendingUp, Info, HelpCircle, ShieldCheck, Droplets, Wheat, AlertTriangle, CalendarCheck, CalendarDays } from 'lucide-react';
import { MealSlot, FoodItem, UserProfile, DayOfWeek } from '../types';
import { MEASURE_GRAMS } from '../constants';

interface BrainProps {
  schedule: MealSlot[];
  allFoods: FoodItem[];
  profile: UserProfile;
}

const BrainScreen: React.FC<BrainProps> = ({ schedule, allFoods, profile }) => {
  const [viewMode, setViewMode] = useState<DayOfWeek | 'Semana'>(() => {
    const daysMap: Record<number, DayOfWeek> = { 0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado' };
    return daysMap[new Date().getDay()];
  });

  const bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + (profile.gender === 'M' ? 5 : -161);
  
  const getActivityMultiplier = () => {
    switch (profile.activityLevel) {
      case 'Sedentário': return 1.2;
      case 'Leve': return 1.375;
      case 'Moderado': return 1.55;
      case 'Pesado': return 1.725;
      case 'Atleta': return 1.9;
      default: return 1.2;
    }
  };

  const tdee = bmr * getActivityMultiplier(); 
  const totalWeightChange = profile.targetWeight - profile.weight;
  const dailyAdjustment = (totalWeightChange * 7700) / (profile.weeks * 7);
  
  // Metas Base Diárias
  const dailyTargetCalories = Math.round(tdee + dailyAdjustment);
  const dailyTargetProtein = profile.weight * 1.8; 
  const dailyTargetFat = profile.weight * 0.9;
  const dailyTargetCarbs = (dailyTargetCalories - (dailyTargetProtein * 4) - (dailyTargetFat * 9)) / 4;
  const dailyTargetFiber = 25;

  const isWeekly = viewMode === 'Semana';
  const multiplier = isWeekly ? 7 : 1;

  // Metas Ajustadas ao Período
  const targetCalories = dailyTargetCalories * multiplier;
  const targetProtein = dailyTargetProtein * multiplier;
  const targetFat = dailyTargetFat * multiplier;
  const targetCarbs = dailyTargetCarbs * multiplier;
  const targetFiber = dailyTargetFiber * multiplier;

  const daysList: DayOfWeek[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  // Cálculo de Totais baseado na Seleção
  const totals = schedule.reduce((acc, slot) => {
    let include = false;
    if (isWeekly) {
      // Na semana, somamos TUDO (cada item 'Todos' é contado 7 vezes, 'Avulso' 1 vez)
      if (slot.dayOfWeek === 'Todos') {
        include = true;
        // Lógica especial para 'Todos': somamos 7 vezes o conteúdo
        const slotTotals = slot.plate.reduce((mAcc, item) => {
          const food = allFoods.find(f => f.id === item.foodId);
          if (!food) return mAcc;
          const weightFactor = (MEASURE_GRAMS[item.unit] * item.quantity * item.multiplier * 7) / 100;
          return {
            calories: mAcc.calories + (food.calories * weightFactor),
            protein: mAcc.protein + (food.protein * weightFactor),
            carbs: mAcc.carbs + (food.carbs * weightFactor),
            fat: mAcc.fat + (food.fat * weightFactor),
            fiber: mAcc.fiber + (food.fiber * weightFactor),
          };
        }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
        
        return {
          calories: acc.calories + slotTotals.calories,
          protein: acc.protein + slotTotals.protein,
          carbs: acc.carbs + slotTotals.carbs,
          fat: acc.fat + slotTotals.fat,
          fiber: acc.fiber + slotTotals.fiber,
        };
      } else {
        include = true; // 'Segunda'... e 'Avulso' entram 1 vez
      }
    } else {
      // Visão Diária específica
      include = slot.dayOfWeek === viewMode || slot.dayOfWeek === 'Todos' || slot.dayOfWeek === 'Avulso';
    }

    if (!include) return acc;

    return slot.plate.reduce((mAcc, item) => {
      const food = allFoods.find(f => f.id === item.foodId);
      if (!food) return mAcc;
      const weightFactor = (MEASURE_GRAMS[item.unit] * item.quantity * item.multiplier) / 100;
      return {
        calories: mAcc.calories + (food.calories * weightFactor),
        protein: mAcc.protein + (food.protein * weightFactor),
        carbs: mAcc.carbs + (food.carbs * weightFactor),
        fat: mAcc.fat + (food.fat * weightFactor),
        fiber: mAcc.fiber + (food.fiber * weightFactor),
      };
    }, acc);
  }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

  const progress = Math.min(100, (totals.calories / targetCalories) * 100);
  const isLosing = totalWeightChange < 0;
  const hasExceeded = totals.calories > targetCalories;

  return (
    <div className="p-4 space-y-6 pb-28">
      {/* Seletor de Período */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-4 px-4">
        {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo', 'Semana'].map(d => (
          <button 
            key={d}
            onClick={() => setViewMode(d as any)}
            className={`flex-shrink-0 px-6 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${viewMode === d ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'}`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="bg-emerald-900 text-white p-6 rounded-3xl shadow-xl flex items-start space-x-3 border-b-4 border-emerald-500">
        <ShieldCheck className="text-emerald-400 shrink-0 mt-0.5" size={20} />
        <div className="space-y-1">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-400">Inteligência Preditiva</p>
          <p className="text-[11px] text-gray-300 font-medium leading-tight">
            Visualizando consumo de <strong>{viewMode}</strong>. Metas ajustadas para o período de {multiplier} dia(s).
          </p>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-black text-gray-800 tracking-tighter">Bio-Cérebro de {profile.name}</h2>
        <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">Foco em {viewMode}</p>
      </div>

      <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-50 space-y-6">
        <div className="flex justify-between items-center px-2">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase">META DE ENERGIA</span>
              <span className="text-3xl font-black text-emerald-600 tracking-tighter">{targetCalories} <span className="text-xs">kcal</span></span>
            </div>
            <div className={`p-4 rounded-3xl ${isLosing ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
              {isLosing ? <TrendingDown size={24}/> : <TrendingUp size={24}/>}
            </div>
        </div>

        {hasExceeded && (
          <div className="bg-rose-50 border-2 border-rose-200 p-4 rounded-3xl flex items-start space-x-3 animate-bounce">
            <AlertTriangle className="text-rose-500 shrink-0" size={24} />
            <p className="text-[11px] text-rose-800 font-black leading-tight uppercase">
              Alerta de Excesso {isWeekly ? 'Semanal' : 'Diário'}: Seu plano atual ultrapassa a meta de {targetCalories} kcal!
            </p>
          </div>
        )}

        <div className="space-y-2">
          <div className="w-full bg-gray-100 h-6 rounded-full overflow-hidden relative shadow-inner">
              <div className={`h-full transition-all duration-1000 ${hasExceeded ? 'bg-rose-500' : 'bg-emerald-500 shadow-lg shadow-emerald-200'}`} style={{ width: `${progress}%` }} />
          </div>
          <div className="flex flex-col items-center space-y-2">
            <p className="text-[10px] text-center font-black text-gray-500 uppercase tracking-widest">
              Consumo ({viewMode}): <span className={hasExceeded ? 'text-rose-600' : 'text-emerald-600'}>{Math.round(totals.calories)} kcal</span> ({Math.round(progress)}%)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MacroCard 
          icon={<Zap size={22}/>} 
          label="Proteínas" 
          value={Math.round(totals.protein)} 
          target={Math.round(targetProtein)}
          unit="g" color="bg-emerald-50" text="text-emerald-600" 
          desc="Músculos e saciedade."
        />
        <MacroCard 
          icon={<Wheat size={22}/>} 
          label="Carboidratos" 
          value={Math.round(totals.carbs)} 
          target={Math.round(targetCarbs)}
          unit="g" color="bg-amber-50" text="text-amber-600" 
          desc="Energia diária."
        />
        <MacroCard 
          icon={<Droplets size={22}/>} 
          label="Lipídios" 
          value={Math.round(totals.fat)} 
          target={Math.round(targetFat)}
          unit="g" color="bg-blue-50" text="text-blue-600" 
          desc="Hormônios e óleos."
        />
        <MacroCard 
          icon={<Target size={22}/>} 
          label="Fibras" 
          value={Math.round(totals.fiber)} 
          target={Math.round(targetFiber)}
          unit="g" color="bg-purple-50" text="text-purple-600" 
          desc="Saúde digestiva."
        />
      </div>

      <div className="bg-gray-900 text-white p-8 rounded-[3rem] shadow-2xl border-b-8 border-emerald-500 space-y-4">
        <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Dossiê Evolutivo</h3>
        <div className="space-y-4 text-xs font-bold leading-relaxed text-gray-300">
          <p>
            • <strong>TMB Diária:</strong> {Math.round(bmr)} kcal.<br/>
            • <strong>Estratégia:</strong> <span className={isLosing ? 'text-rose-400' : 'text-emerald-400'}>{isLosing ? 'Déficit' : 'Superávit'} em {profile.weeks} semanas</span>.
          </p>
          
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center space-x-3">
            <CalendarCheck className="text-emerald-400" size={16} />
            <p className="italic text-[10px]">
              Os dados apresentados acima são calculados dinamicamente com base nas refeições planejadas para {viewMode}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MacroCard = ({ icon, label, value, target, unit, color, text, desc }: any) => (
  <div className={`${color} p-5 rounded-[2.5rem] flex flex-col items-center justify-center space-y-1 shadow-sm border-2 border-white relative overflow-hidden active:scale-95 transition-all`}>
    <div className={`${text} opacity-80 mb-1`}>{icon}</div>
    <div className="text-center">
      <span className={`text-xl font-black ${text}`}>{value}</span>
      <span className={`text-[8px] font-black ml-1 uppercase opacity-40 ${text}`}>/ {target}{unit}</span>
    </div>
    <span className="text-[9px] font-black uppercase text-gray-400 tracking-tighter">{label}</span>
    <p className="text-[7px] text-center font-bold text-gray-300 uppercase leading-tight px-1">{desc}</p>
    {value >= target && (
      <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border border-white"></div>
    )}
  </div>
);

export default BrainScreen;
