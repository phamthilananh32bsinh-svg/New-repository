import React from 'react';
import { Trophy, X, Award, Flame, CheckCircle, RotateCcw } from 'lucide-react';
import { LeaderboardEntry } from '../utils/storage';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  playerName: string;
  totalScore: number;
  completedRoundsCount: number;
  onClearLeaderboard?: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  entries,
  playerName,
  totalScore,
  completedRoundsCount,
}) => {
  if (!isOpen) return null;

  const medals = ['🥇', '🥈', '🥉'];

  const achievements = [
    {
      title: 'Mầm cây đầu tiên',
      desc: 'Hoàn thành ít nhất 1 vòng chơi',
      unlocked: completedRoundsCount >= 1,
      icon: '🌱',
    },
    {
      title: 'Sắc tố Bừng nở',
      desc: 'Hoàn thành từ 5 vòng chơi trở lên',
      unlocked: completedRoundsCount >= 5,
      icon: '🌿',
    },
    {
      title: 'Đồng hóa Carbon',
      desc: 'Hoàn thành từ 10 vòng chơi trở lên',
      unlocked: completedRoundsCount >= 10,
      icon: '🔬',
    },
    {
      title: 'Nhà Thực vật học Toàn diện',
      desc: 'Vượt qua tất cả các vòng quang hợp (kèm Vòng Tổng Hợp)',
      unlocked: completedRoundsCount >= 22,
      icon: '👑',
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-2xl p-6 sm:p-8 rounded-3xl border border-white/80 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
            <Trophy className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h2 className="title-font text-2xl sm:text-3xl font-extrabold text-slate-800">
              Bảng Vàng Danh Dự (Top 10)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold">
              Kỷ lục điểm số của các bạn học sinh Team Sinh cô Jessica
            </p>
          </div>
        </div>

        {/* Current Player Status Bar */}
        {playerName && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Bạn đang là:</span>
              <span className="font-extrabold text-emerald-950">{playerName}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Đã hoàn thành: <b className="text-emerald-700">{completedRoundsCount}/22 vòng</b></span>
              <span>Tổng điểm: <b className="text-emerald-700 text-base">{totalScore} pts</b></span>
            </div>
          </div>
        )}

        <div className="overflow-y-auto custom-scroll pr-1 flex-1">
          {/* Top 10 List */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2.5">
              Xếp hạng thành tích
            </h3>
            {entries.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm font-medium border border-dashed border-slate-200 rounded-2xl">
                Chưa có kỷ lục nào được ghi nhận. Hãy hoàn thành các vòng chơi để lưu điểm đầu tiên nhé!
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {entries.map((entry, idx) => (
                  <div
                    key={`${entry.name}-${idx}`}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                      idx === 0
                        ? 'bg-amber-50/60 border-amber-200 shadow-xs'
                        : 'bg-white border-slate-200/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg w-7 text-center font-bold">
                        {idx < 3 ? medals[idx] : <span className="text-xs text-slate-400 font-extrabold">#{idx + 1}</span>}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 text-sm sm:text-base">
                          {entry.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {entry.date} {entry.completedRoundsCount ? `· ${entry.completedRoundsCount} vòng` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="font-black text-emerald-600 text-base sm:text-lg tabular-nums">
                      {entry.score} pts
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Badges / Achievements */}
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2.5">
              Huy hiệu thành tích
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {achievements.map((a, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl border flex items-center gap-3 ${
                    a.unlocked
                      ? 'bg-emerald-50/70 border-emerald-200 text-slate-800'
                      : 'bg-slate-50/60 border-slate-200/60 text-slate-400 opacity-60'
                  }`}
                >
                  <span className="text-2xl">{a.icon}</span>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      {a.title}
                      {a.unlocked && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <div className="text-[11px] text-slate-500">{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
