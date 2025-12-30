
import React, { useState, useEffect } from 'react';
import { Category, FoodItem, PlateItem, MeasureUnit, MealSlot, UserProfile, DayOfWeek } from './types';
import { FOOD_DATABASE } from './constants';
import { detectFoodFromText } from './services/geminiService';
import PantryScreen from './components/PantryScreen';
import PlateScreen from './components/PlateScreen';
import BrainScreen from './components/BrainScreen';
import ScheduleScreen from './components/ScheduleScreen';
import SetupScreen from './components/SetupScreen';
import { Layout } from './components/Layout';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pantry' | 'plate' | 'schedule' | 'brain'>('pantry');
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
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
      isSetupDone: false
    };
  });

  const [customFoods, setCustomFoods] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('customFoods');
    return saved ? JSON.parse(saved) : [];
  });

  const [pantryItems, setPantryItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('pantry');
    return saved ? JSON.parse(saved) : ['1', '2', '3', '4', '5'];
  });
  
  const [currentPlate, setCurrentPlate] = useState<PlateItem[]>([]);
  
  const [mealSchedule, setMealSchedule] = useState<MealSlot[]>(() => {
    const saved = localStorage.getItem('mealSchedule');
    if (saved) return JSON.parse(saved);
    // Inicializamos com slots genéricos que podem ser preenchidos
    return [
      { id: 'm1', name: 'Café da Manhã', time: '08:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
      { id: 'm2', name: 'Almoço', time: '12:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
      { id: 'm3', name: 'Lanche', time: '16:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
      { id: 'm4', name: 'Jantar', time: '20:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
    ];
  });

  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    localStorage.setItem('pantry', JSON.stringify(pantryItems));
    localStorage.setItem('customFoods', JSON.stringify(customFoods));
    localStorage.setItem('mealSchedule', JSON.stringify(mealSchedule));
  }, [userProfile, pantryItems, customFoods, mealSchedule]);

  // Sistema de Alerta em Tempo Real
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHMT = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
      const daysMap: Record<number, DayOfWeek> = { 0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado' };
      const today = daysMap[now.getDay()];
      
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

  const triggerAlert = (mealName: string) => {
    alert(`NUTRI BRASIL: Hora do ${mealName}!`);
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(`Hora do ${mealName}. Vamos comer de forma saudável!`);
      msg.lang = 'pt-BR';
      window.speechSynthesis.speak(msg);
    }
  };

  const allAvailableFoods = [...FOOD_DATABASE, ...customFoods];

  const addCustomFood = (name: string) => {
    const newId = `custom-${Date.now()}`;
    const newFood: FoodItem = {
      id: newId, name, emoji: '', category: Category.INDUSTRIALIZADOS,
      calories: 120, protein: 4, carbs: 20, fat: 3, fiber: 1
    };
    setCustomFoods(prev => [...prev, newFood]);
    setPantryItems(prev => Array.from(new Set([...prev, newId])));
    return newId;
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) return;
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      const detectedItems = await detectFoodFromText(transcript);
      if (detectedItems?.length > 0) {
        detectedItems.forEach((item: any) => {
          if (item.id) setPantryItems(prev => Array.from(new Set([...prev, item.id])));
          else if (item.name) addCustomFood(item.name);
        });
      } else { addCustomFood(transcript); }
    };
    recognition.start();
  };

  if (!userProfile.isSetupDone) {
    return <SetupScreen userProfile={userProfile} onComplete={setUserProfile} />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} plateCount={currentPlate.length}>
      {activeTab === 'pantry' && (
        <PantryScreen 
          allFoods={allAvailableFoods} 
          userPantry={pantryItems} 
          currentPlate={currentPlate}
          onToggle={id => setPantryItems(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])}
          onDelete={id => { setPantryItems(p => p.filter(x => x !== id)); setCustomFoods(c => c.filter(x => x.id !== id)); }}
          onAddToPlate={id => { 
            setCurrentPlate(p => p.find(x => x.foodId === id) ? p : [...p, { foodId: id, quantity: 1, unit: 'Colher Sopa', multiplier: 1.0 }]);
          }}
          onVoiceClick={startListening}
          isListening={isListening}
          onAddManual={addCustomFood}
        />
      )}
      {activeTab === 'plate' && (
        <PlateScreen 
          plate={currentPlate} 
          onRemove={id => setCurrentPlate(p => p.filter(x => x.foodId !== id))} 
          onUpdate={(id, up) => setCurrentPlate(p => p.map(x => x.foodId === id ? {...x, ...up} : x))} 
          allFoods={allAvailableFoods}
          meals={mealSchedule}
          onAssignMeal={(mealId, day) => { 
            setMealSchedule(s => s.map(m => m.id === mealId ? { ...m, plate: [...currentPlate], isDone: true, dayOfWeek: day } : m));
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
        />
      )}
      {activeTab === 'brain' && (
        <BrainScreen 
          schedule={mealSchedule} 
          allFoods={allAvailableFoods} 
          profile={userProfile}
        />
      )}
    </Layout>
  );
};

export default App;
