import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, User, Activity, Info, ChevronDown, X, Volume2, Settings, Sun, Moon } from 'lucide-react';
import CustomSelect from './CustomSelect';

const SetupScreen = ({ userProfile, onComplete, onCancel, currentTheme, onThemeChange }) => {
  const [step, setStep] = useState(1);
  // Garante que os campos numéricos com select customizado comecem vazios
  const [data, setData] = useState({
    ...userProfile,
    age: userProfile.age || '',
    weight: userProfile.weight || '',
    height: userProfile.height || '',
    targetWeight: userProfile.targetWeight || '',
    weeks: userProfile.weeks || '',
    waterGoal: userProfile.waterGoal || '2500',
    alarmSound: userProfile.alarmSound || 'sine',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: false }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!data.name || !data.name.trim()) newErrors.name = true;
      if (!data.age) newErrors.age = true;
    }
    if (step === 2) {
      if (!data.weight) newErrors.weight = true;
      if (!data.height) newErrors.height = true;
      if (!data.targetWeight) newErrors.targetWeight = true;
    }
    if (step === 3) {
      if (data.activityDays === '' || data.activityDays === null || data.activityDays === undefined) newErrors.activityDays = true;
      if (!data.weeks) newErrors.weeks = true;
    }
    return newErrors;
  };

  const handleNext = () => {
    const currentErrors = validateStep();
    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }
    if (step < 4) setStep(step + 1);
    else onComplete({ ...data, isSetupDone: true });
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const ageOptions = Array.from({ length: 91 }, (_, i) => ({ value: i + 10, label: `${i + 10}` }));
  const weightOptions = Array.from({ length: 171 }, (_, i) => ({ value: i + 30, label: `${i + 30} kg` }));
  const heightOptions = Array.from({ length: 131 }, (_, i) => ({ value: i + 100, label: `${i + 100} cm` }));
  const weeksOptions = Array.from({ length: 13 }, (_, i) => ({ value: (i + 1) * 4, label: `${(i + 1) * 4} semanas` }));
  const activityDaysOptions = [
    { value: 0, label: '0 dias (Sedentário)' },
    { value: 1, label: '1 dia' },
    { value: 2, label: '2 dias' },
    { value: 3, label: '3 dias' },
    { value: 4, label: '4 dias' },
    { value: 5, label: '5 dias' },
    { value: 6, label: '6 dias' },
    { value: 7, label: '7 dias (Todos os dias)' },
  ];

  const waterGoalOptions = Array.from({ length: 13 }, (_, i) => ({ value: (i + 4) * 500, label: `${(i + 4) * 500} ml` })); // 2000ml a 8000ml

  const alarmOptions = [
    { value: 'sine', label: 'Suave (Flauta)' },
    { value: 'square', label: 'Retrô (Game)' },
    { value: 'sawtooth', label: 'Intenso (Digital)' },
    { value: 'triangle', label: 'Zen (Gota)' },
  ];

  const playPreview = (type) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      osc.type = type;
      gain.gain.setValueAtTime(0, now);

      const playNote = (freq, startTime, duration) => {
        gain.gain.linearRampToValueAtTime(0.1, startTime + 0.01);
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);
      };

      playNote(880, now, 0.15);
      playNote(1046.50, now + 0.2, 0.15);
      playNote(1318.51, now + 0.4, 0.2);

      osc.start(now);
      osc.stop(now + 0.7);
    } catch (e) {
      console.error("Erro ao tocar preview", e);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full space-y-8 relative">
        {/* Botão de Cancelar Edição (Só aparece se onCancel for passado) */}
        {onCancel && (
          <button 
            onClick={onCancel}
            className="absolute -top-12 right-0 p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all flex items-center gap-1"
            title="Cancelar Edição e Voltar"
          >
            <span className="text-xs font-bold uppercase">Cancelar</span>
            <X size={20} />
          </button>
        )}

        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Bem-vindo ao EvoluFit</h1>
          <p className="text-gray-500 text-sm mt-1">Vamos configurar seu perfil para gerar metas precisas e personalizadas.</p>
        </div>

        <div className="space-y-4">
          {step === 1 && (
            <div className="animate-fade-in-fast">
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex gap-3 items-start">
                <Info className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-700"><strong>Passo 1/4:</strong> Comece nos dizendo quem é você. Esses dados identificam seu perfil no relatório.</p>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-bold text-emerald-800 mb-1">Seu Nome</label>
                <input 
                  type="text" 
                  value={data.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full p-2.5 border-2 bg-emerald-50/50 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none ${errors.name ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  placeholder="Ex: Maria"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-bold text-emerald-800 mb-1">WhatsApp (com DDD)</label>
                <input 
                  type="tel" 
                  value={data.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full p-2.5 border-2 bg-emerald-50/50 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Ex: 11999999999"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-bold text-emerald-800 mb-1">Idade</label>
                  <CustomSelect
                    value={data.age}
                    onChange={(val) => handleChange('age', val)}
                    options={ageOptions}
                    placeholder="Selecione"
                    error={errors.age}
                    className="bg-emerald-50/50 border-emerald-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-emerald-800 mb-1">Gênero</label>
                  <select 
                    value={data.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-fast">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex gap-3 items-start">
                <Activity className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700"><strong>Passo 2/4:</strong> Suas medidas corporais são essenciais para calcular sua <strong>Taxa Metabólica Basal (TMB)</strong>.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-bold text-blue-800 mb-1">Peso (kg)</label>
                  <CustomSelect
                    value={data.weight}
                    onChange={(val) => handleChange('weight', val)}
                    options={weightOptions}
                    placeholder="Selecione"
                    error={errors.weight}
                    className="bg-blue-50/50 border-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blue-800 mb-1">Altura (cm)</label>
                  <CustomSelect
                    value={data.height}
                    onChange={(val) => handleChange('height', val)}
                    options={heightOptions}
                    placeholder="Selecione"
                    error={errors.height}
                    className="bg-blue-50/50 border-blue-200"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-bold text-blue-800 mb-1">Meta de Peso (kg)</label>
                <CustomSelect
                  value={data.targetWeight}
                  onChange={(val) => handleChange('targetWeight', val)}
                  options={weightOptions}
                  placeholder="Selecione"
                  error={errors.targetWeight}
                  className="bg-blue-50/50 border-blue-200"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in-fast">
              <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 flex gap-3 items-start mb-6">
                <Activity className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                <p className="text-xs text-purple-700"><strong>Passo 3/4:</strong> Defina seu nível de atividade e o <strong>prazo da meta</strong>. Isso ajustará seu cálculo calórico diário.</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-purple-800 mb-1">Meta Diária de Água</label>
                <CustomSelect
                  value={data.waterGoal}
                  onChange={(val) => handleChange('waterGoal', val)}
                  options={waterGoalOptions}
                  placeholder="Selecione"
                  className="bg-purple-50/50 border-purple-200"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-purple-800 mb-1">Frequência de Treinos</label>
                <p className="text-xs text-gray-500 mb-2">Quantos dias por semana você pratica exercícios físicos?</p>
                <CustomSelect
                  value={data.activityDays}
                  onChange={(val) => handleChange('activityDays', val)}
                  options={activityDaysOptions}
                  placeholder="Selecione"
                  error={errors.activityDays}
                  className="bg-purple-50/50 border-purple-200"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-purple-800 mb-1">Intensidade do Esforço</label>
                <p className="text-xs text-gray-500 mb-2">Como você descreveria o nível de cansaço dos seus treinos?</p>
                <select 
                  value={data.activityLevel}
                  onChange={(e) => handleChange('activityLevel', e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-white mb-4"
                >
                  <option value="Sedentário">Nenhum / Sedentário</option>
                  <option value="Leve">Leve (Caminhada, Yoga, Alongamento)</option>
                  <option value="Moderada">Moderada (Corrida leve, Musculação, Dança)</option>
                  <option value="Pesada">Pesada (Crossfit, Corrida intensa, Lutas)</option>
                  <option value="Atleta">Atleta (Treino profissional/Competição)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-purple-800 mb-1">Prazo para a Meta (Semanas)</label>
                <p className="text-xs text-gray-500 mb-2">Em quantas semanas você quer chegar ao peso ideal?</p>
                <CustomSelect
                  value={data.weeks}
                  onChange={(val) => handleChange('weeks', val)}
                  options={weeksOptions}
                  placeholder="Selecione"
                  error={errors.weeks}
                  className="bg-purple-50/50 border-purple-200"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in-fast">
              <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 flex gap-3 items-start mb-6">
                <Settings className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-xs text-orange-700"><strong>Passo 4/4:</strong> Personalize sua experiência. Escolha o som que vai te avisar na hora de comer.</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-orange-800 mb-1">Aparência do App</label>
                <div className="flex bg-orange-100 p-1 rounded-xl">
                    <button 
                        onClick={() => onThemeChange('light')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${currentTheme === 'light' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'}`}
                    >
                        <Sun size={16} />
                        Claro
                    </button>
                    <button 
                        onClick={() => onThemeChange('dark')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${currentTheme === 'dark' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500'}`}
                    >
                        <Moon size={16} />
                        Escuro
                    </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-orange-800 mb-1">Som do Alarme</label>
                <div className="flex gap-2">
                    <div className="flex-1">
                        <CustomSelect
                        value={data.alarmSound}
                        onChange={(val) => {
                            handleChange('alarmSound', val);
                            playPreview(val);
                        }}
                        options={alarmOptions}
                        placeholder="Selecione"
                        className="bg-orange-50/50 border-orange-200"
                        />
                    </div>
                    <button 
                        onClick={() => playPreview(data.alarmSound)}
                        className="p-3 bg-orange-100 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-200 transition-colors"
                        title="Testar Som"
                    >
                        <Volume2 size={20} />
                    </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {step > 1 && (
              <button 
                onClick={handleBack}
                className="w-1/3 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Voltar
              </button>
            )}
            <button 
              onClick={handleNext}
              className="flex-1 bg-emerald-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
            >
                {step === 4 ? 'Concluir' : 'Próximo'} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;