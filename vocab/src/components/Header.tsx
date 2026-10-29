import React from 'react';
import { Volume2, VolumeX, Music, Trophy, BookOpen, Layers, PlayCircle } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface HeaderProps {
  currentTab: 'game' | 'flashcards' | 'glossary';
  setCurrentTab: (tab: 'game' | 'flashcards' | 'glossary') => void;
  playerName: string;
  totalScore: number;
  onOpenLeaderboard: () => void;
  onExitToSelect?: () => void;
  showExitBtn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  playerName,
  totalScore,
  onOpenLeaderboard,
  onExitToSelect,
  showExitBtn,
}) => {
  const [isMusic, setIsMusic] = React.useState(sound.getMusicState());
  const [isSfx, setIsSfx] = React.useState(sound.getSfxState());

  const handleToggleMusic = () => {
    const newState = sound.toggleMusic();
    setIsMusic(newState);
  };

  const handleToggleSfx = () => {
    const newState = sound.toggleSfx();
    setIsSfx(newState);
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-3.5 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
            🌱
          </div>
          <div>
            <span className="title-font text-xl font-bold tracking-tight text-emerald-950 block leading-tight">
              Biology 11 · Photosynthesis
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 hidden sm:block">
              Team Sinh cô Jessica
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 text-sm font-semibold text-slate-600">
          <button
            onClick={() => setCurrentTab('game')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              currentTab === 'game'
                ? 'bg-emerald-50 text-emerald-800 font-bold'
                : 'hover:text-emerald-700 hover:bg-slate-50'
            }`}
          >
            <PlayCircle className="w-4 h-4 text-emerald-600" />
            Nối Từ (22 Vòng)
          </button>
          <button
            onClick={() => setCurrentTab('flashcards')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              currentTab === 'flashcards'
                ? 'bg-emerald-50 text-emerald-800 font-bold'
                : 'hover:text-emerald-700 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            Thẻ Flashcards
          </button>
          <button
            onClick={() => setCurrentTab('glossary')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              currentTab === 'glossary'
                ? 'bg-emerald-50 text-emerald-800 font-bold'
                : 'hover:text-emerald-700 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            Từ Điển Thuật Ngữ
          </button>
        </nav>

        {/* Zone 3: Actions & Audio Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Audio Toggles */}
          <button
            onClick={handleToggleMusic}
            title={isMusic ? 'Tắt nhạc nền (BGM)' : 'Bật nhạc nền thư giãn (BGM)'}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm border transition-all ${
              isMusic
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xs'
                : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
          >
            <Music className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleSfx}
            title={isSfx ? 'Tắt hiệu ứng âm thanh' : 'Bật hiệu ứng âm thanh'}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm border transition-all ${
              isSfx
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xs'
                : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
          >
            {isSfx ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={onOpenLeaderboard}
            className="px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Bảng Vàng</span>
          </button>

          {/* Player stats info in header */}
          {playerName && (
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
              <span className="text-slate-500">Người chơi:</span>
              <span className="font-bold text-slate-800 max-w-[100px] truncate">{playerName}</span>
              <span className="text-emerald-700 font-extrabold bg-emerald-100/70 px-2 py-0.5 rounded-md tabular-nums">
                {totalScore} pts
              </span>
            </div>
          )}

          {showExitBtn && onExitToSelect && (
            <button
              onClick={onExitToSelect}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              Chọn vòng
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav sub-bar */}
      <div className="md:hidden flex items-center justify-around pt-2.5 mt-2 border-t border-slate-100 text-xs font-semibold">
        <button
          onClick={() => setCurrentTab('game')}
          className={`flex items-center gap-1 py-1 px-2 rounded ${
            currentTab === 'game' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-600'
          }`}
        >
          <PlayCircle className="w-3.5 h-3.5" />
          Nối từ
        </button>
        <button
          onClick={() => setCurrentTab('flashcards')}
          className={`flex items-center gap-1 py-1 px-2 rounded ${
            currentTab === 'flashcards' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-600'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Flashcards
        </button>
        <button
          onClick={() => setCurrentTab('glossary')}
          className={`flex items-center gap-1 py-1 px-2 rounded ${
            currentTab === 'glossary' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-600'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Từ điển
        </button>
      </div>
    </header>
  );
};
