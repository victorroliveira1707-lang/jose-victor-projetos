import React from "react";
import { Easing } from "remotion";
import { C, F, Frame, Rise, Words, rnd, useP, useT, W } from "./kit";

const h = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  font: `600 ${size}px/1.03 ${F.display}`, letterSpacing: "-0.028em", textWrap: "balance", ...extra,
});
const serif = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  font: `italic 400 ${size}px/1.16 ${F.serif}`, ...extra,
});
const body = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  font: `400 ${size}px/1.36 ${F.body}`, color: C.ink2, ...extra,
});

/** seta desenhada, no mesmo traço do símbolo da marca (nada de glifo de fonte) */
const Arrow: React.FC<{ size: number; down?: boolean; color?: string }> = ({ size, down, color = C.accent }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={{ rotate: down ? "90deg" : undefined, display: "block" }}>
    <path d="M4 12 H20" /><path d="M14 6 L20 12 L14 18" />
  </svg>
);

/* 1 ─ Gancho: o que a família costuma ler, riscado; o nome certo, aceso. */
const Strike: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const p = useP()(at, at + 0.5);
  return (
    <span style={{ position: "relative", display: "inline-block", color: p > 0.5 ? C.ink3 : C.ink }}>
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
      <div style={{ marginTop: 420 }}>
        <Rise at={0.4} style={h(98)}>Não é <Strike at={1.4}>preguiça.</Strike></Rise>
        <Rise at={1.9} style={h(98, { marginTop: 14 })}>Não é <Strike at={2.9}>má vontade.</Strike></Rise>
        <div style={{ ...h(214, { marginTop: 44, color: C.accent, letterSpacing: "-0.04em" }), opacity: lit, scale: `${0.86 + 0.14 * lit}`, transformOrigin: "left bottom", filter: `blur(${(1 - lit) * 18}px)`, textShadow: `0 0 ${70 * lit}px rgba(255,138,76,.45)` }}>
          É apatia.
        </div>
        <Rise at={4.6} style={serif(51, { marginTop: 26, color: C.ink })}>Um sintoma neurológico, com nome e manejo.</Rise>
      </div>
      <div style={{ position: "absolute", right: 84, bottom: 118, display: "flex", alignItems: "center", gap: 14, opacity: P(5.5, 6.2), font: `600 25px/1 ${F.body}`, letterSpacing: "0.16em", textTransform: "uppercase", color: C.ink2 }}>
        arraste
        <span style={{ translate: `${8 + 8 * Math.sin(t * 5)}px 0px` }}><Arrow size={36} /></span>
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
      <div style={{ opacity: 1 - 0.38 * away, scale: `${1 - 0.14 * away}`, transformOrigin: "left top" }}>
        <Rise at={0.3} style={body(30, { color: C.ink3 })}>No dia a dia</Rise>
        <Rise at={0.5} style={{ ...serif(74, { color: C.ink2 }), marginTop: 10, position: "relative", display: "inline-block" }}>
          “hoje eu tô meio apático”
          <i style={{ position: "absolute", left: 0, right: 0, top: "56%", height: 4, background: C.ink3, scale: `${away} 1`, transformOrigin: "left center" }} />
        </Rise>
      </div>
      <Rise at={2.3} style={body(30, { color: C.teal, marginTop: 40 })}>No consultório</Rise>
      <Words at={2.5} text="Redução quantificável do comportamento dirigido a objetivo." hi={{ quantificável: C.teal }} style={h(76, { marginTop: 14 })} />
      <div style={{ position: "absolute", left: 84, right: 84, top: 610, display: "grid", gap: 30 }}>
        {items.map((label, k) => {
          const a = 3.9 + k * 0.22;
          const fill = P(a, a + 0.6), drain = P(a + 0.9, a + 2, Easing.bezier(0.5, 0, 0.2, 1));
          const w = fill * (1 - 0.74 * drain);
          return (
            <div key={label} style={{ opacity: fill }}>
              <div style={{ display: "flex", justifyContent: "space-between", font: `600 35px/1 ${F.display}`, letterSpacing: "-0.01em" }}>
                {label}
                <span style={{ opacity: drain }}><Arrow size={32} down /></span>
              </div>
              <div style={{ height: 14, borderRadius: 14, background: "rgba(255,255,255,.07)", marginTop: 14, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${w * 100}%`, borderRadius: 14, background: `linear-gradient(90deg, ${C.accent}, ${C.accent2})` }} />
              </div>
            </div>
          );
        })}
      </div>
      <Rise at={5.4} style={{ ...serif(42, { color: C.ink2 }), position: "absolute", left: 84, right: 84, top: 1010 }}>
        Na doença de Huntington, soma-se o embotamento emocional: a pessoa se retrai.
      </Rise>
    </Frame>
  );
};

/* 3 ─ Não é seletiva: o uso banal apaga uma coisa só; a apatia clínica apaga várias, por semanas. */
const Check: React.FC<{ ok?: boolean; size?: number }> = ({ ok = true, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={ok ? C.teal : C.accent} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: `0 0 ${size}px` }}>
    {ok ? <path d="M5 12.5 L10 17.5 L19 7" /> : <><path d="M6 6 L18 18" /><path d="M18 6 L6 18" /></>}
  </svg>
);

export const SSel: React.FC = () => {
  const P = useP();
  const areas = ["passatempos", "tarefas de casa", "autocuidado", "conversa", "trabalho", "vida social"];
  const banal = P(1.7, 2.3);         // uma área só se apaga
  const clinica = (k: number) => P(3.3 + k * 0.16, 4 + k * 0.16); // todas se apagam
  const rows = [
    "É uma mudança em relação a como a pessoa era.",
    "Dura semanas: pelo menos quatro, de forma persistente.",
    "Pega mais de uma frente: iniciativa, interesse, emoção.",
    "Atrapalha a vida pessoal, social ou o trabalho.",
  ];
  return (
    <Frame n={3} stall={0.45} src={<>Miller DS et al. Diagnostic criteria for apathy in neurocognitive disorders. Alzheimers Dement 2021. Critérios de consenso para pessoas com doença que afeta a cognição.</>}>
      <Words at={0.3} text="Apatia não é desinteresse por uma coisa só." hi={{ uma: C.accent, coisa: C.accent, só: C.accent }} style={h(78)} />
      <div style={{ position: "relative", height: 74, marginTop: 34 }}>
        <div style={{ ...serif(50, { color: C.ink2 }), position: "absolute", opacity: P(1.3, 1.9) * (1 - P(3, 3.5)) }}>“pra isso eu sou apático”</div>
        <div style={{ ...serif(50, { color: C.teal }), position: "absolute", opacity: P(3.2, 3.8) }}>na apatia de verdade, cai a iniciativa em:</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 14 }}>
        {areas.map((a, k) => {
          const on = P(0.9 + k * 0.08, 1.5 + k * 0.08);
          const off = Math.max(k === 3 ? banal : 0, clinica(k));
          return (
            <div key={a} style={{ opacity: on, scale: `${0.9 + 0.1 * on}`, padding: "30px 10px", borderRadius: 18, textAlign: "center", font: `600 31px/1.1 ${F.display}`,
              color: off > 0.5 ? C.ink3 : C.bg, background: off > 0.5 ? C.surface2 : C.accent2, border: `1px solid ${off > 0.5 ? C.line : C.accent2}`, filter: `brightness(${1 - 0.25 * Math.sin(off * Math.PI)})` }}>
              {a}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 40, display: "grid", gap: 22 }}>
        {rows.map((r, k) => {
          const p = P(4.6 + k * 0.4, 5.3 + k * 0.4);
          return (
            <div key={r} style={{ display: "flex", gap: 20, alignItems: "flex-start", opacity: p, translate: `${(1 - p) * 50}px 0px` }}>
              <Check />
              <div style={body(34, { color: C.ink })}>{r}</div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
};

/* 4 ─ Apatia e depressão: o que separa é o sofrimento subjetivo. */
const Gauge: React.FC<{ at: number; level: number; color: string; name: string; value: string; note: string }> = ({ at, level, color, name, value, note }) => {
  const P = useP();
  const t = useT();
  const up = P(at, at + 1.6, Easing.bezier(0.3, 1.3, 0.4, 1));
  const lvl = level * up + 0.012 * Math.sin(t * 2.4) * up;
  return (
    <Rise at={at - 0.4} style={{ flex: 1, padding: "34px 34px 36px", borderRadius: 30, border: `1px solid ${C.line}`, background: "rgba(24,19,16,.86)" }}>
      <div style={h(50)}>{name}</div>
      <div style={{ display: "flex", gap: 26, marginTop: 28, alignItems: "flex-end" }}>
        <div style={{ position: "relative", width: 86, height: 400, borderRadius: 43, background: "rgba(255,255,255,.06)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lvl * 100}%`, background: `linear-gradient(0deg, ${color}, ${color}cc)` }} />
        </div>
        <div>
          <div style={body(26, { color: C.ink3 })}>sofrimento<br />subjetivo</div>
          <div style={{ ...h(52), color, marginTop: 12, opacity: P(at + 1, at + 1.6) }}>{value}</div>
        </div>
      </div>
      <div style={{ ...serif(36, { color: C.ink2 }), marginTop: 26, opacity: P(at + 1.4, at + 2.1) }}>{note}</div>
    </Rise>
  );
};

export const S3: React.FC = () => (
  <Frame n={4} stall={0.6} src={<>Timmer MHM et al. Pract Neurol 2017;17(5):359-368 · Goldman JG. Continuum 2016;22(4):1086-1103 · Buoli M et al. J Geriatr Psychiatry Neurol 2015.</>}>
    <Words at={0.3} text="Parece depressão. Nem sempre é." hi={{ Nem: C.accent, sempre: C.accent, é: C.accent }} style={h(88)} />
    <div style={{ display: "flex", gap: 22, marginTop: 56 }}>
      <Gauge at={1.5} level={0.86} color={C.accent2} name="Depressão" value="alto" note="humor triste" />
      <Gauge at={2.3} level={0.1} color={C.teal} name="Apatia" value="baixo ou ausente" note="humor embotado, não triste" />
    </div>
    <Rise at={4.4} style={body(35, { marginTop: 48 })}>
      Perder o prazer (anedonia) aparece <b style={{ color: C.ink, fontWeight: 600 }}>nas duas</b>: não serve para separar.
    </Rise>
    <Rise at={5.1} style={h(46, { marginTop: 22, color: C.teal })}>E elas podem vir juntas. Procure as duas.</Rise>
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
    background: `radial-gradient(circle at 34% 28%, ${color}55, ${C.surface2} 68%)`, border: `3px solid ${color}`, boxShadow: `0 34px 70px rgba(0,0,0,.55), inset 0 0 50px rgba(0,0,0,.5)`,
    rotate: flipped ? "y 180deg" : undefined,
  });
  return (
    <Frame n={5} stall={0.5} src={<>Bachoud-Lévi AC et al. International Guidelines for the Treatment of Huntington’s Disease. Front Neurol 2019;10:710.</>}>
      <Words at={0.3} text="Na doença de Huntington," hi={{ Huntington: C.teal }} style={h(57)} />
      <Words at={0.6} text="é o sintoma psicológico e" style={h(57)} />
      <Words at={1} text="comportamental mais frequente." hi={{ mais: C.accent, frequente: C.accent }} style={h(57)} />
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
        <Rise at={5} style={body(32.5, { marginTop: 32 })}>
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
    <Frame n={6} stall={0.55} src={<>Hershey LA, Lichter DG. PSP: cognitive and behavioral changes. MedLink Neurology 2026 · Kulisevsky J et al. Mov Disord 2026 · Timmer MHM et al. Pract Neurol 2017.</>}>
      <Words at={0.3} text="A apatia atravessa várias doenças do movimento." hi={{ atravessa: C.accent }} style={h(80)} />
      <Rise at={1.3} style={body(30, { marginTop: 24, color: C.ink3 })}>Proporção de pacientes com apatia em cada doença</Rise>
      <div style={{ display: "grid", gap: 44, marginTop: 40 }}>
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
                <div style={{ height: "100%", width: `${r.v * p}%`, borderRadius: 16, background: r.color }} />
              </div>
            </div>
          );
        })}
      </div>
      <Rise at={4.4} style={{ ...body(31), marginTop: 46, paddingTop: 30, borderTop: `1px solid ${C.line}` }}>
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
    <Frame n={7} stall={0.5} dip={sag * 0.2} src={<>Kulisevsky J, Bojtos L, Kramberger MG, et al.; MDS Non-Motor Symptoms Study Group. Apathy in Lewy Body Disorders: A Position Paper. Mov Disord 2026.</>}>
      <Rise at={0.3} style={h(100)}>Pouco reconhecida.</Rise>
      <Rise at={0.8} style={h(100, { color: C.accent })}>Pouco tratada.</Rise>
      <div style={{ display: "grid", gap: 26, marginTop: 76 }}>
        {weights.map((w, k) => {
          const d = drop(k);
          return (
            <div key={w} style={{ opacity: Math.max(0, Math.min(1, (d - 0.3) * 2.6)), translate: `0px ${(1 - d) * -70}px`, width: `${76 + k * 12}%`, padding: "40px 38px", borderRadius: 22, border: `1px solid ${C.line}`, background: C.surface2, boxShadow: "0 18px 30px rgba(0,0,0,.4)" }}>
              <div style={h(46)}>{w}</div>
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
    ["Rotina", "Programa de atividades e estimulação cognitiva sob medida."],
    ["Menos estímulo de uma vez", "Pode ser resposta à sobrecarga: barulho, interferências."],
    ["Procurar depressão", "A depressão pode aumentar a apatia."],
    ["Rever sedativos", "Podem aumentar a apatia: evitar os desnecessários, reduzir doses."],
  ];
  return (
    <Frame n={8} stall={0.7} src={<>Bachoud-Lévi AC et al. Front Neurol 2019;10:710 (itens 1 a 5, doença de Huntington) · Kulisevsky J et al. Mov Disord 2026.</>}>
      <Words at={0.3} text="O manejo começa em casa, não na receita." hi={{ casa: C.teal }} style={h(64)} />
      <div style={{ marginTop: 34 }}>
        {rows.map(([a, b], k) => {
          const p = P(1.3 + k * 0.42, 2 + k * 0.42);
          return (
            <div key={a} style={{ display: "flex", gap: 24, padding: "20px 0", borderTop: `1px solid ${C.line}`, opacity: p, translate: `${(1 - p) * 60}px 0px` }}>
              <div style={{ font: `700 30px/1.25 ${F.display}`, color: C.teal, width: 40 }}>{k + 1}</div>
              <div>
                <div style={h(41, { lineHeight: 1.1 })}>{a}</div>
                <div style={body(29, { marginTop: 8 })}>{b}</div>
              </div>
            </div>
          );
        })}
      </div>
      <Rise at={4.3} style={{ ...body(28), marginTop: 18, padding: "22px 28px", borderRadius: 22, border: "1px dashed rgba(255,138,76,.5)" }}>
        <b style={{ color: C.accentInk, fontWeight: 600 }}>Para o colega:</b> no Parkinson e na demência com corpos de Lewy, nenhum tratamento é hoje
        considerado definitivamente eficaz.
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
    <Frame n={10} stall={1} src={<>Conteúdo educativo. Não substitui consulta médica nem autoriza mudar medicação por conta própria.</>}>
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

/* 9 ─ Antidepressivo: o sinal existe; quem pesa é o médico, com a pessoa. */
export const SAnti: React.FC = () => {
  const P = useP();
  const t = useT();
  // gangorra: pende para um lado, para o outro, e assenta
  const tilt = -9 * P(1, 1.9) + 18 * P(2.2, 3.2) - 9 * P(3.6, 4.6) + Math.sin(t * 1.4) * 0.5 * P(4.6, 5.2);
  return (
    <Frame n={9} stall={0.6} src={<>Buoli M et al. J Geriatr Psychiatry Neurol 2015 · Kulisevsky J et al. Mov Disord 2026 · Bachoud-Lévi AC et al. Front Neurol 2019;10:710.</>}>
      <Words at={0.3} text="E o antidepressivo, pode piorar a apatia?" hi={{ antidepressivo: C.accent }} style={h(74)} />
      <Rise at={1.2} style={body(32, { marginTop: 26 })}>
        Na doença de Parkinson, uma classe deles, os ISRS (inibidores seletivos da recaptação de serotonina), já foi <b style={{ color: C.ink, fontWeight: 600 }}>associada</b> a mais apatia.
        Associação é um sinal para investigar. Não prova que o remédio seja a causa.
      </Rise>
      <svg width={912} height={250} viewBox="0 0 912 250" style={{ marginTop: 50, opacity: P(0.9, 1.6), overflow: "visible" }}>
        <path d="M456 232 L426 150 H486 Z" fill={C.surface2} stroke={C.line} strokeWidth={2} />
        <g style={{ rotate: `${tilt}deg`, transformOrigin: "456px 150px" }}>
          <rect x={96} y={144} width={720} height={12} rx={6} fill={C.ink3} />
          <rect x={96} y={40} width={320} height={104} rx={18} fill={C.surface2} stroke={C.accent} strokeWidth={2} />
          <text x={256} y={106} textAnchor="middle" fontFamily={F.display} fontWeight={600} fontSize={40} fill={C.ink}>tratar o humor</text>
          <rect x={496} y={40} width={320} height={104} rx={18} fill={C.surface2} stroke={C.teal} strokeWidth={2} />
          <text x={656} y={106} textAnchor="middle" fontFamily={F.display} fontWeight={600} fontSize={40} fill={C.ink}>vigiar a apatia</text>
        </g>
      </svg>
      <div style={{ display: "grid", gap: 20, marginTop: 14 }}>
        <Rise at={3.6} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          <Check ok={false} />
          <div style={body(33, { color: C.ink })}>Não é motivo para parar ou trocar o remédio por conta própria. A depressão sem tratamento também aumenta a apatia.</div>
        </Rise>
        <Rise at={4.5} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          <Check />
          <div style={body(33, { color: C.ink })}>Se a apatia surgiu ou piorou depois de começar ou aumentar a dose, conte isso na consulta.</div>
        </Rise>
      </div>
      <Rise at={5.6} style={h(42, { marginTop: 26, color: C.teal })}>Este post informa. Quem faz diagnóstico e ajusta remédio é o médico, com você.</Rise>
    </Frame>
  );
};

/* 11 ─ Referências. */
export const SRefs: React.FC = () => {
  const P = useP();
  const refs = [
    "Bachoud-Lévi AC, Ferreira J, Massart R, et al. International Guidelines for the Treatment of Huntington’s Disease. Front Neurol. 2019;10:710.",
    "Kulisevsky J, Bojtos L, Kramberger MG, et al. Apathy in Lewy Body Disorders: A Position Paper. Mov Disord. 2026. doi:10.1002/mds.70464",
    "Miller DS, Robert P, Ereshefsky L, et al. Diagnostic criteria for apathy in neurocognitive disorders. Alzheimers Dement. 2021. doi:10.1002/alz.12358",
    "Timmer MHM, van Beek MHCT, Bloem BR, Esselink RAJ. What a neurologist should know about depression in Parkinson’s disease. Pract Neurol. 2017;17(5):359-368.",
    "Buoli M, Caldiroli A, Altamura AC. Psychiatric Conditions in Parkinson Disease. J Geriatr Psychiatry Neurol. 2015. doi:10.1177/0891988715606233",
    "Goldman JG. Neuropsychiatric Issues in Parkinson Disease. Continuum (Minneap Minn). 2016;22(4):1086-1103.",
    "Hershey LA, Lichter DG. Progressive supranuclear palsy: cognitive and behavioral changes. MedLink Neurology. 2026.",
  ];
  return (
    <Frame n={11} stall={1} src={<>Conteúdo dos módulos Huntington, Psiquiátrico do Parkinson e PSP do NeuroMov, e dos artigos que os sustentam.</>}>
      <Rise at={0.2} style={h(84)}>Referências</Rise>
      <div style={{ marginTop: 30 }}>
        {refs.map((r, k) => {
          const p = P(0.7 + k * 0.3, 1.4 + k * 0.3);
          return (
            <div key={k} style={{ display: "flex", gap: 20, padding: "17px 0", borderTop: `1px solid ${C.line}`, opacity: p, translate: `0px ${(1 - p) * 26}px` }}>
              <div style={{ font: `700 27px/1.3 ${F.display}`, color: C.teal, width: 30, fontVariantNumeric: "tabular-nums" }}>{k + 1}</div>
              <div style={body(27, { lineHeight: 1.32 })}>{r}</div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
};

export const SLIDES = [S1, S2, SSel, S3, S4, S5, S6, S7, SAnti, S8, SRefs];
