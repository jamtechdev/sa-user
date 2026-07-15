import { MARKETS, type Market } from '../data/markets';
import type { BidSession } from '../components/BidFooter';

export type SessionPhase = 'pre-open' | 'between' | 'after-close';

export type MarketSessionGate = {
  phase: SessionPhase;
  openEnabled: boolean;
  closeEnabled: boolean;
  /** When set, UI must force this session */
  forced: BidSession | null;
  hint: string;
};

/** "10:00 AM" → minutes from midnight */
function parseClock(label: string): number {
  const m = label.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return 0;
  let h = Number(m[1]);
  const min = Number(m[2]);
  const ap = m[3].toUpperCase();
  if (ap === 'AM') {
    if (h === 12) h = 0;
  } else if (h !== 12) {
    h += 12;
  }
  return h * 60 + min;
}

export function getMarketById(marketId: string): Market | undefined {
  return MARKETS.find((m) => m.id === marketId);
}

/**
 * Before Open → Open + Close both available
 * Between Open & Close → Open locked, Close auto-selected
 * After Close → both locked
 */
export function getMarketSessionGate(
  marketId: string,
  now: Date = new Date()
): MarketSessionGate {
  const market = getMarketById(marketId);
  if (!market) {
    return {
      phase: 'pre-open',
      openEnabled: true,
      closeEnabled: true,
      forced: null,
      hint: 'Open ya Close choose karo',
    };
  }

  const openM = parseClock(market.openTime);
  const closeM = parseClock(market.closeTime);
  const nowM = now.getHours() * 60 + now.getMinutes();
  const overnight = closeM <= openM;

  let phase: SessionPhase;

  if (!overnight) {
    if (nowM < openM) phase = 'pre-open';
    else if (nowM < closeM) phase = 'between';
    else phase = 'after-close';
  } else {
    // e.g. open 21:00, close 02:00
    // pre-open: from close until open (02:00 .. 21:00)
    // between: open → midnight OR midnight → close
    if (nowM >= closeM && nowM < openM) phase = 'pre-open';
    else phase = 'between';
  }

  if (phase === 'pre-open') {
    return {
      phase,
      openEnabled: true,
      closeEnabled: true,
      forced: null,
      hint: `Open ${market.openTime} se pehle · Open / Close dono`,
    };
  }

  if (phase === 'between') {
    return {
      phase,
      openEnabled: false,
      closeEnabled: true,
      forced: 'close',
      hint: `Open ho chuka (${market.openTime}) · ab sirf Close`,
    };
  }

  return {
    phase,
    openEnabled: false,
    closeEnabled: false,
    forced: null,
    hint: `Close ho chuka (${market.closeTime}) · bidding band`,
  };
}
