import React, { useState, useEffect } from 'react';
import { Match, MarketOption } from '../types';
import { Play, Pause, RefreshCw, Zap, Bell, AlertTriangle, Shield, TrendingUp, Radio } from 'lucide-react';
import { TeamBadge } from './TeamBadge';

interface LiveMatchTrackerProps {
  matches: Match[];
  onExecuteBet: (match: Match, option: MarketOption) => void;
  bankrollBalance: number;
}

export const LiveMatchTracker: React.FC<LiveMatchTrackerProps> = ({
  matches,
  onExecuteBet,
  bankrollBalance,
}) => {
  // Find first live match or pick first match in list
  const defaultLiveMatch = matches.find(m => m.isLive) || matches[0];
  const [selectedMatch, setSelectedMatch] = useState<Match>(defaultLiveMatch);

  // Live match state
  const [isPlaying, setIsPlaying] = useState(true);
  const [minute, setMinute] = useState(selectedMatch.liveData?.minute || 38);
  const [homeScore, setHomeScore] = useState(selectedMatch.liveData?.homeScore ?? 1);
  const [awayScore, setAwayScore] = useState(selectedMatch.liveData?.awayScore ?? 0);
  const [homeXg, setHomeXg] = useState(selectedMatch.liveData?.homeXg ?? 1.45);
  const [awayXg, setAwayXg] = useState(selectedMatch.liveData?.awayXg ?? 0.40);
  const [homeMomentum, setHomeMomentum] = useState(65);
  const [liveEventLog, setLiveEventLog] = useState<Array<{ id: string; time: string; text: string; type: string }>>([
    { id: '1', time: `${selectedMatch.liveData?.minute || 38}'`, text: `Pression continue de ${selectedMatch.homeTeam} sur le flanc droit`, type: 'shot' },
    { id: '2', time: '28\'', text: `Tentative cadrée pour ${selectedMatch.homeTeam}, arrêt du gardien`, type: 'chance' },
    { id: '3', time: '18\'', text: `Signal StratX : Détection de surpression offensive xG`, type: 'signal' },
  ]);

  const [inPlayOdds, setInPlayOdds] = useState({
    nextGoalHome: 1.85,
    nextGoalAway: 3.20,
    over25: 1.55,
    homeWin: 1.65,
  });

  const [executedLive, setExecutedLive] = useState(false);

  // Update states when user selects a different match
  const handleSelectMatch = (m: Match) => {
    setSelectedMatch(m);
    setMinute(m.liveData?.minute || (m.isLive ? 35 : 0));
    setHomeScore(m.liveData?.homeScore ?? (m.isLive ? 1 : 0));
    setAwayScore(m.liveData?.awayScore ?? 0);
    setHomeXg(m.liveData?.homeXg ?? 1.25);
    setAwayXg(m.liveData?.awayXg ?? 0.50);
    setHomeMomentum(m.liveData?.possession ? m.liveData.possession[0] : 60);
    setLiveEventLog([
      { id: '1', time: `${m.liveData?.minute || 35}'`, text: `Prise de contrôle du jeu par ${m.homeTeam}`, type: 'shot' },
      { id: '2', time: '20\'', text: `Attaque rapide menée par ${m.awayTeam}`, type: 'chance' },
      { id: '3', time: '12\'', text: `Signal StratX : Analyse stochastique en direct active`, type: 'signal' },
    ]);
  };

  // Live minute ticker
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && minute < 90) {
      timer = setInterval(() => {
        setMinute(prev => {
          const next = prev + 1;
          if (Math.random() > 0.65) {
            setHomeXg(x => +(x + 0.05).toFixed(2));
          }
          return next;
        });
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, minute]);

  // Simulation controls
  const handleTriggerGoal = (team: 'home' | 'away') => {
    if (team === 'home') {
      setHomeScore(s => s + 1);
      setHomeXg(x => +(x + 0.65).toFixed(2));
      setLiveEventLog(prev => [
        { id: Date.now().toString(), time: `${minute}'`, text: `⚽ BUT pour ${selectedMatch.homeTeam} ! Recalibration algorithmique des cotes.`, type: 'goal' },
        ...prev,
      ]);
      setInPlayOdds({
        nextGoalHome: 2.80,
        nextGoalAway: 2.90,
        over25: 1.15,
        homeWin: 1.30,
      });
    } else {
      setAwayScore(s => s + 1);
      setAwayXg(x => +(x + 0.55).toFixed(2));
      setLiveEventLog(prev => [
        { id: Date.now().toString(), time: `${minute}'`, text: `⚽ BUT pour ${selectedMatch.awayTeam} !`, type: 'goal' },
        ...prev,
      ]);
      setInPlayOdds({
        nextGoalHome: 1.70,
        nextGoalAway: 4.20,
        over25: 1.18,
        homeWin: 3.10,
      });
    }
  };

  const handleDangerousAttack = () => {
    setHomeMomentum(prev => Math.min(95, prev + 12));
    setHomeXg(x => +(x + 0.18).toFixed(2));
    setLiveEventLog(prev => [
      { id: Date.now().toString(), time: `${minute}'`, text: `⚡ Occasion franche pour ${selectedMatch.homeTeam} (Indice de danger xT : 0.88)`, type: 'attack' },
      ...prev,
    ]);
  };

  const handleResetSimulation = () => {
    setMinute(selectedMatch.liveData?.minute || 38);
    setHomeScore(selectedMatch.liveData?.homeScore ?? 1);
    setAwayScore(selectedMatch.liveData?.awayScore ?? 0);
    setHomeXg(selectedMatch.liveData?.homeXg ?? 1.45);
    setAwayXg(selectedMatch.liveData?.awayXg ?? 0.40);
    setHomeMomentum(65);
    setInPlayOdds({
      nextGoalHome: 1.85,
      nextGoalAway: 3.20,
      over25: 1.55,
      homeWin: 1.65,
    });
  };

  // Quick live bet
  const liveBetOption: MarketOption = {
    type: 'most_prolific',
    title: 'Opportunité Live Détectée',
    market: 'Prochain But (In-Play)',
    selection: `Prochain But : ${selectedMatch.homeTeam}`,
    bookmakerOdds: inPlayOdds.nextGoalHome,
    fairOdds: 1.52,
    winProbability: 0.68,
    expectedValue: 25.8,
    recommendedStakePct: 2.5,
    recommendedStakeEuro: 25,
    confidenceScore: 89,
    rationale: `À la ${minute}e minute, le différentiel d'activité offensive (+${(homeXg - awayXg).toFixed(2)} xG) et ${homeMomentum}% de momentum indiquent une forte probabilité de but pour ${selectedMatch.homeTeam}.`,
    keyFactors: [
      `Momentum favorable à ${homeMomentum}%`,
      `xG projeté en hausse constante (+${homeXg.toFixed(2)})`,
      'Retard d’ajustement bookmaker de 22 secondes identifié',
    ],
  };

  const handleExecuteLiveBet = () => {
    onExecuteBet(selectedMatch, liveBetOption);
    setExecutedLive(true);
    setTimeout(() => setExecutedLive(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Selector of Real Matches */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-sm font-bold text-white">Sélectionner un Match Réel en Direct :</span>
          </div>
          <span className="text-xs text-slate-400">
            {matches.filter(m => m.isLive).length} matchs en cours actuellement
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {matches.map(m => {
            const isSelected = m.id === selectedMatch.id;
            return (
              <button
                key={m.id}
                onClick={() => handleSelectMatch(m)}
                className={`px-3 py-2 rounded-xl flex items-center gap-2 shrink-0 border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-500/15 border-rose-500 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                <TeamBadge badge={m.homeBadge} name={m.homeTeam} size="sm" />
                <span>{m.homeTeam}</span>
                {m.liveData ? (
                  <span className="font-mono text-emerald-400 font-bold px-1 py-0.5 rounded bg-slate-900">
                    {m.liveData.homeScore}-{m.liveData.awayScore}
                  </span>
                ) : (
                  <span className="text-slate-500">vs</span>
                )}
                <span>{m.awayTeam}</span>
                <TeamBadge badge={m.awayBadge} name={m.awayTeam} size="sm" />
                {m.isLive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <span className="text-rose-400 font-semibold">RADAR IN-PLAY EN TEMPS RÉEL</span>
            <span aria-hidden="true">·</span>
            <span>Flux de télémétrie stochastique officiel</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Contrôle & Arbitrage des Matchs en Direct
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Surveillance continue du momentum, calcul de la pression xG minute par minute et détection des retards d’ajustement des bookmakers.
          </p>
        </div>

        {/* Live Simulation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Reprendre'}</span>
          </button>
          <button
            onClick={handleResetSimulation}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Réinitialiser l'état initial"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Live Match Arena */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        {/* Match Header with Live Minute & Score */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center justify-center w-16 h-16 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-xs text-rose-500 font-bold uppercase tracking-wider">LIVE</span>
              <span className="text-xl font-bold text-white tabular-nums">{minute}&apos;</span>
            </div>
            <div>
              <div className="text-xs text-slate-400">{selectedMatch.league}</div>
              <div className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <TeamBadge badge={selectedMatch.homeBadge} name={selectedMatch.homeTeam} size="sm" />
                <span>{selectedMatch.homeTeam}</span>
                <span className="text-slate-500 font-normal text-sm">vs</span>
                <TeamBadge badge={selectedMatch.awayBadge} name={selectedMatch.awayTeam} size="sm" />
                <span>{selectedMatch.awayTeam}</span>
              </div>
            </div>
          </div>

          {/* Big Score Board */}
          <div className="flex items-center gap-6 justify-center">
            <div className="text-center flex flex-col items-center">
              <TeamBadge badge={selectedMatch.homeBadge} name={selectedMatch.homeTeam} size="md" className="mb-1" />
              <div className="text-xs text-slate-400 font-medium">{selectedMatch.homeTeam}</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">{homeScore}</div>
              <div className="text-xs text-emerald-400 tabular-nums font-mono">{homeXg.toFixed(2)} xG</div>
            </div>

            <div className="text-2xl font-bold text-slate-600">-</div>

            <div className="text-center flex flex-col items-center">
              <TeamBadge badge={selectedMatch.awayBadge} name={selectedMatch.awayTeam} size="md" className="mb-1" />
              <div className="text-xs text-slate-400 font-medium">{selectedMatch.awayTeam}</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">{awayScore}</div>
              <div className="text-xs text-slate-400 tabular-nums font-mono">{awayXg.toFixed(2)} xG</div>
            </div>
          </div>

          {/* Quick Simulation Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2 justify-end">
            <button
              onClick={() => handleTriggerGoal('home')}
              className="px-2.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-emerald-400 font-medium rounded-lg transition-colors cursor-pointer"
            >
              +1 But {selectedMatch.homeTeam.split(' ')[0]}
            </button>
            <button
              onClick={() => handleTriggerGoal('away')}
              className="px-2.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-colors cursor-pointer"
            >
              +1 But {selectedMatch.awayTeam.split(' ')[0]}
            </button>
            <button
              onClick={handleDangerousAttack}
              className="px-2.5 py-1.5 text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-medium rounded-lg transition-colors cursor-pointer"
            >
              ⚡ Attaque Dangereuse
            </button>
          </div>
        </div>

        {/* Live Momentum Bar & Tactical Gauge */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              Momentum {selectedMatch.homeTeam} ({homeMomentum}%)
            </span>
            <span className="text-slate-400 font-mono">
              Indice de Domination Territoriale
            </span>
            <span className="text-slate-400">
              {selectedMatch.awayTeam} ({100 - homeMomentum}%)
            </span>
          </div>

          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
            <div
              className="bg-emerald-500 transition-all duration-500"
              style={{ width: `${homeMomentum}%` }}
            />
            <div
              className="bg-slate-700 transition-all duration-500"
              style={{ width: `${100 - homeMomentum}%` }}
            />
          </div>
        </div>

        {/* Live Value Signal Alert Box */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                OPPORTUNITÉ IN-PLAY STRATX DÉTECTÉE ({minute}&apos;)
              </span>
            </div>
            <div className="text-sm font-semibold text-white">
              {liveBetOption.selection} — Cote en direct : <strong className="text-emerald-400 font-mono font-bold">{inPlayOdds.nextGoalHome.toFixed(2)}</strong> (Cote juste : {liveBetOption.fairOdds.toFixed(2)})
            </div>
            <p className="text-xs text-slate-300">
              {liveBetOption.rationale}
            </p>
          </div>

          <button
            onClick={handleExecuteLiveBet}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-sm shadow-emerald-500/20 flex items-center gap-2 cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            <Zap className="w-4 h-4" />
            <span>{executedLive ? '✓ Ordre Enregistré' : 'Parier en Direct (1/4 Kelly)'}</span>
          </button>
        </div>

        {/* Bottom Split: Live In-Play Market Odds vs Event Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* In-Play Market Odds Box */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Cotes In-Play Récalibrées en Direct
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block truncate">Victoire {selectedMatch.homeTeam}</span>
                <span className="text-lg font-mono font-bold text-white block">{inPlayOdds.homeWin.toFixed(2)}</span>
                <span className="text-[10px] text-emerald-400 font-semibold">+14.2% EV</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block truncate">Plus de 2.5 Buts</span>
                <span className="text-lg font-mono font-bold text-white block">{inPlayOdds.over25.toFixed(2)}</span>
                <span className="text-[10px] text-emerald-400 font-semibold">+18.6% EV</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block truncate">Prochain But : {selectedMatch.homeTeam}</span>
                <span className="text-lg font-mono font-bold text-emerald-400 block">{inPlayOdds.nextGoalHome.toFixed(2)}</span>
                <span className="text-[10px] text-emerald-400 font-semibold">+25.8% EV</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block truncate">Prochain But : {selectedMatch.awayTeam}</span>
                <span className="text-lg font-mono font-bold text-white block">{inPlayOdds.nextGoalAway.toFixed(2)}</span>
                <span className="text-[10px] text-slate-500 font-semibold">Neutre</span>
              </div>
            </div>
          </div>

          {/* Real-time Telemetry Event Feed */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Journal des Événements Tactiques & xG
            </h3>
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2 max-h-48 overflow-y-auto">
              {liveEventLog.map(evt => (
                <div key={evt.id} className="flex items-start gap-2.5 text-xs text-slate-300 border-b border-slate-850 pb-2 last:border-0 last:pb-0">
                  <span className="font-mono text-emerald-400 font-bold shrink-0">{evt.time}</span>
                  <span className="flex-1">{evt.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
