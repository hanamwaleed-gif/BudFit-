import React, { useState } from 'react';
import { 
  Settings, 
  X, 
  Download, 
  Upload, 
  RefreshCw, 
  ShieldCheck, 
  Layers, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { BackupManager } from '../services/BackupManager';
import { ARCHETYPES } from '../data/archetypes';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryCurrency: string;
  onCurrencyChange: (curr: string) => void;
  activeArchetypeId: string;
  onSelectArchetype: (id: string) => void;
  appState: any;
  onRestoreImportState: (importedData: any) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  primaryCurrency,
  onCurrencyChange,
  activeArchetypeId,
  onSelectArchetype,
  appState,
  onRestoreImportState
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    BackupManager.downloadBackupFile(appState, `budfit_cockpit_backup_${new Date().toISOString().split('T')[0]}.json`);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const restored = BackupManager.validateAndImport(text);
        onRestoreImportState(restored);
        setImportStatus('Backup successfully imported & state restored!');
      } catch (err: any) {
        setImportStatus(`Import Error: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1B333F]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[rgba(43,79,96,0.15)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-[rgba(43,79,96,0.12)] pb-3">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-[#845460]" />
            <h3 className="text-lg font-serif font-medium text-[#1B333F]">BudFit Cockpit Settings</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#5B6E75] hover:text-[#1B333F] rounded-lg bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currency Preference */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#5B6E75] block">Primary Display Currency</label>
          <select
            value={primaryCurrency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="w-full bg-[#FAF6F2] text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] text-xs font-bold focus:outline-none focus:border-[#845460] cursor-pointer"
          >
            <option value="EGP">EGP (£E) - Egyptian Pound</option>
            <option value="USD">USD ($) - US Dollar</option>
            <option value="EUR">EUR (€) - Euro</option>
            <option value="SAR">SAR (﷼) - Saudi Riyal</option>
          </select>
        </div>

        {/* Archetype Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#5B6E75] block">Switch Financial Archetype</label>
          <select
            value={activeArchetypeId}
            onChange={(e) => onSelectArchetype(e.target.value)}
            className="w-full bg-[#FAF6F2] text-[#2B4F60] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] text-xs font-bold focus:outline-none focus:border-[#845460] cursor-pointer"
          >
            {Object.values(ARCHETYPES).map((arch) => (
              <option key={arch.id} value={arch.id}>
                {arch.name}
              </option>
            ))}
          </select>
        </div>

        {/* Data Backup & Restore */}
        <div className="space-y-3 pt-2 border-t border-[rgba(43,79,96,0.12)]">
          <label className="text-xs font-bold text-[#1B333F] block">Full State Backup & Portability</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExport}
              className="flex items-center justify-center space-x-2 bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 text-[#2B4F60] p-3 rounded-xl border border-[rgba(43,79,96,0.15)] text-xs font-semibold transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#4F8683]" />
              <span>Export State (JSON)</span>
            </button>

            <label className="flex items-center justify-center space-x-2 bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 text-[#2B4F60] p-3 rounded-xl border border-[rgba(43,79,96,0.15)] text-xs font-semibold cursor-pointer transition">
              <Upload className="w-4 h-4 text-[#845460]" />
              <span>Import State</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>
        </div>

        {importStatus && (
          <div className="p-3 bg-[#FAF6F2] border border-[rgba(43,79,96,0.15)] text-xs text-[#2B4F60] rounded-xl font-mono">
            {importStatus}
          </div>
        )}
      </div>
    </div>
  );
};
