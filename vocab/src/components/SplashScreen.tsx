import React, { useState } from 'react';
import { Play, Trophy, Sparkles, BookOpen, Layers } from 'lucide-react';
import { LeaderboardEntry } from '../utils/storage';
import { sound } from '../utils/soundEffects';

interface SplashScreenProps {
  onStart: (name: string) => void;
  miniLeaderboard: LeaderboardEntry[];
  showToast: (msg: string, isSuccess?: boolean) => void;
  onOpenFlashcards: () => void;
  onOpenGlossary: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onStart,
  miniLeaderboard,
  showToast,
  onOpenFlashcards,
  onOpenGlossary,
}) => {
  const [nameInput, setNameInput] = useState('');

  const handleStart = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      showToast('Vui lòng nhập tên của bạn để bắt đầu nhé!', false);
      return;
    }
    sound.toggleMusic(true);
    onStart(trimmed);
  };

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="glass-panel max-w-2xl w-full p-6 sm:p-10 rounded-3xl text-center relative overflow-hidden border border-white/90 shadow-2xl">
        {/* Background Decorative Emojis */}
        <div className="absolute -top-10 -right-10 text-9xl opacity-10 pointer-events-none select-none">
          🌿
        </div>
        <div className="absolute -bottom-10 -left-10 text-9xl opacity-10 pointer-events-none select-none">
          🔬
        </div>

        {/* Brand Tag */}
        <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold mb-4 border border-emerald-200/80 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          ✨ Biology with Jessica · Sinh Học 11
        </div>

        {/* Title */}
        <h1 className="title-font text-4xl sm:text-6xl font-extrabold text-emerald-700 mb-1 drop-shadow-xs tracking-tight">
          PHOTOSYNTHESIS
        </h1>
        <h2 className="title-font text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
          Quang hợp ở thực vật
        </h2>

        <p className="text-sm sm:text-base text-slate-600 font-semibold mb-8 max-w-md mx-auto leading-relaxed">
          Khám phá thế giới thực vật kì diệu qua 22 vòng ghép nối từ vựng sinh học song ngữ Anh - Việt (kèm vòng Thử Thách Tổng Hợp ngẫu nhiên)!
        </p>

        {/* Name input form */}
        <form onSubmit={handleStart} className="max-w-sm mx-auto mb-8">
          <div className="bg-white/80 p-5 rounded-2xl border border-emerald-100 shadow-inner mb-4">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 text-left">
              Tên của bạn / Your Name:
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Nhập họ tên hoặc biệt danh..."
              maxLength={30}
              autoFocus
              className="w-full px-4 py-3 rounded-xl border-2 border-emerald-300 focus:border-emerald-600 focus:outline-none font-bold text-center text-lg sm:text-xl text-emerald-800 placeholder-emerald-300/80 bg-white"
            />
          </div>

          <button
            type="submit"
            style={{ '--shadow-color': '#15803d' } as React.CSSProperties}
            className="btn-3d w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-black text-xl py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-transform cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>BẮT ĐẦU NGAY</span>
          </button>
        </form>

        {/* Quick Study Mode Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            onClick={onOpenFlashcards}
            className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors border border-emerald-200"
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Học thẻ Flashcards trước</span>
          </button>
          <button
            onClick={onOpenGlossary}
            className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold flex items-center gap-1.5 transition-colors border border-blue-200"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Tra cứu từ điển 140+ từ</span>
          </button>
        </div>

        {/* Mini Leaderboard (Top 5) */}
        <div className="border-t border-slate-200/80 pt-6 max-w-md mx-auto">
          <h3 className="title-font text-lg font-bold text-slate-700 mb-3 flex items-center justify-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Bảng Vàng Kỷ Lục (Top 5)</span>
          </h3>

          {miniLeaderboard.length === 0 ? (
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Chưa có kỷ lục nào. Hãy là người đầu tiên ghi tên lên Bảng Vàng!
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {miniLeaderboard.slice(0, 5).map((entry, idx) => (
                <div
                  key={`${entry.name}-${idx}`}
                  className="flex items-center justify-between bg-white/70 px-4 py-2.5 rounded-xl border border-slate-100 shadow-xs text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm w-5 text-center">
                      {idx < 3 ? medals[idx] : `#${idx + 1}`}
                    </span>
                    <span className="font-bold text-slate-800">{entry.name}</span>
                  </div>
                  <span className="font-extrabold text-emerald-700 tabular-nums">
                    {entry.score} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
