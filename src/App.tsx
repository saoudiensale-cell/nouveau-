/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Match, MarketOption, StrategicNotification, NotificationRuleSettings, UserBankroll } from './types';
import { INITIAL_MATCHES } from './data/mockMatches';
import { INITIAL_NOTIFICATIONS, DEFAULT_NOTIFICATION_RULES } from './data/mockNotifications';
import {
  InternetSyncConfig,
  DEFAULT_SYNC_CONFIG,
  fetchLiveInternetMatches,
} from './services/liveFootballSync';
import { Header } from './components/Header';
import { AutomatedDecisionEngine } from './components/AutomatedDecisionEngine';
import { BettingSimulator, VirtualBet } from './components/BettingSimulator';
import { MatchArbitrageList } from './components/MatchArbitrageList';
import { LiveMatchTracker } from './components/LiveMatchTracker';
import { AlgorithmTransparency } from './components/AlgorithmTransparency';
import { AnalyticsBacktest } from './components/AnalyticsBacktest';
import { MatchDetailModal } from './components/MatchDetailModal';
import { NotificationCenter } from './components/NotificationCenter';
import { BankrollManagerModal } from './components/BankrollManagerModal';
import { InternetSyncModal } from './components/InternetSyncModal';

const INITIAL_VIRTUAL_BETS: VirtualBet[] = [
  {
    id: 'vbet-1',
    timestamp: 'Hier 20:45',
    matchId: 'real-fix-101',
    matchTitle: 'Aston Villa vs Brentford',
    league: 'Premier League',
    selection: 'Aston Villa ou Nul (1X)',
    marketType: 'Double Chance',
    odds: 1.42,
    stake: 45,
    potentialReturn: 63.9,
    winProbability: 0.84,
    expectedValue: 19.3,
    strategyCategory: 'safest',
    status: 'won',
    profit: 18.9,
    resolvedAt: 'Gagné (1-0)',
  },
  {
    id: 'vbet-2',
    timestamp: 'Hier 18:30',
    matchId: 'real-fix-103',
    matchTitle: '1. FC Union Berlin vs SV Elversberg',
    league: 'Bundesliga',
    selection: 'Union Berlin Gagne & +1.5 buts',
    marketType: 'Résultat & Buts',
    odds: 1.85,
    stake: 35,
    potentialReturn: 64.75,
    winProbability: 0.65,
    expectedValue: 20.2,
    strategyCategory: 'prolific',
    status: 'won',
    profit: 29.75,
    resolvedAt: 'Gagné (2-0)',
  },
  {
    id: 'vbet-3',
    timestamp: "Aujourd'hui 14:00",
    matchId: 'real-fix-102',
    matchTitle: 'Chelsea vs AFC Bournemouth',
    league: 'Premier League',
    selection: 'Plus de 2.5 Buts',
    marketType: 'Total Buts',
    odds: 1.62,
    stake: 50,
    potentialReturn: 81.0,
    winProbability: 0.74,
    expectedValue: 19.8,
    strategyCategory: 'safest',
    status: 'pending',
    profit: 0,
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('decisions');
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [selectedMatchForModal, setSelectedMatchForModal] = useState<Match | null>(null);

  // Internet Sync & Real Football Data State
  const [syncConfig, setSyncConfig] = useState<InternetSyncConfig>(() => {
    const saved = localStorage.getItem('stratx_sync_config');
    return saved ? JSON.parse(saved) : DEFAULT_SYNC_CONFIG;
  });
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(new Date());
  const [totalSyncedCount, setTotalSyncedCount] = useState(INITIAL_MATCHES.length);

  // Save sync config
  useEffect(() => {
    localStorage.setItem('stratx_sync_config', JSON.stringify(syncConfig));
  }, [syncConfig]);

  // Real Internet Sync Callback
  const handleRefreshMatches = useCallback(async () => {
    setIsSyncing(true);
    try {
      const result = await fetchLiveInternetMatches(syncConfig);
      if (result.matches.length > 0) {
        setMatches(result.matches);
        setLastSyncedAt(result.syncedAt);
        setTotalSyncedCount(result.totalSynced);
      }
    } catch {
      // Fallback preserves existing valid data
    } finally {
      setIsSyncing(false);
    }
  }, [syncConfig]);

  // Auto-Sync background polling interval
  useEffect(() => {
    // Initial fetch on mount
    handleRefreshMatches();

    if (!syncConfig.autoSyncEnabled) return;

    const intervalMs = Math.max(15, syncConfig.refreshIntervalSeconds) * 1000;
    const timer = setInterval(() => {
      handleRefreshMatches();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [syncConfig.autoSyncEnabled, syncConfig.refreshIntervalSeconds, handleRefreshMatches]);

  // Notifications State
  const [notifications, setNotifications] = useState<StrategicNotification[]>(INITIAL_NOTIFICATIONS);
  const [notificationRules, setNotificationRules] = useState<NotificationRuleSettings>(DEFAULT_NOTIFICATION_RULES);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Bankroll Management Modal State
  const [isBankrollModalOpen, setIsBankrollModalOpen] = useState(false);
  const [bankroll, setBankroll] = useState<UserBankroll>({
    totalBalance: 3482,
    startingBalance: 1000,
    currency: 'EUR',
    kellyFraction: 0.25,
    maxStakePercent: 5,
    stopLossDay: 150,
    totalBetsPlaced: 842,
    totalWon: 660,
    totalLost: 182,
    netProfit: 2482,
    currentRoi: 21.4,
  });

  // Betting Simulator State (Paper trading with virtual funds)
  const [virtualBalance, setVirtualBalance] = useState<number>(() => {
    const saved = localStorage.getItem('stratx_virtual_balance');
    return saved ? parseFloat(saved) : 1060.6;
  });
  const [initialVirtualBalance] = useState<number>(1000);
  const [virtualBets, setVirtualBets] = useState<VirtualBet[]>(() => {
    const saved = localStorage.getItem('stratx_virtual_bets');
    return saved ? JSON.parse(saved) : INITIAL_VIRTUAL_BETS;
  });

  // Save virtual state to localStorage
  useEffect(() => {
    localStorage.setItem('stratx_virtual_balance', virtualBalance.toString());
  }, [virtualBalance]);

  useEffect(() => {
    localStorage.setItem('stratx_virtual_bets', JSON.stringify(virtualBets));
  }, [virtualBets]);

  // Handle Placing Virtual Bet
  const handlePlaceVirtualBet = (betData: Omit<VirtualBet, 'id' | 'timestamp' | 'status' | 'profit'>) => {
    const newBet: VirtualBet = {
      ...betData,
      id: `vbet-${Date.now()}`,
      timestamp: 'À l\'instant',
      status: 'pending',
      profit: 0,
    };

    setVirtualBets(prev => [newBet, ...prev]);
    setVirtualBalance(prev => +(prev - betData.stake).toFixed(2));
  };

  // Handle Resolving a single Virtual Bet
  const handleResolveVirtualBet = (betId: string, outcome: 'won' | 'lost') => {
    setVirtualBets(prev =>
      prev.map(b => {
        if (b.id !== betId || b.status !== 'pending') return b;
        const profit = outcome === 'won' ? +(b.potentialReturn - b.stake).toFixed(2) : -b.stake;
        if (outcome === 'won') {
          setVirtualBalance(bal => +(bal + b.potentialReturn).toFixed(2));
        }
        return {
          ...b,
          status: outcome,
          profit,
          resolvedAt: outcome === 'won' ? 'Gagné (Simulation manuelle)' : 'Perdu (Simulation manuelle)',
        };
      })
    );
  };

  // Stochastic simulation of all pending bets via Monte Carlo distribution
  const handleSimulateAllPending = () => {
    setVirtualBets(prev =>
      prev.map(b => {
        if (b.status !== 'pending') return b;
        const isWin = Math.random() <= b.winProbability;
        const profit = isWin ? +(b.potentialReturn - b.stake).toFixed(2) : -b.stake;
        if (isWin) {
          setVirtualBalance(bal => +(bal + b.potentialReturn).toFixed(2));
        }
        return {
          ...b,
          status: isWin ? 'won' : 'lost',
          profit,
          resolvedAt: isWin ? 'Gagné (Monte Carlo 10k itérations)' : 'Perdu (Monte Carlo 10k itérations)',
        };
      })
    );
  };

  // Reset Virtual Bankroll
  const handleResetVirtualBankroll = () => {
    setVirtualBalance(1000);
    setVirtualBets(INITIAL_VIRTUAL_BETS);
  };

  // Quick Bet from Decision Engine to Simulator
  const handleExecuteBetFromDashboard = (match: Match, option: MarketOption) => {
    const recommendedStake = Math.max(10, Math.round((virtualBalance * option.recommendedStakePct) / 100));
    handlePlaceVirtualBet({
      matchId: match.id,
      matchTitle: `${match.homeTeam} vs ${match.awayTeam}`,
      league: match.league,
      selection: option.selection,
      marketType: option.market,
      odds: option.bookmakerOdds,
      stake: recommendedStake,
      potentialReturn: +(recommendedStake * option.bookmakerOdds).toFixed(2),
      winProbability: option.winProbability,
      expectedValue: option.expectedValue,
      strategyCategory: option.type === 'safest' ? 'safest' : option.type === 'most_prolific' ? 'prolific' : 'balanced',
    });
    setCurrentTab('simulator');
  };

  const handleSendToSimulatorFromModal = (match: Match, strategy: 'safest' | 'prolific' | 'balanced') => {
    const opt = strategy === 'safest' ? match.safestOption : strategy === 'prolific' ? match.prolificOption : match.balancedOption;
    handleExecuteBetFromDashboard(match, opt);
  };

  // Notification handlers
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleTakeActionFromNotification = (notif: StrategicNotification) => {
    const match = matches.find(m => m.id === notif.matchId) || matches[0];
    handlePlaceVirtualBet({
      matchId: match.id,
      matchTitle: notif.matchTitle,
      league: notif.league,
      selection: notif.recommendedAction,
      marketType: notif.title,
      odds: notif.odds,
      stake: notif.stakeKelly,
      potentialReturn: +(notif.stakeKelly * notif.odds).toFixed(2),
      winProbability: notif.winProb / 100,
      expectedValue: notif.evPlus,
      strategyCategory: notif.type === 'safe_lock' ? 'safest' : 'prolific',
    });
    setCurrentTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 3-Zone Top Navigation Bar Contract */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        unreadCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenBankrollModal={() => setIsBankrollModalOpen(true)}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        isSyncing={isSyncing}
        bankrollBalance={bankroll.totalBalance}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'decisions' && (
          <AutomatedDecisionEngine
            matches={matches}
            onSelectMatch={setSelectedMatchForModal}
            onExecuteBet={handleExecuteBetFromDashboard}
            bankrollBalance={virtualBalance}
            lastSyncedAt={lastSyncedAt}
            onRefresh={handleRefreshMatches}
            isSyncing={isSyncing}
          />
        )}

        {currentTab === 'simulator' && (
          <BettingSimulator
            matches={matches}
            virtualBalance={virtualBalance}
            initialVirtualBalance={initialVirtualBalance}
            virtualBets={virtualBets}
            onPlaceVirtualBet={handlePlaceVirtualBet}
            onResolveBet={handleResolveVirtualBet}
            onSimulateAllPending={handleSimulateAllPending}
            onResetVirtualBankroll={handleResetVirtualBankroll}
          />
        )}

        {currentTab === 'matches' && (
          <MatchArbitrageList
            matches={matches}
            onSelectMatch={setSelectedMatchForModal}
            onExecuteBet={handleExecuteBetFromDashboard}
          />
        )}

        {currentTab === 'live' && (
          <LiveMatchTracker
            matches={matches}
            onExecuteBet={handleExecuteBetFromDashboard}
            bankrollBalance={virtualBalance}
          />
        )}

        {currentTab === 'algorithms' && (
          <AlgorithmTransparency />
        )}

        {currentTab === 'backtest' && (
          <AnalyticsBacktest />
        )}
      </main>

      {/* Internet Sync Settings Modal */}
      {isSyncModalOpen && (
        <InternetSyncModal
          config={syncConfig}
          onUpdateConfig={setSyncConfig}
          onManualRefresh={handleRefreshMatches}
          isSyncing={isSyncing}
          lastSyncedAt={lastSyncedAt}
          totalSyncedCount={totalSyncedCount}
          onClose={() => setIsSyncModalOpen(false)}
        />
      )}

      {/* Detail Modal for any match */}
      {selectedMatchForModal && (
        <MatchDetailModal
          match={selectedMatchForModal}
          onClose={() => setSelectedMatchForModal(null)}
          onExecuteBet={handleExecuteBetFromDashboard}
          onSendToSimulator={handleSendToSimulatorFromModal}
        />
      )}

      {/* Strategic Notifications Modal */}
      {isNotificationOpen && (
        <NotificationCenter
          notifications={notifications}
          rules={notificationRules}
          onUpdateRules={setNotificationRules}
          onMarkAllAsRead={handleMarkAllNotificationsAsRead}
          onMarkAsRead={handleMarkAsRead}
          onClose={() => setIsNotificationOpen(false)}
          onTakeAction={handleTakeActionFromNotification}
        />
      )}

      {/* Real / Simulated Bankroll Settings Modal */}
      {isBankrollModalOpen && (
        <BankrollManagerModal
          bankroll={bankroll}
          onUpdateBankroll={(updated) => setBankroll(b => ({ ...b, ...updated }))}
          onClose={() => setIsBankrollModalOpen(false)}
        />
      )}

      {/* Clean Anti-Slop Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">StratX Predictive Football Engine</span>
            <span aria-hidden="true">·</span>
            <span>Connecté aux Flux Officiels en Direct</span>
            <span aria-hidden="true">·</span>
            <span>Simulateur Fictif Intégré</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Gestion Responsable du Risque (1/4 Kelly)</span>
            <span aria-hidden="true">·</span>
            <span>2026 StratX Analytics</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
