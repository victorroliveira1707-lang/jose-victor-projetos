import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {loadFont as loadDisplay} from '@remotion/google-fonts/SpaceGrotesk';
import {loadFont as loadBody} from '@remotion/google-fonts/Inter';

export const display = loadDisplay('normal', {weights: ['500', '600', '700'], subsets: ['latin']}).fontFamily;
export const body = loadBody('normal', {weights: ['400', '500', '600'], subsets: ['latin']}).fontFamily;

// Paleta do NeuroMov (frontend/src/index.css)
export const C = {
  bg: '#0c0906', surface: '#181310', line: '#3b2c1c',
  ink: '#f6efe6', ink2: '#c6b8a5', ink3: '#a6957c',
  accent: '#ff8a4c', accent2: '#ffb073', accentInk: '#ffc9a3',
  teal: '#6fd9c6', danger: '#ff5470',
};

export const FPS = 30;
export const DUR = 210; // 7 s por slide
export const TOTAL = 8;
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const out = Easing.bezier(0.16, 1, 0.3, 1);
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Entrada padrão: sobe, ganha opacidade e foco. */
export const Rise: React.FC<{at: number; dy?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({at, dy = 46, style, children}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        opacity: interpolate(frame, [at, at + 16], [0, 1], {...clamp, easing: out}),
        translate: `0px ${interpolate(frame, [at, at + 26], [dy, 0], {...clamp, easing: out})}px`,
        filter: `blur(${interpolate(frame, [at, at + 18], [10, 0], clamp)}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Título que entra palavra por palavra. */
export const Words: React.FC<{at: number; text: string; step?: number; style?: React.CSSProperties; hi?: Record<string, string>}> = ({at, text, step = 3, style, hi = {}}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{fontFamily: display, fontWeight: 600, letterSpacing: '-0.028em', ...style}}>
      {text.split(' ').map((w, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            marginRight: '0.24em',
            color: hi[w.replace(/[.,:]/g, '')] ?? 'inherit',
            opacity: interpolate(frame, [at + i * step, at + i * step + 12], [0, 1], {...clamp, easing: out}),
            translate: `0px ${interpolate(frame, [at + i * step, at + i * step + 20], [38, 0], {...clamp, easing: out})}px`,
          }}
        >
          {w}
        </span>
      ))}
    </div>
  );
};

export const Tag: React.FC<{at?: number; color?: string; children: React.ReactNode}> = ({at = 4, color = C.ink3, children}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: body, fontWeight: 600, fontSize: 23, letterSpacing: '0.2em', textTransform: 'uppercase', color,
        opacity: interpolate(frame, [at, at + 14], [0, 1], clamp),
      }}
    >
      {children}
    </div>
  );
};

/** O olho: anel + pupila. x e y vão de -1 a 1. */
export const Eye: React.FC<{size: number; x: number; y: number; lid?: number; color?: string; trail?: string}> = ({size, x, y, lid = 0, color = C.teal, trail}) => {
  const r = size / 2;
  const reach = r * 0.5;
  return (
    <svg width={size} height={size} viewBox={`${-r} ${-r} ${size} ${size}`} style={{overflow: 'visible'}}>
      <circle r={r - 3} fill="rgba(24,19,16,.85)" stroke={color} strokeWidth={5} />
      <circle r={r - 22} fill="none" stroke="rgba(246,239,230,.08)" strokeWidth={2} strokeDasharray="3 12" />
      {trail ? <path d={trail} fill="none" stroke={C.accent} strokeWidth={4} strokeLinecap="round" strokeDasharray="2 12" opacity={0.75} /> : null}
      <circle cx={x * reach} cy={y * reach} r={r * 0.3} fill={C.ink} />
      <circle cx={x * reach} cy={y * reach} r={r * 0.13} fill={C.bg} />
      <rect x={-r} y={-r} width={size} height={size * lid} fill={C.bg} opacity={0.92} />
    </svg>
  );
};

/** Fundo: brilho quente, pontos que derivam só na horizontal e a "linha do olhar". */
export const Backdrop: React.FC<{n: number}> = ({n}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(1100px 900px at 50% 26%, #1d140c 0%, ${C.bg} 64%)`}}>
      <svg width={1080} height={1350} style={{position: 'absolute'}}>
        {Array.from({length: 46}, (_, i) => {
          const speed = 0.25 + rnd(i + 9) * 0.7;
          const x = (rnd(i) * 1240 + (frame + n * DUR) * speed) % 1240 - 80;
          const y = rnd(i + 40) * 1350;
          const s = 2 + rnd(i + 80) * 3.5;
          return <circle key={i} cx={x} cy={y} r={s} fill={i % 5 === 0 ? C.teal : C.accent} opacity={0.1 + rnd(i + 120) * 0.16} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** Moldura do carrossel: paginação e barra de progresso em oito segmentos. */
export const Chrome: React.FC<{n: number}> = ({n}) => {
  const frame = useCurrentFrame();
  return (
    <>
      <div style={{position: 'absolute', right: 84, top: 64, fontFamily: body, fontWeight: 600, fontSize: 23, letterSpacing: '0.14em', color: C.ink3}}>
        {String(n).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
      </div>
      <div style={{position: 'absolute', left: 84, right: 84, bottom: 58, display: 'flex', gap: 10}}>
        {Array.from({length: TOTAL}, (_, i) => (
          <div key={i} style={{flex: 1, height: 5, borderRadius: 3, background: 'rgba(246,239,230,.1)', overflow: 'hidden'}}>
            <div
              style={{
                height: '100%', borderRadius: 3,
                background: `linear-gradient(90deg, ${C.teal}, ${C.accent})`,
                width: i + 1 < n ? '100%' : i + 1 === n ? `${interpolate(frame, [0, DUR - 10], [0, 100], clamp)}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export const Frame: React.FC<{n: number; children: React.ReactNode}> = ({n, children}) => (
  <AbsoluteFill style={{backgroundColor: C.bg, color: C.ink, fontFamily: body}}>
    <Backdrop n={n} />
    <AbsoluteFill style={{padding: '64px 84px 0'}}>{children}</AbsoluteFill>
    <Chrome n={n} />
  </AbsoluteFill>
);
