#!/usr/bin/env bash
# Gera os 10 quadros animados (MP4 1080x1350), as 10 capas estáticas (PNG) e o vídeo completo.
# Uso: ./render.sh [probe|all]   (probe = só as capas, para conferir o layout)
set -euo pipefail
cd "$(dirname "$0")"
BROWSER=${BROWSER:-$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell 2>/dev/null | head -1)}
OPT=(--log=error ${BROWSER:+--browser-executable="$BROWSER"})
mkdir -p carrossel
DUR=(11 13 16 14 14 13 13 17 18 12)   # segundos por quadro; manter igual a DUR em src/kit.tsx
for k in "${!DUR[@]}"; do
  i=$(printf "%02d" $((k + 1)))
  npx remotion still src/index.ts "apatia-$i" "carrossel/apatia-$i.png" --frame=$((DUR[k] * 30 - 1)) "${OPT[@]}"
  [ "${1:-all}" = probe ] || npx remotion render src/index.ts "apatia-$i" "carrossel/apatia-$i.mp4" --crf=17 "${OPT[@]}"
done
[ "${1:-all}" = probe ] && exit 0
# vídeo completo: os oito quadros em sequência, com faixa de áudio em silêncio (o áudio se escolhe no Instagram)
printf "file 'carrossel/apatia-%s.mp4'\n" 01 02 03 04 05 06 07 08 09 10 > .lista.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i .lista.txt -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 \
  -shortest -c:v copy -c:a aac -b:a 128k -movflags +faststart apatia-completo-1080x1350.mp4
rm .lista.txt
