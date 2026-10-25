# Primer avance del reino · 0.4.0

Esta entrega mejora la presentación y el control de Auralis Empires sobre los gráficos de Social Empires ya preservados. Conserva los 18 tipos de edificio, 24 tipos militares, las doce bases de campaña, la economía Auralis y sus dificultades. No se presenta como el cliente Flash original completo.

## Terreno e interfaz

El suelo y el mar proceden de `terreno.swf` y `terrenomar2.swf` del repositorio de preservación, en la revisión fija `f642e0bae5a341f48e73b58f2e6d33a8436992c1`. Se exportaron sus símbolos 4 y 8, fotograma 1, sin modificar los píxeles PNG resultantes. [Metadatos, fuentes y SHA-256](../source-data/terrain.json). `scripts/prepare-terrain.py` reproduce la exportación con FFDec y la variable `FFDEC_JAR`.

La costa corresponde al terreno transitable de la simulación: agua desde x = 29 o y = 30. El cambio gráfico no desplaza recursos, edificios ni límites de una partida existente. El relieve visual, edificios, personajes y árboles conservan la perspectiva isométrica y el orden de profundidad.

La interfaz utiliza madera, pergamino, botones azules y [doce iconos SVG propios](../dist/kingdom/icons/). Los recursos y la experiencia quedan en la cabecera; la guarnición y las seis secciones se agrupan abajo. `scripts/prepare-kingdom-icons.mjs` reproduce los iconos. Construcción y mejora conservan las imágenes originales por etapa. El título del edificio principal se unifica como Castillo real.

## Guarnición y combate

Los retratos inferiores seleccionan unidades reales. Se puede seleccionar todo el ejército o arrastrar un recuadro, marcar un destino y detener la selección desde su ficha. Una orden de grupo distribuye destinos distintos. La infantería busca rutas alrededor de edificios, árboles, rocas y agua; las criaturas voladoras pueden sobrevolarlos. Las órdenes terrestres sin ruta se rechazan. Una obra o una destrucción invalida la cuadrícula y obliga a recalcular las rutas.

Las posiciones válidas y las órdenes se guardan. Las copias anteriores que carecen de posiciones adquieren una formación inicial, sin cambiar IDs, tipos, niveles, salud o materiales. Los soldados que entran en combate recuerdan su posición de origen y regresan a ella al retirarse. Una batalla guardada conserva ese regreso.

Se corrigen dos comportamientos del apoyo: las sanadoras obedecen órdenes de movimiento y no reviven una baja ocurrida antes en el mismo turno. La separación entre aliados respeta los obstáculos. La franja azul de despliegue representa ahora toda el área admitida por la simulación.

## Reino de demostración

El botón **Ver reino avanzado** abre un escenario aislado con los 18 tipos de edificio, ocho viviendas, defensas, accesos y las 24 tropas de grado 3. **Volver a mi reino** restaura la partida principal. La demostración no se guarda sobre ella y no admite reemplazar o importar la partida principal mientras está activa.

El escenario ilustra las variantes avanzadas que conserva el archivo; no representa una cuenta histórica de otro jugador ni concede sus bienes a la partida real.

## Rendimiento y descarga

El terreno se dibuja en una caché del tamaño de la pantalla. La lista de naturaleza se recalcula cuando cambian el terreno o los edificios. El movimiento de tropas no repinta la cuadrícula celda por celda. Las máscaras alfa de selección se reutilizan con un límite de 128 entradas.

`scripts/split-animations.py` separa las 25 películas de actores en 255 archivos de dirección/acción. La copia a WebP es sin pérdida adicional y conserva las longitudes de las secuencias; los archivos monolíticos permanecen como referencia. El renderizador carga el clip utilizado y aplica una caché con objetivo de 96 MiB. Las películas completas del catálogo suman unos 324 MiB decodificadas; en la vista de prueba del reino avanzado se observaron 55 MiB residentes. Esa medida corresponde a esa cámara y escena, no a una garantía para cualquier combate.

El service worker instala 51 recursos esenciales y descarga el resto bajo demanda. Ajustes permite **Descargar juego sin conexión** para precargar los 460 recursos de esta entrega. La clave `auralis-empires-campaign-v1` se conserva; la actualización renueva los recursos gráficos sin borrar el guardado.

## Validación y alcance siguiente

Pasaron 61 pruebas de simulación y guardado. La comprobación estática verifica archivos, módulos, fuentes preservadas, 2.077 fotogramas, clips y caché. Se compararon 635 fotogramas extremos de clips con sus hojas de origen: alfa y píxeles visibles coinciden. Se revisaron escritorio, pantalla de 390 × 844, menús, selección, órdenes y regreso de la demostración.

Quedan para próximas entregas el catálogo y los capítulos completos del original, nuevas civilizaciones propias y una ampliación del mundo. El multijugador y los anuncios recompensados continúan pendientes.
