import React from 'react';

export default function MoodCard({ mood, emoji, isSelected, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isSelected}
      className={`group relative flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer select-none ${
        isSelected
          ? 'bg-amber-50/90 border-amber-400/90 shadow-sm ring-2 ring-amber-400/30 -translate-y-0.5'
          : 'bg-white/80 hover:bg-white border-stone-200/90 hover:border-amber-300/80 hover:shadow-xs hover:-translate-y-0.5'
      } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
    >
      <span className="text-2xl sm:text-3xl transition-transform duration-200 group-hover:scale-110 flex-shrink-0">
        {emoji}
      </span>
      <div className="flex-1 min-w-0">
        <span
          className={`block font-medium text-sm sm:text-base leading-tight truncate transition-colors ${
            isSelected ? 'text-amber-950 font-semibold' : 'text-stone-800 group-hover:text-amber-900'
          }`}
        >
          {mood}
        </span>
      </div>

      {isSelected && (
        <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 animate-ping absolute top-3 right-3" />
      )}
      {isSelected && (
        <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 absolute top-3 right-3" />
      )}
    </button>
  );
}
