import React from 'react';
import MoodCard from './MoodCard.jsx';
import { Sparkles, ArrowRight } from 'lucide-react';

export const MOODS = [
  { id: 'happy', mood: 'Happy', emoji: '😊' },
  { id: 'sad', mood: 'Sad', emoji: '😔' },
  { id: 'motivated', mood: 'Motivated', emoji: '🔥' },
  { id: 'anxious', mood: 'Anxious', emoji: '😟' },
  { id: 'confused', mood: 'Confused', emoji: '🤔' },
  { id: 'lonely', mood: 'Lonely', emoji: '🥺' },
  { id: 'grateful', mood: 'Grateful', emoji: '🙏' },
  { id: 'overwhelmed', mood: 'Overwhelmed', emoji: '😮‍💨' },
  { id: 'hopeful', mood: 'Hopeful', emoji: '🌱' },
  { id: 'unmotivated', mood: 'Unmotivated', emoji: '😴' },
  { id: 'confident', mood: 'Confident', emoji: '😎' },
  { id: 'heartbroken', mood: 'Heartbroken', emoji: '💔' },
];

export default function MoodSelector({
  selectedMood,
  onSelectMood,
  onGenerate,
  isLoading,
}) {
  return (
    <section className="w-full">
      {/* Hero Headings */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 text-amber-800 text-xs font-medium mb-3 border border-amber-200/60">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Gemma 4 AI Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
          Your mood, your words.
        </h1>
        <p className="mt-2.5 sm:mt-3 text-stone-600 text-base sm:text-lg leading-relaxed">
          Tell us how you're feeling. We'll find the words for it.
        </p>
      </div>

      {/* Mood Question and Grid */}
      <div className="bg-white/70 border border-[#E8E2D9] rounded-3xl p-5 sm:p-8 shadow-xs backdrop-blur-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <h2 className="text-lg sm:text-xl font-semibold text-stone-800 flex items-center gap-2">
            <span>How are you feeling today?</span>
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            Select one mood to inspire your quote
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-3.5">
          {MOODS.map((item) => (
            <MoodCard
              key={item.id}
              mood={item.mood}
              emoji={item.emoji}
              isSelected={selectedMood?.id === item.id}
              onClick={() => onSelectMood(item)}
              disabled={isLoading}
            />
          ))}
        </div>

        {/* Generate Button Container */}
        <div className="mt-7 sm:mt-8 pt-5 sm:pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-stone-500 text-center sm:text-left">
            {selectedMood ? (
              <span>
                Ready to generate a personalized quote for{' '}
                <strong className="text-stone-800">{selectedMood.mood} {selectedMood.emoji}</strong>
              </span>
            ) : (
              <span>Select how you feel above to enable generation</span>
            )}
          </div>

          <button
            type="button"
            onClick={onGenerate}
            disabled={!selectedMood || isLoading}
            className={`w-full sm:w-auto min-w-[200px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-base font-semibold transition-all duration-200 cursor-pointer shadow-sm ${
              !selectedMood || isLoading
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-200'
                : 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate my quote</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
