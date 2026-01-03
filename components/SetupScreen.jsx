import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, User, Activity, Info, ChevronDown } from 'lucide-react';

const CustomSelect = ({ options, value, onChange, placeholder, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedRef = useRef(null);

  useEffect(() => {
    if (isOpen && selectedRef.current) {
      // Scroll the selected item into view when the modal opens
      setTimeout(() => { // Timeout to allow rendering
        selectedRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, value]);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Find the label for the currently selected value
  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`w-full p-2.5 border rounded-xl bg-white text-left flex justify-between items-center transition-colors ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500'}`}
      >
        <span className={value !== undefined && value !== '' && value !== null ? 'text-gray-900' : 'text-gray-400'}>
          {displayLabel}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setIsOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 animate-fade-in-fast"></div>
          
          <div 
            className="bg-white w-full max-w-md rounded-t-2xl shadow-lg max-h-[40vh] flex flex-col z-10 animate-slide-up"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <div className="p-4 border-b text-center font-bold text-gray-700 shrink-0">
              {placeholder}
            </div>
            <div className="overflow-y-auto">
              {options.map(option => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    ref={isSelected ? selectedRef : null}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full text-center p-3 text-lg transition-colors ${isSelected ? 'bg-emerald-500 text-white font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* Add animations */}
      <style>{`
        @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

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
                  <CustomSelect
                    value={data.age}
                    onChange={(val) => handleChange('age', val)}
                    options={ageOptions}
                    placeholder="Selecione"
                    error={errors.age}
                  />
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
                  <CustomSelect
                    value={data.weight}
                    onChange={(val) => handleChange('weight', val)}
                    options={weightOptions}
                    placeholder="Selecione"
                    error={errors.weight}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Altura (cm)</label>
                  <CustomSelect
                    value={data.height}
                    onChange={(val) => handleChange('height', val)}
                    options={heightOptions}
                    placeholder="Selecione"
                    error={errors.height}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Meta de Peso (kg)</label>
                <CustomSelect
                  value={data.targetWeight}
                  onChange={(val) => handleChange('targetWeight', val)}
                  options={weightOptions}
                  placeholder="Selecione"
                  error={errors.targetWeight}
                />
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
                <CustomSelect
                  value={data.activityDays}
                  onChange={(val) => handleChange('activityDays', val)}
                  options={activityDaysOptions}
                  placeholder="Selecione"
                  error={errors.activityDays}
                />
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
                <CustomSelect
                  value={data.weeks}
                  onChange={(val) => handleChange('weeks', val)}
                  options={weeksOptions}
                  placeholder="Selecione"
                  error={errors.weeks}
                />
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