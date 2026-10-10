import React, { useState } from 'react';
import {
  PERFORMANCE_METRICS,
  LEAGUE_STATS,
  CATEGORY_STATS,
  BANKROLL_HISTORY,
  RECENT_HISTORICAL_BETS,
} from '../data/historicalBets';
import { TrendingUp, Award, BarChart3, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

export const AnalyticsBacktest: React.FC = () => {
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<'all' | 'safest' | 'prolific'>('all');

  const filteredHistory = RECENT_HISTORICAL_BETS.filter(bet => {
    if (selectedFilterCategory === 'all') return true;
    return bet.category === selectedFilterCategory;
  });

  // Calculate SVG curve coordinates for 15 data points
  const points = BANKROLL_HISTORY;
  const maxVal = 3600;
  const minVal = 700;
  const svgWidth = 800;
  const svgHeight = 220;

  const getCoord = (val: number, idx: number) => {
    const x = (idx / (points.length - 1)) * (svgWidth - 60) + 30;
    const y = svgHeight - 30 - ((val - minVal) / (maxVal - minVal)) * (svgHeight - 60);
    return { x, y };
  };

  const stratXCoords = points.map((p, i) => getCoord(p.balance, i));
  const marketCoords = points.map((p, i) => getCoord(p.marketBaseline, i));
  const randomCoords = points.map((p, i) => getCoord(p.randomBaseline, i));

  const toPath = (coords: Array<{ x: number; y: number }>) =>
    coords.reduce((acc, curr, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${curr.x.toFixed(1)},${curr.y.toFixed(1)}`, '');

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 font-semibold">AUDIT MATHÉMATIQUE INDÉPENDANT</span>
          <span aria-hidden="true">·</span>
          <span>842 Pronostics Passés au Crible</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Performances Historiques & Backtesting Vérifié
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-4xl leading-relaxed">
          Toutes les recommandations sont soumises à une vérification post-match systématique. Visualisez ci-dessous l&apos;évolution du capital, la résistance aux drawdowns et le rendement par championnat.
        </p>
      </div>

      {/* Main KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] text-slate-400">Total Pronostics</div>
          <div className="text-2xl font-bold text-white tabular-nums mt-0.5">
            {PERFORMANCE_METRICS.totalBets}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 tabular-nums">
            {PERFORMANCE_METRICS.wonBets} gagnés (78.4%)
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] text-slate-400">ROI / Yield Net</div>
          <div className="text-2xl font-bold text-emerald-400 tabular-nums mt-0.5">
            +{PERFORMANCE_METRICS.overallRoi}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Sur mise cumulée
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] text-slate-400">Capital Développé</div>
          <div className="text-2xl font-bold text-white tabular-nums mt-0.5">
            {PERFORMANCE_METRICS.currentCapital.toLocaleString('fr-FR')} €
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 tabular-nums">
            +{(PERFORMANCE_METRICS.netProfit).toLocaleString('fr-FR')} € (+248%)
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] text-slate-400">Max Drawdown</div>
          <div className="text-2xl font-bold text-slate-300 tabular-nums mt-0.5">
            {PERFORMANCE_METRICS.maxDrawdown}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Volatilité contenue
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] text-slate-400">Ratio de Sharpe</div>
          <div className="text-2xl font-bold text-white tabular-nums mt-0.5">
            {PERFORMANCE_METRICS.sharpeRatio}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">
            Excellence financière (&gt; 2.5)
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] text-slate-400">Cote Moyenne</div>
          <div className="text-2xl font-bold text-white tabular-nums mt-0.5">
            {PERFORMANCE_METRICS.averageOdds.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Équilibre optimal
          </div>
        </div>
      </div>

      {/* SVG Interactive Bankroll Growth Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Courbe d&apos;Évolution du Capital (Base 1 000 €)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparaison entre la stratégie algorithmique StratX et les stratégies conventionnelles.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-400 inline-block" />
              <span className="text-white font-medium">StratX Algorithmique (+248%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-500 inline-block" />
              <span className="text-slate-400">Marché Flat (+11%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-rose-500 inline-block" />
              <span className="text-rose-400">Aléatoire / Sans Modèle (-21%)</span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="w-full bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 overflow-x-auto">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[600px]">
            {/* Grid Lines */}
            {[1000, 2000, 3000].map((val) => {
              const y = getCoord(val, 0).y;
              return (
                <g key={val}>
                  <line x1="30" y1={y} x2={svgWidth - 30} y2={y} stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
                  <text x="5" y={y + 4} fill="#64748b" fontSize="10" fontFamily="monospace">
                    {val}€
                  </text>
                </g>
              );
            })}

            {/* Random curve */}
            <path d={toPath(randomCoords)} fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />

            {/* Market curve */}
            <path d={toPath(marketCoords)} fill="none" stroke="#64748b" strokeWidth="1.5" />

            {/* StratX curve */}
            <path d={toPath(stratXCoords)} fill="none" stroke="#10b981" strokeWidth="2.5" />

            {/* StratX Dots */}
            {stratXCoords.map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y} r="3" fill="#10b981" />
            ))}

            {/* X-axis labels */}
            {points.map((p, i) => {
              if (i % 2 !== 0 && i !== points.length - 1) return null;
              const pt = getCoord(1000, i);
              return (
                <text key={i} x={pt.x} y={svgHeight - 8} fill="#94a3b8" fontSize="10" textAnchor="middle">
                  {p.date}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Breakdown by League & Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance by League */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Rendement par Championnat</span>
          </h2>

          <div className="space-y-3">
            {LEAGUE_STATS.map((item) => (
              <div key={item.league} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">{item.league}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 tabular-nums font-mono">{item.bets} matchs</span>
                    <span className="text-slate-200 tabular-nums font-mono">{item.winRate}% réussite</span>
                    <span className="text-emerald-400 font-bold tabular-nums font-mono">+{item.roi}% ROI</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-emerald-500 h-full" style={{ width: `${item.winRate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance by Strategy Profile */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Rendement par Profil d&apos;Option</span>
          </h2>

          <div className="space-y-4">
            {CATEGORY_STATS.map((cat) => (
              <div key={cat.category} className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-xs">{cat.category}</span>
                  <span className="text-xs text-emerald-400 font-bold tabular-nums font-mono">
                    +{cat.roi}% ROI Net
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Volume : <strong className="text-slate-200 tabular-nums">{cat.bets}</strong> paris</span>
                  <span>Taux de Réussite : <strong className="text-slate-200 tabular-nums">{cat.winRate}%</strong></span>
                  <span>Cote Moyenne : <strong className="text-slate-200 tabular-nums">{cat.avgOdds.toFixed(2)}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verified Bets Audit List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">
              Historique des Pronostics Vérifiés Référencés
            </h2>
            <p className="text-xs text-slate-400">
              Audit horodaté avec explication rétrospective du modèle.
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              onClick={() => setSelectedFilterCategory('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedFilterCategory === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setSelectedFilterCategory('safest')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedFilterCategory === 'safest' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Option la Plus Sûre
            </button>
            <button
              onClick={() => setSelectedFilterCategory('prolific')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedFilterCategory === 'prolific' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Option la Plus Prolifique
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Match</th>
                <th className="py-3 px-3">Sélection & Marché</th>
                <th className="py-3 px-3 text-right">Cote</th>
                <th className="py-3 px-3 text-right">Mise</th>
                <th className="py-3 px-3 text-center">Statut</th>
                <th className="py-3 px-3 text-right">Profit Net</th>
                <th className="py-3 px-3">Analyse du Modèle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredHistory.map((bet) => (
                <tr key={bet.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{bet.date}</td>
                  <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                    {bet.match}
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
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    {bet.status === 'won' ? (
                      <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Gagné
                      </span>
                    ) : (
                      <span className="text-rose-400 font-semibold flex items-center justify-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Perdu
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold tabular-nums whitespace-nowrap">
                    {bet.status === 'won' ? (
                      <span className="text-emerald-400">+{bet.profit.toFixed(2)} €</span>
                    ) : (
                      <span className="text-rose-400">-{bet.stake.toFixed(2)} €</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px] max-w-xs leading-snug">
                    {bet.rationaleShort}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
