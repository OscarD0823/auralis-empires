import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import * as E from '../dist/engine.js';
import {createAdvancedKingdom} from '../dist/showcase.js';
import {garrisonRoster,armyInspector} from '../dist/kingdom-ui.js';
const fresh=()=>{const s=E.createState(341);s.nextRaid=1e12;return s;};
const advance=(s,seconds)=>{for(let n=0;n<seconds*10;n++)E.step(s,.1);};
const restore=s=>E.decode(E.encode(s,100000),100000,false);
test('Las copias anteriores adquieren posiciones sin alterar bienes, tipos, vida ni niveles',()=>{
 const s=fresh();for(const u of s.army){delete u.x;delete u.y;delete u.order;}
 const before={buildings:structuredClone(s.buildings),resources:{...s.resources},army:s.army.map(({id,type,hp,level})=>({id,type,hp,level}))},loaded=restore(s);
 assert.deepEqual(loaded.buildings,before.buildings);assert.deepEqual(loaded.resources,before.resources);assert.deepEqual(loaded.army.map(({id,type,hp,level})=>({id,type,hp,level})),before.army);
 assert.ok(loaded.army.every(u=>Number.isFinite(u.x)&&Number.isFinite(u.y)));
});
test('Las tropas se mueven en la base y conservan sus posiciones al guardar',()=>{
 const s=fresh(),u=s.army[0],start={x:u.x,y:u.y};assert.ok(E.orderHome(s,[u.id],22.5,22.5).ok);E.step(s,.1);
 assert.ok(u.moving);assert.ok(Math.hypot(u.x-start.x,u.y-start.y)<1);
 advance(s,35);assert.ok(Math.hypot(u.x-22.5,u.y-22.5)<.35);assert.equal(u.order.kind,'hold');
 const loaded=restore(s);assert.equal(loaded.army[0].x,u.x);assert.equal(loaded.army[0].y,u.y);
});
test('Una formación mantiene destinos separados y no recibe órdenes fuera del reino',()=>{
 const s=fresh();assert.ok(E.orderHome(s,s.army.map(u=>u.id),22,22).ok);
 assert.equal(new Set(s.army.map(u=>u.order.x+':'+u.order.y)).size,6);
 for(const[x,y]of [[-1,4],[32,4],[4,32],[NaN,4],[4,Infinity]])assert.equal(E.orderHome(s,s.army.map(u=>u.id),x,y).ok,false);
});
test('La infantería no acepta agua ni edificios como destino; un dragón puede sobrevolarlos',()=>{
 const s=fresh(),u=s.army[0];assert.equal(E.orderHome(s,[u.id],30,20).ok,false);assert.equal(E.orderHome(s,[u.id],15,14).ok,false);
 const dragon=E.makeUnit(s,'dragon');s.army.push(dragon);E.initGarrison(s);assert.ok(E.orderHome(s,[dragon.id],30,20).ok);advance(s,20);assert.ok(Math.hypot(dragon.x-30,dragon.y-20)<.35);
});
test('Una muralla cerrada bloquea la orden; abrir un acceso habilita una ruta',()=>{
 const s=fresh(),u=s.army[0];for(let y=1;y<31;y++)s.buildings.push({id:'b'+s.serial++,type:'wall',x:21,y,level:1,hp:900,stored:0,job:null});
 assert.equal(E.orderHome(s,[u.id],23,22).ok,false);
 s.buildings.find(b=>b.type==='wall'&&b.y===22).hp=0;
 assert.ok(E.orderHome(s,[u.id],23,22).ok);advance(s,35);assert.ok(u.x>21);
});
test('Una retirada devuelve soldados a su posición previa, con su salud actual',()=>{
 const s=fresh(),u=s.army[0],home={x:u.x,y:u.y};assert.ok(E.startAttack(s,0).ok);assert.ok(E.deploy(s,u.type,3,12).ok);u.hp-=20;const hp=u.hp;
 E.finishBattle(s);assert.equal(s.army.length,6);assert.equal(u.hp,hp);assert.equal(u.x,home.x);assert.equal(u.y,home.y);assert.equal(u.homePosition,undefined);assert.ok(restore(s));
});
test('La orden de regreso sobrevive a una partida guardada en plena batalla',()=>{
 const s=fresh(),id=s.army[0].id,home={x:s.army[0].x,y:s.army[0].y};E.startAttack(s,0);E.deploy(s,'swordsman',3,12);const loaded=restore(s);E.finishBattle(loaded);const u=loaded.army.find(u=>u.id===id);assert.equal(u.x,home.x);assert.equal(u.y,home.y);
});
test('Las órdenes y posiciones dañadas se rechazan sin sobrescribir una copia',()=>{
 for(const change of[u=>u.x=-5,u=>u.y=999,u=>u.order={kind:'move',x:Infinity,y:8},u=>u.order={kind:'cheat',x:8,y:8},u=>u.homePosition={x:80,y:4}]){const s=fresh();change(s.army[0]);assert.throws(()=>restore(s),/guarnición|regreso/);}
});
test('Las sanadoras obedecen órdenes de movimiento durante el combate',()=>{
 const s=fresh(),healer=E.makeUnit(s,'healer');s.army.push(healer);E.startAttack(s,0);E.deploy(s,'healer',3,12);assert.ok(E.order(s,[healer.id],6,16,'move').ok);const old={x:healer.x,y:healer.y};E.tickBattle(s,.1);assert.ok(healer.moving);assert.ok(Math.hypot(healer.x-old.x,healer.y-old.y)>0);
});
test('La curación no revive bajas causadas antes en el mismo turno de combate',()=>{
 const s=fresh();E.startAttack(s,0);const enemy=E.makeUnit(s,'orc'),victim=E.makeUnit(s,'swordsman'),healer=E.makeUnit(s,'healer');
 Object.assign(enemy,{side:'enemy',x:12.5,y:12,cooldown:0,order:{kind:'hold',x:12.5,y:12}});Object.assign(victim,{side:'player',x:12,y:12,hp:1});Object.assign(healer,{side:'player',x:13,y:12});
 s.battle.units=[enemy,victim,healer];E.tickBattle(s,.1);assert.equal(victim.hp,0);assert.equal(s.stats.lost,1);
});
test('Un enemigo caído no puede volver a contar como baja durante el mismo turno',()=>{
 const s=fresh();E.startAttack(s,0);const first=E.makeUnit(s,'swordsman'),second=E.makeUnit(s,'swordsman'),enemy=E.makeUnit(s,'orc');
 Object.assign(first,{side:'player',x:12,y:12,order:{kind:'hold',x:12,y:12}});Object.assign(second,{side:'player',x:12.6,y:12,order:{kind:'hold',x:12.6,y:12}});Object.assign(enemy,{side:'enemy',x:12.3,y:13,hp:1});
 s.battle.units=[first,second,enemy];E.tickBattle(s,.1);assert.equal(enemy.hp,0);assert.equal(s.stats.kills,1);
});
test('El reino avanzado contiene todos los edificios y tropas y es independiente del inicio',()=>{
 const real=fresh(),before=E.encode(real,0),demo=createAdvancedKingdom();assert.equal(E.encode(real,0),before);
 assert.deepEqual(new Set(demo.army.map(u=>u.type)),new Set(Object.keys(E.UNITS)));
 assert.deepEqual(new Set(demo.buildings.map(b=>b.type)),new Set(Object.keys(E.BUILDINGS)));
 assert.ok(demo.army.every(u=>!demo.buildings.some(b=>u.x>=b.x&&u.x<b.x+E.BUILDINGS[b.type].size&&u.y>=b.y&&u.y<b.y+E.BUILDINGS[b.type].size)));
 assert.ok(restore(demo));
});
test('Los retratos agrupan unidades reales y su inspector permite detenerlas',()=>{
 const s=fresh(),h={img:t=>'<img alt="'+t+'">',esc:String,fmt:String,icon:()=>''};const html=garrisonRoster(s,[s.army[0].id],h);
 assert.equal((html.match(/data-action="roster-select"/g)||[]).length,1);assert.match(html,/Seleccionar 6/);assert.match(html,/data-type="swordsman"/);
 assert.match(armyInspector(s,s.army.map(u=>u.id),h),/data-action="home-hold"/);
});
test('Las texturas son las exportaciones identificadas de Social Empires',()=>{
 const meta=JSON.parse(fs.readFileSync(new URL('../source-data/terrain.json',import.meta.url)));assert.equal(meta.assets.length,2);
 for(const a of meta.assets){assert.match(a.source,/socialemperors\/[a-f0-9]{40}\/assets\/buildingsprites\//);const data=fs.readFileSync(new URL('../dist/'+a.file.replace(/^\.\//,''),import.meta.url));assert.equal(crypto.createHash('sha256').update(data).digest('hex'),a.sha256);assert.equal(data.readUInt32BE(16),a.id==='grass'?2160:2164);}
 const sw=fs.readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8'),files=JSON.parse(sw.match(/FILES=(\[.*?\]);/)[1]),core=JSON.parse(sw.match(/CORE=(\[.*?\]),pathOf/)[1]);assert.ok(core.length<files.length);assert.ok(core.includes('./classic/terrain/grass.png'));assert.ok(!core.includes('./classic/739.webp'));
});
