import { useStyles } from './ThemeContext';

export function BodyDiagram() {
  const s = useStyles();

  const strokeColor = s.isDark ? 'rgba(139,92,246,0.35)' : 'rgba(109,40,217,0.28)';
  const fillColor = s.isDark ? 'rgba(139,92,246,0.09)' : 'rgba(109,40,217,0.06)';
  const labelBg = s.isDark ? '#111118' : '#FFFFFF';
  const labelBorder = s.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const textColor = s.isDark ? '#F1F1F5' : '#0A0A12';
  const mutedText = s.isDark ? '#8888A0' : '#6B6B82';

  // Body centered at x=450 in viewBox 0 0 900 780
  return (
    <svg
      viewBox="0 0 900 790"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[640px] mx-auto"
      style={{ height: 'auto' }}
    >
      <defs>
        <filter id="gv" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="gm" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="ga" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ─── HUMAN BODY ─── */}
      {/* Head */}
      <ellipse cx="450" cy="105" rx="58" ry="68" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
      {/* Right ear */}
      <ellipse cx="508" cy="108" rx="10" ry="16" fill={fillColor} stroke={strokeColor} strokeWidth="1" />
      {/* Left ear */}
      <ellipse cx="392" cy="108" rx="10" ry="16" fill={fillColor} stroke={strokeColor} strokeWidth="1" />

      {/* Neck */}
      <path d="M432 170 L468 170 L472 200 L428 200 Z" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />

      {/* Torso */}
      <path
        d="M340 202 C322 202 305 215 298 232 L280 418 L620 418 L602 232 C595 215 578 202 560 202 L340 202 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
      />

      {/* Left upper arm */}
      <path d="M302 222 C278 265 262 315 248 382" stroke={strokeColor} strokeWidth="18" strokeLinecap="round" />
      {/* Left forearm */}
      <path d="M248 382 C238 418 232 444 228 472" stroke={strokeColor} strokeWidth="14" strokeLinecap="round" />
      {/* Left hand */}
      <ellipse cx="225" cy="482" rx="16" ry="20" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />

      {/* Right upper arm */}
      <path d="M598 222 C622 265 638 315 652 382" stroke={strokeColor} strokeWidth="18" strokeLinecap="round" />
      {/* Right forearm */}
      <path d="M652 382 C662 418 668 444 672 472" stroke={strokeColor} strokeWidth="14" strokeLinecap="round" />
      {/* Right hand */}
      <ellipse cx="675" cy="482" rx="16" ry="20" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />

      {/* Left leg */}
      <path d="M390 418 C382 482 375 538 368 604" stroke={strokeColor} strokeWidth="22" strokeLinecap="round" />
      {/* Right leg */}
      <path d="M510 418 C518 482 525 538 532 604" stroke={strokeColor} strokeWidth="22" strokeLinecap="round" />

      {/* Feet */}
      <ellipse cx="364" cy="616" rx="24" ry="12" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
      <ellipse cx="536" cy="616" rx="24" ry="12" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />

      {/* ─── DEVICE 1: ANXIETY NODE (behind right ear at ~518, 100) ─── */}
      <circle cx="518" cy="100" r="10" fill="#8B5CF6" filter="url(#gv)" />
      <circle cx="518" cy="100" r="6" fill="white" opacity="0.9" />
      <circle cx="518" cy="100" r="3" fill="#8B5CF6" />
      {/* Callout line → right */}
      <path d="M528 96 L628 62" stroke="#8B5CF6" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.7" />
      {/* Label card */}
      <rect x="628" y="28" width="195" height="70" rx="10" fill={labelBg} stroke={labelBorder} strokeWidth="1" />
      <rect x="628" y="28" width="4" height="70" rx="2" fill="#8B5CF6" />
      <text x="643" y="52" fill="#8B5CF6" fontSize="10" fontFamily="Inter,sans-serif" fontWeight="700" letterSpacing="0.12em">ANXIETY NODE</text>
      <text x="643" y="69" fill={textColor} fontSize="12" fontFamily="Inter,sans-serif" fontWeight="600">Bio-Adhesive Patch</text>
      <text x="643" y="88" fill={mutedText} fontSize="10" fontFamily="Inter,sans-serif">Worn behind the ear</text>

      {/* ─── DEVICE 2: DEEP PULSE (left inner wrist/palm at ~225, 464) ─── */}
      <circle cx="225" cy="464" r="10" fill="#10B981" filter="url(#gm)" />
      <circle cx="225" cy="464" r="6" fill="white" opacity="0.9" />
      <circle cx="225" cy="464" r="3" fill="#10B981" />
      {/* Callout line → left-down */}
      <path d="M215 470 L100 508" stroke="#10B981" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.7" />
      {/* Label card */}
      <rect x="16" y="500" width="195" height="70" rx="10" fill={labelBg} stroke={labelBorder} strokeWidth="1" />
      <rect x="207" y="500" width="4" height="70" rx="2" fill="#10B981" />
      <text x="32" y="524" fill="#10B981" fontSize="10" fontFamily="Inter,sans-serif" fontWeight="700" letterSpacing="0.12em">DEEP PULSE</text>
      <text x="32" y="541" fill={textColor} fontSize="12" fontFamily="Inter,sans-serif" fontWeight="600">Wristband Sensor</text>
      <text x="32" y="560" fill={mutedText} fontSize="10" fontFamily="Inter,sans-serif">Palm-side placement</text>

      {/* ─── DEVICE 3: SLEEP MAT (under feet) ─── */}
      {/* Mat band */}
      <rect x="240" y="642" width="420" height="14" rx="7"
        fill={s.isDark ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.1)'}
        stroke="rgba(245,158,11,0.4)"
        strokeWidth="1"
      />
      <circle cx="450" cy="649" r="10" fill="#F59E0B" filter="url(#ga)" />
      <circle cx="450" cy="649" r="6" fill="white" opacity="0.9" />
      <circle cx="450" cy="649" r="3" fill="#F59E0B" />
      {/* Callout line → down-right */}
      <path d="M460 659 L600 700" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.7" />
      {/* Label card */}
      <rect x="600" y="696" width="215" height="70" rx="10" fill={labelBg} stroke={labelBorder} strokeWidth="1" />
      <rect x="600" y="696" width="215" height="4" rx="2" fill="#F59E0B" />
      <text x="618" y="722" fill="#F59E0B" fontSize="10" fontFamily="Inter,sans-serif" fontWeight="700" letterSpacing="0.12em">SLEEP MAT SENSOR</text>
      <text x="618" y="739" fill={textColor} fontSize="12" fontFamily="Inter,sans-serif" fontWeight="600">Conductive Textile Mat</text>
      <text x="618" y="758" fill={mutedText} fontSize="10" fontFamily="Inter,sans-serif">Goes under the sheet</text>
    </svg>
  );
}
