
import React, { useState } from 'react';
import { UserProfile, ActivityLevel } from '../types';
import { Target, User, Ruler, Weight, Dumbbell, ChevronRight } from 'lucide-react';

interface SetupProps {
  userProfile: UserProfile;
  onComplete: (profile: UserProfile) => void;
}

const SetupScreen: React.FC<SetupProps> = ({ userProfile, onComplete }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<UserProfile>(userProfile);

  const steps = [
    {
      title: "Como devemos te chamar?",
      icon: <User className="text-emerald-500" size={48}/>,
      component: (
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Seu Nome"
            value={data.name}
            onChange={(e) => setData({...data, name: e.target.value})}
            className="w-full bg-white p-6 rounded-[2rem] text-2xl font-black shadow-sm outline-none text-emerald-600 placeholder-emerald-100"
          />
          <div className="flex justify-center space-x-4">
            <button onClick={() => setData({...data, gender: 'M'})} className={`p-6 rounded-3xl font-black ${data.gender === 'M' ? 'bg-emerald-500 text-white' : 'bg-white'}`}>HOMEM</button>
            <button onClick={() => setData({...data, gender: 'F'})} className={`p-6 rounded-3xl font-black ${data.gender === 'F' ? 'bg-emerald-500 text-white' : 'bg-white'}`}>MULHER</button>
          </div>
        </div>
      )
    },
    {
      title: "Quais suas medidas?",
      icon: <Ruler className="text-emerald-500" size={48}/>,
      component: (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Idade: {data.age} anos</label>
            <input type="range" min="10" max="100" value={data.age} onChange={e => setData({...data, age: parseInt(e.target.value)})} className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"/>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Altura: {data.height} cm</label>
            <input type="range" min="120" max="220" value={data.height} onChange={e => setData({...data, height: parseInt(e.target.value)})} className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"/>
          </div>
        </div>
      )
    },
    {
      title: "Status de Peso",
      icon: <Weight className="text-emerald-500" size={48}/>,
      component: (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Peso Atual: {data.weight} kg</label>
            <input type="range" min="40" max="200" step="0.5" value={data.weight} onChange={e => setData({...data, weight: parseFloat(e.target.value)})} className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"/>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Peso Meta: {data.targetWeight} kg</label>
            <input type="range" min="40" max="200" step="0.5" value={data.targetWeight} onChange={e => setData({...data, targetWeight: parseFloat(e.target.value)})} className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"/>
          </div>
        </div>
      )
    },
    {
      title: "Nível de Exercício",
      icon: <Dumbbell className="text-emerald-500" size={48}/>,
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {(['Sedentário', 'Leve', 'Moderado', 'Pesado', 'Atleta'] as ActivityLevel[]).map((level) => (
              <button 
                key={level}
                onClick={() => setData({...data, activityLevel: level})}
                className={`p-4 rounded-3xl text-[10px] font-black uppercase transition-all ${data.activityLevel === level ? 'bg-emerald-500 text-white shadow-lg scale-105' : 'bg-white text-gray-400 shadow-sm'}`}
              >
                {level}
              </button>
            ))}
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Frequência: {data.activityDays} dias/semana</label>
            <input type="range" min="0" max="7" step="1" value={data.activityDays} onChange={e => setData({...data, activityDays: parseInt(e.target.value)})} className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"/>
          </div>
          <p className="text-center text-[10px] text-gray-400 font-bold uppercase leading-relaxed px-4 italic">
            *Sedentário (0 dias), Leve (1-3 dias), Moderado (3-5 dias), Pesado (6-7 dias), Atleta (Intenso diário)
          </p>
        </div>
      )
    },
    {
      title: "Prazo da Jornada",
      icon: <Target className="text-emerald-500" size={48}/>,
      component: (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Em quantas semanas? {data.weeks}</label>
            <input type="range" min="2" max="52" value={data.weeks} onChange={e => setData({...data, weeks: parseInt(e.target.value)})} className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"/>
          </div>
          <p className="text-center text-xs text-gray-400 font-medium">Cálculos baseados em 7.700kcal por kg de variação e TDEE dinâmico.</p>
        </div>
      )
    }
  ];

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else onComplete({...data, isSetupDone: true});
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col p-6 max-w-md mx-auto relative overflow-hidden">
      <div className="mt-12 mb-8 flex flex-col items-center space-y-4">
        <div className="p-6 bg-emerald-100 rounded-full">{steps[step].icon}</div>
        <h1 className="text-2xl font-black text-gray-800 text-center uppercase tracking-tighter">{steps[step].title}</h1>
      </div>

      <div className="flex-1">
        {steps[step].component}
      </div>

      <button 
        onClick={next}
        className="mb-8 w-full bg-emerald-500 text-white p-8 rounded-[2.5rem] font-black flex items-center justify-center space-x-2 shadow-2xl active:scale-95 transition-all"
      >
        <span>CONTINUAR</span>
        <ChevronRight size={24}/>
      </button>

      <div className="flex space-x-1 justify-center mb-4">
        {steps.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${step === i ? 'w-8 bg-emerald-500' : 'w-2 bg-emerald-200'}`}/>
        ))}
      </div>
    </div>
  );
};

export default SetupScreen;
