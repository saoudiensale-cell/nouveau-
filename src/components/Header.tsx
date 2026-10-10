import React from 'react';
import { ShieldCheck, Bell, Wallet, Globe, Radio } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenBankrollModal: () => void;
  onOpenSyncModal: () => void;
  isSyncing: boolean;
  bankrollBalance: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  unreadCount,
  onOpenNotifications,
  onOpenBankrollModal,
  onOpenSyncModal,
  isSyncing,
  bankrollBalance,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <button
              onClick={() => onTabChange('decisions')}
              className="text-base sm:text-lg font-bold tracking-tight text-white hover:text-emerald-400 transition-colors whitespace-nowrap cursor-pointer text-left block leading-tight"
            >
              StratX Predictive
            </button>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>100% Matchs Réels</span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-300">
          <button
            onClick={() => onTabChange('decisions')}
            className={`transition-colors whitespace-nowrap pb-1 relative cursor-pointer ${
              currentTab === 'decisions'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Décisions Clés
          </button>
          <button
            onClick={() => onTabChange('matches')}
            className={`transition-colors whitespace-nowrap pb-1 relative cursor-pointer ${
              currentTab === 'matches'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Arbitrage Matchs
          </button>
          <button
            onClick={() => onTabChange('live')}
            className={`transition-colors whitespace-nowrap pb-1 relative cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'live'
                ? 'text-rose-400 border-b-2 border-rose-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>Contrôle Live</span>
          </button>
          <button
            onClick={() => onTabChange('simulator')}
            className={`transition-colors whitespace-nowrap pb-1 relative cursor-pointer ${
              currentTab === 'simulator'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Simulateur de Mises
          </button>
          <button
            onClick={() => onTabChange('algorithms')}
            className={`transition-colors whitespace-nowrap pb-1 relative cursor-pointer ${
              currentTab === 'algorithms'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Algorithmes
          </button>
          <button
            onClick={() => onTabChange('backtest')}
            className={`transition-colors whitespace-nowrap pb-1 relative cursor-pointer ${
              currentTab === 'backtest'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Backtest
          </button>
        </nav>

        {/* Zone 3: Primary Action & Live Status Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenSyncModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg border border-slate-800 transition-colors cursor-pointer"
            title="Flux Officiel ESPN & Scores en Direct (100% Matchs Réels)"
          >
            <Globe className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : 'text-emerald-400'}`} />
            <span className="hidden sm:inline">Flux ESPN Live</span>
          </button>

          <button
            onClick={onOpenNotifications}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg border border-slate-800 transition-colors relative cursor-pointer"
            title="Notifications d'opportunités stratégiques"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center tabular-nums">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenBankrollModal}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-emerald-500/20 cursor-pointer"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Bankroll : {bankrollBalance.toLocaleString('fr-FR')} €</span>
          </button>
        </div>
      </div>

      {/* Mobile subnavigation bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 px-2 py-2 overflow-x-auto text-xs bg-slate-950">
        <button
          onClick={() => onTabChange('decisions')}
          className={`px-2 py-1 rounded whitespace-nowrap ${currentTab === 'decisions' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
        >
          Décisions
        </button>
        <button
          onClick={() => onTabChange('matches')}
          className={`px-2 py-1 rounded whitespace-nowrap ${currentTab === 'matches' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
        >
          Arbitrage
        </button>
        <button
          onClick={() => onTabChange('live')}
          className={`px-2 py-1 rounded whitespace-nowrap ${currentTab === 'live' ? 'text-rose-400 font-bold' : 'text-slate-400'}`}
        >
          Live
        </button>
        <button
          onClick={() => onTabChange('simulator')}
          className={`px-2 py-1 rounded whitespace-nowrap ${currentTab === 'simulator' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
        >
          Simulateur
        </button>
        <button
          onClick={() => onTabChange('algorithms')}
          className={`px-2 py-1 rounded whitespace-nowrap ${currentTab === 'algorithms' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
        >
          Algorithmes
        </button>
        <button
          onClick={() => onTabChange('backtest')}
          className={`px-2 py-1 rounded whitespace-nowrap ${currentTab === 'backtest' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
        >
          Backtest
        </button>
      </div>
    </header>
  );
};
