import React, { useState } from 'react';
import { Calculator, ShieldCheck, Database, Cpu, PieChart, Layers, HelpCircle, CheckCircle } from 'lucide-react';

export const AlgorithmTransparency: React.FC = () => {
  // Interactive Poisson Calculator
  const [lambdaHome, setLambdaHome] = useState<number>(2.15);
  const [muAway, setMuAway] = useState<number>(1.05);

  // Helper to compute Poisson probability: P(k) = (lambda^k * e^-lambda) / k!
  const factorial = (n: number): number => {
    if (n <= 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };

  const poisson = (k: number, mean: number): number => {
    return (Math.pow(mean, k) * Math.exp(-mean)) / factorial(k);
  };

  // Compute 4x4 matrix
  const matrix: number[][] = [];
  let homeWinProb = 0;
  let drawProb = 0;
  let awayWinProb = 0;
  let over25Prob = 0;
  let bttsProb = 0;

  for (let h = 0; h <= 4; h++) {
    matrix[h] = [];
    for (let a = 0; a <= 4; a++) {
      const p = poisson(h, lambdaHome) * poisson(a, muAway);
      matrix[h][a] = p;
      if (h > a) homeWinProb += p;
      else if (h === a) drawProb += p;
      else awayWinProb += p;

      if (h + a > 2.5) over25Prob += p;
      if (h > 0 && a > 0) bttsProb += p;
    }
  }

  // Compute fair odds
  const fairOddsHome = homeWinProb > 0 ? (1 / homeWinProb).toFixed(2) : '0';
  const fairOddsDraw = drawProb > 0 ? (1 / drawProb).toFixed(2) : '0';
  const fairOddsAway = awayWinProb > 0 ? (1 / awayWinProb).toFixed(2) : '0';

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 font-semibold">BOÎTE BLANCHE (WHITE-BOX ARCHITECTURE)</span>
          <span aria-hidden="true">·</span>
          <span>Transparence Mathématique Intégrale</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Les 5 Algorithmes Prédictifs Fondamentaux de StratX
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
          Contrairement aux systèmes opaques ou aux &laquo; pronostics intuitifs &raquo;, StratX repose exclusivement sur des théorèmes statistiques vérifiables, des régressions bivariées et des lois de distribution validées par la recherche académique en science des données.
        </p>
      </div>

      {/* The 5 Algorithms Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Model 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h2 className="text-base font-bold text-white">Modèle Bivarié Dixon-Coles</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Étend la loi de Poisson standard en corrigeant la corrélation négative observée sur les scores faibles (0-0, 1-0, 0-1, 1-1). Ajuste la puissance offensive $\alpha$ et la vulnérabilité défensive $\beta$ selon le terrain.
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px] text-emerald-400 tabular-nums">
            {"P(X=x, Y=y) = τ(x,y) · e^(-λ)λ^x/x! · e^(-μ)μ^y/y!"}
          </div>
        </div>

        {/* Model 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h2 className="text-base font-bold text-white">Indice Élo Dynamique & Fatigue</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Mesure la force intrinsèque d’une équipe mise à jour à chaque match. Intègre une pénalité exponentielle de fatigue circadienne basée sur les minutes de jeu accumulées sur 7 jours et le kilométrage de déplacement.
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px] text-emerald-400 tabular-nums">
            {"R' = R + K · (S - E(S)) - λ_fatigue · e^(Δh / 48)"}
          </div>
        </div>

        {/* Model 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h2 className="text-base font-bold text-white">Simulations Monte Carlo (10k)</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Chaque rencontre est simulée 10 000 fois de manière stochastique à partir des distributions xG. Cela permet de calculer la probabilité exacte d’événements rares et d’isoler la variance mathématique.
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px] text-emerald-400 tabular-nums">
            {"P_event ≈ (1 / N) · Σ I(Event_i occurs), N = 10 000"}
          </div>
        </div>

        {/* Model 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h2 className="text-base font-bold text-white">Arbitrage EV+ & Kelly Fractionné</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Identifie l’écart entre la cote bookmaker $C$ et la probabilité réelle $p$. Si $p \times C &gt; 1$, l’espérance est positive (Value Bet). La mise est calibrée au 1/4 de Kelly pour éliminer tout risque de ruine.
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px] text-emerald-400 tabular-nums">
            {"f* = [ (p · (C - 1) - (1 - p)) / (C - 1) ] · 0.25"}
          </div>
        </div>

        {/* Model 5 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
              05
            </div>
            <h2 className="text-base font-bold text-white">Explicabilité SHAP & Facteurs Clés</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Aucune décision &laquo; boîte noire &raquo;. Les valeurs de Shapley pondèrent l’impact individuel de chaque variable (absence d’un défenseur central titulaire, météo pluvieuse, taux de pressing haut PPDa).
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px] text-emerald-400 tabular-nums">
            {"φ_i = Σ [ |S|!(|F|-|S|-1)! / |F|! ] · [ f(S ∪ {i}) - f(S) ]"}
          </div>
        </div>

        {/* Responsible Gaming Pillar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
              06
            </div>
            <h2 className="text-base font-bold text-white">Discipline Stochastique & Variance</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dans le monde probabiliste, &laquo; infaillible &raquo; signifie que sur une série de 1 000 paris à espérance positive (+EV), le gain mathématique est garanti par la Loi des Grands Nombres, sans jamais surexposer le capital.
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px] text-emerald-400 tabular-nums">
            {"lim_{n→∞} P(|(1/n)ΣX_i - μ| < ε) = 1"}
          </div>
        </div>
      </div>

      {/* Interactive Poisson Simulator Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>SIMULATEUR DE MATRICE POISSON EN DIRECT</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              Testez Vous-Même la Génération Probabiliste de Score
            </h2>
            <p className="text-xs text-slate-300">
              Ajustez les xG attendus pour voir instantanément comment la matrice des scores et les cotes justes sont recalculées.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="space-y-1">
              <label htmlFor="lambda-home-input" className="text-[11px] text-slate-400 block">xG Domicile (λ)</label>
              <input
                id="lambda-home-input"
                type="number"
                step="0.05"
                min="0.2"
                max="4.0"
                value={lambdaHome}
                onChange={(e) => setLambdaHome(parseFloat(e.target.value) || 1.0)}
                className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono font-bold text-emerald-400 tabular-nums"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="mu-away-input" className="text-[11px] text-slate-400 block">xG Extérieur (μ)</label>
              <input
                id="mu-away-input"
                type="number"
                step="0.05"
                min="0.2"
                max="4.0"
                value={muAway}
                onChange={(e) => setMuAway(parseFloat(e.target.value) || 1.0)}
                className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono font-bold text-amber-400 tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Calculated Results Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Victoire Domicile (1)</div>
            <div className="text-lg font-bold text-white tabular-nums">
              {(homeWinProb * 100).toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-400">Cote Juste : <strong className="text-emerald-400">{fairOddsHome}</strong></div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Match Nul (N)</div>
            <div className="text-lg font-bold text-white tabular-nums">
              {(drawProb * 100).toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-400">Cote Juste : <strong className="text-slate-300">{fairOddsDraw}</strong></div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Victoire Extérieur (2)</div>
            <div className="text-lg font-bold text-white tabular-nums">
              {(awayWinProb * 100).toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-400">Cote Juste : <strong className="text-amber-400">{fairOddsAway}</strong></div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Plus de 2.5 Buts</div>
            <div className="text-lg font-bold text-white tabular-nums">
              {(over25Prob * 100).toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-400">Cote Juste : <strong className="text-emerald-400">{(1 / over25Prob).toFixed(2)}</strong></div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Les 2 Marquent (BTTS)</div>
            <div className="text-lg font-bold text-white tabular-nums">
              {(bttsProb * 100).toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-400">Cote Juste : <strong className="text-emerald-400">{(1 / bttsProb).toFixed(2)}</strong></div>
          </div>
        </div>

        {/* 4x4 Score Probability Matrix Table */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-300">
            Matrice des Probabilités de Score Exact (Domicile vs Extérieur)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="p-2 text-center bg-slate-950/50">Dom \ Ext</th>
                  <th className="p-2 text-center">0 but</th>
                  <th className="p-2 text-center">1 but</th>
                  <th className="p-2 text-center">2 buts</th>
                  <th className="p-2 text-center">3 buts</th>
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2, 3].map((homeG) => (
                  <tr key={homeG} className="border-b border-slate-800/50">
                    <td className="p-2 text-center font-bold text-slate-300 bg-slate-950/50">
                      {homeG} {homeG > 1 ? 'buts' : 'but'}
                    </td>
                    {[0, 1, 2, 3].map((awayG) => {
                      const prob = matrix[homeG]?.[awayG] || 0;
                      const pct = (prob * 100).toFixed(1);
                      const isHigh = prob > 0.12;
                      return (
                        <td
                          key={awayG}
                          className={`p-2.5 text-center font-mono tabular-nums ${
                            isHigh
                              ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30'
                              : 'text-slate-300'
                          }`}
                        >
                          <div>{homeG} - {awayG}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{pct}%</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
