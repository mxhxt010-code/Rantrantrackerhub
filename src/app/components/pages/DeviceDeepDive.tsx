import { useState } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { Zap, Activity, Layers, Thermometer, ChevronDown, ChevronUp, Radio } from 'lucide-react';
import { useStyles } from '../ThemeContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';

const SENSOR_SPECS = [
  {
    id: 'gsr',
    name: 'GALVANIC SKIN RESPONSE',
    shortName: 'GSR',
    Icon: Zap,
    device: 'Anxiety Node + Sleep Mat',
    accentColor: '#8B5CF6',
    accentBg: 'rgba(139,92,246,0.1)',
    frequency: '256 Hz',
    accuracy: '±0.02 µS',
    range: '0.05 — 100 µS',
    interface: 'Ag/AgCl Micro-Electrode Array',
    notes: 'Captures electrodermal activity from the mastoid area, a uniquely low-noise region for GSR due to proximity to the autonomic nervous system.',
    detail: [
      { label: 'Electrode Material', value: 'Medical-grade Ag/AgCl' },
      { label: 'ADC Resolution', value: '24-bit Sigma-Delta' },
      { label: 'Noise Floor', value: '< 0.5 nV/√Hz' },
      { label: 'Bandwidth', value: 'DC – 100 Hz' },
    ],
  },
  {
    id: 'hrv',
    name: 'HRV SENSOR',
    shortName: 'HRV',
    Icon: Activity,
    device: 'Deep Pulse Wristband',
    accentColor: '#10B981',
    accentBg: 'rgba(16,185,129,0.1)',
    frequency: '1000 Hz (ECG-class)',
    accuracy: '± 1ms RR-interval',
    range: '20 – 300 BPM',
    interface: 'Optical PPG + Capacitive ECG Bridge',
    notes: 'Radial artery placement (palm-side) offers 40% lower motion artifact versus dorsal wrist. Combines optical PPG with a capacitive ECG bridge for medical-grade HRV derivation.',
    detail: [
      { label: 'PPG Wavelengths', value: '525nm + 850nm dual LED' },
      { label: 'HRV Metrics', value: 'SDNN, RMSSD, pNN50, LF/HF' },
      { label: 'Motion Compensation', value: '3-axis MEMS accelerometer' },
      { label: 'Clinical Validation', value: 'ISO 81060-2 equivalent' },
    ],
  },
  {
    id: 'textile',
    name: 'CONDUCTIVE TEXTILE MATRIX',
    shortName: 'CTM',
    Icon: Layers,
    device: 'Sleep Mat Sensor',
    accentColor: '#F59E0B',
    accentBg: 'rgba(245,158,11,0.1)',
    frequency: '32 Hz (ambient)',
    accuracy: '2cm spatial resolution',
    range: '2m × 2m coverage',
    interface: '196-point capacitive grid, silver-coated yarn',
    notes: 'Woven from silver-coated polyamide yarn at 0.2mm diameter. A 14×14 capacitive electrode grid creates an ambient electromagnetic field capable of detecting body position, micro-movements, and aggregate skin conductance without physical contact.',
    detail: [
      { label: 'Grid Resolution', value: '14 × 14 (196 nodes)' },
      { label: 'Yarn Resistance', value: '< 100 Ω/cm' },
      { label: 'Wash Cycles', value: '200+ (certified)' },
      { label: 'Thickness', value: '0.6mm (thinner than a credit card)' },
    ],
  },
  {
    id: 'thermal',
    name: 'THERMAL TRACKING',
    shortName: 'THERM',
    Icon: Thermometer,
    device: 'Anxiety Node + Deep Pulse',
    accentColor: '#F87171',
    accentBg: 'rgba(248,113,113,0.1)',
    frequency: '4 Hz',
    accuracy: '±0.05°C',
    range: '28°C — 42°C',
    interface: 'Infrared Thermopile Array (MLX90640-class)',
    notes: 'Surface temperature at the mastoid site and radial artery tracks autonomic thermoregulation in real time. A 2°C drop in less than 90 seconds is a key anxiety-onset marker in the Rantracker model.',
    detail: [
      { label: 'Sensor Type', value: '32×24 thermopile array' },
      { label: 'NETD', value: '< 0.05 K at 1 Hz' },
      { label: 'Field of View', value: '110° × 75°' },
      { label: 'Power Draw', value: '3.6 mW (typical)' },
    ],
  },
];

const RESILIENCE_DATA = [
  { month: 'Jan', hrv: 58, gsr: 42, thermal: 65, resilience: 55 },
  { month: 'Feb', hrv: 62, gsr: 48, thermal: 68, resilience: 59 },
  { month: 'Mar', hrv: 57, gsr: 44, thermal: 63, resilience: 55 },
  { month: 'Apr', hrv: 67, gsr: 53, thermal: 71, resilience: 64 },
  { month: 'May', hrv: 71, gsr: 58, thermal: 73, resilience: 68 },
  { month: 'Jun', hrv: 65, gsr: 55, thermal: 70, resilience: 63 },
  { month: 'Jul', hrv: 75, gsr: 62, thermal: 76, resilience: 71 },
  { month: 'Aug', hrv: 79, gsr: 67, thermal: 79, resilience: 76 },
  { month: 'Sep', hrv: 77, gsr: 65, thermal: 77, resilience: 73 },
  { month: 'Oct', hrv: 83, gsr: 70, thermal: 81, resilience: 79 },
  { month: 'Nov', hrv: 86, gsr: 74, thermal: 84, resilience: 82 },
  { month: 'Dec', hrv: 89, gsr: 77, thermal: 87, resilience: 85 },
];

function CustomTooltip({ active, payload, label, isDark }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-4 py-3 rounded-xl"
      style={{
        background: isDark ? '#1A1A24' : '#FFFFFF',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.1)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#8888A0' : '#6B6B82', marginBottom: 8, letterSpacing: '0.1em' }}>
        {label}
      </div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-3" style={{ marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ fontSize: 12, color: isDark ? 'rgba(241,241,245,0.6)' : 'rgba(10,10,18,0.6)' }}>{p.name}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#F1F1F5' : '#0A0A12', marginLeft: 'auto' }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function SensorRow({ spec, isDark, divider }: { spec: typeof SENSOR_SPECS[0]; isDark: boolean; divider: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="cursor-pointer transition-all"
        onClick={() => setExpanded(e => !e)}
        style={{
          borderBottom: `1px solid ${divider}`,
          background: expanded ? (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)') : 'transparent',
        }}
      >
        {/* Sensor Name */}
        <td className="py-5 px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: spec.accentBg }}>
              <spec.Icon style={{ width: 15, height: 15, color: spec.accentColor }} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', color: spec.accentColor }}>
                {spec.name}
              </div>
              <div style={{ fontSize: 13, color: isDark ? '#8888A0' : '#6B6B82', marginTop: 1 }}>
                in {spec.device}
              </div>
            </div>
          </div>
        </td>

        {/* Frequency */}
        <td className="py-5 px-6">
          <span style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#F1F1F5' : '#0A0A12' }}>
            {spec.frequency}
          </span>
        </td>

        {/* Accuracy */}
        <td className="py-5 px-6">
          <span style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#F1F1F5' : '#0A0A12' }}>
            {spec.accuracy}
          </span>
        </td>

        {/* Range */}
        <td className="py-5 px-6">
          <span style={{ fontSize: 13, color: isDark ? '#8888A0' : '#6B6B82' }}>{spec.range}</span>
        </td>

        {/* Interface */}
        <td className="py-5 px-6">
          <span style={{ fontSize: 12, color: isDark ? '#8888A0' : '#6B6B82' }}>{spec.interface}</span>
        </td>

        {/* Expand */}
        <td className="py-5 px-6">
          {expanded
            ? <ChevronUp style={{ width: 16, height: 16, color: spec.accentColor }} />
            : <ChevronDown style={{ width: 16, height: 16, color: isDark ? '#555568' : '#A0A0B0' }} />
          }
        </td>
      </tr>

      {/* Expanded Detail */}
      {expanded && (
        <tr style={{ background: isDark ? 'rgba(139,92,246,0.03)' : 'rgba(109,40,217,0.02)' }}>
          <td colSpan={6} className="px-6 py-5">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p style={{ fontSize: 13, lineHeight: 1.8, color: isDark ? '#8888A0' : '#6B6B82' }}>
                  {spec.notes}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {spec.detail.map(d => (
                  <div
                    key={d.label}
                    className="px-4 py-3 rounded-xl"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                    }}
                  >
                    <div style={{ fontSize: 11, color: isDark ? '#555568' : '#A0A0B0', marginBottom: 3 }}>{d.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#F1F1F5' : '#0A0A12' }}>{d.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function DeviceDeepDive() {
  const s = useStyles();

  return (
    <div>
      {/* ─── Hero ─── */}
      <section
        style={{
          background: s.isDark
            ? 'radial-gradient(ellipse 1000px 600px at 50% -50px, rgba(139,92,246,0.1) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 1000px 600px at 50% -50px, rgba(109,40,217,0.06) 0%, transparent 70%)',
        }}
      >
        <div className="max-w-[1440px] mx-auto px-10 pt-20 pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-6">
              <Radio style={{ width: 14, height: 14, color: s.isDark ? '#8B5CF6' : '#6D28D9' }} />
              <span style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, color: s.isDark ? '#8B5CF6' : '#6D28D9' }}>
                DEVICE DEEP DIVE
              </span>
            </div>
            <h1
              style={{
                fontSize: 72,
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.02,
                color: s.isDark ? '#F1F1F5' : '#0A0A12',
                maxWidth: 700,
                marginBottom: 18,
              }}
            >
              Inside the hardware.
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: s.isDark ? '#8888A0' : '#6B6B82', maxWidth: 520 }}>
              Sensor specifications, charging architecture, and your personal resilience metrics — in full technical detail.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Sensor Specs Table ─── */}
      <section style={{ borderTop: `1px solid ${s.divider}` }}>
        <div className="max-w-[1440px] mx-auto px-10 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, color: s.isDark ? '#8B5CF6' : '#6D28D9', display: 'block', marginBottom: 10 }}>
                SENSOR SPECIFICATIONS
              </span>
              <h2 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', color: s.isDark ? '#F1F1F5' : '#0A0A12', lineHeight: 1.1 }}>
                Four sensors.
                <br />
                One unified system.
              </h2>
            </div>
            <p style={{ fontSize: 13, color: s.isDark ? '#8888A0' : '#6B6B82', maxWidth: 240, textAlign: 'right', lineHeight: 1.7 }}>
              Click any row to expand full technical specifications for each sensor module.
            </p>
          </div>

          {/* Table */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: `1px solid ${s.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
              boxShadow: s.isDark ? '0 20px 60px rgba(0,0,0,0.4)' : '0 4px 32px rgba(0,0,0,0.06)',
            }}
          >
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: s.isDark ? '#0D0D15' : '#F5F5FA' }}>
                  {['Sensor Module', 'Sample Rate', 'Accuracy', 'Range', 'Interface', ''].map(h => (
                    <th
                      key={h}
                      className="py-4 px-6 text-left"
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        color: s.isDark ? '#555568' : '#A0A0B0',
                        borderBottom: `1px solid ${s.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody style={{ background: s.isDark ? '#111118' : '#FFFFFF' }}>
                {SENSOR_SPECS.map(spec => (
                  <SensorRow key={spec.id} spec={spec} isDark={s.isDark} divider={s.divider} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── Charging Hub ─── */}
      <section style={{ borderTop: `1px solid ${s.divider}` }}>
        <div className="max-w-[1440px] mx-auto px-10 py-24">
          <div className="grid grid-cols-2 gap-20 items-center">
            {/* Image */}
            <div className="relative">
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  height: 480,
                  background: s.isDark ? '#0D0D15' : '#F5F5FA',
                  border: `1px solid ${s.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
                  boxShadow: s.isDark ? '0 30px 80px rgba(0,0,0,0.5)' : '0 8px 48px rgba(0,0,0,0.08)',
                }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1608613607929-137593b93a9b?w=900&q=85"
                  alt="Wireless Inductive Charging Hub"
                  className="w-full h-full object-cover"
                  style={{ filter: s.isDark ? 'brightness(0.8) saturate(0.85)' : 'brightness(0.98)' }}
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: s.isDark
                      ? 'linear-gradient(to top, rgba(9,9,14,0.7) 0%, transparent 50%)'
                      : 'linear-gradient(to top, rgba(255,255,255,0.5) 0%, transparent 50%)',
                  }}
                />

                {/* Charging status pill */}
                <div
                  className="absolute bottom-6 left-6 flex items-center gap-3 px-5 py-3 rounded-2xl"
                  style={{
                    background: s.isDark ? 'rgba(9,9,14,0.8)' : 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(16px)',
                    border: `1px solid ${s.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                  }}
                >
                  <div className="flex gap-1.5">
                    {[
                      { name: 'Node', color: '#8B5CF6', charge: 94 },
                      { name: 'Pulse', color: '#10B981', charge: 78 },
                      { name: 'Mat', color: '#F59E0B', charge: 100 },
                    ].map(d => (
                      <div key={d.name} className="flex items-center gap-2">
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: d.color, boxShadow: `0 0 6px ${d.color}` }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: d.color }}>{d.charge}%</span>
                        <span style={{ fontSize: 11, color: s.isDark ? '#8888A0' : '#6B6B82', marginRight: 6 }}>{d.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Copy */}
            <div>
              <span style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, color: '#8B5CF6', display: 'block', marginBottom: 16 }}>
                POWER ARCHITECTURE
              </span>
              <h2
                style={{
                  fontSize: 52,
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.08,
                  color: s.isDark ? '#F1F1F5' : '#0A0A12',
                  marginBottom: 20,
                }}
              >
                Wireless.
                <br />
                All three.
                <br />
                <span style={{ color: '#8B5CF6' }}>Simultaneously.</span>
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: s.isDark ? '#8888A0' : '#6B6B82', marginBottom: 28 }}>
                The Rantracker Charging Hub uses a tri-coil inductive array operating at 200kHz Qi2.1 Extended Profile. No USB-C. No Lightning. No magnetic pogo pins. Devices are detected automatically and charged at up to 8W per coil — simultaneously.
              </p>

              {[
                { label: 'Standard', val: 'Qi2.1 Extended (200kHz)' },
                { label: 'Max Power', val: '8W per device (24W total)' },
                { label: 'Detection', val: 'Auto-orient, no alignment required' },
                { label: 'Material', val: 'Sintered ceramic top plate, 6061 alloy base' },
                { label: 'Standby', val: '< 20mW idle draw' },
              ].map(row => (
                <div
                  key={row.label}
                  className="flex items-center py-3.5"
                  style={{ borderBottom: `1px solid ${s.divider}` }}
                >
                  <span style={{ fontSize: 13, color: s.isDark ? '#8888A0' : '#6B6B82', width: 160, shrink: 0 }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: s.isDark ? '#F1F1F5' : '#0A0A12' }}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Mental Physique Graph ─── */}
      <section style={{ borderTop: `1px solid ${s.divider}` }}>
        <div className="max-w-[1440px] mx-auto px-10 py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, color: s.isDark ? '#8B5CF6' : '#6D28D9', display: 'block', marginBottom: 10 }}>
                DATA VISUALIZATION
              </span>
              <h2 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: s.isDark ? '#F1F1F5' : '#0A0A12' }}>
                Monthly Resilience Score
              </h2>
              <p style={{ fontSize: 15, color: s.isDark ? '#8888A0' : '#6B6B82', marginTop: 8, maxWidth: 440 }}>
                Three sensor inputs fused into a single personal resilience score. January–December sample.
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6">
              {[
                { label: 'HRV', color: '#60A5FA' },
                { label: 'GSR', color: '#A78BFA' },
                { label: 'Thermal', color: '#34D399' },
                { label: 'Resilience', color: s.isDark ? '#F1F1F5' : '#0A0A12', bold: true },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-2">
                  <div
                    style={{
                      width: l.bold ? 24 : 16,
                      height: l.bold ? 3 : 2,
                      borderRadius: 99,
                      background: l.color,
                    }}
                  />
                  <span style={{ fontSize: 12, fontWeight: l.bold ? 700 : 500, color: l.color }}>
                    {l.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div
            className="p-8 rounded-3xl"
            style={{
              background: s.isDark ? '#111118' : '#FFFFFF',
              border: `1px solid ${s.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
              boxShadow: s.isDark ? '0 20px 60px rgba(0,0,0,0.4)' : '0 4px 32px rgba(0,0,0,0.06)',
            }}
          >
            <ResponsiveContainer width="100%" height={380}>
              <AreaChart data={RESILIENCE_DATA} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient key="gradHRV" id="gradHRV" x1="0" y1="0" x2="0" y2="1">
                    <stop key="gradHRV-5" offset="5%" stopColor="#60A5FA" stopOpacity={0.2} />
                    <stop key="gradHRV-95" offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient key="gradGSR" id="gradGSR" x1="0" y1="0" x2="0" y2="1">
                    <stop key="gradGSR-5" offset="5%" stopColor="#A78BFA" stopOpacity={0.15} />
                    <stop key="gradGSR-95" offset="95%" stopColor="#A78BFA" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient key="gradThermal" id="gradThermal" x1="0" y1="0" x2="0" y2="1">
                    <stop key="gradThermal-5" offset="5%" stopColor="#34D399" stopOpacity={0.15} />
                    <stop key="gradThermal-95" offset="95%" stopColor="#34D399" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient key="gradResilience" id="gradResilience" x1="0" y1="0" x2="0" y2="1">
                    <stop key="gradResilience-5" offset="5%" stopColor={s.isDark ? '#F1F1F5' : '#0A0A12'} stopOpacity={0.1} />
                    <stop key="gradResilience-95" offset="95%" stopColor={s.isDark ? '#F1F1F5' : '#0A0A12'} stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={s.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: s.isDark ? '#555568' : '#A0A0B0', fontFamily: 'Inter' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: s.isDark ? '#555568' : '#A0A0B0', fontFamily: 'Inter' }}
                  axisLine={false}
                  tickLine={false}
                  domain={[30, 100]}
                />
                <Tooltip content={<CustomTooltip isDark={s.isDark} />} />

                <Area type="monotone" dataKey="hrv" name="HRV" stroke="#60A5FA" strokeWidth={1.5} fill="url(#gradHRV)" dot={false} />
                <Area type="monotone" dataKey="gsr" name="GSR" stroke="#A78BFA" strokeWidth={1.5} fill="url(#gradGSR)" dot={false} />
                <Area type="monotone" dataKey="thermal" name="Thermal" stroke="#34D399" strokeWidth={1.5} fill="url(#gradThermal)" dot={false} />
                <Area
                  type="monotone"
                  dataKey="resilience"
                  name="Resilience"
                  stroke={s.isDark ? '#F1F1F5' : '#0A0A12'}
                  strokeWidth={2.5}
                  fill={`url(#gradResilience)`}
                  dot={{ r: 4, fill: s.isDark ? '#F1F1F5' : '#0A0A12', stroke: s.isDark ? '#111118' : '#FFFFFF', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Score summary cards */}
          <div className="grid grid-cols-4 gap-5 mt-6">
            {[
              { label: 'Peak Score', val: '87', sub: 'December', color: s.isDark ? '#F1F1F5' : '#0A0A12' },
              { label: 'Avg HRV Gain', val: '+31', sub: 'Jan→Dec ms delta', color: '#60A5FA' },
              { label: 'GSR Stabilization', val: '+83%', sub: 'Reduced volatility', color: '#A78BFA' },
              { label: 'Thermal Range', val: '28°C', sub: 'Avg baseline', color: '#34D399' },
            ].map(card => (
              <div
                key={card.label}
                className="p-5 rounded-2xl"
                style={{
                  background: s.isDark ? '#16161E' : '#F8F8FC',
                  border: `1px solid ${s.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                }}
              >
                <div style={{ fontSize: 11, color: s.isDark ? '#8888A0' : '#6B6B82', marginBottom: 6, letterSpacing: '0.06em' }}>
                  {card.label}
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: card.color, lineHeight: 1.1 }}>
                  {card.val}
                </div>
                <div style={{ fontSize: 12, color: s.isDark ? '#8888A0' : '#6B6B82', marginTop: 4 }}>
                  {card.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}