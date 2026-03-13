import { ArrowRight, Activity, Battery, Cpu, Radio, ChevronRight } from 'lucide-react';
import { useStyles } from '../ThemeContext';
import { BodyDiagram } from '../BodyDiagram';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { AnimatedProductVisual } from '../AnimatedProductVisual';

const PRODUCTS = [
  {
    id: 'anxiety-node',
    codename: 'GDX-01',
    name: 'Anxiety Node',
    tagline: 'Bio-adhesive. Behind-ear placement. Always-on sensing.',
    description:
      'A skin-thin, matte-black patch that bonds directly to the mastoid bone area behind your ear. Reads galvanic skin micro-variations and surface thermal shifts in real time — invisible to the world, constant for you.',
    accentColor: '#8B5CF6',
    accentBg: 'rgba(139,92,246,0.1)',
    specs: ['GSR Micro-Array', 'Thermal Tracking', 'Micro-haptic Feedback', '48h Battery'],
    placement: 'Behind the ear',
  },
  {
    id: 'deep-pulse',
    codename: 'GDX-02',
    name: 'Deep Pulse Wristband',
    tagline: 'Palm-side wear. HRV-grade precision. Vanishingly thin.',
    description:
      'Engineered to rest against the radial artery on the palm-side of your wrist for clinical-grade HRV capture. The matte ceramic body disappears against skin — a sensor you forget you\'re wearing.',
    accentColor: '#10B981',
    accentBg: 'rgba(16,185,129,0.1)',
    specs: ['HRV Sensor', 'Blood Pressure Wave', 'Pulse Oximetry', '72h Battery'],
    placement: 'Inner wrist (palm-side)',
  },
  {
    id: 'sleep-mat',
    codename: 'GDX-03',
    name: 'Sleep Mat Sensor',
    tagline: 'Under-sheet. Passively sensing. No contact required.',
    description:
      'An ultra-thin conductive textile mat that lies beneath your fitted sheet. While you sleep, it maps galvanic ambient fields, micro-movements, and temperature gradients across a 2m² surface — contact-free.',
    accentColor: '#F59E0B',
    accentBg: 'rgba(245,158,11,0.1)',
    specs: ['Textile Matrix (2m²)', 'Ambient GSR Field', 'Micro-movement', '7-day Charge'],
    placement: 'Under your sheet',
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    n: '01',
    title: 'Adhere & Forget',
    desc: 'Press the Anxiety Node behind your ear. The medical-grade hydrocolloid adhesive bonds in under 3 seconds. No clips, no straps.',
  },
  {
    n: '02',
    title: 'Passive Sensing Begins',
    desc: 'Galvanic skin micro-currents and surface thermal patterns are continuously sampled at 256Hz — below the threshold of skin awareness.',
  },
  {
    n: '03',
    title: 'Edge Processing',
    desc: 'The onboard ARM Cortex-M33 processes raw signals locally. Only anonymized emotional signals leave the device via BLE 5.3.',
  },
  {
    n: '04',
    title: 'Rant Context Sync',
    desc: 'When you rant, the timestamp is correlated with biometric state — giving your AI empathy layer physiological context.',
  },
];

function ProductCard({ product, index }: { product: typeof PRODUCTS[0]; index: number }) {
  const s = useStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className="flex flex-col rounded-3xl overflow-hidden"
      style={{
        background: s.isDark ? '#111118' : '#FFFFFF',
        border: `1px solid ${s.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
        boxShadow: s.isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 8px 40px rgba(0,0,0,0.08)',
      }}
    >
      {/* Animated Visual */}
      <div className="relative overflow-hidden rounded-t-3xl" style={{ height: 300 }}>
        <AnimatedProductVisual
          productId={product.id}
          accentColor={product.accentColor}
          isDark={s.isDark}
          codename={product.codename}
        />
        {/* Bottom fade into card */}
        <div
          className="absolute inset-x-0 bottom-0 h-12 pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${s.isDark ? '#111118' : '#FFFFFF'} 0%, transparent 100%)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="p-7 flex flex-col flex-1 gap-4">
        <div>
          <h3
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: s.isDark ? '#F1F1F5' : '#0A0A12',
              marginBottom: 6,
            }}
          >
            {product.name}
          </h3>
          <p style={{ fontSize: 13, fontWeight: 600, color: product.accentColor }}>{product.tagline}</p>
        </div>

        <p style={{ fontSize: 14, lineHeight: 1.75, color: s.isDark ? '#8888A0' : '#6B6B82' }}>{product.description}</p>

        {/* Placement info */}
        <div
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
          style={{ background: product.accentBg }}
        >
          <Activity style={{ width: 14, height: 14, color: product.accentColor }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: product.accentColor }}>Worn: {product.placement}</span>
        </div>

        {/* Specs pills */}
        <div className="flex flex-wrap gap-2">
          {product.specs.map(spec => (
            <span
              key={spec}
              className="px-3 py-1 rounded-full"
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.04em',
                background: s.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                border: `1px solid ${s.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                color: s.isDark ? 'rgba(241,241,245,0.6)' : 'rgba(10,10,18,0.55)',
              }}
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Link */}
        <Link
          to="/deep-dive"
          className="flex items-center gap-2 mt-auto transition-all hover:gap-3"
          style={{ fontSize: 13, fontWeight: 700, color: product.accentColor }}
        >
          Deep dive specs <ArrowRight style={{ width: 14, height: 14 }} />
        </Link>
      </div>
    </motion.div>
  );
}

export function RantrackerEcosystem() {
  const s = useStyles();

  return (
    <div>
      {/* ─── Hero ─── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: s.isDark
            ? 'radial-gradient(ellipse 1200px 700px at 50% -100px, rgba(139,92,246,0.14) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 1200px 700px at 50% -100px, rgba(109,40,217,0.08) 0%, transparent 70%)',
        }}
      >
        <div className="max-w-[1440px] mx-auto px-10 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <Cpu style={{ width: 14, height: 14, color: s.isDark ? '#8B5CF6' : '#6D28D9' }} />
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  fontWeight: 700,
                  color: s.isDark ? '#8B5CF6' : '#6D28D9',
                }}
              >
                RANTRACKER ECOSYSTEM
              </span>
            </div>
            <h1
              style={{
                fontSize: 72,
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.02,
                color: s.isDark ? '#F1F1F5' : '#0A0A12',
                marginBottom: 20,
              }}
            >
              Hardware built for
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #10B981 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                human emotion.
              </span>
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: s.isDark ? '#8888A0' : '#6B6B82', maxWidth: 540 }}>
              Three devices. One ecosystem. Each designed to attach to a different part of your body — sensing the physiological language of how you actually feel.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Product Showcase ─── */}
      <section style={{ borderTop: `1px solid ${s.divider}` }}>
        <div className="max-w-[1440px] mx-auto px-10 py-20">
          <div className="grid grid-cols-3 gap-7">
            {PRODUCTS.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section style={{ borderTop: `1px solid ${s.divider}` }}>
        <div className="max-w-[1440px] mx-auto px-10 py-24">
          {/* Section label */}
          <div className="flex items-center gap-2 mb-5">
            <Radio style={{ width: 14, height: 14, color: '#8B5CF6' }} />
            <span
              style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, color: '#8B5CF6' }}
            >
              HOW IT WORKS — ANXIETY NODE
            </span>
          </div>
          <h2
            style={{
              fontSize: 52,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.08,
              color: s.isDark ? '#F1F1F5' : '#0A0A12',
              marginBottom: 60,
              maxWidth: 520,
            }}
          >
            Placed once.
            <br />
            Sensing always.
          </h2>

          <div className="grid grid-cols-2 gap-20 items-center">
            {/* Body Diagram */}
            <div className="relative">
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: s.isDark
                    ? 'radial-gradient(ellipse at center, rgba(139,92,246,0.08) 0%, transparent 70%)'
                    : 'radial-gradient(ellipse at center, rgba(109,40,217,0.05) 0%, transparent 70%)',
                }}
              />
              <BodyDiagram />
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-0">
              {HOW_IT_WORKS_STEPS.map((step, i) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex gap-6 py-7"
                  style={{
                    borderBottom: i < HOW_IT_WORKS_STEPS.length - 1 ? `1px solid ${s.divider}` : 'none',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: 'rgba(139,92,246,0.15)' }}
                  >
                    <span
                      style={{ fontSize: 12, fontWeight: 800, color: '#8B5CF6', letterSpacing: '0.05em' }}
                    >
                      {step.n}
                    </span>
                  </div>
                  <div>
                    <h4
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: s.isDark ? '#F1F1F5' : '#0A0A12',
                        marginBottom: 8,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {step.title}
                    </h4>
                    <p
                      style={{ fontSize: 14, lineHeight: 1.75, color: s.isDark ? '#8888A0' : '#6B6B82' }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}

              <div className="mt-8">
                <Link
                  to="/deep-dive"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white transition-all hover:opacity-90 active:scale-95"
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                    boxShadow: '0 8px 32px rgba(139,92,246,0.35)',
                  }}
                >
                  View Full Sensor Specs <ChevronRight style={{ width: 16, height: 16 }} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats bar ─── */}
      <section
        style={{
          background: s.isDark ? '#0D0D15' : '#F5F5FA',
          borderTop: `1px solid ${s.divider}`,
          borderBottom: `1px solid ${s.divider}`,
        }}
      >
        <div className="max-w-[1440px] mx-auto px-10 py-10">
          <div className="grid grid-cols-4 gap-8">
            {[
              { val: '256Hz', label: 'Sampling Rate' },
              { val: '< 1mm', label: 'Device Thickness' },
              { val: '99.2%', label: 'Signal Accuracy' },
              { val: '0 Data', label: 'Sent to Cloud (Raw)' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: s.isDark ? '#F1F1F5' : '#0A0A12',
                    lineHeight: 1.1,
                  }}
                >
                  {stat.val}
                </div>
                <div style={{ fontSize: 13, color: s.isDark ? '#8888A0' : '#6B6B82', marginTop: 6 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}