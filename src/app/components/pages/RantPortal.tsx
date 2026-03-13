import { useState } from 'react';
import { Mic, Sparkles, Wind, Waves, Zap, Droplets, Flame, ArrowRight, Radio } from 'lucide-react';
import { useStyles } from '../ThemeContext';
import { motion } from 'motion/react';

const EMOTIONS = [
  { id: 'rage', label: 'Rage', Icon: Flame, color: '#F97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)' },
  { id: 'sad', label: 'Sad', Icon: Droplets, color: '#60A5FA', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.3)' },
  { id: 'anxiety', label: 'Anxiety', Icon: Zap, color: '#FACC15', bg: 'rgba(250,204,21,0.12)', border: 'rgba(250,204,21,0.3)' },
  { id: 'calm', label: 'Calm', Icon: Waves, color: '#34D399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)' },
];

const RANTS = [
  {
    id: 1, initials: 'MK', emotion: { label: 'Anxiety', color: '#FACC15', bg: 'rgba(250,204,21,0.12)', Icon: Zap },
    time: '3m ago',
    text: "My manager just moved the deadline to tomorrow at 9am without checking if it was feasible. I've been working on this for two weeks and now I have to redo everything overnight. I'm exhausted and nobody even asked if I'm okay.",
    breathe: 84, feel: 122, walk: 37,
  },
  {
    id: 2, initials: 'SC', emotion: { label: 'Sad', color: '#60A5FA', bg: 'rgba(96,165,250,0.12)', Icon: Droplets },
    time: '11m ago',
    text: "I've been sending applications for 6 months. Every rejection chips away a little more. I used to feel confident about my skills. Now I question everything. I don't know when this ends.",
    breathe: 210, feel: 365, walk: 88,
  },
  {
    id: 3, initials: 'TR', emotion: { label: 'Rage', color: '#F97316', bg: 'rgba(249,115,22,0.12)', Icon: Flame },
    time: '29m ago',
    text: "Why does nobody in this family listen? I say the same thing over and over and they nod and keep doing whatever they want anyway. I feel completely invisible in my own home.",
    breathe: 156, feel: 289, walk: 72,
  },
];

function ReactionButton({ emoji, label, count, isDark }: { emoji: string; label: string; count: number; isDark: boolean }) {
  const [active, setActive] = useState(false);
  const [c, setC] = useState(count);

  const toggle = () => {
    setActive(a => !a);
    setC(prev => active ? prev - 1 : prev + 1);
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-all"
      style={{
        background: active ? (isDark ? 'rgba(139,92,246,0.18)' : 'rgba(109,40,217,0.08)') : 'transparent',
        color: active ? (isDark ? '#A78BFA' : '#6D28D9') : isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
      }}
    >
      <span>{emoji}</span>
      <span className="flex-1 text-left">{label}</span>
      <span style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)', fontSize: 12 }}>{c.toLocaleString()}</span>
    </button>
  );
}

function RantCard({ rant, isDark, divider }: { rant: typeof RANTS[0]; isDark: boolean; divider: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 p-6 rounded-2xl"
      style={{
        background: isDark ? '#111118' : '#FFFFFF',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
        boxShadow: isDark ? '0 8px 40px rgba(0,0,0,0.35)' : '0 4px 24px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.3) 0%, rgba(109,40,217,0.3) 100%)' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#C4B5FD' : '#6D28D9' }}>{rant.initials}</span>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: isDark ? '#F1F1F5' : '#0A0A12' }}>Anonymous</div>
            <div style={{ fontSize: 12, color: isDark ? '#8888A0' : '#6B6B82' }}>{rant.time}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: rant.emotion.bg }}>
          <rant.emotion.Icon style={{ width: 12, height: 12, color: rant.emotion.color }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: rant.emotion.color }}>{rant.emotion.label}</span>
        </div>
      </div>

      {/* Text */}
      <p style={{ fontSize: 14, lineHeight: '1.7', color: isDark ? 'rgba(241,241,245,0.65)' : 'rgba(10,10,18,0.65)', flex: 1 }}>
        "{rant.text}"
      </p>

      {/* Reactions */}
      <div style={{ borderTop: `1px solid ${divider}`, paddingTop: 12 }}>
        <ReactionButton emoji="🫁" label="Breathe With Me" count={rant.breathe} isDark={isDark} />
        <ReactionButton emoji="💙" label="I Feel You" count={rant.feel} isDark={isDark} />
        <ReactionButton emoji="🚶" label="Not Alone" count={rant.walk} isDark={isDark} />
      </div>
    </motion.div>
  );
}

export function RantPortal() {
  const s = useStyles();
  const [rantText, setRantText] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden">
        {/* Background gradient orb */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: s.isDark
              ? 'radial-gradient(ellipse 900px 600px at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 70%)'
              : 'radial-gradient(ellipse 900px 600px at 50% 0%, rgba(109,40,217,0.07) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-[1440px] mx-auto px-10 pt-20 pb-16 relative">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            <span style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 600, color: s.isDark ? '#8B5CF6' : '#6D28D9' }}>
              EMOTIONAL INTELLIGENCE PLATFORM
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-center mb-6"
          >
            <h1
              className="mx-auto"
              style={{
                fontSize: 80,
                lineHeight: 1.02,
                fontWeight: 800,
                letterSpacing: '-0.04em',
                color: s.isDark ? '#F1F1F5' : '#0A0A12',
                maxWidth: 700,
              }}
            >
              Let it out.
            </h1>
            <h1
              style={{
                fontSize: 80,
                lineHeight: 1.02,
                fontWeight: 800,
                letterSpacing: '-0.04em',
                background: 'linear-gradient(135deg, #A78BFA 0%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              We're listening.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center max-w-md mx-auto mb-12"
            style={{ fontSize: 17, lineHeight: 1.65, color: s.isDark ? '#8888A0' : '#6B6B82' }}
          >
            Anonymous. Judgment-free. Your emotional data stays private, analyzed only for your well-being.
          </motion.p>

          {/* Rant Input Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="max-w-3xl mx-auto rounded-2xl overflow-hidden"
            style={{
              background: s.isDark ? '#111118' : '#FFFFFF',
              border: `1px solid ${s.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              boxShadow: s.isDark
                ? '0 24px 80px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(139,92,246,0.15)'
                : '0 12px 48px rgba(0,0,0,0.1)',
            }}
          >
            {/* Textarea */}
            <textarea
              value={rantText}
              onChange={e => setRantText(e.target.value)}
              placeholder="Start typing — or use your voice. No judgement here."
              className="w-full p-7 resize-none outline-none block"
              style={{
                minHeight: 180,
                background: 'transparent',
                fontSize: 17,
                lineHeight: 1.65,
                color: s.isDark ? '#F1F1F5' : '#0A0A12',
                fontFamily: 'Inter, sans-serif',
              }}
            />

            {/* Emotion Tags */}
            <div
              className="px-7 py-4 flex items-center gap-3"
              style={{ borderTop: `1px solid ${s.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}
            >
              <span style={{ fontSize: 12, color: s.isDark ? '#8888A0' : '#6B6B82', whiteSpace: 'nowrap', fontWeight: 500 }}>
                How are you feeling?
              </span>
              <div className="flex flex-wrap gap-2">
                {EMOTIONS.map(e => (
                  <button
                    key={e.id}
                    onClick={() => setSelectedEmotion(selectedEmotion === e.id ? null : e.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all"
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: e.color,
                      background: selectedEmotion === e.id ? e.bg : 'transparent',
                      border: `1px solid ${selectedEmotion === e.id ? e.border : s.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                      transform: selectedEmotion === e.id ? 'scale(1.05)' : 'scale(1)',
                      opacity: selectedEmotion && selectedEmotion !== e.id ? 0.45 : 1,
                    }}
                  >
                    <e.Icon style={{ width: 13, height: 13 }} />
                    {e.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div
              className="px-7 py-5 flex items-center justify-between gap-4"
              style={{ borderTop: `1px solid ${s.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}
            >
              <button
                onClick={() => setIsRecording(r => !r)}
                className="flex items-center gap-3 px-7 py-3 rounded-xl text-white transition-all active:scale-95"
                style={{
                  fontWeight: 600,
                  fontSize: 15,
                  background: isRecording
                    ? 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)'
                    : 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                  boxShadow: isRecording
                    ? '0 8px 30px rgba(239,68,68,0.35)'
                    : '0 8px 30px rgba(139,92,246,0.35)',
                }}
              >
                <Mic style={{ width: 18, height: 18, animation: isRecording ? 'pulse 1s infinite' : 'none' }} />
                {isRecording ? '● Recording…' : '🎙️ Begin Voice Rant'}
              </button>

              <div className="flex items-center gap-3">
                <span style={{ fontSize: 12, color: s.isDark ? '#8888A0' : '#6B6B82' }}>
                  {rantText.length} chars
                </span>
                <button
                  className="px-6 py-3 rounded-xl transition-all active:scale-95"
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    border: `1px solid ${s.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                    color: s.isDark ? 'rgba(241,241,245,0.7)' : 'rgba(10,10,18,0.7)',
                  }}
                >
                  Submit Rant
                </button>
              </div>
            </div>
          </motion.div>

          {/* AI Empathy Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="max-w-3xl mx-auto mt-5 p-6 rounded-2xl"
            style={{
              background: s.isDark
                ? 'linear-gradient(135deg, rgba(139,92,246,0.14) 0%, rgba(17,17,24,1) 55%)'
                : 'linear-gradient(135deg, rgba(109,40,217,0.07) 0%, #FFFFFF 55%)',
              border: `1px solid ${s.isDark ? 'rgba(139,92,246,0.25)' : 'rgba(109,40,217,0.18)'}`,
              boxShadow: s.isDark ? '0 0 60px rgba(139,92,246,0.08)' : 'none',
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: 'rgba(139,92,246,0.2)' }}
              >
                <Sparkles style={{ width: 15, height: 15, color: '#A78BFA' }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize: 11, letterSpacing: '0.14em', fontWeight: 700, color: s.isDark ? '#A78BFA' : '#7C3AED' }}>
                    ✨ AI RESPONSE
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{
                      fontSize: 10,
                      background: s.isDark ? 'rgba(139,92,246,0.15)' : 'rgba(109,40,217,0.08)',
                      color: s.isDark ? '#C4B5FD' : '#6D28D9',
                    }}
                  >
                    Empathy Model v3
                  </span>
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: s.isDark ? 'rgba(241,241,245,0.8)' : 'rgba(10,10,18,0.8)' }}>
                  "It sounds like you're carrying something really heavy right now, and that weight is absolutely valid. What you're feeling isn't weakness — it's your nervous system asking for support. Take a slow breath with me. You came here, and that already takes courage."
                </p>
                <div className="flex items-center gap-5 mt-4">
                  <button
                    className="flex items-center gap-2 transition-all hover:opacity-80"
                    style={{ fontSize: 13, fontWeight: 600, color: s.isDark ? '#A78BFA' : '#7C3AED' }}
                  >
                    <Wind style={{ width: 14, height: 14 }} />
                    Breathe With Me
                  </button>
                  <button
                    style={{ fontSize: 13, color: s.isDark ? '#8888A0' : '#6B6B82' }}
                    className="transition-all hover:opacity-70"
                  >
                    Try again ↻
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Support Feed ─── */}
      <section style={{ borderTop: `1px solid ${s.divider}` }}>
        <div className="max-w-[1440px] mx-auto px-10 py-24">
          {/* Section Header */}
          <div className="flex items-end justify-between mb-14">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Radio style={{ width: 14, height: 14, color: s.isDark ? '#8B5CF6' : '#6D28D9' }} />
                <span style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, color: s.isDark ? '#8B5CF6' : '#6D28D9' }}>
                  LIVE
                </span>
              </div>
              <h2
                style={{
                  fontSize: 44,
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: s.isDark ? '#F1F1F5' : '#0A0A12',
                  lineHeight: 1.1,
                }}
              >
                Community Pulse
              </h2>
              <p style={{ fontSize: 16, color: s.isDark ? '#8888A0' : '#6B6B82', marginTop: 8 }}>
                People releasing right now. You are not alone.
              </p>
            </div>
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all hover:opacity-80"
              style={{
                fontSize: 13,
                fontWeight: 600,
                border: `1px solid ${s.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                color: s.isDark ? 'rgba(241,241,245,0.6)' : 'rgba(10,10,18,0.6)',
              }}
            >
              View All Rants <ArrowRight style={{ width: 14, height: 14 }} />
            </button>
          </div>

          {/* Rant Cards Grid */}
          <div className="grid grid-cols-3 gap-6">
            {RANTS.map((rant, i) => (
              <motion.div
                key={rant.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <RantCard rant={rant} isDark={s.isDark} divider={s.divider} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
