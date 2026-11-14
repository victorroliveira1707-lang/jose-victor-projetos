import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { continueRender, delayRender, staticFile } from "remotion";

// Fontes locais (public/fonts): a renderização não depende de rede.
const fonts: [string, string, string, string][] = [
  ["Space Grotesk", "SpaceGrotesk.woff2", "300 700", "normal"],
  ["Inter", "Inter.woff2", "100 900", "normal"],
  ["Instrument Serif", "InstrumentSerif-Italic.woff2", "400", "italic"],
];
if (typeof document !== "undefined") {
  const handle = delayRender("fontes");
  Promise.all(
    fonts.map(([family, file, weight, style]) => {
      const f = new FontFace(family, `url(${staticFile("fonts/" + file)}) format("woff2")`, { weight, style });
      return f.load().then(() => document.fonts.add(f));
    }),
  ).then(() => continueRender(handle));
}

// Paleta do app NeuroMov (frontend/src/index.css)
export const C = {
  bg: "#0c0906", surface: "#181310", surface2: "#221a14", line: "#3b2c1c",
  ink: "#f6efe6", ink2: "#c6b8a5", ink3: "#a6957c",
  accent: "#ff8a4c", accent2: "#ffb073", accentInk: "#ffc9a3",
  teal: "#6fd9c6", danger: "#ff5470", gold: "#ffc93c",
};
export const F = { display: '"Space Grotesk", sans-serif', body: '"Inter", sans-serif', serif: '"Instrument Serif", serif' };
export const W = 1080, H = 1350, FPS = 30, SEC = 7, N = 8;

export const out = Easing.bezier(0.16, 1, 0.3, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** progresso 0→1 entre dois instantes, em segundos */
export const useP = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (a: number, b: number, easing: (n: number) => number = out) =>
    interpolate(frame, [a * fps, b * fps], [0, 1], { ...clamp, easing });
};
export const useT = () => useCurrentFrame() / useVideoConfig().fps;

/** pseudoaleatório determinístico: o mesmo quadro sai igual em toda renderização */
export const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

type RiseProps = { at: number; d?: number; y?: number; blur?: number; style?: React.CSSProperties; children: React.ReactNode };
export const Rise: React.FC<RiseProps> = ({ at, d = 0.9, y = 44, blur = 10, style, children }) => {
  const p = useP()(at, at + d);
  return (
    <div style={{ opacity: p, translate: `0px ${(1 - p) * y}px`, filter: `blur(${(1 - p) * blur}px)`, ...style }}>
      {children}
    </div>
  );
};

/** texto que entra palavra por palavra */
export const Words: React.FC<{ text: string; at: number; gap?: number; style?: React.CSSProperties; hi?: Record<string, string> }> = ({ text, at, gap = 0.09, style, hi = {} }) => {
  const P = useP();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: "0.26em", ...style }}>
      {text.split(" ").map((w, k) => {
        const p = P(at + k * gap, at + k * gap + 0.7);
        const key = w.replace(/[.,:;!?“”]/g, "");
        return (
          <span key={k} style={{ display: "inline-block", opacity: p, translate: `0px ${(1 - p) * 38}px`, rotate: `${(1 - p) * 4}deg`, filter: `blur(${(1 - p) * 8}px)`, color: hi[key] }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const Tag: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.ink3 }) => (
  <Rise at={0.1} y={16} blur={0} style={{ font: `600 23px/1 ${F.body}`, letterSpacing: "0.2em", textTransform: "uppercase", color }}>
    {children}
  </Rise>
);

/**
 * Linha do impulso: atravessa os oito quadros. Sai de um quadro na mesma altura em que
 * entra no seguinte, para o gesto de arrastar parecer contínuo.
 */
const EDGE = [1165, 1150, 1175, 1155, 1170, 1150, 1160, 1150, 1165];
export const Impulse: React.FC<{ n: number; stall?: number; dip?: number }> = ({ n, stall = 1, dip = 0 }) => {
  const P = useP();
  const t = useT();
  const y0 = EDGE[n - 1], y1 = EDGE[n];
  const d = `M -20 ${y0} C 300 ${y0 - 26 + dip}, 780 ${y1 + 26 + dip}, 1100 ${y1}`;
  const draw = P(0, 2.2);
  // a brasa percorre a linha e vai perdendo velocidade até o ponto `stall` (0 a 1)
  const run = P(0.2, 5.2, Easing.bezier(0.2, 0.7, 0.2, 1)) * stall;
  const u = run, a = 1 - u;
  const bx = a * a * a * -20 + 3 * a * a * u * 300 + 3 * a * u * u * 780 + u * u * u * 1100;
  const by = a * a * a * y0 + 3 * a * a * u * (y0 - 26 + dip) + 3 * a * u * u * (y1 + 26 + dip) + u * u * u * y1;
  const breathe = 0.75 + 0.25 * Math.sin(t * 2.2);
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <path d={d} fill="none" stroke={C.line} strokeWidth={2} />
      <path d={d} fill="none" stroke={C.accent} strokeOpacity={0.6} strokeWidth={2.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw * stall} strokeLinecap="round" />
      <circle cx={bx} cy={by} r={46 * breathe} fill={C.accent} opacity={0.1 * draw} />
      <circle cx={bx} cy={by} r={20 * breathe} fill={C.accent} opacity={0.22 * draw} />
      <circle cx={bx} cy={by} r={8} fill={C.accentInk} opacity={draw} />
    </svg>
  );
};

export const Frame: React.FC<{ n: number; src?: React.ReactNode; stall?: number; dip?: number; children: React.ReactNode }> = ({ n, src, stall, dip, children }) => {
  const P = useP();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(1100px 900px at 50% 22%, #1d140d 0%, ${C.bg} 64%)`, color: C.ink, fontFamily: F.body }}>
      <Impulse n={n} stall={stall} dip={dip} />
      <AbsoluteFill style={{ padding: "76px 84px 0" }}>{children}</AbsoluteFill>
      <div style={{ position: "absolute", left: 84, right: 84, bottom: 44, opacity: P(0.6, 1.6) }}>
        {src && <div style={{ font: `400 21px/1.4 ${F.body}`, color: C.ink3, marginBottom: 20 }}>{src}</div>}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ font: `700 27px/1 ${F.display}`, letterSpacing: "-0.02em" }}>NeuroMov</div>
          <div style={{ display: "flex", gap: 9 }}>
            {Array.from({ length: N }, (_, k) => (
              <i key={k} style={{ width: k === n - 1 ? 30 : 9, height: 9, borderRadius: 9, background: k === n - 1 ? C.accent : C.line }} />
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
