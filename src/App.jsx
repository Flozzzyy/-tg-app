import { useState } from 'react';
import { CurrencySelector } from './components/CurrencySelector';
import { SwapButton } from './components/SwapButton';
import { RateDisplay } from './components/RateDisplay';
import { GetRateButton } from './components/GetRateButton';
import { formatRate } from './utils/formatRate';
import axios from 'axios';

const API_URL = 'https://open.er-api.com/v6/latest';

const App = () => {
  // Общие состояния для выбора валют
  const [base, setBase] = useState('');
  const [target, setTarget] = useState('');

  // Состояния для режима "курс"
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Состояния для режима "конвертер"
  const [mode, setMode] = useState('rate');
  const [amount, setAmount] = useState('');
  const [convertedValue, setConvertedValue] = useState('');

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
      const { data } = await axios.get(`${API_URL}/${base.toUpperCase()}`);
      const foundRate = data.rates[target.toUpperCase()];

      if (!foundRate) {
        setError('Не удалось найти курс');
        setLoading(false);
        return;
      }

      const formattedRate = formatRate(foundRate, target);
      setRate(formattedRate);
      setLoading(false);
    } catch (err) {
      setError('Ошибка при загрузке курса');
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

    setLoading(true);
    setError(null);
    setConvertedValue('');

    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/${base.toUpperCase()}`);
      const foundRate = data.rates[target.toUpperCase()];

      if (!foundRate) {
        setError('Не удалось найти курс');
        setLoading(false);
        return;
      }

      const converted = numAmount * foundRate;
      const formatted = formatRate(converted, target);
      setConvertedValue(formatted);
      setLoading(false);
    } catch (err) {
      setError('Ошибка при конвертации');
      setLoading(false);
    }
  };
  const isFormValid = Boolean(base && target && base !== target);
  const showSameCurrencyWarning = base && target && base === target;

  return (
    // Глобальный контейнер с темным градиентом
    <div className="min-h-screen font-poppins bg-slate-950 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-white px-4 py-6 selection:bg-indigo-500/30">

      {/* Декоративное пятно на фоне (Glow effect) */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div>
        <button onClick={() => setMode('rate')}>rate</button>
        <button onClick={() => setMode('converter')}>converter</button>
      </div>
      {mode === 'rate' ? (<div className="relative max-w-md mx-auto z-10 pt-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-400 mb-2 tracking-tight">
            Курс Валют
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Актуальный обменный курс
          </p>
        </div>

        {/* Карточка-контейнер с эффектом стекла */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl ring-1 ring-white/5">
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
      </div>) : (
        <div>
          <h1>converter</h1>
          <form onSubmit={handleConvertSubmit}>
            <input
              type="text"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Сумма"
            />
            <select value={base} onChange={e => setBase(e.target.value)}>
              <option value="">Базовая валюта</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="RUB">RUB</option>
              {/* Добавьте нужные валюты */}
            </select>
            <SwapButton onClick={handleSwap} />
            <input
              type="text"
              value={convertedValue}
              readOnly
              placeholder="Итог"
            />
            <select value={target} onChange={e => setTarget(e.target.value)}>
              <option value="">Целевая валюта</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="RUB">RUB</option>
              {/* Добавьте нужные валюты */}
            </select>
            <button type='submit'>convert</button>
          </form>
        </div>
      )}

    </div>
  );
};

export default App;