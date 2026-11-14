import sys, json, subprocess, re
sys.path.insert(0, '/home/claude/fabrica/video2')
from cenas import *
from PIL import Image

B = '/home/claude/fabrica/video2/'
FPS = 30
ordem = ['0_gancho', '1_opiniao', '2_passo1', '3_passo2', '4_passo3', '5_passo4_fecho', '6_chamada']
pal = json.load(open(B + 'palavras.json'))
dur = {k: float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0',
                                B + f'audio/{k}.mp3'], capture_output=True, text=True).stdout) for k in ordem}

# correções de transcrição para a legenda (o áudio não muda)
fix = {'-neurologista,': 'neurologista.', 'Parkinsonismo': 'parkinsonismo', 'enjô,': 'enjoo,', 'enjou.': 'enjoo.',
       'sinarizina,': 'cinarizina,', 'prometasina': 'prometazina', 'lanzapina,': 'olanzapina,', 'aloperidol.': 'haloperidol.',
       'Inclusive,': 'inclusive', 'toma.': 'toma,', 'meses.': 'meses,'}
for k in ordem:
    ws = pal[k + '.mp3']
    if k == '3_passo2':  # 'como o lanzapina' -> 'como olanzapina'
        ws = [w for i, w in enumerate(ws) if not (w['w'] == 'o' and i + 1 < len(ws) and ws[i + 1]['w'].startswith('lanzapina'))]
    for w in ws: w['w'] = fix.get(w['w'], w['w'])
    pal[k] = ws

def grupos(ws):
    gs, g = [], []
    for w in ws:
        g.append(w)
        if len(g) == 3 or re.search(r'[.,?!]$', w['w']): gs.append(g); g = []
    if g: gs.append(g)
    return gs

def palavras_em(k, t):
    gs = grupos(pal[k])
    for i, g in enumerate(gs):
        ini = g[0]['s'] - 0.05
        fim = gs[i + 1][0]['s'] - 0.05 if i + 1 < len(gs) else g[-1]['e'] + 0.4
        if ini <= t < fim:
            limpo = lambda s: re.sub(r'[.,?!]+$', '', s).upper()
            ativo = max([j for j, w in enumerate(g) if w['s'] <= t] or [0])
            return [(limpo(w['w']), j == ativo) for j, w in enumerate(g)]
    return []

def tempo(k, palavra, n=0):
    hits = [w['s'] for w in pal[k] if palavra.lower() in w['w'].lower()]
    return hits[n]

foto = Image.open(B + 'foto.jpg').convert('RGB')

class Leitor:
    def __init__(self, arq):
        self.p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', arq, '-vf', 'fps=30', '-f', 'rawvideo',
                                   '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
        self.w, self.h = 1248, 1664; self.ult = None
    def prox(self):
        b = self.p.stdout.read(self.w * self.h * 3)
        if len(b) == self.w * self.h * 3: self.ult = Image.frombytes('RGB', (self.w, self.h), b)
        return self.ult

# marcas de tempo (locais em cada cena)
m1 = [tempo('2_passo1', 'medicamentos'), tempo('2_passo1', 'últimos'), tempo('2_passo1', 'cabeça'),
      tempo('2_passo1', 'tontura'), tempo('2_passo1', 'enjoo'), tempo('2_passo1', 'estômago')]
m2 = [tempo('3_passo2', 'flunarizina'), tempo('3_passo2', 'cinarizina'), tempo('3_passo2', 'metoclopramida'),
      tempo('3_passo2', 'bromoprida'), tempo('3_passo2', 'prometazina'), tempo('3_passo2', 'psiquiátricos')]
m2p = [tempo('3_passo2', 'olanzapina'), tempo('3_passo2', 'risperidona'), tempo('3_passo2', 'haloperidol')]
m3 = [tempo('4_passo3', 'Achou'), tempo('4_passo3', 'Não')]
m4 = [tempo('5_passo4_fecho', 'tira'), tempo('5_passo4_fecho', 'melhora'), tempo('5_passo4_fecho', 'meses')]
t_fecho = tempo('5_passo4_fecho', 'Então')
t_dig = tempo('6_chamada', 'comenta')

def obj_p1(im, t):
    sacola(im, 540, 960)
    caixas = [("COMPRIMIDO", (99, 102, 241), 5), ("GOTAS", (236, 72, 153), -6), ("XAROPE", (20, 184, 166), 4),
              ("TONTURA", (14, 165, 233), -8), ("ENJOO", (16, 185, 129), 6), ("ESTÔMAGO", (245, 158, 11), -4)]
    pos = [(170, 560), (420, 530), (670, 560), (150, 650), (420, 690), (690, 650)]
    for i, (n, c, r) in enumerate(caixas):
        ti = t - (m1[i] - 0.1)
        if ti < 0: continue
        a = ease(ti / 0.45)
        x, y = pos[i]
        caixa_med(im, x, int(y - (1 - a) * 300), 230, 140, n, c, r)

def obj_p3(im, t):
    # adapta os tempos do desenho original às falas
    obj_passo3(im, t, m3[0] - 0.1, m3[1] - 0.1)

def cena_p4(t, w):
    # meses mudam com a fala: 1 em 'causa', 3 em 'melhora', 6 em 'meses'
    if t < t_fecho:
        k = 0 if t < m4[1] else (1 if t < m4[2] else 2)
        fake_t = 0.8 + k * 1.6 + 0.01
        return cena_passo4(fake_t if t >= m4[0] - 0.1 else 0.5, w, 99)
    return cena_passo4(t, w, t_fecho)

sons = []
offs = {}; acc = 0.0
for k in ordem: offs[k] = acc; acc += dur[k]
total = acc
for k in ordem[1:]: sons.append((offs[k] - 0.05, 'whoosh', -14))
sons.append((0.0, 'whoosh', -14))
for x in m1: sons.append((offs['2_passo1'] + x - 0.1, 'click', -12))
for x in m2 + m2p: sons.append((offs['3_passo2'] + x - 0.1, 'click', -12))
sons.append((offs['4_passo3'] + m3[0] - 0.1, 'click', -12))
sons.append((offs['4_passo3'] + m3[1] - 0.1, 'type', -14))
for x in m4: sons.append((offs['5_passo4_fecho'] + x - 0.1, 'click', -12))
for i in range(4): sons.append((offs['5_passo4_fecho'] + t_fecho + i * 0.5, 'pop', -14))
sons.append((offs['6_chamada'] + t_dig - 0.1, 'type', -12))

if __name__ == '__main__':
    de = float(sys.argv[1]) if len(sys.argv) > 1 else 0.0
    ate = float(sys.argv[2]) if len(sys.argv) > 2 else total
    saida = sys.argv[3] if len(sys.argv) > 3 else B + 'video_mudo.mp4'
    av = {'0_gancho': Leitor(B + 'avatar/gancho.mp4'), '1_opiniao': Leitor(B + 'avatar/opiniao.mp4'), '6_chamada': Leitor(B + 'avatar/chamada.mp4')}
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '1080x1920',
                            '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19',
                            '-pix_fmt', 'yuv420p', saida], stdin=subprocess.PIPE)
    n = int(round(total * FPS))
    for f in range(n):
        T = f / FPS
        k = [x for x in ordem if offs[x] <= T][-1]
        t = T - offs[k]
        q = av[k].prox() if k in av else None
        if T < de or T >= ate: continue
        w = palavras_em(k, t)
        if k == '0_gancho': im = cena_gancho(t, q, w)
        elif k == '1_opiniao': im = cena_opiniao(t, q, w, dur[k])
        elif k == '2_passo1': im = cena_motion(t, 1, "Junte todos os medicamentos", obj_p1, w)
        elif k == '3_passo2': im = cena_passo2b(t, w, [x - 0.1 for x in m2], [x - 0.05 for x in m2p])
        elif k == '4_passo3': im = cena_motion(t, 3, "Leve a lista ao médico", obj_p3, w)
        elif k == '5_passo4_fecho': im = cena_p4(t, w)
        else: im = cena_chamada(t, q, w, t_dig - 0.1)
        enc.stdin.write(im.tobytes())
    enc.stdin.close(); enc.wait()
    json.dump({'total': total, 'offs': offs, 'sons': sons}, open(B + 'timeline.json', 'w'), ensure_ascii=False, indent=1)
    print('ok', round(total, 2))
