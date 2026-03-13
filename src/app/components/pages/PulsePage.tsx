import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity, Moon, Brain, Zap, Users, X, Heart,
  TrendingDown, TrendingUp, Clock, AlertTriangle,
  Radio, MessageSquare, Smile, Frown,
  ChevronRight, Plus, Check, Mic, MessageCircle,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
  AreaChart, Area,
} from 'recharts';
import { Link } from 'react-router';
import { useStyles } from '../ThemeContext';

// ─── Data ─────────────────────────────────────────────────
const WEEK_DATA = [
  { day: 'Mon', anxiety: 58, sleep: 72, cortisol: 64 },
  { day: 'Tue', anxiety: 62, sleep: 68, cortisol: 70 },
  { day: 'Wed', anxiety: 75, sleep: 58, cortisol: 82 },
  { day: 'Thu', anxiety: 52, sleep: 81, cortisol: 57 },
  { day: 'Fri', anxiety: 44, sleep: 84, cortisol: 50 },
  { day: 'Sat', anxiety: 38, sleep: 90, cortisol: 43 },
  { day: 'Today', anxiety: 42, sleep: 81, cortisol: 47 },
];

const MONTH_DATA = [
  { day: 'W1', anxiety: 64, sleep: 70, cortisol: 68 },
  { day: 'W2', anxiety: 58, sleep: 74, cortisol: 62 },
  { day: 'W3', anxiety: 70, sleep: 65, cortisol: 74 },
  { day: 'W4', anxiety: 48, sleep: 82, cortisol: 52 },
  { day: 'Today', anxiety: 42, sleep: 81, cortisol: 47 },
];

const TODAY_DATA = [
  { day: '8AM', anxiety: 52, sleep: 81, cortisol: 72 },
  { day: '10AM', anxiety: 68, sleep: 81, cortisol: 65 },
  { day: '12PM', anxiety: 55, sleep: 81, cortisol: 55 },
  { day: '2PM', anxiety: 67, sleep: 81, cortisol: 50 },
  { day: 'Now', anxiety: 42, sleep: 81, cortisol: 47 },
];

const CORTISOL_CURVE = [
  { t: '6AM', v: 14.2 }, { t: '7AM', v: 18.4 }, { t: '8AM', v: 19.1 },
  { t: '9AM', v: 16.8 }, { t: '10AM', v: 14.2 }, { t: '11AM', v: 12.5 },
  { t: '12PM', v: 10.8 }, { t: '1PM', v: 9.4 }, { t: '2PM', v: 8.8 },
  { t: 'Now', v: 8.2 },
];

const SLEEP_STAGES = [
  { stage: 'Awake', minutes: 18, color: '#F87171', pct: 4 },
  { stage: 'REM', minutes: 108, color: '#8B5CF6', pct: 24 },
  { stage: 'Deep', minutes: 132, color: '#3B82F6', pct: 30 },
  { stage: 'Light', minutes: 186, color: '#60A5FA', pct: 42 },
];

const ANXIETY_EVENTS = [
  { id: 1, time: '8:15 AM', label: 'Morning commute', delta: +12, gsr: '14.2 µS', hrv: '54ms', temp: '36.8°C', note: 'Sustained GSR elevation for 22 minutes. HRV dipped below baseline. Physical arousal consistent with environmental stress.' },
  { id: 2, time: '10:30 AM', label: 'Team standup', delta: +18, gsr: '18.6 µS', hrv: '48ms', temp: '37.0°C', note: 'Spike during first 4 minutes of meeting. Normalized after speaking. Social performance anxiety pattern detected.' },
  { id: 3, time: '2:30 PM', label: 'Deadline reminder', delta: +24, gsr: '22.1 µS', hrv: '44ms', temp: '37.2°C', note: 'Highest anxiety event of the day. GSR peak matches cortisol reading. Consider time-blocking to reduce deadline pressure.' },
  { id: 4, time: '4:45 PM', label: 'Deep work mode', delta: -14, gsr: '8.4 µS', hrv: '71ms', temp: '36.6°C', note: 'Strong flow state detected. HRV recovered significantly. This environment is your resilience zone — replicate it.' },
];

const CHECKIN_PROMPTS = [
  { headline: "Yo, you good? 👀", body: "Your social radar's been quiet for 19 hours. No calls, no texts logged. Just checking in fam." },
  { headline: "Are you locked in blud? 🔒", body: "Haven't picked up any social signals today. That's real — just let us know you're okay out there." },
  { headline: "Hey... you there? 🤍", body: "Zero conversations detected today. Sometimes silence hits different. How are you actually doing right now?" },
];

const YESTERDAY_CONTACTS = [
  { name: 'Alex K.', time: '6:42 PM', duration: '22 min', type: 'voice', icon: '📞' },
  { name: 'Group Chat', time: '2:15 PM', duration: '45 messages', type: 'text', icon: '💬' },
  { name: 'Maya L.', time: '11:30 AM', duration: '8 min', type: 'voice', icon: '📞' },
  { name: 'Priya R.', time: '9:05 AM', duration: '4 messages', type: 'text', icon: '💬' },
];

// ─── Helpers ─────────────────────────────────────────────
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function arc(cx: number, cy: number, r: number, a1: number, a2: number) {
  const s = polar(cx, cy, r, a1); const e = polar(cx, cy, r, a2);
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

function Gauge({ value, color, size = 160 }: { value: number; color: string; size?: number }) {
  const cx = size / 2, cy = size / 2 + 8, r = size * 0.37, sw = size * 0.072;
  const end = -135 + Math.max(0.01, value / 100) * 270;
  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      <path d={arc(cx, cy, r, -135, 135)} fill="none" stroke="rgba(128,128,160,0.15)" strokeWidth={sw} strokeLinecap="round" />
      <motion.path d={arc(cx, cy, r, -135, end)} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ filter: `drop-shadow(0 0 6px ${color}80)` }} />
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize={size * 0.2} fontWeight={800} fontFamily="Inter" fill="currentColor">{value}</text>
      <text x={cx} y={cy + size * 0.12} textAnchor="middle" fontSize={size * 0.085} fontFamily="Inter" fill="currentColor" opacity={0.4}>/ 100</text>
    </svg>
  );
}

function ChartTip({ active, payload, label, isDark }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: isDark ? '#1A1A24' : '#FFFFFF', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: 12, padding: '10px 14px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', fontFamily: 'Inter' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#8888A0' : '#6B6B82', letterSpacing: '0.1em', marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: p.color }} />
          <span style={{ fontSize: 12, color: isDark ? '#8888A0' : '#6B6B82' }}>{p.name}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#F1F1F5' : '#0A0A12', marginLeft: 'auto' }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────
export function PulsePage() {
  const s = useStyles();
  const [prompt] = useState(() => CHECKIN_PROMPTS[Math.floor(Math.random() * CHECKIN_PROMPTS.length)]);
  const [showCheckin, setShowCheckin] = useState(false);
  const [checkinResponse, setCheckinResponse] = useState<'ok' | 'not-ok' | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [expandedTrigger, setExpandedTrigger] = useState<number | null>(null);
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const [chartRange, setChartRange] = useState<'today' | 'week' | 'month'>('week');
  const [showLogForm, setShowLogForm] = useState(false);
  const [logName, setLogName] = useState('');
  const [logType, setLogType] = useState<'voice' | 'text'>('voice');
  const [logDuration, setLogDuration] = useState('');
  const [loggedToday, setLoggedToday] = useState<typeof YESTERDAY_CONTACTS>([]);
  const [logSuccess, setLogSuccess] = useState(false);

  const noSocialToday = loggedToday.length === 0;
  const chartData = chartRange === 'today' ? TODAY_DATA : chartRange === 'week' ? WEEK_DATA : MONTH_DATA;
  const xKey = chartRange === 'today' ? 'day' : 'day';

  useEffect(() => {
    if (noSocialToday && !dismissed) {
      const t = setTimeout(() => setShowCheckin(true), 2600);
      return () => clearTimeout(t);
    }
  }, [dismissed, noSocialToday]);

  function submitLog() {
    if (!logName.trim()) return;
    const entry = {
      name: logName.trim(),
      time: 'Just now',
      duration: logDuration || '—',
      type: logType,
      icon: logType === 'voice' ? '📞' : '💬',
    };
    setLoggedToday(prev => [entry, ...prev]);
    setLogName(''); setLogDuration(''); setLogType('voice');
    setLogSuccess(true);
    setTimeout(() => { setLogSuccess(false); setShowLogForm(false); }, 1800);
  }

  const card = (extra?: React.CSSProperties) => ({
    background: s.isDark ? '#111118' : '#FFFFFF',
    border: `1px solid ${s.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
    boxShadow: s.isDark ? '0 16px 48px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.06)',
    borderRadius: 24,
    ...extra,
  });

  return (
    <div style={{ minHeight: '100vh', background: s.isDark ? '#09090E' : '#F7F7FA' }}>

      {/* ─── Hero ─── */}
      <section style={{ background: s.isDark ? 'radial-gradient(ellipse 1100px 500px at 50% -60px, rgba(139,92,246,0.12) 0%, transparent 65%)' : 'radial-gradient(ellipse 1100px 500px at 50% -60px, rgba(109,40,217,0.07) 0%, transparent 65%)' }}>
        <div className="max-w-[1440px] mx-auto px-10 pt-16 pb-10">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Radio style={{ width: 13, height: 13, color: s.isDark ? '#8B5CF6' : '#6D28D9' }} />
                <span style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, color: s.isDark ? '#8B5CF6' : '#6D28D9' }}>PULSE MAP</span>
              </div>
              <h1 style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, color: s.isDark ? '#F1F1F5' : '#0A0A12', marginBottom: 10 }}>
                Good afternoon,{' '}
                <span style={{ background: 'linear-gradient(135deg, #8B5CF6, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Jordan.</span>
              </h1>
              <p style={{ fontSize: 15, color: s.isDark ? '#8888A0' : '#6B6B82' }}>Monday, March 9 · 4:12 PM — Here's what your body's been saying.</p>
            </div>
            <div className="flex items-center gap-4">
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: s.isDark ? '#8888A0' : '#6B6B82', letterSpacing: '0.1em', marginBottom: 4 }}>WELLNESS SCORE</div>
                <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-0.04em', color: '#10B981', lineHeight: 1 }}>72</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#10B981', opacity: 0.8 }}>Good today</div>
              </div>
              <div style={{ padding: '10px 16px', borderRadius: 16, background: s.isDark ? '#111118' : '#FFFFFF', border: `1px solid ${s.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
                {[{ name: 'GDX-01', color: '#8B5CF6' }, { name: 'GDX-02', color: '#10B981' }, { name: 'GDX-03', color: '#F59E0B' }].map(d => (
                  <div key={d.name} className="flex items-center gap-2 py-1">
                    <motion.div style={{ width: 6, height: 6, borderRadius: '50%', background: d.color }} animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2.2, repeat: Infinity }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: s.isDark ? '#8888A0' : '#6B6B82' }}>{d.name}</span>
                    <span style={{ fontSize: 10, color: d.color, fontWeight: 700 }}>LIVE</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-10 pb-24">

        {/* ─── 3 Metric Cards ─── */}
        <div className="grid grid-cols-3 gap-6 mb-8">

          {/* Anxiety */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={card()}>
            <div className="p-7">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Brain style={{ width: 16, height: 16, color: '#8B5CF6' }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: s.isDark ? '#F1F1F5' : '#0A0A12' }}>Anxiety Level</span>
                </div>
                <div className="flex items-center gap-1.5" style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(16,185,129,0.12)' }}>
                  <TrendingDown style={{ width: 11, height: 11, color: '#10B981' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981' }}>↓ 8 pts</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Gauge value={42} color="#8B5CF6" size={150} />
                <div className="flex flex-col gap-3 flex-1 pl-4">
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#8B5CF6' }}>Moderate</div>
                    <div style={{ fontSize: 12, color: s.isDark ? '#8888A0' : '#6B6B82' }}>Current status</div>
                  </div>
                  <div style={{ height: 1, background: s.divider }} />
                  <div>
                    <div style={{ fontSize: 11, color: s.isDark ? '#8888A0' : '#6B6B82', marginBottom: 2 }}>Peak today</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#F87171' }}>67 <span style={{ fontSize: 12, fontWeight: 400 }}>at 2:30 PM</span></div>
                  </div>
                  <div style={{ fontSize: 11, color: s.isDark ? '#555568' : '#A0A0B0' }}>via GDX-01 + GDX-02</div>
                </div>
              </div>

              {/* Triggers — now interactive */}
              <div style={{ borderTop: `1px solid ${s.divider}`, marginTop: 16, paddingTop: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: s.isDark ? '#555568' : '#A0A0B0', letterSpacing: '0.1em', marginBottom: 10 }}>TODAY'S TRIGGERS <span style={{ fontWeight: 400, letterSpacing: 0 }}>(tap to expand)</span></div>
                {ANXIETY_EVENTS.map(e => (
                  <div key={e.id}>
                    <motion.div
                      whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setExpandedTrigger(expandedTrigger === e.id ? null : e.id)}
                      className="flex items-center justify-between py-2 cursor-pointer rounded-lg"
                      style={{ padding: '6px 8px', marginLeft: -8, borderRadius: 10, background: expandedTrigger === e.id ? (s.isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.06)') : 'transparent' }}
                    >
                      <div>
                        <span style={{ fontSize: 11, color: s.isDark ? '#8888A0' : '#6B6B82' }}>{e.time}</span>
                        <span style={{ fontSize: 12, color: s.isDark ? '#F1F1F5' : '#0A0A12', marginLeft: 8 }}>{e.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 12, fontWeight: 700, color: e.delta > 0 ? '#F87171' : '#10B981' }}>{e.delta > 0 ? '+' : ''}{e.delta}</span>
                        <ChevronRight style={{ width: 12, height: 12, color: s.isDark ? '#555568' : '#A0A0B0', transform: expandedTrigger === e.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                      </div>
                    </motion.div>
                    <AnimatePresence>
                      {expandedTrigger === e.id && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                          <div style={{ padding: '10px 8px 6px', margin: '0 -8px 4px', background: s.isDark ? 'rgba(139,92,246,0.05)' : 'rgba(139,92,246,0.04)', borderRadius: 10 }}>
                            <div className="grid grid-cols-3 gap-2 mb-8px" style={{ marginBottom: 8 }}>
                              {[{ label: 'GSR', val: e.gsr }, { label: 'HRV', val: e.hrv }, { label: 'Temp', val: e.temp }].map(m => (
                                <div key={m.label} style={{ textAlign: 'center', padding: '6px 4px', background: s.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', borderRadius: 8 }}>
                                  <div style={{ fontSize: 9, color: s.isDark ? '#555568' : '#A0A0B0', marginBottom: 2 }}>{m.label}</div>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: '#8B5CF6' }}>{m.val}</div>
                                </div>
                              ))}
                            </div>
                            <p style={{ fontSize: 11, lineHeight: 1.6, color: s.isDark ? '#8888A0' : '#6B6B82' }}>{e.note}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sleep */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={card()}>
            <div className="p-7">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Moon style={{ width: 16, height: 16, color: '#3B82F6' }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: s.isDark ? '#F1F1F5' : '#0A0A12' }}>Sleep Conditions</span>
                </div>
                <div style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(59,130,246,0.12)' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#3B82F6' }}>81 / 100</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-6">
                <Gauge value={81} color="#3B82F6" size={150} />
                <div className="flex flex-col gap-3 flex-1 pl-4">
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#3B82F6' }}>Good</div>
                    <div style={{ fontSize: 12, color: s.isDark ? '#8888A0' : '#6B6B82' }}>Last night</div>
                  </div>
                  <div style={{ height: 1, background: s.divider }} />
                  <div>
                    <div style={{ fontSize: 11, color: s.isDark ? '#8888A0' : '#6B6B82', marginBottom: 2 }}>Total sleep</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: s.isDark ? '#F1F1F5' : '#0A0A12' }}>7h 24m</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: s.isDark ? '#8888A0' : '#6B6B82', marginBottom: 2 }}>Sleep HRV</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#60A5FA' }}>58ms</div>
                  </div>
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${s.divider}`, paddingTop: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: s.isDark ? '#555568' : '#A0A0B0', letterSpacing: '0.1em', marginBottom: 10 }}>SLEEP STAGES <span style={{ fontWeight: 400, letterSpacing: 0 }}>(hover each)</span></div>
                {/* Interactive stage bar */}
                <div style={{ height: 12, borderRadius: 8, overflow: 'hidden', display: 'flex', marginBottom: 12, cursor: 'pointer' }}>
                  {SLEEP_STAGES.map(st => (
                    <motion.div
                      key={st.stage}
                      initial={{ width: 0 }} animate={{ width: `${st.pct}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                      whileHover={{ scaleY: 1.3, filter: `brightness(1.2)` }}
                      onHoverStart={() => setHoveredStage(st.stage)}
                      onHoverEnd={() => setHoveredStage(null)}
                      style={{ background: st.color, height: '100%', transformOrigin: 'bottom', cursor: 'pointer' }}
                      title={`${st.stage}: ${Math.floor(st.minutes / 60)}h ${st.minutes % 60}m`}
                    />
                  ))}
                </div>
                {/* Hover detail */}
                <AnimatePresence mode="wait">
                  {hoveredStage && (
                    <motion.div
                      key={hoveredStage} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      style={{ padding: '8px 12px', borderRadius: 10, background: s.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', marginBottom: 8 }}
                    >
                      {SLEEP_STAGES.filter(s => s.stage === hoveredStage).map(st => (
                        <div key={st.stage} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: st.color }}>{st.stage}</span>
                          <span style={{ fontSize: 12, color: s.isDark ? '#8888A0' : '#6B6B82' }}>{Math.floor(st.minutes / 60)}h {st.minutes % 60}m · {st.pct}%</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="grid grid-cols-2 gap-y-2">
                  {SLEEP_STAGES.map(st => (
                    <div key={st.stage} className="flex items-center gap-2">
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: st.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: s.isDark ? '#8888A0' : '#6B6B82' }}>{st.stage}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: s.isDark ? '#F1F1F5' : '#0A0A12', marginLeft: 'auto' }}>{st.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cortisol */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={card()}>
            <div className="p-7">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap style={{ width: 16, height: 16, color: '#F59E0B' }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: s.isDark ? '#F1F1F5' : '#0A0A12' }}>Cortisol Level</span>
                </div>
                <div style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(16,185,129,0.12)' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981' }}>Normal ✓</span>
                </div>
              </div>
              <div className="flex items-end gap-3 mb-4">
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
                  style={{ fontSize: 52, fontWeight: 900, color: '#F59E0B', letterSpacing: '-0.04em', lineHeight: 1 }}>8.2</motion.div>
                <div style={{ paddingBottom: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: s.isDark ? '#8888A0' : '#6B6B82' }}>µg/dL</div>
                  <div style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>↓ Afternoon decline</div>
                </div>
              </div>
              <div style={{ height: 90, marginBottom: 14 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CORTISOL_CURVE} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient key="cortGrad" id="cortGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop key="cortGrad-5" offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                        <stop key="cortGrad-95" offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke="#F59E0B" strokeWidth={2} fill="url(#cortGrad)" dot={false} />
                    <XAxis dataKey="t" tick={{ fontSize: 9, fill: s.isDark ? '#555568' : '#A0A0B0' }} axisLine={false} tickLine={false} />
                    <ReferenceLine y={8.2} stroke="#F59E0B" strokeDasharray="3 3" strokeOpacity={0.5} />
                    <Tooltip content={<ChartTip isDark={s.isDark} />} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ borderTop: `1px solid ${s.divider}`, paddingTop: 14 }} className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Morning Peak', val: '19.1 µg/dL', sub: 'at 8:15 AM', color: '#F59E0B' },
                  { label: 'Normal AM range', val: '10–20', sub: 'µg/dL', color: s.isDark ? '#8888A0' : '#6B6B82' },
                  { label: 'Current', val: '8.2 µg/dL', sub: 'normal PM', color: '#10B981' },
                  { label: 'Derived from', val: 'GSR + Thermal', sub: 'model', color: s.isDark ? '#555568' : '#A0A0B0' },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: 10, color: s.isDark ? '#555568' : '#A0A0B0', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.val}</div>
                    <div style={{ fontSize: 10, color: s.isDark ? '#555568' : '#A0A0B0' }}>{item.sub}</div>
                  </div>
                ))}
              </div>
              <Link to="/deep-dive" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, padding: '10px', borderRadius: 14, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', textDecoration: 'none', fontSize: 12, fontWeight: 600, color: '#F59E0B' }}>
                View full sensor report <ChevronRight style={{ width: 13, height: 13 }} />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ─── Biometric Trends + Time Range Tabs ─── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ ...card(), marginBottom: 32 }}>
          <div className="p-8">
            <div className="flex items-end justify-between mb-6">
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: s.isDark ? '#8B5CF6' : '#6D28D9', letterSpacing: '0.16em', marginBottom: 8 }}>BIOMETRIC TRENDS</div>
                <h3 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', color: s.isDark ? '#F1F1F5' : '#0A0A12' }}>Your body, over time.</h3>
              </div>
              <div className="flex items-center gap-3">
                {/* Time range selector */}
                <div style={{ display: 'flex', background: s.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', borderRadius: 12, padding: 3, gap: 2 }}>
                  {(['today', 'week', 'month'] as const).map(range => (
                    <motion.button
                      key={range}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setChartRange(range)}
                      style={{
                        padding: '6px 14px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                        background: chartRange === range ? (s.isDark ? '#FFFFFF' : '#0A0A12') : 'transparent',
                        color: chartRange === range ? (s.isDark ? '#0A0A12' : '#FFFFFF') : (s.isDark ? '#8888A0' : '#6B6B82'),
                        transition: 'all 0.15s',
                      }}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </motion.button>
                  ))}
                </div>
                {/* Legend */}
                <div className="flex items-center gap-4">
                  {[{ label: 'Anxiety', color: '#8B5CF6' }, { label: 'Sleep', color: '#3B82F6' }, { label: 'Cortisol', color: '#F59E0B' }].map(l => (
                    <div key={l.label} className="flex items-center gap-2">
                      <div style={{ width: 16, height: 2.5, borderRadius: 4, background: l.color }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: l.color }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={chartRange} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={chartData} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
                    <CartesianGrid stroke={s.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} vertical={false} />
                    <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: s.isDark ? '#555568' : '#A0A0B0', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: s.isDark ? '#555568' : '#A0A0B0', fontFamily: 'Inter' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip content={<ChartTip isDark={s.isDark} />} />
                    <ReferenceLine y={50} stroke={s.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} strokeDasharray="4 4" />
                    <Line type="monotone" dataKey="anxiety" name="Anxiety" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 4, fill: '#8B5CF6', stroke: s.isDark ? '#111118' : '#FFF', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="sleep" name="Sleep" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 4, fill: '#3B82F6', stroke: s.isDark ? '#111118' : '#FFF', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="cortisol" name="Cortisol" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 4, fill: '#F59E0B', stroke: s.isDark ? '#111118' : '#FFF', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ─── Social Radar ─── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={card()}>
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div style={{ width: 36, height: 36, borderRadius: 12, background: noSocialToday ? 'rgba(248,113,113,0.15)' : 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users style={{ width: 18, height: 18, color: noSocialToday ? '#F87171' : '#10B981' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.01em', color: s.isDark ? '#F1F1F5' : '#0A0A12' }}>Social Radar</h3>
                  <p style={{ fontSize: 12, color: s.isDark ? '#8888A0' : '#6B6B82' }}>Conversation & connection tracking</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2" style={{ padding: '6px 14px', borderRadius: 20, background: noSocialToday ? 'rgba(248,113,113,0.12)' : 'rgba(16,185,129,0.12)', border: `1px solid ${noSocialToday ? 'rgba(248,113,113,0.25)' : 'rgba(16,185,129,0.25)'}` }}>
                  <Clock style={{ width: 12, height: 12, color: noSocialToday ? '#F87171' : '#10B981' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: noSocialToday ? '#F87171' : '#10B981' }}>
                    {noSocialToday ? '19h 42m without contact' : `${loggedToday.length} interaction${loggedToday.length > 1 ? 's' : ''} today`}
                  </span>
                </div>
                {/* Log Conversation button */}
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => setShowLogForm(v => !v)}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 14, border: 'none', cursor: 'pointer', background: showLogForm ? '#10B981' : 'rgba(16,185,129,0.15)', color: showLogForm ? '#fff' : '#10B981', fontSize: 13, fontWeight: 700, transition: 'all 0.2s' }}
                >
                  <Plus style={{ width: 15, height: 15 }} />
                  Log conversation
                </motion.button>
              </div>
            </div>

            {/* Log Conversation Form */}
            <AnimatePresence>
              {showLogForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ padding: '20px 22px', borderRadius: 18, background: s.isDark ? '#16161E' : '#F8F8FC', border: `1px solid ${s.isDark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.15)'}` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#10B981', letterSpacing: '0.1em', marginBottom: 14 }}>LOG A CONVERSATION</div>

                    {logSuccess ? (
                      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex items-center justify-center gap-3 py-4">
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check style={{ width: 16, height: 16, color: '#10B981' }} />
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#10B981' }}>Logged successfully!</span>
                      </motion.div>
                    ) : (
                      <div className="grid grid-cols-3 gap-3">
                        <div style={{ gridColumn: 'span 2' }}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: s.isDark ? '#8888A0' : '#6B6B82', display: 'block', marginBottom: 6 }}>Who did you speak with?</label>
                          <input
                            value={logName} onChange={e => setLogName(e.target.value)}
                            placeholder="Name or group…"
                            onKeyDown={e => e.key === 'Enter' && submitLog()}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: `1px solid ${s.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: s.isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF', color: s.isDark ? '#F1F1F5' : '#0A0A12', fontSize: 14, fontFamily: 'Inter', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 600, color: s.isDark ? '#8888A0' : '#6B6B82', display: 'block', marginBottom: 6 }}>Duration</label>
                          <input
                            value={logDuration} onChange={e => setLogDuration(e.target.value)}
                            placeholder="e.g. 15 min"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: `1px solid ${s.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: s.isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF', color: s.isDark ? '#F1F1F5' : '#0A0A12', fontSize: 14, fontFamily: 'Inter', outline: 'none' }}
                          />
                        </div>

                        {/* Type toggle */}
                        <div style={{ display: 'flex', gap: 8, gridColumn: 'span 2', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: s.isDark ? '#8888A0' : '#6B6B82', marginRight: 4 }}>Type:</span>
                          {(['voice', 'text'] as const).map(t => (
                            <motion.button key={t} whileTap={{ scale: 0.95 }} onClick={() => setLogType(t)}
                              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: `1px solid ${logType === t ? '#10B981' : (s.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`, background: logType === t ? 'rgba(16,185,129,0.15)' : 'transparent', color: logType === t ? '#10B981' : (s.isDark ? '#8888A0' : '#6B6B82'), fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                              {t === 'voice' ? <Mic style={{ width: 13, height: 13 }} /> : <MessageCircle style={{ width: 13, height: 13 }} />}
                              {t.charAt(0).toUpperCase() + t.slice(1)}
                            </motion.button>
                          ))}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                          onClick={submitLog}
                          disabled={!logName.trim()}
                          style={{ padding: '10px 16px', borderRadius: 12, border: 'none', cursor: logName.trim() ? 'pointer' : 'not-allowed', background: logName.trim() ? '#10B981' : (s.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'), color: logName.trim() ? '#fff' : (s.isDark ? '#555568' : '#A0A0B0'), fontSize: 13, fontWeight: 700, transition: 'all 0.15s', alignSelf: 'flex-end' }}
                        >
                          Log it ✓
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Alert */}
            <AnimatePresence>
              {noSocialToday && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  style={{ padding: '14px 18px', borderRadius: 16, marginBottom: 24, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <AlertTriangle style={{ width: 18, height: 18, color: '#F87171', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#F87171', marginBottom: 2 }}>No social interactions logged today</div>
                    <div style={{ fontSize: 12, color: s.isDark ? '#8888A0' : '#6B6B82' }}>Your GDX devices haven't detected any conversations today. Use the button above to log one manually.</div>
                  </div>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={() => setShowCheckin(true)}
                    style={{ marginLeft: 'auto', flexShrink: 0, padding: '8px 16px', borderRadius: 12, background: '#F87171', color: '#fff', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                    Check in
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Today', val: String(loggedToday.length), sub: 'conversations', color: loggedToday.length === 0 ? '#F87171' : '#10B981' },
                { label: 'Yesterday', val: '4', sub: 'conversations', color: s.isDark ? '#F1F1F5' : '#0A0A12' },
                { label: '7-day avg', val: '3.2', sub: 'per day', color: s.isDark ? '#F1F1F5' : '#0A0A12' },
                { label: 'Social score', val: loggedToday.length === 0 ? '12' : String(Math.min(100, 12 + loggedToday.length * 22)), sub: '/ 100 today', color: loggedToday.length === 0 ? '#F87171' : '#10B981' },
              ].map(stat => (
                <div key={stat.label} style={{ padding: '14px 16px', borderRadius: 16, background: s.isDark ? '#16161E' : '#F8F8FC', border: `1px solid ${s.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div style={{ fontSize: 10, color: s.isDark ? '#555568' : '#A0A0B0', marginBottom: 4, letterSpacing: '0.06em' }}>{stat.label.toUpperCase()}</div>
                  <motion.div key={stat.val} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    style={{ fontSize: 28, fontWeight: 900, color: stat.color, letterSpacing: '-0.03em', lineHeight: 1.1 }}>{stat.val}</motion.div>
                  <div style={{ fontSize: 11, color: s.isDark ? '#8888A0' : '#6B6B82', marginTop: 2 }}>{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Today's logged interactions */}
            <AnimatePresence>
              {loggedToday.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ overflow: 'hidden', marginBottom: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#10B981', letterSpacing: '0.12em', marginBottom: 10 }}>TODAY — JUST LOGGED</div>
                  {loggedToday.map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 py-3" style={{ borderBottom: i < loggedToday.length - 1 ? `1px solid ${s.divider}` : 'none' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{c.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: s.isDark ? '#F1F1F5' : '#0A0A12' }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: s.isDark ? '#8888A0' : '#6B6B82' }}>{c.time}</div>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#10B981' }}>{c.duration}</div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Yesterday */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: s.isDark ? '#555568' : '#A0A0B0', letterSpacing: '0.12em', marginBottom: 12 }}>YESTERDAY'S INTERACTIONS</div>
              {YESTERDAY_CONTACTS.map((c, i) => (
                <motion.div key={c.name + c.time} whileHover={{ x: 4 }}
                  className="flex items-center gap-4 py-3" style={{ borderBottom: i < YESTERDAY_CONTACTS.length - 1 ? `1px solid ${s.divider}` : 'none', cursor: 'default' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: `hsl(${i * 80 + 220}, 60%, ${s.isDark ? '25%' : '88%'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{c.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: s.isDark ? '#F1F1F5' : '#0A0A12' }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: s.isDark ? '#8888A0' : '#6B6B82' }}>Yesterday · {c.time}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: s.isDark ? '#8888A0' : '#6B6B82' }}>{c.duration}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── Check-in Popup ─── */}
      <AnimatePresence>
        {showCheckin && !dismissed && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 999, width: 480, background: s.isDark ? '#1A1826' : '#FFFFFF', border: `1px solid ${s.isDark ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.2)'}`, borderRadius: 24, boxShadow: s.isDark ? '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(139,92,246,0.15)' : '0 24px 80px rgba(0,0,0,0.18)', overflow: 'hidden' }}
          >
            <div style={{ height: 3, background: 'linear-gradient(90deg, #8B5CF6, #10B981)' }} />
            <div style={{ padding: '20px 24px 24px' }}>
              {checkinResponse === null && (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: 28 }}>🤍</motion.div>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: s.isDark ? '#F1F1F5' : '#0A0A12', letterSpacing: '-0.01em' }}>{prompt.headline}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#8B5CF6', letterSpacing: '0.1em', marginTop: 2 }}>RANT HUB CHECK-IN</div>
                      </div>
                    </div>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { setDismissed(true); setShowCheckin(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.isDark ? '#555568' : '#A0A0B0', padding: 4 }}>
                      <X style={{ width: 18, height: 18 }} />
                    </motion.button>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: s.isDark ? '#8888A0' : '#6B6B82', marginBottom: 18 }}>{prompt.body}</p>
                  <div className="flex gap-3">
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={() => setCheckinResponse('ok')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl"
                      style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                      <Smile style={{ width: 16, height: 16 }} /> I'm good 👍
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={() => setCheckinResponse('not-ok')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl"
                      style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)', color: '#F87171', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                      <Frown style={{ width: 16, height: 16 }} /> Not really…
                    </motion.button>
                  </div>
                  <div style={{ marginTop: 12, textAlign: 'center' }}>
                    <motion.button whileHover={{ opacity: 0.7 }} onClick={() => { setDismissed(true); setShowCheckin(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: s.isDark ? '#555568' : '#A0A0B0' }}>
                      Leave me alone for now
                    </motion.button>
                  </div>
                </>
              )}
              {checkinResponse === 'ok' && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🙌</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#10B981', marginBottom: 6 }}>Glad to hear it!</div>
                  <p style={{ fontSize: 14, color: s.isDark ? '#8888A0' : '#6B6B82', marginBottom: 16 }}>Keep it up. Your devices will keep tracking. Rant when you need to.</p>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => { setDismissed(true); setShowCheckin(false); }}
                    style={{ padding: '10px 24px', borderRadius: 14, background: '#10B981', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                    Close
                  </motion.button>
                </motion.div>
              )}
              {checkinResponse === 'not-ok' && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>💜</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: s.isDark ? '#F1F1F5' : '#0A0A12', marginBottom: 6 }}>That's real. We see you.</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: s.isDark ? '#8888A0' : '#6B6B82', marginBottom: 14 }}>
                    You don't have to be okay. Try venting in the Feed — sometimes getting it out helps more than talking to someone.
                  </p>
                  <div className="flex gap-3">
                    <Link to="/" style={{ flex: 1, textDecoration: 'none' }}>
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => { setDismissed(true); setShowCheckin(false); }}
                        style={{ width: '100%', padding: '11px 16px', borderRadius: 14, background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                        Go to the Feed & vent
                      </motion.button>
                    </Link>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => { setDismissed(true); setShowCheckin(false); }}
                      style={{ padding: '11px 16px', borderRadius: 14, background: s.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: s.isDark ? '#8888A0' : '#6B6B82', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                      Close
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
