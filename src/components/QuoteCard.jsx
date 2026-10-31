import React, { useState } from 'react';
import {
  Quote,
  Copy,
  Check,
  Share2,
  Heart,
  RefreshCw,
  Sparkles,
  MessageCircleHeart,
  BookOpen,
} from 'lucide-react';

export default function QuoteCard({
  quoteData,
  onGiveMeAnother,
  isFavorite,
  onToggleFavorite,
  isLoadingAnother,
}) {
  const [copied, setCopied] = useState(false);
  const [shareFeedback, setShareFeedback] = useState('');

  if (!quoteData) return null;

  const { quote, explanation, message, mood, emoji, model } = quoteData;

  const handleCopy = async () => {
    try {
      const textToCopy = `"${quote}"\n\n— MoodQuotes (${mood} ${emoji})`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch (err) {
      console.error('Failed to copy quote:', err);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `MoodQuotes - ${mood}`,
      text: `"${quote}"\n\n${explanation}\n\nGenerated with MoodQuotes for feeling ${mood}.`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
          handleCopyFallback();
        }
      }
    } else {
      handleCopyFallback();
    }
  };

  const handleCopyFallback = async () => {
    await handleCopy();
    setShareFeedback('Quote copied to clipboard!');
    setTimeout(() => setShareFeedback(''), 2400);
  };

  return (
    <div className="w-full bg-white border border-[#E8E2D9] rounded-3xl p-6 sm:p-9 shadow-sm relative transition-all duration-300">
      {/* Top Header Row with Mood Badge and Model Attribution */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-100">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/70 text-xs sm:text-sm font-medium">
          <span className="text-base">{emoji}</span>
          <span>Mood:</span>
          <strong className="font-semibold">{mood}</strong>
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs text-stone-500 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Gemma 4 • Google AI</span>
        </div>
      </div>

      {/* Quote Display */}
      <div className="relative my-4 sm:my-6">
        <Quote className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300/60 absolute -top-4 sm:-top-5 -left-2 sm:-left-3 -z-0 pointer-events-none" />
        <blockquote className="relative z-10 text-xl sm:text-2xl md:text-3xl font-serif-quote font-normal text-stone-800 leading-snug sm:leading-relaxed pl-2 sm:pl-4 border-l-2 border-amber-400">
          "{quote}"
        </blockquote>
      </div>

      {/* Explanation and Message Sections */}
      <div className="mt-6 sm:mt-8 space-y-3.5">
        {explanation && (
          <div className="bg-[#FAF8F5] rounded-2xl p-4 sm:p-4.5 border border-[#EDE8E1] text-left">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>What it means</span>
            </div>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
              {explanation}
            </p>
          </div>
        )}

        {message && (
          <div className="bg-amber-50/60 rounded-2xl p-4 sm:p-4.5 border border-amber-200/60 text-left">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 mb-1.5 uppercase tracking-wider">
              <MessageCircleHeart className="w-3.5 h-3.5 text-amber-600" />
              <span>A gentle message for you</span>
            </div>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
              {message}
            </p>
          </div>
        )}
      </div>

      {/* Toast Feedback for Copy/Share */}
      {(copied || shareFeedback) && (
        <div className="mt-4 py-2 px-3.5 rounded-xl bg-stone-900 text-stone-100 text-xs font-medium text-center shadow-md animate-fade-in inline-flex items-center justify-center gap-2 mx-auto w-full sm:w-auto">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{copied ? 'Quote copied!' : shareFeedback}</span>
        </div>
      )}

      {/* Actions Toolbar */}
      <div className="mt-7 pt-5 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        {/* Copy, Share, Favorite Button Group */}
        <div className="flex items-center justify-center sm:justify-start gap-2">
          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            title="Copy quote to clipboard"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
            }`}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-500" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            title="Share this quote"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 hover:border-stone-300 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-stone-500" />
            <span>Share</span>
          </button>

          {/* Favorite Button */}
          <button
            type="button"
            onClick={onToggleFavorite}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all cursor-pointer ${
              isFavorite
                ? 'bg-rose-50 text-rose-700 border-rose-300 fill-rose-500/20'
                : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'text-rose-500 fill-rose-500' : 'text-stone-400'
              }`}
            />
            <span>{isFavorite ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        {/* Give Me Another Button */}
        <button
          type="button"
          onClick={onGiveMeAnother}
          disabled={isLoadingAnother}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            isLoadingAnother
              ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
              : 'bg-amber-100/80 hover:bg-amber-200/80 text-amber-900 border border-amber-300/80 hover:border-amber-400 active:scale-98'
          }`}
        >
          <RefreshCw
            className={`w-4 h-4 text-amber-700 ${isLoadingAnother ? 'animate-spin' : ''}`}
          />
          <span>{isLoadingAnother ? 'Generating...' : 'Give me another'}</span>
        </button>
      </div>
    </div>
  );
}
