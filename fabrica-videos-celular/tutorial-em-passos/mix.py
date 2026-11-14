import json, subprocess, re
B = '/home/claude/fabrica/video2/'
SONS = '/home/claude/fabrica/sons/'
tl = json.load(open(B + 'timeline.json'))
ordem = ['0_gancho', '1_opiniao', '2_passo1', '3_passo2', '4_passo3', '5_passo4_fecho', '6_chamada']
# voz: concatena os trechos
lista = B + 'audio/lista.txt'
open(lista, 'w').write('\n'.join(f"file '{B}audio/{k}.mp3'" for k in ordem))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lista, '-ar', '48000', '-ac', '2',
                B + 'audio/voz.wav'], check=True)
# sons: nunca dois a menos de 0,6 s
sons, ult = [], -9
for em, nome, db in sorted(tl['sons']):
    if em - ult < 0.6: continue
    sons.append((max(0, em), nome, db)); ult = em
ent = ['-i', B + 'audio/voz.wav']; fil = ['[0:a]aresample=48000[a0]']; mix = ['[a0]']
for j, (em, nome, db) in enumerate(sons):
    ent += ['-i', SONS + nome + '.wav']; ms = int(em * 1000)
    fil.append(f'[{j+1}:a]aresample=48000,volume={db}dB,adelay={ms}|{ms}[s{j}]'); mix.append(f'[s{j}]')
fil.append(''.join(mix) + f'amix=inputs={len(mix)}:duration=first:normalize=0[am]')
subprocess.run(['ffmpeg', '-v', 'error', '-y', *ent, '-filter_complex', ';'.join(fil), '-map', '[am]', B + 'audio/mix.wav'], check=True)
# -14 LUFS em duas passadas
r = subprocess.run(['ffmpeg', '-hide_banner', '-i', B + 'audio/mix.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json',
                    '-f', 'null', '-'], capture_output=True, text=True)
m = json.loads(re.search(r'\{[^{}]*"input_i"[^{}]*\}', r.stderr, re.S).group(0))
ln = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
      f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', B + 'video_mudo.mp4', '-i', B + 'audio/mix.wav', '-map', '0:v', '-map', '1:a',
                '-c:v', 'copy', '-af', ln, '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart',
                B + 'parkinsonismo-por-medicamento.mp4'], check=True)
print('sons usados:', len(sons))
