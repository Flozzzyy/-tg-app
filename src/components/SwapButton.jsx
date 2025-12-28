import { IoSwapVertical } from 'react-icons/io5'; // Лучше использовать Vertical для мобильного лэйаута

export const SwapButton = ({ onClick, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative flex items-center justify-center w-10 h-10 bg-indigo-600 hover:bg-indigo-500 border-4 border-slate-900 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-700 shadow-lg shadow-indigo-900/50"
      aria-label="Поменять валюты местами"
    >
      <IoSwapVertical className="w-5 h-5 text-white transition-transform duration-500 group-hover:rotate-180 group-active:scale-90" />
    </button>
  );
};