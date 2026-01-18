export const DISH_SIZES = {
  'Pequeno': { base: 80, legume: 50, protein: 80, garnish: 30, salad: 40, label: 'Pequeno (Dieta)', icon: '🍽️' },
  'Padrão': { base: 150, legume: 140, protein: 120, garnish: 60, salad: 60, label: 'Padrão (PF)', icon: '🍛' },
  'Grande': { base: 250, legume: 220, protein: 180, garnish: 100, salad: 80, label: 'Grande (Fome)', icon: '🥘' },
  'Bowl': { base: 120, legume: 80, protein: 100, garnish: 50, salad: 40, label: 'Bowl / Tigela', icon: '🥣' }
};

export const DISH_TEMPLATES = [
  {
    id: 'pf_carne',
    name: 'PF Bife Acebolado',
    description: 'O clássico brasileiro: Arroz, feijão, bife acebolado e salada.',
    emoji: '🥩',
    components: [
      { role: 'base', foodId: '1', unit: 'Gramas (g)' }, // Arroz Branco
      { role: 'legume', foodId: '10', unit: 'Gramas (g)' }, // Feijão Carioca
      { role: 'protein', foodId: '16', unit: 'Gramas (g)' }, // Bife
      { role: 'salad', foodId: '21', unit: 'Gramas (g)' }, // Alface
      { role: 'salad', foodId: '22', unit: 'Gramas (g)' }  // Tomate
    ]
  },
  {
    id: 'pf_frango',
    name: 'PF Frango Grelhado',
    description: 'Opção leve: Arroz, feijão, frango grelhado e salada mista.',
    emoji: '🍗',
    components: [
      { role: 'base', foodId: '1', unit: 'Gramas (g)' },
      { role: 'legume', foodId: '10', unit: 'Gramas (g)' },
      { role: 'protein', foodId: '14', unit: 'Gramas (g)' },
      { role: 'salad', foodId: '25', unit: 'Gramas (g)' } // Salada Mista
    ]
  },
  {
    id: 'pf_peixe',
    name: 'PF Peixe Leve',
    description: 'Arroz integral, peixe grelhado e brócolis.',
    emoji: '🐟',
    components: [
      { role: 'base', foodId: '2', unit: 'Gramas (g)' }, // Arroz Integral
      { role: 'legume', foodId: '10', unit: 'Gramas (g)' },
      { role: 'protein', foodId: '345', unit: 'Gramas (g)' }, // Tilápia
      { role: 'garnish', foodId: '24', unit: 'Gramas (g)' } // Brócolis
    ]
  },
  {
    id: 'pf_calabresa',
    name: 'PF Calabresa',
    description: 'Sabor intenso: Arroz, feijão preto, calabresa e farofa.',
    emoji: '🌭',
    components: [
      { role: 'base', foodId: '1', unit: 'Gramas (g)' },
      { role: 'legume', foodId: '11', unit: 'Gramas (g)' }, // Feijão Preto
      { role: 'protein', foodId: '512', unit: 'Gramas (g)' }, // Calabresa
      { role: 'garnish', foodId: '674', unit: 'Gramas (g)' } // Farofa
    ]
  },
  {
    id: 'pf_vegano',
    name: 'PF Vegano',
    description: 'Nutritivo: Arroz 7 grãos, grão de bico, cogumelos e rúcula.',
    emoji: '🌱',
    components: [
      { role: 'base', foodId: '302', unit: 'Gramas (g)' }, // Arroz 7 grãos
      { role: 'legume', foodId: '13', unit: 'Gramas (g)' }, // Grão de Bico
      { role: 'protein', foodId: '375', unit: 'Gramas (g)' }, // Shimeji
      { role: 'salad', foodId: '354', unit: 'Gramas (g)' } // Rúcula
    ]
  },
  {
    id: 'pf_strogonoff',
    name: 'Strogonoff de Frango',
    description: 'O queridinho: Arroz, strogonoff e batata frita.',
    emoji: '🍲',
    components: [
      { role: 'base', foodId: '1', unit: 'Gramas (g)' },
      { role: 'protein', foodId: '698', unit: 'Gramas (g)' }, // Strogonoff Frango
      { role: 'garnish', foodId: '444', unit: 'Gramas (g)' } // Batata Frita
    ]
  },
  {
    id: 'pf_feijoada',
    name: 'Feijoada Completa',
    description: 'Tradicional: Arroz, feijoada, couve, farofa e laranja.',
    emoji: '🥘',
    components: [
      { role: 'base', foodId: '1', unit: 'Gramas (g)' },
      { role: 'protein', foodId: '524', unit: 'Gramas (g)' }, // Feijoada
      { role: 'garnish', foodId: '357', unit: 'Gramas (g)' }, // Couve
      { role: 'garnish', foodId: '674', unit: 'Gramas (g)' }, // Farofa
      { role: 'salad', foodId: '28', unit: 'Gramas (g)' } // Laranja
    ]
  },
  {
    id: 'pf_macarrao',
    name: 'Macarrão à Bolonhesa',
    description: 'Prático: Espaguete com molho de carne e queijo ralado.',
    emoji: '🍝',
    components: [
      { role: 'base', foodId: '3', unit: 'Gramas (g)' }, // Macarrão
      { role: 'protein', foodId: '808', unit: 'Gramas (g)' }, // Molho Bolonhesa
      { role: 'garnish', foodId: '401', unit: 'Gramas (g)' } // Parmesão
    ]
  },
  {
    id: 'pf_ovos',
    name: 'PF Bife a Cavalo (Ovos)',
    description: 'Simples e proteico: Arroz, feijão, ovos fritos e salada.',
    emoji: '🍳',
    components: [
      { role: 'base', foodId: '1', unit: 'Gramas (g)' },
      { role: 'legume', foodId: '10', unit: 'Gramas (g)' },
      { role: 'protein', foodId: '18', unit: 'Unidade', quantityOverride: 2 }, // 2 Ovos Fritos
      { role: 'salad', foodId: '25', unit: 'Gramas (g)' }
    ]
  }
];