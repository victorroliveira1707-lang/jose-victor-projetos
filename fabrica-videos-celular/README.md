# Fábrica no celular: teste de edição de vídeo com o Claude

Registro do primeiro teste do fluxo "Fábrica no celular" (curso da Ninja Academy): editar um vídeo
curto (Reels) só pelo app do Claude no celular, com o trabalho feito na nuvem.

> O pacote do curso (`celular.zip`: roteiro, ferramentas, fontes, peças e sons) **não está aqui**.
> A licença dele é de uso pessoal e proíbe compartilhar. O vídeo original também não foi enviado.
> Aqui ficam só o contexto, as decisões e os scripts de apoio escritos durante o teste.

## O fluxo (resumo)

1. Anexar o `celular.zip` e o vídeo numa conversa e colar a mensagem padrão do curso.
2. O Claude descompacta, instala as ferramentas (ffmpeg, faster-whisper, OpenCV, Pillow) e transcreve.
3. **Primeira aprovação: corte.** Tira pausas acima de 0,25 s, "éé/hum" e frases repetidas; entrega em 1080x1920, 30 fps.
4. **Segunda aprovação: estilo.** Legenda, gancho (3 primeiros segundos), cor de destaque, quantidade de peças animadas.
5. **Amostra de 8 a 10 s.** Só depois dela, o vídeo inteiro (volume final em -14 LUFS).

## O que aconteceu neste teste (14/11/2026)

- **Vídeo:** 87,8 s, gravado em pé (1904x1080 com rotação 90), 30 fps, tema: doença de Parkinson
  (prevalência, projeção para 2050, impacto funcional, fatores de risco, parkinsonismo).
- **Anexar foi o mais difícil.** Em três tentativas chegaram só o ZIP e a aula. O vídeo só chegou quando
  foi escolhido pela galeria (Fotos), e não pela pasta de Downloads.
- **Transcrição:** cerca de 20 s, com o modelo Whisper small baixado pelo GitHub.
- **Erros de transcrição corrigidos antes da legenda:** "pertenção" → hipertensão;
  "parque-sonismo(s)" → parkinsonismo(s); "14 ,1" / "24 ,5" → 14,1 / 24,5.
- **O corte estourou a memória (OOM, mais de 6 GB).** O `cortar` do pacote monta um filtro único com
  todos os trechos e, com vídeo de celular em alta resolução, o ffmpeg foi morto. A solução foi
  `scripts/corte_partes.py`: codifica cada trecho separado e junta sem recodificar. Resultado:
  12 pausas tiradas, de 87,8 s para 79,4 s.
- **Realinhamento das palavras:** cada parte arredonda alguns milissegundos (até 27 ms). Os tempos
  da legenda foram recalculados com a duração real de cada parte, para a voz não escorregar no fim.
- **Verificação da fala** (termos que a Meta barra em anúncio): só "milhão", que aqui é contagem de
  pacientes, não valor em dinheiro.

## Estilo escolhido ("você decide tudo")

- Legenda **marcador** (caixa alta, palavra falada em amarelo), na altura do peito (y 1290), abaixo
  da barba. O ponto sugerido pela ferramenta de rosto (y 476) ficaria em cima da cabeça.
- Gancho em tarjas: "Parkinson vai quase / dobrar até 2050".
- Peças de texto no alto da tela (y 250), longe dos olhos e da boca, uma a cada 6 a 8 s:
  MUITO PREVALENTE, E EM 2050?, IMPACTO FUNCIONAL, Detectar / Prevenir, FATORES DE RISCO,
  POLUIÇÃO, Hipertensão / Diabetes, PARKINSONISMO.
- Final com comentário "Quero a parte 2!", porque a fala termina no meio da explicação sobre
  parkinsonismo.
- Os números de prevalência (14,1 e 24,5 milhões) ficaram só na legenda, sem peça em destaque, até a
  fonte ser conferida. Pelo que lembro, o estudo do BMJ de 2025 com dados do GBD fala em cerca de
  11,8 milhões em 2021 e 25,2 milhões em 2050. **Não verificado: conferir antes de publicar.**

O teste parou na amostra (0 a 11,5 s), de propósito. O vídeo inteiro não foi montado.

## Lições para os próximos vídeos

- Anexar o vídeo **pela galeria**. Se não aparecer, salvar em Arquivos primeiro.
- Vídeo acima de uns 60 s: já usar o corte em partes.
- Fechar a ideia antes de parar de gravar.
- Áudio em lugar silencioso ajuda a transcrição e, se for o caso, um futuro clone de voz.
- Conferir números e fontes antes de gravar: em conteúdo médico, o número fica na legenda.

## Scripts

| Arquivo | O que faz |
|---|---|
| `scripts/corte_partes.py` | Corte em partes quando o `cortar` do pacote estoura a memória |
| `scripts/plano_parkinson_teste.py` | Gera o `plano.json` usado neste teste (peças, tempos e posições) |

Os dois dependem das ferramentas do pacote do curso (`receitas.py`, `ferramentas.py`), que não estão neste repositório.
