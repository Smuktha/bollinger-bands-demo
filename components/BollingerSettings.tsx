'use client'

import { useState } from 'react'
import { BollingerSetting, BollingerStyle } from '@/lib/indicators/types'

type Props = {
  settings: BollingerSetting
  style: BollingerStyle
  onClose: () => void
  onChangesettings: (i: BollingerSetting) => void
  onChangeStyle: (s: BollingerStyle) => void
}

export default function BollingerSettings({ settings, style, onClose, onChangesettings, onChangeStyle }: Props) {
  const [tab, setTab] = useState<'settings' | 'style'>('settings')

  return (
    <div className="card-pad">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Bollinger Bands — Settings</h2>
        <button onClick={onClose} className="bg-white/10 hover:bg-white/20">Close</button>
      </div>

      <div className="flex gap-2 mb-4">
        <button className={`tab ${tab === 'settings' ? 'tab-active' : ''}`} onClick={() => setTab('settings')}>settings</button>
        <button className={`tab ${tab === 'style' ? 'tab-active' : ''}`} onClick={() => setTab('style')}>Style</button>
      </div>

      {tab === 'settings' ? (
        <settingsTab settings={settings} onChange={onChangesettings} />
      ) : (
        <StyleTab style={style} onChange={onChangeStyle} />
      )}
    </div>
  )
}

function settingsTab({ settings, onChange }: { settings: BollingerSetting, onChange: (i: BollingerSetting) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1">
        <label>Length</label>
        <input type="number" value={settings.length} min={1}
          onChange={e => onChange({ ...settings, length: Number(e.target.value) })} />
      </div>
      <div className="space-y-1">
        <label>Basic MA Type</label>
        <select value={settings.maType} onChange={e => onChange({ ...settings, maType: e.target.value as 'SMA' })}>
          <option value="SMA">SMA</option>
        </select>
      </div>
      <div className="space-y-1">
        <label>Source</label>
        <select value={settings.source} onChange={e => onChange({ ...settings, source: e.target.value as 'close' })}>
          <option value="close">Close</option>
        </select>
      </div>
      <div className="space-y-1">
        <label>StdDev (multiplier)</label>
        <input type="number" step="0.1" value={settings.multiplier}
          onChange={e => onChange({ ...settings, multiplier: Number(e.target.value) })} />
      </div>
      <div className="space-y-1">
        <label>Offset</label>
        <input type="number" step="1" value={settings.offset}
          onChange={e => onChange({ ...settings, offset: Number(e.target.value) })} />
      </div>
    </div>
  )
}

function ColorInput({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-36" />
    </div>
  )
}

function LineStyleSelect({ value, onChange }: { value: 'solid' | 'dashed', onChange: (v: 'solid' | 'dashed') => void }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value as any)}>
      <option value="solid">Solid</option>
      <option value="dashed">Dashed</option>
    </select>
  )
}

function StyleRow({
  title, visible, onToggle, color, onColor, width, onWidth, lineStyle, onLineStyle
}: {
  title: string
  visible: boolean
  onToggle: (v: boolean) => void
  color: string
  onColor: (v: string) => void
  width: number
  onWidth: (v: number) => void
  lineStyle: 'solid' | 'dashed'
  onLineStyle: (v: 'solid' | 'dashed') => void
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={visible} onChange={e => onToggle(e.target.checked)} />
        <span className="text-sm">{title}</span>
      </div>
      <ColorInput value={color} onChange={onColor} />
      <div>
        <label className="block">Line width</label>
        <input type="number" min={1} max={5} value={width} onChange={e => onWidth(Number(e.target.value))} />
      </div>
      <div>
        <label className="block">Line style</label>
        <LineStyleSelect value={lineStyle} onChange={onLineStyle} />
      </div>
      <div className="text-xs text-neutral-400">{lineStyle === 'dashed' ? 'Dash: 6, Gap: 4' : 'Solid'}</div>
    </div>
  )
}

function StyleTab({ style, onChange }: { style: BollingerStyle, onChange: (s: BollingerStyle) => void }) {
  return (
    <div className="space-y-6">
      <StyleRow
        title="Basis (Middle)"
        visible={style.basis.visible}
        onToggle={(v) => onChange({ ...style, basis: { ...style.basis, visible: v } })}
        color={style.basis.color}
        onColor={(v) => onChange({ ...style, basis: { ...style.basis, color: v } })}
        width={style.basis.width}
        onWidth={(v) => onChange({ ...style, basis: { ...style.basis, width: v } })}
        lineStyle={style.basis.lineStyle}
        onLineStyle={(v) => onChange({ ...style, basis: { ...style.basis, lineStyle: v } })}
      />
      <hr />
      <StyleRow
        title="Upper Band"
        visible={style.upper.visible}
        onToggle={(v) => onChange({ ...style, upper: { ...style.upper, visible: v } })}
        color={style.upper.color}
        onColor={(v) => onChange({ ...style, upper: { ...style.upper, color: v } })}
        width={style.upper.width}
        onWidth={(v) => onChange({ ...style, upper: { ...style.upper, width: v } })}
        lineStyle={style.upper.lineStyle}
        onLineStyle={(v) => onChange({ ...style, upper: { ...style.upper, lineStyle: v } })}
      />
      <hr />
      <StyleRow
        title="Lower Band"
        visible={style.lower.visible}
        onToggle={(v) => onChange({ ...style, lower: { ...style.lower, visible: v } })}
        color={style.lower.color}
        onColor={(v) => onChange({ ...style, lower: { ...style.lower, color: v } })}
        width={style.lower.width}
        onWidth={(v) => onChange({ ...style, lower: { ...style.lower, width: v } })}
        lineStyle={style.lower.lineStyle}
        onLineStyle={(v) => onChange({ ...style, lower: { ...style.lower, lineStyle: v } })}
      />
      <hr />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={style.background.visible} onChange={e => onChange({ ...style, background: { ...style.background, visible: e.target.checked } })} />
          <span className="text-sm">Background fill (Upper ↔ Lower)</span>
        </div>
        <div>
          <label className="block">Background color</label>
          <ColorInput value={style.background.color} onChange={(v) => onChange({ ...style, background: { ...style.background, color: v } })} />
        </div>
        <div>
          <label className="block">Opacity (0–1)</label>
          <input type="number" step="0.05" min={0} max={1} value={style.background.opacity} onChange={e => onChange({ ...style, background: { ...style.background, opacity: Number(e.target.value) } })} />
        </div>
      </div>
    </div>
  )
}
