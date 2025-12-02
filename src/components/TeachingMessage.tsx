interface TeachingMessageProps {
  message: string | null;
}

export const TeachingMessage = ({ message }: TeachingMessageProps) => {
  if (!message) return null;

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-down">
      <div className="relative bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-sm rounded-xl p-6 shadow-2xl border-2 border-indigo-400/50">
        {/* Speech bubble arrow */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="w-6 h-6 bg-indigo-600 rotate-45 border-l-2 border-t-2 border-indigo-400/50" />
        </div>

        {/* Poker Master Icon */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-2xl shadow-lg border-2 border-yellow-300">
            🎓
          </div>

          <div className="flex-1">
            <div className="text-yellow-200 text-sm font-semibold mb-1">Poker Master</div>
            <div className="text-white text-base md:text-lg leading-relaxed">
              {message}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-2 right-2 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
        <div className="absolute bottom-2 right-4 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse animation-delay-200" />
      </div>
    </div>
  );
};
