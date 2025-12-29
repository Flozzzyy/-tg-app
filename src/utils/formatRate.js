import { CURRENCY_MAP } from '../constants/currencies';

export const formatRate = (value, currencyCode) => {
  if (value === null || value === undefined) return '';

  const formattedValue = Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const currency = CURRENCY_MAP[currencyCode?.toUpperCase()];
  const symbol = currency?.symbol || '';
  const name = currency?.name || currencyCode;

  return symbol
    ? `${formattedValue}\u00A0${symbol}`
    : `${formattedValue} (${name})`;
};

