"""Gera o plano.json do teste (vídeo sobre Parkinson). Uso: python plano_parkinson_teste.py <de|-> <ate> <saida.mp4> <legenda_y>
Use "-" em <de> para o vídeo inteiro. Tempos em segundos do corte.mp4."""
import json, sys
de, ate, saida, ly = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])
Y = 250
pecas = [
 {"tipo":"gancho","args":{"linhas":["Parkinson vai quase","dobrar até 2050"]},"em":0.2,"dur":2.8,"y":Y,"som":"whoosh"},
 {"tipo":"destaque","args":{"txt":"MUITO PREVALENTE"},"em":10.0,"dur":2.0,"y":Y,"som":"swish"},
 {"tipo":"impacto","args":{"txt":"E EM 2050?"},"em":26.1,"dur":1.8,"y":Y,"som":"impact"},
 {"tipo":"destaque","args":{"txt":"IMPACTO FUNCIONAL"},"em":42.9,"dur":2.2,"y":Y,"som":"swish"},
 {"tipo":"lista","args":{"titulo":"De forma precoce","itens":["Detectar","Prevenir"],"tempos":[0.4,2.7]},"em":46.5,"dur":4.6,"y":Y,"som":"pop"},
 {"tipo":"destaque","args":{"txt":"FATORES DE RISCO"},"em":52.0,"dur":2.2,"y":Y,"som":"swish"},
 {"tipo":"impacto","args":{"txt":"POLUIÇÃO"},"em":59.0,"dur":1.8,"y":Y,"som":"impact"},
 {"tipo":"lista","args":{"titulo":"Também pesam","itens":["Hipertensão","Diabetes"],"tempos":[0.7,1.4]},"em":66.4,"dur":3.4,"y":Y,"som":"pop"},
 {"tipo":"destaque","args":{"txt":"PARKINSONISMO"},"em":72.8,"dur":2.4,"y":Y,"som":"swish"},
 {"tipo":"comentario","args":{"txt":"Quero a parte 2!","nome":"você"},"em":75.8,"dur":3.5,"y":Y,"som":"type"},
]
pl = {"base":"video1/corte.mp4","saida":saida,
      "legenda":{"palavras":"video1/palavras_corte.json","estilo":"marcador","cor":"mk","y":ly},
      "pecas":pecas, "sons":[]}
if de != "-": pl["de"]=float(de); pl["ate"]=float(ate)
json.dump(pl, open(saida.replace(".mp4",".plano.json"),"w"), ensure_ascii=False, indent=1)
