export type OHLCV = {
  timestamp: number | string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export type BollingerSetting = {
  length: number
  maType: 'SMA'
  source: 'close'
  multiplier: number
  offset: number
}

export const DefaultBollingerSetting: BollingerSetting = {
  length: 20,
  maType: 'SMA',
  source: 'close',
  multiplier: 2,
  offset: 0,
}

export type LineStyle = 'solid' | 'dashed'

export type LineConfig = {
  visible: boolean
  color: string
  width: number
  lineStyle: LineStyle
}

export type BackgroundConfig = {
  visible: boolean
  color: string
  opacity: number // 0..1
}

export type BollingerStyle = {
  basis: LineConfig
  upper: LineConfig
  lower: LineConfig
  background: BackgroundConfig
}

export const DefaultBollingerStyle: BollingerStyle = {
  basis: { visible: true, color: '#7DD3FC', width: 2, lineStyle: 'solid' },
  upper: { visible: true, color: '#FCA5A5', width: 2, lineStyle: 'dashed' },
  lower: { visible: true, color: '#86EFAC', width: 2, lineStyle: 'dashed' },
  background: { visible: true, color: '#60A5FA', opacity: 0.12 }
}
