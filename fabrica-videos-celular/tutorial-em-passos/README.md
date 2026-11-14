# Tutorial em passos com clone de IA (ElevenLabs)

Pipeline usado no vídeo "Antes de falar em Parkinson, olha a caixa de medicamentos" (14/11/2026):
roteiro tirado do NeuroMov, voz clonada e avatar no ElevenLabs, motion e montagem em Python (Pillow + ffmpeg).

| Arquivo | O que faz |
|---|---|
| `tutorial-em-passos.md` | Folha de estilo (12 regras) e identidade B aprovada |
| `parkinsonismo-por-medicamento.md` | Roteiro cena a cena |
| `cenas.py` | Desenha cada cena em 1080x1920 (gancho, opinião, tela dividida, passos, fecho, chamada) |
| `transcrever_trechos.py` | Tempo de cada palavra dos áudios (faster-whisper, áudio decodificado pelo ffmpeg) |
| `render.py` | Gera o vídeo mudo quadro a quadro, sincronizando objetos e legenda com a fala |
| `mix.py` | Junta voz, sons (whoosh, click, pop, type) e normaliza em -14 LUFS |

Fontes: Bebas Neue e Montserrat (Google Fonts, OFL). Os sons e a Anton vêm do pacote do curso,
que não está neste repositório (licença de uso pessoal).

## Ordem

1. Roteiro aprovado → voz por cena no ElevenLabs (voz clonada, modelo eleven_v4, 1 versão por cena).
2. Avatar só nas cenas de rosto que valem o custo (OmniHuman 1.5, foto + áudio).
3. Baixar áudios e vídeos (domínio `elevenlabsusercontent.com` liberado no Claude).
4. `transcrever_trechos.py` → `palavras.json`; corrigir termos na legenda.
5. Storyboard (um quadro por cena) → aprovação.
6. `render.py` (≈7 min para 84 s) → `mix.py`.

Custos observados (plano Starter, 40 mil créditos/mês): voz ≈ 1.350 créditos para 84 s;
avatar OmniHuman 1080p ≈ 950 créditos por segundo (11 s = 10.704; 7 s = 6.748).
