const RAW_FOOD_DATABASE = [
  // --- Carboidratos ---
  { id: '1', name: 'Arroz Branco', emoji: '🍚', category: 'Carboidratos', calories: 130, protein: 2, carbs: 28, fat: 0, fiber: 0, measures: { 'Colher de Sopa': 25, 'Escumadeira': 90, 'Xícara': 150, 'Prato Raso': 300 } },
  { id: '2', name: 'Arroz Integral', emoji: '🌾', category: 'Carboidratos', calories: 110, protein: 2.6, carbs: 23, fat: 0.9, fiber: 2.8, measures: { 'Colher de Sopa': 25, 'Escumadeira': 90, 'Xícara': 150 } },
  { id: '301', name: 'Arroz Negro', emoji: '🍙', category: 'Carboidratos', calories: 330, protein: 10, carbs: 70, fat: 2, fiber: 4, measures: { 'Colher de Sopa': 25, 'Xícara': 150 } },
  { id: '302', name: 'Arroz 7 Grãos', emoji: '🌾', category: 'Carboidratos', calories: 120, protein: 4, carbs: 25, fat: 1, fiber: 3, measures: { 'Colher de Sopa': 25, 'Xícara': 150 } },
  { id: '3', name: 'Macarrão Cozido', emoji: '🍝', category: 'Carboidratos', calories: 157, protein: 5.8, carbs: 30, fat: 0.9, fiber: 1.8, measures: { 'Pegador': 100, 'Escumadeira': 80, 'Prato Raso': 250 } },
  { id: '303', name: 'Macarrão Integral', emoji: '🍝', category: 'Carboidratos', calories: 124, protein: 5, carbs: 26, fat: 0.5, fiber: 3, measures: { 'Pegador': 100, 'Prato Raso': 250 } },
  { id: '304', name: 'Macarrão de Arroz', emoji: '🍜', category: 'Carboidratos', calories: 109, protein: 1, carbs: 25, fat: 0.2, fiber: 1, measures: { 'Pegador': 100, 'Prato Raso': 250 } },
  { id: '4', name: 'Pão Francês', emoji: '🥖', category: 'Carboidratos', calories: 300, protein: 8, carbs: 58, fat: 3, fiber: 2.3, measures: { 'Unidade': 50, 'Meia Unidade': 25 } },
  { id: '5', name: 'Pão de Forma', emoji: '🍞', category: 'Carboidratos', calories: 250, protein: 8, carbs: 46, fat: 3, fiber: 2, measures: { 'Fatia': 25, 'Duas Fatias': 50 } },
  { id: '305', name: 'Pão Integral', emoji: '🍞', category: 'Carboidratos', calories: 240, protein: 9, carbs: 40, fat: 3, fiber: 6, measures: { 'Fatia': 25, 'Duas Fatias': 50 } },
  { id: '306', name: 'Pão de Centeio', emoji: '🥪', category: 'Carboidratos', calories: 260, protein: 9, carbs: 48, fat: 3, fiber: 6, measures: { 'Fatia': 30 } },
  { id: '307', name: 'Pão Sírio', emoji: '🥙', category: 'Carboidratos', calories: 270, protein: 9, carbs: 55, fat: 1, fiber: 2, measures: { 'Unidade Média': 50 } },
  { id: '308', name: 'Torrada', emoji: '🍞', category: 'Carboidratos', calories: 300, protein: 10, carbs: 60, fat: 5, fiber: 3, measures: { 'Unidade': 10 } },
  { id: '6', name: 'Aveia em Flocos', emoji: '🥣', category: 'Carboidratos', calories: 389, protein: 16, carbs: 66, fat: 6, fiber: 10, measures: { 'Colher de Sopa': 15, 'Xícara': 80 } },
  { id: '309', name: 'Farelo de Aveia', emoji: '🥣', category: 'Carboidratos', calories: 246, protein: 17, carbs: 66, fat: 7, fiber: 15, measures: { 'Colher de Sopa': 15 } },
  { id: '310', name: 'Granola', emoji: '🥣', category: 'Carboidratos', calories: 471, protein: 10, carbs: 64, fat: 20, fiber: 6, measures: { 'Colher de Sopa': 15, 'Xícara': 80 } },
  { id: '311', name: 'Farinha de Trigo', emoji: '🌾', category: 'Carboidratos', calories: 360, protein: 10, carbs: 75, fat: 1, fiber: 2, measures: { 'Colher de Sopa': 20, 'Xícara': 120 } },
  { id: '312', name: 'Farinha de Mandioca', emoji: '🍠', category: 'Carboidratos', calories: 340, protein: 1, carbs: 80, fat: 0, fiber: 6, measures: { 'Colher de Sopa': 20, 'Xícara': 150 } },
  { id: '313', name: 'Fubá de Milho', emoji: '🌽', category: 'Carboidratos', calories: 370, protein: 7, carbs: 79, fat: 1, fiber: 3, measures: { 'Colher de Sopa': 20, 'Xícara': 130 } },
  { id: '7', name: 'Batata Doce Cozida', emoji: '🍠', category: 'Carboidratos', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, measures: { 'Rodela Média': 30, 'Unidade Média': 150 } },
  { id: '314', name: 'Batata Inglesa Cozida', emoji: '🥔', category: 'Carboidratos', calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2, measures: { 'Unidade Média': 150, 'Colher de Sopa (Picada)': 30 } },
  { id: '315', name: 'Batata Baroa (Mandioquinha)', emoji: '🥔', category: 'Carboidratos', calories: 80, protein: 1, carbs: 19, fat: 0, fiber: 2, measures: { 'Unidade Média': 100, 'Rodela': 20 } },
  { id: '316', name: 'Mandioca Cozida', emoji: '🍠', category: 'Carboidratos', calories: 160, protein: 1, carbs: 38, fat: 0.3, fiber: 2, measures: { 'Pedaço Médio': 100, 'Colher de Sopa': 30 } },
  { id: '317', name: 'Inhame Cozido', emoji: '🍠', category: 'Carboidratos', calories: 118, protein: 1.5, carbs: 28, fat: 0.2, fiber: 4, measures: { 'Unidade Média': 150 } },
  { id: '318', name: 'Cará Cozido', emoji: '🍠', category: 'Carboidratos', calories: 119, protein: 1.5, carbs: 28, fat: 0.2, fiber: 4, measures: { 'Unidade Média': 150 } },
  { id: '8', name: 'Cuscuz de Milho', emoji: '🌽', category: 'Carboidratos', calories: 112, protein: 3.8, carbs: 23, fat: 0.7, fiber: 2, measures: { 'Fatia': 100, 'Xícara': 130 } },
  { id: '9', name: 'Tapioca (Goma)', emoji: '🌮', category: 'Carboidratos', calories: 240, protein: 0, carbs: 60, fat: 0, fiber: 0, measures: { 'Colher de Sopa': 20, 'Unidade Média': 80 } },
  { id: '319', name: 'Polenta Cozida', emoji: '🌽', category: 'Carboidratos', calories: 70, protein: 2, carbs: 15, fat: 0, fiber: 1, measures: { 'Colher de Sopa': 30, 'Fatia': 100 } },
  { id: '320', name: 'Pipoca (Sem Óleo)', emoji: '🍿', category: 'Carboidratos', calories: 380, protein: 12, carbs: 74, fat: 4, fiber: 14, measures: { 'Xícara': 10, 'Saco Médio': 50 } },
  { id: '321', name: 'Quinoa Cozida', emoji: '🥣', category: 'Carboidratos', calories: 120, protein: 4, carbs: 21, fat: 2, fiber: 3, measures: { 'Colher de Sopa': 25, 'Xícara': 150 } },
  { id: '322', name: 'Purê de Batata', emoji: '🥔', category: 'Carboidratos', calories: 113, protein: 2, carbs: 17, fat: 4, fiber: 2, measures: { 'Colher de Sopa': 30 } },
  { id: '449', name: 'Farinha de Amêndoas', emoji: '🥜', category: 'Carboidratos', calories: 580, protein: 21, carbs: 20, fat: 50, fiber: 12, measures: { 'Colher de Sopa': 15, 'Xícara': 100 } },
  { id: '450', name: 'Farinha de Coco', emoji: '🥥', category: 'Carboidratos', calories: 400, protein: 20, carbs: 60, fat: 10, fiber: 35, measures: { 'Colher de Sopa': 15, 'Xícara': 100 } },
  { id: '451', name: 'Xilitol', emoji: '🧂', category: 'Carboidratos', calories: 240, protein: 0, carbs: 100, fat: 0, fiber: 0, measures: { 'Colher de Chá': 5, 'Colher de Sopa': 15 } },
  { id: '452', name: 'Eritritol', emoji: '🧂', category: 'Carboidratos', calories: 20, protein: 0, carbs: 100, fat: 0, fiber: 0, measures: { 'Colher de Chá': 5, 'Colher de Sopa': 15 } },

  // --- Leguminosas ---
  { id: '10', name: 'Feijão Carioca', emoji: '🫘', category: 'Leguminosas', calories: 76, protein: 5, carbs: 14, fat: 0.5, fiber: 8, measures: { 'Concha Pequena': 90, 'Concha Média': 150, 'Colher de Sopa': 20 } },
  { id: '11', name: 'Feijão Preto', emoji: '🥘', category: 'Leguminosas', calories: 77, protein: 4.5, carbs: 14, fat: 0.5, fiber: 8.4, measures: { 'Concha Pequena': 90, 'Concha Média': 150 } },
  { id: '323', name: 'Feijão Branco', emoji: '🥘', category: 'Leguminosas', calories: 140, protein: 9, carbs: 25, fat: 0.6, fiber: 11, measures: { 'Concha Pequena': 90, 'Concha Média': 150 } },
  { id: '324', name: 'Feijão Fradinho', emoji: '🥘', category: 'Leguminosas', calories: 116, protein: 8, carbs: 21, fat: 0.5, fiber: 7, measures: { 'Concha Pequena': 90, 'Colher de Sopa': 25 } },
  { id: '325', name: 'Feijão Vermelho', emoji: '🥘', category: 'Leguminosas', calories: 127, protein: 9, carbs: 23, fat: 0.5, fiber: 6, measures: { 'Concha Pequena': 90 } },
  { id: '12', name: 'Lentilha Cozida', emoji: '🍲', category: 'Leguminosas', calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9, measures: { 'Concha Pequena': 100, 'Colher de Sopa': 25 } },
  { id: '13', name: 'Grão de Bico', emoji: '🥙', category: 'Leguminosas', calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6, measures: { 'Colher de Sopa': 25, 'Concha Pequena': 100 } },
  { id: '453', name: 'Edamame', emoji: '🫛', category: 'Leguminosas', calories: 122, protein: 11, carbs: 10, fat: 5, fiber: 5, measures: { 'Xícara': 150, 'Colher de Sopa': 30 } },
  { id: '326', name: 'Ervilha Cozida', emoji: '🟢', category: 'Leguminosas', calories: 80, protein: 5, carbs: 14, fat: 0.4, fiber: 5, measures: { 'Colher de Sopa': 25 } },
  { id: '327', name: 'Soja Cozida', emoji: '🌱', category: 'Leguminosas', calories: 173, protein: 17, carbs: 10, fat: 9, fiber: 6, measures: { 'Colher de Sopa': 25 } },

  // --- Proteínas ---
  { id: '14', name: 'Frango Grelhado', emoji: '🍗', category: 'Proteínas', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, measures: { 'Filé Pequeno': 80, 'Filé Médio': 120, 'Filé Grande': 180, 'Colher de Sopa (Picado)': 25 } },
  { id: '328', name: 'Peito de Frango Cozido', emoji: '🍗', category: 'Proteínas', calories: 150, protein: 31, carbs: 0, fat: 3, fiber: 0, measures: { 'Filé Médio': 120, 'Colher de Sopa (Desfiado)': 25 } },
  { id: '329', name: 'Sobrecoxa de Frango (s/ pele)', emoji: '🍗', category: 'Proteínas', calories: 209, protein: 26, carbs: 0, fat: 11, fiber: 0, measures: { 'Unidade': 120 } },
  { id: '330', name: 'Coxa de Frango (s/ pele)', emoji: '🍗', category: 'Proteínas', calories: 170, protein: 25, carbs: 0, fat: 8, fiber: 0, measures: { 'Unidade': 80 } },
  { id: '331', name: 'Coração de Frango', emoji: '🍢', category: 'Proteínas', calories: 185, protein: 26, carbs: 0, fat: 8, fiber: 0, measures: { 'Unidade': 10, 'Colher de Sopa': 30 } },
  { id: '15', name: 'Carne Moída (Refogada)', emoji: '🥩', category: 'Proteínas', calories: 220, protein: 26, carbs: 0, fat: 12, fiber: 0, measures: { 'Colher de Sopa': 25, 'Escumadeira': 80 } },
  { id: '16', name: 'Bife Bovino Grelhado', emoji: '🥩', category: 'Proteínas', calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, measures: { 'Bife Pequeno': 80, 'Bife Médio': 120, 'Bife Grande': 180 } },
  { id: '332', name: 'Patinho Moído', emoji: '🥩', category: 'Proteínas', calories: 180, protein: 30, carbs: 0, fat: 6, fiber: 0, measures: { 'Colher de Sopa': 25 } },
  { id: '333', name: 'Alcatra Grelhada', emoji: '🥩', category: 'Proteínas', calories: 240, protein: 30, carbs: 0, fat: 12, fiber: 0, measures: { 'Bife Médio': 120 } },
  { id: '334', name: 'Contra-filé Grelhado', emoji: '🥩', category: 'Proteínas', calories: 270, protein: 28, carbs: 0, fat: 17, fiber: 0, measures: { 'Bife Médio': 120 } },
  { id: '335', name: 'Picanha (s/ gordura)', emoji: '🥩', category: 'Proteínas', calories: 210, protein: 30, carbs: 0, fat: 9, fiber: 0, measures: { 'Fatia': 100 } },
  { id: '336', name: 'Costela Bovina', emoji: '🍖', category: 'Proteínas', calories: 350, protein: 20, carbs: 0, fat: 30, fiber: 0, measures: { 'Pedaço': 150 } },
  { id: '337', name: 'Fígado Bovino', emoji: '🥩', category: 'Proteínas', calories: 175, protein: 26, carbs: 5, fat: 5, fiber: 0, measures: { 'Bife Pequeno': 80 } },
  { id: '338', name: 'Lombo Suíno', emoji: '🥓', category: 'Proteínas', calories: 210, protein: 28, carbs: 0, fat: 10, fiber: 0, measures: { 'Fatia': 100 } },
  { id: '339', name: 'Bisteca Suína', emoji: '🥓', category: 'Proteínas', calories: 260, protein: 25, carbs: 0, fat: 17, fiber: 0, measures: { 'Unidade': 120 } },
  { id: '340', name: 'Bacon Frito', emoji: '🥓', category: 'Proteínas', calories: 540, protein: 37, carbs: 1, fat: 42, fiber: 0, measures: { 'Fatia': 15, 'Cubo': 5 } },
  { id: '341', name: 'Linguiça Toscana', emoji: '🌭', category: 'Proteínas', calories: 300, protein: 14, carbs: 1, fat: 26, fiber: 0, measures: { 'Unidade': 80 } },
  { id: '17', name: 'Ovo Cozido', emoji: '🥚', category: 'Proteínas', calories: 155, protein: 13, carbs: 1, fat: 11, fiber: 0, measures: { 'Unidade': 50, 'Unidade Grande': 60, 'Unidade Pequena': 45 } },
  { id: '18', name: 'Ovo Frito', emoji: '🍳', category: 'Proteínas', calories: 240, protein: 15, carbs: 1, fat: 18, fiber: 0, measures: { 'Unidade': 50 } },
  { id: '342', name: 'Ovo Mexido', emoji: '🍳', category: 'Proteínas', calories: 160, protein: 13, carbs: 1, fat: 12, fiber: 0, measures: { 'Colher de Sopa': 30, 'Unidade (Ovo)': 50 } },
  { id: '343', name: 'Ovo de Codorna', emoji: '🥚', category: 'Proteínas', calories: 158, protein: 13, carbs: 0, fat: 11, fiber: 0, measures: { 'Unidade': 10 } },
  { id: '344', name: 'Clara de Ovo', emoji: '🥚', category: 'Proteínas', calories: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0, measures: { 'Unidade': 35 } },
  { id: '19', name: 'Peixe Grelhado', emoji: '🐟', category: 'Proteínas', calories: 120, protein: 20, carbs: 0, fat: 4, fiber: 0, measures: { 'Filé Médio': 120, 'Posta': 150 } },
  { id: '345', name: 'Tilápia Grelhada', emoji: '🐟', category: 'Proteínas', calories: 128, protein: 26, carbs: 0, fat: 3, fiber: 0, measures: { 'Filé': 120 } },
  { id: '454', name: 'Bacalhau Refogado', emoji: '🐟', category: 'Proteínas', calories: 140, protein: 25, carbs: 0, fat: 4, fiber: 0, measures: { 'Colher de Sopa': 30 } },
  { id: '346', name: 'Salmão Grelhado', emoji: '🍣', category: 'Proteínas', calories: 206, protein: 22, carbs: 0, fat: 12, fiber: 0, measures: { 'Filé': 150 } },
  { id: '347', name: 'Atum (Lata/Água)', emoji: '🐟', category: 'Proteínas', calories: 116, protein: 26, carbs: 0, fat: 1, fiber: 0, measures: { 'Lata': 120, 'Colher de Sopa': 20 } },
  { id: '348', name: 'Sardinha (Lata/Óleo)', emoji: '🐟', category: 'Proteínas', calories: 208, protein: 25, carbs: 0, fat: 11, fiber: 0, measures: { 'Lata': 125, 'Unidade': 30 } },
  { id: '349', name: 'Bacalhau Cozido', emoji: '🐟', category: 'Proteínas', calories: 100, protein: 23, carbs: 0, fat: 1, fiber: 0, measures: { 'Posta': 150, 'Colher de Sopa': 25 } },
  { id: '350', name: 'Camarão Cozido', emoji: '🦐', category: 'Proteínas', calories: 99, protein: 24, carbs: 0, fat: 0.3, fiber: 0, measures: { 'Unidade Média': 15, 'Porção': 100 } },
  { id: '20', name: 'Presunto Cozido', emoji: '🥓', category: 'Proteínas', calories: 145, protein: 16, carbs: 1, fat: 8, fiber: 0, measures: { 'Fatia': 20, 'Fatia Grossa': 40 } },
  { id: '351', name: 'Peito de Peru', emoji: '🥓', category: 'Proteínas', calories: 100, protein: 20, carbs: 1, fat: 2, fiber: 0, measures: { 'Fatia': 20 } },
  { id: '352', name: 'Whey Protein', emoji: '💪', category: 'Proteínas', calories: 380, protein: 80, carbs: 5, fat: 4, fiber: 0, measures: { 'Scoop': 30 } },
  { id: '455', name: 'Proteína de Soja', emoji: '🌱', category: 'Proteínas', calories: 360, protein: 50, carbs: 30, fat: 1, fiber: 4, measures: { 'Xícara': 80, 'Colher de Sopa': 15 } },
  { id: '456', name: 'Carne Seca', emoji: '🥩', category: 'Proteínas', calories: 300, protein: 35, carbs: 0, fat: 15, fiber: 0, measures: { 'Colher de Sopa': 25 } },
  { id: '353', name: 'Tofu', emoji: '🧊', category: 'Proteínas', calories: 76, protein: 8, carbs: 2, fat: 4, fiber: 0.3, measures: { 'Fatia': 50, 'Cubo': 20 } },

  // --- Vegetais ---
  { id: '21', name: 'Alface', emoji: '🥬', category: 'Vegetais', calories: 15, protein: 1, carbs: 3, fat: 0, fiber: 1, measures: { 'Folha': 10, 'Prato Raso': 80 } },
  { id: '354', name: 'Rúcula', emoji: '🥬', category: 'Vegetais', calories: 25, protein: 2.6, carbs: 3.7, fat: 0.7, fiber: 1.6, measures: { 'Folha': 5, 'Prato Raso': 60 } },
  { id: '355', name: 'Agrião', emoji: '🌿', category: 'Vegetais', calories: 11, protein: 2.3, carbs: 1.3, fat: 0.1, fiber: 0.5, measures: { 'Ramo': 10, 'Prato Raso': 60 } },
  { id: '356', name: 'Espinafre Cozido', emoji: '🌿', category: 'Vegetais', calories: 23, protein: 3, carbs: 3.6, fat: 0.4, fiber: 2.2, measures: { 'Colher de Sopa': 25 } },
  { id: '357', name: 'Couve Refogada', emoji: '🥬', category: 'Vegetais', calories: 90, protein: 3, carbs: 8, fat: 5, fiber: 3, measures: { 'Colher de Sopa': 25 } },
  { id: '358', name: 'Repolho Cru', emoji: '🥬', category: 'Vegetais', calories: 25, protein: 1.3, carbs: 6, fat: 0.1, fiber: 2.5, measures: { 'Colher de Sopa (Picado)': 20, 'Folha': 30 } },
  { id: '359', name: 'Repolho Roxo', emoji: '🥬', category: 'Vegetais', calories: 31, protein: 1.4, carbs: 7, fat: 0.2, fiber: 2, measures: { 'Colher de Sopa': 20 } },
  { id: '22', name: 'Tomate', emoji: '🍅', category: 'Vegetais', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, measures: { 'Fatia': 20, 'Unidade Média': 100 } },
  { id: '360', name: 'Tomate Cereja', emoji: '🍅', category: 'Vegetais', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, measures: { 'Unidade': 10 } },
  { id: '23', name: 'Cenoura (Crua/Cozida)', emoji: '🥕', category: 'Vegetais', calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8, measures: { 'Colher de Sopa (Ralada)': 20, 'Rodela': 10, 'Unidade Média': 100 } },
  { id: '361', name: 'Beterraba Cozida', emoji: '🍠', category: 'Vegetais', calories: 43, protein: 1.6, carbs: 10, fat: 0.2, fiber: 2.8, measures: { 'Rodela': 15, 'Colher de Sopa': 25 } },
  { id: '24', name: 'Brócolis Cozido', emoji: '🥦', category: 'Vegetais', calories: 35, protein: 2.8, carbs: 7, fat: 0.4, fiber: 3.3, measures: { 'Buquê/Ramo': 20, 'Xícara': 80 } },
  { id: '362', name: 'Couve-Flor Cozida', emoji: '🥦', category: 'Vegetais', calories: 25, protein: 2, carbs: 5, fat: 0.3, fiber: 2, measures: { 'Ramo': 25, 'Colher de Sopa': 30 } },
  { id: '363', name: 'Abobrinha Cozida', emoji: '🥒', category: 'Vegetais', calories: 17, protein: 1.2, carbs: 3, fat: 0.3, fiber: 1, measures: { 'Rodela': 15, 'Colher de Sopa': 30 } },
  { id: '364', name: 'Berinjela Cozida', emoji: '🍆', category: 'Vegetais', calories: 25, protein: 1, carbs: 6, fat: 0.2, fiber: 3, measures: { 'Fatia': 20, 'Colher de Sopa': 30 } },
  { id: '365', name: 'Chuchu Cozido', emoji: '🍐', category: 'Vegetais', calories: 19, protein: 0.8, carbs: 4.5, fat: 0.1, fiber: 1.7, measures: { 'Pedaço': 30, 'Colher de Sopa': 30 } },
  { id: '366', name: 'Pepino', emoji: '🥒', category: 'Vegetais', calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, measures: { 'Rodela': 10, 'Unidade Média': 150 } },
  { id: '367', name: 'Pimentão', emoji: '🫑', category: 'Vegetais', calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2, fiber: 1.7, measures: { 'Rodela': 10, 'Colher de Sopa': 20 } },
  { id: '368', name: 'Cebola', emoji: '🧅', category: 'Vegetais', calories: 40, protein: 1.1, carbs: 9, fat: 0.1, fiber: 1.7, measures: { 'Rodela': 10, 'Colher de Sopa': 20 } },
  { id: '369', name: 'Alho', emoji: '🧄', category: 'Vegetais', calories: 149, protein: 6, carbs: 33, fat: 0.5, fiber: 2, measures: { 'Dente': 3 } },
  { id: '370', name: 'Abóbora Cabotiá', emoji: '🎃', category: 'Vegetais', calories: 40, protein: 1, carbs: 10, fat: 0.1, fiber: 2, measures: { 'Pedaço': 50, 'Colher de Sopa': 30 } },
  { id: '371', name: 'Vagem Cozida', emoji: '🥬', category: 'Vegetais', calories: 35, protein: 1.9, carbs: 7, fat: 0.3, fiber: 3, measures: { 'Colher de Sopa': 20 } },
  { id: '372', name: 'Quiabo Cozido', emoji: '🥬', category: 'Vegetais', calories: 33, protein: 1.9, carbs: 7, fat: 0.2, fiber: 3, measures: { 'Colher de Sopa': 25 } },
  { id: '373', name: 'Palmito', emoji: '🎋', category: 'Vegetais', calories: 28, protein: 2.5, carbs: 4, fat: 0.6, fiber: 2.4, measures: { 'Unidade': 30 } },
  { id: '374', name: 'Cogumelo Paris', emoji: '🍄', category: 'Vegetais', calories: 22, protein: 3, carbs: 3, fat: 0.3, fiber: 1, measures: { 'Colher de Sopa': 20 } },
  { id: '375', name: 'Shimeji Refogado', emoji: '🍄', category: 'Vegetais', calories: 60, protein: 3, carbs: 8, fat: 2, fiber: 2, measures: { 'Colher de Sopa': 25 } },
  { id: '457', name: 'Aspargos', emoji: '🎋', category: 'Vegetais', calories: 20, protein: 2, carbs: 4, fat: 0, fiber: 2, measures: { 'Unidade': 15 } },
  { id: '458', name: 'Couve de Bruxelas', emoji: '🥬', category: 'Vegetais', calories: 43, protein: 3, carbs: 9, fat: 0, fiber: 4, measures: { 'Unidade': 20 } },
  { id: '459', name: 'Nabo', emoji: '🥔', category: 'Vegetais', calories: 28, protein: 1, carbs: 6, fat: 0, fiber: 2, measures: { 'Unidade Média': 100 } },
  { id: '460', name: 'Rabanete', emoji: '🔴', category: 'Vegetais', calories: 16, protein: 0.6, carbs: 3, fat: 0, fiber: 1.6, measures: { 'Unidade': 15 } },
  { id: '25', name: 'Salada Mista', emoji: '🥗', category: 'Vegetais', calories: 20, protein: 1, carbs: 4, fat: 0, fiber: 2, measures: { 'Porção Pequena': 40, 'Porção Média': 80, 'Prato Raso': 150, 'Pegador': 30 } },

  // --- Frutas ---
  { id: '26', name: 'Banana Prata', emoji: '🍌', category: 'Frutas', calories: 89, protein: 1, carbs: 23, fat: 0, fiber: 2.6, measures: { 'Unidade Pequena': 60, 'Unidade Média': 90, 'Unidade Grande': 120 } },
  { id: '376', name: 'Banana Nanica', emoji: '🍌', category: 'Frutas', calories: 92, protein: 1.4, carbs: 24, fat: 0.1, fiber: 2, measures: { 'Unidade Média': 100 } },
  { id: '377', name: 'Banana da Terra', emoji: '🍌', category: 'Frutas', calories: 122, protein: 1.3, carbs: 32, fat: 0.3, fiber: 2.3, measures: { 'Unidade Média': 120 } },
  { id: '27', name: 'Maçã', emoji: '🍎', category: 'Frutas', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, measures: { 'Unidade Pequena': 100, 'Unidade Média': 150 } },
  { id: '28', name: 'Laranja', emoji: '🍊', category: 'Frutas', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, measures: { 'Unidade Média': 130 } },
  { id: '29', name: 'Mamão Papaia', emoji: '🥭', category: 'Frutas', calories: 43, protein: 0.5, carbs: 11, fat: 0.1, fiber: 1.7, measures: { 'Fatia': 100, 'Metade': 250 } },
  { id: '378', name: 'Mamão Formosa', emoji: '🥭', category: 'Frutas', calories: 40, protein: 0.5, carbs: 10, fat: 0.1, fiber: 1.8, measures: { 'Fatia': 150, 'Cubo': 20 } },
  { id: '30', name: 'Melancia', emoji: '🍉', category: 'Frutas', calories: 30, protein: 0.6, carbs: 8, fat: 0.2, fiber: 0.4, measures: { 'Fatia Fina': 100, 'Fatia Média': 200, 'Fatia Grande': 350 } },
  { id: '379', name: 'Melão', emoji: '🍈', category: 'Frutas', calories: 34, protein: 0.8, carbs: 8, fat: 0.2, fiber: 0.9, measures: { 'Fatia': 150, 'Cubo': 20 } },
  { id: '31', name: 'Abacaxi', emoji: '🍍', category: 'Frutas', calories: 50, protein: 0.5, carbs: 13, fat: 0.1, fiber: 1.4, measures: { 'Fatia': 80, 'Rodela': 100 } },
  { id: '32', name: 'Uva', emoji: '🍇', category: 'Frutas', calories: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9, measures: { 'Unidade': 5, 'Cacho Pequeno': 100 } },
  { id: '33', name: 'Morango', emoji: '🍓', category: 'Frutas', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2, measures: { 'Unidade': 15, 'Xícara': 150 } },
  { id: '380', name: 'Manga', emoji: '🥭', category: 'Frutas', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, measures: { 'Unidade Média': 200, 'Fatia': 80 } },
  { id: '381', name: 'Pera', emoji: '🍐', category: 'Frutas', calories: 57, protein: 0.4, carbs: 15, fat: 0.1, fiber: 3, measures: { 'Unidade Média': 150 } },
  { id: '382', name: 'Pêssego', emoji: '🍑', category: 'Frutas', calories: 39, protein: 0.9, carbs: 10, fat: 0.3, fiber: 1.5, measures: { 'Unidade Média': 100 } },
  { id: '383', name: 'Ameixa', emoji: '🍑', category: 'Frutas', calories: 46, protein: 0.7, carbs: 11, fat: 0.3, fiber: 1.4, measures: { 'Unidade': 40 } },
  { id: '384', name: 'Kiwi', emoji: '🥝', category: 'Frutas', calories: 61, protein: 1.1, carbs: 15, fat: 0.5, fiber: 3, measures: { 'Unidade': 70 } },
  { id: '385', name: 'Limão', emoji: '🍋', category: 'Frutas', calories: 29, protein: 1.1, carbs: 9, fat: 0.3, fiber: 2.8, measures: { 'Unidade': 50 } },
  { id: '386', name: 'Maracujá (Polpa)', emoji: '🍈', category: 'Frutas', calories: 97, protein: 2.2, carbs: 23, fat: 0.7, fiber: 10, measures: { 'Unidade': 40, 'Colher de Sopa': 20 } },
  { id: '387', name: 'Abacate', emoji: '🥑', category: 'Frutas', calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, measures: { 'Colher de Sopa': 30, 'Meio Abacate': 150 } },
  { id: '388', name: 'Coco (Polpa)', emoji: '🥥', category: 'Frutas', calories: 354, protein: 3.3, carbs: 15, fat: 33, fiber: 9, measures: { 'Pedaço': 20, 'Colher de Sopa (Ralado)': 15 } },
  { id: '389', name: 'Goiaba', emoji: '🍈', category: 'Frutas', calories: 68, protein: 2.6, carbs: 14, fat: 1, fiber: 5.4, measures: { 'Unidade Média': 150 } },
  { id: '390', name: 'Caju', emoji: '🍎', category: 'Frutas', calories: 43, protein: 1, carbs: 10, fat: 0.3, fiber: 1.7, measures: { 'Unidade': 80 } },
  { id: '391', name: 'Açaí (Polpa Pura)', emoji: '🥣', category: 'Frutas', calories: 60, protein: 1, carbs: 6, fat: 4, fiber: 2, measures: { 'Colher de Sopa': 20, 'Copo': 200 } },
  { id: '392', name: 'Caqui', emoji: '🍅', category: 'Frutas', calories: 70, protein: 0.6, carbs: 19, fat: 0.2, fiber: 3.6, measures: { 'Unidade': 100 } },
  { id: '393', name: 'Figo', emoji: '🟣', category: 'Frutas', calories: 74, protein: 0.8, carbs: 19, fat: 0.3, fiber: 2.9, measures: { 'Unidade': 50 } },
  { id: '461', name: 'Amora', emoji: '🫐', category: 'Frutas', calories: 43, protein: 1.4, carbs: 10, fat: 0.5, fiber: 5, measures: { 'Xícara': 140, 'Unidade': 5 } },
  { id: '462', name: 'Framboesa', emoji: '🍇', category: 'Frutas', calories: 52, protein: 1.2, carbs: 12, fat: 0.6, fiber: 6.5, measures: { 'Xícara': 120 } },
  { id: '463', name: 'Mirtilo (Blueberry)', emoji: '🫐', category: 'Frutas', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4, measures: { 'Xícara': 140 } },
  { id: '464', name: 'Cereja', emoji: '🍒', category: 'Frutas', calories: 50, protein: 1, carbs: 12, fat: 0.3, fiber: 1.6, measures: { 'Unidade': 8 } },

  // --- Laticínios ---
  { id: '34', name: 'Leite Integral', emoji: '🥛', category: 'Laticínios', calories: 60, protein: 3, carbs: 5, fat: 3, fiber: 0, measures: { 'Copo Americano': 190, 'Copo Grande': 300, 'Xícara': 240 } },
  { id: '394', name: 'Leite Desnatado', emoji: '🥛', category: 'Laticínios', calories: 35, protein: 3.4, carbs: 5, fat: 0.1, fiber: 0, measures: { 'Copo Americano': 190, 'Xícara': 240 } },
  { id: '395', name: 'Leite Sem Lactose', emoji: '🥛', category: 'Laticínios', calories: 60, protein: 3, carbs: 5, fat: 3, fiber: 0, measures: { 'Copo Americano': 190 } },
  { id: '396', name: 'Leite de Amêndoas', emoji: '🥛', category: 'Laticínios', calories: 15, protein: 0.5, carbs: 0, fat: 1.2, fiber: 0, measures: { 'Copo Americano': 190 } },
  { id: '397', name: 'Leite de Soja', emoji: '🥛', category: 'Laticínios', calories: 54, protein: 3.3, carbs: 6, fat: 1.8, fiber: 0.6, measures: { 'Copo Americano': 190 } },
  { id: '35', name: 'Queijo Mussarela', emoji: '🧀', category: 'Laticínios', calories: 280, protein: 28, carbs: 3, fat: 17, fiber: 0, measures: { 'Fatia': 20, 'Fatia Grossa': 30 } },
  { id: '398', name: 'Queijo Prato', emoji: '🧀', category: 'Laticínios', calories: 360, protein: 23, carbs: 1, fat: 29, fiber: 0, measures: { 'Fatia': 20 } },
  { id: '399', name: 'Queijo Minas Frescal', emoji: '🧀', category: 'Laticínios', calories: 264, protein: 17, carbs: 3, fat: 20, fiber: 0, measures: { 'Fatia Média': 30, 'Fatia Grande': 50 } },
  { id: '400', name: 'Queijo Meia Cura', emoji: '🧀', category: 'Laticínios', calories: 320, protein: 22, carbs: 2, fat: 25, fiber: 0, measures: { 'Fatia': 30 } },
  { id: '401', name: 'Queijo Parmesão', emoji: '🧀', category: 'Laticínios', calories: 431, protein: 38, carbs: 4, fat: 29, fiber: 0, measures: { 'Colher de Sopa (Ralado)': 10 } },
  { id: '402', name: 'Queijo Gorgonzola', emoji: '🧀', category: 'Laticínios', calories: 350, protein: 21, carbs: 2, fat: 29, fiber: 0, measures: { 'Pedaço': 30 } },
  { id: '403', name: 'Queijo Cottage', emoji: '🧀', category: 'Laticínios', calories: 98, protein: 11, carbs: 3, fat: 4, fiber: 0, measures: { 'Colher de Sopa': 30 } },
  { id: '404', name: 'Ricota', emoji: '🧀', category: 'Laticínios', calories: 174, protein: 11, carbs: 3, fat: 13, fiber: 0, measures: { 'Fatia': 30, 'Colher de Sopa': 30 } },
  { id: '405', name: 'Requeijão Cremoso', emoji: '🥣', category: 'Laticínios', calories: 250, protein: 8, carbs: 2, fat: 24, fiber: 0, measures: { 'Colher de Sopa': 30 } },
  { id: '36', name: 'Iogurte Natural', emoji: '🥣', category: 'Laticínios', calories: 60, protein: 4, carbs: 5, fat: 3, fiber: 0, measures: { 'Pote': 170, 'Colher de Sopa': 20 } },
  { id: '406', name: 'Iogurte Grego', emoji: '🥣', category: 'Laticínios', calories: 100, protein: 5, carbs: 4, fat: 7, fiber: 0, measures: { 'Pote': 100, 'Colher de Sopa': 20 } },
  { id: '407', name: 'Iogurte de Frutas', emoji: '🥣', category: 'Laticínios', calories: 90, protein: 3, carbs: 15, fat: 2, fiber: 0, measures: { 'Pote': 170 } },
  { id: '37', name: 'Manteiga', emoji: '🧈', category: 'Laticínios', calories: 717, protein: 0.8, carbs: 0, fat: 81, fiber: 0, measures: { 'Ponta de Faca': 5, 'Colher de Chá': 10 } },
  { id: '408', name: 'Creme de Leite', emoji: '🥣', category: 'Laticínios', calories: 200, protein: 2, carbs: 4, fat: 20, fiber: 0, measures: { 'Colher de Sopa': 15, 'Caixinha': 200 } },
  { id: '465', name: 'Kefir', emoji: '🥛', category: 'Laticínios', calories: 60, protein: 3, carbs: 5, fat: 3, fiber: 0, measures: { 'Copo': 200 } },
  { id: '466', name: 'Coalhada', emoji: '🥣', category: 'Laticínios', calories: 90, protein: 3, carbs: 5, fat: 6, fiber: 0, measures: { 'Colher de Sopa': 20, 'Pote': 150 } },

  // --- Gorduras e Oleaginosas ---
  { id: '409', name: 'Azeite de Oliva', emoji: '🫒', category: 'Gorduras', calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, measures: { 'Colher de Sopa': 13, 'Colher de Chá': 5 } },
  { id: '410', name: 'Óleo de Coco', emoji: '🥥', category: 'Gorduras', calories: 862, protein: 0, carbs: 0, fat: 100, fiber: 0, measures: { 'Colher de Sopa': 13 } },
  { id: '411', name: 'Óleo de Soja', emoji: '🌻', category: 'Gorduras', calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, measures: { 'Colher de Sopa': 13 } },
  { id: '412', name: 'Castanha de Caju', emoji: '🥜', category: 'Gorduras', calories: 553, protein: 18, carbs: 30, fat: 44, fiber: 3, measures: { 'Unidade': 2, 'Punhado': 30 } },
  { id: '413', name: 'Castanha do Pará', emoji: '🥜', category: 'Gorduras', calories: 656, protein: 14, carbs: 12, fat: 66, fiber: 7, measures: { 'Unidade': 4 } },
  { id: '414', name: 'Nozes', emoji: '🥜', category: 'Gorduras', calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 7, measures: { 'Unidade': 5 } },
  { id: '415', name: 'Amêndoas', emoji: '🥜', category: 'Gorduras', calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12, measures: { 'Unidade': 1, 'Punhado': 30 } },
  { id: '416', name: 'Amendoim Torrado', emoji: '🥜', category: 'Gorduras', calories: 567, protein: 26, carbs: 16, fat: 49, fiber: 8, measures: { 'Colher de Sopa': 15, 'Punhado': 30 } },
  { id: '417', name: 'Pasta de Amendoim', emoji: '🥜', category: 'Gorduras', calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, measures: { 'Colher de Sopa': 20 } },
  { id: '418', name: 'Semente de Chia', emoji: '🌱', category: 'Gorduras', calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34, measures: { 'Colher de Sopa': 10 } },
  { id: '419', name: 'Linhaça', emoji: '🌱', category: 'Gorduras', calories: 534, protein: 18, carbs: 29, fat: 42, fiber: 27, measures: { 'Colher de Sopa': 10 } },
  { id: '467', name: 'Semente de Abóbora', emoji: '🌱', category: 'Gorduras', calories: 446, protein: 19, carbs: 54, fat: 19, fiber: 18, measures: { 'Colher de Sopa': 10 } },
  { id: '468', name: 'Semente de Girassol', emoji: '🌻', category: 'Gorduras', calories: 584, protein: 20, carbs: 20, fat: 51, fiber: 8, measures: { 'Colher de Sopa': 10 } },
  { id: '469', name: 'Gergelim', emoji: '🌱', category: 'Gorduras', calories: 573, protein: 17, carbs: 23, fat: 50, fiber: 12, measures: { 'Colher de Sopa': 10 } },

  // --- Bebidas (Chás, Sucos, Álcool) ---
  { id: '38', name: 'Café (Sem Açúcar)', emoji: '☕', category: 'Bebidas', calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0, measures: { 'Xícara de Café': 50, 'Xícara de Chá': 150 } },
  { id: '420', name: 'Café com Leite', emoji: '☕', category: 'Bebidas', calories: 40, protein: 2, carbs: 3, fat: 2, fiber: 0, measures: { 'Xícara': 150, 'Copo Americano': 190 } },
  { id: '39', name: 'Chá de Hibisco', emoji: '🌺', category: 'Bebidas', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, measures: { 'Xícara': 240, 'Copo': 300 } },
  { id: '40', name: 'Chá Verde', emoji: '🍵', category: 'Bebidas', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, measures: { 'Xícara': 240, 'Copo': 300 } },
  { id: '421', name: 'Chá Mate', emoji: '🧉', category: 'Bebidas', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, measures: { 'Copo': 300 } },
  { id: '422', name: 'Água de Coco', emoji: '🥥', category: 'Bebidas', calories: 19, protein: 0, carbs: 3.7, fat: 0, fiber: 0, measures: { 'Copo': 200, 'Caixinha': 330 } },
  { id: '41', name: 'Suco de Laranja', emoji: '🍊', category: 'Bebidas', calories: 45, protein: 0.7, carbs: 10, fat: 0.2, fiber: 0.2, measures: { 'Copo Americano': 190, 'Copo Grande': 300 } },
  { id: '423', name: 'Suco de Uva Integral', emoji: '🍇', category: 'Bebidas', calories: 60, protein: 0, carbs: 15, fat: 0, fiber: 0, measures: { 'Copo': 200 } },
  { id: '424', name: 'Limonada (s/ açúcar)', emoji: '🍋', category: 'Bebidas', calories: 6, protein: 0, carbs: 2, fat: 0, fiber: 0, measures: { 'Copo': 200 } },
  { id: '42', name: 'Refrigerante (Cola)', emoji: '🥤', category: 'Bebidas', calories: 42, protein: 0, carbs: 10.6, fat: 0, fiber: 0, measures: { 'Lata': 350, 'Copo': 200 } },
  { id: '425', name: 'Refrigerante Zero', emoji: '🥤', category: 'Bebidas', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, measures: { 'Lata': 350, 'Copo': 200 } },
  { id: '43', name: 'Cerveja', emoji: '🍺', category: 'Bebidas', calories: 43, protein: 0.5, carbs: 3.6, fat: 0, fiber: 0, measures: { 'Lata': 350, 'Long Neck': 330, 'Garrafa 600': 600, 'Copo': 200 } },
  { id: '44', name: 'Vinho Tinto', emoji: '🍷', category: 'Bebidas', calories: 85, protein: 0, carbs: 2.6, fat: 0, fiber: 0, measures: { 'Taça': 150, 'Taça Grande': 200 } },
  { id: '426', name: 'Vinho Branco', emoji: '🥂', category: 'Bebidas', calories: 82, protein: 0, carbs: 2.6, fat: 0, fiber: 0, measures: { 'Taça': 150 } },
  { id: '45', name: 'Vodka', emoji: '🍸', category: 'Bebidas', calories: 231, protein: 0, carbs: 0, fat: 0, fiber: 0, measures: { 'Dose': 50 } },
  { id: '46', name: 'Whisky', emoji: '🥃', category: 'Bebidas', calories: 250, protein: 0, carbs: 0, fat: 0, fiber: 0, measures: { 'Dose': 50 } },
  { id: '427', name: 'Gin', emoji: '🍸', category: 'Bebidas', calories: 263, protein: 0, carbs: 0, fat: 0, fiber: 0, measures: { 'Dose': 50 } },
  { id: '428', name: 'Caipirinha (Limão/Açúcar)', emoji: '🍹', category: 'Bebidas', calories: 260, protein: 0, carbs: 25, fat: 0, fiber: 0, measures: { 'Copo': 200 } },

  // --- Doces e Industrializados ---
  { id: '47', name: 'Chocolate ao Leite', emoji: '🍫', category: 'Doces', calories: 535, protein: 7, carbs: 59, fat: 30, fiber: 2, measures: { 'Quadrado': 5, 'Barra Pequena': 30 } },
  { id: '429', name: 'Chocolate Meio Amargo', emoji: '🍫', category: 'Doces', calories: 500, protein: 6, carbs: 50, fat: 35, fiber: 8, measures: { 'Quadrado': 5, 'Barra Pequena': 30 } },
  { id: '48', name: 'Bolo de Chocolate', emoji: '🍰', category: 'Doces', calories: 370, protein: 5, carbs: 50, fat: 18, fiber: 1, measures: { 'Fatia Fina': 60, 'Fatia Média': 100 } },
  { id: '430', name: 'Bolo de Cenoura', emoji: '🍰', category: 'Doces', calories: 350, protein: 4, carbs: 48, fat: 16, fiber: 1, measures: { 'Fatia': 80 } },
  { id: '431', name: 'Bolo de Fubá', emoji: '🍰', category: 'Doces', calories: 330, protein: 5, carbs: 45, fat: 14, fiber: 1, measures: { 'Fatia': 80 } },
  { id: '432', name: 'Brigadeiro', emoji: '🍬', category: 'Doces', calories: 380, protein: 6, carbs: 55, fat: 15, fiber: 0, measures: { 'Unidade': 20 } },
  { id: '433', name: 'Sorvete de Creme', emoji: '🍦', category: 'Doces', calories: 207, protein: 3.5, carbs: 24, fat: 11, fiber: 0, measures: { 'Bola': 60 } },
  { id: '434', name: 'Gelatina', emoji: '🍮', category: 'Doces', calories: 60, protein: 1.5, carbs: 14, fat: 0, fiber: 0, measures: { 'Taça': 120 } },
  { id: '435', name: 'Paçoca', emoji: '🥜', category: 'Doces', calories: 500, protein: 15, carbs: 50, fat: 30, fiber: 3, measures: { 'Unidade Rolha': 20 } },
  { id: '49', name: 'Torta Doce', emoji: '🥧', category: 'Doces', calories: 350, protein: 4, carbs: 45, fat: 16, fiber: 1, measures: { 'Fatia': 100 } },
  { id: '50', name: 'Coxinha de Frango', emoji: '🍗', category: 'Industrializados', calories: 300, protein: 10, carbs: 30, fat: 15, fiber: 1, measures: { 'Unidade Festa': 20, 'Unidade Média': 100, 'Unidade Grande': 150 } },
  { id: '436', name: 'Pastel de Carne', emoji: '🥟', category: 'Industrializados', calories: 350, protein: 10, carbs: 35, fat: 20, fiber: 1, measures: { 'Unidade Média': 100 } },
  { id: '437', name: 'Pastel de Queijo', emoji: '🥟', category: 'Industrializados', calories: 380, protein: 12, carbs: 35, fat: 22, fiber: 1, measures: { 'Unidade Média': 100 } },
  { id: '438', name: 'Empada de Frango', emoji: '🥧', category: 'Industrializados', calories: 320, protein: 8, carbs: 30, fat: 18, fiber: 1, measures: { 'Unidade Média': 80 } },
  { id: '439', name: 'Kibe Frito', emoji: '🧆', category: 'Industrializados', calories: 280, protein: 15, carbs: 20, fat: 15, fiber: 2, measures: { 'Unidade Média': 80 } },
  { id: '51', name: 'Pão de Queijo', emoji: '🧀', category: 'Industrializados', calories: 280, protein: 5, carbs: 25, fat: 18, fiber: 0, measures: { 'Unidade Pequena': 20, 'Unidade Média': 50 } },
  { id: '52', name: 'Biscoito Recheado', emoji: '🍪', category: 'Industrializados', calories: 470, protein: 6, carbs: 70, fat: 20, fiber: 1, measures: { 'Unidade': 10 } },
  { id: '440', name: 'Biscoito Água e Sal', emoji: '🍪', category: 'Industrializados', calories: 430, protein: 10, carbs: 70, fat: 12, fiber: 2, measures: { 'Unidade': 5 } },
  { id: '441', name: 'Biscoito Maizena', emoji: '🍪', category: 'Industrializados', calories: 440, protein: 8, carbs: 75, fat: 12, fiber: 2, measures: { 'Unidade': 5 } },
  { id: '53', name: 'Pizza (Mussarela)', emoji: '🍕', category: 'Industrializados', calories: 280, protein: 12, carbs: 30, fat: 12, fiber: 1.5, measures: { 'Fatia': 120 } },
  { id: '442', name: 'Hambúrguer (Pão/Carne/Queijo)', emoji: '🍔', category: 'Industrializados', calories: 500, protein: 25, carbs: 40, fat: 25, fiber: 2, measures: { 'Unidade': 200 } },
  { id: '443', name: 'Hot Dog Completo', emoji: '🌭', category: 'Industrializados', calories: 450, protein: 15, carbs: 40, fat: 25, fiber: 2, measures: { 'Unidade': 180 } },
  { id: '444', name: 'Batata Frita', emoji: '🍟', category: 'Industrializados', calories: 312, protein: 3, carbs: 41, fat: 15, fiber: 3, measures: { 'Porção Pequena': 80, 'Porção Média': 150 } },
  { id: '445', name: 'Sushi (Salmão)', emoji: '🍣', category: 'Industrializados', calories: 150, protein: 6, carbs: 25, fat: 2, fiber: 0, measures: { 'Unidade': 25 } },
  { id: '446', name: 'Lasanha Bolonhesa', emoji: '🍝', category: 'Industrializados', calories: 180, protein: 10, carbs: 15, fat: 9, fiber: 1, measures: { 'Pedaço': 200 } },
  { id: '447', name: 'Nuggets de Frango', emoji: '🍗', category: 'Industrializados', calories: 290, protein: 15, carbs: 15, fat: 18, fiber: 1, measures: { 'Unidade': 20 } },
  { id: '448', name: 'Salgadinho de Pacote', emoji: '🥨', category: 'Industrializados', calories: 500, protein: 5, carbs: 55, fat: 30, fiber: 2, measures: { 'Xícara': 30, 'Pacote Pequeno': 50 } },
  { id: '470', name: 'Macarrão Instantâneo', emoji: '🍜', category: 'Industrializados', calories: 450, protein: 9, carbs: 60, fat: 18, fiber: 2, measures: { 'Pacote': 85 } },
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

// --- Lógica de Dietas ---
export const DIET_TYPES = ['Low Carb', 'Cetogênica', 'Paleo', 'Vegana', 'Sem Glúten', 'Sem Lactose', 'Hipertrofia'];

const calculateDiets = (food) => {
  const diets = [];
  const { category, name, carbs, protein } = food;
  const n = name.toLowerCase();

  // Vegana
  const animalCategories = ['Proteínas', 'Laticínios', 'Industrializados', 'Doces'];
  const animalNames = ['carne', 'frango', 'peixe', 'ovo', 'queijo', 'leite', 'manteiga', 'presunto', 'bacon', 'linguiça', 'mel', 'whey', 'chocolate ao leite', 'pizza', 'hambúrguer', 'nuggets', 'sushi', 'lasanha', 'coxinha', 'pastel', 'empada', 'kibe', 'pão de queijo'];
  const isAnimal = (animalCategories.includes(category) || animalNames.some(an => n.includes(an))) && 
                   !n.includes('soja') && !n.includes('tofu') && !n.includes('amêndoas') && !n.includes('coco') && !n.includes('vegano');
  
  if (!isAnimal) diets.push('Vegana');

  // Sem Glúten
  const glutenFoods = ['trigo', 'centeio', 'cevada', 'pão', 'macarrão', 'bolo', 'biscoito', 'torrada', 'pizza', 'pastel', 'empada', 'kibe', 'aveia', 'granola', 'cerveja', 'lasanha', 'coxinha', 'nuggets'];
  const isGluten = glutenFoods.some(g => n.includes(g)) && !n.includes('sem glúten') && !n.includes('de arroz') && !n.includes('de milho') && !n.includes('de queijo') && !n.includes('de mandioca');
  if (!isGluten) diets.push('Sem Glúten');

  // Sem Lactose
  const lactoseFoods = ['leite', 'queijo', 'iogurte', 'creme de leite', 'manteiga', 'requeijão', 'chocolate ao leite', 'whey', 'pizza', 'lasanha', 'pão de queijo', 'coalhada', 'kefir'];
  const isLactose = lactoseFoods.some(l => n.includes(l)) && !n.includes('sem lactose') && !n.includes('de soja') && !n.includes('de amêndoas') && !n.includes('de coco') && !n.includes('zero lactose');
  if (!isLactose) diets.push('Sem Lactose');

  // Low Carb (< 10g carbs/100g ou categorias permitidas)
  const lowCarbForbidden = ['arroz', 'macarrão', 'pão', 'batata', 'mandioca', 'açúcar', 'doce', 'chocolate', 'bolo', 'biscoito', 'refrigerante', 'suco', 'fruta', 'feijão', 'lentilha', 'grão de bico', 'milho', 'aveia', 'trigo', 'tapioca', 'cuscuz', 'pipoca', 'cerveja'];
  const lowCarbAllowedFruits = ['morango', 'abacate', 'coco', 'limão', 'amora', 'framboesa', 'mirtilo', 'maracujá'];
  
  const isHighCarb = lowCarbForbidden.some(f => n.includes(f)) && !lowCarbAllowedFruits.some(f => n.includes(f));
  if (!isHighCarb && (carbs <= 12 || category === 'Proteínas' || category === 'Gorduras' || category === 'Vegetais')) {
     diets.push('Low Carb');
  }

  // Cetogênica (Strict Low Carb)
  if (diets.includes('Low Carb') && carbs <= 6 && !n.includes('leite') && !n.includes('iogurte')) {
      diets.push('Cetogênica');
  }

  // Paleo
  const paleoForbidden = ['arroz', 'feijão', 'soja', 'trigo', 'milho', 'leite', 'queijo', 'iogurte', 'açúcar', 'industrializados', 'pão', 'macarrão', 'óleo de soja', 'amendoim'];
  const isPaleoForbidden = paleoForbidden.some(f => n.includes(f) || category === 'Industrializados' || category === 'Doces');
  if (!isPaleoForbidden) diets.push('Paleo');

  // Hipertrofia (High Protein)
  if (protein >= 10 || category === 'Proteínas' || category === 'Leguminosas') {
      diets.push('Hipertrofia');
  }

  return diets;
};

// Exporta o banco de dados com as dietas calculadas
export const FOOD_DATABASE = RAW_FOOD_DATABASE.map(food => ({
  ...food,
  diets: calculateDiets(food)
}));

// Função auxiliar para inferir medidas baseadas no nome (usada ao criar novos alimentos)
export const inferFoodMeasures = (name) => {
  const n = name.toLowerCase();
  if (n.includes('arroz')) return { 'Colher de Sopa': 25, 'Escumadeira': 90, 'Xícara': 150, 'Prato Raso': 300 };
  if (n.includes('feijão') || n.includes('feijao')) return { 'Concha Pequena': 90, 'Concha Média': 150, 'Colher de Sopa': 20 };
  if (n.includes('frango') && (n.includes('grelhado') || n.includes('filé'))) return { 'Filé Pequeno': 80, 'Filé Médio': 120, 'Filé Grande': 180 };
  if (n.includes('frango') && (n.includes('desfiado') || n.includes('picado'))) return { 'Colher de Sopa': 25, 'Xícara': 120 };
  if (n.includes('ovo')) return { 'Unidade': 50, 'Unidade Grande': 60, 'Unidade Pequena': 45 };
  if (n.includes('banana')) return { 'Unidade Pequena': 60, 'Unidade Média': 90, 'Unidade Grande': 120 };
  if (n.includes('alface') || n.includes('salada') || n.includes('folha') || n.includes('rúcula') || n.includes('agrião')) return { 'Porção Pequena': 40, 'Porção Média': 80, 'Prato Raso': 150 };
  if (n.includes('melancia') || n.includes('mamão') || n.includes('abacaxi') || n.includes('bolo') || n.includes('torta') || n.includes('pizza')) return { 'Fatia Fina': 100, 'Fatia Média': 200, 'Fatia Grossa': 300 };
  if (n.includes('sopa') || n.includes('caldo') || n.includes('creme')) return { 'Concha Pequena': 100, 'Concha Média': 150, 'Concha Grande': 250, 'Prato Fundo': 300, 'Tigela': 350 };
  if (n.includes('pão') || n.includes('torrada')) return { 'Fatia': 25, 'Unidade': 50 };
  if (n.includes('queijo') || n.includes('presunto')) return { 'Fatia': 15, 'Fatia Grossa': 30 };
  if (n.includes('leite') || n.includes('suco') || n.includes('refrigerante') || n.includes('café') || n.includes('chá') || n.includes('água') || n.includes('agua')) return { 'Copo Americano': 190, 'Copo Grande': 300, 'Xícara': 240, '100ml': 100 };
  return null;
};

// Função inteligente para determinar peso baseado no tipo de alimento
export const getFoodUnitWeight = (foodInput, unit) => {
  if (!foodInput) return UNIT_WEIGHTS[unit] || 1;
  if (unit === 'Gramas (g)' || unit === 'Mililitros (ml)') return 1;
  
  // Suporta receber o objeto do alimento ou apenas o nome
  let food = (typeof foodInput === 'string') 
    ? FOOD_DATABASE.find(f => f.name === foodInput) 
    : foodInput;
    
  // 1. Verifica se o objeto do alimento já tem medidas específicas (Prioridade Máxima)
  if (food && food.measures && food.measures[unit]) {
    return food.measures[unit];
  }

  // 2. Se não tiver no objeto, tenta inferir pelo nome (Fallback Inteligente)
  const name = food ? food.name : (typeof foodInput === 'string' ? foodInput : '');
  const inferred = inferFoodMeasures(name);
  if (inferred && inferred[unit]) {
    return inferred[unit];
  }

  // 3. Fallback para a tabela global
  return UNIT_WEIGHTS[unit] || 1;
};

// Função para inferir nutrientes com base em palavras-chave no nome do alimento
export const inferNutrients = (name) => {
  const n = name.toLowerCase();
  
  const inferenceMap = {
    'frango': '14',   // Peito de Frango Grelhado
    'peito de peru': '351',
    'bife': '16',     // Bife Bovino Grelhado
    'carne': '15',    // Carne Moída (Refogada)
    'peixe': '345',   // Tilápia Grelhada
    'salmão': '346',  // Salmão Grelhado
    'atum': '347',    // Atum (Lata/Água)
    'sardinha': '348',// Sardinha (Lata/Óleo)
    'ovo': '17',      // Ovo Cozido
    'queijo': '35',   // Queijo Mussarela
    'leite': '34',    // Leite Integral
    'iogurte': '36',  // Iogurte Natural
    'arroz': '1',     // Arroz Branco
    'macarrão': '3',  // Macarrão Cozido
    'pão': '5',       // Pão de Forma
    'batata': '314',  // Batata Inglesa Cozida
    'mandioca': '316',// Mandioca Cozida
    'feijão': '10',   // Feijão Carioca
    'lentilha': '12', // Lentilha Cozida
    'grão de bico': '13',
    'alface': '21',
    'tomate': '22',
    'cenoura': '23',
    'brócolis': '24',
    'banana': '26',
    'maçã': '27',
    'laranja': '28',
    'mamão': '29',
    'abacate': '387',
    'azeite': '409',
    'castanha': '412', // Castanha de Caju
    'amendoim': '416',
    'bolo': '48', // Bolo de Chocolate
  };

  const foundKeyword = Object.keys(inferenceMap).find(keyword => n.includes(keyword));
  
  if (foundKeyword) {
    const foodId = inferenceMap[foundKeyword];
    const baseFood = RAW_FOOD_DATABASE.find(f => f.id === foodId);
    if (baseFood) {
      return {
        calories: baseFood.calories, protein: baseFood.protein, carbs: baseFood.carbs,
        fat: baseFood.fat, fiber: baseFood.fiber, emoji: baseFood.emoji, category: baseFood.category,
      };
    }
  }

  return null; // Retorna null se nenhuma correspondência for encontrada
};