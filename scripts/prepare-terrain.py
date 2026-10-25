"""Re-export the two preserved terrain symbols; PNG pixels are copied unchanged."""
from pathlib import Path
import hashlib, json, os, shutil, subprocess, urllib.request

root=Path(__file__).resolve().parents[1]
metadata=json.loads((root/'source-data/terrain.json').read_text(encoding='utf-8'))
jar=os.environ['FFDEC_JAR']
for asset in metadata['assets']:
    name=asset['source'].rsplit('/',1)[1]
    work=root/'.reference-cache'/'terrain-source'/asset['id']
    work.mkdir(parents=True,exist_ok=True)
    swf=work/name
    if not swf.exists():
        with urllib.request.urlopen(asset['source'],timeout=60) as response:
            swf.write_bytes(response.read())
    assert hashlib.sha256(swf.read_bytes()).hexdigest()==asset['sourceSha256']
    subprocess.run([os.environ.get('JAVA','java'),'-Djava.awt.headless=true','-Xmx512m','-jar',jar,'-ignorebackground','-selectid',str(asset['sprite']),'-export','sprite',str(work/'export'),str(swf)],check=True,timeout=120,capture_output=True)
    frames=[p for p in (work/'export').rglob('1.png') if p.parent.name.startswith('DefineSprite_'+str(asset['sprite'])+'_')]
    assert len(frames)==1, frames
    target=root/'dist'/asset['file'].removeprefix('./')
    target.parent.mkdir(parents=True,exist_ok=True)
    shutil.copyfile(frames[0],target)
    print(asset['id'],target)
