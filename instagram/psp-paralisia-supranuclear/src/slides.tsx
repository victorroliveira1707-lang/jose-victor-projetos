import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, DUR, Eye, Frame, Rise, Tag, Words, body, clamp, display, out} from './kit';

const P: React.CSSProperties = {fontFamily: body, fontWeight: 400, color: C.ink2, lineHeight: 1.36};
const box: React.CSSProperties = {borderRadius: 26, border: `1px solid ${C.line}`, background: 'rgba(24,19,16,.9)'};

/* 01 — gancho */
export const S1: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Frame n={1}>
      <Tag><span style={{color: C.accent}}>NeuroMov</span> · parkinsonismos atípicos</Tag>
      <div
        style={{
          position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center',
          opacity: interpolate(frame, [0, 16], [0, 1], clamp),
          scale: interpolate(frame, [0, 30], [0.7, 1], {...clamp, easing: Easing.spring({damping: 14})}),
        }}
      >
        <Eye
          size={330}
          // para os lados: rápido. para baixo: devagar e incompleto.
          x={interpolate(frame, [18, 24, 40, 46, 62, 68, 84, 90], [0, -1, -1, 1, 1, -1, -1, 0], {...clamp, easing: Easing.bezier(0.3, 0, 0.1, 1)})}
          y={interpolate(frame, [100, 190], [0, 0.42], {...clamp, easing: Easing.bezier(0.4, 0, 0.9, 0.6)})}
        />
      </div>
      <Words at={26} text="Nem todo parkinsonismo é doença de Parkinson." hi={{parkinsonismo: C.accent}} style={{position: 'absolute', left: 84, right: 84, top: 520, fontSize: 96, lineHeight: 1.02}} />
      <Rise at={96} style={{position: 'absolute', left: 84, right: 84, top: 965, ...P, fontSize: 36}}>
        Para os lados, o olhar vai rápido. <span style={{color: C.ink}}>Para baixo, demora.</span>
        <br />
        Esse detalhe tem nome: <span style={{color: C.teal, fontWeight: 600}}>PSP</span>, paralisia supranuclear progressiva.
      </Rise>
      <div
        style={{
          position: 'absolute', right: 84, bottom: 104, fontFamily: body, fontWeight: 600, fontSize: 25, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.accentInk,
          opacity: interpolate(frame, [140, 156], [0, 1], clamp),
          translate: `${interpolate(frame % 40, [0, 20, 40], [0, 14, 0], {easing: Easing.inOut(Easing.sin)})}px 0px`,
        }}
      >
        arraste →
      </div>
    </Frame>
  );
};

/* 02 — parkinsonismo é síndrome */
export const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const chip = (at: number, label: string, color: string, strong = false) => (
    <Rise at={at} dy={24} style={{display: 'inline-block', marginRight: 14, marginBottom: 14}}>
      <span style={{display: 'inline-block', fontFamily: display, fontWeight: 600, fontSize: strong ? 40 : 32, padding: strong ? '18px 30px' : '16px 26px', borderRadius: 999, border: `2px solid ${color}`, color: strong ? C.bg : color, background: strong ? color : 'transparent'}}>
        {label}
      </span>
    </Rise>
  );
  return (
    <Frame n={2}>
      <Tag>Antes de tudo</Tag>
      <Words at={8} text="Parkinsonismo é um conjunto de sinais. Não é uma doença." hi={{sinais: C.teal}} style={{fontSize: 76, lineHeight: 1.04, marginTop: 22}} />
      <div style={{display: 'flex', gap: 18, marginTop: 50, alignItems: 'stretch'}}>
        <Rise at={48} style={{...box, flex: 1.15, padding: '28px 30px'}}>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 9, height: 96}}>
            {Array.from({length: 13}, (_, i) => (
              <div
                key={i}
                style={{
                  width: 15, borderRadius: 8, background: i < 6 ? C.teal : C.accent,
                  // o decremento: cada batida sai menor que a anterior
                  height: interpolate(frame, [58 + i * 5, 68 + i * 5], [0, 96 * Math.pow(0.86, i)], {...clamp, easing: Easing.spring({damping: 12})}),
                }}
              />
            ))}
          </div>
          <div style={{fontFamily: display, fontWeight: 600, fontSize: 36, marginTop: 20, lineHeight: 1.12}}>Lentidão que perde amplitude</div>
          <div style={{...P, fontSize: 25, marginTop: 8}}>bradicinesia com decremento</div>
        </Rise>
        <Rise at={62} style={{fontFamily: display, fontWeight: 500, fontSize: 60, color: C.ink3, alignSelf: 'center'}}>+</Rise>
        <Rise at={70} style={{...box, flex: 1, padding: '28px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <div style={{fontFamily: display, fontWeight: 600, fontSize: 36, lineHeight: 1.12}}>Tremor de repouso <span style={{color: C.ink3}}>ou</span> rigidez</div>
          <div style={{...P, fontSize: 25, marginTop: 8}}>basta um dos dois</div>
        </Rise>
      </div>
      <Rise at={110} style={{...P, fontSize: 34, marginTop: 54}}>Várias doenças produzem esse conjunto:</Rise>
      <div style={{marginTop: 24}}>
        {chip(124, 'Doença de Parkinson', C.teal)}
        {chip(134, 'PSP', C.accent, true)}
        {chip(144, 'outros parkinsonismos atípicos', C.ink3)}
      </div>
      <Rise at={166} style={{position: 'absolute', left: 84, right: 84, bottom: 112, ...P, fontSize: 26, borderLeft: `4px solid ${C.accent}`, paddingLeft: 24}}>
        <span style={{color: C.accentInk, fontWeight: 600}}>Colega:</span> pelos critérios MDS de 2015, a bradicinesia precisa ser documentada nos membros, com decremento.
      </Rise>
    </Frame>
  );
};

/* 03 — DP x PSP */
export const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const rows: [string, string, string][] = [
    ['Tremor', 'De repouso, de um lado', 'Pouco tremor'],
    ['Rigidez', 'Nos membros, assimétrica', 'No pescoço e no tronco, simétrica'],
    ['Equilíbrio', 'Instabilidade tardia', 'Quedas precoces, para trás'],
    ['Levodopa', 'Resposta clara', 'Parcial, em uma minoria'],
  ];
  const figure = (color: string, deg: number) => (
    <svg width={90} height={150} viewBox="-45 -150 90 150" style={{overflow: 'visible'}}>
      <g style={{transformOrigin: '0px 0px', rotate: `${deg}deg`}}>
        <rect x={-9} y={-104} width={18} height={104} rx={9} fill={color} />
        <circle cx={0} cy={-126} r={19} fill={color} />
      </g>
      <line x1={-45} x2={45} y1={2} y2={2} stroke={C.ink3} strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
  return (
    <Frame n={3}>
      <Tag>Onde os caminhos se separam</Tag>
      <Words at={8} text="Mesmo conjunto de sinais, doenças diferentes" style={{fontSize: 66, lineHeight: 1.04, marginTop: 22}} />
      <div style={{display: 'grid', gridTemplateColumns: '170px 1fr 1fr', columnGap: 18, marginTop: 34, alignItems: 'end'}}>
        <div />
        <Rise at={36} style={{textAlign: 'center'}}>
          {figure(C.teal, interpolate(frame, [50, 90, 130, 170, 210], [0, 7, 5, 7, 5], {...clamp, easing: Easing.inOut(Easing.sin)}))}
          <div style={{fontFamily: display, fontWeight: 600, fontSize: 34, color: C.teal, marginTop: 10}}>Doença de Parkinson</div>
        </Rise>
        <Rise at={44} style={{textAlign: 'center'}}>
          {figure(C.accent, interpolate(frame, [60, 120, 150, 200], [0, -24, -24, -6], {...clamp, easing: [Easing.bezier(0.5, 0, 0.9, 0.5), Easing.linear, Easing.spring({damping: 14})]}))}
          <div style={{fontFamily: display, fontWeight: 600, fontSize: 34, color: C.accent, marginTop: 10}}>PSP</div>
        </Rise>
      </div>
      <div style={{marginTop: 22}}>
        {rows.map(([k, a, b], i) => (
          <Rise key={k} at={64 + i * 16} dy={30} style={{display: 'grid', gridTemplateColumns: '170px 1fr 1fr', columnGap: 18, alignItems: 'center', borderTop: `1px solid ${C.line}`, padding: '32px 0'}}>
            <div style={{fontFamily: body, fontWeight: 600, fontSize: 22, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.ink3}}>{k}</div>
            <div style={{fontFamily: display, fontWeight: 500, fontSize: 31, lineHeight: 1.15, textAlign: 'center'}}>{a}</div>
            <div style={{fontFamily: display, fontWeight: 600, fontSize: 31, lineHeight: 1.15, textAlign: 'center', color: C.accentInk}}>{b}</div>
          </Rise>
        ))}
      </div>
      <Rise at={150} style={{position: 'absolute', left: 84, right: 84, bottom: 106, ...P, fontSize: 27, padding: '22px 28px', borderRadius: 22, border: `1px dashed rgba(255,138,76,.5)`}}>
        <span style={{color: C.accentInk, fontWeight: 600}}>Toda regra tem exceção:</span> uma das formas, a PSP-P, pode ser assimétrica e responder à levodopa por anos.
      </Rise>
    </Frame>
  );
};

/* 04 — o olhar */
export const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const items = ['Tropeços e quedas', 'Não enxergar a comida no prato', 'Dificuldade para ler'];
  // a sacada para baixo não sai reta: descreve um arco lateral ("round-the-house")
  const t = interpolate(frame, [70, 190], [0, 1], {...clamp, easing: Easing.bezier(0.5, 0, 0.8, 0.7)});
  return (
    <Frame n={4}>
      <Tag color={C.teal}>O sinal mais específico</Tag>
      <Words at={8} text="O olhar para baixo fica lento" hi={{baixo: C.accent}} style={{fontSize: 84, lineHeight: 1.02, marginTop: 22}} />
      <div style={{display: 'flex', gap: 44, marginTop: 120, alignItems: 'center'}}>
        <Rise at={30} style={{flex: '0 0 340px'}}>
          <Eye
            size={340}
            x={frame < 70 ? interpolate(frame, [36, 41, 52, 57, 66, 70], [0, -1, -1, 1, 1, 0], {...clamp, easing: Easing.bezier(0.3, 0, 0.1, 1)}) : Math.sin(t * Math.PI) * 0.75}
            y={t * 0.7}
            trail="M0 0 C 75 12, 80 62, 0 60"
          />
        </Rise>
        <div style={{flex: 1}}>
          <Rise at={56} style={{...P, fontSize: 30, marginBottom: 20}}>É isso que explica, no dia a dia:</Rise>
          {items.map((it, i) => (
            <Rise key={it} at={84 + i * 22} dy={30} style={{display: 'flex', gap: 20, alignItems: 'center', padding: '19px 0', borderTop: `1px solid ${C.line}`}}>
              <span style={{width: 16, height: 16, borderRadius: 8, background: C.accent, flex: '0 0 16px', boxShadow: '0 0 22px rgba(255,138,76,.6)'}} />
              <span style={{fontFamily: display, fontWeight: 600, fontSize: 38, lineHeight: 1.12, letterSpacing: '-0.02em'}}>{it}</span>
            </Rise>
          ))}
        </div>
      </div>
      <Rise at={150} style={{position: 'absolute', left: 84, right: 84, bottom: 106, ...box, padding: '26px 30px', ...P, fontSize: 28}}>
        <span style={{color: C.accentInk, fontWeight: 600}}>Colega:</span> teste as sacadas verticais, não só a perseguição. A lentificação para baixo vem antes da paralisia franca, e o trajeto pode sair em arco em vez de reto.
      </Rise>
    </Frame>
  );
};

/* 05 — quedas */
export const S5: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Frame n={5}>
      <Tag>O equilíbrio</Tag>
      <Words at={8} text="Quedas para trás, e cedo" hi={{trás: C.accent}} style={{fontSize: 88, lineHeight: 1.02, marginTop: 22}} />
      <div style={{display: 'flex', gap: 40, marginTop: 50, alignItems: 'flex-end'}}>
        <Rise at={30} style={{flex: '0 0 300px', height: 330, position: 'relative'}}>
          <svg width={300} height={330} viewBox="-150 -310 300 330" style={{overflow: 'visible'}}>
            <path d="M 0 -250 A 250 250 0 0 0 -160 -192" fill="none" stroke={C.accent} strokeWidth={4} strokeDasharray="2 13" strokeLinecap="round" opacity={interpolate(frame, [50, 70], [0, 0.8], clamp)} />
            <g
              style={{
                transformOrigin: '0px 0px',
                rotate: `${interpolate(frame, [50, 104, 128, 168], [0, -30, -30, 0], {...clamp, easing: [Easing.bezier(0.6, 0, 0.9, 0.4), Easing.linear, Easing.spring({damping: 13})]})}deg`,
              }}
            >
              <rect x={-15} y={-210} width={30} height={210} rx={15} fill={C.ink} />
              <circle cx={0} cy={-250} r={34} fill={C.ink} />
            </g>
            <line x1={-150} x2={150} y1={4} y2={4} stroke={C.ink3} strokeWidth={4} strokeLinecap="round" />
          </svg>
        </Rise>
        <div style={{flex: 1}}>
          <Rise at={60} style={{fontFamily: display, fontWeight: 700, fontSize: 150, lineHeight: 0.9, letterSpacing: '-0.04em', color: C.teal}}>3 anos</Rise>
          <Rise at={74} style={{...P, fontSize: 30, marginTop: 18}}>
            Quedas repetidas e sem motivo nos <span style={{color: C.ink, fontWeight: 600}}>primeiros 3 anos</span> entram nos critérios de PSP. Na doença de Parkinson, são sinal de alerta.
          </Rise>
        </div>
      </div>
      <Rise at={112} style={{...box, padding: '32px 32px', marginTop: 70}}>
        <div style={{fontFamily: display, fontWeight: 600, fontSize: 40, letterSpacing: '-0.02em'}}>Levanta de supetão e cai</div>
        <div style={{...P, fontSize: 28, marginTop: 10}}>É o “sinal do foguete”: impulsividade motora, não desatenção. Só vigiar não basta.</div>
      </Rise>
      <Rise at={150} style={{position: 'absolute', left: 84, right: 84, bottom: 106, padding: '24px 30px', borderRadius: 24, background: 'rgba(111,217,198,.1)', border: '1px solid rgba(111,217,198,.35)', fontFamily: body, fontWeight: 500, fontSize: 30, lineHeight: 1.32}}>
        <span style={{color: C.teal, fontWeight: 600}}>Em casa:</span> andador com peso ou com rodas travadas. O andador leve piora a queda para trás.
      </Rise>
    </Frame>
  );
};

/* 06 — nem toda PSP é igual */
export const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const forms = ['Richardson', 'Parkinsonismo', 'Congelamento da marcha', 'Corticobasal', 'Fala e linguagem', 'Frontal', 'Oculomotora', 'Instabilidade postural'];
  const circ = 2 * Math.PI * 104;
  return (
    <Frame n={6}>
      <Tag>Nem toda PSP é igual</Tag>
      <Words at={8} text="O quadro “de livro” é a minoria" hi={{minoria: C.accent}} style={{fontSize: 80, lineHeight: 1.02, marginTop: 22}} />
      <div style={{display: 'flex', gap: 40, marginTop: 64, alignItems: 'center'}}>
        <Rise at={30} style={{flex: '0 0 250px', position: 'relative', height: 250}}>
          <svg width={250} height={250} viewBox="-125 -125 250 250" style={{rotate: '-90deg'}}>
            <circle r={104} fill="none" stroke="rgba(246,239,230,.09)" strokeWidth={26} />
            <circle r={104} fill="none" stroke={C.accent} strokeWidth={26} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - interpolate(frame, [40, 86], [0, 0.24], {...clamp, easing: out}))} />
          </svg>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 700, fontSize: 76, letterSpacing: '-0.04em'}}>
            {Math.round(interpolate(frame, [40, 86], [0, 24], {...clamp, easing: out}))}%
          </div>
        </Rise>
        <Rise at={52} style={{flex: 1, ...P, fontSize: 31}}>
          dos casos <span style={{color: C.ink, fontWeight: 600}}>confirmados por autópsia</span>, numa coorte de referência, tinham a síndrome de Richardson clássica.
        </Rise>
      </div>
      <Rise at={84} style={{...P, fontSize: 28, marginTop: 64}}>Os critérios de 2017 reconhecem oito formas:</Rise>
      <div style={{marginTop: 18}}>
        {forms.map((f, i) => (
          <span
            key={f}
            style={{
              display: 'inline-block', marginRight: 12, marginBottom: 12, fontFamily: body, fontWeight: 500, fontSize: 26, padding: '12px 20px', borderRadius: 999,
              border: `1px solid ${i === 0 ? C.accent : 'rgba(111,217,198,.45)'}`, color: i === 0 ? C.accentInk : C.teal,
              opacity: interpolate(frame, [92 + i * 5, 104 + i * 5], [0, 1], clamp),
              scale: interpolate(frame, [92 + i * 5, 110 + i * 5], [0.8, 1], {...clamp, easing: Easing.spring({damping: 12})}),
            }}
          >
            {f}
          </span>
        ))}
      </div>
      <Rise at={146} style={{position: 'absolute', left: 84, right: 84, bottom: 106, ...box, padding: '26px 30px', display: 'flex', gap: 28, alignItems: 'center'}}>
        <div style={{fontFamily: display, fontWeight: 700, fontSize: 92, lineHeight: 0.9, letterSpacing: '-0.04em', color: C.teal}}>89%</div>
        <div style={{...P, fontSize: 27}}>já tinham mudanças de cognição ou de comportamento na apresentação. A apatia é a marca, e não é o mesmo que depressão.</div>
      </Rise>
    </Frame>
  );
};

/* 07 — cuidado */
export const S7: React.FC = () => {
  const rows: [string, string][] = [
    ['Equipe em volta de quem importa', 'Cuidado multidisciplinar, com paciente e cuidador no centro'],
    ['Prevenir quedas', 'Fisioterapia com treino de equilíbrio e casa adaptada'],
    ['Fonoaudiologia cedo', 'Avaliar a deglutição antes da primeira crise'],
    ['Teste adequado de levodopa', 'Até 1.000 mg/dia, se tolerado, antes de dizer que não responde'],
    ['Toxina botulínica', 'Quando as pálpebras não abrem'],
  ];
  return (
    <Frame n={7}>
      <Tag color={C.teal}>Cuidado</Tag>
      <Words at={8} text="Ainda não há remédio que mude o curso. Há muito a fazer." hi={{muito: C.teal}} style={{fontSize: 68, lineHeight: 1.04, marginTop: 22}} />
      <div style={{marginTop: 30}}>
        {rows.map(([a, b], i) => (
          <Rise key={a} at={50 + i * 17} dy={30} style={{display: 'flex', gap: 24, padding: '26px 0', borderTop: `1px solid ${C.line}`}}>
            <span style={{fontFamily: display, fontWeight: 700, fontSize: 28, color: C.teal, width: 42, lineHeight: 1.35}}>0{i + 1}</span>
            <div>
              <div style={{fontFamily: display, fontWeight: 600, fontSize: 38, lineHeight: 1.12, letterSpacing: '-0.02em'}}>{a}</div>
              <div style={{...P, fontSize: 26, marginTop: 6}}>{b}</div>
            </div>
          </Rise>
        ))}
      </div>
      <Rise at={150} style={{position: 'absolute', left: 84, right: 84, bottom: 106, ...P, fontSize: 26, padding: '22px 28px', borderRadius: 22, border: `1px dashed rgba(111,217,198,.5)`}}>
        <span style={{color: C.teal, fontWeight: 600}}>Um sinal positivo:</span> treino de equilíbrio com exercícios de movimento ocular por 5 semanas melhorou o controle do olhar em ensaio randomizado.
      </Rise>
    </Frame>
  );
};

/* 08 — fecho */
export const S8: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Frame n={8}>
      <div
        style={{
          position: 'absolute', left: 0, right: 0, top: 130, display: 'flex', justifyContent: 'center',
          opacity: interpolate(frame, [0, 16], [0, 1], clamp),
          scale: interpolate(frame, [0, 30], [0.7, 1], {...clamp, easing: Easing.spring({damping: 14})}),
        }}
      >
        <Eye size={250} x={0} y={0} lid={interpolate(frame, [70, 76, 82], [0, 1, 0], clamp)} />
      </div>
      <Words at={24} text="Dar o nome certo muda o cuidado." hi={{certo: C.teal}} style={{position: 'absolute', left: 84, right: 84, top: 450, fontSize: 92, lineHeight: 1.02, textAlign: 'center'}} />
      <Rise at={74} style={{position: 'absolute', left: 110, right: 110, top: 690, ...P, fontSize: 35, textAlign: 'center'}}>
        Reconheceu esses sinais em alguém? Leve essa conversa ao neurologista.
      </Rise>
      <Rise at={104} style={{position: 'absolute', left: 0, right: 0, top: 880, textAlign: 'center'}}>
        <div style={{fontFamily: display, fontWeight: 700, fontSize: 52, letterSpacing: '-0.02em'}}>NeuroMov</div>
        <div style={{fontFamily: body, fontWeight: 500, fontSize: 23, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.ink3, marginTop: 16}}>Salve · envie a quem cuida</div>
      </Rise>
      <div
        style={{
          position: 'absolute', left: 100, right: 100, top: 1010, textAlign: 'center', fontFamily: body, fontSize: 20, lineHeight: 1.45, color: C.ink3,
          opacity: interpolate(frame, [128, 146], [0, 1], clamp),
        }}
      >
        <span style={{color: C.ink2, fontWeight: 500}}>Fontes:</span> Höglinger GU et al. Mov Disord 2017;32(6):853-864 · Postuma RB et al. Mov Disord 2015;30(12):1591-1601 · Greene P. Continuum 2019;25(4):919-935 · McFarland NR. Continuum 2025 · Hershey LA, Lichter DG. MedLink Neurology.
        <br />
        Conteúdo educativo. Não substitui consulta médica.
      </div>
    </Frame>
  );
};

export const slides = [S1, S2, S3, S4, S5, S6, S7, S8];
export {DUR};
