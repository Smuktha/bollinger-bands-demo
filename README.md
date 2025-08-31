# FindScan — Bollinger Bands (KLineCharts)

Production-ready Bollinger Bands indicator built with **Next.js + TypeScript + TailwindCSS + KLineCharts** (no other chart libraries).

https://klinecharts.com/en-US/

## Quickstart

```bash
npm i
npm run dev
```

Then open http://localhost:3000

## Features (per assignment)
- Candlestick chart (KLineCharts) with **custom Bollinger Bands (Basis/Upper/Lower + background fill)**.
- **Settings modal** with **settings** and **Style** tabs (TradingView-inspired):
  - settings: `Length` (20), `Basic MA Type` (SMA), `Source` (Close), `Deviation Multiplier` (2), `Offset` (0)
  - Style: visibility, color, line width, line style (solid/dashed) for each band; background fill with opacity
- Tooltip/crosshair shows Basis/Upper/Lower for hovered candle via indicator values.
- Smooth, instant updates on settings changes.
- Demo data at **/public/data/ohlcv.json** with 300 candles.

## Formulas
- **Basis (middle) = SMA(close, length)**
- **StdDev** = population standard deviation (divide by N). We use the last `length` closes.
- **Upper = Basis + (multiplier × StdDev)**
- **Lower = Basis − (multiplier × StdDev)**
- **Offset**: shift all three series by `offset` bars forward (positive moves into the future).

See implementation in `lib/indicators/bollinger.ts`:
- `sma(values, length)` — rolling SMA
- `stdDev(values)` — population standard deviation
- `calculateBollinger(closes, { length, multiplier, offset })` — full bands

## KLineCharts version
- Declared in `package.json`: **^9.8.7**

## Project Structure
```
/app
  layout.tsx
  page.tsx                # renders chart + settings modal
/components
  Chart.tsx               # KLineCharts init + indicator registration + updates
  BollingerSettings.tsx   # Settings UI (settings/Style)
/lib/indicators
  bollinger.ts            # calculateBollinger + helpers
  types.ts                # types + default settings
/public/data/ohlcv.json   # demo OHLCV data (300 candles)
styles/globals.css        # Tailwind styles (dark UI)
```

## Notes & Trade-offs
- **Background Fill**: implemented via a custom polygon figure inside the indicator. Opacity/color is configurable.
- **Visibility Toggles**: implemented by switching color to transparent and width to ~0, which KLineCharts treats as hidden.
- **Only SMA** is exposed for MA type (per assignment). Source is **Close** only.
- KLineCharts has its own BOLL, but **we register a custom indicator (`FS_BOLL`)** to control UI and styles.
- The code is modular and type-safe. The indicator math is isolated in `lib/`.
- Works smoothly with 200–1,000 candles; data and settings changes re-render instantly.

## Screenshots / GIF
Include two screenshots or a GIF after running locally:
1. Full chart with bands visible.
2. Settings modal open (settings + Style).

## Optional Deploy
You can deploy to Vercel/Netlify as usual. No paid components, KLineCharts only.
