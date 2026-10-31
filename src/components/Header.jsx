import React from 'react';
import { Sparkles, Heart, Compass } from 'lucide-react';

export default function Header({ activeTab, onTabChange, favoritesCount = 0 }) {
  return (
    <header className="w-full border-b border-[#EAE4DC] bg-[#FAF8F5]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo and Name */}
        <button
          onClick={() => onTabChange('home')}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
          aria-label="MoodQuotes Home"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-100/90 border border-amber-200/80 flex items-center justify-center text-amber-700 shadow-xs group-hover:bg-amber-200/80 transition-colors">
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <span className="font-semibold text-lg text-stone-900 tracking-tight block leading-none">
              MoodQuotes
            </span>
            <span className="text-[11px] text-stone-500 font-medium tracking-wide">
              AI Emotional Reflections
            </span>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 p-1 bg-stone-100/90 rounded-full border border-stone-200/80 text-sm">
          <button
            onClick={() => onTabChange('home')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium transition-all duration-200 ${
              activeTab === 'home'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-600" />
            <span>Home</span>
          </button>

          <button
            onClick={() => onTabChange('favorites')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium transition-all duration-200 relative ${
              activeTab === 'favorites'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                favoritesCount > 0 ? 'text-rose-500 fill-rose-500/20' : 'text-stone-400'
              }`}
            />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="ml-0.5 inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] font-semibold rounded-full bg-amber-500 text-white leading-none">
                {favoritesCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
