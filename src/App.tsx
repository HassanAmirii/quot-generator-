import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import MoodSelector, { MOODS } from './components/MoodSelector.jsx';
import QuoteCard from './components/QuoteCard.jsx';
import LoadingState from './components/LoadingState.jsx';
import Favorites from './components/Favorites.jsx';
import { fetchMoodQuote } from './services/geminiService.js';
import { AlertCircle, RefreshCw, Sparkles, Heart } from 'lucide-react';

const FAVORITES_STORAGE_KEY = 'moodquotes_favorites_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'favorites'>('home');
  const [selectedMood, setSelectedMood] = useState<any>(null);
  const [currentQuote, setCurrentQuote] = useState<any>(null);
  const [seenQuotesHistory, setSeenQuotesHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAnother, setIsLoadingAnother] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage:', e);
    }
  }, [favorites]);

  // Handle generation of quote
  const handleGenerateQuote = async (isAnother = false) => {
    if (!selectedMood) return;

    if (isAnother) {
      setIsLoadingAnother(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      const result = await fetchMoodQuote({
        mood: selectedMood.mood,
        emoji: selectedMood.emoji,
        previousQuotes: seenQuotesHistory,
      });

      setCurrentQuote(result);
      setSeenQuotesHistory((prev) => [result.quote, ...prev.slice(0, 10)]);

      // Scroll smoothly down to quote card on mobile if newly generated
      if (!isAnother) {
        setTimeout(() => {
          const quoteEl = document.getElementById('generated-quote-section');
          if (quoteEl) {
            quoteEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      }
    } catch (error: any) {
      console.error('Error generating quote:', error);
      setErrorMessage(
        error?.message ||
          'We encountered an issue finding the right words. Please check your connection and retry.'
      );
    } finally {
      setIsLoading(false);
      setIsLoadingAnother(false);
    }
  };

  // Toggle favorite for currently viewed quote
  const isCurrentQuoteFavorite = currentQuote
    ? favorites.some((f) => f.quote === currentQuote.quote)
    : false;

  const handleToggleFavorite = () => {
    if (!currentQuote) return;

    if (isCurrentQuoteFavorite) {
      setFavorites((prev) => prev.filter((f) => f.quote !== currentQuote.quote));
    } else {
      // Prevent duplicates
      const newFav = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        quote: currentQuote.quote,
        explanation: currentQuote.explanation,
        message: currentQuote.message,
        mood: currentQuote.mood || selectedMood?.mood,
        emoji: currentQuote.emoji || selectedMood?.emoji,
        timestamp: new Date().toISOString(),
      };
      setFavorites((prev) => [newFav, ...prev]);
    }
  };

  const handleRemoveFavorite = (item: any) => {
    setFavorites((prev) =>
      prev.filter((f) => (f.id ? f.id !== item.id : f.quote !== item.quote))
    );
  };

  const handleClearAllFavorites = () => {
    if (window.confirm('Are you sure you want to clear all your saved quotes?')) {
      setFavorites([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2D2A26]">
      {/* Header Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab: 'home' | 'favorites') => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        favoritesCount={favorites.length}
      />

      {/* Main Body Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {activeTab === 'favorites' ? (
          <Favorites
            favorites={favorites}
            onRemoveFavorite={handleRemoveFavorite}
            onClearAll={handleClearAllFavorites}
            onGoHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <div className="space-y-8 sm:space-y-10">
            {/* Mood Selector Section */}
            <MoodSelector
              selectedMood={selectedMood}
              onSelectMood={(moodObj: any) => {
                setSelectedMood(moodObj);
                setErrorMessage(null);
              }}
              onGenerate={() => handleGenerateQuote(false)}
              isLoading={isLoading || isLoadingAnother}
            />

            {/* Error State with friendly message & Retry button */}
            {errorMessage && (
              <div
                role="alert"
                className="w-full bg-rose-50/90 border border-rose-200 rounded-2xl p-5 sm:p-6 text-rose-900 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Unable to generate quote</h4>
                    <p className="text-xs sm:text-sm text-rose-700 mt-0.5 leading-relaxed">
                      {errorMessage}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleGenerateQuote(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-rose-300 text-rose-700 hover:bg-rose-100/50 text-xs font-semibold shadow-xs transition-colors cursor-pointer self-end sm:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              </div>
            )}

            {/* Loading State requirement */}
            {isLoading && (
              <div id="loading-quote-section" className="scroll-mt-20">
                <LoadingState
                  mood={selectedMood?.mood}
                  emoji={selectedMood?.emoji}
                />
              </div>
            )}

            {/* Generated Quote Display Area (Only shown after generation, not before) */}
            {!isLoading && currentQuote && (
              <div id="generated-quote-section" className="scroll-mt-20">
                <QuoteCard
                  quoteData={currentQuote}
                  onGiveMeAnother={() => handleGenerateQuote(true)}
                  isFavorite={isCurrentQuoteFavorite}
                  onToggleFavorite={handleToggleFavorite}
                  isLoadingAnother={isLoadingAnother}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EAE4DC] bg-[#FAF8F5] py-8 text-center text-xs text-stone-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5">
            <span>MoodQuotes</span>
            <span>•</span>
            <span>Empathetic quotes powered by Gemma 4 & Google AI</span>
          </p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Built with care</span>
            <span>•</span>
            <button
              onClick={() => {
                setActiveTab('favorites');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-stone-700 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Heart className="w-3 h-3 text-rose-500" />
              <span>{favorites.length} saved</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
