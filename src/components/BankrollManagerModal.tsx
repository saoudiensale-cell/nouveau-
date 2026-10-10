import React, { useState } from 'react';
import { UserBankroll } from '../types';
import { Wallet, X, ShieldAlert, CheckCircle2, Sliders, Info, Scale } from 'lucide-react';

interface BankrollManagerModalProps {
  bankroll: UserBankroll;
  onUpdateBankroll: (updated: Partial<UserBankroll>) => void;
  onClose: () => void;
}

export const BankrollManagerModal: React.FC<BankrollManagerModalProps> = ({
  bankroll,
  onUpdateBankroll,
  onClose,
}) => {
  const [balance, setBalance] = useState<number>(bankroll.totalBalance);
  const [kellyFraction, setKellyFraction] = useState<number>(bankroll.kellyFraction);
  const [maxStakePercent, setMaxStakePercent] = useState<number>(bankroll.maxStakePercent);
  const [stopLossDay, setStopLossDay] = useState<number>(bankroll.stopLossDay);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBankroll({
      totalBalance: balance,
      kellyFraction,
      maxStakePercent,
      stopLossDay,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Gestionnaire de Bankroll & Critère de Kelly
              </h2>
              <div className="text-xs text-slate-400">
                Paramétrage du dimensionnement automatique des mises
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

        {saved && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Paramètres de bankroll mis à jour avec succès !</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Balance */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300 block">
              Capital Total de la Bankroll (€)
            </label>
            <input
              type="number"
              min="100"
              max="500000"
              value={balance}
              onChange={(e) => setBalance(parseInt(e.target.value) || 1000)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-emerald-500 tabular-nums"
            />
          </div>

          {/* Fractional Kelly selector */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 block">
              Fraction du Critère de Kelly (Gestion de Risque)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setKellyFraction(0.25)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  kellyFraction === 0.25
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold">1/4 Kelly</div>
                <div className="text-[10px] text-slate-400">Recommandé (Sûr)</div>
              </button>

              <button
                type="button"
                onClick={() => setKellyFraction(0.5)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  kellyFraction === 0.5
                    ? 'bg-amber-400/15 border-amber-400 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold">1/2 Kelly</div>
                <div className="text-[10px] text-slate-400">Équilibré</div>
              </button>

              <button
                type="button"
                onClick={() => setKellyFraction(1.0)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  kellyFraction === 1.0
                    ? 'bg-rose-500/15 border-rose-500 text-rose-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold">Full Kelly</div>
                <div className="text-[10px] text-slate-400">Volatilité Max</div>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Le 1/4 Kelly divise la mise optimale par 4 pour lisser la variance statistique et protéger à 99.8% contre les séries noires temporaires.
            </p>
          </div>

          {/* Stake Cap */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300">Plafond Max par Pari (% du capital)</label>
              <span className="font-mono text-emerald-400 font-bold">{maxStakePercent}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={maxStakePercent}
              onChange={(e) => setMaxStakePercent(parseInt(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Stop Loss */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300 block">
              Protection Stop-Loss Journalière (€)
            </label>
            <input
              type="number"
              min="20"
              max="2000"
              value={stopLossDay}
              onChange={(e) => setStopLossDay(parseInt(e.target.value) || 100)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500 tabular-nums"
            />
            <p className="text-[11px] text-slate-400">
              Arrête automatiquement toutes les recommandations si la perte virtuelle cumulée atteint ce seuil.
            </p>
          </div>

          {/* Save */}
          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer shadow-sm shadow-emerald-500/20"
          >
            Appliquer les Paramètres
          </button>
        </form>
      </div>
    </div>
  );
};
