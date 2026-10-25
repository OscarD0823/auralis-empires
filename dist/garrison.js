import {UNITS,BUILDINGS,SIZE} from './catalog.js';
import {createCombatNavigation,findGridPath} from './navigation.js';

// Grids and route queues are runtime caches, never part of the save format.
export function createGarrison({groundAt,terrain}){
 const navigation=createCombatNavigation({size:SIZE,terrain:(x,y,seed,b)=>terrain(x,y,seed),buildings:BUILDINGS,units:UNITS});
 const fields=new WeakMap();
 function init(s){
  let field=fields.get(s);if(!field){field={kind:'home',seed:s.seed,buildings:s.buildings,units:s.army};fields.set(s,field);}
  field.buildings=s.buildings;field.units=s.army;field.seed=s.seed;
  for(const[i,u]of s.army.entries())if(!Number.isFinite(u.x)||!Number.isFinite(u.y)){u.x=8.5+(i%5)*.9;u.y=19+Math.floor(i/5)*.9;u.order=null;u.moving=false;}
  navigation.prepare(field,s.cleared);return field;
 }
 function order(s,ids,x,y){
  if(s.battle||!Number.isFinite(x)||!Number.isFinite(y)||x<1||y<1||x>=SIZE-1||y>=SIZE-1)return{ok:false,message:'Marca un destino dentro del reino.'};
  const selected=s.army.filter(u=>u.hp>0&&ids.includes(u.id));if(!selected.length)return{ok:false,message:'Selecciona soldados de tu guarnición.'};
  const field=init(s),grid=navigation.prepare(field,s.cleared).grid;let count=0;
  for(const[i,u]of selected.entries()){
   const target={kind:'move',x:Math.min(SIZE-1.1,x+(i%4)*.65),y:Math.min(SIZE-1.1,y+Math.floor(i/4)*.65)};
   if(!UNITS[u.type].flying&&(navigation.blocked(field,target.x,target.y,u)||!findGridPath(grid,u,[target])))continue;
   u.order=target;count++;
  }
  return{ok:count>0,message:count?'Movimiento ordenado a '+count+' tropas.':'No hay una ruta transitable hasta ese destino.'};
 }
 function tick(s,dt){const field=init(s);for(const u of s.army){u.moving=false;if(u.order?.kind==='move'){u.moving=navigation.move(field,u,u.order,UNITS[u.type].speed,dt);if(Math.hypot(u.x-u.order.x,u.y-u.order.y)<.3)u.order={kind:'hold',x:u.x,y:u.y};}}}
 function validate(s){const finite=n=>Number.isFinite(n)&&n>=0&&n<SIZE;for(const u of s.army){if((u.x!==undefined&&!finite(u.x))||(u.y!==undefined&&!finite(u.y))||(u.order&&(!['move','hold'].includes(u.order.kind)||!finite(u.order.x)||!finite(u.order.y))))throw Error('Posición u orden de guarnición no válida.');}for(const u of [...s.army,...(s.battle?[...s.battle.units,...s.battle.reserve]:[])])if(u.homePosition&&(!finite(u.homePosition.x)||!finite(u.homePosition.y)))throw Error('Posición de regreso no válida.');}
 return{init,order,tick,validate,navigation};
}
