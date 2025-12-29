
export enum Category {
  CARBOIDRATOS = 'Carboidratos',
  PROTEINAS = 'Proteínas',
  VEGETAIS = 'Vegetais',
  FRUTAS = 'Frutas',
  GORDURAS = 'Gorduras',
  INDUSTRIALIZADOS = 'Industrializados'
}

export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  category: Category;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export type MeasureUnit = 
  | 'Grama' | '100g' | '200g' | '300g' | '400g' | '500g' | '600g' | '1kg'
  | 'Colher Cafe' | 'Colher Cha' | 'Colher Sobremesa' | 'Colher Sopa' | 'Colher Servir' 
  | 'Concha Pequena' | 'Concha Media' | 'Concha Grande' 
  | 'Xicara' | 'Copo Americano' 
  | 'Unidade' | 'Unidade P' | 'Unidade M' | 'Unidade G' 
  | 'Fatia Fina' | 'Fatia Grossa';

export type ActivityLevel = 'Sedentário' | 'Leve' | 'Moderado' | 'Pesado' | 'Atleta';

export type DayOfWeek = 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado' | 'Domingo' | 'Todos' | 'Avulso';

export interface PlateItem {
  foodId: string;
  quantity: number;
  unit: MeasureUnit;
  multiplier: number;
}

export interface MealSlot {
  id: string;
  name: string;
  time: string;
  plate: PlateItem[];
  isDone: boolean;
  dayOfWeek?: DayOfWeek;
  alertTriggered?: boolean;
}

export interface UserProfile {
  name: string;
  weight: number;
  height: number;
  age: number;
  targetWeight: number;
  weeks: number;
  gender: 'M' | 'F';
  activityLevel: ActivityLevel;
  activityDays: number;
  isSetupDone: boolean;
}
