import React from "react";
import { Easing, interpolate } from "remotion";
import { C, F, Frame, Rise, Tag, Words, clamp, out, rnd, useP, useT, W } from "./kit";

const h = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  font: `600 ${size}px/1.03 ${F.display}`, letterSpacing: "-0.028em", ...extra,
});
const serif = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  font: `italic 400 ${size}px/1.16 ${F.serif}`, ...extra,
});
const body = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  font: `400 ${size}px/1.36 ${F.body}`, color: C.ink2, ...extra,
});

/* 1 ─ Gancho: o que a família costuma ler, riscado; o nome certo, aceso. */
const Strike: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const p = useP()(at, at + 0.5);
  return (
    <span style={{ position: "relative", display: "inline-block", color: interpolate(p, [0, 1], [0, 1]) > 0.5 ? C.ink3 : C.ink }}>
      {children}
      <i style={{ position: "absolute", left: -6, right: -6, top: "54%", height: 7, borderRadius: 7, background: C.accent, scale: `${p} 1`, transformOrigin: "left center" }} />
    </span>
  );
};

export const S1: React.FC = () => {
  const P = useP();
  const t = useT();
  const stop = P(0.2, 3.4, Easing.bezier(0.1, 0.6, 0.2, 1)); // os impulsos andam e param
  const lit = P(3.5, 4.6);
  return (
    <Frame n={1} stall={0.42}>
      {/* impulsos a caminho de um alvo: desaceleram e ficam pelo caminho */}
      <svg width={W} height={1350} style={{ position: "absolute", inset: 0 }}>
        <circle cx={880} cy={250} r={64 + 10 * Math.sin(t * 1.6)} fill="none" stroke={C.teal} strokeOpacity={0.35 + 0.25 * lit} strokeWidth={2.5} />
        <circle cx={880} cy={250} r={7} fill={C.teal} opacity={0.5 + 0.5 * lit} />
        {Array.from({ length: 46 }, (_, k) => {
          const sx = -60 + rnd(k) * 380, sy = 120 + rnd(k + 50) * 360;
          const reach = 0.3 + rnd(k + 9) * 0.45;
          const x = sx + (880 - sx) * reach * stop, y = sy + (250 - sy) * reach * stop + Math.sin(t * 1.3 + k) * 3;
          return <circle key={k} cx={x} cy={y} r={2 + rnd(k + 3) * 3.5} fill={C.accent2} opacity={(0.25 + rnd(k + 7) * 0.5) * (1 - 0.55 * stop)} />;
        })}
      </svg>
      <Tag>NeuroMov <span style={{ color: C.accent }}>·</span> distúrbios do movimento</Tag>
      <div style={{ marginTop: 420 }}>
        <Rise at={0.4} style={h(98)}>Não é <Strike at={1.4}>preguiça.</Strike></Rise>
        <Rise at={1.9} style={h(98, { marginTop: 14 })}>Não é <Strike at={2.9}>má vontade.</Strike></Rise>
        <div style={{ ...h(214, { marginTop: 44, color: C.accent, letterSpacing: "-0.045em" }), opacity: lit, scale: `${0.86 + 0.14 * lit}`, transformOrigin: "left bottom", filter: `blur(${(1 - lit) * 18}px)`, textShadow: `0 0 ${70 * lit}px rgba(255,138,76,.45)` }}>
          É apatia.
        </div>
        <Rise at={4.6} style={serif(51, { marginTop: 26, color: C.ink })}>Um sintoma neurológico, com nome e manejo.</Rise>
      </div>
      <div style={{ position: "absolute", right: 84, bottom: 118, display: "flex", alignItems: "center", gap: 14, opacity: P(5.5, 6.2), font: `600 25px/1 ${F.body}`, letterSpacing: "0.16em", textTransform: "uppercase", color: C.ink2 }}>
        arraste
        <span style={{ translate: `${8 + 8 * Math.sin(t * 5)}px 0px`, color: C.accent, fontSize: 34 }}>→</span>
      </div>
    </Frame>
  );
};

/* 2 ─ A palavra no dia a dia e a palavra no consultório. */
export const S2: React.FC = () => {
  const P = useP();
  const away = P(1.9, 2.7);
  const items = ["Interesse", "Espontaneidade", "Motivação", "Iniciativa"];
  return (
    <Frame n={2} stall={0.5} src={<>Definição de Levy e Czernecki, citada em Bachoud-Lévi AC et al. Front Neurol 2019;10:710.</>}>
      <Tag>O que a palavra quer dizer</Tag>
      <div style={{ marginTop: 44, opacity: 1 - 0.55 * away, scale: `${1 - 0.14 * away}`, transformOrigin: "left top" }}>
        <Rise at={0.3} style={body(26, { letterSpacing: "0.04em", color: C.ink3 })}>NO DIA A DIA</Rise>
        <Rise at={0.5} style={{ ...serif(74, { color: C.ink2 }), marginTop: 10, position: "relative", display: "inline-block" }}>
          “hoje eu tô meio apático”
          <i style={{ position: "absolute", left: 0, right: 0, top: "56%", height: 4, background: C.ink3, scale: `${away} 1`, transformOrigin: "left center" }} />
        </Rise>
      </div>
      <Rise at={2.3} style={body(26, { letterSpacing: "0.04em", color: C.teal, marginTop: 36 })}>NO CONSULTÓRIO</Rise>
      <Words at={2.5} text="Redução quantificável do comportamento dirigido a objetivo." hi={{ quantificável: C.teal }} style={h(76, { marginTop: 14 })} />
      <div style={{ position: "absolute", left: 84, right: 84, top: 640, display: "grid", gap: 24 }}>
        {items.map((label, k) => {
          const a = 3.9 + k * 0.22;
          const fill = P(a, a + 0.6), drain = P(a + 0.9, a + 2, Easing.bezier(0.5, 0, 0.2, 1));
          const w = fill * (1 - 0.74 * drain);
          return (
            <div key={label} style={{ opacity: fill }}>
              <div style={{ display: "flex", justifyContent: "space-between", font: `600 35px/1 ${F.display}`, letterSpacing: "-0.01em" }}>
                {label}
                <span style={{ color: C.accent, fontSize: 30, opacity: drain }}>↓</span>
              </div>
              <div style={{ height: 14, borderRadius: 14, background: "rgba(255,255,255,.07)", marginTop: 14, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${w * 100}%`, borderRadius: 14, background: `linear-gradient(90deg, ${C.accent}, ${C.accent2})`, boxShadow: `0 0 22px rgba(255,138,76,.5)` }} />
              </div>
            </div>
          );
        })}
      </div>
      <Rise at={5.4} style={{ ...serif(40, { color: C.ink2 }), position: "absolute", left: 84, right: 84, top: 1000 }}>
        Na doença de Huntington, soma-se o embotamento emocional: a pessoa se retrai.
      </Rise>
    </Frame>
  );
};

/* 3 ─ Apatia e depressão: o que separa é o sofrimento subjetivo. */
const Gauge: React.FC<{ at: number; level: number; color: string; name: string; value: string; note: string }> = ({ at, level, color, name, value, note }) => {
  const P = useP();
  const t = useT();
  const up = P(at, at + 1.6, Easing.bezier(0.3, 1.3, 0.4, 1));
  const lvl = level * up + 0.012 * Math.sin(t * 2.4) * up;
  return (
    <Rise at={at - 0.4} style={{ flex: 1, padding: "34px 34px 36px", borderRadius: 30, border: `1px solid ${C.line}`, background: "rgba(24,19,16,.86)" }}>
      <div style={h(50)}>{name}</div>
      <div style={{ display: "flex", gap: 26, marginTop: 28, alignItems: "flex-end" }}>
        <div style={{ position: "relative", width: 86, height: 330, borderRadius: 43, background: "rgba(255,255,255,.06)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lvl * 100}%`, background: `linear-gradient(0deg, ${color}, ${color}cc)`, boxShadow: `0 0 40px ${color}88` }} />
        </div>
        <div>
          <div style={body(23, { color: C.ink3, letterSpacing: "0.08em", textTransform: "uppercase" })}>sofrimento<br />subjetivo</div>
          <div style={{ ...h(52), color, marginTop: 12, opacity: P(at + 1, at + 1.6) }}>{value}</div>
        </div>
      </div>
      <div style={{ ...serif(36, { color: C.ink2 }), marginTop: 26, opacity: P(at + 1.4, at + 2.1) }}>{note}</div>
    </Rise>
  );
};

export const S3: React.FC = () => (
  <Frame n={3} stall={0.6} src={<>Timmer MHM et al. Pract Neurol 2017;17(5):359-368 · Goldman JG. Continuum 2016;22(4):1086-1103 · Buoli M et al. J Geriatr Psychiatry Neurol 2015.</>}>
    <Tag>Apatia × depressão</Tag>
    <Words at={0.3} text="Parece depressão. Nem sempre é." hi={{ Nem: C.accent, sempre: C.accent, é: C.accent }} style={h(84, { marginTop: 30 })} />
    <div style={{ display: "flex", gap: 22, marginTop: 44 }}>
      <Gauge at={1.5} level={0.86} color={C.accent2} name="Depressão" value="alto" note="humor triste" />
      <Gauge at={2.3} level={0.1} color={C.teal} name="Apatia" value="baixo ou ausente" note="humor embotado, não triste" />
    </div>
    <Rise at={4.4} style={body(33, { marginTop: 36 })}>
      Perder o prazer (anedonia) aparece <b style={{ color: C.ink, fontWeight: 600 }}>nas duas</b>: não serve para separar.
    </Rise>
    <Rise at={5.1} style={h(42, { marginTop: 18, color: C.teal })}>E elas podem vir juntas. Procure as duas.</Rise>
  </Frame>
);

/* 4 ─ Huntington: apatia e irritabilidade, duas faces da mesma moeda. */
export const S4: React.FC = () => {
  const P = useP();
  const t = useT();
  const flip = P(2.2, 3.1, Easing.bezier(0.5, 0, 0.2, 1)) + P(4.1, 5, Easing.bezier(0.5, 0, 0.2, 1));
  const deg = flip * 180;
  const front = Math.cos((deg * Math.PI) / 180) >= 0;
  const face = (label: string, when: string, color: string, flipped: boolean): React.CSSProperties => ({
    position: "absolute", inset: 0, borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    background: `radial-gradient(circle at 34% 28%, ${color}55, ${C.surface2} 68%)`, border: `3px solid ${color}`, boxShadow: `0 0 80px ${color}44, inset 0 0 50px rgba(0,0,0,.5)`,
    rotate: flipped ? "y 180deg" : undefined,
  });
  return (
    <Frame n={4} stall={0.5} src={<>Bachoud-Lévi AC et al. International Guidelines for the Treatment of Huntington’s Disease. Front Neurol 2019;10:710.</>}>
      <Tag color={C.teal}>Doença de Huntington</Tag>
      <Words at={0.3} text="O sintoma psicológico e comportamental mais frequente da doença." hi={{ mais: C.accent, frequente: C.accent }} style={h(64, { marginTop: 30 })} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, height: 380, perspective: 1400, display: "flex", justifyContent: "center", opacity: P(1.2, 2), translate: `0px ${Math.sin(t * 1.5) * 8}px` }}>
        <div style={{ position: "relative", width: 380, height: 380, rotate: `y ${deg}deg` }}>
          {front ? (
            <div style={face("", "", C.teal, false)}>
              <div style={body(26, { letterSpacing: "0.18em", color: C.teal })}>DE MANHÃ</div>
              <div style={h(62, { marginTop: 10 })}>apatia</div>
            </div>
          ) : (
            <div style={face("", "", C.accent, true)}>
              <div style={body(26, { letterSpacing: "0.18em", color: C.accent })}>À TARDE</div>
              <div style={h(48, { marginTop: 10 })}>irritabilidade</div>
            </div>
          )}
        </div>
      </div>
      <div style={{ position: "absolute", left: 84, right: 84, top: 860 }}>
        <Rise at={3.2} style={serif(62, { textAlign: "center" })}>duas faces da mesma moeda</Rise>
        <Rise at={5} style={body(32, { marginTop: 30 })}>
          A mesma pessoa pode estar apática de manhã e irritável à tarde. Aparece mais nas fases média e avançada,
          reduz as atividades do dia a dia e costuma virar <b style={{ color: C.ink, fontWeight: 600 }}>conflito em casa</b>.
        </Rise>
      </div>
    </Frame>
  );
};

/* 5 ─ Não é só Huntington. */
export const S5: React.FC = () => {
  const P = useP();
  const rows = [
    { name: "Paralisia supranuclear progressiva", v: 56, color: C.accent },
    { name: "Demência com corpos de Lewy", v: 44, color: C.accent2 },
    { name: "Doença de Parkinson", v: 35, color: C.teal },
  ];
  return (
    <Frame n={5} stall={0.55} src={<>Hershey LA, Lichter DG. PSP: cognitive and behavioral changes. MedLink Neurology 2026 · Kulisevsky J et al. Mov Disord 2026 · Timmer MHM et al. Pract Neurol 2017.</>}>
      <Tag>Não é só Huntington</Tag>
      <Words at={0.3} text="A apatia atravessa várias doenças do movimento." hi={{ atravessa: C.accent }} style={h(74, { marginTop: 30 })} />
      <Rise at={1.3} style={body(27, { marginTop: 22, color: C.ink3 })}>Proporção de pacientes com apatia em cada doença</Rise>
      <div style={{ display: "grid", gap: 30, marginTop: 30 }}>
        {rows.map((r, k) => {
          const a = 1.7 + k * 0.5, p = P(a, a + 1.5);
          return (
            <div key={r.name} style={{ opacity: P(a - 0.2, a + 0.4) }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
                <div style={{ font: `700 122px/.9 ${F.display}`, letterSpacing: "-0.04em", color: r.color, minWidth: 250, fontVariantNumeric: "tabular-nums" }}>
                  {Math.round(r.v * p)}<span style={{ fontSize: 62 }}>%</span>
                </div>
                <div style={h(36, { lineHeight: 1.12 })}>{r.name}</div>
              </div>
              <div style={{ height: 16, borderRadius: 16, background: "rgba(255,255,255,.06)", marginTop: 16, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${r.v * p}%`, borderRadius: 16, background: r.color, boxShadow: `0 0 26px ${r.color}88` }} />
              </div>
            </div>
          );
        })}
      </div>
      <Rise at={4.4} style={{ ...body(28), marginTop: 34, padding: "22px 28px", borderLeft: `4px solid ${C.accent}`, background: "linear-gradient(90deg, rgba(255,138,76,.12), transparent)" }}>
        Os números mudam conforme o estudo e a fase: <b style={{ color: C.ink, fontWeight: 600 }}>55% a 66%</b> na demência com corpos de Lewy;
        de <b style={{ color: C.ink, fontWeight: 600 }}>20% a 60%</b> no Parkinson.
      </Rise>
    </Frame>
  );
};

/* 6 ─ O peso: cada associação cai sobre a linha, e a linha cede. */
export const S6: React.FC = () => {
  const P = useP();
  const weights = ["pior qualidade de vida", "declínio cognitivo mais rápido", "mais sobrecarga para quem cuida"];
  const drop = (k: number) => P(1.6 + k * 0.8, 2.3 + k * 0.8, Easing.bezier(0.5, 0, 0.6, 1.5));
  const sag = (drop(0) + drop(1) + drop(2)) * 26;
  return (
    <Frame n={6} stall={0.5} dip={sag * 0.2} src={<>Kulisevsky J, Bojtos L, Kramberger MG, et al.; MDS Non-Motor Symptoms Study Group. Apathy in Lewy Body Disorders: A Position Paper. Mov Disord 2026.</>}>
      <Tag>O peso que ninguém mede</Tag>
      <Rise at={0.3} style={h(96, { marginTop: 30 })}>Pouco reconhecida.</Rise>
      <Rise at={0.8} style={h(96, { color: C.accent })}>Pouco tratada.</Rise>
      <div style={{ display: "grid", gap: 26, marginTop: 76 }}>
        {weights.map((w, k) => {
          const d = drop(k);
          return (
            <div key={w} style={{ opacity: Math.max(0, Math.min(1, (d - 0.3) * 2.6)), translate: `0px ${(1 - d) * -70}px`, padding: "40px 38px", borderRadius: 26, border: `1px solid ${C.line}`, background: "linear-gradient(135deg, rgba(34,26,20,.95), rgba(24,19,16,.95))", display: "flex", alignItems: "center", gap: 24 }}>
              <i style={{ width: 16, height: 16, borderRadius: 16, background: C.accent, boxShadow: "0 0 20px rgba(255,138,76,.7)", flex: "0 0 16px" }} />
              <div style={h(50)}>{w}</div>
            </div>
          );
        })}
      </div>
      <Rise at={4.6} style={body(34, { marginTop: 52 })}>
        Associações descritas na doença de Parkinson e na demência com corpos de Lewy, onde a apatia está entre os sintomas
        não motores <b style={{ color: C.ink, fontWeight: 600 }}>mais frequentes e incapacitantes</b>.
      </Rise>
    </Frame>
  );
};

/* 7 ─ O que ajuda. */
export const S7: React.FC = () => {
  const P = useP();
  const rows: [string, string][] = [
    ["Dar nome", "Explicar à família de onde vem a apatia."],
    ["Rotina", "Atividades com programa estruturado e estimulação cognitiva sob medida."],
    ["Menos estímulo de uma vez", "Ela pode ser uma resposta à sobrecarga: barulho, interferências."],
    ["Procurar depressão", "A depressão pode aumentar a apatia."],
    ["Rever sedativos", "Podem aumentar a apatia: evitar os desnecessários ou reduzir a dose."],
  ];
  return (
    <Frame n={7} stall={0.7} src={<>Bachoud-Lévi AC et al. Front Neurol 2019;10:710 (itens 1 a 5, doença de Huntington) · Kulisevsky J et al. Mov Disord 2026 · Buoli M et al. 2015.</>}>
      <Tag color={C.teal}>O que ajuda</Tag>
      <Words at={0.3} text="O manejo começa em casa, não na receita." hi={{ casa: C.teal }} style={h(68, { marginTop: 26 })} />
      <div style={{ marginTop: 26 }}>
        {rows.map(([a, b], k) => {
          const p = P(1.3 + k * 0.42, 2 + k * 0.42);
          return (
            <div key={a} style={{ display: "flex", gap: 24, padding: "16px 0", borderTop: `1px solid ${C.line}`, opacity: p, translate: `${(1 - p) * 60}px 0px` }}>
              <div style={{ font: `700 30px/1.25 ${F.display}`, color: C.teal, width: 40 }}>{k + 1}</div>
              <div>
                <div style={h(39, { lineHeight: 1.1 })}>{a}</div>
                <div style={body(26, { marginTop: 6 })}>{b}</div>
              </div>
            </div>
          );
        })}
      </div>
      <Rise at={4.3} style={{ ...body(25.5), marginTop: 14, padding: "22px 26px", borderRadius: 22, border: "1px dashed rgba(255,138,76,.5)" }}>
        <b style={{ color: C.accentInk, fontWeight: 600 }}>Para o colega:</b> no Parkinson e na demência com corpos de Lewy, nenhum tratamento é hoje
        considerado definitivamente eficaz. No Parkinson, os ISRS já foram associados a mais apatia.
      </Rise>
    </Frame>
  );
};

/* 8 ─ Fecho. */
const Mark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ overflow: "visible" }}>
    <path d="M13 14 Q11 6 20 5 Q29 6 27 14 Q26 18 20 19 Q14 18 13 14 Z" />
    <circle cx="16.5" cy="11.5" r="0.9" fill="currentColor" stroke="none" /><circle cx="23.5" cy="11.5" r="0.9" fill="currentColor" stroke="none" />
    <path d="M14 18 C12 22 8 23 6 27 C5 29 6 31 8 30.5" /><path d="M16.5 18.6 C15.5 24 13 27 12 32 C11.5 34 13 35 14.5 34" />
    <path d="M19.5 19 C19.5 25 18.5 29 18.5 34 C18.5 36 20 36.5 21 35" /><path d="M22.5 18.6 C23.5 24 26 27 27 32 C27.5 34 26 35 24.5 34" />
    <path d="M25.5 18 C27.5 22 31 23 33 27 C34 29 33 31 31 30.5" /><path d="M12.3 15.6 C9.8 18.4 8.5 20 7.3 23" />
  </svg>
);

export const S8: React.FC = () => {
  const P = useP();
  const t = useT();
  const pop = P(0.3, 1.3, Easing.bezier(0.3, 1.5, 0.4, 1));
  return (
    <Frame n={8} stall={1} src={<>Conteúdo educativo. Não substitui consulta médica nem autoriza mudar medicação por conta própria.</>}>
      {/* os impulsos voltam a andar, devagar */}
      <svg width={W} height={1350} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 34 }, (_, k) => {
          const x = ((rnd(k) * 1300 + t * (18 + rnd(k + 2) * 30)) % 1300) - 100, y = 90 + rnd(k + 40) * 1000 + Math.sin(t + k) * 8;
          return <circle key={k} cx={x} cy={y} r={2 + rnd(k + 3) * 3} fill={C.accent2} opacity={(0.12 + rnd(k + 7) * 0.3) * P(0.5, 2.5)} />;
        })}
      </svg>
      <div style={{ textAlign: "center", marginTop: 96 }}>
        <div style={{ display: "inline-block", opacity: Math.min(1, pop * 1.4), scale: `${0.5 + 0.5 * pop}`, color: C.ink }}><Mark size={170} /></div>
        <Rise at={1} style={h(118, { marginTop: 56 })}>Não é escolha.</Rise>
        <Rise at={1.7} style={h(118, { color: C.teal })}>É sintoma.</Rise>
        <Rise at={2.9} style={serif(54, { marginTop: 40, color: C.ink2, padding: "0 20px" })}>
          Dar nome à apatia alivia a culpa e diminui o atrito em casa.
        </Rise>
        <Rise at={4.2} style={{ marginTop: 64, font: `700 54px/1 ${F.display}`, letterSpacing: "-0.02em" }}>NeuroMov</Rise>
        <Rise at={4.7} style={{ marginTop: 18, font: `600 25px/1 ${F.body}`, letterSpacing: "0.18em", textTransform: "uppercase", color: C.accent }}>
          Salve · envie a quem cuida
        </Rise>
      </div>
    </Frame>
  );
};

export const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8];
void clamp; void out;
