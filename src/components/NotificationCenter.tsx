import React, { useState } from 'react';
import { StrategicNotification, NotificationRuleSettings } from '../types';
import { Bell, X, Check, Settings, Sliders, Zap, CheckCircle2 } from 'lucide-react';

interface NotificationCenterProps {
  notifications: StrategicNotification[];
  rules: NotificationRuleSettings;
  onUpdateRules: (rules: NotificationRuleSettings) => void;
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onClose: () => void;
  onTakeAction: (notification: StrategicNotification) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  rules,
  onUpdateRules,
  onMarkAllAsRead,
  onMarkAsRead,
  onClose,
  onTakeAction,
}) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'settings'>('alerts');
  const [localRules, setLocalRules] = useState<NotificationRuleSettings>(rules);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRules(localRules);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Centre de Notifications & Alertes Stratégiques
              </h2>
              <div className="text-xs text-slate-400">
                {unreadCount > 0 ? `${unreadCount} opportunité(s) non lue(s)` : 'Toutes les alertes sont à jour'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-800 flex items-center justify-between bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'alerts'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Flux d&apos;Opportunités ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Règles Personnalisées</span>
            </button>
          </div>

          {activeTab === 'alerts' && unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {activeTab === 'alerts' ? (
            notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                Aucune notification pour le moment.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => onMarkAsRead(notif.id)}
                  className={`p-4 rounded-xl border transition-all text-xs space-y-2 cursor-pointer ${
                    !notif.isRead
                      ? 'bg-slate-950/90 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-950/40 border-slate-800/80 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{notif.title}</span>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 shrink-0 font-mono">
                      {notif.timestamp}
                    </span>
                  </div>

                  <div className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
                    {notif.message}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-[11px]">
                    <div className="flex items-center gap-3 text-slate-400">
                      <span>Cote : <strong className="text-white">{notif.odds.toFixed(2)}</strong></span>
                      <span className="text-emerald-400 font-bold font-mono">EV+ +{notif.evPlus}%</span>
                      <span>Probabilité : {notif.winProb}%</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTakeAction(notif);
                        onClose();
                      }}
                      className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Zap className="w-3 h-3" />
                      <span>{notif.recommendedAction}</span>
                    </button>
                  </div>
                </div>
              ))
            )
          ) : (
            /* Custom Rules Settings Form */
            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
              {saveSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Règles personnalisées enregistrées avec succès !</span>
                </div>
              )}

              {/* Slider 1: Min EV+ */}
              <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">
                    Seuil Minimum d&apos;Espérance Mathématique (EV+)
                  </span>
                  <span className="font-mono text-emerald-400 font-bold tabular-nums">
                    +{localRules.minExpectedValue}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={localRules.minExpectedValue}
                  onChange={(e) =>
                    setLocalRules(r => ({ ...r, minExpectedValue: parseInt(e.target.value) }))
                  }
                  className="w-full accent-emerald-500"
                />
                <p className="text-[11px] text-slate-400">
                  Déclenche une alerte uniquement lorsque l&apos;avantage statistique contre le bookmaker dépasse ce seuil.
                </p>
              </div>

              {/* Slider 2: Min Win Probability */}
              <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">
                    Probabilité de Gain Minimale Requise (Option Sûre)
                  </span>
                  <span className="font-mono text-emerald-400 font-bold tabular-nums">
                    {localRules.minWinProbability}%
                  </span>
                </div>
                <input
                  type="range"
                  min="55"
                  max="88"
                  step="1"
                  value={localRules.minWinProbability}
                  onChange={(e) =>
                    setLocalRules(r => ({ ...r, minWinProbability: parseInt(e.target.value) }))
                  }
                  className="w-full accent-emerald-500"
                />
                <p className="text-[11px] text-slate-400">
                  Filtre les opportunités pour ne retenir que les paris à très haute certitude statistique.
                </p>
              </div>

              {/* Toggles */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Alerte In-Play sur Anomalie xG en direct</span>
                  <input
                    type="checkbox"
                    checked={localRules.alertOnLiveAnomaly}
                    onChange={(e) => setLocalRules(r => ({ ...r, alertOnLiveAnomaly: e.target.checked }))}
                    className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-800">
                  <span className="text-slate-300">Alerte Décalage de Cotes à la Clôture (Closing Line Value)</span>
                  <input
                    type="checkbox"
                    checked={localRules.alertOnClosingLineDrift}
                    onChange={(e) => setLocalRules(r => ({ ...r, alertOnClosingLineDrift: e.target.checked }))}
                    className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-800">
                  <span className="text-slate-300">Signal d&apos;Arbitrage Cash-Out Optimal</span>
                  <input
                    type="checkbox"
                    checked={localRules.alertOnCashoutSurge}
                    onChange={(e) => setLocalRules(r => ({ ...r, alertOnCashoutSurge: e.target.checked }))}
                    className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer shadow-sm shadow-emerald-500/20"
              >
                Enregistrer les Paramètres d&apos;Alertes
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
