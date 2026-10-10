import React, { useState } from 'react';
import { Match, MarketOption } from '../types';
import { Search, Filter, Shield, TrendingUp, ChevronRight, Zap } from 'lucide-react';
import { TeamBadge } from './TeamBadge';

interface MatchArbitrageListProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
  onExecuteBet: (match: Match, option: MarketOption) => void;
}

export const MatchArbitrageList: React.FC<MatchArbitrageListProps> = ({
  matches,
  onSelectMatch,
  onExecuteBet,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<'all' | 'today' | 'tomorrow' | 'upcoming'>('all');
  const [selectedMarketTab, setSelectedMarketTab] = useState<'all' | '1n2' | 'over_under' | 'btts'>('all');

  // Filter matches
  const leagues = Array.from(new Set(matches.map(m => m.league)));

  const filteredMatches = matches.filter(m => {
    const matchesSearch =
      m.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.league.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLeague = selectedLeague === 'all' || m.league === selectedLeague;
    const matchesDate =
      selectedDate === 'all' ||
      (selectedDate === 'today' && m.date.toLowerCase().includes('aujourd')) ||
      (selectedDate === 'tomorrow' && m.date.toLowerCase().includes('demain')) ||
      (selectedDate === 'upcoming' && !m.date.toLowerCase().includes('aujourd') && !m.date.toLowerCase().includes('demain'));
    return matchesSearch && matchesLeague && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Search / Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Grille d&apos;Arbitrage & Détection de Value Bets
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Comparaison en temps réel entre les cotes bookmakers et les probabilités justes calculées par Dixon-Coles & Poisson.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher équipe ou ligue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* League Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold shrink-0">Compétitions :</span>
          <button
            onClick={() => setSelectedLeague('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedLeague === 'all'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            Toutes ({matches.length})
          </button>
          {leagues.map(league => (
            <button
              key={league}
              onClick={() => setSelectedLeague(league)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedLeague === league
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {league}
            </button>
          ))}
        </div>

        {/* Date Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-t border-slate-800/80 pt-3">
          <span className="text-slate-400 font-semibold shrink-0">Calendrier :</span>
          <button
            onClick={() => setSelectedDate('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedDate === 'all'
                ? 'bg-slate-800 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tous les Matchs
          </button>
          <button
            onClick={() => setSelectedDate('today')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedDate === 'today'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Aujourd&apos;hui (10 Oct)
          </button>
          <button
            onClick={() => setSelectedDate('tomorrow')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedDate === 'tomorrow'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Demain (11 Oct)
          </button>
          <button
            onClick={() => setSelectedDate('upcoming')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedDate === 'upcoming'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Jours Suivants (12-14 Oct)
          </button>
        </div>
      </div>

      {/* Matches Grid / Table */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-400">
            Aucun match trouvé pour votre recherche.
          </div>
        ) : (
          filteredMatches.map(match => {
            // Market comparisons
            const homeWinEv = (match.calculatedProbabilities.homeWin * match.bookmakerOdds.homeWin - 1) * 100;
            const drawEv = (match.calculatedProbabilities.draw * match.bookmakerOdds.draw - 1) * 100;
            const awayWinEv = (match.calculatedProbabilities.awayWin * match.bookmakerOdds.awayWin - 1) * 100;

            return (
              <div
                key={match.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors space-y-4"
              >
                {/* Top Row: League & Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">{match.league}</span>
                    <span aria-hidden="true">·</span>
                    <span>{match.date} à {match.time}</span>
                    {match.isLive && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-rose-400 font-bold">EN DIRECT ({match.liveData?.minute}&apos;)</span>
                      </>
                    )}
                  </div>

                  <div className="text-xs text-slate-400">
                    Marge Bookmaker : <strong className="text-slate-300 tabular-nums">{match.algorithm.marketMarginBookmaker}%</strong>
                  </div>
                </div>

                {/* Middle Row: Teams & Score / Elo */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <TeamBadge badge={match.homeBadge} name={match.homeTeam} size="md" />
                      <span className="text-base sm:text-lg font-extrabold text-white">{match.homeTeam}</span>
                      {match.liveData ? (
                        <span className="font-mono font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-sm">
                          {match.liveData.homeScore} - {match.liveData.awayScore}
                        </span>
                      ) : (
                        <span className="text-slate-500 font-normal text-sm">vs</span>
                      )}
                      <TeamBadge badge={match.awayBadge} name={match.awayTeam} size="md" />
                      <span className="text-base sm:text-lg font-extrabold text-white">{match.awayTeam}</span>
                    </div>
                    <div className="text-xs text-slate-400 tabular-nums flex items-center gap-3">
                      <span>xG Estimé : {match.algorithm.poissonExpectedGoals.home.toFixed(2)} - {match.algorithm.poissonExpectedGoals.away.toFixed(2)}</span>
                      <span aria-hidden="true">·</span>
                      <span>Élo Diff : +{match.algorithm.eloDiff} pts</span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onExecuteBet(match, match.safestOption)}
                      className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Option Sûre ({match.safestOption.bookmakerOdds.toFixed(2)})</span>
                    </button>
                    <button
                      onClick={() => onExecuteBet(match, match.prolificOption)}
                      className="px-3 py-1.5 bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Prolifique ({match.prolificOption.bookmakerOdds.toFixed(2)})</span>
                    </button>
                    <button
                      onClick={() => onSelectMatch(match)}
                      className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                      title="Inspecter le modèle complet"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 1N2 Odds Comparison Strip */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-xs">
                  {/* Home Win */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>1 ({match.homeTeam.split(' ')[0]})</span>
                      <span className="font-mono text-white font-bold">{match.bookmakerOdds.homeWin.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Cote Juste : {match.fairOdds.homeWin.toFixed(2)}</span>
                      <span className={`font-mono font-semibold ${homeWinEv > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {homeWinEv > 0 ? `+${homeWinEv.toFixed(1)}%` : `${homeWinEv.toFixed(1)}%`}
                      </span>
                    </div>
                  </div>

                  {/* Draw */}
                  <div className="space-y-1 border-x border-slate-800 px-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>N (Nul)</span>
                      <span className="font-mono text-white font-bold">{match.bookmakerOdds.draw.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Cote Juste : {match.fairOdds.draw.toFixed(2)}</span>
                      <span className={`font-mono font-semibold ${drawEv > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {drawEv > 0 ? `+${drawEv.toFixed(1)}%` : `${drawEv.toFixed(1)}%`}
                      </span>
                    </div>
                  </div>

                  {/* Away Win */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>2 ({match.awayTeam.split(' ')[0]})</span>
                      <span className="font-mono text-white font-bold">{match.bookmakerOdds.awayWin.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Cote Juste : {match.fairOdds.awayWin.toFixed(2)}</span>
                      <span className={`font-mono font-semibold ${awayWinEv > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {awayWinEv > 0 ? `+${awayWinEv.toFixed(1)}%` : `${awayWinEv.toFixed(1)}%`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
