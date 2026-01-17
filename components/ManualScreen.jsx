import React from 'react';
import { X, Download } from 'lucide-react';

const ManualScreen = ({ onClose, onReset, onInstallClick, showInstallButton }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
    <style>{`
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } 
      .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
      @keyframes scale-bounce {
        0% { transform: scale(0.95); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      .animate-scale-bounce { animation: scale-bounce 0.4s ease-out; }
    `}</style>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden animate-scale-bounce">
      <div className="p-4 border-b flex justify-between items-center bg-emerald-50">
        <h2 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
          📖 Manual de Uso
        </h2>
        <button onClick={onClose} className="p-1 hover:bg-emerald-100 rounded-full transition-colors text-emerald-600">
          <X size={20} />
        </button>
      </div>
      
      <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-600 leading-relaxed">
        <div className="space-y-3 bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-bold text-purple-800 text-base">Guia da Nova Era Alimentar: O Despertar da Nutrição Naturalista</h3>
          
          <div className="space-y-2">
            <h4 className="font-bold text-purple-900">Introdução: O Fim dos Mitos</h4>
            <p className="text-purple-800">
              Bem-vindo a uma nova forma de enxergar o seu corpo. Em janeiro de 2026, as diretrizes alimentares globais (lideradas pelo USDA e FDA) passaram pela maior transformação das últimas décadas. O que antes era considerado o "padrão" foi invertido. O foco saiu da contagem obsessiva de calorias e entrou na Densidade Nutricional e no Conhecimento Naturalista. Este manual explica como o nosso app agora te ajuda a navegar nessa nova realidade.
            </p>
          </div>
          <div className="space-y-2 pt-2 border-t border-purple-200">
            <h4 className="font-bold text-purple-900">1. A Inversão da Pirâmide: Por que Proteína é a Base?</h4>
            <p className="text-purple-800">
              Durante anos, fomos ensinados que a base da alimentação eram os carboidratos (pães, massas, cereais). A ciência de 2026 provou o contrário: a base da saúde humana é a Proteína de alta qualidade (carnes, ovos, peixes e vegetais proteicos) e as Gorduras Naturais.
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1 text-purple-800">
              <li><strong>O Superpoder da Proteína:</strong> Diferente dos carboidratos refinados, a proteína possui um alto Efeito Térmico. Isso significa que seu corpo queima energia apenas para digeri-la.</li>
              <li><strong>A Saciedade Real:</strong> A proteína regula os hormônios da fome (como a grelina). Quando você prioriza a proteína, você envia uma mensagem de "segurança" ao seu cérebro, permitindo que você coma um volume maior de comida e, ainda assim, perca gordura ou mantenha o peso com facilidade.</li>
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t border-purple-200">
            <h4 className="font-bold text-purple-900">2. Comida de Verdade vs. Ultraprocessados</h4>
            <p className="text-purple-800">
              O conceito naturalista adotado pelo app separa o que é "combustível" do que é "distração".
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1 text-purple-800">
              <li><strong>Alimentos de Verdade:</strong> São aqueles que a natureza entrega prontos (ou quase prontos). Carnes, frutas, vegetais, raízes e sementes. Eles contêm a matriz de informação que suas células reconhecem.</li>
              <li><strong>O Perigo dos Invisíveis:</strong> Açúcares adicionados e aditivos químicos "sequestram" seu paladar e desligam sua saciedade. As novas diretrizes de 2026 recomendam a redução drástica de itens de pacote (ultraprocessados), que inflamam o corpo e causam neblina mental.</li>
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t border-purple-200">
            <h4 className="font-bold text-purple-900">3. Volume Inteligente: Coma Mais, Nutra Melhor</h4>
            <p className="text-purple-800">
              A grande revelação desta nova era é que comer pouco não é sinônimo de saúde. O segredo está no volume inteligente. Ao preencher seu prato com alimentos densos (proteínas e fibras), você ocupa espaço físico no estômago e nutre suas células profundamente. O resultado? Você se sente satisfeito por muito mais tempo e elimina a necessidade de "beliscar" alimentos processados ao longo do dia.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-purple-200">
            <h4 className="font-bold text-purple-900">4. Como o App te Guia (A Didática Subjetiva)</h4>
            <p className="text-purple-800">
              Nossa plataforma não vai apenas registrar o que você come. Ela vai te ensinar enquanto você navega:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1 text-purple-800">
              <li><strong>Na sua Dispensa:</strong> Identificamos o que é aliado e o que é distração, te ensinando a ler rótulos de forma invisível.</li>
              <li><strong>No seu Prato:</strong> Celebramos quando você escolhe a proteína primeiro, validando sua inteligência biológica.</li>
              <li><strong>Na sua Agenda:</strong> Mostramos como a constância na "comida de verdade" transforma seu gráfico de energia e saúde.</li>
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t border-purple-200">
            <h4 className="font-bold text-purple-900">5. Conclusão: Autonomia e Liberdade</h4>
            <p className="text-purple-800">
              O objetivo final não é te prender a uma dieta, mas te dar Conhecimento Naturalista. Quando você entende como a proteína e os alimentos naturais funcionam, você ganha liberdade. Você para de lutar contra a balança e começa a trabalhar a favor da sua biologia.
            </p>
            <p className="text-purple-800 font-bold mt-2">
              Lembre-se: Cada escolha por um alimento real é um voto em uma versão mais forte, lúcida e vibrante de você mesmo. Estamos aqui para garantir que você vença essa jornada através do conhecimento.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-purple-200">
            <h4 className="font-bold text-purple-900">6. O Jogo da Evolução (Gamificação)</h4>
            <p className="text-purple-800">
              O EvoluFit reconhece sua dedicação. Transformamos sua constância em um jogo de evolução pessoal.
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1 text-purple-800">
              <li><strong>Níveis de Consciência:</strong> Seu nível é definido pela sua maior sequência de dias (Streak) mantendo o foco.
                <ul className="list-none pl-4 mt-1 text-[10px] space-y-0.5 opacity-90">
                  <li>🌱 <strong>Novato (0-29 dias):</strong> O começo da jornada.</li>
                  <li>🧘 <strong>Iniciado (30 dias):</strong> O hábito está se formando.</li>
                  <li>🥋 <strong>Mestre (60 dias):</strong> Disciplina e controle.</li>
                  <li>📿 <strong>Monge (90 dias):</strong> Sua mente comanda o corpo.</li>
                  <li>✨ <strong>O Iluminado (120+ dias):</strong> Transcendência nutricional.</li>
                </ul>
              </li>
              <li><strong>Como Evoluir:</strong> Basta registrar suas refeições diariamente. Se perder um dia, seu "Fogo" (Streak atual) apaga, mas seu Nível (baseado no recorde) permanece como um marco da sua história.</li>
            </ul>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-emerald-700 text-base">Funcionalidades Detalhadas</h3>
          <ul className="list-disc list-inside space-y-2 pl-1 grid grid-cols-1 gap-1">
            <li><strong>1. Dispensa e Busca:</strong> Encontre alimentos por nome ou comando de voz 🎤.</li>
            <li><strong>2. Filtros Inteligentes:</strong> Filtre por categorias ou dietas (Low Carb, Vegana, etc).</li>
            <li><strong>3. Montagem de Prato:</strong> Adicione itens e ajuste medidas caseiras com cálculo automático.</li>
            <li><strong>4. Agendamento:</strong> Defina se o prato é para dias específicos ou para a semana toda.</li>
            <li><strong>5. Agenda Interativa:</strong> Arraste e solte cards para reordenar. Marque como "Feito".</li>
            <li><strong>6. Edição e Duplicação:</strong> Edite pratos criados ou duplique refeições para outros dias.</li>
            <li><strong>7. Contexto Social:</strong> Registre onde e com quem você vai comer (ex: "Jantar com amigos").</li>
            <li><strong>8. Lista de Compras:</strong> Gere uma lista automática baseada no seu planejamento.</li>
            <li><strong>9. Resumo da Agenda:</strong> Visualize um resumo compacto de todas as refeições.</li>
            <li><strong>10. Controle de Água:</strong> Registre consumo e acompanhe a meta diária com histórico.</li>
            <li><strong>11. Cérebro e Metas:</strong> Relatório do seu metabolismo (TMB), gasto calórico e progresso.</li>
            <li><strong>12. Alertas:</strong> Receba avisos visuais e sonoros na hora de comer (com app aberto).</li>
            <li><strong>13. Modo Escuro:</strong> Alterne entre tema claro e escuro para conforto visual.</li>
            <li><strong>14. Exportar PDF:</strong> Salve ou imprima seu planejamento alimentar.</li>
            <li><strong>15. Offline:</strong> Funciona sem internet após o primeiro acesso (exceto busca por voz).</li>
            <li><strong>16. Reset e Ajustes:</strong> Redefina sua agenda ou atualize seu perfil a qualquer momento.</li>
            <li><strong>17. Gamificação:</strong> Suba de nível e desbloqueie conquistas mantendo a constância.</li>
          </ul>
        </div>

        <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-bold text-blue-800 text-base">Instalação e Atualização</h3>
          
          <div className="space-y-2">
            <p className="font-bold text-blue-900">Como Instalar:</p>
            <p className="text-blue-700">
              O EvoluFit funciona como um aplicativo nativo. Não é necessário baixar de uma loja.
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1 text-blue-700">
              <li><strong>Android (Chrome):</strong> Toque nos três pontinhos (⋮) no canto superior direito e selecione "Adicionar à tela inicial" ou "Instalar aplicativo".</li>
              <li><strong>iOS (Safari):</strong> Toque no ícone de Compartilhamento (quadrado com seta) e selecione "Adicionar à Tela de Início".</li>
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t border-blue-200">
            <p className="font-bold text-blue-900">Como Atualizar:</p>
            <p className="text-blue-700">
              Para receber novas funcionalidades (como a Lista de Compras ou Modo Escuro), você não precisa reinstalar.
            </p>
            <p className="text-blue-700">
              <strong>O segredo é:</strong> Acesse o EvoluFit pelo navegador (site) conectado à internet ocasionalmente. Isso baixa a versão mais recente automaticamente. Na próxima vez que abrir o app instalado, ele já estará atualizado.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
        {showInstallButton && (
          <button onClick={onInstallClick} className="text-emerald-600 text-xs font-bold hover:text-emerald-800 underline flex items-center gap-1"><Download size={14}/> Instalar App</button>
        )}
        <button onClick={onReset} className="text-rose-500 text-xs font-bold hover:text-rose-700 underline">
          Resetar Agenda
        </button>
        <button onClick={onClose} className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-transform active:scale-95 shadow-md">
          Fechar Manual
        </button>
      </div>
    </div>
  </div>
);

export default ManualScreen;