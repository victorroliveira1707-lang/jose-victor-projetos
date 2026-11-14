# Apatia: carrossel animado

## Arquivos

- `carrossel/apatia-01.mp4` a `apatia-10.mp4`: os dez quadros animados, 1080x1350 (4:5), 30 fps, sem áudio. Duram de 11 a 18 s conforme a quantidade de texto: a animação termina e o quadro fica parado para leitura. Suba os dez como carrossel de vídeos.
- `carrossel/apatia-01.png` a `apatia-10.png`: o quadro final de cada animação, para quem preferir o carrossel estático ou precisar de capa.
- `apatia-completo-1080x1350.mp4`: os dez quadros em sequência (141 s, ou 2 min 21 s), com faixa de áudio em silêncio. Serve como vídeo único; o áudio se escolhe no Instagram.
- `referencias.html`: página com as sete referências completas, publicada em https://claude.ai/artifact/6RgPusxaEnQek2Bk1MGE1y. É para ela que aponta o "link da bio" do último quadro. A página nasce privada: é preciso abri-la e liberar o acesso no menu Compartilhar antes de colocar o link na bio.
- `src/` e `render.sh`: fonte em Remotion. `npm install` e depois `./render.sh all` geram tudo de novo depois de editar um texto (`./render.sh probe` gera só os PNG). O ritmo se ajusta em `src/kit.tsx`: `SLOW` (velocidade da animação) e `DUR` (segundos de cada quadro, repetidos em `render.sh`).

Ordem: 1 gancho, 2 a palavra, 3 não é seletiva, 4 apatia e depressão, 5 Huntington, 6 outras doenças, 7 o peso, 8 o que ajuda, 9 antidepressivo, 10 fecho. Cada quadro leva só autor e ano no rodapé; a lista completa fica na página de referências.

## Legenda sugerida

"Ele não quer mais nada." "Ela ficou acomodada."

Quem convive com doença de Huntington, Parkinson, paralisia supranuclear progressiva ou demência com corpos de Lewy conhece essas frases. Muitas vezes o nome do que está acontecendo é apatia: menos interesse, menos espontaneidade, menos motivação, menos iniciativa. É sintoma da doença, não preguiça nem má vontade.

Para a família: dar nome ajuda. Rotina, atividades com programa e menos estímulo ao mesmo tempo fazem parte do manejo. Conte ao médico o que mudou no dia a dia.

Sobre remédios: alguns antidepressivos já foram associados a mais apatia em estudos na doença de Parkinson. Isso é assunto para a consulta, não motivo para parar ou trocar remédio por conta própria. Este post não faz diagnóstico.

Para o colega: apatia não é depressão, embora as duas andem juntas. O sofrimento subjetivo ajuda a separar, a anedonia não. Procure as duas, reveja sedativos e não espere muito da receita.

Conteúdo educativo. Não substitui consulta médica nem autoriza mudar medicação por conta própria.

Referências completas no link da bio.

#apatia #doencadehuntington #parkinson #neurologia #disturbiosdomovimento #cuidadores #neuromov

## De onde vem cada afirmação

Todo o conteúdo saiu dos módulos do NeuroMov (Huntington, Psiquiátrico do Parkinson e PSP) e dos artigos que os sustentam. Em 2026-11-14 foi feita esta conferência:

- **Lido no texto integral** (PubMed Central, PMC6618900): Bachoud-Lévi AC et al. International Guidelines for the Treatment of Huntington's Disease. Front Neurol 2019;10:710. https://doi.org/10.3389/fneur.2019.00710
- **Lido no texto integral** (PubMed Central, PMC8835377): Miller DS et al. Diagnostic criteria for apathy in neurocognitive disorders. Alzheimers Dement 2021. https://doi.org/10.1002/alz.12358 (artigo de fora do app, acrescentado para o quadro 3)
- **Lido só no resumo** (PubMed, PMID 42596621): Kulisevsky J et al. Apathy in Lewy Body Disorders: A Position Paper. Mov Disord 2026. https://doi.org/10.1002/mds.70464
- **Só a referência conferida** (PubMed, PMID 28739866; o resumo não trata de apatia): Timmer MHM et al. Pract Neurol 2017;17(5):359-368. https://doi.org/10.1136/practneurol-2017-001650
- **Não reconferidos aqui** (sem acesso ao texto nesta sessão; valem as marcações de verificação do próprio app): Buoli 2015, Goldman 2016, Hershey e Lichter (MedLink 2026) e os números do texto integral de Kulisevsky 2026.

| Quadro | Afirmação | Situação |
| --- | --- | --- |
| 1 | "Não é preguiça. Não é má vontade." | Redação editorial. O módulo de Huntington diz que a família costuma ler a apatia como preguiça; a frase não está na diretriz |
| 2 | "Redução quantificável do comportamento dirigido a objetivo"; menos interesse, espontaneidade, motivação e iniciativa | Conferido no texto integral de Bachoud-Lévi 2019 (definição de Levy e Czernecki) |
| 2 | Na doença de Huntington soma-se o embotamento emocional, com retraimento social | Conferido no texto integral de Bachoud-Lévi 2019 |
| 4 | Sofrimento subjetivo alto na depressão, baixo ou ausente na apatia; anedonia nas duas | Módulo Psiquiátrico, atribuído a Timmer 2017; não reconferido aqui |
| 4 | Humor embotado, não triste | Módulo Psiquiátrico, atribuído a Goldman 2016; não reconferido aqui. "Humor triste" na coluna da depressão é contraponto editorial |
| 4 | Apatia e depressão podem vir juntas | Módulo Psiquiátrico, atribuído a Buoli 2015; não reconferido aqui |
| 5 | Sintoma psicológico e comportamental mais frequente da doença de Huntington, sobretudo nas fases média e avançada; reduz as atividades diárias; fonte de conflito na família | Conferido no texto integral de Bachoud-Lévi 2019 |
| 5 | Apático de manhã, irritável à tarde; duas faces da mesma moeda | Conferido no texto integral de Bachoud-Lévi 2019 |
| 6 | 56% na PSP, 44% na DCL, 35% no Parkinson | Módulo PSP, atribuído a Hershey e Lichter (MedLink 2026); não reconferido aqui |
| 6 | 55% a 66% na DCL | Módulo Psiquiátrico, atribuído a Kulisevsky 2026 (texto integral); não reconferido aqui |
| 6 | 20% a 60% no Parkinson | Módulo Psiquiátrico, atribuído a Timmer 2017; não reconferido aqui |
| 7 | Pior qualidade de vida, declínio cognitivo mais rápido, mais sobrecarga de quem cuida; pouco reconhecida e pouco tratada; entre os sintomas não motores mais frequentes e incapacitantes | Conferido no resumo de Kulisevsky 2026 (doença de Parkinson e DCL) |
| 8 | Explicar à família; rotina, programa estruturado e estimulação cognitiva personalizada; apatia como resposta ao excesso de estímulo; depressão pode aumentar a apatia; sedativos podem aumentar a apatia | Conferido no texto integral de Bachoud-Lévi 2019 (doença de Huntington) |
| 8 | "O manejo começa em casa, não na receita." | Redação editorial, apoiada no módulo de Huntington ("a farmacologia ajuda pouco") |
| 8 | Nenhum tratamento definitivamente eficaz no Parkinson e na DCL | Conferido no resumo de Kulisevsky 2026 |
| 10 | "Não é escolha. É sintoma." | Redação editorial |
| 10 | Dar nome alivia a culpa e diminui o atrito | Pérola do módulo de Huntington. A diretriz diz apenas que é importante explicar a apatia à família |
| 3 | Pelo menos um sintoma em duas de três dimensões (iniciativa, interesse, expressão emocional); persistente ou recorrente por no mínimo 4 semanas; mudança em relação ao comportamento habitual; prejuízo pessoal, social ou ocupacional | Conferido no texto integral de Miller 2021. Os critérios valem para pessoas com síndrome de comprometimento cognitivo ou demência; o quadro diz isso na fonte |
| 3 | Menos iniciativa em passatempos, tarefas de casa, autocuidado, conversa, trabalho e atividades sociais | Conferido no texto integral de Miller 2021 (dimensão B1) |
| 3 | "Apatia não é desinteresse por uma coisa só"; "pra isso eu sou apático" | Redação editorial. A palavra "seletiva" não aparece nos critérios; a leitura é que eles exigem mudança persistente em mais de uma dimensão |
| 9 | ISRS, mas não outros antidepressivos, associados a mais apatia na doença de Parkinson | Módulo Psiquiátrico, atribuído a Buoli 2015 (um estudo) e a Kulisevsky 2026 (estudos observacionais); não reconferido aqui |
| 9 | "Associação é um sinal para investigar. Não prova que o remédio seja a causa." | Leitura metodológica: os dados citados no módulo são observacionais |
| 9 | A depressão pode aumentar a apatia; na suspeita de depressão, tentar um ISRS | Conferido no texto integral de Bachoud-Lévi 2019 (doença de Huntington) |
| 9 | Se a apatia surge ou piora depois de iniciar ou aumentar o ISRS, considerar o próprio ISRS | Módulo Psiquiátrico (nível 2), atribuído a Kulisevsky 2026; não reconferido aqui |
| 9 | Não parar nem trocar remédio por conta própria; o post não faz diagnóstico | Aviso de segurança, redação editorial |

Uma diferença em relação ao app: a referência de Timmer aparece no módulo como "2017;0:1-10 (publicado online)"; aqui foi usada a paginação definitiva do PubMed, 17(5):359-368.

Ficou de fora, de propósito: a pior sobrevida da PSP com escores altos de apatia, os ensaios de rivastigmina, piribedil, rotigotina e safinamida, e a apatia após estimulação cerebral profunda.
