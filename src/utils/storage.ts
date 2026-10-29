export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
  completedRoundsCount?: number;
}

export interface PlayerStats {
  playerName: string;
  totalScore: number;
  completedRounds: number[];
  roundHighScores: Record<number, number>;
  masteredWords: string[];
}

const STORAGE_LB_KEY = 'photosynthesis_lb_v2';
const STORAGE_STATS_KEY = 'photosynthesis_player_stats_v1';

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_LB_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list.sort((a, b) => b.score - a.score).slice(0, 10);
  } catch {
    return [];
  }
}

export function saveLeaderboardEntry(name: string, score: number, completedCount: number = 0): LeaderboardEntry[] {
  if (!name.trim() || score <= 0) return getLeaderboard();
  try {
    const list = getLeaderboard();
    const newEntry: LeaderboardEntry = {
      name: name.trim(),
      score,
      date: new Date().toLocaleDateString('vi-VN'),
      completedRoundsCount: completedCount,
    };
    list.push(newEntry);
    list.sort((a, b) => b.score - a.score);
    const top = list.slice(0, 10);
    localStorage.setItem(STORAGE_LB_KEY, JSON.stringify(top));
    return top;
  } catch {
    return [];
  }
}

export function getPlayerStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STORAGE_STATS_KEY);
    if (!raw) {
      return {
        playerName: '',
        totalScore: 0,
        completedRounds: [],
        roundHighScores: {},
        masteredWords: [],
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      playerName: '',
      totalScore: 0,
      completedRounds: [],
      roundHighScores: {},
      masteredWords: [],
    };
  }
}

export function savePlayerStats(stats: PlayerStats) {
  try {
    localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}
