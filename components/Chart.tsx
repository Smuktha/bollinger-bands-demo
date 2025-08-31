'use client'

import { useEffect, useRef } from 'react'
import type { KLineData, Chart, TechnicalIndicator, Indicator, DeepPartial, IndicatorFigureStylesCallbackData } from 'klinecharts'
import { init, dispose, registerOverlay, registerIndicator } from 'klinecharts'
import { BollingerSetting, BollingerStyle, DefaultBollingerSetting, DefaultBollingerStyle, OHLCV } from '@/lib/indicators/types'
import { calculateBollinger, hexToRgba } from '@/lib/indicators/bollinger'

type Props = {
  settings: BollingerSetting
  style: BollingerStyle
  onOpenSettings: () => void
  onUpdatesettings: (i: BollingerSetting) => void
  onUpdateStyle: (s: BollingerStyle) => void
}

export default function ChartComponent({ settings, style, onOpenSettings }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<Chart | null>(null)
  const indicatorName = useRef('FS_BOLL')

  useEffect(() => {
    if (!containerRef.current) return
    const chart = init(containerRef.current, { styles: { candle: { type: 'candle_solid' }}})
    chartRef.current = chart

    // Load data
    fetch('/data/ohlcv.json').then(r => r.json()).then((rows: OHLCV[]) => {
      const data: KLineData[] = rows.map(r => ({
        timestamp: typeof r.timestamp === 'number' ? r.timestamp : new Date(r.timestamp).getTime(),
        open: r.open, high: r.high, low: r.low, close: r.close, volume: r.volume,
      }))
      chart.applyNewData(data)

      // Register our custom indicator
      registerBoll(chart, indicatorName.current, settings, style)

      // Create instance of indicator in the candle pane (overlay)
      chart.createIndicator(indicatorName.current, false, { id: 'candle_pane', lock: false, drag: false, options: { } })
    })

    const onResize = () => chart.resize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      if (chartRef.current) {
        dispose(chartRef.current.getDom())
        chartRef.current = null
      }
    }
  }, [])

  // Update indicator when settings or style change
  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return
    // re-register with new calc params + styles (override)
    registerBoll(chart, indicatorName.current, settings, style)
    // force repaint
    chart.overrideIndicator({ name: indicatorName.current })
  }, [settings, style])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-400">Candlesticks + Bollinger Bands</div>
        <div className="flex items-center gap-2">
          <button onClick={onOpenSettings} className="bg-white/10 hover:bg-white/20">Indicator Settings</button>
        </div>
      </div>
      <div ref={containerRef} className="w-full h-[540px]" />
    </div>
  )
}

function registerBoll(chart: Chart, name: string, settings: BollingerSetting, style: BollingerStyle) {
  // Remove any previous registration of same name (safe re-register)
  try { (registerIndicator as any).remove?.(name) } catch {}

  registerIndicator({
    name,
    shortName: 'BB',
    series: 'price',
    calcParams: [settings.length, settings.multiplier, settings.offset],
    // Define what values we output
    plots: [
      { key: 'basis', title: 'Basis' },
      { key: 'upper', title: 'Upper' },
      { key: 'lower', title: 'Lower' },
    ],
    // Calculation: based on KLineData list
    calc: (kDataList) => {
      const closes = kDataList.map(d => d.close)
      const res = calculateBollinger(closes, {
        length: settings.length,
        multiplier: settings.multiplier,
        offset: settings.offset
      })
      // Map back to indicator result items
      return res.map(v => (v ? { basis: v.basis, upper: v.upper, lower: v.lower } : {}))
    },
    // Custom render to support background polygon fill
    figures: [
      ...(style.background.visible ? [{
        key: 'bb_fill',
        title: '',
        type: 'polygon'
      } as any] : [])
    ],
    // Style for each plot
    styles: (data: IndicatorFigureStylesCallbackData) => {
      const line = (conf: { color: string, width: number, lineStyle: 'solid'|'dashed', visible: boolean }) => ({
        color: conf.visible ? conf.color : 'rgba(0,0,0,0)',
        size: conf.visible ? conf.width : 0.0001,
        style: conf.lineStyle === 'dashed' ? 'dash' : 'solid',
        dashValue: [6, 4] as [number, number]
      })

      const polyFill = style.background.visible
        ? { color: hexToRgba(style.background.color, style.background.opacity) }
        : { color: 'rgba(0,0,0,0)' }

      return {
        plot: {
          basis: line(style.basis),
          upper: line(style.upper),
          lower: line(style.lower),
        },
        figure: {
          bb_fill: {
            // polygon uses a single color
            color: polyFill.color,
          }
        }
      } as DeepPartial<any>
    },
    // Attach draw function to fill area between upper & lower across the visible range
    // KLineCharts will call draw function for custom figures if type is 'polygon' via figures, but
    // since APIs vary, we also support overlay by providing a safe hook:
    createPointFigures: ({ visibleRange, coordinates, indicator }, _) => {
      if (!style.background.visible) return []
      const points: any[] = []
      const uppers: any[] = []
      const lowers: any[] = []

      for (let i = visibleRange.from; i < visibleRange.to; i++) {
        const c = coordinates[i]
        if (!c) continue
        const u = (c as any).upper
        const l = (c as any).lower
        if (u != null && l != null) {
          uppers.push({ x: c.x, y: u })
          lowers.push({ x: c.x, y: l })
        }
      }
      if (uppers.length < 2 || lowers.length < 2) return []

      // Build polygon path: uppers left->right + lowers right->left
      const polygon = [...uppers, ...lowers.reverse()]
      points.push({ type: 'polygon', attrs: { points: polygon } })
      return points
    },
  } as unknown as TechnicalIndicator)

  // Override styles after registration to ensure immediate effect
  chart.overrideIndicator({
    name,
    shortName: 'BB',
  })
}
