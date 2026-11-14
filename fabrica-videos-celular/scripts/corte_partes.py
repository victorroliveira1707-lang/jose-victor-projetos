"""Corte em partes: alternativa ao `cortar` da Fábrica quando o ffmpeg estoura a memória.

O `cortar` original monta um único filtro com todos os trechos. Com vídeo de celular em
1904x1080 (gravado em pé, rotação 90) e cerca de 13 trechos, isso passou de 6 GB de RAM e
o processo foi morto (OOM). Aqui cada trecho é codificado sozinho e depois tudo é juntado
com o concat demuxer, sem recodificar.

Uso:
    python corte_partes.py <corte.filtro.txt> <bruto.mp4> <corte.mp4>

<corte.filtro.txt> é o arquivo que o próprio `cortar` grava antes de falhar; dele saem os
tempos de cada trecho. Depois rode o realinhamento de palavras (ver README) usando a duração
real de cada parte, porque cada parte arredonda alguns milissegundos.
"""
import re, subprocess, sys, pathlib

filtro, bruto, saida = sys.argv[1:4]
txt = pathlib.Path(filtro).read_text()
segs = [(float(a), float(b)) for a, b in re.findall(r"\[0:v\]trim=([\d.]+):([\d.]+)", txt)]
d = pathlib.Path(saida).parent / "partes"
d.mkdir(exist_ok=True)
lista = []
for k, (a, b) in enumerate(segs):
    p = d / f"p{k:02d}.mp4"
    dur = b - a
    vf = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,format=yuv420p"
    af = f"afade=t=in:d=0.01,afade=t=out:st={max(0, dur - 0.01):.3f}:d=0.01"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a:.3f}", "-i", bruto, "-t", f"{dur:.3f}",
                    "-vf", vf, "-af", af, "-c:v", "libx264", "-crf", "20", "-preset", "veryfast",
                    "-c:a", "aac", "-b:a", "192k", "-ar", "48000", str(p)], check=True)
    lista.append(f"file '{p.resolve()}'")
(d / "lista.txt").write_text("\n".join(lista))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(d / "lista.txt"),
                "-c", "copy", saida], check=True)
print(len(segs), "partes")
