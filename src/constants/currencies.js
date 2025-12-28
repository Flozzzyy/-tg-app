export const CURRENCIES = [
  { code: 'USD', name: 'Доллар США', symbol: '$' },
  { code: 'EUR', name: 'Евро', symbol: '€' },
  { code: 'GBP', name: 'Фунт стерлингов', symbol: '£' },
  { code: 'JPY', name: 'Японская иена', symbol: '¥' },
  { code: 'CNY', name: 'Китайский юань', symbol: '¥' },
  { code: 'RUB', name: 'Российский рубль', symbol: '₽' },
  { code: 'AUD', name: 'Австралийский доллар', symbol: 'A$' },
  { code: 'CAD', name: 'Канадский доллар', symbol: 'C$' },
  { code: 'CHF', name: 'Швейцарский франк', symbol: '₣' },
];

export const CURRENCY_MAP = CURRENCIES.reduce((acc, currency) => {
  acc[currency.code] = currency;
  return acc;
}, {});

