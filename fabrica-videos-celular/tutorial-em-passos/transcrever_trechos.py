import json, glob, os, subprocess, numpy as np
def dec(f):
    b=subprocess.run(['ffmpeg','-v','error','-i',f,'-f','s16le','-ac','1','-ar','16000','-'],capture_output=True,check=True).stdout
    return np.frombuffer(b,np.int16).astype(np.float32)/32768
from faster_whisper import WhisperModel
m = WhisperModel(os.path.expanduser('~/.cache/fabrica-whisper'), device='cpu', compute_type='int8')
out = {}
for f in sorted(glob.glob('/home/claude/fabrica/video2/audio/*.mp3')):
    segs, _ = m.transcribe(dec(f), language='pt', word_timestamps=True, vad_filter=False)
    ws = [dict(w=w.word.strip(), s=round(w.start, 3), e=round(w.end, 3)) for s in segs for w in s.words]
    out[os.path.basename(f)] = ws
    print(os.path.basename(f), ' '.join(f"{x['w']}@{x['s']:.1f}" for x in ws))
json.dump(out, open('/home/claude/fabrica/video2/palavras.json', 'w'), ensure_ascii=False)
