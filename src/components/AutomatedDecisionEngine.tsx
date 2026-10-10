import React, { useState } from 'react';
import { Match, MarketOption } from '../types';
import { Shield, TrendingUp, CheckCircle2, ChevronRight, Zap, ArrowUpRight, Lock, Radio, RefreshCw, Globe, Check } from 'lucide-react';
import { TeamBadge } from './TeamBadge';

interface AutomatedDecisionEngineProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
  onExecuteBet: (match: Match, option: MarketOption) => void;
  bankrollBalance: number;
  lastSyncedAt?: Date | null;
  onRefresh?: () => void;
  isSyncing?: boolean;
}

export const AutomatedDecisionEngine: React.FC<AutomatedDecisionEngineProps> = ({
  matches,
  onSelectMatch,
  onExecuteBet,
  bankrollBalance,
  lastSyncedAt,
  onRefresh,
  isSyncing,
}) => {
  const [activeStrategyFilter, setActiveStrategyFilter] = useState<'all' | 'safest' | 'prolific'>('all');
  const [activeDateFilter, setActiveDateFilter] = useState<'all' | 'today' | 'tomorrow' | 'upcoming'>('all');
  const [activeLeagueFilter, setActiveLeagueFilter] = useState<string>('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<'all' | 'live' | 'upcoming'>('all');
  const [executedBets, setExecutedBets] = useState<Record<string, boolean>>({});

  const availableLeagues = Array.from(new Set(matches.map(m => m.league)));

  // Filter matches by date, league, and status
  const filteredMatches = matches.filter(m => {
    // Date filter
    if (activeDateFilter === 'today' && !m.date.toLowerCase().includes('aujourd')) return false;
    if (activeDateFilter === 'tomorrow' && !m.date.toLowerCase().includes('demain')) return false;
    if (activeDateFilter === 'upcoming' && (m.date.toLowerCase().includes('aujourd') || m.date.toLowerCase().includes('demain'))) return false;

    // League filter
    if (activeLeagueFilter !== 'all' && m.league !== activeLeagueFilter) return false;

    // Status filter
    if (activeStatusFilter === 'live' && !m.isLive) return false;
    if (activeStatusFilter === 'upcoming' && m.isLive) return false;

    return true;
  });

  // Get top safest and top prolific across all matches
  const topSafestMatch = matches.reduce((prev, curr) =>
    curr.safestOption.winProbability > prev.safestOption.winProbability ? curr : prev
  , matches[0] || {} as Match);

  const topProlificMatch = matches.reduce((prev, curr) =>
    curr.prolificOption.expectedValue > prev.prolificOption.expectedValue ? curr : prev
  , matches[0] || {} as Match);

  const handleExecute = (match: Match, option: MarketOption, key: string) => {
    onExecuteBet(match, option);
    setExecutedBets(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setExecutedBets(prev => ({ ...prev, [key]: false }));
    }, 3000);
  };

  const liveMatchesCount = matches.filter(m => m.isLive).length;

  return (
    <div className="space-y-8">
      {/* Real Live Official Feed Status Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">
                Flux Officiel ESPN & Réseaux Européens Direct
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                100% Matchs Réels
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-x-2">
              <span>{matches.length} matchs réels synchronisés</span>
              {liveMatchesCount > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-rose-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                    {liveMatchesCount} en direct actuellement
                  </span>
                </>
              )}
              {lastSyncedAt && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Mis à jour : {lastSyncedAt.toLocaleTimeString('fr-FR')}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isSyncing}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-2 cursor-pointer transition-colors shrink-0 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchronisation...' : 'Actualiser en Direct'}</span>
          </button>
        )}
      </div>

      {/* Intro hero banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Algorithmes Prédictifs Génération V</span>
            <span aria-hidden="true">·</span>
            <span>Prise de Décision Automatisée</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-medium">Modèles Stochastiques Transparents</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight text-balance">
            Optimisation Stochastique & Arbitrage Footballistique
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Éliminez l’émotion et la complexité sportive. Notre moteur analyse en direct les rencontres réelles des championnats majeurs (xG réels, fatigue, simulations Monte Carlo, inefficiences des cotes) pour synthétiser en un coup d’œil <strong className="text-white font-semibold">l’option la plus sûre</strong> et <strong className="text-white font-semibold">l’option la plus prolifique</strong>.
          </p>
        </div>

        {/* Responsible assurance banner */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Gestion de risque stricte basée sur la formule de Kelly fractionnée (1/4 Kelly).</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Variance contrôlée</span>
            <span aria-hidden="true">·</span>
            <span>Backtesting vérifié sur 840+ matchs officiels</span>
          </div>
        </div>
      </div>

      {/* Primary 2-Column Split: Option la plus sûre VS Option la plus prolifique */}
      {topSafestMatch && topProlificMatch && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Card 1: Option la plus sûre */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="space-y-4">
              {/* Header label & Match context */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>OPTION LA PLUS SÛRE DU JOUR</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span>{topSafestMatch.league}</span>
                    <span>·</span>
                    <span>{topSafestMatch.date} {topSafestMatch.time}</span>
                    {topSafestMatch.isLive && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[10px]">
                        EN DIRECT
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-400 tabular-nums">
                    {Math.round(topSafestMatch.safestOption.winProbability * 100)}%
                  </div>
                  <div className="text-[11px] text-slate-400">Probabilité Calculée</div>
                </div>
              </div>

              {/* Match Heading with Team Badges */}
              <div className="pt-2 pb-2 border-y border-slate-800/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <TeamBadge badge={topSafestMatch.homeBadge} name={topSafestMatch.homeTeam} size="md" />
                    <span className="font-bold text-white text-base">{topSafestMatch.homeTeam}</span>
                    {topSafestMatch.isLive && topSafestMatch.liveData && (
                      <span className="font-mono font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-slate-950 text-sm">
                        {topSafestMatch.liveData.homeScore} - {topSafestMatch.liveData.awayScore}
                      </span>
                    )}
                    <span className="text-slate-500 text-xs font-normal">vs</span>
                    <TeamBadge badge={topSafestMatch.awayBadge} name={topSafestMatch.awayTeam} size="md" />
                    <span className="font-bold text-white text-base">{topSafestMatch.awayTeam}</span>
                  </div>
                  <span className="text-xs text-slate-400 tabular-nums font-mono hidden sm:inline">
                    Élo {topSafestMatch.algorithm.eloHome} vs {topSafestMatch.algorithm.eloAway}
                  </span>
                </div>
              </div>

              {/* Selection & Odds Strip */}
              <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 space-y-2">
                <div className="text-xs text-slate-400">Marché & Sélection Recommandée :</div>
                <div className="text-base font-semibold text-white flex items-center justify-between">
                  <span>{topSafestMatch.safestOption.selection}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-slate-400">Cote :</span>
                    <span className="text-xl font-bold text-emerald-400 tabular-nums">
                      {topSafestMatch.safestOption.bookmakerOdds.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 text-slate-400 border-t border-slate-800/60">
                  <span>Cote Juste Algorithmique : <strong className="text-slate-200 tabular-nums">{topSafestMatch.safestOption.fairOdds.toFixed(2)}</strong></span>
                  <span className="text-emerald-400 font-medium tabular-nums">
                    EV+ +{topSafestMatch.safestOption.expectedValue.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Human Readable Rationale */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-300">Pourquoi cette décision sans hésiter :</div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {topSafestMatch.safestOption.rationale}
                </p>
                <ul className="space-y-1.5 pt-1">
                  {topSafestMatch.safestOption.keyFactors.map((factor, idx) => (
                    <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] text-slate-400">Mise Suggérée (1/4 Kelly)</div>
                <div className="text-sm font-bold text-white tabular-nums">
                  {Math.round((bankrollBalance * topSafestMatch.safestOption.recommendedStakePct) / 100)} €
                  <span className="text-xs text-slate-400 font-normal ml-1">
                    ({topSafestMatch.safestOption.recommendedStakePct}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectMatch(topSafestMatch)}
                  className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Inspecter xG
                </button>
                <button
                  onClick={() => handleExecute(topSafestMatch, topSafestMatch.safestOption, 'top-safest')}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-500/20"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{executedBets['top-safest'] ? 'Ajouté à la Bankroll !' : 'Appliquer la Décision'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Option la plus prolifique */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="space-y-4">
              {/* Header label & Match context */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <span>OPTION LA PLUS PROLIFIQUE (MAX RENDEMENT)</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span>{topProlificMatch.league}</span>
                    <span>·</span>
                    <span>{topProlificMatch.date} {topProlificMatch.time}</span>
                    {topProlificMatch.isLive && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[10px]">
                        EN DIRECT
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-amber-400 tabular-nums">
                    +{topProlificMatch.prolificOption.expectedValue.toFixed(1)}%
                  </div>
                  <div className="text-[11px] text-slate-400">Espérance Mathématique (EV+)</div>
                </div>
              </div>

              {/* Match Heading with Badges */}
              <div className="pt-2 pb-2 border-y border-slate-800/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <TeamBadge badge={topProlificMatch.homeBadge} name={topProlificMatch.homeTeam} size="md" />
                    <span className="font-bold text-white text-base">{topProlificMatch.homeTeam}</span>
                    {topProlificMatch.isLive && topProlificMatch.liveData && (
                      <span className="font-mono font-bold text-amber-400 px-1.5 py-0.5 rounded bg-slate-950 text-sm">
                        {topProlificMatch.liveData.homeScore} - {topProlificMatch.liveData.awayScore}
                      </span>
                    )}
                    <span className="text-slate-500 text-xs font-normal">vs</span>
                    <TeamBadge badge={topProlificMatch.awayBadge} name={topProlificMatch.awayTeam} size="md" />
                    <span className="font-bold text-white text-base">{topProlificMatch.awayTeam}</span>
                  </div>
                  <span className="text-xs text-amber-400/90 font-medium hidden sm:inline">
                    Différentiel EV+ Optimal
                  </span>
                </div>
              </div>

              {/* Selection & Odds Strip */}
              <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 space-y-2">
                <div className="text-xs text-slate-400">Marché Arbitré & Sélection Haute Valeur :</div>
                <div className="text-base font-semibold text-white flex items-center justify-between">
                  <span>{topProlificMatch.prolificOption.selection}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-slate-400">Cote :</span>
                    <span className="text-xl font-bold text-amber-400 tabular-nums">
                      {topProlificMatch.prolificOption.bookmakerOdds.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 text-slate-400 border-t border-slate-800/60">
                  <span>Cote Juste Algorithmique : <strong className="text-slate-200 tabular-nums">{topProlificMatch.prolificOption.fairOdds.toFixed(2)}</strong></span>
                  <span className="text-emerald-400 font-medium tabular-nums">
                    Probabilité : {Math.round(topProlificMatch.prolificOption.winProbability * 100)}%
                  </span>
                </div>
              </div>

              {/* Rationale */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-300">Analyse de la valeur mathématique :</div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {topProlificMatch.prolificOption.rationale}
                </p>
                <ul className="space-y-1.5 pt-1">
                  {topProlificMatch.prolificOption.keyFactors.map((factor, idx) => (
                    <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                      <ArrowUpRight className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] text-slate-400">Mise Suggérée (1/4 Kelly)</div>
                <div className="text-sm font-bold text-white tabular-nums">
                  {Math.round((bankrollBalance * topProlificMatch.prolificOption.recommendedStakePct) / 100)} €
                  <span className="text-xs text-slate-400 font-normal ml-1">
                    ({topProlificMatch.prolificOption.recommendedStakePct}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectMatch(topProlificMatch)}
                  className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Détail Modèle
                </button>
                <button
                  onClick={() => handleExecute(topProlificMatch, topProlificMatch.prolificOption, 'top-prolific')}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shadow-amber-400/20"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{executedBets['top-prolific'] ? 'Ajouté !' : 'Exploiter l’Edge'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Real Matches Grid */}
      <div className="space-y-4">
        {/* Header & Strategy tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">
                Matchs Réels du Calendrier ({filteredMatches.length} Matchs)
              </h2>
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  disabled={isSyncing}
                  className="p-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                  title="Actualiser les matchs en direct"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Synchronisé en direct depuis les flux officiels de football européen.
            </p>
          </div>

          {/* Strategy filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => setActiveStrategyFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeStrategyFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tous Profils
            </button>
            <button
              onClick={() => setActiveStrategyFilter('safest')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeStrategyFilter === 'safest'
                  ? 'bg-emerald-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Option Sûre
            </button>
            <button
              onClick={() => setActiveStrategyFilter('prolific')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeStrategyFilter === 'prolific'
                  ? 'bg-amber-400 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Option Prolifique
            </button>
          </div>
        </div>

        {/* League and Status Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Leagues */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold shrink-0">Ligue :</span>
            <button
              onClick={() => setActiveLeagueFilter('all')}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                activeLeagueFilter === 'all'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Toutes
            </button>
            {availableLeagues.map(lg => (
              <button
                key={lg}
                onClick={() => setActiveLeagueFilter(lg)}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                  activeLeagueFilter === lg
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {lg}
              </button>
            ))}
          </div>

          {/* Status filter: Live vs All */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold">Statut :</span>
            <button
              onClick={() => setActiveStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                activeStatusFilter === 'all'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setActiveStatusFilter('live')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer flex items-center gap-1 transition-colors ${
                activeStatusFilter === 'live'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'bg-slate-950 text-rose-400 hover:bg-slate-900 border border-slate-800'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
              <span>En Direct ({liveMatchesCount})</span>
            </button>
            <button
              onClick={() => setActiveStatusFilter('upcoming')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                activeStatusFilter === 'upcoming'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              À Venir
            </button>
          </div>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-t border-slate-800/80 pt-3">
          <span className="text-slate-400 font-semibold shrink-0">Calendrier Réel :</span>
          <button
            onClick={() => setActiveDateFilter('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeDateFilter === 'all'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            Tous ({matches.length})
          </button>
          <button
            onClick={() => setActiveDateFilter('today')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeDateFilter === 'today'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            Aujourd&apos;hui ({matches.filter(m => m.date.toLowerCase().includes('aujourd')).length})
          </button>
          <button
            onClick={() => setActiveDateFilter('tomorrow')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeDateFilter === 'tomorrow'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            Demain ({matches.filter(m => m.date.toLowerCase().includes('demain')).length})
          </button>
          <button
            onClick={() => setActiveDateFilter('upcoming')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeDateFilter === 'upcoming'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            Jours Suivants ({matches.filter(m => !m.date.toLowerCase().includes('aujourd') && !m.date.toLowerCase().includes('demain')).length})
          </button>
        </div>

        {/* List of matches with cards */}
        <div className="space-y-3">
          {filteredMatches.length === 0 ? (
            <div className="p-8 text-center text-slate-400 bg-slate-900/60 rounded-xl border border-slate-800">
              Aucun match ne correspond aux filtres sélectionnés.
            </div>
          ) : (
            filteredMatches.map((match) => {
              const showSafest = activeStrategyFilter === 'all' || activeStrategyFilter === 'safest';
              const showProlific = activeStrategyFilter === 'all' || activeStrategyFilter === 'prolific';

              return (
                <div
                  key={match.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Match metadata, teams & score */}
                    <div className="space-y-2 min-w-[280px]">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-medium text-slate-300">{match.league}</span>
                        <span aria-hidden="true">·</span>
                        <span>{match.date} {match.time}</span>
                        {match.isLive && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[10px] flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                              <span>LIVE</span>
                            </span>
                          </>
                        )}
                        {match.status === 'finished' && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold text-[10px]">
                              TERMINÉ
                            </span>
                          </>
                        )}
                      </div>

                      {/* Team names with logos and live scores */}
                      <div className="flex items-center gap-2.5">
                        <TeamBadge badge={match.homeBadge} name={match.homeTeam} size="md" />
                        <span className="text-base font-bold text-white">{match.homeTeam}</span>

                        {match.liveData ? (
                          <span className="font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-sm">
                            {match.liveData.homeScore} - {match.liveData.awayScore}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs font-normal">vs</span>
                        )}

                        <TeamBadge badge={match.awayBadge} name={match.awayTeam} size="md" />
                        <span className="text-base font-bold text-white">{match.awayTeam}</span>
                      </div>

                      <div className="text-xs text-slate-400 tabular-nums">
                        xG projeté : {match.algorithm.poissonExpectedGoals.home.toFixed(2)} - {match.algorithm.poissonExpectedGoals.away.toFixed(2)}
                      </div>
                    </div>

                    {/* Middle / Right: Recommendation pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 max-w-2xl">
                      {showSafest && (
                        <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 flex flex-col justify-between">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <Shield className="w-3 h-3" /> Sûre
                            </span>
                            <span className="text-slate-300 font-bold tabular-nums">
                              {Math.round(match.safestOption.winProbability * 100)}% probabilité
                            </span>
                          </div>
                          <div className="text-xs text-white font-medium truncate" title={match.safestOption.selection}>
                            {match.safestOption.selection}
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-xs">
                            <span className="text-slate-400">Cote : <strong className="text-white">{match.safestOption.bookmakerOdds.toFixed(2)}</strong></span>
                            <button
                              onClick={() => handleExecute(match, match.safestOption, `safe-${match.id}`)}
                              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
                            >
                              {executedBets[`safe-${match.id}`] ? '✓ Ajouté' : 'Miser ' + Math.round((bankrollBalance * match.safestOption.recommendedStakePct) / 100) + ' €'}
                            </button>
                          </div>
                        </div>
                      )}

                      {showProlific && (
                        <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 flex flex-col justify-between">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-amber-400 font-semibold flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" /> Prolifique
                            </span>
                            <span className="text-amber-400 font-bold tabular-nums">
                              +{match.prolificOption.expectedValue.toFixed(1)}% EV+
                            </span>
                          </div>
                          <div className="text-xs text-white font-medium truncate" title={match.prolificOption.selection}>
                            {match.prolificOption.selection}
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-xs">
                            <span className="text-slate-400">Cote : <strong className="text-white">{match.prolificOption.bookmakerOdds.toFixed(2)}</strong></span>
                            <button
                              onClick={() => handleExecute(match, match.prolificOption, `prolific-${match.id}`)}
                              className="text-xs text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
                            >
                              {executedBets[`prolific-${match.id}`] ? '✓ Ajouté' : 'Miser ' + Math.round((bankrollBalance * match.prolificOption.recommendedStakePct) / 100) + ' €'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Far right: Inspect match details */}
                    <div className="flex lg:flex-col items-center justify-end gap-2 shrink-0">
                      <button
                        onClick={() => onSelectMatch(match)}
                        className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        <span>Détail Modèle</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
