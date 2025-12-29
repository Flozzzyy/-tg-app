import { useState } from 'react';
import { CurrencySelector } from './components/CurrencySelector';
import { SwapButton } from './components/SwapButton';
import { RateDisplay } from './components/RateDisplay';
import { GetRateButton } from './components/GetRateButton';
import { FallingSnow } from './components/FallingSnow';
import { formatRate } from './utils/formatRate';
import axios from 'axios';

const API_URL = 'https://open.er-api.com/v6/latest';

// Простейшая вспомогательная функция для получения курса base -> target
const fetchRateValue = async (base, target) => {
  const { data } = await axios.get(`${API_URL}/${base.toUpperCase()}`);
  const foundRate = data.rates[target.toUpperCase()];

  if (!foundRate) {
    throw new Error('Не удалось найти курс');
  }

  return foundRate;
};

const App = () => {
  // Общие состояния для выбора валют
  const [base, setBase] = useState('');
  const [target, setTarget] = useState('');

  // Состояния для режима "курс"
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Состояния для режима "конвертер" и параллакса
  const [mode, setMode] = useState('rate');
  const [amount, setAmount] = useState('');
  const [convertedValue, setConvertedValue] = useState('');
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX - innerWidth / 2) / innerWidth;
    const y = (e.clientY - innerHeight / 2) / innerHeight;
    setParallaxOffset({
      x: x * 20,
      y: y * 20,
    });
  };

  const handleSwap = (e) => {
    e.preventDefault();
    const prevBase = base;
    setBase(target);
    setTarget(prevBase);
  };

  const handleRateSubmit = async (e) => {
    e.preventDefault();
    if (!base || !target || base === target) {
      setError('Выберите разные валюты');
      return;
    }

    setLoading(true);
    setError(null);
    setRate(null);

    try {
      const foundRate = await fetchRateValue(base, target);
      const formattedRate = formatRate(foundRate, target);

      // Небольшая задержка перед отображением
      setTimeout(() => {
        setRate(formattedRate);
        setLoading(false);
      }, 300);
    } catch (err) {
      setError(err.message || 'Ошибка при загрузке курса');
      setLoading(false);
    }
  };

  const handleConvertSubmit = async (e) => {
    e.preventDefault();
    if (!base || !target || !amount) {
      setError('Заполните сумму и валюты');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Введите корректную сумму');
      return;
    }

    // Если выбраны одинаковые валюты — показываем жёлтое предупреждение и не считаем
    if (base === target) {
      return;
    }

    setError(null);
    setConvertedValue('');
    setLoading(true);
    try {
      const foundRate = await fetchRateValue(base, target);
      const converted = numAmount * foundRate;
      const formatted = formatRate(converted, target);

      // Небольшая задержка перед отображением результата
      setTimeout(() => {
        setConvertedValue(formatted);
        setLoading(false);
      }, 300);
    } catch (err) {
      setError(err.message || 'Ошибка при конвертации');
      setLoading(false);
    }
  };
  const isFormValid = Boolean(base && target && base !== target);
  const isConvertFormValid = Boolean(base && target && base !== target && amount);
  const showSameCurrencyWarning = base && target && base === target;

  return (
    // Глобальный контейнер с темным градиентом
    <div
      className="min-h-screen font-poppins bg-slate-950 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-white px-4 py-6 selection:bg-indigo-500/30 overflow-hidden"
      onMouseMove={handleMouseMove}
    >

      {/* Снежный параллакс-слой */}
      <div
        className="pointer-events-none fixed inset-0 snow-layer"
        style={{
          transform: `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0)`,
        }}
      />

      {/* Падающий снег */}
      <FallingSnow parallaxOffset={parallaxOffset} />

      {/* Декоративные пятна на фоне (Glow effect) */}
      <div className="fixed top-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[90px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[320px] h-[320px] bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Переключатель режимов */}
      <div className="relative max-w-md mx-auto z-20 mt-2 mb-4 px-2">
        <div className="relative flex items-center bg-slate-900/80 border border-slate-700 rounded-full p-1 w-full">
          <div
            className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-indigo-600 transition-transform duration-300 ease-out ${mode === 'rate' ? 'translate-x-0' : 'translate-x-full'
              }`}
          />
          <button
            type="button"
            onClick={() => setMode('rate')}
            className={`relative z-10 flex-1 text-sm font-medium py-2 text-center transition-colors ${mode === 'rate' ? 'text-white' : 'text-slate-400'
              }`}
          >
            Курс
          </button>
          <button
            type="button"
            onClick={() => setMode('converter')}
            className={`relative z-10 flex-1 text-sm font-medium py-2 text-center transition-colors ${mode === 'converter' ? 'text-white' : 'text-slate-400'
              }`}
          >
            Конвертер
          </button>
        </div>
      </div>

      {mode === 'rate' ? (
        <div className="relative max-w-md mx-auto z-20 pt-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-400 mb-2 tracking-tight">
              Курс Валют
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              Актуальный обменный курс
            </p>
          </div>

          {/* Карточка-контейнер с эффектом стекла */}
          <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl ring-1 ring-white/5">
            <form onSubmit={handleRateSubmit} className="flex flex-col gap-4">

              <CurrencySelector
                value={base}
                onChange={setBase}
                placeholder="Базовая валюта"
                label="Меняю"
              />

              <div className="relative h-6 flex items-center justify-center z-20">
                <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <SwapButton
                  onClick={handleSwap}
                  disabled={!base || !target}
                />
              </div>

              <CurrencySelector
                value={target}
                onChange={setTarget}
                placeholder="Целевая валюта"
                label="Получаю"
              />

              {showSameCurrencyWarning && (
                <div className="px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center backdrop-blur-sm animate-fade-in">
                  <p className="text-sm font-medium text-amber-200">
                    Выберите разные валюты
                  </p>
                </div>
              )}

              <div className="mt-4">
                <GetRateButton loading={loading} disabled={!isFormValid} />
              </div>
            </form>
          </div>

          <div className="mt-6">
            <RateDisplay rate={rate} loading={loading} error={error} />
          </div>
        </div>
      ) : (
        <div className="relative max-w-md mx-auto z-20 pt-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-400 mb-2 tracking-tight">
              Конвертер Валют
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              Перевод суммы из одной валюты в другую
            </p>
          </div>

          <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl ring-1 ring-white/5">
            <form onSubmit={handleConvertSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                  Сумма
                </label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Введите сумму"
                  className="w-full bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700 hover:border-slate-600 rounded-2xl px-4 py-3 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                />
              </div>

              <CurrencySelector
                value={base}
                onChange={setBase}
                placeholder="Базовая валюта"
                label="Из"
              />

              <div className="relative h-6 flex items-center justify-center z-20">
                <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <SwapButton
                  onClick={handleSwap}
                  disabled={!base || !target}
                />
              </div>

              <CurrencySelector
                value={target}
                onChange={setTarget}
                placeholder="Целевая валюта"
                label="В"
              />

              {showSameCurrencyWarning && (
                <div className="px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center backdrop-blur-sm animate-fade-in">
                  <p className="text-sm font-medium text-amber-200">
                    Выберите разные валюты
                  </p>
                </div>
              )}

              {error && (
                <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center backdrop-blur-sm">
                  <p className="text-sm font-medium text-red-200">
                    {error}
                  </p>
                </div>
              )}

              <div className="mt-2">
                <GetRateButton
                  loading={loading}
                  disabled={!isConvertFormValid}
                  label="Конвертировать"
                />
              </div>
            </form>
          </div>

          {convertedValue && (
            <div className="mt-6 relative overflow-hidden px-6 py-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-3xl text-center shadow-lg backdrop-blur-md">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 blur-2xl rounded-full -mr-10 -mt-10"></div>
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">
                Результат
              </p>
              <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight break-all drop-shadow-sm">
                {convertedValue}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default App;