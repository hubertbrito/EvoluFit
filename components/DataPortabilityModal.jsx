import React, { useState, useRef } from 'react';
import { DownloadCloud, UploadCloud, Share2, CheckCircle, AlertTriangle, FileJson, X, Loader, Database } from 'lucide-react';
import { generateBackupData, createBackupFile, validateBackupData } from './backupSystem';

const DataPortabilityModal = ({ onClose, onRestore }) => {
  const [mode, setMode] = useState('menu'); // 'menu', 'importing', 'success', 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [importStats, setImportStats] = useState(null);
  const fileInputRef = useRef(null);

  const handleExport = async () => {
    try {
      const data = generateBackupData();
      const file = createBackupFile(data);

      // Tenta usar a API nativa de compartilhamento (Mobile Friendly)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Backup EvoluFit',
          text: 'Aqui está meu backup de dados do EvoluFit.',
        });
      } else {
        // Fallback para download clássico (Desktop)
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Erro ao exportar:", err);
      alert("Não foi possível gerar o arquivo de exportação.");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        validateBackupData(json); // Valida integridade
        
        // Prepara estatísticas para confirmação
        setImportStats({
          date: new Date(json.timestamp).toLocaleDateString('pt-BR'),
          profileName: json.payload.userProfile?.name || 'Desconhecido',
          mealsCount: json.payload.mealSchedule?.length || 0,
          data: json.payload
        });
        setMode('confirm');
      } catch (err) {
        setErrorMsg(err.message);
        setMode('error');
      }
    };
    reader.readAsText(file);
  };

  const confirmRestore = () => {
    if (importStats && importStats.data) {
      onRestore(importStats.data);
      setMode('success');
      setTimeout(onClose, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-bounce border border-gray-200 dark:border-gray-700">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Database size={20} className="text-indigo-500" />
            Dados & Portabilidade
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {mode === 'menu' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                Leve sua evolução com você. Exporte seus dados para trocar de celular ou faça um backup de segurança.
              </p>
              
              <button 
                onClick={handleExport}
                className="w-full py-4 bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-100 dark:border-indigo-800 rounded-xl flex items-center justify-center gap-3 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all group"
              >
                <div className="p-2 bg-indigo-500 text-white rounded-full shadow-md group-hover:scale-110 transition-transform">
                  <Share2 size={20} />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-indigo-900 dark:text-indigo-300 text-sm">Criar Backup</span>
                  <span className="block text-xs text-indigo-600/70 dark:text-indigo-400/70">Salvar ou enviar arquivo</span>
                </div>
              </button>

              <div className="relative">
                <input 
                  type="file" 
                  accept=".json"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="w-full py-4 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-100 dark:border-emerald-800 rounded-xl flex items-center justify-center gap-3 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all group"
                >
                  <div className="p-2 bg-emerald-500 text-white rounded-full shadow-md group-hover:scale-110 transition-transform">
                    <UploadCloud size={20} />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-emerald-900 dark:text-emerald-300 text-sm">Restaurar Dados</span>
                    <span className="block text-xs text-emerald-600/70 dark:text-emerald-400/70">Carregar arquivo de backup</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {mode === 'confirm' && importStats && (
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600">
                <AlertTriangle size={32} />
              </div>
              <h4 className="font-bold text-gray-800 dark:text-white text-lg mb-2">Atenção!</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Isso substituirá seus dados atuais pelos dados do backup de <strong>{importStats.profileName}</strong> gerado em <strong>{importStats.date}</strong>.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-6 text-xs text-gray-500 dark:text-gray-400">
                Contém {importStats.mealsCount} refeições planejadas.
              </div>
              <div className="flex gap-3">
                <button onClick={() => setMode('menu')} className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm">Cancelar</button>
                <button onClick={confirmRestore} className="flex-1 py-3 bg-yellow-500 text-white rounded-xl font-bold text-sm shadow-md hover:bg-yellow-600">Confirmar</button>
              </div>
            </div>
          )}

          {mode === 'error' && (
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-600">
                <X size={32} />
              </div>
              <h4 className="font-bold text-gray-800 dark:text-white text-lg mb-2">Erro na Importação</h4>
              <p className="text-sm text-rose-600 mb-6">{errorMsg}</p>
              <button onClick={() => setMode('menu')} className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm">Tentar Novamente</button>
            </div>
          )}

          {mode === 'success' && (
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                <CheckCircle size={32} />
              </div>
              <h4 className="font-bold text-gray-800 dark:text-white text-lg mb-2">Sucesso!</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Seus dados foram restaurados e a aplicação foi atualizada.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataPortabilityModal;