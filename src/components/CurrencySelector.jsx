import { CURRENCIES } from '../constants/currencies';
import { FiChevronDown } from 'react-icons/fi';

export const CurrencySelector = ({ value, onChange, placeholder, label }) => {
  return (
    <div className="w-full group">
      {label && (
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700 hover:border-slate-600 rounded-2xl px-4 py-4 pr-10 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 cursor-pointer text-base shadow-sm"
        >
          <option value="" className="bg-slate-900 text-slate-400">
            {placeholder}
          </option>
          {CURRENCIES.map((currency) => (
            <option key={currency.code} value={currency.code} className="bg-slate-900 text-white py-2">
              {currency.code} — {currency.name}
            </option>
          ))}
        </select>

        {/* Кастомная стрелка */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-white transition-colors">
          <FiChevronDown size={20} />
        </div>
      </div>
    </div>
  );
};