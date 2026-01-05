import React, { useState, useMemo } from 'react';
import { Brain, Activity, Target, Zap, Calendar, AlertTriangle, Edit, CheckCircle, FileText, ArrowRight, RefreshCw, BarChart2, TrendingUp, TrendingDown, Share2 } from 'lucide-react';
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

const BrainScreen = ({ schedule, allFoods, profile, onEditProfile, onRestartTour, onResetSchedule }) => {
  const [filterDay, setFilterDay] = useState('Hoje');
  const days = ['Hoje', 'Semana Toda', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

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

    return totals;
  };

  const totals = calculateDailyTotals();
  
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
  const caloriePercentage = Math.min(100, (totals.totalCalories / dailyGoal) * 100);

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
  const goal = Math.round(dailyGoal);
  const remaining = Math.max(0, goal - consumed);
  const excess = Math.max(0, consumed - goal);

  const pieChartData = consumed <= goal 
      ? [
          { value: goal, color: '#e2e8f0' }, // Fundo (slate-200)
          { value: consumed, color: '#22c55e' }, // Progresso (emerald-500)
      ]
      : [
          { value: consumed, color: '#f43f5e' }, // Fundo em excesso (rose-500)
          { value: goal, color: '#22c55e' }, // Meta (emerald-500)
      ];

  // Avisos do Dossiê
  const warnings = [];
  if (totals.totalCalories > dailyGoal * 1.1) {
    warnings.push({ type: 'danger', msg: 'Você ultrapassou sua meta calórica diária!' });
  }
  if (dailyGoal < bmr) {
    warnings.push({ type: 'danger', msg: `ALERTA DE SAÚDE: Sua meta (${Math.round(dailyGoal)} kcal) está abaixo do seu metabolismo basal (${Math.round(bmr)} kcal). Isso é perigoso. Por favor, aumente o prazo da dieta no seu perfil.` });
  }
  if (totals.totalFat < 30 && totals.totalCalories > 500) { // Exemplo simples
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

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Cérebro</h2>
              <p className="text-sm text-gray-500">Análise Inteligente</p>
            </div>
          </div>
          <button onClick={onEditProfile} className="p-2 text-gray-400 hover:text-emerald-600">
            <Edit size={20} />
          </button>
        </div>

        {/* Dados Metabólicos */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <p className="text-[10px] uppercase font-bold text-gray-400">TMB (Repouso)</p>
            <p className="text-lg font-black text-gray-700">{Math.round(bmr)} <span className="text-xs font-normal">kcal</span></p>
          </div>
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
            <p className="text-[10px] uppercase font-bold text-emerald-600">Meta Diária</p>
            <p className="text-lg font-black text-emerald-700">{Math.round(dailyGoal)} <span className="text-xs font-normal">kcal</span></p>
          </div>
        </div>

        {/* Filtro de Dias */}
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-4 h-4 text-gray-400" />
          <p className="text-sm font-bold text-gray-600">Visualizando: {filterDay}</p>
        </div>

        <div className="mb-6 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex gap-2">
            {days.map(d => (
              <button
                key={d}
                onClick={() => setFilterDay(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${filterDay === d ? 'bg-purple-500 text-white' : 'bg-gray-50 text-gray-500'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Barra de Progresso Calorias */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-gray-700">Progresso Calórico</span>
            <span className="font-bold text-gray-500">{Math.round(totals.totalCalories)} / {Math.round(dailyGoal)}</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${totals.totalCalories > dailyGoal ? 'bg-rose-500' : 'bg-emerald-500'}`} 
              style={{ width: `${caloriePercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Gráfico de Pizza */}
        <div className="mt-8 border-t border-gray-100 pt-6">
            <h3 className="text-sm font-bold text-gray-700 mb-4 text-center">Distribuição Calórica do Dia</h3>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
                <div className="relative">
                    <PieChart data={pieChartData} size={140} strokeWidth={22} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-black text-gray-800">{consumed}</span>
                        <span className="text-xs text-gray-500 -mt-1">kcal</span>
                    </div>
                </div>
                <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <div>
                            <div className="font-bold text-gray-600">Consumido</div>
                            <div className="text-gray-500">{consumed} kcal</div>
                        </div>
                    </div>
                    {consumed <= goal ? (
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                            <div>
                                <div className="font-bold text-gray-600">Restante</div>
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
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">Calorias</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{Math.round(totals.totalCalories)}</div>
            <div className="text-xs text-gray-500">kcal</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-600">Proteínas</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{Math.round(totals.totalProtein)}g</div>
            <div className="text-xs text-gray-500">total</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600">Carbos</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{Math.round(totals.totalCarbs)}g</div>
            <div className="text-xs text-gray-500">total</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-gray-600">Gorduras</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{Math.round(totals.totalFat)}g</div>
            <div className="text-xs text-gray-500">total</div>
          </div>
        </div>

        {/* Gráfico Semanal e Balanço */}
        <div className="mt-8 border-t border-gray-100 pt-6">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <BarChart2 className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-bold text-gray-700">Performance da Semana</h3>
          </div>
          
          <BarChart data={weeklyData} dailyGoal={dailyGoal} />

          <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 text-center">Balanço Semanal (Vitória vs Realizado)</h4>
            <div className="flex justify-between items-center">
              <div className="text-center">
                <p className="text-xs text-slate-400">Meta Acumulada</p>
                <p className="font-bold text-slate-700">{Math.round(weeklyGoalTotal)} kcal</p>
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

        {/* Relatório Informativo Dinâmico (Dossiê) */}
        <div className="mt-6 bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-3">
            <FileText className="w-5 h-5 text-slate-600" />
            <h3 className="font-bold text-slate-800">Relatório Nutricional</h3>
          </div>

          <div className="space-y-4 text-sm text-slate-600">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Perfil</p>
                <p className="font-medium text-slate-900">{profile.name || 'Usuário'}, {profile.age} anos</p>
                <p className="text-xs text-slate-500 mt-0.5">{profile.activityDays}x/sem - {profile.activityLevel}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Objetivo</p>
                <div className="flex items-center gap-1 font-medium text-slate-900">
                  {profile.weight}kg <ArrowRight size={12} /> {profile.targetWeight}kg
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Metabolismo & Metas</p>
              <ul className="space-y-1 text-xs bg-white p-3 rounded-xl border border-slate-100">
                <li>• TMB (Gasto em repouso): <strong>{Math.round(bmr)} kcal</strong></li>
                <li>• Gasto Total Estimado: <strong>{Math.round(tdee)} kcal</strong></li>
                <li>• Meta da Dieta: <strong>{Math.round(dailyGoal)} kcal/dia</strong></li>
              </ul>
            </div>

            {warnings.length > 0 ? (
              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs font-bold text-rose-500 uppercase mb-2 flex items-center gap-1"><AlertTriangle size={12} /> Alertas</p>
                <div className="space-y-2">
                  {warnings.map((w, i) => (
                    <div key={i} className={`p-2 rounded-lg text-xs font-medium ${w.type === 'danger' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>{w.msg}</div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-200 flex items-center gap-2 text-emerald-600 text-xs font-bold">
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
    </div>
  );
};

export default BrainScreen;