"""Cenas do vídeo 'Parkinsonismo por medicamento' na identidade B (tutorial em passos).
Cada função desenha um quadro 1080x1920 para o tempo local t (segundos dentro da cena)."""
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1080, 1920
F = '/home/claude/fabrica/'
AZUL, AZUL2 = (29, 78, 216), (15, 30, 110)
AMARELO, VERMELHO, BRANCO = (252, 191, 73), (214, 40, 40), (255, 255, 255)
TINTA = (20, 24, 40)

_fc = {}
def fonte(tipo, tam, peso='SemiBold'):
    k = (tipo, tam, peso)
    if k not in _fc:
        if tipo == 'bebas':
            f = ImageFont.truetype(F + 'estilos/fontes/BebasNeue.ttf', tam)
        else:
            f = ImageFont.truetype(F + 'estilos/fontes/Montserrat.ttf', tam)
            try: f.set_variation_by_name(peso)
            except Exception: pass
        _fc[k] = f
    return _fc[k]

def ease(x):  # 0..1 suave
    x = max(0.0, min(1.0, x)); return 1 - (1 - x) ** 3

def fundo():
    im = Image.new('RGB', (W, H), AZUL)
    d = ImageDraw.Draw(im)
    for y in range(0, H, 4):
        t = y / H
        c = tuple(int(AZUL[i] * (1 - t) + AZUL2[i] * t) for i in range(3))
        d.rectangle((0, y, W, y + 4), fill=c)
    return im

def sombra(im, caixa, raio=36, deslocar=(14, 22), forca=150, blur=26):
    s = Image.new('RGBA', im.size, (0, 0, 0, 0))
    ImageDraw.Draw(s).rounded_rectangle(caixa, raio, fill=(0, 0, 0, forca))
    s = s.filter(ImageFilter.GaussianBlur(blur))
    im.paste(s, deslocar, s)

def cartao_branco(im, caixa, raio=36):
    sombra(im, caixa, raio)
    ImageDraw.Draw(im).rounded_rectangle(caixa, raio, fill=BRANCO)

def cabecalho_passo(im, n, nome, y=240, t=1.0):
    d = ImageDraw.Draw(im)
    a = ease(t / 0.4)
    x = int(90 - 60 * (1 - a))
    d.text((x, y), f"PASSO {n}.", font=fonte('bebas', 150), fill=AMARELO)
    d.text((x + 4, y + 165), nome, font=fonte('mont', 56), fill=BRANCO)

def legenda(im, palavras, y):
    """palavras: lista de (texto, ativo). Centro horizontal, amarelo com contorno."""
    if not palavras: return
    d = ImageDraw.Draw(im); tam = 112
    txt = ' '.join(p for p, _ in palavras)
    while True:
        f = fonte('bebas', tam); w = d.textlength(txt, font=f)
        if w <= 820 or tam <= 60: break
        tam -= 4
    x = (W - w) / 2
    for p, ativo in palavras:
        cor = AMARELO if ativo else BRANCO
        d.text((x, y), p, font=f, fill=cor, stroke_width=7, stroke_fill=(0, 0, 0))
        x += d.textlength(p + ' ', font=f)

def foto_cortada(src, w, h, zoom=1.0, foco=(0.5, 0.38)):
    """Recorta a imagem para w x h (cover), com zoom em torno do foco."""
    sw, sh = src.size
    esc = max(w / sw, h / sh) * zoom
    nw, nh = int(sw * esc), int(sh * esc)
    r = src.resize((nw, nh), Image.LANCZOS)
    cx, cy = int(nw * foco[0]), int(nh * foco[1])
    x0 = max(0, min(nw - w, cx - w // 2)); y0 = max(0, min(nh - h, cy - h // 2))
    return r.crop((x0, y0, x0 + w, y0 + h))

# ---------- objetos ----------
def caixa_med(im, x, y, w, h, nome, cor, rot=0):
    """Caixa de medicamento genérica (sem marca)."""
    c = Image.new('RGBA', (w + 60, h + 60), (0, 0, 0, 0)); d = ImageDraw.Draw(c)
    d.rounded_rectangle((30, 30, 30 + w, 30 + h), 18, fill=BRANCO)
    d.rectangle((30, 30 + int(h * 0.62), 30 + w, 30 + h), fill=cor)
    d.rounded_rectangle((30, 30, 30 + w, 30 + h), 18, outline=(210, 214, 225), width=3)
    f = fonte('mont', max(22, int(w / 9)), 'Bold')
    tw = d.textlength(nome, font=f)
    d.text((30 + (w - tw) / 2, 30 + int(h * 0.25)), nome, font=f, fill=TINTA)
    d.text((48, 30 + int(h * 0.70)), "comprimidos", font=fonte('mont', max(16, int(w / 14))), fill=BRANCO)
    if rot: c = c.rotate(rot, expand=True, resample=Image.BICUBIC)
    sombra(im, (x + 20, y + 20, x + w + 20, y + h + 20), 18, (10, 16), 120, 18)
    im.paste(c, (x - 30, y - 30), c)

def sacola(im, cx, base):
    d = ImageDraw.Draw(im)
    w, h = 360, 300
    x0, y0 = cx - w // 2, base - h
    sombra(im, (x0, y0, x0 + w, base), 24)
    d.rounded_rectangle((x0, y0, x0 + w, base), 24, fill=(245, 245, 240))
    d.arc((cx - 90, y0 - 110, cx + 90, y0 + 70), 180, 360, fill=(190, 190, 185), width=16)
    d.text((cx, y0 + 160), "+", font=fonte('mont', 160, 'Bold'), fill=(46, 160, 90), anchor='mm')

def cartao_nome(im, x, y, nome, uso, a=1.0):
    if a <= 0: return
    w, h = 900, 180
    dx = int(160 * (1 - ease(a)))
    caixa = (x + dx, y, x + dx + w, y + h)
    cartao_branco(im, caixa, 30)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((x + dx, y, x + dx + 26, y + h), 12, fill=AMARELO)
    d.text((x + dx + 60, y + 22), nome, font=fonte('bebas', 92), fill=TINTA)
    d.text((x + dx + 62, y + 116), uso, font=fonte('mont', 40), fill=(90, 96, 115))

# ---------- cenas ----------
def cena_gancho(t, quadro_avatar, palavras):
    im = fundo()
    av = foto_cortada(quadro_avatar, W, 1440, 1.0, (0.5, 0.42))
    im.paste(av, (0, 520))
    # escurece a emenda
    g = Image.new('RGBA', (W, 120), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
    for i in range(120): gd.line([(0, i), (W, i)], fill=AZUL2 + (int(255 * (1 - i / 120)),))
    im.paste(g, (0, 520), g)
    d = ImageDraw.Draw(im)
    linhas = ["ANTES DE FALAR EM PARKINSON,", "OLHE A CAIXA DE MEDICAMENTOS"]
    for i, l in enumerate(linhas):
        d.text((W / 2, 290 + i * 100), l, font=fonte('bebas', 92), fill=AMARELO if i else BRANCO, anchor='mm')
    # três cards ilustrativos acima da cabeça, um em destaque por segundo
    ativo = int(t) % 3
    temas = [("TREMOR", (99, 102, 241)), ("LENTIDÃO", (14, 165, 233)), ("PARKINSON?", (236, 72, 153))]
    for i, (txt, cor) in enumerate(temas):
        cw, ch = 210, 290
        x = 155 + i * 280; y = 450 if i != ativo else 430
        esc = 1.0 if i != ativo else 1.12
        cw2, ch2 = int(cw * esc), int(ch * esc)
        x -= (cw2 - cw) // 2
        sombra(im, (x, y, x + cw2, y + ch2), 26, (8, 14), 140, 16)
        card = Image.new('RGB', (cw2, ch2), cor); cd = ImageDraw.Draw(card)
        for yy in range(ch2):
            k = yy / ch2; cd.line([(0, yy), (cw2, yy)], fill=tuple(int(cor[j] * (1 - k * 0.5)) for j in range(3)))
        cd.ellipse((cw2 / 2 - 38, ch2 / 2 - 60, cw2 / 2 + 38, ch2 / 2 + 16), fill=(255, 255, 255))
        cd.polygon([(cw2 / 2 - 12, ch2 / 2 - 42), (cw2 / 2 - 12, ch2 / 2 - 2), (cw2 / 2 + 20, ch2 / 2 - 22)], fill=cor)
        cd.text((cw2 / 2, ch2 - 50), txt, font=fonte('bebas', 44), fill=BRANCO, anchor='mm')
        m = Image.new('L', (cw2, ch2), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, cw2, ch2), 26, fill=255)
        im.paste(card, (x, y), m)
        if i == ativo:
            ImageDraw.Draw(im).rounded_rectangle((x - 5, y - 5, x + cw2 + 5, y + ch2 + 5), 30, outline=BRANCO, width=6)
    legenda(im, palavras, 1410)
    return im

def cena_opiniao(t, foto, palavras, dur=8.7):
    im = fundo()
    av = foto_cortada(foto, W, H, 1.0 + 0.06 * (t / dur), (0.5, 0.40))
    im.paste(av, (0, 0))
    d = ImageDraw.Draw(im)
    a = ease(t / 0.5)
    x = int(-700 + 840 * a)
    cartao_branco(im, (x, 1180, x + 820, 1340), 24)
    d.rounded_rectangle((x, 1180, x + 22, 1340), 10, fill=AZUL)
    d.text((x + 50, 1200), "JOSÉ VÍCTOR", font=fonte('bebas', 76), fill=TINTA)
    d.text((x + 52, 1282), "Médico neurologista", font=fonte('mont', 34), fill=(90, 96, 115))
    d.text((x + 52, 1352), "CRM-BA 36565 · RQE 26940", font=fonte('mont', 30, 'Bold'), fill=BRANCO,
           stroke_width=3, stroke_fill=(0, 0, 0))
    legenda(im, palavras, 1420)
    return im

def tela_dividida(t, foto, dur, n, nome, desenha_objeto, palavras):
    im = fundo()
    base = foto_cortada(foto, W, 852, 1.05 + 0.05 * (t / dur), (0.5, 0.40))
    im.paste(base, (0, 1068))
    d = ImageDraw.Draw(im)
    d.rectangle((0, 1060, W, 1068), fill=AMARELO)
    cabecalho_passo(im, n, nome, 240, t)
    desenha_objeto(im, t)
    legenda(im, palavras, 945)  # logo acima da divisa
    return im

def obj_passo1(im, t):
    sacola(im, 540, 840)
    nomes = [("TONTURA", (14, 165, 233), -8), ("ENJOO", (16, 185, 129), 6), ("ESTÔMAGO", (245, 158, 11), -4)]
    for i, (n, c, r) in enumerate(nomes):
        ti = t - 1.5 - i * 1.6
        if ti < 0: continue
        a = ease(ti / 0.5)
        x = 150 + i * 270; y = int(520 + (1 - a) * -300)
        caixa_med(im, x, y + (i % 2) * 40, 230, 140, n, c, r)

def obj_passo3(im, t, t_hl=1.2, t_alert=3.0):
    cartao_branco(im, (170, 490, 910, 820), 28)
    d = ImageDraw.Draw(im)
    d.text((220, 510), "Meus medicamentos", font=fonte('mont', 40, 'Bold'), fill=TINTA)
    itens = ["Losartana", "Flunarizina", "Omeprazol", "Bromoprida"]
    for i, it in enumerate(itens):
        y = 578 + i * 58
        destaque = it in ("Flunarizina", "Bromoprida")
        if destaque and t > t_hl + i * 0.25:
            a = ease((t - t_hl - i * 0.25) / 0.4)
            d.rectangle((210, y - 4, 210 + int(380 * a), y + 56), fill=AMARELO)
        d.text((222, y), "• " + it, font=fonte('mont', 44), fill=TINTA)
    if t > t_alert:
        a = ease((t - t_alert) / 0.6)
        txt = "SÓ MUDE COM ORIENTAÇÃO MÉDICA"
        n = int(len(txt) * a)
        d.rounded_rectangle((170, 840, 910, 920), 20, fill=TINTA)
        d.text((540, 882), txt[:n], font=fonte('bebas', 60), fill=AMARELO, anchor='mm')

def cena_passo2(t, palavras, marcas):
    im = fundo()
    cabecalho_passo(im, 2, "Procure estes nomes", 240, t)
    cards = [("FLUNARIZINA", "tontura, enxaqueca"), ("CINARIZINA", "tontura, labirintite"),
             ("METOCLOPRAMIDA", "estômago, enjoo"), ("BROMOPRIDA", "estômago, enjoo")]
    for i, (n, u) in enumerate(cards):
        cartao_nome(im, 90, 520 + i * 205, n, u, (t - marcas[i]) / 0.45)
    if t > marcas[4]:
        a = ease((t - marcas[4]) / 0.4)
        d = ImageDraw.Draw(im)
        d.rounded_rectangle((90, 1345, 90 + int(900 * a), 1415), 24, outline=AMARELO, width=4)
        if a > 0.9: d.text((540, 1380), "+ alguns antipsicóticos", font=fonte('mont', 42), fill=AMARELO, anchor='mm')
    legenda(im, palavras, 1425)
    return im

def cena_passo4(t, palavras, t_fecho):
    im = fundo()
    if t >= t_fecho:
        return cena_fecho(t - t_fecho, im, palavras)
    cabecalho_passo(im, 4, "Tenha paciência", 240, t)
    d = ImageDraw.Draw(im)
    meses = [1, 3, 6]
    k = min(2, int(max(0, t - 0.8) / 1.6))
    cartao_branco(im, (330, 500, 750, 860), 30)
    d.rounded_rectangle((330, 500, 750, 600), 30, fill=AZUL2)
    d.rectangle((330, 570, 750, 600), fill=AZUL2)
    d.text((540, 550), "MÊS", font=fonte('bebas', 70), fill=BRANCO, anchor='mm')
    d.text((540, 735), str(meses[k]), font=fonte('bebas', 220), fill=TINTA, anchor='mm')
    # figura ficando ereta
    inc = [28, 14, 0][k]
    cx, by = 540, 1250
    ang = math.radians(inc)
    topo = (cx + 160 * math.sin(ang), by - 230 + 0)
    d.line([(cx, by), topo], fill=AMARELO, width=26)
    d.ellipse((topo[0] - 40 + 20 * math.sin(ang), topo[1] - 92, topo[0] + 40 + 20 * math.sin(ang), topo[1] - 12), fill=AMARELO)
    d.line([(cx, by), (cx - 55, by + 130)], fill=AMARELO, width=22)
    d.line([(cx, by), (cx + 55, by + 130)], fill=AMARELO, width=22)
    meio = ((cx + topo[0]) / 2, (by + topo[1]) / 2 - 40)
    d.line([meio, (meio[0] - 85, meio[1] + 105)], fill=AMARELO, width=18)
    d.line([meio, (meio[0] + 85, meio[1] + 105)], fill=AMARELO, width=18)
    legenda(im, palavras, 1425)
    return im

def cena_fecho(t, im, palavras):
    d = ImageDraw.Draw(im)
    d.text((540, 300), "O FLUXO INTEIRO", font=fonte('bebas', 120), fill=AMARELO, anchor='mm')
    caixa_med(im, 400, 770, 280, 180, "MEDICAMENTO", (14, 165, 233))
    passos = [("1", "JUNTE", (540, 520)), ("2", "PROCURE", (880, 860)), ("3", "LEVE AO MÉDICO", (540, 1200)), ("4", "ESPERE", (200, 860))]
    for i, (n, txt, (x, y)) in enumerate(passos):
        a = ease((t - i * 0.5) / 0.35)
        if a <= 0: continue
        r = int(95 * a)
        sombra(im, (x - r, y - r, x + r, y + r), r, (6, 12), 120, 12)
        d.ellipse((x - r, y - r, x + r, y + r), fill=BRANCO)
        d.text((x, y - 10), n, font=fonte('bebas', int(110 * a) + 1), fill=AZUL2, anchor='mm')
        ly = y - r - 40 if y < 700 else y + r + 40
        d.text((x, ly), txt, font=fonte('bebas', 58), fill=BRANCO, anchor='mm')
        # seta até a caixa
        alvo = (540, 860)
        vx, vy = alvo[0] - x, alvo[1] - y; L = math.hypot(vx, vy); ux, uy = vx / L, vy / L
        p0 = (x + ux * (r + 20), y + uy * (r + 20)); p1 = (alvo[0] - ux * 200, alvo[1] - uy * 150)
        d.line([p0, p1], fill=AMARELO, width=10)
        px, py = -uy, ux
        d.polygon([(p1[0] + ux * 30, p1[1] + uy * 30), (p1[0] + px * 22, p1[1] + py * 22), (p1[0] - px * 22, p1[1] - py * 22)], fill=AMARELO)
    legenda(im, palavras, 1425)
    return im

def cena_chamada(t, quadro_avatar, palavras, t_digita):
    im = fundo()
    av = foto_cortada(quadro_avatar, W, H, 1.0, (0.5, 0.42))
    im.paste(av, (0, 0))
    d = ImageDraw.Draw(im)
    # alerta fixo: ninguém mexe nos medicamentos sem consulta
    sombra(im, (130, 250, 950, 410), 24)
    d.rounded_rectangle((130, 250, 950, 410), 24, fill=TINTA)
    d.rounded_rectangle((130, 250, 152, 410), 10, fill=AMARELO)
    d.text((550, 300), "ATENÇÃO: NÃO SUSPENDA NEM TROQUE", font=fonte('bebas', 58), fill=AMARELO, anchor='mm')
    d.text((550, 360), "medicamentos sem consulta médica", font=fonte('mont', 36, 'Bold'), fill=BRANCO, anchor='mm')
    if t >= t_digita:
        palavra = "MEDICAMENTO"; n = min(len(palavra), int((t - t_digita) / 0.09) + 1)
        cartao_branco(im, (90, 1280, 990, 1400), 60)
        f = fonte('mont', 50); fb = fonte('mont', 50, 'Bold')
        d.text((150, 1340), "Comenta ", font=f, fill=(70, 70, 80), anchor='lm')
        x2 = 150 + d.textlength("Comenta ", font=f)
        d.text((x2, 1340), palavra[:n], font=fb, fill=VERMELHO, anchor='lm')
        if int(t * 3) % 2 == 0 and n < len(palavra):
            cx = x2 + d.textlength(palavra[:n], font=fb) + 6
            d.line([(cx, 1312), (cx, 1368)], fill=TINTA, width=4)
        d.ellipse((880, 1295, 970, 1385), fill=VERMELHO)
        d.polygon([(910, 1315), (910, 1365), (950, 1340)], fill=BRANCO)
    legenda(im, palavras, 1415)
    return im

def cena_motion(t, n, nome, desenha_objeto, palavras, escala=1.1, y_dest=620):
    """Passo em tela cheia: o objeto (desenhado para a faixa y 440-1000) ampliado e centralizado."""
    im = fundo()
    cabecalho_passo(im, n, nome, 240, t)
    camada = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    desenha_objeto(camada, t)
    reg = camada.crop((0, 440, W, 1000))
    nw, nh = int(W * escala), int(560 * escala)
    reg = reg.resize((nw, nh), Image.LANCZOS)
    im.paste(reg, ((W - nw) // 2, y_dest), reg)
    legenda(im, palavras, 1425)
    return im

def cena_passo2b(t, palavras, marcas, marcas_psi):
    """Passo 2 com 6 cartões compactos; o último lista os psiquiátricos à medida que são falados."""
    im = fundo()
    cabecalho_passo(im, 2, "Procure estes nomes", 240, t)
    cards = [("FLUNARIZINA", "tontura, enxaqueca"), ("CINARIZINA", "tontura, labirintite"),
             ("METOCLOPRAMIDA", "estômago, enjoo"), ("BROMOPRIDA", "estômago, enjoo"),
             ("PROMETAZINA", "alergia, enjoo, sono")]
    y0, passo, h = 500, 150, 132
    for i, (n, u) in enumerate(cards):
        a = (t - marcas[i]) / 0.45
        if a <= 0: continue
        dx = int(160 * (1 - ease(a))); x = 90
        cartao_branco(im, (x + dx, y0 + i * passo, x + dx + 900, y0 + i * passo + h), 26)
        d = ImageDraw.Draw(im)
        d.rounded_rectangle((x + dx, y0 + i * passo, x + dx + 22, y0 + i * passo + h), 10, fill=AMARELO)
        d.text((x + dx + 50, y0 + i * passo + h / 2), n, font=fonte('bebas', 76), fill=TINTA, anchor='lm')
        d.text((x + dx + 880, y0 + i * passo + h / 2), u, font=fonte('mont', 32), fill=(90, 96, 115), anchor='rm')
    a = (t - marcas[5]) / 0.45
    if a > 0:
        y = y0 + 5 * passo; dx = int(160 * (1 - ease(a)))
        cartao_branco(im, (90 + dx, y, 990 + dx, y + 170), 26)
        d = ImageDraw.Draw(im)
        d.rounded_rectangle((90 + dx, y, 112 + dx, y + 170), 10, fill=AMARELO)
        d.text((140 + dx, y + 48), "PSIQUIÁTRICOS", font=fonte('bebas', 76), fill=TINTA, anchor='lm')
        nomes = ["olanzapina", "risperidona", "haloperidol"]
        vis = [nm for nm, mt in zip(nomes, marcas_psi) if t >= mt]
        d.text((142 + dx, y + 120), " · ".join(vis), font=fonte('mont', 40, 'Bold'), fill=AZUL, anchor='lm')
    legenda(im, palavras, 1435)
    return im
