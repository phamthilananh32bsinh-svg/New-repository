/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { VocabularyPractice } from './components/VocabularyPractice';
import { Header } from './components/Header';
import { SplashScreen } from './components/SplashScreen';
import { RoundSelector } from './components/RoundSelector';
import { ConnectingGame } from './components/ConnectingGame';
import { FlashcardsView } from './components/FlashcardsView';
import { GlossaryView } from './components/GlossaryView';
import { LeaderboardModal } from './components/LeaderboardModal';
import { Toast } from './components/Toast';
import { VOCAB_ROUNDS, VocabRound, getRoundForPlay } from './data/vocabData';
import {
  getLeaderboard,
  saveLeaderboardEntry,
  getPlayerStats,
  savePlayerStats,
  LeaderboardEntry,
} from './utils/storage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'game' | 'flashcards' | 'glossary' | 'truefalse' | 'fill'>('game');
  const [screen, setScreen] = useState<'splash' | 'round-select' | 'game'>('splash');
  const [activeRound, setActiveRound] = useState<VocabRound | null>(null);
  const [gameMode, setGameMode] = useState<'en-vi' | 'vi-en'>('en-vi');

  // Player state
  const [playerName, setPlayerName] = useState<string>('');
  const [totalScore, setTotalScore] = useState<number>(0);
  const [completedRounds, setCompletedRounds] = useState<number[]>([]);
  const [roundHighScores, setRoundHighScores] = useState<Record<number, number>>({});
  const [masteredWords, setMasteredWords] = useState<string[]>([]);
  const [flashcardInitialRoundId, setFlashcardInitialRoundId] = useState<number>(1);

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIsSuccess, setToastIsSuccess] = useState<boolean>(true);

  // Load persistent stats & leaderboard on mount
  useEffect(() => {
    const savedLb = getLeaderboard();
    setLeaderboard(savedLb);

    const stats = getPlayerStats();
    if (stats.playerName) {
      setPlayerName(stats.playerName);
      setTotalScore(stats.totalScore || 0);
      setCompletedRounds(stats.completedRounds || []);
      setRoundHighScores(stats.roundHighScores || {});
      setMasteredWords(stats.masteredWords || []);
    }
  }, []);

  const showToast = (msg: string, isSuccess: boolean = false) => {
    setToastMessage(msg);
    setToastIsSuccess(isSuccess);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Start game from splash screen
  const handleStartGame = (name: string) => {
    setPlayerName(name);
    setScreen('round-select');
    setCurrentTab('game');

    // Save player state
    savePlayerStats({
      playerName: name,
      totalScore,
      completedRounds,
      roundHighScores,
      masteredWords,
    });
    showToast(`Chào mừng ${name} đến với Sinh học 11 - Quang hợp! 🌿`, true);
  };

  // Select round to play
  const handleSelectRound = (round: VocabRound) => {
    setActiveRound(getRoundForPlay(round));
    setScreen('game');
    setCurrentTab('game');
  };

  // Round completion callback
  const handleRoundComplete = (roundId: number, score: number, newTotal: number) => {
    setTotalScore(newTotal);

    setCompletedRounds((prev) => {
      const updated = prev.includes(roundId) ? prev : [...prev, roundId];
      return updated;
    });

    setRoundHighScores((prev) => {
      const currentHigh = prev[roundId] || 0;
      const updated = { ...prev, [roundId]: Math.max(currentHigh, score) };
      return updated;
    });

    // Save updated state
    savePlayerStats({
      playerName,
      totalScore: newTotal,
      completedRounds: completedRounds.includes(roundId) ? completedRounds : [...completedRounds, roundId],
      roundHighScores: {
        ...roundHighScores,
        [roundId]: Math.max(roundHighScores[roundId] || 0, score),
      },
      masteredWords,
    });
  };

  // Save score and return to splash screen
  const handleSaveAndExit = () => {
    if (totalScore > 0 && playerName) {
      const updatedLb = saveLeaderboardEntry(playerName, totalScore, completedRounds.length);
      setLeaderboard(updatedLb);
      showToast('Đã lưu thành tích lên Bảng Vàng thành công! 🏆', true);
    }
    setTotalScore(0);
    setCompletedRounds([]);
    setScreen('splash');
  };

  // Switch to flashcards
  const handleOpenFlashcards = (roundId?: number) => {
    if (roundId) setFlashcardInitialRoundId(roundId);
    setCurrentTab('flashcards');
  };

  // Switch to glossary
  const handleOpenGlossary = () => {
    setCurrentTab('glossary');
  };

  // Toggle word mastery in flashcards
  const handleToggleMastered = (wordEn: string) => {
    setMasteredWords((prev) => {
      const isExist = prev.includes(wordEn);
      const updated = isExist ? prev.filter((w) => w !== wordEn) : [...prev, wordEn];

      savePlayerStats({
        playerName,
        totalScore,
        completedRounds,
        roundHighScores,
        masteredWords: updated,
      });

      showToast(isExist ? `Bỏ đánh dấu: ${wordEn}` : `Đã thuộc: ${wordEn} 🎉`, true);
      return updated;
    });
  };

  // Direct play from dictionary or flashcard
  const handleDirectPlayRound = (roundId: number) => {
    const round = VOCAB_ROUNDS.find((r) => r.id === roundId);
    if (round) {
      if (!playerName) {
        setPlayerName('Học sinh');
      }
      setActiveRound(getRoundForPlay(round));
      setScreen('game');
      setCurrentTab('game');
    }
  };

  return (
    <div className="min-h-screen botanical-light-bg v29-botanical-shell flex flex-col justify-between relative selection:bg-emerald-200">
      {/* Toast Notification */}
      <Toast message={toastMessage} isSuccess={toastIsSuccess} />

      {/* Top Header */}
      <Header
        currentTab={currentTab === 'truefalse' || currentTab === 'fill' ? 'game' : currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'game' && !activeRound) {
            setScreen(playerName ? 'round-select' : 'splash');
          }
        }}
        playerName={playerName}
        totalScore={totalScore}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onExitToSelect={() => {
          setActiveRound(null);
          setScreen('round-select');
          setCurrentTab('game');
        }}
        showExitBtn={screen === 'game' && currentTab === 'game'}
      />

      <section className="v29-lesson-hero max-w-7xl mx-auto w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] mt-5 px-5 sm:px-8 py-6" aria-label="Lesson identity">
        <p className="v29-hero-eyebrow">✦ BIOLOGY WITH JESSICA ✦</p>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="v29-hero-title">Photosynthesis <span aria-hidden="true">✿</span></h1>
            <p className="text-emerald-800/75 font-bold text-sm sm:text-base">Lesson 4.2 · Key Vocabulary · Learn &amp; Play</p>
          </div>
          <span aria-hidden="true" className="text-4xl sm:text-5xl">🌿</span>
        </div>
      </section>
      <nav aria-label="Additional vocabulary practice" className="v29-practice-nav max-w-7xl mx-auto w-full px-4 sm:px-8 pt-4 flex flex-wrap gap-2">
        <button onClick={() => {setCurrentTab('truefalse');setActiveRound(null);}} aria-pressed={currentTab === 'truefalse'} className={`px-4 py-3 rounded-xl font-extrabold border ${currentTab === 'truefalse' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-emerald-800 border-emerald-200'}`}>✓ True / False</button>
        <button onClick={() => {setCurrentTab('fill');setActiveRound(null);}} aria-pressed={currentTab === 'fill'} className={`px-4 py-3 rounded-xl font-extrabold border ${currentTab === 'fill' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-emerald-800 border-emerald-200'}`}>✎ Fill in the Blanks</button>
      </nav>
      {/* Main Content Areas */}
      <main className="flex-1 pb-16">
        {currentTab === 'truefalse' && <VocabularyPractice mode="truefalse" />}
        {currentTab === 'fill' && <VocabularyPractice mode="fill" />}
        {currentTab === 'flashcards' && (
          <FlashcardsView
            initialRoundId={flashcardInitialRoundId}
            masteredWords={masteredWords}
            onToggleMastered={handleToggleMastered}
            onPlayRound={handleDirectPlayRound}
          />
        )}

        {currentTab === 'glossary' && (
          <GlossaryView
            onPlayRound={handleDirectPlayRound}
            showToast={showToast}
          />
        )}

        {currentTab === 'game' && (
          <>
            {screen === 'splash' && (
              <SplashScreen
                onStart={handleStartGame}
                miniLeaderboard={leaderboard}
                showToast={showToast}
                onOpenFlashcards={() => handleOpenFlashcards(1)}
                onOpenGlossary={handleOpenGlossary}
              />
            )}

            {screen === 'round-select' && (
              <RoundSelector
                completedRounds={completedRounds}
                roundHighScores={roundHighScores}
                totalScore={totalScore}
                playerName={playerName}
                gameMode={gameMode}
                onGameModeChange={setGameMode}
                onSelectRound={handleSelectRound}
                onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
                onSaveAndExit={handleSaveAndExit}
                onSwitchToFlashcards={handleOpenFlashcards}
              />
            )}

            {screen === 'game' && activeRound && (
              <ConnectingGame
                round={activeRound}
                gameMode={gameMode}
                onGameModeChange={setGameMode}
                totalScore={totalScore}
                onRoundComplete={handleRoundComplete}
                onBackToRounds={() => {
                  setActiveRound(null);
                  setScreen('round-select');
                }}
                showToast={showToast}
              />
            )}
          </>
        )}
      </main>

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        entries={leaderboard}
        playerName={playerName}
        totalScore={totalScore}
        completedRoundsCount={completedRounds.length}
      />

      {/* Watermark as requested */}
      <footer className="fixed bottom-3 right-4 z-10 pointer-events-none select-none opacity-50 hover:opacity-100 transition-opacity">
        <div className="title-font font-bold text-xs sm:text-sm text-emerald-950 bg-white/70 backdrop-blur-xs px-3 py-1 rounded-full border border-emerald-200/50 shadow-xs">
          ✨ Team Sinh cô Jessica
        </div>
      </footer>
    </div>
  );
}
