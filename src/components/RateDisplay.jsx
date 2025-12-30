import { LoadingSpinner } from './LoadingSpinner';

export const RateDisplay = ({ rate, loading, error }) => {
  if (loading) {
    return (
      <div className="h-24 flex items-center justify-center backdrop-blur-md bg-white/5 border border-white/5 rounded-2xl">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-5 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-md">
        <p className="text-red-200 text-center text-sm font-medium">
          {error}
        </p>
      </div>
    );
  }

  if (!rate) {
    return null; // Не показываем пустой блок, чтобы не занимать место
  }


  return (
    <div
      className="relative overflow-hidden px-6 py-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-3xl text-center shadow-lg backdrop-blur-md animate-fade-in min-h-[120px] flex flex-col justify-center"
      style={{
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        WebkitTransform: 'translateZ(0)'
      }}
    >
      {/* Декоративный блик */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 blur-2xl rounded-full -mr-10 -mt-10"></div>

      <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">
        Текущий курс
      </p>
      <div className="text-4xl sm:text-5xl font-bold text-white tracking-tight break-all drop-shadow-sm">
        {rate}
      </div>
    </div>
  );
};