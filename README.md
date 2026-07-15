# GEME

Expo SDK **54** app for Kalyan markets with full game play screens.

## Features

- Register & Login (local AsyncStorage)
- Markets: Kalyan Morning / Mid Day / Mid Night
- Games with real play boards:
  - **Single Digit** — 0–9 grid
  - **Double Digit** — 00–99 board
  - **Jodi** — 00–99 jodi picker
  - **Single Pana** — 120 panas + type/filter
  - **Double Pana** — 90 double panas + type/filter
  - **Pana Family** — pick family digit → related panas / Select All
- Bright neon UI + spring animations (Reanimated)
- Target display refresh **90–120 Hz** (`CADisableMinimumFrameDurationOnPhone`)

## Run

```bash
cd geme
npm start
```

Provider app: `../provider` (alag folder).

Then `i` / `a` or Expo Go QR.
