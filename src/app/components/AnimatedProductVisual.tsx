import { motion } from 'motion/react';

interface VisualProps {
  accentColor: string;
  isDark: boolean;
  codename: string;
}

/* ─── GDX-01: Anxiety Node ─── */
function AnxietyNodeVisual({ accentColor, isDark, codename }: VisualProps) {
  const bg = isDark ? '#0C0A14' : '#F2EEFF';
  const cardBg = isDark ? '#181228' : '#E8DEFF';

  return (
    <div
      style={{
        width: '100%',
        height: 300,
        background: bg,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}22 0%, transparent 65%)`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Expanding pulse rings */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: 72,
            height: 72,
            borderRadius: '50%',
            border: `1.5px solid ${accentColor}`,
            pointerEvents: 'none',
          }}
          animate={{ scale: [1, 4.2], opacity: [0.55, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
            ease: [0.2, 0.6, 0.4, 1],
          }}
        />
      ))}

      {/* Device patch body */}
      <motion.div
        style={{
          width: 74,
          height: 74,
          borderRadius: 22,
          background: `linear-gradient(145deg, ${accentColor}50, ${accentColor}20)`,
          border: `1.5px solid ${accentColor}70`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10,
          backdropFilter: 'blur(8px)',
        }}
        animate={{
          boxShadow: [
            `0 0 18px ${accentColor}25, 0 0 0px ${accentColor}00`,
            `0 0 40px ${accentColor}55, 0 0 70px ${accentColor}20`,
            `0 0 18px ${accentColor}25, 0 0 0px ${accentColor}00`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {/* 3×3 sensor dot grid */}
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          {[0, 1, 2].flatMap(r =>
            [0, 1, 2].map(c => (
              <motion.circle
                key={`${r}-${c}`}
                cx={8 + c * 14}
                cy={8 + r * 14}
                r={2.5}
                fill={accentColor}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: (r * 3 + c) * 0.12,
                }}
              />
            ))
          )}
          {/* Cross-hair lines */}
          <line x1="22" y1="0" x2="22" y2="44" stroke={`${accentColor}30`} strokeWidth={0.5} />
          <line x1="0" y1="22" x2="44" y2="22" stroke={`${accentColor}30`} strokeWidth={0.5} />
        </svg>
      </motion.div>

      {/* GSR waveform at bottom */}
      <svg
        style={{ position: 'absolute', bottom: 44, left: '50%', transform: 'translateX(-50%)' }}
        width="200"
        height="44"
        viewBox="0 0 200 44"
        overflow="visible"
      >
        {/* Background trace (ghost) */}
        <path
          d="M0,22 L28,22 L36,6 L44,38 L52,22 L80,22 L88,10 L96,34 L104,22 L132,22 L140,8 L148,36 L156,22 L200,22"
          fill="none"
          stroke={`${accentColor}18`}
          strokeWidth={1.5}
        />
        {/* Animated live trace */}
        <motion.path
          d="M0,22 L28,22 L36,6 L44,38 L52,22 L80,22 L88,10 L96,34 L104,22 L132,22 L140,8 L148,36 L156,22 L200,22"
          fill="none"
          stroke={accentColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={320}
          animate={{ strokeDashoffset: [320, -320] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
        />
      </svg>

      {/* Live status indicator */}
      <div
        style={{
          position: 'absolute',
          top: 18,
          right: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)',
          padding: '4px 10px',
          borderRadius: 20,
          backdropFilter: 'blur(8px)',
          border: `1px solid ${accentColor}30`,
        }}
      >
        <motion.div
          style={{ width: 5, height: 5, borderRadius: '50%', background: accentColor }}
          animate={{ opacity: [1, 0.15, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.15em', color: accentColor }}>
          SENSING
        </span>
      </div>

      {/* GSR label */}
      <div
        style={{
          position: 'absolute',
          bottom: 18,
          right: 18,
          fontSize: 10,
          fontWeight: 700,
          color: accentColor,
          opacity: 0.55,
          letterSpacing: '0.08em',
        }}
      >
        GSR · THERMAL
      </div>

      {/* Codename watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: 18,
          left: 18,
          fontSize: 10,
          fontWeight: 800,
          color: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
          letterSpacing: '0.14em',
        }}
      >
        {codename}
      </div>

      {/* Horizontal scan line */}
      <motion.div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${accentColor}40 40%, ${accentColor}70 50%, ${accentColor}40 60%, transparent 100%)`,
        }}
        animate={{ top: ['10%', '90%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatType: 'reverse' }}
      />
    </div>
  );
}

/* ─── GDX-02: Deep Pulse Wristband ─── */
function DeepPulseVisual({ accentColor, isDark, codename }: VisualProps) {
  const bg = isDark ? '#09120F' : '#EAF9F4';

  return (
    <div
      style={{
        width: '100%',
        height: 300,
        background: bg,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          width: 340,
          height: 180,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${accentColor}18 0%, transparent 65%)`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Wristband body */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, zIndex: 10 }}>
        {/* Strap top */}
        <motion.div
          style={{
            width: 54,
            height: 28,
            borderRadius: '8px 8px 0 0',
            background: `linear-gradient(180deg, ${accentColor}35, ${accentColor}18)`,
            border: `1.5px solid ${accentColor}45`,
            borderBottom: 'none',
          }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Device body — landscape display */}
        <motion.div
          style={{
            width: 210,
            height: 80,
            borderRadius: 20,
            background: isDark ? '#121E19' : '#D4F0E6',
            border: `1.5px solid ${accentColor}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
          animate={{
            boxShadow: [
              `0 0 20px ${accentColor}15`,
              `0 0 50px ${accentColor}40`,
              `0 0 20px ${accentColor}15`,
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          {/* Sweep glow */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: 60,
              background: `linear-gradient(90deg, transparent, ${accentColor}25, transparent)`,
            }}
            animate={{ left: ['-20%', '110%'] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 0.3 }}
          />

          {/* BPM readout */}
          <div style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)' }}>
            <motion.div
              style={{ fontSize: 28, fontWeight: 900, color: accentColor, lineHeight: 1, letterSpacing: '-0.04em' }}
              animate={{ opacity: [1, 0.55, 1] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            >
              72
            </motion.div>
            <div style={{ fontSize: 8, fontWeight: 800, color: accentColor, opacity: 0.6, letterSpacing: '0.12em' }}>
              BPM
            </div>
          </div>

          {/* ECG / HRV line */}
          <svg
            style={{ position: 'absolute', right: 0, left: 60, top: 0, bottom: 0 }}
            width="140"
            height="80"
            viewBox="0 0 140 80"
            overflow="visible"
          >
            <path
              d="M0,40 L18,40 L26,8 L34,72 L42,40 L60,40 L66,22 L74,58 L80,40 L98,40 L104,16 L112,64 L118,40 L140,40"
              fill="none"
              stroke={`${accentColor}20`}
              strokeWidth={1.5}
            />
            <motion.path
              d="M0,40 L18,40 L26,8 L34,72 L42,40 L60,40 L66,22 L74,58 L80,40 L98,40 L104,16 L112,64 L118,40 L140,40"
              fill="none"
              stroke={accentColor}
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeDasharray={320}
              animate={{ strokeDashoffset: [320, -320] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
            />
          </svg>
        </motion.div>

        {/* Strap bottom */}
        <motion.div
          style={{
            width: 54,
            height: 28,
            borderRadius: '0 0 8px 8px',
            background: `linear-gradient(0deg, ${accentColor}35, ${accentColor}18)`,
            border: `1.5px solid ${accentColor}45`,
            borderTop: 'none',
          }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      {/* HRV label */}
      <div
        style={{
          position: 'absolute',
          top: 18,
          right: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)',
          padding: '4px 10px',
          borderRadius: 20,
          backdropFilter: 'blur(8px)',
          border: `1px solid ${accentColor}30`,
        }}
      >
        <motion.div
          style={{ width: 5, height: 5, borderRadius: '50%', background: accentColor }}
          animate={{ opacity: [1, 0.1, 1] }}
          transition={{ duration: 1.1, repeat: Infinity }}
        />
        <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.15em', color: accentColor }}>
          LIVE HRV
        </span>
      </div>

      {/* SpO2 badge */}
      <div
        style={{
          position: 'absolute',
          bottom: 18,
          right: 18,
          textAlign: 'right',
        }}
      >
        <motion.div
          style={{ fontSize: 20, fontWeight: 900, color: accentColor, letterSpacing: '-0.03em' }}
          animate={{ opacity: [1, 0.65, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: 0.4 }}
        >
          98%
        </motion.div>
        <div style={{ fontSize: 9, fontWeight: 700, color: accentColor, opacity: 0.55, letterSpacing: '0.1em' }}>
          SpO₂
        </div>
      </div>

      {/* Codename watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: 18,
          left: 18,
          fontSize: 10,
          fontWeight: 800,
          color: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
          letterSpacing: '0.14em',
        }}
      >
        {codename}
      </div>

      {/* Scan line */}
      <motion.div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${accentColor}35 40%, ${accentColor}60 50%, ${accentColor}35 60%, transparent 100%)`,
        }}
        animate={{ top: ['10%', '90%'] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'linear', repeatType: 'reverse' }}
      />
    </div>
  );
}

/* ─── GDX-03: Sleep Mat Sensor ─── */
function SleepMatVisual({ accentColor, isDark, codename }: VisualProps) {
  const bg = isDark ? '#110E07' : '#FDF6E6';
  const cols = 9;
  const rows = 5;

  return (
    <div
      style={{
        width: '100%',
        height: 300,
        background: bg,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          width: 360,
          height: 220,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${accentColor}18 0%, transparent 65%)`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Mat body */}
      <div
        style={{
          width: 260,
          height: 150,
          borderRadius: 14,
          border: `1.5px solid ${accentColor}45`,
          background: isDark ? '#1C1710' : '#FFF6E0',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: `0 0 50px ${accentColor}15, inset 0 0 40px ${accentColor}08`,
          zIndex: 10,
        }}
      >
        {/* Dot grid */}
        <svg width="260" height="150" viewBox="0 0 260 150" style={{ position: 'absolute', top: 0, left: 0 }}>
          {Array.from({ length: rows }).flatMap((_, r) =>
            Array.from({ length: cols }).map((_, c) => {
              const x = 22 + c * 27;
              const y = 18 + r * 28;
              const distFromCenter = Math.sqrt((c - (cols - 1) / 2) ** 2 + (r - (rows - 1) / 2) ** 2);
              return (
                <motion.circle
                  key={`dot-${r}-${c}`}
                  cx={x}
                  cy={y}
                  r={2.2}
                  fill={accentColor}
                  animate={{ opacity: [0.12, 0.85, 0.12], r: [1.8, 3, 1.8] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: distFromCenter * 0.22,
                    ease: 'easeInOut',
                  }}
                />
              );
            })
          )}
          {/* Grid lines */}
          {Array.from({ length: cols - 1 }).map((_, c) => (
            <line
              key={`vl-${c}`}
              x1={22 + (c + 1) * 27}
              y1={8}
              x2={22 + (c + 1) * 27}
              y2={142}
              stroke={`${accentColor}08`}
              strokeWidth={0.5}
            />
          ))}
          {Array.from({ length: rows - 1 }).map((_, r) => (
            <line
              key={`hl-${r}`}
              x1={8}
              y1={18 + (r + 1) * 28}
              x2={252}
              y2={18 + (r + 1) * 28}
              stroke={`${accentColor}08`}
              strokeWidth={0.5}
            />
          ))}
        </svg>

        {/* Ripple rectangles from center */}
        {[0, 1, 2].map(i => (
          <motion.div
            key={`ripple-${i}`}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: 8,
              border: `1px solid ${accentColor}`,
            }}
            animate={{
              width: [30, 240],
              height: [18, 138],
              opacity: [0.65, 0],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              delay: i * 1.05,
              ease: [0.2, 0.6, 0.4, 1],
            }}
          />
        ))}

        {/* Center blip */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: accentColor,
            zIndex: 5,
          }}
          animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Status badge */}
      <div
        style={{
          position: 'absolute',
          top: 18,
          right: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)',
          padding: '4px 10px',
          borderRadius: 20,
          backdropFilter: 'blur(8px)',
          border: `1px solid ${accentColor}30`,
        }}
      >
        <motion.div
          style={{ width: 5, height: 5, borderRadius: '50%', background: accentColor }}
          animate={{ opacity: [1, 0.15, 1] }}
          transition={{ duration: 1.9, repeat: Infinity }}
        />
        <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.15em', color: accentColor }}>
          MAPPING
        </span>
      </div>

      {/* Thermal readout */}
      <div
        style={{
          position: 'absolute',
          bottom: 18,
          right: 18,
          textAlign: 'right',
        }}
      >
        <motion.div
          style={{ fontSize: 20, fontWeight: 900, color: accentColor, letterSpacing: '-0.03em' }}
          animate={{ opacity: [1, 0.65, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          28.4°C
        </motion.div>
        <div style={{ fontSize: 9, fontWeight: 700, color: accentColor, opacity: 0.55, letterSpacing: '0.1em' }}>
          THERMAL BASELINE
        </div>
      </div>

      {/* Codename watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: 18,
          left: 18,
          fontSize: 10,
          fontWeight: 800,
          color: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
          letterSpacing: '0.14em',
        }}
      >
        {codename}
      </div>

      {/* Scan line */}
      <motion.div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${accentColor}30 40%, ${accentColor}55 50%, ${accentColor}30 60%, transparent 100%)`,
        }}
        animate={{ top: ['8%', '92%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatType: 'reverse' }}
      />
    </div>
  );
}

/* ─── Public Dispatcher ─── */
interface AnimatedProductVisualProps {
  productId: string;
  accentColor: string;
  isDark: boolean;
  codename: string;
}

export function AnimatedProductVisual({
  productId,
  accentColor,
  isDark,
  codename,
}: AnimatedProductVisualProps) {
  if (productId === 'anxiety-node')
    return <AnxietyNodeVisual accentColor={accentColor} isDark={isDark} codename={codename} />;
  if (productId === 'deep-pulse')
    return <DeepPulseVisual accentColor={accentColor} isDark={isDark} codename={codename} />;
  return <SleepMatVisual accentColor={accentColor} isDark={isDark} codename={codename} />;
}
