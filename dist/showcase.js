import * as E from './engine.js';
// A separate playable preview. The UI never serializes it over the main save.
export function createAdvancedKingdom(){
 const s=E.createState(341,'easy');s.tutorial=true;s.xp=100000;s.nextRaid=1e12;
 s.buildings=[];s.army=[];s.training=[];s.cleared=[];
 for(let y=3;y<28;y++)for(let x=3;x<28;x++)if(E.terrain(x,y,s.seed)!=='water')s.cleared.push(x+':'+y);
 const add=(type,x,y,level=10)=>{const b={id:'b'+s.serial++,type,x,y,level,hp:E.buildingStats(type,level).hp,stored:0,job:null};s.buildings.push(b);return b;};
 for(const[type,x,y]of [['hq',14,8],['storage',12,12],['infantry',7,10],['range',7,14],['vehicle',7,18],['air',19,9],['research',19,13],['embassy',13,16],['hospital',17,17],['builders',11,20],['goldmine',22,6],['lumber',6,6],['supply',20,20],['metal',24,10],['cannon',5,14],['cannon',25,14],['tower',5,8],['tower',25,8],['tower',5,24],['tower',25,24]])add(type,x,y);
 for(const[x,y]of [[11,5],[8,5],[19,5],[20,16],[15,21],[21,24],[8,24],[11,24]])add('house',x,y);
 for(let n=5;n<=26;n++)for(const[x,y]of [[n,4],[n,27],[4,n],[27,n]])if(![14,15,16].includes(x)&&![15,16,17].includes(y)&&!s.buildings.some(b=>x>=b.x&&x<b.x+E.BUILDINGS[b.type].size&&y>=b.y&&y<b.y+E.BUILDINGS[b.type].size))add('wall',x,y);
 for(const type of Object.keys(E.UNITS)){s.research[type]=3;s.army.push(E.makeUnit(s,type,3));}
 const used=[],points=[];for(let y=12;y<26;y++)for(let x=5;x<27;x++)if(!s.buildings.some(b=>x>=b.x&&x<b.x+E.BUILDINGS[b.type].size&&y>=b.y&&y<b.y+E.BUILDINGS[b.type].size))points.push({x:x+.5,y:y+.5});
 points.sort((a,b)=>Math.hypot(a.x-15,a.y-18)-Math.hypot(b.x-15,b.y-18));
 for(const u of s.army){const space=E.UNITS[u.type].heavy||E.UNITS[u.type].flying?1.9:1.2,p=points.find(p=>used.every(q=>Math.hypot(q.x-p.x,q.y-p.y)>=Math.max(space,q.space)));if(p){u.x=p.x;u.y=p.y;u.facing=1;u.order=null;used.push({...p,space});}}
 E.initGarrison(s);for(const k of E.RESOURCE_KEYS)s.resources[k]=Math.min(25000,E.storageCap(s));
 for(const b of s.buildings)if(E.BUILDINGS[b.type].resource)b.stored=E.buildingStats(b.type,b.level).capacity*.65;
 return s;
}
