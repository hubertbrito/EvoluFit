import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { FOOD_DATABASE, UNIT_WEIGHTS, getFoodUnitWeight, inferFoodMeasures } from './constants';
import PantryScreen from './components/PantryScreen';
import PlateScreen from './components/PlateScreen';
import BrainScreen from './components/BrainScreen';
import ScheduleScreen from './components/ScheduleScreen';
import SetupScreen from './components/SetupScreen';
import { Layout } from './components/Layout';

// Definindo localmente para não depender de arquivo de tipos externo
const Category = { INDUSTRIALIZADOS: 'Industrializados' };

const TourOverlay = ({ step, onNext, onSkip }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reseta a posição (drag) quando o passo muda para garantir que ele vá para o local "seguro" definido
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
  }, [step]);

  const steps = [
    {
      title: "Bem-vindo ao NutriBrasil!",
      content: "Seu perfil foi configurado com sucesso! Vamos fazer um tour rápido para você dominar o aplicativo e atingir suas metas?",
      action: "Começar Tour",
      arrow: null,
      positionClass: "bottom-24 right-4"
    },
    {
      title: "1. Sua Dispensa",
      content: "Aqui você encontra todos os alimentos. Use a busca ou o microfone para encontrar o que vai comer. Clique no '+' ou no alimento para adicioná-lo ao seu Prato.",
      action: "Próximo",
      arrow: 'top',
      positionClass: "bottom-24 right-4"
    },
    {
      title: "2. Montando o Prato",
      content: "Na aba 'Prato', você define a quantidade exata (ex: 2 colheres) de cada alimento selecionado. O app calcula as calorias em tempo real.",
      action: "Entendi",
      arrow: 'top',
      positionClass: "bottom-24 right-4"
    },
    {
      title: "3. Agendando",
      content: "Depois de montar o prato, use os botões abaixo para escolher os dias e a refeição (ex: Almoço) onde esse prato será servido.",
      action: "Próximo",
      arrow: 'bottom',
      positionClass: "top-24 right-4"
    },
    {
      title: "4. Sua Agenda",
      content: "Aqui fica seu planejamento completo. Você visualiza todas as refeições do dia e seus horários.",
      action: "Próximo",
      arrow: 'top',
      positionClass: "bottom-24 right-4"
    },
    {
      title: "5. Criando Refeições",
      content: "Para criar uma nova refeição (ex: Lanche Extra), a regra é: PRIMEIRO selecione os dias no menu superior, e SÓ DEPOIS clique em 'Adicionar Refeição'.",
      action: "Importante!",
      arrow: 'bottom',
      positionClass: "top-24 right-4"
    },
    {
      title: "6. Fluxo Inverso",
      content: "Você também pode criar uma refeição vazia na Agenda primeiro, e depois ir ao Prato e escolher 'Inserir em...' para preenchê-la.",
      action: "Finalizar",
      arrow: null,
      positionClass: "bottom-24 right-4"
    }
  ];

  const handleMouseDown = (e) => {
    // Evita arrastar se clicar em botões
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
      }
    };
    const handleMouseUp = (e) => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[100] bg-transparent pointer-events-none">
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }`}</style>
      <div 
        className={`bg-white rounded-2xl p-4 max-w-xs w-full shadow-xl border-2 border-emerald-500 absolute pointer-events-auto cursor-move transition-all duration-500 ease-in-out ${current.positionClass}`}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        onMouseDown={handleMouseDown}
      >
        <button 
          onClick={onSkip} 
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          title="Fechar Tour"
        >
          <X size={16} />
        </button>

        <div className="mb-3">
            <h3 className="text-sm font-black text-emerald-600 mb-1">{current.title}</h3>
            <p className="text-gray-600 text-xs leading-relaxed">{current.content}</p>
        </div>
        <div className="flex gap-2 mt-2">
            {step > 0 && <button onClick={onSkip} className="flex-1 py-1.5 rounded-lg font-bold text-xs text-gray-400 hover:bg-gray-100 transition-colors">Pular</button>}
            <button onClick={onNext} className="flex-2 w-full py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-xs shadow-md hover:bg-emerald-700 transition-transform transform active:scale-95">{current.action}</button>
        </div>
        <div className="flex justify-center gap-1 mt-2">{steps.map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === step ? 'bg-emerald-500' : 'bg-gray-200'}`} />)}</div>
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('pantry');
  
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      name: '', 
      weight: 70, 
      height: 170, 
      age: 30, 
      targetWeight: 70, 
      weeks: 12, 
      gender: 'M', 
      activityLevel: 'Sedentário',
      activityDays: 0,
      phone: '',
      isSetupDone: false
    };
  });

  const [customFoods, setCustomFoods] = useState(() => {
    const saved = localStorage.getItem('customFoods');
    return saved ? JSON.parse(saved) : [];
  });

  const [pantryItems, setPantryItems] = useState(() => {
    const saved = localStorage.getItem('pantry');
    return saved ? JSON.parse(saved) : ['1', '2', '3', '4', '5'];
  });
  
  const [currentPlate, setCurrentPlate] = useState([]);
  
  const [mealSchedule, setMealSchedule] = useState(() => {
    const saved = localStorage.getItem('mealSchedule');
    if (saved) return JSON.parse(saved);
    // Inicializamos com slots genéricos que podem ser preenchidos
    return [
      { id: 'm1', name: 'Café da Manhã', time: '08:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
      { id: 'm2', name: 'Lanche das 10h', time: '10:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
      { id: 'm3', name: 'Almoço', time: '12:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
      { id: 'm4', name: 'Chá das Três', time: '15:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
      { id: 'm5', name: 'Lanche das 17h', time: '17:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
      { id: 'm6', name: 'Jantar das 20h', time: '20:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
      { id: 'm7', name: 'Lanche das 22h', time: '22:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
      { id: 'm8', name: 'Ceia da Meia-noite', time: '00:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
    ];
  });

  const [isListening, setIsListening] = useState(false);
  const [scheduleWarnings, setScheduleWarnings] = useState([]);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    localStorage.setItem('pantry', JSON.stringify(pantryItems));
    localStorage.setItem('customFoods', JSON.stringify(customFoods));
    localStorage.setItem('mealSchedule', JSON.stringify(mealSchedule));
  }, [userProfile, pantryItems, customFoods, mealSchedule]);

  useEffect(() => {
    if (userProfile.isSetupDone) {
      const hasSeen = localStorage.getItem('hasSeenTour');
      if (!hasSeen) setShowTour(true);
    }
  }, [userProfile.isSetupDone]);

  useEffect(() => {
    if (showTour) {
       if (tourStep === 1) setActiveTab('pantry');
       if (tourStep === 2 || tourStep === 3) setActiveTab('plate');
       if (tourStep >= 4) setActiveTab('schedule');
    }
  }, [tourStep, showTour]);

  const handleTourNext = () => tourStep < 6 ? setTourStep(p => p + 1) : (setShowTour(false), localStorage.setItem('hasSeenTour', 'true'));
  const handleTourSkip = () => (setShowTour(false), localStorage.setItem('hasSeenTour', 'true'));

  const handleRestartTour = () => {
    setTourStep(0);
    setShowTour(true);
    localStorage.removeItem('hasSeenTour');
  };

  // Cálculo da Meta Diária (Duplicado do BrainScreen para uso nos alertas globais)
  const getDailyGoal = () => {
    const { weight, height, age, gender, activityLevel, activityDays, targetWeight, weeks } = userProfile;    
    if (!weight || !height || !age || !gender || !activityLevel || !targetWeight || !weeks) return 0;
    let bmr = (10 * weight) + (6.25 * height) - (5 * age) + (gender === 'M' ? 5 : -161);
    
    // Cálculo inteligente de TDEE: Base Sedentário (1.2) + (Fator Intensidade * Dias)
    const intensityFactors = {
      'Sedentário': 0,
      'Leve': 0.035,    // Ex: 3 dias * 0.035 = +0.105 (Total ~1.3)
      'Moderada': 0.05,
      'Pesada': 0.075,
      'Atleta': 0.1
    };
    const activityAddon = (intensityFactors[activityLevel] || 0) * (activityDays || 0);
    const tdee = bmr * (1.2 + activityAddon);

    const dailyAdjustment = ((weight - targetWeight) * 7700) / (weeks * 7);
    return Math.max(1200, tdee - dailyAdjustment);
  };

  // Cálculo de Calorias de Hoje
  const getTodayCalories = () => {
    const daysMap = { 0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado' };
    const today = daysMap[new Date().getDay()];
    const allFoods = [...FOOD_DATABASE, ...customFoods];
    
    let total = 0;
    mealSchedule.forEach(meal => {
      if (meal.dayOfWeek === today || meal.dayOfWeek === 'Todos') {
        meal.plate.forEach(item => {
          const food = allFoods.find(f => f.id === item.foodId);
          if (food) {
            const weight = getFoodUnitWeight(food, item.unit) * item.quantity;
            total += (food.calories / 100) * weight;
          }
        });
      }
    });
    return total;
  };

  // Sistema de Alerta em Tempo Real
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHMT = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
      const daysMap = { 0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado' };
      const today = daysMap[now.getDay()];

      // Alerta de Limite de Calorias
      const dailyGoal = getDailyGoal();
      const currentCalories = getTodayCalories();
      // Verifica se passou do limite e se ainda não avisou hoje (lógica simplificada para demo)
      // Num app real, usaríamos um estado para não repetir o alerta a cada 30s
      if (currentCalories > dailyGoal && !window.hasAlertedCalories) {
        alert(`ATENÇÃO: Você ultrapassou sua meta de ${Math.round(dailyGoal)} kcal para hoje!`);
        if ('speechSynthesis' in window) {
          const msg = new SpeechSynthesisUtterance(`Atenção. Você ultrapassou sua meta calórica diária.`);
          msg.lang = 'pt-BR';
          window.speechSynthesis.speak(msg);
        }
        window.hasAlertedCalories = true; // Flag temporária na janela
      }
      
      setMealSchedule(prev => prev.map(meal => {
        const isToday = meal.dayOfWeek === today || meal.dayOfWeek === 'Todos';
        if (isToday && meal.time === currentHMT && !meal.alertTriggered) {
          triggerAlert(meal.name);
          return { ...meal, alertTriggered: true };
        }
        if (meal.time !== currentHMT) return { ...meal, alertTriggered: false };
        return meal;
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, [mealSchedule]);

  const playMealSound = (mealName) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      const name = mealName.toLowerCase();

      // Configura sons diferentes baseados no nome da refeição
      if (name.includes('café')) {
        // Som "Despertar" (Crescente)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.5);
      } else if (name.includes('almoço') || name.includes('jantar') || name.includes('ceia')) {
        // Som "Gongo" (Grave e lento)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
      } else {
        // Lanches (Bip duplo rápido)
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.05, now);
        osc.stop(now + 0.1);
        
        // Segundo bip
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(1200, now + 0.15);
        gain2.gain.setValueAtTime(0.05, now + 0.15);
        osc2.start(now + 0.15);
        osc2.stop(now + 0.25);
        return; 
      }

      osc.start(now);
      osc.stop(now + 1.5);
    } catch (e) {
      console.error("Erro ao tocar som", e);
    }
  };

  const triggerAlert = (mealName) => {
    // 1. Tocar som personalizado
    playMealSound(mealName);

    // 2. Falar (Speech API)
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(`Atenção. Hora do ${mealName}.`);
      msg.lang = 'pt-BR';
      window.speechSynthesis.speak(msg);
    }

    // 3. Notificação Visual e WhatsApp
    setTimeout(() => {
      if (userProfile.phone) {
        const cleanPhone = userProfile.phone.replace(/\D/g, '');
        // Texto da mensagem
        const text = `⏰ Lembrete NutriBrasil: Hora do ${mealName}! Já estou me preparando para comer. 🥗`;
        const link = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(text)}`;
        
        // Usamos confirm para permitir que o usuário decida abrir o WhatsApp
        const shouldOpen = window.confirm(`NUTRI BRASIL\n\nHora do ${mealName}!\nDeseja enviar o lembrete para o WhatsApp?`);
        if (shouldOpen) {
          window.open(link, '_blank');
        }
      } else {
        alert(`NUTRI BRASIL: Hora do ${mealName}!`);
      }
    }, 500); // Pequeno delay para o som começar antes do alerta pausar a tela
  };

  const allAvailableFoods = [...FOOD_DATABASE, ...customFoods];

  const addCustomFood = (name) => {
    const newId = `custom-${Date.now()}`;
    const measures = inferFoodMeasures(name); // Infere medidas automaticamente pelo nome
    const newFood = {
      id: newId, name, emoji: '', category: Category.INDUSTRIALIZADOS,
      calories: 120, protein: 4, carbs: 20, fat: 3, fiber: 1,
      measures // Anexa as medidas ao novo alimento
    };
    setCustomFoods(prev => [...prev, newFood]);
    setPantryItems(prev => Array.from(new Set([...prev, newId])));
    return newId;
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) return;
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = async (event) => {
      const fullTranscript = event.results[0][0].transcript;
      const transcript = fullTranscript.toLowerCase();

      const allFoods = [...FOOD_DATABASE, ...customFoods];
      const foundFoodIds = new Set();

      allFoods.forEach(food => {
        if (transcript.includes(food.name.toLowerCase())) {
          foundFoodIds.add(food.id);
        }
      });

      if (foundFoodIds.size > 0) {
        setPantryItems(prev => Array.from(new Set([...prev, ...foundFoodIds])));
      } else {
        addCustomFood(fullTranscript);
      }
    };
    recognition.start();
  };

  const handleAddMeal = (daysInput) => {
    const days = Array.isArray(daysInput) ? daysInput : [daysInput];
    
    const newMeals = days.map((day, index) => ({
      id: `m-${Date.now()}-${index}`,
      name: 'Nova Refeição',
      time: '14:00',
      plate: [],
      isDone: false,
      dayOfWeek: day,
    }));

    setMealSchedule(prev => [...prev, ...newMeals]);
  };

  const handleDeleteMeal = (mealId) => {
    setMealSchedule(prev => prev.filter(m => m.id !== mealId));
  };

  const handleReorderMeal = (mealId, direction, activeDay) => {
    setMealSchedule(prev => {
      const index = prev.findIndex(m => m.id === mealId);
      if (index === -1) return prev;

      // Encontrar o índice alvo considerando apenas os itens visíveis no dia atual
      let targetIndex = -1;
      const isVisible = (m) => m.dayOfWeek === activeDay || m.dayOfWeek === 'Todos';
      
      if (direction === 'up') {
        for (let i = index - 1; i >= 0; i--) {
          if (isVisible(prev[i])) { targetIndex = i; break; }
        }
      } else {
        for (let i = index + 1; i < prev.length; i++) {
          if (isVisible(prev[i])) { targetIndex = i; break; }
        }
      }

      if (targetIndex === -1) return prev; // Não tem com quem trocar

      const newSchedule = [...prev];
      // Move o item para a nova posição (splice é mais seguro que swap para listas filtradas)
      const [movedItem] = newSchedule.splice(index, 1);
      newSchedule.splice(targetIndex, 0, movedItem);
      
      return newSchedule;
    });
  };

  const validateSchedule = (updatedProfile) => {
    const allFoods = [...FOOD_DATABASE, ...customFoods];
    const warnings = new Set();

    const getNewDailyGoal = (profile) => {
      const { weight, height, age, gender, activityLevel, activityDays, targetWeight, weeks } = profile;
      if (!weight || !height || !age || !gender || !activityLevel || !targetWeight || !weeks) return 0;
      let bmr = (10 * weight) + (6.25 * height) - (5 * age) + (gender === 'M' ? 5 : -161);
      const intensityFactors = { 'Sedentário': 0, 'Leve': 0.035, 'Moderada': 0.05, 'Pesada': 0.075, 'Atleta': 0.1 };
      const activityAddon = (intensityFactors[activityLevel] || 0) * (activityDays || 0);
      const tdee = bmr * (1.2 + activityAddon);
      const dailyAdjustment = ((weight - targetWeight) * 7700) / (weeks * 7);
      return Math.max(1200, tdee - dailyAdjustment);
    };

    const newDailyGoal = getNewDailyGoal(updatedProfile);
    if (newDailyGoal <= 0) return;

    const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

    daysOfWeek.forEach(day => {
      let dayCalories = 0;
      const mealsForDay = mealSchedule.filter(m => m.dayOfWeek === day || m.dayOfWeek === 'Todos');
      
      if (mealsForDay.some(m => m.plate.length > 0)) {
        mealsForDay.forEach(meal => {
          meal.plate.forEach(item => {
            const food = allFoods.find(f => f.id === item.foodId);
            if (food) {
              const weight = getFoodUnitWeight(food, item.unit) * (item.quantity || 0);
              dayCalories += (food.calories / 100) * weight;
            }
          });
        });

        const deviation = Math.abs(dayCalories - newDailyGoal) / newDailyGoal;
        if (deviation > 0.15) { // Alerta se a diferença for maior que 15%
          warnings.add(day);
        }
      }
    });

    const warningArray = Array.from(warnings);
    setScheduleWarnings(warningArray);
    if (warningArray.length > 0) {
      setTimeout(() => alert(`Atenção: Seu planejamento para ${warningArray.join(', ')} não está mais alinhado com suas novas metas. Verifique a aba Agenda.`), 500);
    }
  };

  const handleProfileUpdate = (newProfile) => {
    setUserProfile(newProfile);
    validateSchedule(newProfile);
  };

  if (!userProfile.isSetupDone) {
    return <SetupScreen userProfile={userProfile} onComplete={handleProfileUpdate} />;
  }

  return (
    <>
      <Layout activeTab={activeTab} onTabChange={setActiveTab} plateCount={currentPlate.length}>
      {activeTab === 'pantry' && (
        <PantryScreen 
          allFoods={allAvailableFoods} 
          userPantry={pantryItems} 
          currentPlate={currentPlate}
          onToggle={id => setPantryItems(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])}
          onDelete={id => { setPantryItems(p => p.filter(x => x !== id)); setCustomFoods(c => c.filter(x => x.id !== id)); }}
          onAddToPlate={id => { 
            setCurrentPlate(p => {
              if (p.find(x => x.foodId === id)) return p.filter(x => x.foodId !== id);
              return [...p, { foodId: id, quantity: 1, unit: 'Colher Sopa', multiplier: 1.0 }];
            });
          }}
          onVoiceClick={startListening}
          isListening={isListening}
          onAddManual={addCustomFood}
          showTour={showTour}
          tourStep={tourStep}
        />
      )}
      {activeTab === 'plate' && (
        <PlateScreen 
          plate={currentPlate} 
          onRemove={id => setCurrentPlate(p => p.filter(x => x.foodId !== id))} 
          onUpdate={(id, up) => setCurrentPlate(p => p.map(x => x.foodId === id ? {...x, ...up} : x))} 
          allFoods={allAvailableFoods}
          meals={mealSchedule}
          showTour={showTour}
          tourStep={tourStep}
          onAssignMeal={(mealName, daysInput, targetId) => {
            const defaultTimes = { 
              'Café da Manhã': '08:00', 
              'Lanche das 10h': '10:00',
              'Almoço': '12:00', 
              'Chá das Três': '15:00',
              'Lanche das 17h': '17:00',
              'Jantar das 20h': '20:00',
              'Lanche das 22h': '22:00',
              'Ceia da Meia-noite': '00:00'
            };
            const time = defaultTimes[mealName] || '12:00';

            if (targetId) {
              const targetMeal = mealSchedule.find(m => m.id === targetId);
              if (targetMeal) {
                alert(`Prato inserido com sucesso em "${targetMeal.name}"!`);
              }
            }

            setMealSchedule(prev => {
              // Se um ID específico foi fornecido (para "Nova Refeição" criada na Agenda), usamos ele
              if (targetId) {
                return prev.map(m => m.id === targetId 
                  ? { ...m, plate: [...m.plate, ...currentPlate], isDone: true } 
                  : m
                );
              }

              // Normaliza a entrada para garantir que seja um array de dias
              const days = Array.isArray(daysInput) ? daysInput : [daysInput];
              let nextSchedule = [...prev];

              days.forEach(day => {
                // Se for 'Todos', atualiza a refeição padrão existente
                if (day === 'Todos') {
                  nextSchedule = nextSchedule.map(m => m.name === mealName && m.dayOfWeek === 'Todos' 
                    ? { ...m, plate: [...m.plate, ...currentPlate], isDone: true } 
                    : m
                  );
                } else {
                  // Se for dia específico, verifica se já existe para atualizar ou cria nova
                  const existsIndex = nextSchedule.findIndex(m => m.name === mealName && m.dayOfWeek === day);
                  
                  if (existsIndex >= 0) {
                    const m = nextSchedule[existsIndex];
                    nextSchedule[existsIndex] = { ...m, plate: [...m.plate, ...currentPlate], isDone: true };
                  } else {
                    // Cria nova entrada específica para o dia
                    // Tenta herdar o horário do card padrão 'Todos' para manter consistência
                    const templateMeal = nextSchedule.find(m => m.name === mealName && m.dayOfWeek === 'Todos');
                    const mealTime = templateMeal ? templateMeal.time : time;

                    nextSchedule.push({ id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, name: mealName, time: mealTime, plate: [...currentPlate], isDone: true, dayOfWeek: day });
                  }
                }
              });

              return nextSchedule;
            });
            
            setCurrentPlate([]);
            setActiveTab('schedule');
          }}
          onAddMore={() => setActiveTab('pantry')}
        />
      )}
      {activeTab === 'schedule' && (
        <ScheduleScreen 
          meals={mealSchedule} 
          onUpdateMeals={setMealSchedule} 
          allFoods={allAvailableFoods}
          unitWeights={UNIT_WEIGHTS}
          scheduleWarnings={scheduleWarnings}
          onClearWarnings={() => setScheduleWarnings([])}
          onAddMeal={handleAddMeal}
          onDeleteMeal={handleDeleteMeal}
          onReorderMeal={handleReorderMeal}
          showTour={showTour}
          tourStep={tourStep}
        />
      )}
      {activeTab === 'brain' && (
        <BrainScreen 
          schedule={mealSchedule} 
          allFoods={allAvailableFoods} 
          profile={userProfile}
          onRestartTour={handleRestartTour}
          onEditProfile={() => setUserProfile(prev => ({ ...prev, isSetupDone: false }))}
        />
      )}
      </Layout>
      {showTour && <TourOverlay step={tourStep} onNext={handleTourNext} onSkip={handleTourSkip} />}
    </>
  );
};

export default App;