import React from 'react';
import { Sparkles, Quote } from 'lucide-react';

export default function LoadingState({ mood, emoji }) {
  return (
    <div className="w-full bg-white/90 border border-amber-200/80 rounded-3xl p-8 sm:p-12 shadow-sm text-center relative overflow-hidden transition-all duration-300">
      {/* Gentle background accent glows */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-100/50 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-orange-100/40 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center max-w-md mx-auto">
        {/* Animated breathing orb */}
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 animate-gentle-pulse">
            <Quote className="w-7 h-7 text-amber-600" />
          </div>
          <span className="absolute -bottom-1 -right-1 text-2xl animate-float-slow">
            {emoji || '✨'}
          </span>
        </div>

        {/* Loading text requirement */}
        <h3 className="text-xl sm:text-2xl font-serif-quote font-medium text-stone-800 tracking-tight">
          Finding the right words for you...
        </h3>

        <p className="mt-2 text-stone-500 text-sm">
          {mood ? (
            <>
              Reflecting with empathy on your feeling of{' '}
              <span className="font-semibold text-amber-700 lowercase">{mood}</span>...
            </>
          ) : (
            'Consulting Gemma 4 AI for a thoughtful perspective...'
          )}
        </p>

        {/* Calming progress bar */}
        <div className="w-48 h-1.5 bg-stone-100 rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full animate-pulse w-3/4 mx-auto" />
        </div>
      </div>
    </div>
  );
}
