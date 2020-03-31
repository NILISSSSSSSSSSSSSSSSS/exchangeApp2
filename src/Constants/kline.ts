export const PERIOD: KeyStr = {
  '1': '1m',
  '5': '5m',
  '15': '15m',
  '30': '30m',
  '60': '1h',
  '1D': '1d',
  W: 'WEEK_1',
  M: 'MONTH_1',

  MIN_1: '1',
  MIN_5: '5',
  MIN_15: '15',
  MIN_30: '30',
  HOUR_1: '60',
  DAY_1: 'D',
  WEEK_1: 'W',
  MONTH_1: 'M'
}

interface KeyStr {
  [key: string]: string
}