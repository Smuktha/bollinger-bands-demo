'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { DefaultBollingerSetting, DefaultBollingerStyle, BollingerSetting, BollingerStyle } from '@/lib/indicators/types'

const Chart = dynamic(() => import('@/components/Chart'), { ssr: false })

export default function Page() {
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setsettings] = useState<BollingerSetting>(DefaultBollingerSetting)
  const [style, setStyle] = useState<BollingerStyle>(DefaultBollingerStyle)

  return (
    <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-4">
      <header className="flex items-center justify-between">
<h1 className="text-xl font-bold mb-4 font-serif italic">
 Bollinger Bands Visualizer
</h1>
        <div className="flex items-center gap-2">
          <span className="badge">KLineCharts</span>
          <span className="badge">Next.js + TS + Tailwind</span>
          <button onClick={() => setShowSettings(true)} className="bg-white/10 hover:bg-white/20">Settings</button>
        </div>
      </header>

      <div className="card card-pad">
        <Chart
          settings={settings}
          style={style}
          onOpenSettings={() => setShowSettings(true)}
          onUpdatesettings={setsettings}
          onUpdateStyle={setStyle}
        />
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/70 grid place-items-center p-4 z-50">
          <div className="card w-full max-w-3xl">
            <BollingerSettings
              settings={settings}
              style={style}
              onClose={() => setShowSettings(false)}
              onChangesettings={setsettings}
              onChangeStyle={setStyle}
            />
          </div>
        </div>
      )}
    </main>
  )
}

import BollingerSettings from '@/components/BollingerSettings'
