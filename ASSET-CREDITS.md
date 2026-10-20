# Referencias y procedencia gráfica

Social Empires: https://github.com/AcidCaos/socialemperors/tree/f642e0bae5a341f48e73b58f2e6d33a8436992c1

Se extrajeron 82 recursos y 2077 fotogramas de sus archivos SWF con JPEXS FFDec 26.4.0. Los atlas WebP mantienen transparencia y secuencias de marcha/ataque por dirección. No contienen un fondo rectangular añadido. `dist/classic/atlas.json` identifica URL, nombre, ID, fotogramas y familia de cada recurso.

El código del proyecto de preservación está publicado bajo GPL-3.0. Se conserva su licencia en LICENSE. El arte de Social Empires pertenece a Social Point y a sus titulares originales; la licencia del código no se presenta como una cesión de las marcas o del arte comercial. Esta adaptación no está afiliada al juego original. El aviso MIT del código previo de Auralis se conserva en LICENSE-AURALIS-MIT.

La versión web usa un motor Canvas propio; no distribuye ni requiere un reproductor Flash. La economía, las 12 bases de IA, las alianzas y la progresión de 10 niveles son la adaptación Auralis. No es una reproducción completa de la lógica, el multijugador, el catálogo o los eventos del cliente original.

## Reconstrucción

Python 3 con Pillow, Java 17+ y [JPEXS FFDec](https://github.com/jindrapetrik/jpexs-decompiler/releases/tag/version26.4.0). Define `FFDEC_JAR` con la ruta a ffdec.jar; opcionalmente `JAVA` con el ejecutable. Ejecuta `python scripts/prepare-sprites.py` y `node scripts/package.mjs`. Las fuentes se descargan de la revisión fija de arriba, se guardan en .reference-cache y no se ejecuta su ActionScript. Los IDs y parámetros seleccionados están en source-data/.

La versión 0.3 añade PICAR para los civiles y BARRIL para los trabajadores de Wars, extraídos de las mismas películas. progression-data.js deriva los umbrales y requisitos de la configuración de esa revisión.
