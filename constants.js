export const FOOD_DATABASE = [
  { id: '1', name: 'Arroz Branco', emoji: '🍚', category: 'Carboidratos', calories: 130, protein: 2, carbs: 28, fat: 0, fiber: 0 },
  { id: '2', name: 'Feijão Carioca', emoji: '🫘', category: 'Leguminosas', calories: 76, protein: 5, carbs: 14, fat: 0.5, fiber: 8 },
  { id: '3', name: 'Frango Grelhado', emoji: '🍗', category: 'Proteínas', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
  { id: '4', name: 'Ovo Cozido', emoji: '🥚', category: 'Proteínas', calories: 155, protein: 13, carbs: 1, fat: 11, fiber: 0 },
  { id: '5', name: 'Salada Mista', emoji: '🥗', category: 'Vegetais', calories: 20, protein: 1, carbs: 4, fat: 0, fiber: 2 },
  { id: '6', name: 'Banana', emoji: '🍌', category: 'Frutas', calories: 89, protein: 1, carbs: 23, fat: 0, fiber: 2.6 },
];

// Peso base em gramas para cada unidade (Estimativa média para cálculo)
// O banco de dados é baseado em 100g
export const UNIT_WEIGHTS = {
  '10ml': 10,
  '50ml': 50,
  '100ml': 100,
  '200ml': 200,
  '500ml': 500,
  '1 Litro': 1000,
  'Pitada': 2,
  'Colher de Chá': 5,
  'Colher de Sopa': 15,
  'Colher de Servir': 40,
  'Xícara': 240,
  'Unidade Pequena': 60,
  'Unidade Média': 100,
  'Unidade Grande': 150,
  'Unidade': 100, // Padrão
  'Fatia Fina': 20,
  'Fatia Média': 35,
  'Fatia Grossa': 50,
  'Porção Pequena': 80,
  'Porção Média': 150,
  'Porção Grande': 250,
  'Concha Pequena': 90,
  'Concha Média': 150,
  'Concha Grande': 220,
  'Prato Pequeno': 300,
  'Prato Médio': 500,
  'Prato Grande': 700,
  '50g': 50,
  '100g': 100,
  '150g': 150,
  '200g': 200,
  '250g': 250,
  '300g': 300,
  '400g': 400,
  '500g': 500
};

export const MEASURE_UNITS = Object.keys(UNIT_WEIGHTS);