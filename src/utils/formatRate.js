import { CURRENCY_MAP } from '../constants/currencies';

export const formatRate = (value, currencyCode) => {
  if (value === null || value === undefined) return '';
  
  const formattedValue = Number(value).toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  });

  const currency = CURRENCY_MAP[currencyCode?.toUpperCase()];
  const symbol = currency?.symbol || '';
  const name = currency?.name || currencyCode;

  return symbol 
    ? `${formattedValue}\u00A0${symbol}`
    : `${formattedValue} (${name})`;
};

