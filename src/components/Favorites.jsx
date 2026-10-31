import React, { useState } from 'react';
import {
  Heart,
  Trash2,
  Copy,
  Check,
  Share2,
  Sparkles,
  ArrowLeft,
  Calendar,
} from 'lucide-react';

/**
 * @param {{ favorites?: any[]; onRemoveFavorite: (item: any) => void; onClearAll: () => void; onGoHome: () => void; }} props
 */
export default function Favorites({
  favorites = /** @type {any[]} */ ([]),
  onRemoveFavorite,
  onClearAll,
  onGoHome,
}) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = async (item) => {
    try {
      const text = `"${item.quote}"\n\n— MoodQuotes (${item.mood} ${item.emoji || ''})`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedId(item.id || item.quote);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy saved quote:', err);
    }
  };

  const handleShare = async (item) => {
    const shareData = {
      title: `MoodQuotes - ${item.mood}`,
      text: `"${item.quote}"\n\n${item.explanation || ''}`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopy(item);
        }
      }
    } else {
      handleCopy(item);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            type="button"
            onClick={onGoHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Quote Generator</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500/20" />
            <span>Favorite Quotes</span>
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            {favorites.length} {favorites.length === 1 ? 'quote' : 'quotes'} saved for reflection
          </p>
        </div>

        {favorites.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="self-start sm:self-auto text-xs font-medium text-stone-500 hover:text-rose-600 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-rose-200 hover:bg-rose-50/50 transition-colors cursor-pointer"
          >
            Clear all favorites
          </button>
        )}
      </div>

      {/* Empty State requirement */}
      {favorites.length === 0 ? (
        <div className="bg-white/80 border border-[#EAE4DC] rounded-3xl p-10 sm:p-16 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4 text-rose-400">
            <Heart className="w-7 h-7" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-stone-800 mb-2">
            Your favorite quotes will appear here.
          </h2>
          <p className="text-stone-500 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
            Whenever you generate a quote that resonates with your heart, tap the save button to revisit it here anytime.
          </p>
          <button
            type="button"
            onClick={onGoHome}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Find a quote for your mood</span>
          </button>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {favorites.map((item) => {
            const itemId = item.id || item.quote;
            const isJustCopied = copiedId === itemId;

            return (
              <div
                key={itemId}
                className="bg-white border border-[#E8E2D9] rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Badge & Date */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/60 text-xs font-medium">
                      <span>{item.emoji}</span>
                      <span>{item.mood}</span>
                    </span>

                    {item.timestamp && (
                      <span className="text-[11px] text-stone-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(item.timestamp)}</span>
                      </span>
                    )}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-base sm:text-lg font-serif-quote font-normal text-stone-800 leading-snug my-2 pl-2.5 border-l-2 border-amber-400">
                    "{item.quote}"
                  </blockquote>

                  {/* Explanation if present */}
                  {item.explanation && (
                    <p className="text-xs sm:text-sm text-stone-600 mt-3 pt-2.5 border-t border-stone-100 leading-relaxed">
                      {item.explanation}
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={() => handleCopy(item)}
                      title="Copy quote"
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        isJustCopied
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      {isJustCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-stone-500" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {/* Share Button */}
                    <button
                      type="button"
                      onClick={() => handleShare(item)}
                      title="Share quote"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5 text-stone-500" />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => onRemoveFavorite(item)}
                    title="Remove from favorites"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
