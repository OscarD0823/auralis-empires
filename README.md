# Auralis Empires

Juego de estrategia medieval y fantástica del ecosistema Auralis, inspirado en la construcción de reinos y ejércitos de Social Empires, con mejoras progresivas de edificios al estilo de Clash of Clans. Implementación web original, sin Flash.

[Jugar en GitHub Pages](https://oscard0823.github.io/auralis-empires/) · [Auralis Wars](https://oscard0823.github.io/auralis-wars/) · [Ecosistema Auralis](https://oscard0823.github.io/Pagina-Principal/)

## Primera versión 0.1

- Base tridimensional con castillo, viviendas, minas, aserradero, granjas, cantera y almacenes. 18 edificios funcionales con diez niveles, constructores, costes, tiempos de obra y selección de emplazamiento.
- Castillo que limita las mejoras y habilita instalaciones. La etapa completa ofrece un 20% de descuento para el siguiente nivel del castillo. Murallas, torres, balistas, hospital, laboratorio y embajada tienen funciones jugables.
- 24 tropas y criaturas: espadachines, lanceros, arqueras, ballesteros, sanadores, caballería, catapultas, elfos, enanos, orcos, magos, paladines, gólems, grifos, guivernos, fénix y dragones. Entrenamiento por edificio, población máxima y cinco grados de investigación por unidad.
- Doce bases de campaña con reconocimiento, despliegue en zona propia, órdenes de movimiento/ataque, selección múltiple y grupos. Daño y curación reales; armaduras, asedio, ataques de área y criaturas aéreas. Las bajas son permanentes; reservas y supervivientes regresan al retirarse.
- Incursiones de IA contra el reino, defensas automáticas, daños persistentes y reconstrucción. Tres dificultades, ocho encargos y tres facciones de IA con pactos de suministros.
- Producción acumulada que se recoge manualmente, capacidad de almacenes, botín y estrellas. Repetir una conquista entrega el 25% del botín.
- Partida local independiente, exportación/importación validada y hasta ocho horas de producción/colas mientras el juego está cerrado. Las batallas se reanudan al volver. Página instalable y disponible sin conexión después de descargar sus recursos.

Es una primera versión jugable contra IA local. No reproduce el catálogo completo ni los eventos del original. GitHub Pages aloja archivos estáticos; no hay cuentas, visitas de amigos ni multijugador de servidor.

## Desarrollo y validación

Node.js 22 o posterior, sin dependencias npm para el motor ni el servidor local.

```sh
npm test
npm run check
npm run dev
```

`PORT` cambia el puerto local. `node scripts/package.mjs` actualiza el manifiesto y la lista sin conexión. `scripts/qa-ui.mjs URL` y `scripts/qa-models.mjs URL` verifican la interfaz y los modelos en el entorno de Playwright. GitHub Actions publica `dist/` después de las pruebas.

El motor está en `dist/engine.js`, el catálogo en `dist/catalog.js`, la identidad en `dist/config.js`, la interfaz en `dist/ui.js` y el renderizado en `dist/scene.js`. Este repositorio contiene su propia copia y evoluciona de forma independiente de Auralis Wars y Frontier.

## Referencias y créditos

Referencias: [proyecto de preservación de Social Empires](https://github.com/AcidCaos/socialemperors), [guía pública de Social Wars](https://wars.fbgamesweb.com/como-jugar) y progresión de edificios de Clash of Clans. Se creó un motor propio para navegador; no se copió código GPL, el cliente Flash ni archivos gráficos o logotipos comerciales.

La geometría y parte del renderizado original provienen de Auralis Frontier, bajo MIT. Se incluyen personajes y materiales CC0 de Quaternius y Three.js MIT, con [créditos y procedencia](ASSET-CREDITS.md). Código bajo [licencia MIT](LICENSE).

Las pruebas del motor incluyen 34 casos. La comprobación gráfica recorre 180 modelos de edificio y 48 variantes de tropa, además de controles y guardado en móvil y escritorio. Para ejecutar las pruebas de navegador en otro entorno, instala Playwright (`npm install --no-save playwright` y `npx playwright install chromium`); `PLAYWRIGHT_MODULE` y `PLAYWRIGHT_CHANNEL` permiten usar un runtime existente.
