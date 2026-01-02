import React, { useState } from 'react';
import { Brain, Activity, Target, Zap, Calendar, AlertTriangle, Edit, CheckCircle, FileText, ArrowRight, RefreshCw } from 'lucide-react';

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
      const dailyMeals = schedule.filter(m => m.dayOfWeek === day || m.dayOfWeek === 'Todos');
      
      // Evita duplicidade: se tiver um almoço específico de Segunda e um almoço de Todos, 
      // a lógica ideal seria o específico sobrescrever, mas para simplificar somamos o que está agendado.
      // (Numa versão avançada filtraríamos overrides).
      
      dailyMeals.forEach(meal => {
        if (meal.plate) {
          meal.plate.forEach(item => {
            const food = allFoods.find(f => f.id === item.foodId);
            if (food) {
              const multiplier = item.multiplier || 1;
              totals.totalCalories += food.calories * multiplier;
              totals.totalProtein += food.protein * multiplier;
              totals.totalCarbs += food.carbs * multiplier;
              totals.totalFat += food.fat * multiplier;
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

        <div className="grid grid-cols-2 gap-4">
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