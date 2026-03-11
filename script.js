/* ═══════════════════════════════════════════════
   FISH IT GILEG — script.js  v4.0
   Canvas Scene · Shop · Exchange · Scroll Map
   Fusion · Gacha · Daily Deals · Rod Fragments
═══════════════════════════════════════════════ */
'use strict';

/* ═════════════════════════
   DATA
═════════════════════════ */

const RODS = [
  { id:'bamboo',  name:'Bamboo Rod',    icon:'🎋', maxKg:8,   bonus:{},            cost:0,      xpM:1,   desc:'Rod pemula dari bambu' },
  { id:'river',   name:'River Rod',     icon:'🎣', maxKg:22,  bonus:{Uncommon:3},  cost:600,    xpM:1.2, desc:'+3% Uncommon' },
  { id:'storm',   name:'Storm Rod',     icon:'⚡', maxKg:60,  bonus:{Rare:3,Epic:1},cost:2000,  xpM:1.5, desc:'+3% Rare +1% Epic' },
  { id:'midnight',name:'Midnight Rod',  icon:'🌙', maxKg:150, bonus:{Legendary:4}, cost:7000,   xpM:2,   desc:'+4% Legendary' },
  { id:'dragon',  name:'Dragon Rod',    icon:'🐉', maxKg:500, bonus:{Mythic:5,Legendary:3},cost:0, xpM:3, desc:'+5% Mythic +3% Legendary', craftable:true },
];

const BAITS = [
  { id:'worm',    name:'Cacing Tanah',   icon:'🪱', waitMin:3500,waitMax:5500,cost:0,    coinCost:0,   desc:'Umpan standar' },
  { id:'shrimp',  name:'Udang Segar',    icon:'🦐', waitMin:2500,waitMax:4500,cost:150,  coinCost:150, desc:'Ikan Uncommon +5%', rarityBonus:{Uncommon:5} },
  { id:'bread',   name:'Roti Ajaib',     icon:'🍞', waitMin:2000,waitMax:3500,cost:400,  coinCost:400, desc:'Ikan Common lebih jarang', rarityBonus:{Rare:3} },
  { id:'lucky',   name:'Lucky Bait',     icon:'🍀', waitMin:1500,waitMax:2800,cost:1200, coinCost:1200,desc:'+3% Rare +2% Epic', rarityBonus:{Rare:3,Epic:2} },
  { id:'mystic',  name:'Mystic Bait',    icon:'✨', waitMin:800, waitMax:1800,cost:4000, coinCost:4000,desc:'+4% Legendary +2% Mythic', rarityBonus:{Legendary:4,Mythic:2} },
];

const SPECIALS = [
  { id:'xp_boost', name:'XP x2 (10 cast)', icon:'⭐', desc:'XP ganda selama 10 tangkapan berikutnya', cost:500, effect:'xp2' },
  { id:'coin_boost',name:'Coin x2 (10 cast)',icon:'💰',desc:'Coin ganda 10 tangkapan', cost:800, effect:'coin2' },
  { id:'lure',     name:'Lure Premium',   icon:'🎨', desc:'Menarik ikan lebih cepat -30%', cost:300, effect:'fast_lure' },
];

const FISHING_SPOTS = [
  { id:'shallow', name:'Shallow Water', icon:'🌿', x:0.12,  rarityBonus:{Common:15}, desc:'Ikan kecil banyak', skyA:'#87e8ff', skyB:'#ffe0a0', waterTint:'#00ccff' },
  { id:'deep',    name:'Deep Water',    icon:'🌊', x:0.38,  rarityBonus:{Rare:5,Epic:2}, desc:'Ikan besar & langka', skyA:'#5bb8d4', skyB:'#b8c8e0', waterTint:'#006ba8' },
  { id:'rocky',   name:'Rock Area',     icon:'🪨', x:0.62,  rarityBonus:{Rare:8,Epic:3}, desc:'Rare fish tinggi', skyA:'#aaa8c0', skyB:'#d0c8b0', waterTint:'#305880' },
  { id:'current', name:'Fast Current',  icon:'💨', x:0.82,  rarityBonus:{Legendary:4,Mythic:2}, desc:'Ikan cepat & legendaris', skyA:'#3388cc', skyB:'#88bbee', waterTint:'#004488' },
];

const MAPS_DATA = [
  { id:'river',   name:'Sungai Gileg',  emoji:'🌊', desc:'Sungai jernih favorit', bonus:{Common:10},     bl:'+10% Common',    bg:'linear-gradient(135deg,#2193b0,#6dd5fa)' },
  { id:'misty',   name:'Danau Misty',   emoji:'🏝', desc:'Danau berkabut misterius', bonus:{Rare:5,Uncommon:3},bl:'+5% Rare',    bg:'linear-gradient(135deg,#614385,#516395)' },
  { id:'lava',    name:'Lava Lake',     emoji:'🌋', desc:'Danau lava — ikan api!',   bonus:{Epic:6},       bl:'+6% Epic',       bg:'linear-gradient(135deg,#cb2d3e,#ef473a)' },
  { id:'frozen',  name:'Frozen River',  emoji:'❄️', desc:'Sungai beku — ikan es',    bonus:{Legendary:5},  bl:'+5% Legendary',  bg:'linear-gradient(135deg,#2980b9,#6dd5fa)' },
  { id:'trench',  name:'Mythic Trench', emoji:'🐉', desc:'Palung Mythic eksklusif',  bonus:{Mythic:4},     bl:'+4% Mythic',     bg:'linear-gradient(135deg,#3a0ca3,#7209b7)' },
];

const FISH_DATA = {
  Common:   [ {id:'doge',  name:'Dogecoin (DOGE)',icon:'🐟',bv:28}, {id:'shib',name:'Shiba Inu (SHIB)',icon:'🐟',bv:22}, {id:'ada',name:'Cardano (ADA)',icon:'🐟',bv:32}, {id:'matic',name:'Polygon (MATIC)',icon:'🐟',bv:27}, {id:'bbri',name:'BRI Stock',icon:'🐟',bv:40}, {id:'tlkm',name:'Telkom Stock',icon:'🐟',bv:36} ],
  Uncommon: [ {id:'sol', name:'Solana (SOL)',icon:'🐠',bv:85}, {id:'dot',name:'Polkadot (DOT)',icon:'🐠',bv:80}, {id:'avax',name:'Avalanche',icon:'🐠',bv:90}, {id:'link',name:'Chainlink',icon:'🐠',bv:83}, {id:'bbca',name:'BCA Stock',icon:'🐠',bv:105}, {id:'bmri',name:'Mandiri Stock',icon:'🐠',bv:100} ],
  Rare:     [ {id:'bnb', name:'Binance (BNB)',icon:'🐡',bv:200}, {id:'ltc',name:'Litecoin (LTC)',icon:'🐡',bv:185}, {id:'xrp',name:'XRP',icon:'🐡',bv:215}, {id:'asii',name:'Astra Stock',icon:'🐡',bv:250}, {id:'atom',name:'Cosmos (ATOM)',icon:'🐡',bv:195} ],
  Epic:     [ {id:'eth', name:'Ethereum (ETH)',icon:'🐙',bv:500}, {id:'eur_jpy',name:'EUR/JPY',icon:'🐙',bv:530}, {id:'indf',name:'Indofood',icon:'🐙',bv:550}, {id:'ggrm',name:'Gudang Garam',icon:'🐙',bv:570} ],
  Legendary:[ {id:'btc', name:'Bitcoin (BTC)',icon:'🐋',bv:1400}, {id:'eth_btc',name:'ETH/BTC',icon:'🐋',bv:1300}, {id:'bbni',name:'BNI Stock',icon:'🐋',bv:1500} ],
  Mythic:   [ {id:'satoshi',name:'Satoshi Coin',icon:'🐉',bv:4500}, {id:'qbtc',name:'Quantum BTC',icon:'🐉',bv:5500}, {id:'gmwhale',name:'Market Whale',icon:'🐉',bv:7000}, {id:'idx_dragon',name:'IDX Dragon',icon:'🐉',bv:7500} ],
};

const WEIGHT_RANGE = { Common:[0.5,2], Uncommon:[1,5], Rare:[3,15], Epic:[10,50], Legendary:[30,150], Mythic:[100,300] };
const RARITY_MUL   = { Common:1, Uncommon:1.5, Rare:2.5, Epic:4, Legendary:8, Mythic:20 };
const BASE_RATES   = { Common:55, Uncommon:20, Rare:12, Epic:7, Legendary:4, Mythic:2 };
const XP_TABLE     = [0,100,250,450,700,1000,1400,1900,2500,3200,4000,5000,6200,7600,9200,11000,13200,15700,18500,21600,25000,30000];

const PETS = [
  {id:'koi',    name:'Lucky Koi',      icon:'🐟',bonus:{Rare:2},coinM:1,xpM:1,   desc:'+2% Rare',          cost:1000},
  {id:'octo',   name:'Smart Octopus',  icon:'🐙',bonus:{},      coinM:1,xpM:1.1, desc:'+10% XP',           cost:2000},
  {id:'puffer', name:'Treasure Puffer',icon:'🐡',bonus:{},      coinM:1.1,xpM:1, desc:'+10% Coin',         cost:3500},
  {id:'dragon', name:'Crypto Dragon',  icon:'🐉',bonus:{Legendary:2,Mythic:1},coinM:1,xpM:1,desc:'+2%Legend +1%Mythic',cost:10000},
];

/* ── ACHIEVEMENTS ── */
const ACHIEVEMENTS = [
  {id:'a1', name:'Pemancing Pertama',  icon:'🎣', desc:'Tangkap ikan pertamamu!',   type:'total_catch',   target:1,   reward:{coins:100,gems:0}},
  {id:'a2', name:'Seratus Tangkapan',  icon:'💯', desc:'Tangkap 100 ikan total',    type:'total_catch',   target:100, reward:{coins:1000,gems:3}},
  {id:'a3', name:'Combo x5',           icon:'🔥', desc:'Combo 5 tangkapan berturut',type:'combo',          target:5,   reward:{coins:500,gems:1}},
  {id:'a4', name:'Combo x10',          icon:'⚡', desc:'Combo 10 berturut-turut!', type:'combo',          target:10,  reward:{coins:2000,gems:5}},
  {id:'a5', name:'Monster Slayer',     icon:'🏆', desc:'Tangkap ikan 100kg+',      type:'heavy_catch',   target:100, reward:{coins:3000,gems:5}},
  {id:'a6', name:'Dragon Rod Owner',   icon:'🐉', desc:'Dapatkan Dragon Rod',       type:'own_rod',        target:'dragon',reward:{gems:10,coins:0}},
  {id:'a7', name:'Mythic Collector',   icon:'🌈', desc:'Tangkap 5 ikan Mythic',    type:'mythic_catch',  target:5,   reward:{coins:10000,gems:20}},
  {id:'a8', name:'Daily Streak 7',     icon:'📅', desc:'Login 7 hari berturut',    type:'login_streak',  target:7,   reward:{gems:7,coins:700}},
];

/* ── DAILY LOGIN ── */
function checkDailyLogin(){
  const today = new Date().toDateString();
  if(G.lastLogin === today) return;
  const yesterday = new Date(Date.now()-86400000).toDateString();
  if(G.lastLogin === yesterday) G.loginStreak = (G.loginStreak||0)+1;
  else G.loginStreak = 1;
  G.lastLogin = today;
  const bonus = G.loginStreak>=7 ? 500 : G.loginStreak>=3 ? 200 : 100;
  const gemB  = G.loginStreak>=7 ? 3 : G.loginStreak>=5 ? 1 : 0;
  G.coins += bonus; G.gems += gemB;
  saveG();
  setTimeout(()=>{
    const st=document.getElementById('daily-streak-txt'); if(st)st.textContent='Login hari ke-'+G.loginStreak+' berturut-turut! 🔥';
    const bt=document.getElementById('daily-bonus-txt'); if(bt)bt.textContent='+'+bonus+' 💰'+(gemB?' +'+gemB+' 💎':'');
    const dots=document.getElementById('login-dots');
    if(dots){dots.innerHTML='';for(let i=0;i<7;i++){const d=document.createElement('div');d.className='login-dot'+(i<G.loginStreak?' ld-done':'');d.textContent=i<G.loginStreak?'✓':(i+1).toString();dots.appendChild(d);}}
    showModal('modal-daily');
    checkAchievement('login_streak', G.loginStreak);
    updateHUD();
  }, 1000);
}

function checkAchievement(type, value, extraId){
  ACHIEVEMENTS.forEach(a=>{
    if(G.achievementsDone?.[a.id]) return;
    let pass = false;
    if(a.type==='total_catch'   && type==='total_catch'   && value>=a.target) pass=true;
    if(a.type==='combo'         && type==='combo'         && value>=a.target) pass=true;
    if(a.type==='heavy_catch'   && type==='heavy_catch'   && value>=a.target) pass=true;
    if(a.type==='mythic_catch'  && type==='mythic_catch'  && value>=a.target) pass=true;
    if(a.type==='own_rod'       && type==='own_rod'       && extraId===a.target) pass=true;
    if(a.type==='login_streak'  && type==='login_streak'  && value>=a.target) pass=true;
    if(pass){
      G.achievementsDone = G.achievementsDone||{};
      G.achievementsDone[a.id]=true;
      G.coins+=a.reward.coins; G.gems+=a.reward.gems;
      showToast('🏅 Achievement: '+a.name+'! +'+a.reward.coins+'💰'+(a.reward.gems?'+'+a.reward.gems+'💎':''));
      updateHUD(); saveG();
    }
  });
}

const MISSIONS = [
  {id:'m1',title:'Pemula',    desc:'Tangkap 5 ikan Common',    type:'catch_rarity',rarity:'Common',   target:5,  reward:{coins:200,xp:50},   rl:'+200💰+50XP'},
  {id:'m2',title:'Rare Hunt', desc:'Tangkap 3 ikan Rare',      type:'catch_rarity',rarity:'Rare',     target:3,  reward:{coins:500,xp:100},  rl:'+500💰+100XP'},
  {id:'m3',title:'Kolektor',  desc:'Kumpulkan 20 ikan total',  type:'total_catch',                    target:20, reward:{coins:800,xp:250},  rl:'+800💰+250XP'},
  {id:'m4',title:'Legendaris',desc:'Tangkap 1 Legendary',      type:'catch_rarity',rarity:'Legendary',target:1,  reward:{coins:1000,gems:2,xp:300},rl:'+1000💰+2💎'},
  {id:'m5',title:'Berat Boss',desc:'Tangkap ikan 50kg+',       type:'heavy_catch',                    target:1,  reward:{gems:3,xp:400},    rl:'+3💎+400XP'},
  {id:'m6',title:'Mythic',    desc:'Tangkap 1 Mythic',         type:'catch_rarity',rarity:'Mythic',   target:1,  reward:{coins:5000,gems:10,xp:1000},rl:'+5000💰+10💎'},
  {id:'m7',title:'Kaya Raya', desc:'Kumpulkan 3000 coin',      type:'earn_coins',                     target:3000,reward:{gems:5,xp:500},   rl:'+5💎+500XP'},
  {id:'m8',title:'Fragment',  desc:'Kumpulkan 5 rod fragment', type:'earn_frags',                     target:5,  reward:{coins:600,xp:200}, rl:'+600💰+200XP'},
];

const TRADE_RECIPES = [
  {id:'t1',from:'5x Common Fish',   to:'1x Worm Bait',    fromType:'common_fish',fromQty:5,   toType:'bait', toId:'worm',   toQty:1,   cdMs:0},
  {id:'t2',from:'3x Rare Fish',     to:'1x Lucky Bait',   fromType:'rare_fish',  fromQty:3,   toType:'bait', toId:'lucky',  toQty:1,   cdMs:30000},
  {id:'t3',from:'2x Epic Fish',     to:'3 Rod Fragments', fromType:'epic_fish',  fromQty:2,   toType:'frags',             toQty:3,   cdMs:60000},
  {id:'t4',from:'1x Legendary Fish',to:'5 Rod Fragments', fromType:'legendary_fish',fromQty:1,toType:'frags',             toQty:5,   cdMs:120000},
  {id:'t5',from:'3x Mythic Fish',   to:'Dragon Rod',      fromType:'mythic_fish',fromQty:3,   toType:'rod',  toId:'dragon', toQty:1,   cdMs:300000},
];

const FUSION_RECIPES = [
  {id:'f1',from:'3x Common Fish',  rFrom:'Common',   nFrom:3, rTo:'Uncommon', desc:'3 Common → 1 Uncommon'},
  {id:'f2',from:'3x Uncommon Fish',rFrom:'Uncommon', nFrom:3, rTo:'Rare',     desc:'3 Uncommon → 1 Rare'},
  {id:'f3',from:'3x Rare Fish',    rFrom:'Rare',     nFrom:3, rTo:'Epic',     desc:'3 Rare → 1 Epic'},
  {id:'f4',from:'2x Epic Fish',    rFrom:'Epic',     nFrom:2, rTo:'Legendary',desc:'2 Epic → 1 Legendary'},
];

const COIN_TRADES = [
  {id:'c1',cost:100,  item:'1x Worm Bait',   toType:'bait',  toId:'worm',   qty:1},
  {id:'c2',cost:400,  item:'1x Lucky Bait',  toType:'bait',  toId:'lucky',  qty:1},
  {id:'c3',cost:1000, item:'1x Mystic Bait', toType:'bait',  toId:'mystic', qty:1},
  {id:'c4',cost:200,  item:'2 Rod Fragments',toType:'frags',               qty:2},
  {id:'c5',cost:500,  item:'5 Rod Fragments',toType:'frags',               qty:5},
];

const GACHA_POOLS = {
  basic:   [{w:50,type:'bait',id:'worm',qty:3,name:'3x Worm Bait',ico:'🪱'},{w:30,type:'bait',id:'shrimp',qty:2,name:'2x Shrimp Bait',ico:'🦐'},{w:15,type:'frags',qty:2,name:'2 Rod Fragments',ico:'🔩'},{w:4,type:'coins',qty:300,name:'300 Coins',ico:'💰'},{w:1,type:'bait',id:'lucky',qty:1,name:'1x Lucky Bait',ico:'🍀'}],
  premium: [{w:40,type:'bait',id:'lucky',qty:2,name:'2x Lucky Bait',ico:'🍀'},{w:25,type:'frags',qty:5,name:'5 Rod Fragments',ico:'🔩'},{w:20,type:'bait',id:'mystic',qty:1,name:'1x Mystic Bait',ico:'✨'},{w:10,type:'coins',qty:800,name:'800 Coins',ico:'💰'},{w:5,type:'gems',qty:2,name:'2 Gems',ico:'💎'}],
  gem:     [{w:35,type:'bait',id:'mystic',qty:2,name:'2x Mystic Bait',ico:'✨'},{w:30,type:'frags',qty:8,name:'8 Rod Fragments',ico:'🔩'},{w:20,type:'gems',qty:3,name:'3 Gems',ico:'💎'},{w:10,type:'coins',qty:2000,name:'2000 Coins',ico:'💰'},{w:5,type:'rare_fish',name:'1x Rare Fish',ico:'🐡'}],
};

/* ═════════════════════════
   STATE
═════════════════════════ */
let G = {
  playerName:'Gileg', coins:0, gems:0, xp:0, level:1,
  rodFragments:0,
  currentMap:'river', currentSpot:'shallow',
  rodId:'bamboo', baitId:'worm',
  activePet:null, ownedPets:[],
  ownedRods:['bamboo'], ownedBaits:{worm:99},
  activeBoosters:{},        // {xp2: remaining, coin2: remaining}
  inventory:{},             // {fishId: {count, totalWeight}}
  tradeCooldowns:{},        // {tradeId: timestamp}
  dailyClaimed:{},          // {date: {dealId: true}}
  totalCaught:0, totalCoinsEarned:0, legendaryCount:0, mythicCount:0,
  heaviestCatch:0, combo:0, bestCombo:0, loginStreak:0, lastLogin:null, achievementsDone:{},
  missionProg:{}, missionClaimed:{},
  sfx:true,
};

function saveG()  { try{localStorage.setItem('fig4',JSON.stringify(G));}catch(e){} }
function loadG()  { try{const s=localStorage.getItem('fig4');if(s)G=Object.assign(G,JSON.parse(s));}catch(e){} }
function resetG() { localStorage.removeItem('fig4'); location.reload(); }

/* ═════════════════════════
   CANVAS SCENE
═════════════════════════ */
const WORLD_SCALE = 2.2;  // world is 2.2x screen width
let scene = null;

class FishScene {
  constructor(canvas) {
    this.cv = canvas; this.ctx = canvas.getContext('2d');
    this.t = 0; this.W = 0; this.H = 0;
    this.worldW = 0;
    this.waterY = 0;
    this.rodTip = {x:0,y:0};
    this.bobber = {x:0,y:0,visible:false,biting:false,ripple:0,flyX:null,flyY:null};
    this.fishes = []; this.effects = [];
    this.spawnTimer = null;
    this.running = false;
    this.phase = 'idle';
    this.onBite = null;
    this.onCastDone = null;
    this.viewX = 0;  // scroll offset within world
  }

  resize(containerW, H) {
    const dpr = window.devicePixelRatio || 1;
    this.W = containerW; this.H = H;
    this.worldW = containerW * WORLD_SCALE;
    this.cv.width  = this.worldW * dpr;
    this.cv.height = H * dpr;
    this.cv.style.width  = this.worldW + 'px';
    this.cv.style.height = H + 'px';
    this.ctx.scale(dpr, dpr);
    this.waterY = H * 0.50;
    this.rodTip = {x: containerW * 0.68, y: H * 0.28};
    this._updateSpotLabels();
  }

  _updateSpotLabels() {
    const cont = document.getElementById('spot-labels');
    if (!cont) return;
    cont.style.width = this.worldW + 'px';
    cont.innerHTML = '';
    FISHING_SPOTS.forEach(sp => {
      const lx = sp.x * this.worldW;
      const el = document.createElement('div');
      el.className = 'spot-label' + (G.currentSpot === sp.id ? ' active-spot' : '');
      el.textContent = sp.icon + ' ' + sp.name;
      el.style.left = (lx - 55) + 'px';
      el.style.top  = '6px';
      cont.appendChild(el);
    });
  }

  start() { if(this.running)return; this.running=true; this._loop(); }
  stop()  { this.running=false; if(this._raf)cancelAnimationFrame(this._raf); }

  _loop() {
    if (!this.running) return;
    this.t += 0.016;
    this._draw();
    this._raf = requestAnimationFrame(() => this._loop());
  }

  getSpotForViewX(vx) {
    const frac = (vx + this.W/2) / this.worldW;
    let best = FISHING_SPOTS[0];
    let bestDist = 999;
    FISHING_SPOTS.forEach(sp => {
      const d = Math.abs(sp.x - frac);
      if (d < bestDist) { bestDist = d; best = sp; }
    });
    return best;
  }

  _draw() {
    const ctx = this.ctx, W = this.worldW, H = this.H, wy = this.waterY;

    ctx.clearRect(0, 0, W, H);

    // Background sections per spot
    FISHING_SPOTS.forEach((sp, i) => {
      const x0 = sp.x * W - W * 0.15;
      const x1 = i < FISHING_SPOTS.length-1 ? (FISHING_SPOTS[i+1].x * W - W * 0.15) : W;
      const w  = x1 - x0;
      // Sky gradient
      const sg = ctx.createLinearGradient(x0, 0, x0, wy);
      sg.addColorStop(0, sp.skyA || '#87e8ff');
      sg.addColorStop(1, sp.skyB || '#ffe0a0');
      ctx.fillStyle = sg; ctx.fillRect(Math.max(0,x0), 0, w, wy);
      // Water
      const wg = ctx.createLinearGradient(x0, wy, x0, H);
      wg.addColorStop(0,   sp.waterTint || '#00ccff');
      wg.addColorStop(0.5, '#0044aa');
      wg.addColorStop(1,   '#001440');
      ctx.fillStyle = wg; ctx.fillRect(Math.max(0,x0), wy, w, H-wy);
    });

    // Sun
    const sunX = W * 0.1;
    ctx.beginPath(); ctx.arc(sunX, wy*0.25, 22, 0, Math.PI*2);
    ctx.fillStyle = '#ffee44';
    ctx.shadowBlur = 30; ctx.shadowColor = '#ffcc00';
    ctx.fill(); ctx.shadowBlur = 0;

    // Clouds
    this._drawClouds(ctx, W, wy);
    // Spot decorations
    this._drawSpotDecos(ctx, W, H, wy);
    // Animated wave line
    this._drawWaves(ctx, W, wy);
    // Seaweed
    this._drawSeaweed(ctx, W, H, wy);
    // UW bubbles
    this._drawUwBubs(ctx, W, H, wy);
    // Ambient fish
    this.fishes.forEach(f => { if(f.dead) return; f.x += f.vx; f.y += Math.sin(this.t*f.fr+f.ph)*f.amp;
      if(f.x>W+80||f.x<-80){f.dead=true;return;} this._drawFish(ctx,f); });
    this.fishes = this.fishes.filter(f=>!f.dead);
    // Effects
    this.effects.forEach(e => { e.life-=0.02; e.x+=(e.vx||0); e.y+=(e.vy||0);
      if(e.type==='p')e.vy+=0.06; if(e.type==='b')e.vy-=0.04; if(e.rg)e.r+=0.5;
      this._drawFx(ctx,e); });
    this.effects = this.effects.filter(e=>e.life>0);
    // Rod at the right side of viewport
    const rodX = this.viewX + this.W * 0.82;
    this._drawRod(ctx, rodX);
    // Line
    if (this.bobber.visible) {
      const bY = this.bobber.biting ? wy + 8 + Math.sin(this.t*6)*4 : wy + Math.sin(this.t*2.5)*3;
      ctx.beginPath(); ctx.moveTo(rodX - (this.W*0.82-this.rodTip.x), this.rodTip.y);
      ctx.lineTo(this.bobber.x, bY);
      ctx.strokeStyle = this.bobber.biting?'rgba(255,150,0,.9)':'rgba(255,255,255,.6)';
      ctx.lineWidth = this.bobber.biting?2:1; ctx.stroke();
    }
    // Flying bobber
    if (this.bobber.flyX !== null) {
      this._drawBobber(ctx, this.bobber.flyX, this.bobber.flyY);
    }
    // Bobber
    if (this.bobber.visible) {
      const bY = this.bobber.biting ? wy+8+Math.sin(this.t*6)*4 : wy+Math.sin(this.t*2.5)*3;
      this._drawBobber(ctx, this.bobber.x, bY);
      if (this.bobber.ripple>0) { this.bobber.ripple-=0.018; this._drawRipple(ctx,this.bobber.x,wy,this.bobber.ripple*26,this.bobber.ripple*.5); }
    }
    // Ambient fish spawn
    if (Math.random() < 0.002) this._spawnAmbient();
  }

  _drawClouds(ctx, W, wy) {
    const cx = [W*.06+Math.sin(this.t*.07)*W*.08, W*.3+Math.sin(this.t*.055)*W*.06, W*.58+Math.sin(this.t*.08)*W*.07, W*.82+Math.sin(this.t*.06)*W*.05];
    const cy = [wy*.3, wy*.2, wy*.35, wy*.18];
    cx.forEach((x,i)=>{ ctx.save(); ctx.globalAlpha=.55; ctx.fillStyle='#fff';
      ctx.beginPath(); ctx.arc(x,cy[i],13,0,Math.PI*2); ctx.arc(x+14,cy[i]-4,10,0,Math.PI*2); ctx.arc(x+28,cy[i],12,0,Math.PI*2); ctx.fill(); ctx.restore(); });
  }

  _drawSpotDecos(ctx, W, H, wy) {
    // Trees at river & misty
    [[W*.05,wy],[W*.2,wy],[W*.95,wy],[W*1.1,wy]].forEach(([x,y]) => {
      ctx.beginPath(); ctx.rect(x-3,y-18,6,18); ctx.fillStyle='#8B4513'; ctx.fill();
      ctx.beginPath(); ctx.arc(x,y-22,14,0,Math.PI*2); ctx.fillStyle='#2d8a2d'; ctx.fill();
    });
    // Rocks at rocky area
    [[W*.62,wy+5],[W*.66,wy+3],[W*.7,wy+7]].forEach(([x,y])=>{
      ctx.beginPath(); ctx.ellipse(x,y,14,9,0,0,Math.PI*2); ctx.fillStyle='#888'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(x,y-2,12,7,0,0,Math.PI*2); ctx.fillStyle='#aaa'; ctx.fill();
    });
    // Duck 🦆 (animated)
    const dx = W*.15 + Math.sin(this.t*.3)*W*.02;
    const dy = wy - 8 + Math.sin(this.t*.6)*2;
    ctx.font='16px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('🦆',dx,dy);
    // Floating log
    const lx = (W*.45 + this.t*8) % (W*.7) + W*.1;
    const ly = wy + Math.sin(this.t*.8)*2;
    ctx.save(); ctx.translate(lx,ly); ctx.rotate(Math.sin(this.t*.4)*.08);
    ctx.fillStyle='#8B5E3C'; ctx.fillRect(-22,-5,44,10); ctx.restore();
  }

  _drawWaves(ctx, W, wy) {
    ctx.beginPath(); ctx.strokeStyle='rgba(255,255,255,.32)'; ctx.lineWidth=2;
    for(let x=0;x<=W;x+=3){ const y=wy+Math.sin(x*.022+this.t*2)*3+Math.sin(x*.05+this.t*1.5)*1.5; x===0?ctx.moveTo(x,y):ctx.lineTo(x,y); } ctx.stroke();
    ctx.beginPath(); ctx.strokeStyle='rgba(255,255,255,.1)'; ctx.lineWidth=5;
    for(let x=0;x<=W;x+=3){ const y=wy+Math.sin(x*.022+this.t*2)*3; x===0?ctx.moveTo(x,y):ctx.lineTo(x,y); } ctx.stroke();
  }

  _drawSeaweed(ctx, W, H, wy) {
    [W*.06,W*.25,W*.5,W*.75,W*.92].forEach((px,i)=>{
      const sw=Math.sin(this.t*1.4+i*1.2)*7; const h=25+i*5;
      ctx.beginPath(); ctx.moveTo(px,H); ctx.quadraticCurveTo(px+sw,H-h*.6,px+sw*1.5,H-h);
      ctx.strokeStyle='#1a7a2a'; ctx.lineWidth=3; ctx.lineCap='round'; ctx.stroke();
      ctx.beginPath(); ctx.arc(px+sw*1.5,H-h,5,0,Math.PI*2); ctx.fillStyle='#2a9a3a'; ctx.fill();
    });
  }

  _drawUwBubs(ctx, W, H, wy) {
    for(let i=0;i<6;i++){ const bx=W*(0.08+i*0.17); const by=wy+(H-wy)*.8-((this.t*12+i*15)%(H-wy));
      ctx.beginPath(); ctx.arc(bx,by,2,0,Math.PI*2); ctx.strokeStyle='rgba(255,255,255,.18)'; ctx.lineWidth=1; ctx.stroke(); }
  }

  _drawRod(ctx, rx) {
    const ty = this.rodTip.y;
    const bx = rx, by = ty - 40;
    ctx.beginPath(); ctx.moveTo(bx+2,by+2); ctx.lineTo(rx,ty+2);
    ctx.strokeStyle='rgba(0,0,0,.25)'; ctx.lineWidth=5; ctx.lineCap='round'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(rx,ty);
    const rg=ctx.createLinearGradient(bx,by,rx,ty);rg.addColorStop(0,'#6B3410');rg.addColorStop(1,'#C8A06A');
    ctx.strokeStyle=rg; ctx.lineWidth=4; ctx.stroke();
    for(let i=0;i<3;i++){ const p=(i+1)/4; const gx=bx+(rx-bx)*p; const gy=by+(ty-by)*p;
      ctx.beginPath(); ctx.arc(gx,gy,2,0,Math.PI*2); ctx.fillStyle='#C8A06A'; ctx.fill(); }
    ctx.beginPath(); ctx.arc(bx,by,4,0,Math.PI*2); ctx.fillStyle='#5c3310'; ctx.fill();
    if(this.bobber.visible){ ctx.beginPath(); ctx.arc(rx,ty,3,0,Math.PI*2); ctx.fillStyle='rgba(0,200,255,.7)'; ctx.fill(); }
  }

  _drawBobber(ctx, x, y) {
    const bc = this.bobber.biting?'#ff8800':'#e74c3c';
    ctx.beginPath(); ctx.arc(x,y-5,6,Math.PI,0); ctx.fillStyle=bc; ctx.fill();
    ctx.beginPath(); ctx.arc(x,y+2,6,0,Math.PI); ctx.fillStyle='#fff'; ctx.fill();
    ctx.fillStyle='#444'; ctx.fillRect(x-6,y-1,12,2);
    ctx.beginPath(); ctx.moveTo(x,y-11); ctx.lineTo(x,y-5); ctx.strokeStyle='rgba(255,255,255,.5)'; ctx.lineWidth=1; ctx.stroke();
    if(this.bobber.biting){ ctx.save(); ctx.shadowBlur=14; ctx.shadowColor='#ff6600'; ctx.beginPath(); ctx.arc(x,y-1,7,0,Math.PI*2); ctx.strokeStyle='rgba(255,150,0,.6)'; ctx.lineWidth=2; ctx.stroke(); ctx.restore(); }
  }

  _drawRipple(ctx,x,y,r,a){ if(r<1)return; ctx.beginPath(); ctx.arc(x,y+2,r,0,Math.PI*2); ctx.strokeStyle=`rgba(255,255,255,${a})`; ctx.lineWidth=1.5; ctx.stroke(); ctx.beginPath(); ctx.arc(x,y+2,r*1.6,0,Math.PI*2); ctx.strokeStyle=`rgba(255,255,255,${a*.4})`; ctx.lineWidth=1; ctx.stroke(); }

  _drawFish(ctx, f) {
    ctx.save(); ctx.translate(f.x,f.y);
    if(f.vx<0)ctx.scale(-1,1);
    if(f.glow){ctx.shadowBlur=f.rarity==='Mythic'?20:f.rarity==='Legendary'?14:8; ctx.shadowColor=f.glowCol||'#ffe144';}
    ctx.font=`${f.sz}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(f.emoji,0,0);
    ctx.restore();
  }

  _drawFx(ctx, e) {
    if(e.life<=0)return; ctx.save(); ctx.globalAlpha=Math.max(0,e.life);
    if(e.type==='p'){ ctx.beginPath(); ctx.arc(e.x,e.y,e.r,0,Math.PI*2); ctx.fillStyle=e.col||'#7fd8f8'; ctx.fill(); }
    else if(e.type==='b'){ ctx.beginPath(); ctx.arc(e.x,e.y,Math.max(.1,e.r),0,Math.PI*2); ctx.strokeStyle='rgba(180,220,255,.8)'; ctx.lineWidth=1; ctx.stroke(); }
    else if(e.type==='s'){ ctx.beginPath(); ctx.arc(e.x,e.y,Math.max(.1,e.r),0,Math.PI*2); ctx.fillStyle='rgba(130,200,255,.6)'; ctx.fill(); }
    ctx.restore();
  }

  _spawnSplash(x,y,n=12){ for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,sp=1+Math.random()*2.5; this.effects.push({type:'p',x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-2.5,r:1.5+Math.random()*2.5,life:.7+Math.random()*.3,col:'#7fd8f8'});} }
  _spawnBubbles(x,y,n=6){ for(let i=0;i<n;i++) this.effects.push({type:'b',x:x+(Math.random()-.5)*20,y:y+5,vy:-(0.3+Math.random()*.5),r:2+Math.random()*3,life:.8+Math.random()*.4}); }
  _spawnRipples(x,y){ for(let i=0;i<3;i++) this.effects.push({type:'s',x,y,r:3+i*4,rg:true,vy:0,vx:0,life:.9-i*.2}); }

  _spawnAmbient() {
    const fl=Math.random()>.5; const sp=(0.5+Math.random()*.8)*(fl?1:-1);
    const pool=['🐟','🐠','🐡']; const rar=['Common','Uncommon','Rare'];
    const ri=Math.floor(Math.random()*3);
    this.fishes.push({x:fl?-50:this.worldW+50, y:this.waterY+15+Math.random()*(this.H-this.waterY-30),
      vx:sp, fr:1+Math.random()*2, ph:Math.random()*6, amp:1+Math.random()*2,
      emoji:pool[ri], sz:16+Math.random()*8, glow:ri>1, glowCol:'#aaddff', rarity:rar[ri], canBite:false, dead:false });
  }

  spawnBiter(fishEmoji, rarity) {
    const fl=Math.random()>.5; const sp=(1.2+Math.random()*.8)*(fl?1:-1);
    const glowMap={Common:'#aaddff',Uncommon:'#4499ff',Rare:'#aa55ff',Epic:'#ffaa00',Legendary:'#ff3344',Mythic:'#ff44ff'};
    this.fishes.push({x:fl?-50:this.worldW+50, y:this.waterY+6,
      vx:sp, fr:3, ph:0, amp:.5, emoji:fishEmoji, sz:22,
      glow:true, glowCol:glowMap[rarity]||'#ffe144', rarity, canBite:true, dead:false});
  }

  doCast(bobberTargetFrac) {
    this.phase='casting'; this.fishes=[]; this.effects=[];
    this.bobber.visible=false; this.bobber.biting=false; this.bobber.flyX=null;
    if(this.spawnTimer) clearInterval(this.spawnTimer);
    const spot = this.getSpotForViewX(this.viewX);
    G.currentSpot = spot.id;
    this._updateSpotLabels();
    setText('inf-spot', spot.icon+' '+spot.name);
    const bx = this.viewX + this.W * (0.25 + Math.random()*.3);
    const startX = this.viewX + this.W*0.82, startY = this.rodTip.y;
    const ey = this.waterY; const dur = 650; const t0 = performance.now();
    const fly = (now) => {
      const p = Math.min((now-t0)/dur,1);
      const ep = p<.5?2*p*p:-1+(4-2*p)*p;
      this.bobber.flyX = startX+(bx-startX)*ep;
      this.bobber.flyY = startY+(ey-startY)*ep - Math.sin(p*Math.PI)*65;
      if(p<1){requestAnimationFrame(fly);return;}
      this.bobber.flyX=null; this.bobber.x=bx; this.bobber.y=ey;
      this.bobber.visible=true; this.bobber.ripple=1;
      this.phase='waiting';
      this._spawnSplash(bx,ey,14); this._spawnRipples(bx,ey);
      playSFX('splash'); this._startSpawning();
      if(this.onCastDone) this.onCastDone();
    };
    requestAnimationFrame(fly);
  }

  _startSpawning() {
    if(this.spawnTimer) clearInterval(this.spawnTimer);
    let n=0; let biterDone=false;
    const bait = BAITS.find(b=>b.id===G.baitId)||BAITS[0];
    const delay = bait.waitMin + Math.random()*(bait.waitMax-bait.waitMin);
    this.spawnTimer = setInterval(()=>{
      if(this.phase!=='waiting'){clearInterval(this.spawnTimer);return;}
      this._spawnAmbient(); n++;
      if(!biterDone && n>=1+Math.floor(Math.random()*2)){
        biterDone=true;
        setTimeout(()=>{ if(this.phase==='waiting' && this.onBite) this.onBite(); }, delay);
      }
      if(n>=5) clearInterval(this.spawnTimer);
    }, 800+Math.random()*600);
    setTimeout(()=>this._spawnAmbient(),300);
  }

  doCatch() {
    this._spawnSplash(this.bobber.x,this.waterY,20);
    this._spawnBubbles(this.bobber.x,this.waterY,12);
    this._spawnRipples(this.bobber.x,this.waterY);
    this.bobber.visible=false; this.bobber.biting=false;
    this.fishes=[]; this.phase='result';
    if(this.spawnTimer) clearInterval(this.spawnTimer);
    playSFX('catch');
  }

  doBreak() {
    this._spawnSplash(this.bobber.x,this.waterY,8);
    this.bobber.visible=false; this.bobber.biting=false;
    this.fishes=[]; this.phase='break';
    if(this.spawnTimer) clearInterval(this.spawnTimer);
  }

  doReset() {
    if(this.spawnTimer) clearInterval(this.spawnTimer);
    this.fishes=[]; this.effects=[];
    this.bobber.visible=false; this.bobber.biting=false; this.bobber.flyX=null;
    this.phase='idle';
  }
}

/* ═════════════════════════
   DROP RATE ENGINE
═════════════════════════ */
function calcRates() {
  const r = {...BASE_RATES};
  const rod  = RODS.find(x=>x.id===G.rodId)||RODS[0];
  const bait = BAITS.find(b=>b.id===G.baitId)||BAITS[0];
  const map  = MAPS_DATA.find(m=>m.id===G.currentMap)||MAPS_DATA[0];
  const spot = FISHING_SPOTS.find(s=>s.id===G.currentSpot)||FISHING_SPOTS[0];
  const pet  = G.activePet ? PETS.find(p=>p.id===G.activePet) : null;
  let lb = G.level>=31?10:G.level>=21?6:G.level>=11?4:G.level>=6?2:0;
  r.Common=Math.max(0,r.Common-lb); r.Rare+=lb*.4; r.Epic+=lb*.3; r.Legendary+=lb*.2; r.Mythic+=lb*.1;
  applyBonus(r,rod.bonus||{});
  if(bait.rarityBonus) applyBonus(r,bait.rarityBonus);
  if(pet) applyBonus(r,pet.bonus||{});
  applyBonus(r,map.bonus||{},false);
  applyBonus(r,spot.rarityBonus||{},false);
  const tot=Object.values(r).reduce((a,b)=>a+b,0)||1;
  const n={};
  for(const[k,v]of Object.entries(r))n[k]=(v/tot)*100;
  return n;
}
function applyBonus(r,bonus,reduceCommon=true){
  for(const[k,v]of Object.entries(bonus)){
    r[k]=(r[k]||0)+v;
    if(reduceCommon)r.Common=Math.max(0,r.Common-v);
  }
}
function pickRarity(){
  const rt=calcRates(); const roll=Math.random()*100; let cum=0;
  for(const rr of['Mythic','Legendary','Epic','Rare','Uncommon','Common']){cum+=rt[rr]||0;if(roll<=cum)return rr;}
  return 'Common';
}
function pickFish(rarity){const p=FISH_DATA[rarity];return p[Math.floor(Math.random()*p.length)];}
function rollWeight(rarity){const[mn,mx]=WEIGHT_RANGE[rarity];return+(mn+Math.random()*(mx-mn)).toFixed(1);}
function sizeLabel(kg){if(kg<2)return'Kecil';if(kg<10)return'Sedang';if(kg<50)return'Besar';return'Monster';}
function calcValue(fish,rarity,weight){
  const wr=WEIGHT_RANGE[rarity]; const wf=1+(weight-wr[0])/(wr[1]-wr[0]+.01);
  const pet=G.activePet?PETS.find(p=>p.id===G.activePet):null;
  const cm=(pet?pet.coinM:1)*(G.activeBoosters.coin2>0?2:1);
  return Math.round(fish.bv*wf*RARITY_MUL[rarity]*cm*.25);
}

/* ═════════════════════════
   FISHING STATE MACHINE
═════════════════════════ */
const STATES=['idle','casting','waiting','bite','reel','break','miss','result'];
let phase='idle', pendingCatch=null, pullPct=0, biteTimer=null, biteCountInt=null, autoReelInt=null;
const BITE_WIN=3000;

function setPhase(ph){
  phase=ph;
  STATES.forEach(s=>{
    const el=document.getElementById('st-'+s);
    if(!el)return;
    if(s===ph){el.classList.remove('hidden');el.classList.add('active');}
    else{el.classList.add('hidden');el.classList.remove('active');}
  });
}

function doCast(){
  if(phase!=='idle')return;
  setPhase('casting');
  if(!scene){return;}
  scene.onCastDone=()=>{setPhase('waiting');startWaitArc();};
  scene.onBite=onFishBite;
  scene.doCast();
  playSFX('cast');
}

function doCancel(){
  clearTimeout(biteTimer); stopBiteCD(); stopWaitArc();
  if(scene)scene.doReset();
  setPhase('idle');
}

function onFishBite(){
  if(phase!=='waiting')return;
  stopWaitArc();
  const rarity=pickRarity(); const fish=pickFish(rarity); const weight=rollWeight(rarity);
  pendingCatch={rarity,fish,weight};
  const bf=scene.fishes.find(f=>f.canBite);
  if(bf)bf.emoji=fish.icon;
  setPhase('bite');
  if(scene){scene.bobber.biting=true; scene.bobber.ripple=1;}
  playSFX('bite');
  startBiteCD();
  biteTimer=setTimeout(onMiss,BITE_WIN);
}

function doPull(){
  if(phase!=='bite')return;
  clearTimeout(biteTimer); stopBiteCD();
  if(scene){scene.bobber.biting=false;}
  const{rarity,fish,weight}=pendingCatch;
  const rod=RODS.find(r=>r.id===G.rodId)||RODS[0];
  if(weight>rod.maxKg){
    if(scene)scene.doBreak(); doShake();
    setText('break-sub',fish.name+' terlalu berat! ('+weight+'kg vs max '+rod.maxKg+'kg)');
    setPhase('break'); playSFX('break'); pendingCatch=null; return;
  }
  pullPct=0; setPhase('reel');
  setText('reel-fish',fish.icon); setText('reel-wt',weight+'kg');
  const re=document.getElementById('reel-rar');
  if(re){re.textContent=rarity;re.className='reel-rar t-'+rarity;}
  updateTension(weight,rod.maxKg); updateReelBar();
  playSFX('reel');
  if(weight>rod.maxKg*.5){
    autoReelInt=setInterval(()=>{
      if(phase!=='reel'){clearInterval(autoReelInt);return;}
      pullPct=Math.max(0,pullPct-(weight/rod.maxKg)*5);
      updateReelBar();
      if(weight>rod.maxKg*.75){doShake();playSFX('fight');}
    },1200);
  }
}

function doReel(){
  if(phase!=='reel')return;
  const{weight}=pendingCatch; const rod=RODS.find(r=>r.id===G.rodId)||RODS[0];
  const gain=Math.max(4,28-(weight/rod.maxKg)*18);
  pullPct=Math.min(100,pullPct+gain);
  updateReelBar(); playSFX('reel');
  if(pullPct>=100){clearInterval(autoReelInt);setTimeout(onCatch,120);}
}

function onCatch(){
  if(!pendingCatch)return;
  clearInterval(autoReelInt);
  const{rarity,fish,weight}=pendingCatch; pendingCatch=null;
  const value=calcValue(fish,rarity,weight);
  const xpMap={Common:10,Uncommon:20,Rare:40,Epic:80,Legendary:200,Mythic:500};
  const pet=G.activePet?PETS.find(p=>p.id===G.activePet):null;
  const rod=RODS.find(r=>r.id===G.rodId)||RODS[0];
  let xp=Math.round((xpMap[rarity]||10)*(pet?pet.xpM:1)*rod.xpM*(G.activeBoosters.xp2>0?2:1));
  let gems=rarity==='Epic'?1:rarity==='Legendary'?3:rarity==='Mythic'?10:0;
  let frags=rarity==='Rare'?1:rarity==='Epic'?2:rarity==='Legendary'?3:rarity==='Mythic'?5:0;

  // Decrement boosters
  if(G.activeBoosters.xp2>0) G.activeBoosters.xp2--;
  if(G.activeBoosters.coin2>0) G.activeBoosters.coin2--;

  G.inventory[fish.id]=G.inventory[fish.id]||{count:0,totalWeight:0};
  G.inventory[fish.id].count++; G.inventory[fish.id].totalWeight=+(G.inventory[fish.id].totalWeight+weight).toFixed(1);
  G.totalCaught++; G.coins+=value; G.gems+=gems; G.rodFragments+=frags;
  G.totalCoinsEarned+=value;
  if(rarity='Legendary')G.legendaryCount++;
  if(rarity='Mythic')G.mythicCount++;
  if(weight>G.heaviestCatch)G.heaviestCatch=weight;
  G.combo=(G.combo||0)+1;
  if(G.combo>(G.bestCombo||0))G.bestCombo=G.combo;
  if(G.combo>=3&&G.combo%5===0){const cb=G.combo,bns=cb*10;G.coins+=bns;setTimeout(()=>showToast('🔥 COMBO x'+cb+'! Bonus +'+bns+'💰!'),300);}
  checkAchievement('combo',G.combo);
  checkAchievement('total_catch',G.totalCaught);
  if(weight>=100)checkAchievement('heavy_catch',weight);
  if(rarity==='Mythic')checkAchievement('mythic_catch',G.mythicCount);
  addXP(xp); updateMissions(fish,rarity,weight);
  if(scene){doFishJump(fish.icon,rarity);setTimeout(()=>{scene.doCatch();doShake();showResult(fish,rarity,weight,value,xp,gems,frags);updateHUD();},500);}
  else{showResult(fish,rarity,weight,value,xp,gems,frags);updateHUD();}
  saveG();
}

function doFishJump(icon, rarity){
  // Animate fish flying out of water on the canvas
  if(!scene) return;
  const x=scene.bobber.x, wy=scene.waterY;
  const glowCol={Common:'#aaddff',Uncommon:'#4499ff',Rare:'#aa55ff',Epic:'#ffaa00',Legendary:'#ff3344',Mythic:'#ff44ff'}[rarity]||'#fff';
  let progress=0;
  const jumpFish={x,y:wy,vx:(Math.random()-.5)*3,vys:-8,vy:-8,emoji:icon,sz:28,glow:true,glowCol,rarity,canBite:false,dead:false,fr:0,ph:0,amp:0};
  scene.fishes.push(jumpFish);
  const jumpInt=setInterval(()=>{
    progress++;
    jumpFish.vy+=0.6; jumpFish.y+=jumpFish.vy; jumpFish.x+=jumpFish.vx;
    scene._spawnSplash(x,wy,3);
    if(jumpFish.y>scene.H+30||progress>40){jumpFish.dead=true;clearInterval(jumpInt);}
  },25);
}

function onMiss(){
  if(phase!=='bite')return;
  stopBiteCD(); if(scene){scene.bobber.biting=false;scene.doReset();scene.phase='idle';}
  G.combo=0;
  pendingCatch=null; setPhase('miss'); playSFX('miss');
}

function updateReelBar(){const f=document.getElementById('reel-f'),p=document.getElementById('reel-pct');if(f)f.style.width=pullPct+'%';if(p)p.textContent=Math.floor(pullPct)+'%';}
function updateTension(w,mx){const r=w/mx,f=document.getElementById('t-f'),wn=document.getElementById('t-w');if(!f)return;const pct=Math.min(100,r*100);f.style.width=pct+'%';f.style.background=pct>80?'linear-gradient(90deg,#ff2244,#ff0000)':pct>50?'linear-gradient(90deg,#ff8800,#ffcc00)':'linear-gradient(90deg,#2ecc40,#aaff44)';if(wn)wn.textContent=pct>80?'⚠️ KRITIS!':pct>50?'⚠️ Berat':'';}

function showResult(fish,rarity,weight,coins,xp,gems,frags){
  setPhase('result');
  const card=document.getElementById('res-card');
  if(card)card.className='res-card rc-'+rarity;
  setText('res-ico',fish.icon); setText('res-rar',rarity.toUpperCase());
  setText('res-sz',sizeLabel(weight)); setText('res-wt',weight+'kg');
  setText('res-nm',fish.name); setText('res-c','+'+coins+' 💰'); setText('res-x','+'+xp+' XP');
  let bonus='';
  if(gems>0)bonus+='+'+ gems+' 💎  ';
  if(frags>0)bonus+='+'+frags+' 🔩  ';
  if(rarity==='Mythic')bonus+='🌈 MYTHIC!';
  else if(rarity==='Legendary')bonus+='⭐ LEGENDARY!';
  else if(weight>=50)bonus+='🏆 MONSTER FISH!';
  setText('res-bon',bonus);
  // Show fuse hint if enough common fish
  const fh=document.getElementById('btn-fuse-hint');
  if(fh){const cnt=countFishByRarity('Common');fh.style.display=cnt>=3?'block':'none';}
  spawnSparks(rarity);
}

function spawnSparks(rarity){
  const c=document.getElementById('res-sparks');if(!c)return;c.innerHTML='';
  const n={Mythic:22,Legendary:16,Epic:12,Rare:8}[rarity]||5;
  const col={Common:'#2ecc40',Uncommon:'#0088ff',Rare:'#a855f7',Epic:'#ff9900',Legendary:'#ff2244',Mythic:'#ff44ff'}[rarity]||'#fff';
  for(let i=0;i<n;i++){const s=document.createElement('div');s.className='sparkle';
    s.style.cssText=`left:${20+Math.random()*60}%;top:${15+Math.random()*70}%;background:${col};width:${3+Math.random()*5}px;height:${3+Math.random()*5}px;--sx:${(Math.random()-.5)*130}px;--sy:${(Math.random()-.5)*110}px;animation-delay:${Math.random()*.35}s;`;
    c.appendChild(s);setTimeout(()=>s.remove(),1200);}
}

function doShake(){const e=document.querySelector('.world-container');if(!e)return;e.style.transform='translateX(-3px)';setTimeout(()=>{e.style.transform='translateX(3px)';setTimeout(()=>{e.style.transform='';},80);},80);}

/* ═════════════════════════
   WAIT ARC
═════════════════════════ */
let waitArcIv=null,waitArcP=0;
function startWaitArc(){
  const arc=document.getElementById('wait-arc');if(arc)arc.style.strokeDashoffset='188';
  waitArcP=0; clearInterval(waitArcIv);
  const bait=BAITS.find(b=>b.id===G.baitId)||BAITS[0];
  const avg=(bait.waitMin+bait.waitMax)/2; const step=188/(avg/50);
  waitArcIv=setInterval(()=>{
    waitArcP=Math.min(waitArcP+step,188);
    const a2=document.getElementById('wait-arc');if(a2)a2.style.strokeDashoffset=188-waitArcP;
    if(waitArcP>=188)clearInterval(waitArcIv);
  },50);
}
function stopWaitArc(){clearInterval(waitArcIv);const a=document.getElementById('wait-arc');if(a)a.style.strokeDashoffset='188';}

let biteCountStart=0;
function startBiteCD(){
  biteCountStart=Date.now();const bar=document.getElementById('bite-cd-f');if(bar)bar.style.width='100%';
  clearInterval(biteCountInt);
  biteCountInt=setInterval(()=>{const el=Date.now()-biteCountStart;const p=Math.max(0,100-(el/BITE_WIN)*100);const b2=document.getElementById('bite-cd-f');if(b2)b2.style.width=p+'%';if(p<=0)clearInterval(biteCountInt);},40);
}
function stopBiteCD(){clearInterval(biteCountInt);const b=document.getElementById('bite-cd-f');if(b)b.style.width='100%';}

/* ═════════════════════════
   XP & LEVEL
═════════════════════════ */
function addXP(a){G.xp+=a;let lv=false;while(G.level<XP_TABLE.length-1&&G.xp>=XP_TABLE[G.level]){G.level++;lv=true;}if(lv)showLevelUp();updateHUD();}
function showLevelUp(){setText('mlvl-t','🎉 Level '+G.level+'!');const b=document.getElementById('mlvl-b');if(b){const bns=G.level>=31?'+10% rare':G.level>=21?'+6%':G.level>=11?'+4%':G.level>=6?'+2%':'';b.textContent=bns;}showModal('modal-lvl');playSFX('levelup');}
function xpPct(){const c=XP_TABLE[G.level-1]||0,n=XP_TABLE[G.level]||XP_TABLE[XP_TABLE.length-1];return Math.min(((G.xp-c)/(n-c))*100,100);}

/* ═════════════════════════
   HUD
═════════════════════════ */
function updateHUD(){
  setText('hud-coins','💰 '+fmt(G.coins));
  setText('hud-gems', '💎 '+fmt(G.gems));
  setText('hud-frags','🔩 '+G.rodFragments);
  setText('hud-nm',   G.playerName);
  setText('hud-lv',   'Lv.'+G.level);
  setText('hud-xp-n', fmt(G.xp)+'xp');
  const xf=document.getElementById('hud-xp-f');if(xf)xf.style.width=xpPct()+'%';
  const rod=RODS.find(r=>r.id===G.rodId)||RODS[0];
  setText('inf-rod',rod.icon+' '+rod.name);
  setText('inf-rod-kg','Max '+rod.maxKg+'kg');
  const rpwF=document.getElementById('rpw-f');if(rpwF)rpwF.style.width=(RODS.indexOf(rod)+1)/RODS.length*100+'%';
  setText('rpw-lbl',rod.maxKg+'kg');
  const map=MAPS_DATA.find(m=>m.id===G.currentMap);
  if(map)setText('map-badge',map.name);
  setText('sq-c',G.totalCaught);setText('sq-x',fmt(G.xp));setText('sq-l',G.legendaryCount);setText('sq-m',G.mythicCount);
  const cb=document.getElementById('combo-disp');if(cb){cb.textContent=G.combo>1?'🔥 Combo x'+G.combo:'';cb.style.display=G.combo>1?'block':'none';}
  // Booster indicators
  const boostTxt=[];
  if(G.activeBoosters.xp2>0)boostTxt.push('⭐x2('+G.activeBoosters.xp2+')');
  if(G.activeBoosters.coin2>0)boostTxt.push('💰x2('+G.activeBoosters.coin2+')');
}

/* ═════════════════════════
   AQUARIUM
═════════════════════════ */
function renderAquarium(filter='all'){
  const grid=document.getElementById('aq-grid'),stats=document.getElementById('aq-stats');if(!grid)return;
  const all=getAllFish(); const shown=filter==='all'?all:all.filter(f=>f.rarity===filter);
  const total=all.reduce((a,f)=>a+f.count,0);
  setText('aq-cnt',total+' ikan');
  if(stats)stats.innerHTML=`<div class="aq-stat"><span class="asv">${total}</span>Total Ikan</div><div class="aq-stat"><span class="asv">${G.heaviestCatch}kg</span>Terberat</div><div class="aq-stat"><span class="asv">${G.legendaryCount+G.mythicCount}</span>Rare+</div>`;
  if(!shown.length){grid.innerHTML=`<div class="empty-st"><span>🎣</span><p>Belum ada ikan!</p></div>`;return;}
  grid.innerHTML=shown.map(({fish,rarity,count,totalWeight})=>{
    const aw=count?+(totalWeight/count).toFixed(1):0;
    return `<div class="fc r-${rarity}"><div class="fc-ic">${fish.icon}</div><div class="fc-nm">${fish.name}</div><div class="fc-qty">×${count}</div><div class="fc-wt">⚖️~${aw}kg</div><div class="fc-r t-${rarity}">${rarity}</div></div>`;
  }).join('');
}

/* ═════════════════════════
   SHOP
═════════════════════════ */
function renderShop(panel='rods'){
  if(panel==='rods'){
    const grid=document.getElementById('sg-rods');if(!grid)return;
    setText('shop-coins',fmt(G.coins));
    grid.innerHTML=RODS.map(rod=>{
      const owned=G.ownedRods.includes(rod.id),equipped=G.rodId===rod.id;
      const canCraft=rod.craftable&&G.rodFragments>=20;
      let badgeTxt='';
      if(equipped)badgeTxt='⚡ Equipped';
      else if(owned)badgeTxt='✓ Owned';
      else if(rod.craftable)badgeTxt='🔩 Craft';
      return `<div class="shop-item ${equipped?'equipped':owned?'owned':rod.craftable&&!owned?'locked':''}">
        <div class="si-ico">${rod.icon}</div>
        <div class="si-nm">${rod.name}</div>
        <div class="si-desc">${rod.desc}</div>
        <div class="si-stats">⚡ Max ${rod.maxKg}kg | XP×${rod.xpM}</div>
        <div class="si-price">${rod.craftable&&!owned?'🔩 20 Fragments':(rod.cost?'💰 '+fmt(rod.cost):'Gratis')}</div>
        ${badgeTxt?`<div class="si-badge">${badgeTxt}</div>`:''}
        <button class="btn-buy ${equipped?'btn-owned':owned?'btn-equip-it':''}" data-rid="${rod.id}" ${equipped?'disabled':''}>${equipped?'Equipped':owned?'Pasang':rod.craftable?'Craft (🔩20)':'Beli'}</button>
      </div>`;
    }).join('');
    grid.querySelectorAll('.btn-buy:not([disabled])').forEach(b=>b.addEventListener('click',()=>buyRod(b.dataset.rid)));
  }
  else if(panel==='baits'){
    const grid=document.getElementById('sg-baits');if(!grid)return;
    grid.innerHTML=BAITS.map(bait=>{
      const qty=G.ownedBaits[bait.id]||0; const equipped=G.baitId===bait.id;
      return `<div class="shop-item ${equipped?'equipped':''}">
        <div class="si-ico">${bait.icon}</div>
        <div class="si-nm">${bait.name}</div>
        <div class="si-desc">${bait.desc}</div>
        <div class="si-stats">Punya: ${qty>99?'∞':qty}</div>
        <div class="si-price">${bait.cost?'💰 '+bait.cost+'/buah':'Gratis'}</div>
        ${equipped?'<div class="si-badge">✓ Aktif</div>':''}
        <button class="btn-buy ${equipped?'btn-owned':''}" data-bid="${bait.id}" ${equipped&&bait.cost===0?'disabled':''}>${equipped?'Aktif':bait.cost?'Beli':'Pasang'}</button>
      </div>`;
    }).join('');
    grid.querySelectorAll('.btn-buy:not([disabled])').forEach(b=>b.addEventListener('click',()=>buyBait(b.dataset.bid)));
  }
  else if(panel==='special'){
    const grid=document.getElementById('sg-special');if(!grid)return;
    grid.innerHTML=SPECIALS.map(sp=>{
      const active=G.activeBoosters[sp.effect]>0;
      return `<div class="shop-item ${active?'equipped':''}">
        <div class="si-ico">${sp.icon}</div>
        <div class="si-nm">${sp.name}</div>
        <div class="si-desc">${sp.desc}</div>
        <div class="si-price">💰 ${sp.cost}</div>
        ${active?'<div class="si-badge">🔥 Aktif: '+G.activeBoosters[sp.effect]+'</div>':''}
        <button class="btn-buy" data-spid="${sp.id}">${active?'Perpanjang':'Beli'}</button>
      </div>`;
    }).join('');
    grid.querySelectorAll('.btn-buy').forEach(b=>b.addEventListener('click',()=>buySpecial(b.dataset.spid)));
  }
}

function buyRod(id){
  const rod=RODS.find(r=>r.id===id);if(!rod)return;
  if(G.ownedRods.includes(id)){G.rodId=id;showToast('⚡ '+rod.name+' dipasang!');updateHUD();renderShop('rods');saveG();return;}
  if(rod.craftable){if(G.rodFragments<20){showToast('🔩 Butuh 20 Rod Fragments!');return;}G.rodFragments-=20;G.ownedRods.push(id);G.rodId=id;showToast('🐉 '+rod.name+' berhasil dibuat!');updateHUD();renderShop('rods');saveG();return;}
  if(G.coins<rod.cost){showToast('💸 Butuh '+fmt(rod.cost)+'💰');return;}
  G.coins-=rod.cost;G.ownedRods.push(id);G.rodId=id;
  showToast('⬆️ '+rod.name+' dibeli & dipasang!');updateHUD();renderShop('rods');saveG();
}

function buyBait(id){
  const bait=BAITS.find(b=>b.id===id);if(!bait)return;
  if(bait.cost===0){G.baitId=id;showToast(bait.icon+' '+bait.name+' dipasang!');renderShop('baits');saveG();return;}
  if(G.coins<bait.cost){showToast('💸 Butuh '+bait.cost+'💰');return;}
  G.coins-=bait.cost; G.ownedBaits[id]=(G.ownedBaits[id]||0)+1; G.baitId=id;
  showToast(bait.icon+' '+bait.name+' dibeli!');updateHUD();renderShop('baits');saveG();
}

function buySpecial(id){
  const sp=SPECIALS.find(s=>s.id===id);if(!sp)return;
  if(G.coins<sp.cost){showToast('💸 Butuh '+sp.cost+'💰');return;}
  G.coins-=sp.cost; G.activeBoosters[sp.effect]=(G.activeBoosters[sp.effect]||0)+10;
  showToast(sp.icon+' '+sp.name+' aktif!');updateHUD();renderShop('special');saveG();
}

/* ═════════════════════════
   EXCHANGE
═════════════════════════ */
function renderTrade(){
  const grid=document.getElementById('ex-trade-grid');if(!grid)return;
  grid.innerHTML=TRADE_RECIPES.map(tr=>{
    const avail=canDoTrade(tr); const cd=G.tradeCooldowns[tr.id]||0; const remaining=Math.max(0,cd+tr.cdMs-Date.now());
    const cdTxt=remaining>0?'⏰ '+Math.ceil(remaining/1000)+'s':'';
    return `<div class="ex-item">
      <div class="ex-from">${tr.from}</div>
      <div class="ex-arrow">→</div>
      <div class="ex-to">${tr.to}</div>
      ${cdTxt?`<div class="ex-cd">${cdTxt}</div>`:''}
      <button class="btn-trade" data-tid="${tr.id}" ${(!avail||remaining>0)?'disabled':''}>${remaining>0?cdTxt:'Tukar'}</button>
    </div>`;
  }).join('');
  grid.querySelectorAll('.btn-trade:not([disabled])').forEach(b=>b.addEventListener('click',()=>doTrade(b.dataset.tid)));
}

function canDoTrade(tr){
  if(tr.fromType==='common_fish')    return countFishByRarity('Common')    >=tr.fromQty;
  if(tr.fromType==='rare_fish')      return countFishByRarity('Rare')      >=tr.fromQty;
  if(tr.fromType==='epic_fish')      return countFishByRarity('Epic')      >=tr.fromQty;
  if(tr.fromType==='legendary_fish') return countFishByRarity('Legendary') >=tr.fromQty;
  if(tr.fromType==='mythic_fish')    return countFishByRarity('Mythic')    >=tr.fromQty;
  return false;
}

function doTrade(id){
  const tr=TRADE_RECIPES.find(x=>x.id===id);if(!tr)return;
  if(!canDoTrade(tr)){showToast('Ikan kurang!');return;}
  const cd=G.tradeCooldowns[id]||0; if(Date.now()-cd<tr.cdMs){showToast('⏰ Cooldown!');return;}
  // Remove fish
  let rarityMap={common_fish:'Common',rare_fish:'Rare',epic_fish:'Epic',legendary_fish:'Legendary',mythic_fish:'Mythic'};
  removeFishByRarity(rarityMap[tr.fromType],tr.fromQty);
  // Give reward
  if(tr.toType==='bait'){G.ownedBaits[tr.toId]=(G.ownedBaits[tr.toId]||0)+tr.toQty;showToast('✅ Dapat '+tr.toQty+'x bait!');}
  if(tr.toType==='frags'){G.rodFragments+=tr.toQty;showToast('✅ Dapat '+tr.toQty+' Rod Fragments!');}
  if(tr.toType==='rod'){G.ownedRods.push(tr.toId);showToast('🐉 '+tr.to+' berhasil ditukar!');}
  G.tradeCooldowns[id]=Date.now();
  updateHUD(); renderTrade(); saveG();
}

function renderCoinTrade(){
  const grid=document.getElementById('ex-coin-grid');if(!grid)return;
  grid.innerHTML=COIN_TRADES.map(ct=>`
    <div class="ex-item">
      <div class="ex-from">💰 ${ct.cost} Coin</div>
      <div class="ex-arrow">→</div>
      <div class="ex-to">${ct.item}</div>
      <button class="btn-trade" data-cid="${ct.id}" ${G.coins<ct.cost?'disabled':''}>Tukar</button>
    </div>`).join('');
  grid.querySelectorAll('.btn-trade:not([disabled])').forEach(b=>b.addEventListener('click',()=>doCoinTrade(b.dataset.cid)));
}

function doCoinTrade(id){
  const ct=COIN_TRADES.find(x=>x.id===id);if(!ct)return;
  if(G.coins<ct.cost){showToast('💸 Coin kurang!');return;}
  G.coins-=ct.cost;
  if(ct.toType==='bait'){G.ownedBaits[ct.toId]=(G.ownedBaits[ct.toId]||0)+ct.qty;showToast('✅ Dapat '+ct.item+'!');}
  if(ct.toType==='frags'){G.rodFragments+=ct.qty;showToast('✅ Dapat '+ct.qty+' Rod Fragments!');}
  updateHUD(); renderCoinTrade(); saveG();
}

function doGacha(tier,currency,cost){
  if(currency==='gems'){if(G.gems<cost){showToast('💎 Gems kurang!');return;}G.gems-=cost;}
  else{if(G.coins<cost){showToast('💸 Coin kurang!');return;}G.coins-=cost;}
  const pool=GACHA_POOLS[tier];
  const total=pool.reduce((a,x)=>a+x.w,0); let roll=Math.random()*total, prize=pool[pool.length-1];
  for(const p of pool){roll-=p.w;if(roll<=0){prize=p;break;}}
  // Apply prize
  if(prize.type==='bait'){G.ownedBaits[prize.id]=(G.ownedBaits[prize.id]||0)+prize.qty;}
  if(prize.type==='frags'){G.rodFragments+=prize.qty;}
  if(prize.type==='coins'){G.coins+=prize.qty;}
  if(prize.type==='gems'){G.gems+=prize.qty;}
  if(prize.type==='rare_fish'){const f=pickFish('Rare');const w=rollWeight('Rare');G.inventory[f.id]=G.inventory[f.id]||{count:0,totalWeight:0};G.inventory[f.id].count++;G.inventory[f.id].totalWeight+=w;}
  // Animation
  const ani=document.getElementById('gacha-ani');
  if(ani){ani.textContent='🎁';ani.style.animation='none';void ani.offsetWidth;ani.style.animation='gachaOpen .6s ease-out forwards';}
  const res=document.getElementById('gacha-result');
  if(res){res.style.display='flex';res.innerHTML=`<div class="gacha-result-item"><div class="gr-ico">${prize.ico}</div><div class="gr-nm">${prize.name}</div><div class="gr-type">Gacha ${tier}</div></div>`;}
  setTimeout(()=>{if(ani){ani.textContent='🎁';ani.style.animation='gachaFloat 2s ease-in-out infinite';}},1200);
  playSFX('catch'); updateHUD(); saveG();
}

function renderFusion(){
  const wrap=document.getElementById('fusion-recipes');if(!wrap)return;
  wrap.innerHTML=FUSION_RECIPES.map(fr=>{
    const avail=countFishByRarity(fr.rFrom)>=fr.nFrom;
    return `<div class="fusion-card">
      <div class="fus-from">${fr.nFrom}x ${fr.rFrom}</div>
      <div class="fus-arr">→</div>
      <div class="fus-to">1x ${fr.rTo}</div>
      <div class="fus-avail">Punya: ${countFishByRarity(fr.rFrom)} ikan</div>
      <button class="btn-fuse" data-fid="${fr.id}" ${!avail?'disabled':''}>${avail?'🔀 Fusion!':'Kurang ikan'}</button>
    </div>`;
  }).join('');
  wrap.querySelectorAll('.btn-fuse:not([disabled])').forEach(b=>b.addEventListener('click',()=>doFusion(b.dataset.fid)));
}

function doFusion(id){
  const fr=FUSION_RECIPES.find(x=>x.id===id);if(!fr)return;
  if(countFishByRarity(fr.rFrom)<fr.nFrom){showToast('Ikan kurang!');return;}
  removeFishByRarity(fr.rFrom,fr.nFrom);
  const newFish=pickFish(fr.rTo); const w=rollWeight(fr.rTo);
  G.inventory[newFish.id]=G.inventory[newFish.id]||{count:0,totalWeight:0};
  G.inventory[newFish.id].count++; G.inventory[newFish.id].totalWeight+=w;
  G.totalCaught++;
  showToast('🔀 Fusion berhasil! Dapat '+newFish.icon+' '+newFish.name+'!');
  playSFX(fr.rTo); updateHUD(); renderFusion(); saveG();
}

function renderDaily(){
  const grid=document.getElementById('daily-grid'),timerEl=document.getElementById('daily-timer');if(!grid)return;
  const today=new Date().toDateString();
  const claimed=G.dailyClaimed[today]||{};
  // Generate daily deals based on date (deterministic per day)
  const seed=new Date().getDate()+new Date().getMonth()*31;
  const deals=[
    {id:'d1',ico:'🐟',from:'10 Common Fish',to:'300 💰',fromType:'common_fish',fromQty:10,toType:'coins',toQty:300},
    {id:'d2',ico:'🔩',from:'5 Rod Fragments',to:'1x Lucky Bait',fromType:'frags',fromQty:5,toType:'bait',toId:'lucky',toQty:1},
    {id:'d3',ico:'💎',from:'1 Gem',to:'500 💰',fromType:'gems',fromQty:1,toType:'coins',toQty:500},
  ];
  const deal=deals[seed%deals.length];
  grid.innerHTML=deals.map((d,i)=>{
    const done=claimed[d.id];
    return `<div class="daily-item ${done?'claimed':''}">
      <div class="di-ico">${d.ico}</div>
      <div class="di-from">${d.from}</div>
      <div class="di-arr">→</div>
      <div class="di-to">${d.to}</div>
      <button class="btn-daily" data-did="${d.id}" ${done?'disabled':''} ${done?'':''}>${done?'✓ Claimed':'Ambil!'}</button>
    </div>`;
  }).join('');
  grid.querySelectorAll('.btn-daily:not([disabled])').forEach(b=>b.addEventListener('click',()=>claimDaily(b.dataset.did,deals)));
  // Timer countdown
  const now=new Date(); const midnight=new Date(now); midnight.setHours(24,0,0,0);
  const remaining=midnight-now; const h=Math.floor(remaining/3600000); const m=Math.floor(remaining%3600000/60000); const s=Math.floor(remaining%60000/1000);
  if(timerEl)timerEl.textContent=`⏰ Reset dalam: ${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function claimDaily(did,deals){
  const today=new Date().toDateString();
  G.dailyClaimed[today]=G.dailyClaimed[today]||{};
  if(G.dailyClaimed[today][did])return;
  const d=deals.find(x=>x.id===did);if(!d)return;
  // Check & deduct
  if(d.fromType==='common_fish'){if(countFishByRarity('Common')<d.fromQty){showToast('Ikan kurang!');return;}removeFishByRarity('Common',d.fromQty);}
  if(d.fromType==='frags'){if(G.rodFragments<d.fromQty){showToast('Fragment kurang!');return;}G.rodFragments-=d.fromQty;}
  if(d.fromType==='gems'){if(G.gems<d.fromQty){showToast('Gems kurang!');return;}G.gems-=d.fromQty;}
  // Reward
  if(d.toType==='coins')G.coins+=d.toQty;
  if(d.toType==='bait'){G.ownedBaits[d.toId]=(G.ownedBaits[d.toId]||0)+d.toQty;}
  G.dailyClaimed[today][did]=true;
  showToast('✅ Daily reward: '+d.to+'!');
  updateHUD(); renderDaily(); saveG();
}

/* ═════════════════════════
   FISH HELPERS
═════════════════════════ */
function getAllFish(){
  const res=[];
  for(const[id,info]of Object.entries(G.inventory)){
    const cnt=typeof info==='object'?info.count:info;
    const tw=typeof info==='object'?info.totalWeight:0;
    if(cnt<=0)continue;
    for(const[rarity,arr]of Object.entries(FISH_DATA)){const fish=arr.find(f=>f.id===id);if(fish){res.push({fish,rarity,count:cnt,totalWeight:tw});break;}}
  }
  return res;
}

function countFishByRarity(rarity){
  let cnt=0;
  FISH_DATA[rarity].forEach(fish=>{const inv=G.inventory[fish.id];if(inv){cnt+=typeof inv==='object'?inv.count:inv;}});
  return cnt;
}

function removeFishByRarity(rarity,n){
  let rem=n;
  for(const fish of FISH_DATA[rarity]){
    if(rem<=0)break;
    const inv=G.inventory[fish.id];if(!inv)continue;
    const cnt=typeof inv==='object'?inv.count:inv;
    const take=Math.min(rem,cnt);
    if(typeof G.inventory[fish.id]==='object')G.inventory[fish.id].count-=take;
    else G.inventory[fish.id]-=take;
    if((typeof G.inventory[fish.id]==='object'?G.inventory[fish.id].count:G.inventory[fish.id])<=0)delete G.inventory[fish.id];
    rem-=take;
  }
}

/* ═════════════════════════
   MISSIONS
═════════════════════════ */
function updateMissions(fish,rarity,weight){
  MISSIONS.forEach(m=>{
    if(G.missionClaimed[m.id])return;
    const p=G.missionProg[m.id]||0;
    if(m.type==='catch_rarity'&&rarity===m.rarity)G.missionProg[m.id]=Math.min(p+1,m.target);
    if(m.type==='total_catch')G.missionProg[m.id]=G.totalCaught;
    if(m.type==='heavy_catch'&&weight>=50)G.missionProg[m.id]=1;
    if(m.type==='earn_coins')G.missionProg[m.id]=G.totalCoinsEarned;
    if(m.type==='earn_frags')G.missionProg[m.id]=G.rodFragments;
  });
  renderMissions();
}

function renderMissions(){
  const list=document.getElementById('misi-list');if(!list)return;
  const ready=MISSIONS.filter(m=>{const p=G.missionProg[m.id]||0,t=m.target||1;return!G.missionClaimed[m.id]&&p>=t;}).length;
  setText('misi-badge',ready+' klaim');
  list.innerHTML=MISSIONS.map(m=>{
    const p=G.missionProg[m.id]||0,t=m.target||1,pct=Math.min((p/t)*100,100);
    const done=p>=t,claimed=G.missionClaimed[m.id];
    return `<div class="misi-card ${claimed?'claimed':done?'done':''}">
      <div class="mc-head"><div class="mc-title">${claimed?'✅ ':done?'🎉 ':'🎯 '}${m.title}</div><div class="mc-rwd">${m.rl}</div></div>
      <div class="mc-desc">${m.desc}</div>
      <div class="mc-bar"><div class="mc-fill" style="width:${pct}%"></div></div>
      <div class="mc-foot"><div class="mc-cnt">${Math.min(p,t)}/${t}</div>
        <button class="btn-claim" data-id="${m.id}" ${!done||claimed?'disabled':''}>${claimed?'Claimed':done?'🎁 Klaim!':'...'}</button>
      </div>
    </div>`;
  }).join('');
  list.querySelectorAll('.btn-claim:not([disabled])').forEach(b=>b.addEventListener('click',()=>claimMission(b.dataset.id)));
}

function claimMission(id){
  const m=MISSIONS.find(x=>x.id===id);if(!m||G.missionClaimed[id])return;
  G.missionClaimed[id]=true;
  if(m.reward.coins)G.coins+=m.reward.coins;
  if(m.reward.gems)G.gems+=m.reward.gems;
  if(m.reward.xp)addXP(m.reward.xp);
  showToast('🎉 Mission selesai! '+m.rl);
  updateHUD();renderMissions();saveG();
}

/* ═════════════════════════
   PETS
═════════════════════════ */
function renderPets(){
  const grid=document.getElementById('pet-grid');if(!grid)return;
  const ap=G.activePet?PETS.find(p=>p.id===G.activePet):null;
  setText('pet-badge',ap?ap.icon+' '+ap.name+' aktif':'Tidak ada');
  grid.innerHTML=PETS.map(pet=>{
    const owned=G.ownedPets.includes(pet.id),active=G.activePet===pet.id;
    return `<div class="pet-card ${active?'active-pet':owned?'owned':''}">
      <div class="pet-ic">${pet.icon}</div><div class="pet-nm">${pet.name}</div>
      <div class="pet-bn">${pet.desc}</div>
      <div class="pet-st ${active?'pst-a':owned?'pst-o':'pst-c'}">${active?'⭐ Aktif':owned?'✓ Milik':'💰 '+fmt(pet.cost)}</div>
      ${owned?`<button class="btn-equip" data-id="${pet.id}">${active?'Lepas':'Pasang'}</button>`:`<button class="btn-buy-pet" data-id="${pet.id}">Beli ${fmt(pet.cost)}💰</button>`}
    </div>`;
  }).join('');
  grid.querySelectorAll('.btn-equip').forEach(b=>b.addEventListener('click',()=>equipPet(b.dataset.id)));
  grid.querySelectorAll('.btn-buy-pet').forEach(b=>b.addEventListener('click',()=>buyPet(b.dataset.id)));
}
function equipPet(id){G.activePet=G.activePet===id?null:id;const p=PETS.find(x=>x.id===id);showToast(G.activePet?p.icon+' '+p.name+' dipasang!':'Pet dilepas');renderPets();updateHUD();saveG();}
function buyPet(id){const p=PETS.find(x=>x.id===id);if(!p||G.ownedPets.includes(id)){showToast('Sudah punya!');return;}if(G.coins<p.cost){showToast('💸 Butuh '+fmt(p.cost)+'💰');return;}G.coins-=p.cost;G.ownedPets.push(id);showToast('🎉 '+p.icon+' '+p.name+' dibeli!');renderPets();updateHUD();saveG();}

/* ═════════════════════════
   MAP
═════════════════════════ */
function renderMap(){
  const grid=document.getElementById('map-grid');if(!grid)return;
  grid.innerHTML=MAPS_DATA.map(m=>`
    <div class="map-card ${G.currentMap===m.id?'sel':''}" data-id="${m.id}" style="background:${m.bg}">
      <div class="mc-em">${m.emoji}</div><div class="mc-nm">${m.name}</div>
      <div class="mc-dc">${m.desc}</div><div class="mc-bn">${m.bl}</div>
    </div>`).join('');
  grid.querySelectorAll('.map-card').forEach(c=>c.addEventListener('click',()=>selectMap(c.dataset.id)));
}
function selectMap(id){G.currentMap=id;const m=MAPS_DATA.find(x=>x.id===id);showToast('🗺️ Pindah ke '+m.name);renderMap();updateHUD();saveG();}

/* ═════════════════════════
   SETTINGS
═════════════════════════ */
function renderAchievements(){
  const grid=document.getElementById('ach-grid'); if(!grid)return;
  const done=(G.achievementsDone&&Object.keys(G.achievementsDone).length)||0;
  const badge=document.getElementById('ach-badge'); if(badge)badge.textContent=done+'/'+ACHIEVEMENTS.length+' selesai';
  grid.innerHTML=ACHIEVEMENTS.map(a=>{
    const isDone=G.achievementsDone?.[a.id];
    const pMap={total_catch:G.totalCaught,combo:G.bestCombo,heavy_catch:G.heaviestCatch,mythic_catch:G.mythicCount,login_streak:G.loginStreak,own_rod:G.ownedRods.includes(a.target)?1:0};
    const prog=typeof a.target==='number'?Math.min(pMap[a.type]||0,a.target):isDone?1:0;
    const pct=typeof a.target==='number'?Math.min((prog/a.target)*100,100):isDone?100:0;
    return `<div class="ach-card ${isDone?'ach-done':''}">
      <div class="ach-ico">${a.icon}</div>
      <div class="ach-nm">${a.name}</div>
      <div class="ach-desc">${a.desc}</div>
      <div class="ach-rwd">${a.reward.coins?'+'+a.reward.coins+'💰':''} ${a.reward.gems?'+'+a.reward.gems+'💎':''}</div>
      <div class="ach-bar"><div class="ach-fill" style="width:${pct}%"></div></div>
      <div class="ach-prog">${typeof a.target==='number'?prog+'/'+a.target:isDone?'✓ Selesai':'Belum'}</div>
    </div>`;
  }).join('');
}

function renderSettings(){
  const sd=document.getElementById('sdisp');
  if(sd)sd.innerHTML=`Total tangkap: ${G.totalCaught}<br>Coin diperoleh: ${fmt(G.totalCoinsEarned)}💰<br>Terberat: ${G.heaviestCatch}kg<br>Rod Fragments: ${G.rodFragments}<br>Legendary: ${G.legendaryCount} · Mythic: ${G.mythicCount}`;
  const ni=document.getElementById('nm-in');if(ni)ni.value=G.playerName;
  const sf=document.getElementById('tog-sfx');if(sf)sf.checked=G.sfx;
}

/* ═════════════════════════
   SFX
═════════════════════════ */
let _actx=null;
function getActx(){if(!_actx)_actx=new(window.AudioContext||window.webkitAudioContext)();if(_actx.state==='suspended')_actx.resume();return _actx;}
function playSFX(type){
  if(!G.sfx)return;
  try{
    const ctx=getActx();const osc=ctx.createOscillator(),gain=ctx.createGain();osc.connect(gain);gain.connect(ctx.destination);
    const C={cast:{f:330,f2:440,t:'sine',d:.18,v:.2},splash:{f:200,f2:140,t:'sawtooth',d:.28,v:.22},bite:{f:660,f2:900,t:'sine',d:.2,v:.25},reel:{f:280,f2:380,t:'sine',d:.1,v:.12},fight:{f:180,f2:110,t:'square',d:.18,v:.15},miss:{f:220,f2:100,t:'sawtooth',d:.3,v:.18},break:{f:150,f2:80,t:'square',d:.4,v:.2},catch:{f:523,f2:800,t:'sine',d:.35,v:.25},Common:{f:440,f2:560,t:'sine',d:.22,v:.2},Uncommon:{f:523,f2:660,t:'sine',d:.28,v:.22},Rare:{f:660,f2:880,t:'triangle',d:.32,v:.25},Epic:{f:784,f2:1050,t:'triangle',d:.4,v:.28},Legendary:{f:1050,f2:1570,t:'square',d:.55,v:.2},Mythic:{f:1320,f2:2100,t:'sawtooth',d:.9,v:.18},levelup:{f:880,f2:1320,t:'sine',d:.6,v:.28}}[type]||{f:440,f2:550,t:'sine',d:.2,v:.2};
    osc.type=C.t;osc.frequency.setValueAtTime(C.f,ctx.currentTime);osc.frequency.exponentialRampToValueAtTime(C.f2,ctx.currentTime+C.d);
    gain.gain.setValueAtTime(C.v,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+C.d);
    osc.start(ctx.currentTime);osc.stop(ctx.currentTime+C.d+.01);
  }catch(e){}
}

/* ═════════════════════════
   UI HELPERS
═════════════════════════ */
let _tt=null;
function showToast(msg){const el=document.getElementById('toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(_tt);_tt=setTimeout(()=>el.classList.remove('show'),2600);}
function showModal(id){const el=document.getElementById(id);if(el)el.style.display='flex';}
function hideModal(id){const el=document.getElementById(id);if(el)el.style.display='none';}
function setText(id,t){const el=document.getElementById(id);if(el)el.textContent=t;}
function fmt(n){n=Math.floor(n);if(n>=1000000)return(n/1000000).toFixed(1)+'M';if(n>=1000)return(n/1000).toFixed(1)+'K';return n.toString();}

/* ═════════════════════════
   TAB SWITCHING
═════════════════════════ */
const ALL_TABS=['fishing','aquarium','shop','exchange','map','misi','pet','achievements','settings'];

function switchTab(tab){
  document.querySelectorAll('.nb').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  ALL_TABS.forEach(t=>{
    const el=document.getElementById('tab-'+t);if(!el)return;
    if(t===tab){el.style.display='flex';el.classList.add('active');el.classList.remove('hidden');}
    else{el.style.display='none';el.classList.remove('active');el.classList.add('hidden');}
  });
  if(tab==='aquarium')renderAquarium();
  if(tab==='shop')renderShop('rods');
  if(tab==='exchange'){renderTrade();renderCoinTrade();renderFusion();renderDaily();}
  if(tab==='map')renderMap();
  if(tab==='misi')renderMissions();
  if(tab==='pet')renderPets();
  if(tab==='settings')renderSettings();
  if(tab==='achievements')renderAchievements();
}

/* ═════════════════════════
   SCROLLABLE WORLD
═════════════════════════ */
function initScroll(){
  const wc=document.getElementById('world-container');if(!wc)return;
  wc.addEventListener('scroll',()=>{
    if(!scene)return;
    scene.viewX=wc.scrollLeft;
    const sp=scene.getSpotForViewX(wc.scrollLeft);
    if(sp.id!==G.currentSpot){G.currentSpot=sp.id;setText('inf-spot',sp.icon+' '+sp.name);scene._updateSpotLabels();}
  },{passive:true});
  // Hide scroll hint after first scroll
  wc.addEventListener('scroll',()=>{const sh=document.getElementById('scroll-hint');if(sh)sh.style.display='none';},{once:true,passive:true});
}

function initCanvas(){
  const cv=document.getElementById('game-canvas');if(!cv)return;
  const wc=document.getElementById('world-container');
  const wi=document.getElementById('world-inner');
  if(!wc||!wi)return;
  const W=wc.clientWidth||320;
  const H=wc.clientHeight||220;
  scene=new FishScene(cv);
  scene.resize(W,H);
  if(wi){wi.style.width=(W*WORLD_SCALE)+'px';}
  scene.start();
  updateHUD();
}

/* ═════════════════════════
   MAIN INIT
═════════════════════════ */
function init(){
  loadG();

  // Splash button fix (click + touchend)
  const btnStart=document.getElementById('btn-start');
  if(btnStart){
    const go=e=>{e.preventDefault();e.stopPropagation();
      const sp=document.getElementById('splash');const gm=document.getElementById('game');
      if(sp)sp.style.display='none';if(gm)gm.style.display='flex';
      initCanvas();initScroll();setPhase('idle');updateHUD();renderMissions();
      try{getActx();}catch(x){}
    };
    btnStart.addEventListener('click',go);
    btnStart.addEventListener('touchend',go,{passive:false});
  }

  // Bottom nav
  document.querySelectorAll('.nb').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));

  // Fishing buttons
  const cast=document.getElementById('btn-cast');
  if(cast){cast.addEventListener('click',doCast);cast.addEventListener('touchend',e=>{e.preventDefault();doCast();},{passive:false});}
  document.getElementById('btn-cancel')?.addEventListener('click',doCancel);
  const pull=document.getElementById('btn-pull');
  if(pull){pull.addEventListener('click',doPull);pull.addEventListener('touchend',e=>{e.preventDefault();doPull();},{passive:false});}
  const reel=document.getElementById('btn-reel');
  if(reel){reel.addEventListener('click',doReel);reel.addEventListener('touchend',e=>{e.preventDefault();doReel();},{passive:false});}
  document.getElementById('btn-break-r')?.addEventListener('click',()=>{if(scene)scene.doReset();setPhase('idle');});
  document.getElementById('btn-miss-r')?.addEventListener('click',()=>{if(scene)scene.doReset();setPhase('idle');});
  document.getElementById('btn-cont')?.addEventListener('click',()=>{if(scene)scene.doReset();setPhase('idle');});
  document.getElementById('btn-fuse-hint')?.addEventListener('click',()=>switchTab('exchange'));

  // Shop tabs
  document.querySelectorAll('.stab').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.stab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
    const pt=btn.dataset.st;
    document.querySelectorAll('.shop-panel').forEach(p=>{p.classList.remove('active');p.style.display='none';});
    const sp=document.getElementById('st-'+pt);if(sp){sp.classList.add('active');sp.style.display='block';}
    renderShop(pt);
  }));

  // Exchange tabs
  document.querySelectorAll('.etab').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.etab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
    const et=btn.dataset.et;
    document.querySelectorAll('.ex-panel').forEach(p=>{p.classList.remove('active');p.style.display='none';});
    const ep=document.getElementById('et-'+et);if(ep){ep.classList.add('active');ep.style.display='block';}
    if(et==='trade')renderTrade();if(et==='coin')renderCoinTrade();if(et==='mystery'){;}if(et==='fusion')renderFusion();if(et==='daily')renderDaily();
  }));

  // Gacha buttons
  document.querySelectorAll('.btn-gacha').forEach(b=>b.addEventListener('click',()=>{
    const tier=b.dataset.tier,cost=+b.dataset.cost,cur=b.dataset.currency||'coins';
    doGacha(tier,cur,cost);
  }));

  // Aquarium filters
  document.querySelectorAll('.fb').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.fb').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderAquarium(btn.dataset.f);
  }));

  // Level up
  document.getElementById('btn-lvl-ok')?.addEventListener('click',()=>hideModal('modal-lvl'));
  document.getElementById('btn-daily-ok')?.addEventListener('click',()=>hideModal('modal-daily'));

  // Settings
  document.getElementById('tog-sfx')?.addEventListener('change',e=>{G.sfx=e.target.checked;saveG();});
  document.getElementById('nm-in')?.addEventListener('input',e=>{G.playerName=e.target.value.trim()||'Gileg';updateHUD();saveG();});
  document.getElementById('btn-reset')?.addEventListener('click',()=>showModal('modal-rst'));
  document.getElementById('btn-yes-r')?.addEventListener('click',resetG);
  document.getElementById('btn-no-r')?.addEventListener('click',()=>hideModal('modal-rst'));

  // Daily login check
  checkDailyLogin();

  // Starter
  if(!G.totalCaught&&!G.coins){G.coins=200;showToast('🎣 Selamat datang! Dapat 200💰 starter!');saveG();}

  // iOS AudioContext unlock
  document.addEventListener('touchstart',()=>{try{getActx();}catch(e){}},{once:true,passive:true});

  // Resize handler
  window.addEventListener('resize',()=>{if(scene){const wc=document.getElementById('world-container'),wi=document.getElementById('world-inner');const W=wc.clientWidth,H=wc.clientHeight;scene.resize(W,H);if(wi)wi.style.width=(W*WORLD_SCALE)+'px';}});

  // Daily timer tick
  setInterval(()=>{const dt=document.getElementById('daily-timer');if(dt&&document.getElementById('tab-exchange')?.classList.contains('active'))renderDaily();},1000);
}

document.addEventListener('DOMContentLoaded',init);
