export type RiskLevel = 'ultra_safe' | 'safe' | 'balanced' | 'prolific_value';

export interface MarketOption {
  type: 'safest' | 'most_prolific' | 'balanced';
  title: string;
  market: string;
  selection: string;
  bookmakerOdds: number;
  fairOdds: number;
  winProbability: number; // e.g. 0.86 (86%)
  expectedValue: number; // e.g. +14.2%
  recommendedStakePct: number; // Kelly 1/4 fraction, e.g. 3.5%
  recommendedStakeEuro: number;
  confidenceScore: number; // e.g. 96
  rationale: string;
  keyFactors: string[];
}

export interface PoissonMatrixCell {
  homeGoals: number;
  awayGoals: number;
  probability: number;
}

export interface AlgorithmicBreakdown {
  modelName: string;
  poissonExpectedGoals: { home: number; away: number };
  monteCarloSimulationsCount: number;
  monteCarloWinDistribution: { home: number; draw: number; away: number };
  eloHome: number;
  eloAway: number;
  eloDiff: number;
  fatigueIndex: { home: number; away: number }; // 0 to 100
  marketMarginBookmaker: number; // e.g. 5.8% bookmaker juice
  valueEdgeDetected: number; // e.g. +18.4%
  keyShapFactors: {
    feature: string;
    impact: number; // positive or negative impact on home win / goals
    description: string;
  }[];
  poissonMatrix: PoissonMatrixCell[];
}

export interface LiveMomentumPoint {
  minute: number;
  momentum: number; // -100 (away dominance) to +100 (home dominance)
}

export interface LiveMatchData {
  minute: number;
  homeScore: number;
  awayScore: number;
  homeXg: number;
  awayXg: number;
  possession: [number, number]; // [home, away]
  shotsOnTarget: [number, number];
  dangerousAttacks: [number, number];
  momentumHistory: LiveMomentumPoint[];
  liveStatusText: string;
  liveSignalActive?: {
    type: 'prolific_inplay' | 'safe_lock' | 'cashout_optimal';
    message: string;
    targetMarket: string;
    liveOdds: number;
    ev: number;
    urgency: 'high' | 'medium';
  };
}

export interface Match {
  id: string;
  league: string;
  leagueCountry: string;
  homeTeam: string;
  awayTeam: string;
  homeBadge: string;
  awayBadge: string;
  date: string;
  time: string;
  isLive: boolean;
  liveData?: LiveMatchData;
  status: 'upcoming' | 'live' | 'finished';
  bookmakerOdds: {
    homeWin: number;
    draw: number;
    awayWin: number;
    over25: number;
    under25: number;
    bttsYes: number;
    bttsNo: number;
  };
  calculatedProbabilities: {
    homeWin: number;
    draw: number;
    awayWin: number;
    over25: number;
    under25: number;
    bttsYes: number;
    bttsNo: number;
  };
  fairOdds: {
    homeWin: number;
    draw: number;
    awayWin: number;
    over25: number;
    under25: number;
    bttsYes: number;
    bttsNo: number;
  };
  safestOption: MarketOption;
  prolificOption: MarketOption;
  balancedOption: MarketOption;
  algorithm: AlgorithmicBreakdown;
}

export interface HistoricalBet {
  id: string;
  date: string;
  match: string;
  league: string;
  selection: string;
  marketType: string;
  odds: number;
  stake: number;
  returnAmount: number;
  profit: number;
  status: 'won' | 'lost' | 'refunded';
  modelConfidence: number;
  expectedValue: number;
  category: 'safest' | 'prolific' | 'balanced';
  rationaleShort: string;
}

export interface StrategicNotification {
  id: string;
  timestamp: string;
  matchId: string;
  matchTitle: string;
  league: string;
  type: 'value_alert' | 'live_trigger' | 'safe_lock' | 'closing_window';
  title: string;
  message: string;
  recommendedAction: string;
  odds: number;
  evPlus: number;
  winProb: number;
  isRead: boolean;
  stakeKelly: number;
}

export interface NotificationRuleSettings {
  minExpectedValue: number; // e.g. 8%
  minWinProbability: number; // e.g. 70%
  alertOnLiveAnomaly: boolean;
  alertOnClosingLineDrift: boolean;
  alertOnCashoutSurge: boolean;
  soundEnabled: boolean;
  favoriteLeagues: string[];
}

export interface UserBankroll {
  totalBalance: number;
  startingBalance: number;
  currency: string;
  kellyFraction: number; // 0.25 (Quarter Kelly)
  maxStakePercent: number; // 5%
  stopLossDay: number; // e.g. 100€
  totalBetsPlaced: number;
  totalWon: number;
  totalLost: number;
  netProfit: number;
  currentRoi: number;
}
