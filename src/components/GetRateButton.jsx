import { FiArrowRight } from 'react-icons/fi';

export const GetRateButton = ({ loading, disabled, label = 'Рассчитать' }) => {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold rounded-2xl transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 overflow-hidden"
    >
      {/* Эффект блеска при наведении */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>

      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>Считаем...</span>
        </>
      ) : (
        <>
          <span>{label}</span>
          <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </button>
  );
};