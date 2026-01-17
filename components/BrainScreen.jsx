import React, { useState, useMemo } from 'react';
import { Brain, Activity, Target, Zap, Calendar, AlertTriangle, Edit, CheckCircle, FileText, ArrowRight, RefreshCw, BarChart2, TrendingUp, TrendingDown, Share2, Droplets, Flame, Trophy, Lock, Info, X, Star, Heart, Clock, BookOpen, Database } from 'lucide-react';
import { getFoodUnitWeight } from '../constants';

const PieChart = ({ data, size = 120, strokeWidth = 20 }) => {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={radius} fill="transparent" stroke="#e2e8f0" strokeWidth={strokeWidth} />
      </svg>
    );
  }

  let accumulatedPercentage = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      {data.map((item, index) => {
        const percentage = item.value / total;
        const strokeDashoffset = accumulatedPercentage * circumference;
        accumulatedPercentage += percentage;
        
        return (
          <circle key={index} cx={center} cy={center} r={radius} fill="transparent" stroke={item.color} strokeWidth={strokeWidth} strokeDasharray={`${percentage * circumference} ${circumference}`} style={{ strokeDashoffset: -strokeDashoffset }} />
        );
      })}
    </svg>
  );
};

const BarChart = ({ data, dailyGoal }) => {
  const maxVal = Math.max(...data.map(d => d.calories), dailyGoal) * 1.15;
  const height = 120;
  const width = 300;
  const barWidth = 24;
  const gap = (width - (data.length * barWidth)) / (data.length + 1);

  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <svg width="100%" height={height + 30} viewBox={`0 0 ${width} ${height + 30}`} className="overflow-visible">
        {/* Linha da Meta */}
        <line 
          x1="0" 
          y1={height - (dailyGoal / maxVal) * height} 
          x2={width} 
          y2={height - (dailyGoal / maxVal) * height} 
          stroke="#10b981" 
          strokeWidth="2" 
          strokeDasharray="4,4" 
          opacity="0.5"
        />
        <text x={width} y={height - (dailyGoal / maxVal) * height - 5} fontSize="10" fill="#10b981" textAnchor="end" fontWeight="bold">Meta</text>
        
        {data.map((d, i) => {
          const barHeight = (d.calories / maxVal) * height;
          const x = gap + i * (barWidth + gap);
          const y = height - barHeight;
          const isOver = d.calories > dailyGoal;
          
          return (
            <g key={i}>
              <rect x={x} y={y} width={barWidth} height={barHeight} fill={isOver ? '#f43f5e' : '#3b82f6'} rx="4" />
              <text x={x + barWidth/2} y={height + 15} fontSize="10" textAnchor="middle" fill="#64748b" fontWeight="bold">{d.day.slice(0, 3)}</text>
              <text x={x + barWidth/2} y={y - 5} fontSize="8" textAnchor="middle" fill="#94a3b8">{Math.round(d.calories)}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const WaterHistoryChart = ({ history, goal }) => {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d;
  });

  const data = last7Days.map(date => {
    const dateStr = date.toLocaleDateString('pt-BR');
    const value = history[dateStr] || 0;
    return {
      day: days[date.getDay()],
      value,
      isToday: date.toDateString() === today.toDateString()
    };
  });

  const maxVal = Math.max(...data.map(d => d.value), goal, 100) * 1.1;

  return (
    <div className="flex items-end justify-between h-24 gap-2">
      {data.map((d, i) => {
        const height = Math.min(100, (d.value / maxVal) * 100);
        const isGoalReached = d.value >= goal;
        return (
          <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
            <div className="w-full relative flex items-end justify-center bg-cyan-50 rounded-t-md overflow-hidden h-full">
                <div 
                  className={`w-full rounded-t-sm transition-all duration-500 ${isGoalReached ? 'bg-emerald-400' : (d.isToday ? 'bg-cyan-500' : 'bg-cyan-300')}`}
                  style={{ height: `${height}%` }}
                ></div>
            </div>
            <span className={`text-[9px] font-bold mt-1 ${d.isToday ? 'text-cyan-800' : 'text-cyan-400'}`}>{d.day}</span>
          </div>
        );
      })}
    </div>
  );
};

const LEVELS = [
  { days: 0, title: 'Novato', icon: '🌱', next: 30 },
  { days: 30, title: 'Iniciado', icon: '🧘', next: 60 },
  { days: 60, title: 'Mestre', icon: '🥋', next: 90 },
  { days: 90, title: 'Monge', icon: '📿', next: 120 },
  { days: 120, title: 'O Iluminado', icon: '✨', next: null }
];

const LevelSystemInfoModal = ({ onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-bounce">
      <div className="p-4 border-b border-indigo-100 dark:border-gray-700 bg-indigo-50 dark:bg-indigo-900/20 flex justify-between items-center">
        <h3 className="font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-2">
          <Star size={18} className="text-yellow-500" /> Sistema de Evolução
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-full transition-colors text-indigo-600 dark:text-indigo-400">
          <X size={20} />
        </button>
      </div>
      <div className="p-5 space-y-4">
        <div className="bg-indigo-50 dark:bg-indigo-900/10 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800">
          <h4 className="font-bold text-indigo-700 dark:text-indigo-300 text-sm mb-1">Como subir de nível?</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            Seu nível é definido pelo seu <strong>XP Total</strong> (Experiência). Você ganha XP de duas formas:
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600">
              <Flame size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Constância Diária</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">1 Dia de Streak = <strong>1 XP</strong></p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
              <BookOpen size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Sabedoria Nutricional</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Cada Badge (Água/Coração) = <strong>+5 XP</strong></p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Acelere sua evolução!</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
          <h4 className="font-bold text-gray-700 dark:text-gray-300 text-xs mb-2 uppercase tracking-wider">Tabela de Níveis</h4>
          <div className="space-y-1.5">
            {LEVELS.map(l => (
              <div key={l.title} className="flex justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">{l.icon} {l.title}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{l.days} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 border-t bg-gray-50 dark:bg-gray-800 flex justify-end">
        <button 
          onClick={onClose} 
          className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-transform active:scale-95"
        >
          Entendi
        </button>
      </div>
    </div>
  </div>
);

const MetricsExplanation = () => (
  <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-800 shadow-sm">
    <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2 text-sm">
      <Info size={16} />
      Entenda seus Números
    </h3>
    <div className="space-y-3 text-xs text-blue-900/80 dark:text-blue-200 leading-relaxed">
      <div>
        <p className="font-bold text-blue-800 dark:text-blue-300 mb-0.5">🔥 TMB (Taxa Metabólica Basal)</p>
        <p>Energia que seu corpo gasta <strong>em repouso</strong>. É o seu "custo de sobrevivência".</p>
        <p className="mt-1 font-medium opacity-90">💡 Como usar: Nunca coma muito abaixo do TMB! Isso trava o metabolismo.</p>
      </div>
      <div className="border-t border-blue-200 dark:border-blue-700 pt-2">
        <p className="font-bold text-blue-800 dark:text-blue-300 mb-0.5">🎯 Meta Diária</p>
        <p>Seu alvo real de calorias diaria, ajustado para seu objetivo e atividade física.</p>
        <p className="mt-1 font-medium opacity-90">💡 Como usar: Mire neste valor(aproximado) com alimentos de verdade para ter resultado.</p>
      </div>
    </div>
  </div>
);

const BrainScreen = ({ schedule, allFoods, profile, onEditProfile, onRestartTour, onResetSchedule, onOpenDataPortability, waterHistory = {}, gamification, badgesData = [] }) => {
  const [filterDay, setFilterDay] = useState('Hoje');
  const days = ['Hoje', 'Semana Toda', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const [showBadgesInfo, setShowBadgesInfo] = useState(false);
  const [showLevelInfo, setShowLevelInfo] = useState(false);

  const getBadgeRequirement = (id) => {
    if (id === 'first_step') return '1ª Refeição';
    if (id === 'water_master') return '3 Dias Água';
    const [type, val] = id.split('_');
    if (type === 'streak') return `${val} Dias`;
    if (type === 'heart') return `${val} Vidas`;
    return '';
  };

  const calculateDailyTotals = () => {
    let totals = { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 };
    
    // Determina quais dias considerar
    const daysToCalculate = filterDay === 'Semana Toda' 
      ? ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
      : filterDay === 'Hoje' 
        ? [{ 0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado' }[new Date().getDay()]]
        : [filterDay];

    daysToCalculate.forEach(day => {
      // Para cada dia, pega as refeições que se aplicam (específicas do dia OU 'Todos')
      const dailyMeals = schedule.filter(m => {
        if (m.dayOfWeek === day) return true;
        if (m.dayOfWeek === 'Todos') {
           // Verifica se existe um override (refeição específica) para este dia
           const hasOverride = schedule.some(om => om.dayOfWeek === day && om.name === m.name);
           return !hasOverride;
        }
        return false;
      });
      
      dailyMeals.forEach(meal => {
        if (meal.plate) {
          meal.plate.forEach(item => {
            const food = allFoods.find(f => f.id === item.foodId);
            if (food) {
              const weight = getFoodUnitWeight(food, item.unit) * (item.quantity || 0);
              const multiplier = weight / 100; // calorias são por 100g
              
              totals.totalCalories += (food.calories || 0) * multiplier;
              totals.totalProtein += (food.protein || 0) * multiplier;
              totals.totalCarbs += (food.carbs || 0) * multiplier;
              totals.totalFat += (food.fat || 0) * multiplier;
            }
          });
        }
      });
    });

    return { totals, daysCount: daysToCalculate.length };
  };

  const { totals, daysCount } = calculateDailyTotals();
  
  // Cálculos Metabólicos (Mifflin-St Jeor)
  const calculateMetabolism = () => {
    const { weight, height, age, gender, activityLevel, activityDays, targetWeight, weeks } = profile;
    
    // TMB (Taxa Metabólica Basal)
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += gender === 'M' ? 5 : -161;

    // Fator de Atividade Inteligente
    const intensityFactors = {
      'Sedentário': 0,
      'Leve': 0.035,
      'Moderada': 0.05,
      'Pesada': 0.075,
      'Atleta': 0.1
    };
    const activityAddon = (intensityFactors[activityLevel] || 0) * (activityDays || 0);
    const tdee = bmr * (1.2 + activityAddon);

    // Meta Diária (Déficit ou Superávit)
    // 1kg de gordura ~ 7700 kcal
    const weightDiff = weight - targetWeight; // Positivo = perder peso
    const totalCaloriesDiff = weightDiff * 7700;
    const dailyAdjustment = totalCaloriesDiff / (weeks * 7);
    
    const dailyGoal = tdee - dailyAdjustment;

    return { bmr, tdee, dailyGoal: Math.max(1200, dailyGoal) }; // Mínimo de segurança 1200kcal
  };

  const { bmr, tdee, dailyGoal } = calculateMetabolism();
  
  // Ajusta a meta baseada no período selecionado (ex: Semana Toda = meta * 7)
  const goalForPeriod = dailyGoal * daysCount;
  const caloriePercentage = Math.min(100, (totals.totalCalories / goalForPeriod) * 100);

  // Dados para o Gráfico Semanal
  const weeklyData = useMemo(() => {
    const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    return weekDays.map(day => {
      let calories = 0;
      const dailyMeals = schedule.filter(m => {
        if (m.dayOfWeek === day) return true;
        if (m.dayOfWeek === 'Todos') {
           const hasOverride = schedule.some(om => om.dayOfWeek === day && om.name === m.name);
           return !hasOverride;
        }
        return false;
      });

      dailyMeals.forEach(meal => {
        if (meal.plate) {
          meal.plate.forEach(item => {
            const food = allFoods.find(f => f.id === item.foodId);
            if (food) {
              const weight = getFoodUnitWeight(food, item.unit) * (item.quantity || 0);
              calories += (food.calories || 0) * (weight / 100);
            }
          });
        }
      });
      return { day, calories };
    });
  }, [schedule, allFoods]);

  const weeklyTotalCalories = weeklyData.reduce((acc, d) => acc + d.calories, 0);
  const weeklyGoalTotal = dailyGoal * 7;
  const weeklyBalance = weeklyTotalCalories - weeklyGoalTotal;
  
  // Data for Pie Chart
  const consumed = Math.round(totals.totalCalories);
  const goal = Math.round(goalForPeriod);
  const remaining = Math.max(0, goal - consumed);
  const excess = Math.max(0, consumed - goal);

  const pieChartData = consumed <= goal 
      ? [
          { value: consumed, color: '#22c55e' }, // Consumido (emerald-500)
          { value: remaining, color: '#e2e8f0' }, // Restante (slate-200)
      ]
      : [
          { value: goal, color: '#22c55e' }, // Meta (emerald-500)
          { value: excess, color: '#f43f5e' }, // Excesso (rose-500)
      ];

  // Avisos do Dossiê
  const warnings = [];
  if (totals.totalCalories > goalForPeriod * 1.1) {
    warnings.push({ type: 'danger', msg: 'Você ultrapassou sua meta calórica para este período!' });
  }
  if (dailyGoal < bmr) {
    warnings.push({ type: 'danger', msg: `ALERTA DE SAÚDE: Sua meta (${Math.round(dailyGoal)} kcal) está abaixo do seu metabolismo basal (${Math.round(bmr)} kcal). Isso é perigoso. Por favor, aumente o prazo da dieta no seu perfil.` });
  }
  if (totals.totalFat < (30 * daysCount) && totals.totalCalories > (500 * daysCount)) { // Exemplo simples escalado
    warnings.push({ type: 'warning', msg: 'Consumo de gorduras (lipídios) está muito baixo. Adicione azeite ou castanhas.' });
  }

  const handleShare = () => {
    const balanceText = weeklyBalance <= 0 
      ? `*Diferencial: ${Math.round(weeklyBalance)} kcal (Vitória! 🎉)*`
      : `*Diferencial: +${Math.round(weeklyBalance)} kcal (Excesso! 😟)*`;

    const message = `
*Relatório Nutricional - EvoluFit* 📊

*Perfil:* ${profile.name}, ${profile.age} anos
*Objetivo:* ${profile.weight}kg ➡️ ${profile.targetWeight}kg
*Meta Diária:* ${Math.round(dailyGoal)} kcal

*Balanço da Semana:*
- Consumido: ${Math.round(weeklyTotalCalories)} kcal
- Meta Semanal: ${Math.round(weeklyGoalTotal)} kcal
- ${balanceText}

*Detalhes Metabólicos:*
- Gasto em Repouso (TMB): ${Math.round(bmr)} kcal
- Gasto Total Estimado (TDEE): ${Math.round(tdee)} kcal
    `.trim().replace(/^\s+/gm, '');

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const unlockedCount = (gamification?.achievements || []).length;
  const totalBadges = badgesData.length;

  // Cálculo do Nível Atual com Bônus de Sabedoria
  const wisdomBadgesCount = (gamification?.achievements || []).filter(id => {
      const badge = badgesData.find(b => b.id === id);
      return badge && (badge.category === 'heart' || badge.category === 'water');
  }).length;
  const wisdomBonus = wisdomBadgesCount * 5;
  const effectiveStreak = (gamification?.maxStreak || 0) + wisdomBonus;

  const currentLevelIndex = LEVELS.reduce((acc, level, index) => {
    return effectiveStreak >= level.days ? index : acc;
  }, 0);
  const currentLevel = LEVELS[currentLevelIndex];
  const nextLevel = LEVELS[currentLevelIndex + 1];
  
  // Cálculo da Barra de XP do Nível
  const levelProgress = nextLevel 
    ? Math.min(100, Math.max(0, ((effectiveStreak - currentLevel.days) / (nextLevel.days - currentLevel.days)) * 100))
    : 100; // Nível máximo

  // Cálculo do Progresso do Plano (Semanas)
  const planStartDate = new Date(profile.planStartDate || new Date());
  const daysPassed = Math.floor((new Date() - planStartDate) / (1000 * 60 * 60 * 24));
  const totalPlanWeeks = parseInt(profile.weeks) || 12;
  const totalPlanDays = totalPlanWeeks * 7;
  const planProgress = Math.min(100, Math.max(0, (daysPassed / totalPlanDays) * 100));

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Cérebro</h2>
              <p className="text-sm text-gray-500">Análise Inteligente</p>
            </div>
          </div>
          <button onClick={onEditProfile} className="p-2 text-gray-400 hover:text-emerald-600">
            <Edit size={20} />
          </button>
        </div>

        {/* --- Card de Nível (RPG) --- */}
        {gamification && (
          <div className="mb-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Star size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Nível de Consciência</p>
                    <button onClick={() => setShowLevelInfo(true)} className="opacity-60 hover:opacity-100 transition-opacity"><Info size={12} /></button>
                  </div>
                  <h3 className="text-2xl font-black flex items-center gap-2">
                    <span className="text-3xl">{currentLevel.icon}</span> {currentLevel.title}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold opacity-90">{effectiveStreak} XP (Dias + Sabedoria)</p>
                  {nextLevel && <p className="text-[9px] opacity-70">Próximo: {nextLevel.title} ({nextLevel.days}d)</p>}
                </div>
              </div>
              {/* Barra de XP */}
              <div className="h-2 bg-black/20 rounded-full overflow-hidden mt-2"><div className="h-full bg-yellow-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${levelProgress}%` }}></div></div>
            </div>
          </div>
        )}

        {/* --- Card de Gamificação (Streaks & Hearts) --- */}
        {gamification && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-rose-500 rounded-2xl p-3 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10"><Flame size={60} /></div>
              <div className="relative z-10">
                <p className="text-[9px] font-bold uppercase tracking-wider opacity-90 mb-1">Sequência</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black">{gamification.currentStreak}</span>
                  <span className="text-[10px] font-bold opacity-90">dias</span>
                </div>
                <p className="text-[8px] mt-1 opacity-80">Recorde: {gamification.maxStreak}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-3 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10"><Heart size={60} /></div>
              <div className="relative z-10">
                <p className="text-[9px] font-bold uppercase tracking-wider opacity-90 mb-1">Vidas (Escolhas)</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black">{gamification.hearts || 0}</span>
                  <span className="text-[10px] font-bold opacity-90">corações</span>
                </div>
                <p className="text-[8px] mt-1 opacity-80">Ganhe com escolhas sábias</p>
              </div>
            </div>
          </div>
        )}

        {/* --- Barra de Progresso do Plano (Semanas) --- */}
        {profile.weeks && (
          <div className="mb-6 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-600">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Clock size={14} className="text-blue-500" /> Jornada da Meta
              </h3>
              <span className="text-[10px] font-bold text-gray-500">{daysPassed} / {totalPlanDays} dias</span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden relative">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${planProgress}%` }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[8px] font-black text-white drop-shadow-md">{Math.round(planProgress)}% Concluído</span>
              </div>
            </div>
            <p className="text-[9px] text-center text-gray-400 mt-1">Meta: {totalPlanWeeks} semanas</p>
          </div>
        )}

        {/* --- Galeria de Conquistas (Níveis) --- */}
        {gamification && badgesData.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-black text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Trophy size={16} className="text-yellow-500" /> Galeria de Conquistas
              </h3>
              <div className="flex flex-col items-center">
                 <span className="text-[10px] font-black text-rose-500 animate-pulse mb-0.5">Click info</span>
                 <button onClick={() => setShowBadgesInfo(true)} className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full hover:bg-rose-200 transition-colors shadow-sm">
                   <Info size={24} strokeWidth={2.5} />
                 </button>
              </div>
            </div>

            <div className="space-y-6">
                {/* Level Badges */}
                {badgesData.some(b => b.category === 'level') && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/10 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800">
                        <div className="mb-3">
                            <h4 className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400">Nível de Consciência</h4>
                            <p className="text-[9px] text-gray-500 dark:text-gray-400">Evolua mantendo a constância diária (Streaks).</p>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {badgesData.filter(b => b.category === 'level').map(badge => {
                                const isUnlocked = (gamification.achievements || []).includes(badge.id);
                                return (
                                    <div key={badge.id} className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1 border-2 transition-all ${isUnlocked ? 'bg-white border-indigo-300 shadow-sm dark:bg-indigo-900/40 dark:border-indigo-500' : 'bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700 grayscale opacity-50'}`}>
                                        <div className="text-3xl mb-1">{isUnlocked ? badge.icon : <Lock size={20} className="text-gray-400" />}</div>
                                        <span className="text-[9px] font-black text-center leading-tight text-gray-700 dark:text-gray-300">{badge.name}</span>
                                        <span className="text-[7px] font-bold text-center text-indigo-400 dark:text-indigo-300 mt-0.5 leading-none">{getBadgeRequirement(badge.id)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Guia de Conquistas da Sabedoria Nutricional (Nova Seção Unificada) */}
                {badgesData.some(b => b.category === 'heart' || b.category === 'water') && (
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-800">
                        <div className="mb-3">
                            <h4 className="text-lg font-black text-blue-800 dark:text-blue-300 flex items-center gap-2">
                                <BookOpen size={20} /> Sabedoria Nutricional
                            </h4>
                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 leading-tight">
                                Conquistas rápidas que aceleram sua evolução. <br/>
                                <strong>Cada badge = +5 dias no Nível de Consciência.</strong>
                            </p>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {badgesData.filter(b => b.category === 'heart' || b.category === 'water').map(badge => {
                                const isUnlocked = (gamification.achievements || []).includes(badge.id);
                                const isWater = badge.category === 'water';
                                return (
                                    <div key={badge.id} className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1 border-2 transition-all ${isUnlocked ? (isWater ? 'bg-cyan-100 border-cyan-500 shadow-md' : 'bg-rose-100 border-rose-500 shadow-md') : 'bg-gray-100 border-gray-300 grayscale opacity-60'}`}>
                                        <div className="text-2xl mb-1">{isUnlocked ? badge.icon : <Lock size={16} className="text-gray-400" />}</div>
                                        <span className={`text-[9px] font-black text-center leading-tight whitespace-pre-line px-0.5 ${isUnlocked ? (isWater ? 'text-cyan-900' : 'text-rose-900') : 'text-gray-500'}`}>{badge.name}</span>
                                        <span className={`text-[7px] font-bold text-center mt-0.5 leading-none ${isUnlocked ? (isWater ? 'text-cyan-700' : 'text-rose-700') : 'text-gray-400'}`}>{getBadgeRequirement(badge.id)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
          </div>
        )}

        <MetricsExplanation />

        {/* Dados Metabólicos */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl border border-gray-100 dark:border-gray-600">
            <p className="text-[10px] uppercase font-bold text-gray-400">TMB (Repouso)</p>
            <p className="text-lg font-black text-gray-700 dark:text-gray-100">{Math.round(bmr)} <span className="text-xs font-normal">kcal</span></p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800">
            <p className="text-[10px] uppercase font-bold text-emerald-600">Meta Diária</p>
            <p className="text-lg font-black text-emerald-700 dark:text-emerald-400">{Math.round(dailyGoal)} <span className="text-xs font-normal">kcal</span></p>
          </div>
        </div>

        {/* Filtro de Dias */}
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-4 h-4 text-gray-400" />
          <p className="text-sm font-bold text-gray-600 dark:text-gray-300">Visualizando: {filterDay}</p>
        </div>

        <div className="mb-6 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex gap-2">
            {days.map(d => (
              <button
                key={d}
                onClick={() => setFilterDay(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${filterDay === d ? 'bg-purple-500 text-white' : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Barra de Progresso Calorias */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-gray-700 dark:text-gray-300">Progresso Calórico</span>
            <span className="font-bold text-gray-500">{Math.round(totals.totalCalories)} / {Math.round(goalForPeriod)}</span>
          </div>
          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${totals.totalCalories > goalForPeriod ? 'bg-rose-500' : 'bg-emerald-500'}`} 
              style={{ width: `${caloriePercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Gráfico de Pizza */}
        <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 text-center">Distribuição Calórica do Período</h3>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
                <div className="relative">
                    <PieChart data={pieChartData} size={140} strokeWidth={22} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-black text-gray-800 dark:text-gray-100">{consumed}</span>
                        <span className="text-xs text-gray-500 -mt-1">kcal</span>
                    </div>
                </div>
                <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <div>
                            <div className="font-bold text-gray-600 dark:text-gray-400">Consumido</div>
                            <div className="text-gray-500">{consumed} kcal</div>
                        </div>
                    </div>
                    {consumed <= goal ? (
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                            <div>
                                <div className="font-bold text-gray-600 dark:text-gray-400">Restante</div>
                                <div className="text-gray-500">{remaining} kcal</div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                            <div>
                                <div className="font-bold text-rose-600">Excesso</div>
                                <div className="text-rose-500">{excess} kcal</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Calorias</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{Math.round(totals.totalCalories)}</div>
            <div className="text-xs text-gray-500">kcal</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Proteínas</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{Math.round(totals.totalProtein)}g</div>
            <div className="text-xs text-gray-500">total</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Carbos</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{Math.round(totals.totalCarbs)}g</div>
            <div className="text-xs text-gray-500">total</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Gorduras</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{Math.round(totals.totalFat)}g</div>
            <div className="text-xs text-gray-500">total</div>
          </div>
        </div>

        {/* Gráfico Semanal e Balanço */}
        <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <BarChart2 className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Performance da Semana</h3>
          </div>
          
          <BarChart data={weeklyData} dailyGoal={dailyGoal} />

          <div className="mt-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 text-center">Balanço Semanal (Vitória vs Realizado)</h4>
            <div className="flex justify-between items-center">
              <div className="text-center">
                <p className="text-xs text-slate-400">Meta Acumulada</p>
                <p className="font-bold text-slate-700 dark:text-slate-300">{Math.round(weeklyGoalTotal)} kcal</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400">Consumido</p>
                <p className="font-bold text-blue-600">{Math.round(weeklyTotalCalories)} kcal</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400">Diferencial</p>
                <p className={`font-black flex items-center gap-1 ${weeklyBalance > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {weeklyBalance > 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                  {weeklyBalance > 0 ? '+' : ''}{Math.round(weeklyBalance)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Histórico de Hidratação */}
        <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <Droplets className="w-5 h-5 text-cyan-500" />
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Histórico de Hidratação (7 dias)</h3>
          </div>
          
          <WaterHistoryChart history={waterHistory} goal={profile.waterGoal || 2500} />
        </div>

        {/* Relatório Informativo Dinâmico (Dossiê) */}
        <div className="mt-6 bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-200 dark:border-slate-700 pb-3">
            <FileText className="w-5 h-5 text-slate-600" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Relatório Nutricional</h3>
          </div>

          <div className="space-y-4 text-sm text-slate-600">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Perfil</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">{profile.name || 'Usuário'}, {profile.age} anos</p>
                <p className="text-xs text-slate-500 mt-0.5">{profile.activityDays}x/sem - {profile.activityLevel}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Objetivo</p>
                <div className="flex items-center gap-1 font-medium text-slate-900 dark:text-slate-100">
                  {profile.weight}kg <ArrowRight size={12} /> {profile.targetWeight}kg
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Metabolismo & Metas</p>
              <ul className="space-y-1 text-xs bg-white dark:bg-slate-700 p-3 rounded-xl border border-slate-100 dark:border-slate-600 dark:text-slate-200">
                <li>• TMB (Gasto em repouso): <strong>{Math.round(bmr)} kcal</strong></li>
                <li>• Gasto Total Estimado: <strong>{Math.round(tdee)} kcal</strong></li>
                <li>• Meta da Dieta: <strong>{Math.round(dailyGoal)} kcal/dia</strong></li>
              </ul>
            </div>

            {warnings.length > 0 ? (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs font-bold text-rose-500 uppercase mb-2 flex items-center gap-1"><AlertTriangle size={12} /> Alertas</p>
                <div className="space-y-2">
                  {warnings.map((w, i) => (
                    <div key={i} className={`p-2 rounded-lg text-xs font-medium ${w.type === 'danger' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>{w.msg}</div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2 text-emerald-600 text-xs font-bold">
                <CheckCircle size={14} /> <span>Plano equilibrado e seguro.</span>
              </div>
            )}

            <button 
              onClick={handleShare}
              className="w-full mt-4 py-2.5 bg-emerald-500 border border-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors shadow-md"
            >
              <Share2 size={14} />
              Compartilhar no WhatsApp
            </button>

            <button 
              onClick={onEditProfile}
              className="w-full mt-2 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
            >
              <Edit size={14} />
              Atualizar Medidas e Atividade
            </button>

            <button 
              onClick={onOpenDataPortability}
              className="w-full mt-2 py-2.5 bg-white border border-slate-200 text-indigo-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              <Database size={14} />
              Backup & Portabilidade de Dados
            </button>

            <button 
              onClick={onRestartTour}
              className="w-full mt-2 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              <RefreshCw size={14} />
              Reiniciar Tour do Aplicativo
            </button>

            <button 
              onClick={onResetSchedule}
              className="w-full mt-2 py-2.5 bg-white border border-slate-200 text-rose-500 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-50 hover:text-rose-700 transition-colors"
            >
              <AlertTriangle size={14} />
              Resetar Agenda Completa
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Informações das Conquistas */}
      {showBadgesInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-bounce border border-white/20">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Trophy size={18} className="text-yellow-500" /> Guia de Conquistas
              </h3>
              <button onClick={() => setShowBadgesInfo(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Desbloqueie medalhas mantendo a constância e atingindo suas metas. Cada conquista representa um passo na sua evolução.
              </p>
              <div className="space-y-3">
                {badgesData.map(badge => (
                  <div key={badge.id} className="flex items-start gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-2xl">{badge.icon}</div>
                    <div>
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{badge.name}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
              <button onClick={() => setShowBadgesInfo(false)} className="w-full py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-emerald-700 active:scale-95 transition-transform">
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
      {showLevelInfo && <LevelSystemInfoModal onClose={() => setShowLevelInfo(false)} />}
    </div>
  );
};

export default BrainScreen;