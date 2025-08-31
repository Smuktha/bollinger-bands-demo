// /lib/indicators/types.ts

// ---- settings ----
export interface BollingerSetting {
  length: number
  maType: 'SMA' // for now only SMA supported
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

// ---- Style ----
export interface BollingerLineStyle {
  visible: boolean
  color: string
  lineWidth: number
  lineStyle: 'solid' | 'dashed'
}

export interface BollingerStyle {
  basis: BollingerLineStyle
  upper: BollingerLineStyle
  lower: BollingerLineStyle
  background: {
    visible: boolean
    color: string
    opacity: number
  }
}

export const DefaultBollingerStyle: BollingerStyle = {
  basis: {
    visible: true,
    color: '#2962FF',
    lineWidth: 1,
    lineStyle: 'solid',
  },
  upper: {
    visible: true,
    color: '#FF6D00',
    lineWidth: 1,
    lineStyle: 'solid',
  },
  lower: {
    visible: true,
    color: '#00C853',
    lineWidth: 1,
    lineStyle: 'solid',
  },
  background: {
    visible: true,
    color: '#2962FF',
    opacity: 0.1,
  },
}
