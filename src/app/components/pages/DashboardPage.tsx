import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell, ChevronRight, Edit3, BarChart2,
  Flame, MessageSquare, Heart, TrendingUp, TrendingDown,
  Shield, Radio, Clock, RefreshCw, X, Check,
  Activity, Moon, Brain, Lock, Unlock,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { Link, useNavigate } from 'react-router';
import { useStyles } from '../ThemeContext';

// ─── Data ─────────────────────────────────────────────────
const INITIAL_USER = {
  name: 'Jordan Eze', handle: '@jordan.eze', avatar: 'JE',
  tier: 'Rantracker Pro', joinDate: 'Member since Oct 2024',
  streak: 14, totalRants: 87, followers: 204, following: 61,
};

const DEVICES = [
  { id: 'GDX-01', name: 'Anxiety Node', battery: 94, synced: '2m ago', color: '#8B5CF6', status: 'live' },
  { id: 'GDX-02', name: 'Deep Pulse', battery: 78, synced: '2m ago', color: '#10B981', status: 'live' },
  { id: 'GDX-03', name: 'Sleep Mat', battery: 100, synced: '8h ago', color: '#F59E0B', status: 'idle' },
];

const ACTIVITY_DATA = [
  { day: 'Mon', anxiety: 58, resilience: 62 },
  { day: 'Tue', anxiety: 62, resilience: 60 },
  { day: 'Wed', anxiety: 75, resilience: 52 },
  { day: 'Thu', anxiety: 52, resilience: 68 },
  { day: 'Fri', anxiety: 44, resilience: 74 },
  { day: 'Sat', anxiety: 38, resilience: 81 },
  { day: 'Today', anxiety: 42, resilience: 79 },
];

const RECENT_RANTS = [
  { id: 1, text: "Can't believe I sat through a 90-minute meeting that could've been an email. My node hit 74 during the third agenda point.", tags: ['Frustration', 'Work'], time: '2:34 PM today', anxietyAtRant: 74, empathy: 'High pressure environment detected. Your cortisol spiked 40% during this window. Consider a 5-minute breathing reset.', likes: 12 },
  { id: 2, text: "Finally got some alone time. Just me, some tea, and no notifications. First time my HRV went above 70 all week.", tags: ['Peace', 'Recovery'], time: '11:20 AM today', anxietyAtRant: 31, empathy: 'Deep rest state captured. This is a resilience-building moment. Your HRV is trending upward.', likes: 28 },
  { id: 3, text: "Woke up at 3AM again. Sleep Mat showed 4 micro-movement clusters between 2–4AM. Something's clearly on my mind.", tags: ['Sleep', 'Anxiety'], time: '7:45 AM today', anxietyAtRant: 58, empathy: 'Sleep fragmentation detected. REM disruption correlates with unresolved stress patterns from the previous day.', likes: 9 },
];

const ACHIEVEMENTS = [
  { icon: '🔥', label: '14-Day Streak', sub: 'Ranting consistently', color: '#F59E0B', earned: true, earnedDate: 'Mar 9, 2026', desc: 'You logged a rant every day for 14 consecutive days. Consistency is the foundation of self-awareness.', progress: 100 },
  { icon: '💜', label: 'Rant Veteran', sub: '50+ rants logged', color: '#8B5CF6', earned: true, earnedDate: 'Feb 28, 2026', desc: "You've crossed 50 rants. You're not just venting — you're building a biometric diary of your emotional life.", progress: 100 },
  { icon: '🧘', label: 'Calm Week', sub: 'Avg anxiety < 45', color: '#10B981', earned: true, earnedDate: 'Mar 7, 2026', desc: 'Your average anxiety score stayed below 45 for a full week. Your regulation techniques are working.', progress: 100 },
  { icon: '📡', label: 'Full Sync', sub: 'All 3 devices live', color: '#3B82F6', earned: true, earnedDate: 'Oct 12, 2024', desc: "All three Rantracker devices connected and transmitting simultaneously. You're running the full stack.", progress: 100 },
  { icon: '🌙', label: 'Sleep Champion', sub: '7+ hrs for 5 nights', color: '#60A5FA', earned: false, earnedDate: null, desc: 'Maintain 7+ hours of sleep for 5 consecutive nights to earn this badge.', progress: 60 },
  { icon: '🫀', label: 'HRV Master', sub: 'HRV > 80 sustained', color: '#F87171', earned: false, earnedDate: null, desc: 'Sustain an HRV above 80ms for 3 consecutive days. Currently tracking at 72ms average.', progress: 38 },
];

const NOTIFS = [
  { icon: '🔋', msg: 'GDX-02 battery below 80%', time: '10m ago', color: '#F59E0B', read: false },
  { icon: '💜', msg: 'Your weekly resilience score is up 9pts', time: '1h ago', color: '#8B5CF6', read: false },
  { icon: '👤', msg: 'No social contact detected today', time: '2h ago', color: '#F87171', read: true },
];

const QUICK_ACTIONS = [
  { icon: MessageSquare, label: 'New Rant', color: '#8B5CF6', to: '/' },
  { icon: Activity, label: 'Pulse Map', color: '#10B981', to: '/pulse-map' },
  { icon: Radio, label: 'Devices', color: '#F59E0B', to: '/devices' },
  { icon: BarChart2, label: 'Deep Dive', color: '#3B82F6', to: '/deep-dive' },
];

// ─── Tooltip ─────────────────────────────────────────────
function ChartTip({ active, payload, label, isDark }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: isDark ? '#1A1A24' : '#FFFFFF', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 12, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', fontFamily: 'Inter' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#8888A0' : '#6B6B82', letterSpacing: '0.1em', marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: p.color }} />
          <span style={{ fontSize: 12, color: isDark ? '#8888A0' : '#6B6B82' }}>{p.name}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#F1F1F5' : '#0A0A12', marginLeft: 8 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Battery bar ─────────────────────────────────────────
function BatteryBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 5, borderRadius: 4, background: 'rgba(128,128,160,0.15)', overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ height: '100%', background: pct < 25 ? '#F87171' : color, borderRadius: 4 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: pct < 25 ? '#F87171' : color, minWidth: 32, textAlign: 'right' }}>{pct}%</span>
    </div>
  );
}

// ─── Achievement Modal ────────────────────────────────────
function AchievementModal({ a, onClose, isDark, divider }: { a: typeof ACHIEVEMENTS[0]; onClose: () => void; isDark: boolean; divider: string }) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.88, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 16 }}
        transition={{ type: 'spring', damping: 22, stiffness: 320 }}
        style={{
          position: 'relative', zIndex: 1, width: 420, padding: '36px',
          background: isDark ? '#16161E' : '#FFFFFF',
          border: `1px solid ${a.color}40`,
          borderRadius: 28,
          boxShadow: isDark ? `0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px ${a.color}20` : `0 32px 80px rgba(0,0,0,0.18)`,
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#555568' : '#A0A0B0', padding: 6 }}>
          <X style={{ width: 18, height: 18 }} />
        </button>

        {/* Top accent */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${a.color}, ${a.color}44)`, borderRadius: 4, marginBottom: 28 }} />

        <div style={{ fontSize: 52, marginBottom: 16, textAlign: 'center' }}>{a.icon}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: isDark ? '#F1F1F5' : '#0A0A12', textAlign: 'center', marginBottom: 6 }}>{a.label}</div>
        <div style={{ fontSize: 13, color: a.color, fontWeight: 600, textAlign: 'center', marginBottom: 20 }}>{a.sub}</div>

        <p style={{ fontSize: 14, lineHeight: 1.7, color: isDark ? '#8888A0' : '#6B6B82', marginBottom: 20, textAlign: 'center' }}>
          {a.desc}
        </p>

        {/* Progress */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#555568' : '#A0A0B0', letterSpacing: '0.1em' }}>PROGRESS</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: a.color }}>{a.progress}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 6, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${a.progress}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
              style={{ height: '100%', background: a.color, borderRadius: 6 }}
            />
          </div>
        </div>

        {a.earned ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 16px', borderRadius: 14, background: `${a.color}12`, border: `1px solid ${a.color}30` }}>
            <Check style={{ width: 14, height: 14, color: a.color }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: a.color }}>Earned {a.earnedDate}</span>
          </div>
        ) : (
          <div style={{ textAlign: 'center', fontSize: 13, color: isDark ? '#555568' : '#A0A0B0' }}>
            Keep going — you're {a.progress}% of the way there.
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────
export function DashboardPage() {
  const s = useStyles();
  const navigate = useNavigate();

  // State
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(INITIAL_USER.name);
  const [editHandle, setEditHandle] = useState(INITIAL_USER.handle);
  const [savedName, setSavedName] = useState(INITIAL_USER.name);
  const [savedHandle, setSavedHandle] = useState(INITIAL_USER.handle);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFS);
  const [syncingDevices, setSyncingDevices] = useState<Record<string, boolean>>({});
  const [syncedTimes, setSyncedTimes] = useState<Record<string, string>>({});
  const [selectedAchievement, setSelectedAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null);
  const [expandedRant, setExpandedRant] = useState<number | null>(null);
  const [rantLikes, setRantLikes] = useState<Record<number, { count: number; liked: boolean }>>(() =>
    Object.fromEntries(RECENT_RANTS.map(r => [r.id, { count: r.likes, liked: false }]))
  );

  const unreadCount = notifs.filter(n => !n.read).length;

  const card = (extra?: React.CSSProperties) => ({
    background: s.isDark ? '#111118' : '#FFFFFF',
    border: `1px solid ${s.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
    boxShadow: s.isDark ? '0 16px 48px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.06)',
    borderRadius: 24,
    ...extra,
  });

  function saveEdit() {
    setSavedName(editName);
    setSavedHandle(editHandle);
    setEditMode(false);
  }

  function cancelEdit() {
    setEditName(savedName);
    setEditHandle(savedHandle);
    setEditMode(false);
  }

  function syncDevice(id: string) {
    setSyncingDevices(p => ({ ...p, [id]: true }));
    setTimeout(() => {
      setSyncingDevices(p => ({ ...p, [id]: false }));
      setSyncedTimes(p => ({ ...p, [id]: 'just now' }));
    }, 2200);
  }

  function markAllRead() {
    setNotifs(n => n.map(x => ({ ...x, read: true })));
  }

  function toggleLike(id: number) {
    setRantLikes(prev => ({
      ...prev,
      [id]: { count: prev[id].liked ? prev[id].count - 1 : prev[id].count + 1, liked: !prev[id].liked },
    }));
  }

  return (
    <div style={{ minHeight: '100vh', background: s.isDark ? '#09090E' : '#F7F7FA' }}>

      {/* ─── Header ─── */}
      <section style={{ background: s.isDark ? 'radial-gradient(ellipse 1100px 400px at 60% -60px, rgba(16,185,129,0.1) 0%, transparent 65%)' : 'radial-gradient(ellipse 1100px 400px at 60% -60px, rgba(16,185,129,0.06) 0%, transparent 65%)' }}>
        <div className="max-w-[1440px] mx-auto px-10 pt-14 pb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flame style={{ width: 13, height: 13, color: '#F59E0B' }} />
                <span style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, color: s.isDark ? '#8888A0' : '#6B6B82' }}>MY DASHBOARD</span>
              </div>
              <h1 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', color: s.isDark ? '#F1F1F5' : '#0A0A12' }}>
                Welcome back, {savedName.split(' ')[0]}. 👋
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div style={{ position: 'relative' }}>
                <motion.button
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
                  onClick={() => setNotifOpen(v => !v)}
                  style={{ width: 40, height: 40, borderRadius: 14, border: 'none', cursor: 'pointer', background: notifOpen ? (s.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.09)') : (s.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'), display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.isDark ? '#8888A0' : '#6B6B82', position: 'relative' }}
                >
                  <Bell style={{ width: 18, height: 18 }} />
                  <AnimatePresence>
                    {unreadCount > 0 && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        style={{ position: 'absolute', top: 7, right: 7, width: 8, height: 8, borderRadius: '50%', background: '#F87171', border: `2px solid ${s.isDark ? '#09090E' : '#F7F7FA'}` }}
                      />
                    )}
                  </AnimatePresence>
                </motion.button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      style={{ position: 'absolute', top: '110%', right: 0, width: 310, zIndex: 100, ...card({ borderRadius: 18 }), padding: 0, overflow: 'hidden' }}
                    >
                      <div style={{ padding: '14px 18px', borderBottom: `1px solid ${s.divider}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: s.isDark ? '#F1F1F5' : '#0A0A12' }}>Notifications</span>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} style={{ fontSize: 11, fontWeight: 600, color: '#8B5CF6', background: 'none', border: 'none', cursor: 'pointer' }}>Mark all read</button>
                        )}
                      </div>
                      {notifs.map((n, i) => (
                        <motion.div
                          key={i} whileHover={{ background: s.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                          onClick={() => setNotifs(prev => prev.map((x, j) => j === i ? { ...x, read: true } : x))}
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                          style={{ borderBottom: i < notifs.length - 1 ? `1px solid ${s.divider}` : 'none', opacity: n.read ? 0.55 : 1 }}
                        >
                          <span style={{ fontSize: 18 }}>{n.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, color: s.isDark ? '#F1F1F5' : '#0A0A12' }}>{n.msg}</div>
                            <div style={{ fontSize: 11, color: s.isDark ? '#555568' : '#A0A0B0', marginTop: 1 }}>{n.time}</div>
                          </div>
                          {!n.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: n.color, flexShrink: 0 }} />}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Edit / Save / Cancel */}
              {editMode ? (
                <div className="flex items-center gap-2">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={cancelEdit}
                    style={{ padding: '10px 16px', borderRadius: 14, border: `1px solid ${s.divider}`, cursor: 'pointer', background: 'transparent', color: s.isDark ? '#8888A0' : '#6B6B82', fontSize: 13, fontWeight: 600 }}>
                    Cancel
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={saveEdit}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 14, border: 'none', cursor: 'pointer', background: '#10B981', color: '#fff', fontSize: 13, fontWeight: 700 }}>
                    <Check style={{ width: 14, height: 14 }} /> Save changes
                  </motion.button>
                </div>
              ) : (
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setEditMode(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 14, border: 'none', cursor: 'pointer', background: s.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', color: s.isDark ? '#8888A0' : '#6B6B82', fontSize: 13, fontWeight: 600 }}>
                  <Edit3 style={{ width: 14, height: 14 }} /> Edit profile
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-10 pb-24">
        <div className="grid gap-6" style={{ gridTemplateColumns: '340px 1fr' }}>

          {/* ─── Left Column ─── */}
          <div className="flex flex-col gap-6">

            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={card()}>
              <div style={{ height: 80, background: 'linear-gradient(135deg, #8B5CF6 0%, #10B981 100%)', borderRadius: '24px 24px 0 0', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 12, right: 12, padding: '4px 10px', borderRadius: 20, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Flame style={{ width: 12, height: 12, color: '#F59E0B' }} />
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{INITIAL_USER.streak} day streak</span>
                </div>
              </div>

              <div style={{ padding: '0 24px 24px' }}>
                <div style={{ marginTop: -36, marginBottom: 14 }}>
                  <motion.div
                    whileHover={editMode ? { scale: 1.06 } : { scale: 1.02 }}
                    whileTap={editMode ? { scale: 0.97 } : {}}
                    style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#fff', border: `4px solid ${s.isDark ? '#111118' : '#FFFFFF'}`, cursor: editMode ? 'pointer' : 'default', boxShadow: '0 8px 24px rgba(139,92,246,0.4)', position: 'relative' }}
                  >
                    {savedName.split(' ').map(n => n[0]).join('')}
                    {editMode && (
                      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Edit3 style={{ width: 16, height: 16, color: '#fff' }} />
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Editable name/handle */}
                {editMode ? (
                  <div style={{ marginBottom: 14 }}>
                    <input
                      value={editName} onChange={e => setEditName(e.target.value)}
                      style={{ width: '100%', fontSize: 18, fontWeight: 800, color: s.isDark ? '#F1F1F5' : '#0A0A12', background: s.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', border: `1px solid #8B5CF6`, borderRadius: 10, padding: '8px 12px', outline: 'none', fontFamily: 'Inter', marginBottom: 8 }}
                    />
                    <input
                      value={editHandle} onChange={e => setEditHandle(e.target.value)}
                      style={{ width: '100%', fontSize: 13, color: s.isDark ? '#8888A0' : '#6B6B82', background: s.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', border: `1px solid ${s.divider}`, borderRadius: 10, padding: '6px 12px', outline: 'none', fontFamily: 'Inter' }}
                    />
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.isDark ? '#F1F1F5' : '#0A0A12', letterSpacing: '-0.02em', marginBottom: 2 }}>{savedName}</div>
                    <div style={{ fontSize: 13, color: s.isDark ? '#555568' : '#A0A0B0', marginBottom: 4 }}>{savedHandle}</div>
                  </>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <div style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Shield style={{ width: 10, height: 10, color: '#8B5CF6' }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#8B5CF6' }}>{INITIAL_USER.tier}</span>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: s.isDark ? '#555568' : '#A0A0B0', marginBottom: 16 }}>{INITIAL_USER.joinDate}</div>

                <div className="grid grid-cols-3" style={{ borderTop: `1px solid ${s.divider}` }}>
                  {[
                    { label: 'Rants', val: INITIAL_USER.totalRants },
                    { label: 'Followers', val: INITIAL_USER.followers },
                    { label: 'Following', val: INITIAL_USER.following },
                  ].map((stat, i) => (
                    <motion.div key={stat.label} whileHover={{ background: s.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                      style={{ padding: '14px 8px', textAlign: 'center', borderRight: i < 2 ? `1px solid ${s.divider}` : 'none', cursor: 'pointer', borderRadius: i === 0 ? '0 0 0 16px' : i === 2 ? '0 0 16px 0' : 0 }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: s.isDark ? '#F1F1F5' : '#0A0A12' }}>{stat.val}</div>
                      <div style={{ fontSize: 11, color: s.isDark ? '#555568' : '#A0A0B0', marginTop: 2 }}>{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Device Status */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} style={card()}>
              <div style={{ padding: '20px 24px' }}>
                <div className="flex items-center justify-between mb-4">
                  <div style={{ fontSize: 14, fontWeight: 700, color: s.isDark ? '#F1F1F5' : '#0A0A12' }}>Device Status</div>
                  <Link to="/devices" style={{ fontSize: 12, fontWeight: 600, color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                    Manage <ChevronRight style={{ width: 12, height: 12 }} />
                  </Link>
                </div>
                <div className="flex flex-col gap-5">
                  {DEVICES.map(d => {
                    const isSyncing = syncingDevices[d.id];
                    const syncedTime = syncedTimes[d.id] ?? d.synced;
                    return (
                      <div key={d.id}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <motion.div
                              style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }}
                              animate={d.status === 'live' ? { opacity: [1, 0.3, 1] } : { opacity: 0.4 }}
                              transition={{ duration: 1.8, repeat: d.status === 'live' ? Infinity : 0 }}
                            />
                            <span style={{ fontSize: 13, fontWeight: 600, color: s.isDark ? '#F1F1F5' : '#0A0A12' }}>{d.name}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: d.color, letterSpacing: '0.08em' }}>
                              {isSyncing ? 'SYNCING…' : d.status === 'live' ? 'LIVE' : 'IDLE'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: 11, color: s.isDark ? '#555568' : '#A0A0B0' }}>
                              {isSyncing ? '…' : syncedTime}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                              onClick={() => syncDevice(d.id)}
                              disabled={isSyncing}
                              style={{ width: 26, height: 26, borderRadius: 8, background: `${d.color}18`, border: `1px solid ${d.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isSyncing ? 'default' : 'pointer' }}
                            >
                              <motion.div animate={isSyncing ? { rotate: 360 } : { rotate: 0 }} transition={isSyncing ? { duration: 0.8, repeat: Infinity, ease: 'linear' } : {}}>
                                <RefreshCw style={{ width: 12, height: 12, color: d.color }} />
                              </motion.div>
                            </motion.button>
                          </div>
                        </div>
                        <BatteryBar pct={d.battery} color={d.color} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} style={card()}>
              <div style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: s.isDark ? '#F1F1F5' : '#0A0A12', marginBottom: 14 }}>Quick Actions</div>
                <div className="grid grid-cols-2 gap-3">
                  {QUICK_ACTIONS.map(a => (
                    <Link key={a.label} to={a.to} style={{ textDecoration: 'none' }}>
                      <motion.div
                        whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
                        style={{ padding: '13px 14px', borderRadius: 16, background: `${a.color}15`, border: `1px solid ${a.color}30`, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                      >
                        <a.icon style={{ width: 16, height: 16, color: a.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: a.color }}>{a.label}</span>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} style={card()}>
              <div style={{ padding: '20px 24px' }}>
                <div className="flex items-center justify-between mb-4">
                  <div style={{ fontSize: 14, fontWeight: 700, color: s.isDark ? '#F1F1F5' : '#0A0A12' }}>Achievements</div>
                  <span style={{ fontSize: 12, color: s.isDark ? '#555568' : '#A0A0B0' }}>4 / 6 earned</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {ACHIEVEMENTS.map(a => (
                    <motion.div
                      key={a.label}
                      whileHover={{ scale: 1.07, y: -3 }} whileTap={{ scale: 0.96 }}
                      onClick={() => setSelectedAchievement(a)}
                      style={{ padding: '14px 8px', borderRadius: 16, textAlign: 'center', background: a.earned ? `${a.color}12` : (s.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'), border: `1px solid ${a.earned ? `${a.color}30` : s.divider}`, opacity: a.earned ? 1 : 0.55, cursor: 'pointer', boxShadow: a.earned ? `0 4px 16px ${a.color}20` : 'none' }}
                    >
                      <div style={{ fontSize: 24, marginBottom: 5 }}>{a.icon}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: a.earned ? a.color : (s.isDark ? '#555568' : '#A0A0B0'), lineHeight: 1.3 }}>{a.label}</div>
                      {!a.earned && (
                        <div style={{ marginTop: 4, height: 3, borderRadius: 3, background: 'rgba(128,128,160,0.15)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${a.progress}%`, background: a.color, borderRadius: 3 }} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: s.isDark ? '#555568' : '#A0A0B0', textAlign: 'center', marginTop: 12 }}>Tap any badge to see details</p>
              </div>
            </motion.div>
          </div>

          {/* ─── Right / Main Column ─── */}
          <div className="flex flex-col gap-6">

            {/* Today's Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: MessageSquare, label: "Today's Rants", val: '3', sub: '+2 since 9AM', color: '#8B5CF6', trend: 'up', to: '/' },
                  { icon: Flame, label: 'Active Streak', val: '14', sub: 'days in a row', color: '#F59E0B', trend: 'up', to: null },
                  { icon: Brain, label: 'Avg Anxiety', val: '42', sub: '↓ 8 from yesterday', color: '#F87171', trend: 'down', to: '/pulse-map' },
                  { icon: Moon, label: 'Sleep Score', val: '81', sub: '7h 24m last night', color: '#3B82F6', trend: 'up', to: '/pulse-map' },
                ].map(stat => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.03, y: -3 }} whileTap={{ scale: 0.98 }}
                    onClick={() => stat.to && navigate(stat.to)}
                    style={{ ...card(), padding: '18px 20px', cursor: stat.to ? 'pointer' : 'default' }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div style={{ width: 30, height: 30, borderRadius: 10, background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <stat.icon style={{ width: 14, height: 14, color: stat.color }} />
                      </div>
                      {stat.trend === 'up'
                        ? <TrendingUp style={{ width: 14, height: 14, color: '#10B981' }} />
                        : <TrendingDown style={{ width: 14, height: 14, color: '#10B981' }} />}
                    </div>
                    <div style={{ fontSize: 34, fontWeight: 900, color: stat.color, letterSpacing: '-0.04em', lineHeight: 1 }}>{stat.val}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: s.isDark ? '#8888A0' : '#6B6B82', marginTop: 6 }}>{stat.label}</div>
                    <div style={{ fontSize: 11, color: s.isDark ? '#555568' : '#A0A0B0', marginTop: 2 }}>{stat.sub}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Weekly Overview Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={card()}>
              <div style={{ padding: '24px 28px' }}>
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: s.isDark ? '#8B5CF6' : '#6D28D9', marginBottom: 6 }}>WEEKLY OVERVIEW</div>
                    <h3 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', color: s.isDark ? '#F1F1F5' : '#0A0A12' }}>7-Day Activity</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    {[{ label: 'Anxiety', color: '#8B5CF6' }, { label: 'Resilience', color: '#10B981' }].map(l => (
                      <div key={l.label} className="flex items-center gap-2">
                        <div style={{ width: 16, height: 2.5, borderRadius: 4, background: l.color }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: l.color }}>{l.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={ACTIVITY_DATA} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient key="dashAnx" id="dashAnx" x1="0" y1="0" x2="0" y2="1">
                        <stop key="dashAnx-5" offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                        <stop key="dashAnx-95" offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient key="dashRes" id="dashRes" x1="0" y1="0" x2="0" y2="1">
                        <stop key="dashRes-5" offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                        <stop key="dashRes-95" offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={s.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: s.isDark ? '#555568' : '#A0A0B0', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: s.isDark ? '#555568' : '#A0A0B0', fontFamily: 'Inter' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip content={<ChartTip isDark={s.isDark} />} />
                    <Area type="monotone" dataKey="anxiety" name="Anxiety" stroke="#8B5CF6" strokeWidth={2} fill="url(#dashAnx)" dot={false} />
                    <Area type="monotone" dataKey="resilience" name="Resilience" stroke="#10B981" strokeWidth={2} fill="url(#dashRes)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Recent Rants */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={card()}>
              <div style={{ padding: '24px 28px' }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: s.isDark ? '#8B5CF6' : '#6D28D9', marginBottom: 6 }}>RECENT ACTIVITY</div>
                    <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: s.isDark ? '#F1F1F5' : '#0A0A12' }}>Your latest rants</h3>
                  </div>
                  <Link to="/" style={{ fontSize: 13, fontWeight: 600, color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                    View all <ChevronRight style={{ width: 14, height: 14 }} />
                  </Link>
                </div>

                <div className="flex flex-col gap-4">
                  {RECENT_RANTS.map(rant => {
                    const likeState = rantLikes[rant.id];
                    return (
                      <motion.div
                        key={rant.id} layout
                        whileHover={{ scale: 1.01 }}
                        style={{ padding: '18px 20px', borderRadius: 18, background: s.isDark ? '#16161E' : '#F8F8FC', border: `1px solid ${s.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, cursor: 'pointer' }}
                        onClick={() => setExpandedRant(expandedRant === rant.id ? null : rant.id)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <p style={{ fontSize: 14, lineHeight: 1.65, color: s.isDark ? '#E0E0EE' : '#2A2A3A', flex: 1 }}>"{rant.text}"</p>
                          <div style={{ flexShrink: 0, width: 42, height: 42, borderRadius: 14, background: rant.anxietyAtRant > 60 ? 'rgba(248,113,113,0.12)' : 'rgba(16,185,129,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ fontSize: 16, fontWeight: 900, color: rant.anxietyAtRant > 60 ? '#F87171' : '#10B981', lineHeight: 1 }}>{rant.anxietyAtRant}</div>
                            <div style={{ fontSize: 8, fontWeight: 700, color: rant.anxietyAtRant > 60 ? '#F87171' : '#10B981', opacity: 0.7 }}>ANX</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center gap-2">
                            {rant.tags.map(tag => (
                              <span key={tag} style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: s.isDark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}>{tag}</span>
                            ))}
                          </div>
                          <span style={{ fontSize: 11, color: s.isDark ? '#555568' : '#A0A0B0', marginLeft: 'auto' }}>{rant.time}</span>

                          {/* Like button */}
                          <motion.button
                            whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }}
                            onClick={e => { e.stopPropagation(); toggleLike(rant.id); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', borderRadius: 8 }}
                          >
                            <motion.div animate={{ scale: likeState.liked ? [1, 1.4, 1] : 1 }} transition={{ duration: 0.3 }}>
                              <Heart style={{ width: 14, height: 14, color: likeState.liked ? '#F87171' : (s.isDark ? '#555568' : '#A0A0B0'), fill: likeState.liked ? '#F87171' : 'none' }} />
                            </motion.div>
                            <span style={{ fontSize: 12, color: likeState.liked ? '#F87171' : (s.isDark ? '#555568' : '#A0A0B0'), fontWeight: likeState.liked ? 700 : 400 }}>{likeState.count}</span>
                          </motion.button>
                        </div>

                        {/* Expanded empathy */}
                        <AnimatePresence>
                          {expandedRant === rant.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{ opacity: 1, height: 'auto', marginTop: 14 }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }}
                              style={{ overflow: 'hidden' }}
                            >
                              <div style={{ padding: '12px 16px', borderRadius: 14, background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
                                <div style={{ fontSize: 10, fontWeight: 800, color: '#8B5CF6', letterSpacing: '0.12em', marginBottom: 6 }}>AI EMPATHY · BIOMETRIC CONTEXT</div>
                                <p style={{ fontSize: 13, lineHeight: 1.65, color: s.isDark ? '#C0B8E8' : '#4B4080' }}>{rant.empathy}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ─── Achievement Modal ─── */}
      <AnimatePresence>
        {selectedAchievement && (
          <AchievementModal
            a={selectedAchievement}
            onClose={() => setSelectedAchievement(null)}
            isDark={s.isDark}
            divider={s.divider}
          />
        )}
      </AnimatePresence>

      {/* ─── FAB: New Rant ─── */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring', damping: 18 }}
        style={{ position: 'fixed', bottom: 32, right: 36, zIndex: 90 }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <motion.div
            whileHover={{ scale: 1.08, boxShadow: '0 12px 40px rgba(139,92,246,0.55)' }}
            whileTap={{ scale: 0.94 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 22px', borderRadius: 20, background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 32px rgba(139,92,246,0.4)' }}
          >
            <MessageSquare style={{ width: 18, height: 18 }} />
            New Rant
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}