export type MarketStatus = 'live' | 'closed';

export type Market = {
  id: string;
  name: string;
  openTime: string;
  closeTime: string;
  status: MarketStatus;
  index: number;
};

export type Game = {
  id: string;
  name: string;
  hint: string;
  icon: string;
  tint: string;
};

export type User = {
  id: string;
  name: string;
  mobile: string;
  password: string;
};

export const MARKETS: Market[] = [
  // Open pehle ho chuka · Close abhi baaki → session pe sirf CLOSE
  {
    id: 'kalyan-morning',
    name: 'Kalyan Morning',
    openTime: '09:00 AM',
    closeTime: '08:00 PM',
    status: 'live',
    index: 1,
  },
  {
    id: 'milan-day',
    name: 'Milan Day',
    openTime: '10:30 AM',
    closeTime: '07:30 PM',
    status: 'live',
    index: 2,
  },
  // Open abhi aana hai → Open + Close DONO available
  {
    id: 'kalyan-evening',
    name: 'Kalyan Evening',
    openTime: '06:00 PM',
    closeTime: '09:30 PM',
    status: 'live',
    index: 3,
  },
  {
    id: 'rajdhani-night',
    name: 'Rajdhani Night',
    openTime: '08:15 PM',
    closeTime: '11:45 PM',
    status: 'live',
    index: 4,
  },
  // Close bhi ho chuka → bidding band
  {
    id: 'time-bazar',
    name: 'Time Bazar',
    openTime: '08:00 AM',
    closeTime: '10:00 AM',
    status: 'closed',
    index: 5,
  },
];

export const GAMES: Game[] = [
  {
    id: 'single-digit',
    name: 'Single Digit',
    hint: '',
    icon: 'single-digit',
    tint: '#F0C14A',
  },
  {
    id: 'jodi',
    name: 'Jodi',
    hint: '',
    icon: 'jodi',
    tint: '#E8A838',
  },
  {
    id: 'double-digit',
    name: 'Double Digit',
    hint: '',
    icon: 'double-digit',
    tint: '#D4A84B',
  },
  {
    id: 'single-pana',
    name: 'Single Pana',
    hint: '',
    icon: 'single-pana',
    tint: '#C9A227',
  },
  {
    id: 'double-pana',
    name: 'Double Pana',
    hint: '',
    icon: 'double-pana',
    tint: '#B8923A',
  },
  {
    id: 'triple-pana',
    name: 'Triple Pana',
    hint: '',
    icon: 'triple-pana',
    tint: '#E8B84A',
  },
  {
    id: 'pana-family',
    name: 'Pana Family',
    hint: '',
    icon: 'pana-family',
    tint: '#F5D76E',
  },
  {
    id: 'full-sangam',
    name: 'Full Sangam',
    hint: '',
    icon: 'full-sangam',
    tint: '#F0C14A',
  },
  {
    id: 'half-sangam-a',
    name: 'Half Sangam (A)',
    hint: '',
    icon: 'half-sangam',
    tint: '#E8A838',
  },
  {
    id: 'half-sangam-b',
    name: 'Half Sangam (B)',
    hint: '',
    icon: 'half-sangam',
    tint: '#D4A84B',
  },
  {
    id: 'single-digit-bulk',
    name: 'Single Digit Bulk',
    hint: '',
    icon: 'bulk',
    tint: '#C9A227',
  },
  {
    id: 'single-pana-bulk',
    name: 'Single Pana Bulk',
    hint: '',
    icon: 'bulk',
    tint: '#B8923A',
  },
  {
    id: 'double-pana-bulk',
    name: 'Double Pana Bulk',
    hint: '',
    icon: 'bulk',
    tint: '#E8B84A',
  },
  {
    id: 'triple-pana-bulk',
    name: 'Triple Pana Bulk',
    hint: '',
    icon: 'bulk',
    tint: '#F0C14A',
  },
  {
    id: 'two-digit-pana',
    name: 'Two Digit Pana',
    hint: '',
    icon: 'two-digit-pana',
    tint: '#F5D76E',
  },
];
