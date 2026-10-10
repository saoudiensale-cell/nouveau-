import React, { useState } from 'react';
import { Match, MarketOption } from '../types';
import { Wallet, TrendingUp, Shield, Sparkles, RotateCcw, CheckCircle2, XCircle, Clock, Zap, ArrowUpRight, DollarSign } from 'lucide-react';

export interface VirtualBet {
  id: string;
  timestamp: string;
  matchId: string;
  matchTitle: string;
  league: string;
  selection: string;
  marketType: string;
  odds: number;
  stake: number;
  potentialReturn: number;
  winProbability: number;
  expectedValue: number;
  strategyCategory: 'safest' | 'prolific' | 'balanced' | 'custom';
  status: 'pending' | 'won' | 'lost';
  profit: number;
  resolvedAt?: string;
}

interface BettingSimulatorProps {
  matches: Match[];
  virtualBalance: number;
  initialVirtualBalance: number;
  virtualBets: VirtualBet[];
  onPlaceVirtualBet: (bet: Omit<VirtualBet, 'id' | 'timestamp' | 'status' | 'profit'>) => void;
  onResolveBet: (betId: string, outcome: 'won' | 'lost') => void;
  onSimulateAllPending: () => void;
  onResetVirtualBankroll: () => void;
}

export const BettingSimulator: React.FC<BettingSimulatorProps> = ({
  matches,
  virtualBalance,
  initialVirtualBalance,
  virtualBets,
  onPlaceVirtualBet,
  onResolveBet,
  onSimulateAllPending,
  onResetVirtualBankroll,
}) => {
  // Selection state
  const [selectedMatchId, setSelectedMatchId] = useState<string>(matches[0]?.id || '');
  const [selectedStrategyType, setSelectedStrategyType] = useState<'safest' | 'prolific' | 'balanced'>('safest');
  const [customStake, setCustomStake] = useState<number>(40);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved'>('all');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const activeMatch = matches.find(m => m.id === selectedMatchId) || matches[0];
  const activeOption: MarketOption =
    selectedStrategyType === 'safest'
      ? activeMatch.safestOption
      : selectedStrategyType === 'prolific'
      ? activeMatch.prolificOption
      : activeMatch.balancedOption;

  // Recommended stake according to Kelly
  const kellyStakeEuro = Math.max(10, Math.round((virtualBalance * activeOption.recommendedStakePct) / 100));

  // Compute stats for virtual portfolio
  const resolvedBets = virtualBets.filter(b => b.status !== 'pending');
  const wonBets = resolvedBets.filter(b => b.status === 'won');
  const winRate = resolvedBets.length > 0 ? (wonBets.length / resolvedBets.length) * 100 : 0;
  const netProfit = virtualBalance - initialVirtualBalance;
  const totalStakedResolved = resolvedBets.reduce((acc, b) => acc + b.stake, 0);
  const roi = totalStakedResolved > 0 ? (netProfit / totalStakedResolved) * 100 : 0;

  const handlePlaceBet = (e: React.FormEvent) => {
    e.preventDefault();
    if (customStake <= 0) return;
    if (customStake > virtualBalance) {
      setFeedbackMessage('Solde fictif insuffisant pour cette mise.');
      setTimeout(() => setFeedbackMessage(null), 3000);
      return;
    }

    onPlaceVirtualBet({
      matchId: activeMatch.id,
      matchTitle: `${activeMatch.homeTeam} vs ${activeMatch.awayTeam}`,
      league: activeMatch.league,
      selection: activeOption.selection,
      marketType: activeOption.market,
      odds: activeOption.bookmakerOdds,
      stake: customStake,
      potentialReturn: +(customStake * activeOption.bookmakerOdds).toFixed(2),
      winProbability: activeOption.winProbability,
      expectedValue: activeOption.expectedValue,
      strategyCategory: selectedStrategyType,
    });

    setFeedbackMessage(`Pari simulé de ${customStake} € placé avec succès sur ${activeOption.selection} !`);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const filteredBets = virtualBets.filter(b => {
    if (filterStatus === 'pending') return b.status === 'pending';
    if (filterStatus === 'resolved') return b.status !== 'pending';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">ENVIRONNEMENT SANS RISQUE (PAPER TRADING)</span>
              <span aria-hidden="true">·</span>
              <span>Capital Virtuel 100% Fictif</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Simulateur de Paris Algorithmiques
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Testez et mesurez en conditions réelles la rentabilité des algorithmes prédictifs StratX sans engager un seul centime réel. Validez la robustesse du critère de Kelly et observez la convergence de vos gains.
            </p>
          </div>

          <button
            onClick={onResetVirtualBankroll}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer self-start sm:self-auto shrink-0"
            title="Réinitialiser le capital virtuel à 1 000 €"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser les Fonds</span>
          </button>
        </div>

        {/* Virtual KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400">Capital Virtuel Disponible</div>
            <div className="text-xl font-extrabold text-white tabular-nums">
              {virtualBalance.toLocaleString('fr-FR')} €
            </div>
            <div className="text-[10px] text-slate-400">
              Initial : {initialVirtualBalance.toLocaleString('fr-FR')} €
            </div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400">Profit Virtuel Net</div>
            <div className={`text-xl font-extrabold tabular-nums ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {netProfit >= 0 ? `+${netProfit.toLocaleString('fr-FR')}` : netProfit.toLocaleString('fr-FR')} €
            </div>
            <div className="text-[10px] text-slate-400">
              Évolution : {((netProfit / initialVirtualBalance) * 100).toFixed(1)}%
            </div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400">Taux de Réussite Virtuel</div>
            <div className="text-xl font-extrabold text-white tabular-nums">
              {resolvedBets.length > 0 ? `${winRate.toFixed(1)}%` : '—'}
            </div>
            <div className="text-[10px] text-slate-400 tabular-nums">
              {wonBets.length} gagnés / {resolvedBets.length} terminés
            </div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400">ROI / Yield Virtuel</div>
            <div className={`text-xl font-extrabold tabular-nums ${roi >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {resolvedBets.length > 0 ? `${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%` : '—'}
            </div>
            <div className="text-[10px] text-slate-400">
              Sur {virtualBets.length} paris simulés
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Bet Placement Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form to place virtual bet (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Placer un Nouveau Pari Simulé</span>
            </h2>
            <span className="text-xs text-slate-400">Fonds Fictifs Instantanés</span>
          </div>

          {feedbackMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
          )}

          <form onSubmit={handlePlaceBet} className="space-y-4">
            {/* 1. Match Selector */}
            <div className="space-y-1.5">
              <label htmlFor="match-picker-select" className="text-xs font-semibold text-slate-300">
                1. Choisir le Match Cible :
              </label>
              <select
                id="match-picker-select"
                value={selectedMatchId}
                onChange={(e) => setSelectedMatchId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {matches.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.league} — {m.homeTeam} vs {m.awayTeam} ({m.date} {m.time})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Strategy Option Selector */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-300 block">
                2. Sélectionner la Stratégie Algorithmique :
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStrategyType('safest')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedStrategyType === 'safest'
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Option la Plus Sûre</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1 font-medium truncate">
                    {activeMatch.safestOption.selection}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 tabular-nums">
                    Cote : <strong className="text-white">{activeMatch.safestOption.bookmakerOdds.toFixed(2)}</strong> (85% prob)
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedStrategyType('prolific')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedStrategyType === 'prolific'
                      ? 'bg-amber-400/15 border-amber-400/50 text-white'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Option Plus Prolifique</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1 font-medium truncate">
                    {activeMatch.prolificOption.selection}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 tabular-nums">
                    Cote : <strong className="text-white">{activeMatch.prolificOption.bookmakerOdds.toFixed(2)}</strong> (+{activeMatch.prolificOption.expectedValue}% EV)
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedStrategyType('balanced')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedStrategyType === 'balanced'
                      ? 'bg-sky-500/15 border-sky-500/50 text-white'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                    <span>Équilibrée (Value)</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1 font-medium truncate">
                    {activeMatch.balancedOption.selection}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 tabular-nums">
                    Cote : <strong className="text-white">{activeMatch.balancedOption.bookmakerOdds.toFixed(2)}</strong>
                  </div>
                </button>
              </div>
            </div>

            {/* Strategy Detail Callout */}
            <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Marché : <strong className="text-white">{activeOption.market}</strong></span>
                <span>Cote Bookmaker : <strong className="text-emerald-400 tabular-nums">{activeOption.bookmakerOdds.toFixed(2)}</strong></span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Cote Juste Algorithmique : <strong className="text-slate-200 tabular-nums">{activeOption.fairOdds.toFixed(2)}</strong></span>
                <span className="text-emerald-400 tabular-nums">EV+ : +{activeOption.expectedValue.toFixed(1)}%</span>
              </div>
              <p className="text-slate-400 text-[11px] pt-1 leading-relaxed border-t border-slate-800/60">
                {activeOption.rationale}
              </p>
            </div>

            {/* 3. Stake Input & Quick Presets */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <label htmlFor="stake-euro-amount-input">3. Montant de la Mise Virtuelle (€) :</label>
                <span className="text-slate-400 font-normal">
                  Mise Kelly conseillée : <strong className="text-white tabular-nums">{kellyStakeEuro} €</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    id="stake-euro-amount-input"
                    type="number"
                    min="5"
                    max={virtualBalance}
                    value={customStake}
                    onChange={(e) => setCustomStake(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-emerald-500 tabular-nums"
                  />
                  <span className="absolute right-4 top-2.5 text-slate-500 text-sm">€ fictifs</span>
                </div>

                {/* Presets */}
                <button
                  type="button"
                  onClick={() => setCustomStake(kellyStakeEuro)}
                  className="px-3 py-2.5 text-xs bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  Kelly ({activeOption.recommendedStakePct}%)
                </button>
                <button
                  type="button"
                  onClick={() => setCustomStake(25)}
                  className="px-2.5 py-2.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  25 €
                </button>
                <button
                  type="button"
                  onClick={() => setCustomStake(50)}
                  className="px-2.5 py-2.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  50 €
                </button>
                <button
                  type="button"
                  onClick={() => setCustomStake(100)}
                  className="px-2.5 py-2.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  100 €
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Gain Virtuel Brut Potentiel :</span>
                <span className="text-sm font-bold text-white tabular-nums">
                  {(customStake * activeOption.bookmakerOdds).toFixed(2)} €
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={customStake <= 0 || customStake > virtualBalance}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-emerald-500/20"
            >
              <DollarSign className="w-4 h-4" />
              <span>Valider le Pari Simulé ({customStake} €)</span>
            </button>
          </form>
        </div>

        {/* Right Column: Instant Stochastic Simulator Engine & Insights (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Résolution Stochastique</h2>
            <button
              onClick={onSimulateAllPending}
              disabled={virtualBets.filter(b => b.status === 'pending').length === 0}
              className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 disabled:opacity-40 disabled:cursor-not-allowed text-emerald-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simuler les En Cours</span>
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Plutôt que d’attendre 90 minutes réelles, vous pouvez déclencher le moteur de tirage Monte Carlo (10 000 itérations stochastiques) pour résoudre instantanément vos paris en respectant les probabilités mathématiques réelles.
          </p>

          {/* Pending Bets Quick List */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Paris en attente de résultat ({virtualBets.filter(b => b.status === 'pending').length})</span>
            </div>

            {virtualBets.filter(b => b.status === 'pending').length === 0 ? (
              <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 text-center text-xs text-slate-500">
                Aucun pari virtuel en cours. Placez un pari à gauche pour tester.
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {virtualBets.filter(b => b.status === 'pending').map((bet) => (
                  <div
                    key={bet.id}
                    className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-white">{bet.matchTitle}</div>
                        <div className="text-slate-400">{bet.selection}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-emerald-400 font-bold tabular-nums">@{bet.odds.toFixed(2)}</div>
                        <div className="text-slate-400 tabular-nums">{bet.stake} €</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
                      <span className="text-slate-500">Résolution manuelle :</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onResolveBet(bet.id, 'won')}
                          className="px-2 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-medium rounded transition-colors cursor-pointer"
                        >
                          Gagné (+{(bet.potentialReturn - bet.stake).toFixed(1)}€)
                        </button>
                        <button
                          onClick={() => onResolveBet(bet.id, 'lost')}
                          className="px-2 py-0.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-medium rounded transition-colors cursor-pointer"
                        >
                          Perdu (-{bet.stake}€)
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Historical Virtual Bets Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">
              Journal & Historique des Paris Simulés ({virtualBets.length})
            </h2>
            <p className="text-xs text-slate-400">
              Audit transparent de toutes vos simulations virtuelles.
            </p>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterStatus === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tous ({virtualBets.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterStatus === 'pending' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              En Cours ({virtualBets.filter(b => b.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilterStatus('resolved')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterStatus === 'resolved' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Terminés ({resolvedBets.length})
            </button>
          </div>
        </div>

        {filteredBets.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs bg-slate-950/40 rounded-xl border border-slate-800">
            Aucun pari simulé ne correspond à ce filtre.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Match</th>
                  <th className="py-3 px-3">Sélection / Marché</th>
                  <th className="py-3 px-3 text-right">Cote</th>
                  <th className="py-3 px-3 text-right">Mise Virtuelle</th>
                  <th className="py-3 px-3 text-right">Espérance (EV+)</th>
                  <th className="py-3 px-3 text-center">Statut</th>
                  <th className="py-3 px-3 text-right">Profit Virtuel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredBets.map((bet) => (
                  <tr key={bet.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                      {bet.timestamp}
                    </td>
                    <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                      {bet.matchTitle}
                      <span className="block text-[11px] text-slate-400 font-normal">{bet.league}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-200">
                      <div className="font-medium text-white">{bet.selection}</div>
                      <div className="text-[11px] text-slate-400">{bet.marketType}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white tabular-nums">
                      {bet.odds.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-200 tabular-nums">
                      {bet.stake} €
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-400 tabular-nums">
                      +{bet.expectedValue.toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {bet.status === 'won' ? (
                        <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Gagné
                        </span>
                      ) : bet.status === 'lost' ? (
                        <span className="text-rose-400 font-semibold flex items-center justify-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Perdu
                        </span>
                      ) : (
                        <span className="text-amber-400 font-semibold flex items-center justify-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> En attente
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums whitespace-nowrap">
                      {bet.status === 'won' ? (
                        <span className="text-emerald-400">+{bet.profit.toFixed(2)} €</span>
                      ) : bet.status === 'lost' ? (
                        <span className="text-rose-400">-{bet.stake.toFixed(2)} €</span>
                      ) : (
                        <span className="text-slate-400">En cours</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
