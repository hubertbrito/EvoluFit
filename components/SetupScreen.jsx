import React, { useState } from 'react';
import { ArrowRight, User, Activity, Info } from 'lucide-react';

const SetupScreen = ({ userProfile, onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(userProfile);
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
    if (step < 3) setStep(step + 1);
    else onComplete({ ...data, isSetupDone: true });
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Helper para gerar opções de datalist
  const renderOptions = (start, end, step = 1) => {
    const options = [];
    for (let i = start; i <= end; i += step) options.push(<option key={i} value={i}>{i}</option>);
    return options;
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Bem-vindo ao NutriBrasil</h1>
          <p className="text-gray-500 text-sm mt-1">Vamos configurar seu perfil para gerar metas precisas e personalizadas.</p>
        </div>

        <div className="space-y-4">
          {step === 1 && (
            <>
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex gap-3 items-start">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700"><strong>Passo 1/3:</strong> Comece nos dizendo quem é você. Esses dados identificam seu perfil no relatório.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Seu Nome</label>
                <input 
                  type="text" 
                  value={data.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none ${errors.name ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  placeholder="Ex: Maria"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp (com DDD)</label>
                <input 
                  type="tel" 
                  value={data.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Ex: 11999999999"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Idade</label>
                  <select 
                    value={data.age || ''}
                    onChange={(e) => handleChange('age', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    className={`w-full p-2.5 border rounded-xl bg-white ${errors.age ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  >
                    <option value="" disabled>Selecione</option>
                    {renderOptions(10, 100)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Gênero</label>
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
            </>
          )}

          {step === 2 && (
            <>
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex gap-3 items-start">
                <Activity className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700"><strong>Passo 2/3:</strong> Suas medidas corporais são essenciais para calcular sua <strong>Taxa Metabólica Basal (TMB)</strong>.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Peso (kg)</label>
                  <select 
                    value={data.weight || ''}
                    onChange={(e) => handleChange('weight', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    className={`w-full p-2.5 border rounded-xl bg-white ${errors.weight ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  >
                    <option value="" disabled>Selecione</option>
                    {renderOptions(30, 200)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Altura (cm)</label>
                  <select 
                    value={data.height || ''}
                    onChange={(e) => handleChange('height', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    className={`w-full p-2.5 border rounded-xl bg-white ${errors.height ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  >
                    <option value="" disabled>Selecione</option>
                    {renderOptions(100, 230)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Meta de Peso (kg)</label>
                <select 
                  value={data.targetWeight || ''}
                  onChange={(e) => handleChange('targetWeight', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                  className={`w-full p-2.5 border rounded-xl bg-white ${errors.targetWeight ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                >
                  <option value="" disabled>Selecione</option>
                  {renderOptions(30, 200)}
                </select>
              </div>
            </>
          )}

          {step === 3 && (
            <div>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex gap-3 items-start mb-6">
                <Activity className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-700"><strong>Passo 3/3:</strong> Defina seu nível de atividade e o <strong>prazo da meta</strong>. Isso ajustará seu cálculo calórico diário.</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Frequência de Treinos</label>
                <p className="text-xs text-gray-500 mb-2">Quantos dias por semana você pratica exercícios físicos?</p>
                <select 
                  value={data.activityDays}
                  onChange={(e) => handleChange('activityDays', Number(e.target.value))}
                  className={`w-full p-2.5 border rounded-xl bg-white ${errors.activityDays ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                >
                  <option value={0}>0 dias (Sedentário)</option>
                  <option value={1}>1 dia</option>
                  <option value={2}>2 dias</option>
                  <option value={3}>3 dias</option>
                  <option value={4}>4 dias</option>
                  <option value={5}>5 dias</option>
                  <option value={6}>6 dias</option>
                  <option value={7}>7 dias (Todos os dias)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Intensidade do Esforço</label>
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
                <label className="block text-sm font-bold text-gray-700 mb-1">Prazo para a Meta (Semanas)</label>
                <p className="text-xs text-gray-500 mb-2">Em quantas semanas você quer chegar ao peso ideal?</p>
                <select 
                  value={data.weeks || ''}
                  onChange={(e) => handleChange('weeks', e.target.value === '' ? '' : Math.max(1, Number(e.target.value)))}
                  className={`w-full p-2.5 border rounded-xl bg-white ${errors.weeks ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                >
                  <option value="" disabled>Selecione</option>
                  {renderOptions(4, 52, 4)}
                </select>
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
              {step === 3 ? 'Concluir' : 'Próximo'} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;