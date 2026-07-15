import React from 'react';
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';
import { colors } from '../theme';

type IconProps = {
  size?: number;
  color?: string;
};

export function ClockIcon({ size = 14, color = colors.gold }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <Path d="M12 7v5l3.5 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function WalletIcon({ size = 24, color = colors.gold }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"
        stroke={color}
        strokeWidth="1.8"
      />
      <Path d="M16 13.5h3.5v2H16a1 1 0 0 1 0-2z" fill={color} />
      <Path d="M3 9h18" stroke={color} strokeWidth="1.8" />
    </Svg>
  );
}

export function DepositIcon({ size = 22, color = colors.live }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.8" />
      <Path
        d="M12 7v7M12 14l-3-3M12 14l3-3"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function WithdrawIcon({ size = 22, color = colors.gold }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.8" />
      <Path
        d="M12 17V10M12 10l-3 3M12 10l3 3"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 20, color = colors.textMuted }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 6l6 6-6 6"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function LogoutIcon({ size = 20, color = colors.gold }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 7V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-2"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <Path
        d="M4 12h10M10 8l4 4-4 4"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SingleDigitIcon({ size = 28, color = colors.gold }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Rect x="10" y="8" width="28" height="32" rx="8" stroke={color} strokeWidth="2.2" />
      <Path d="M24 16v16" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}

export function DoubleDigitIcon({ size = 28, color = colors.gold }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Rect x="6" y="10" width="16" height="28" rx="6" stroke={color} strokeWidth="2" />
      <Rect x="26" y="10" width="16" height="28" rx="6" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

export function JodiIcon({ size = 28, color = colors.gold }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle cx="18" cy="24" r="9" stroke={color} strokeWidth="2.2" />
      <Circle cx="30" cy="24" r="9" stroke={color} strokeWidth="2.2" />
    </Svg>
  );
}

export function SinglePanaIcon({ size = 28, color = colors.gold }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <G>
        <Circle cx="14" cy="18" r="5.5" stroke={color} strokeWidth="2" />
        <Circle cx="34" cy="18" r="5.5" stroke={color} strokeWidth="2" />
        <Circle cx="24" cy="34" r="5.5" stroke={color} strokeWidth="2" />
      </G>
    </Svg>
  );
}

export function DoublePanaIcon({ size = 28, color = colors.gold }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle cx="16" cy="24" r="6.5" stroke={color} strokeWidth="2" />
      <Circle cx="28" cy="24" r="6.5" stroke={color} strokeWidth="2" />
      <Circle cx="36" cy="24" r="4.5" fill={color} opacity={0.85} />
    </Svg>
  );
}

export function PanaFamilyIcon({ size = 28, color = colors.gold }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle cx="24" cy="15" r="5.5" stroke={color} strokeWidth="2" />
      <Circle cx="13" cy="33" r="5" stroke={color} strokeWidth="2" />
      <Circle cx="35" cy="33" r="5" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

export function LogoMark({ size = 56 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Circle cx="32" cy="32" r="30" stroke={colors.gold} strokeWidth="2.5" />
      <Circle cx="32" cy="32" r="24" fill={colors.bgElevated} stroke={colors.goldMuted} strokeWidth="1.5" />
      <Path
        d="M20 40V24l12 14 12-14v16"
        stroke={colors.gold}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Unused in this theme but kept for type-safety if referenced */
export function SunIcon(p: IconProps) {
  return <ClockIcon {...p} />;
}
export function MiddayIcon(p: IconProps) {
  return <ClockIcon {...p} />;
}
export function MoonIcon(p: IconProps) {
  return <ClockIcon {...p} />;
}

export function BidsIcon({ size = 24, color = colors.gold }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 6h13M8 12h13M8 18h13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M3.5 6h.01M3.5 12h.01M3.5 18h.01"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function PassbookIcon({ size = 24, color = colors.gold }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3V4z"
        stroke={color}
        strokeWidth="1.8"
      />
      <Path d="M9 9h7M9 13h5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function HomeIcon({ size = 24, color = colors.gold }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"
        stroke={color}
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function FundsIcon({ size = 24, color = colors.gold }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
      <Path
        d="M12 7v10M9.5 9.5c0-1.2 1.1-2 2.5-2s2.5.8 2.5 2-1.1 2-2.5 2-2.5.8-2.5 2 1.1 2 2.5 2 2.5-.8 2.5-2"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function SupportIcon({ size = 24, color = colors.gold }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21a9 9 0 1 1 9-9"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <Path
        d="M12 8.5a2.5 2.5 0 0 1 2.4 3.2c-.4 1-1.5 1.5-2 2.3-.2.4-.3.8-.3 1.2"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <Circle cx="12" cy="17.5" r="1" fill={color} />
      <Path
        d="M18 14v4h3"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
