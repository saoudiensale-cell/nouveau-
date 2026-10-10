import React, { useState } from 'react';
import { InternetSyncConfig } from '../services/liveFootballSync';
import { Globe, X, RefreshCw, CheckCircle2, Wifi, ShieldCheck, Clock, Zap } from 'lucide-react';

interface InternetSyncModalProps {
  config: InternetSyncConfig;
  onUpdateConfig: (config: InternetSyncConfig) => void;
  onManualRefresh: () => Promise<void>;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  totalSyncedCount: number;
  onClose: () => void;
}

export const InternetSyncModal: React.FC<InternetSyncModalProps> = ({
  config,
  onUpdateConfig,
  onManualRefresh,
  isSyncing,
  lastSyncedAt,
  totalSyncedCount,
  onClose,
}) => {
  const [localConfig, setLocalConfig] = useState<InternetSyncConfig>(config);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const availableLeagues = [
    'Champions League',
    'Premier League',
    'Ligue 1',
    'La Liga',
    'Serie A',
    'Bundesliga',
  ];

  const handleToggleLeague = (league: string) => {
    setLocalConfig(prev => {
      const exists = prev.selectedLeagues.includes(league);
      const nextLeagues = exists
        ? prev.selectedLeagues.filter(l => l !== league)
        : [...prev.selectedLeagues, league];
      return { ...prev, selectedLeagues: nextLeagues.length > 0 ? nextLeagues : [league] };
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(localConfig);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl p-6 sm:p-7 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Paramètres de Connexion Internet & Flux Temps Réel
              </h2>
              <div className="text-xs text-slate-400">
                Synchronisation continue des matchs du jour et des jours suivants
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Paramètres de synchronisation internet appliqués avec succès !</span>
          </div>
        )}

        {/* Live Status Card */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-white">Statut : Connecté à Internet</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Dernière synchronisation :{' '}
              <strong className="text-slate-300">
                {lastSyncedAt ? lastSyncedAt.toLocaleTimeString('fr-FR') : 'En cours'}
              </strong>{' '}
              ({totalSyncedCount} matchs réels actifs)
            </div>
          </div>

          <button
            type="button"
            onClick={onManualRefresh}
            disabled={isSyncing}
            className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Actualisation...' : 'Actualiser Maintenant'}</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5 text-xs">
          {/* Main Toggle */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-semibold text-white block">
                Actualisation Automatique en Continu
              </span>
              <span className="text-[11px] text-slate-400">
                Interroge le réseau internet en arrière-plan pour mettre à jour les cotes et les nouveaux matchs.
              </span>
            </div>
            <input
              type="checkbox"
              checked={localConfig.autoSyncEnabled}
              onChange={(e) =>
                setLocalConfig(c => ({ ...c, autoSyncEnabled: e.target.checked }))
              }
              className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          {/* Refresh Frequency */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 block">
              Fréquence de Rafraîchissement Automatique :
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { sec: 30, label: '30 sec' },
                { sec: 60, label: '1 min' },
                { sec: 180, label: '3 min' },
                { sec: 300, label: '5 min' },
              ].map(({ sec, label }) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setLocalConfig(c => ({ ...c, refreshIntervalSeconds: sec }))}
                  className={`py-2 px-2.5 rounded-lg border text-center font-medium transition-all cursor-pointer ${
                    localConfig.refreshIntervalSeconds === sec
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-500'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* League selection */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-300 block">
              Championnats Réels à Surveiller :
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableLeagues.map(league => {
                const isSelected = localConfig.selectedLeagues.includes(league);
                return (
                  <button
                    key={league}
                    type="button"
                    onClick={() => handleToggleLeague(league)}
                    className={`py-2 px-3 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-white font-medium'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{league}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Source selection */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 block">
              Source des Données Web :
            </label>
            <select
              value={localConfig.apiSource}
              onChange={(e) =>
                setLocalConfig(c => ({
                  ...c,
                  apiSource: e.target.value as InternetSyncConfig['apiSource'],
                }))
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="espn_official_live">
                Flux Officiel ESPN Live Scores & Matchs Réels (Recommandé - 100% Réel)
              </option>
              <option value="public_live_feed">
                Flux Sportif Mondial Temps Réel (Automatique sans clé)
              </option>
              <option value="custom_api">
                Clé API Personnalisée (Football-Data.org / API-Football)
              </option>
            </select>
          </div>

          {localConfig.apiSource === 'custom_api' && (
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 block">Clé API (Optionnel) :</label>
              <input
                type="text"
                placeholder="Ex: API-KEY-FOOTBALL-XYZ"
                value={localConfig.customApiKey || ''}
                onChange={(e) => setLocalConfig(c => ({ ...c, customApiKey: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer shadow-sm shadow-emerald-500/20"
            >
              Enregistrer les Paramètres
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
