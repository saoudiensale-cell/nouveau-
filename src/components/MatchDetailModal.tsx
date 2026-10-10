import React from 'react';
import { Match, MarketOption } from '../types';
import { X, Shield, TrendingUp, Cpu, Database, CheckCircle, Zap } from 'lucide-react';
import { TeamBadge } from './TeamBadge';

interface MatchDetailModalProps {
  match: Match | null;
  onClose: () => void;
  onExecuteBet: (match: Match, option: MarketOption) => void;
  onSendToSimulator: (match: Match, strategy: 'safest' | 'prolific' | 'balanced') => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  onClose,
  onExecuteBet,
  onSendToSimulator,
}) => {
  if (!match) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">{match.league}</span>
              <span aria-hidden="true">·</span>
              <span>{match.date} {match.time}</span>
              {match.isLive && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[10px]">
                    EN DIRECT
                  </span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">Modèle : {match.algorithm.modelName}</span>
            </div>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <TeamBadge badge={match.homeBadge} name={match.homeTeam} size="lg" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {match.homeTeam}
              </h2>
              {match.liveData ? (
                <span className="font-mono font-extrabold text-emerald-400 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-lg">
                  {match.liveData.homeScore} - {match.liveData.awayScore}
                </span>
              ) : (
                <span className="text-slate-500 text-sm font-normal">vs</span>
              )}
              <TeamBadge badge={match.awayBadge} name={match.awayTeam} size="lg" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {match.awayTeam}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dual Recommendation Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sûre */}
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Shield className="w-4 h-4" /> OPTION LA PLUS SÛRE
              </span>
              <span className="text-sm font-bold text-emerald-400 tabular-nums">
                {Math.round(match.safestOption.winProbability * 100)}% probabilité
              </span>
            </div>
            <div className="text-sm font-bold text-white">
              {match.safestOption.selection}
            </div>
            <div className="text-xs text-slate-400">
              Cote bookmaker : <strong className="text-white tabular-nums">{match.safestOption.bookmakerOdds.toFixed(2)}</strong> (Cote juste : {match.safestOption.fairOdds.toFixed(2)})
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {match.safestOption.rationale}
            </p>
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  onSendToSimulator(match, 'safest');
                  onClose();
                }}
                className="w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Tester dans le Simulateur
              </button>
            </div>
          </div>

          {/* Prolifique */}
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> OPTION LA PLUS PROLIFIQUE
              </span>
              <span className="text-sm font-bold text-amber-400 tabular-nums">
                +{match.prolificOption.expectedValue.toFixed(1)}% EV+
              </span>
            </div>
            <div className="text-sm font-bold text-white">
              {match.prolificOption.selection}
            </div>
            <div className="text-xs text-slate-400">
              Cote bookmaker : <strong className="text-white tabular-nums">{match.prolificOption.bookmakerOdds.toFixed(2)}</strong> (Cote juste : {match.prolificOption.fairOdds.toFixed(2)})
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {match.prolificOption.rationale}
            </p>
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  onSendToSimulator(match, 'prolific');
                  onClose();
                }}
                className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Tester dans le Simulateur
              </button>
            </div>
          </div>
        </div>

        {/* Tactical Parameters Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400">xG Attendu Poisson</div>
            <div className="text-base font-bold text-white tabular-nums mt-0.5">
              {match.algorithm.poissonExpectedGoals.home.toFixed(2)} — {match.algorithm.poissonExpectedGoals.away.toFixed(2)}
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400">Classement Élo Dynamique</div>
            <div className="text-base font-bold text-white tabular-nums mt-0.5">
              {match.algorithm.eloHome} vs {match.algorithm.eloAway} (+{match.algorithm.eloDiff})
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400">Indice de Fatigue (0-100)</div>
            <div className="text-base font-bold text-white tabular-nums mt-0.5">
              {match.algorithm.fatigueIndex.home}% vs {match.algorithm.fatigueIndex.away}%
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400">Marge Bookmaker</div>
            <div className="text-base font-bold text-white tabular-nums mt-0.5">
              {match.algorithm.marketMarginBookmaker}%
            </div>
          </div>
        </div>

        {/* SHAP Feature Explanations */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Pondération des Facteurs Algorithmiques (SHAP Analysis)</span>
          </h3>
          <div className="space-y-2">
            {match.algorithm.keyShapFactors.map((factor, idx) => (
              <div
                key={idx}
                className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex items-start justify-between gap-4 text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{factor.feature}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{factor.description}</div>
                </div>
                <span
                  className={`font-mono font-bold tabular-nums shrink-0 ${
                    factor.impact > 0 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {factor.impact > 0 ? `+${factor.impact.toFixed(2)}` : factor.impact.toFixed(2)} impact xG
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Close footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Fermer l&apos;Analyse
          </button>
        </div>
      </div>
    </div>
  );
};
