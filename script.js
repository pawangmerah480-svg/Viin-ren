/* ═══════════════════════════════════════════════
   CRYPTO FISHING TYCOON — script.js  v4.0
   Fish It Gileg Edition
   + Scrollable Canvas World  + Fishing Spots
   + Exchange Center          + Mystery Box
   + Fish Fusion              + Daily Exchange
   + Daily Login Bonus        + Rod Fragments
═══════════════════════════════════════════════ */
'use strict';

/* ══════════════════════════════════
   1. DATA & CONSTANTS
══════════════════════════════════ */
const WEIGHT_RANGE = {
  Common:[0.5,2], Uncommon:[1,5], Rare:[3,15],
  Epic:[10,50], Legendary:[30,150], Mythic:[100,300],
};

function sizeLabel(kg) {
  if (kg < 2)  return 'Kecil';
  if (kg < 10) return 'Sedang';
  if (kg < 50) return 'Besar';
  return 'Monster';
}

const RODS = [
  { id:'basic',  name:'Basic Rod',   icon:'🎣', maxKg:10,  bonus:{},             cost:0,     xpMul:1   },
  { id:'trader', name:'Trader Rod',  icon:'🎣', maxKg:25,  bonus:{Rare:2},       cost:500,   xpMul:1.2 },
  { id:'sultan', name:'Sultan Rod',  icon:'🎣', maxKg:60,  bonus:{Epic:3},       cost:1500,  xpMul:1.5 },
  { id:'whale',  name:'Whale Rod',   icon:'🎣', maxKg:150, bonus:{Legendary:3},  cost:5000,  xpMul:2   },
  { id:'god',    name:'God Rod',     icon:'🪄', maxKg:500, bonus:{Mythic:4},     cost:20000, xpMul:3   },
];

const BAITS = [
  { name:'Basic Bait',     waitMin:3000, waitMax:5000, cost:0    },
  { name:'Pro Bait',       waitMin:2000, waitMax:3800, cost:200  },
  { name:'Turbo Bait',     waitMin:1200, waitMax:2500, cost:700  },
  { name:'Legendary Bait', waitMin:600,  waitMax:1500, cost:2000 },
];

const FISH_DATA = {
  Common: [
    { id:'doge',    name:'Dogecoin (DOGE)',              icon:'🐟', baseVal:28  },
    { id:'shib',    name:'Shiba Inu (SHIB)',             icon:'🐟', baseVal:22  },
    { id:'ada',     name:'Cardano (ADA)',                icon:'🐟', baseVal:32  },
    { id:'matic',   name:'Polygon (MATIC)',              icon:'🐟', baseVal:27  },
    { id:'usd_idr', name:'USD/IDR',                      icon:'🐟', baseVal:35  },
    { id:'eur_usd', name:'EUR/USD',                      icon:'🐟', baseVal:33  },
    { id:'bbri',    name:'Bank Rakyat (BBRI)',           icon:'🐟', baseVal:40  },
    { id:'tlkm',    name:'Telkom (TLKM)',                icon:'🐟', baseVal:36  },
  ],
  Uncommon: [
    { id:'sol',     name:'Solana (SOL)',                 icon:'🐠', baseVal:85  },
    { id:'dot',     name:'Polkadot (DOT)',               icon:'🐠', baseVal:80  },
    { id:'avax',    name:'Avalanche (AVAX)',             icon:'🐠', baseVal:90  },
    { id:'link',    name:'Chainlink (LINK)',             icon:'🐠', baseVal:83  },
    { id:'gbp_usd', name:'GBP/USD',                      icon:'🐠', baseVal:95  },
    { id:'usd_jpy', name:'USD/JPY',                      icon:'🐠', baseVal:90  },
    { id:'bbca',    name:'Bank BCA (BBCA)',              icon:'🐠', baseVal:105 },
    { id:'bmri',    name:'Bank Mandiri (BMRI)',          icon:'🐠', baseVal:100 },
  ],
  Rare: [
    { id:'bnb',     name:'Binance Coin (BNB)',           icon:'🐡', baseVal:200 },
    { id:'ltc',     name:'Litecoin (LTC)',               icon:'🐡', baseVal:185 },
    { id:'atom',    name:'Cosmos (ATOM)',                icon:'🐡', baseVal:195 },
    { id:'xrp',     name:'XRP',                         icon:'🐡', baseVal:215 },
    { id:'aud_usd', name:'AUD/USD',                      icon:'🐡', baseVal:230 },
    { id:'usd_chf', name:'USD/CHF',                      icon:'🐡', baseVal:220 },
    { id:'asii',    name:'Astra (ASII)',                 icon:'🐡', baseVal:250 },
    { id:'unvr',    name:'Unilever (UNVR)',              icon:'🐡', baseVal:240 },
  ],
  Epic: [
    { id:'eth',     name:'Ethereum (ETH)',               icon:'🐙', baseVal:500 },
    { id:'ripple',  name:'Ripple (XRP)',                 icon:'🐙', baseVal:475 },
    { id:'eur_jpy', name:'EUR/JPY',                      icon:'🐙', baseVal:530 },
    { id:'gbp_jpy', name:'GBP/JPY',                      icon:'🐙', baseVal:520 },
    { id:'indf',    name:'Indofood (INDF)',              icon:'🐙', baseVal:550 },
    { id:'ggrm',    name:'Gudang Garam (GGRM)',         icon:'🐙', baseVal:570 },
  ],
  Legendary: [
    { id:'btc',     name:'Bitcoin (BTC)',                icon:'🐋', baseVal:1400 },
    { id:'eth_btc', name:'ETH/BTC',                      icon:'🐋', baseVal:1300 },
    { id:'usd_cad', name:'USD/CAD',                      icon:'🐋', baseVal:1200 },
    { id:'bbni',    name:'Bank BNI (BBNI)',              icon:'🐋', baseVal:1500 },
  ],
  Mythic: [
    { id:'satoshi',    name:'Satoshi Coin',              icon:'🐉', baseVal:4500 },
    { id:'qbtc',       name:'Quantum Bitcoin',           icon:'🐉', baseVal:5500 },
    { id:'gmwhale',    name:'Global Market Whale',       icon:'🐉', baseVal:7000 },
    { id:'idx_dragon', name:'IDX Dragon Asset',          icon:'🐉', baseVal:7500 },
  ],
};

const RARITY_PRICE_MUL = { Common:1, Uncommon:1.5, Rare:2.5, Epic:4, Legendary:8, Mythic:20 };
const BASE_RATES = { Common:55, Uncommon:20, Rare:12, Epic:7, Legendary:4, Mythic:2 };

const MAPS = [
  { id:'river',  name:'River Market',  emoji:'🌊', desc:'Saham Indonesia umum',  bonus:{Common:10},   bl:'+10% Common',   bg:'linear-gradient(135deg,#1a6fa3,#0d4a7a)', skyA:'#87ceeb', skyB:'#ffe0b2' },
  { id:'forex',  name:'Forex Ocean',   emoji:'💹', desc:'Pair forex dunia',      bonus:{Rare:5},      bl:'+5% Rare',      bg:'linear-gradient(135deg,#0a4f7a,#062040)', skyA:'#4682b4', skyB:'#b8d4e8' },
  { id:'crypto', name:'Crypto Sea',    emoji:'🪙', desc:'Cryptocurrency top',    bonus:{Epic:5},      bl:'+5% Epic',      bg:'linear-gradient(135deg,#1a3a7a,#0a1f5a)', skyA:'#3a4fa0', skyB:'#8898cc' },
  { id:'abyss',  name:'Whale Abyss',   emoji:'🌌', desc:'Legendary & Mythic!',  bonus:{Legendary:5}, bl:'+5% Legendary', bg:'linear-gradient(135deg,#1a0a5a,#300a8a)', skyA:'#1a0040', skyB:'#4a2080' },
  { id:'trench', name:'Mythic Trench', emoji:'🐉', desc:'Zona eksklusif Mythic', bonus:{Mythic:3},    bl:'+3% Mythic',    bg:'linear-gradient(135deg,#3a0a6a,#1a0040)', skyA:'#0a0020', skyB:'#2a0060' },
];

// ── FISHING SPOTS (in scrollable world) ──
const SPOTS = [
  { id:'shallow', name:'Shallow Water', emoji:'🌿', desc:'Ikan kecil banyak!',  bonus:{Common:15},             worldFrac:0.1 },
  { id:'river',   name:'River Center',  emoji:'🌊', desc:'Semua jenis ikan',    bonus:{},                      worldFrac:0.38 },
  { id:'deep',    name:'Deep Pool',     emoji:'🌑', desc:'Ikan besar lurk!',    bonus:{Rare:8, Epic:3},        worldFrac:0.63 },
  { id:'rocks',   name:'Rock Area',     emoji:'🪨', desc:'Rare & Epic hide!',   bonus:{Epic:5, Legendary:2},   worldFrac:0.87 },
];

const WORLD_SCALE = 3.5; // canvas world is 3.5x visible width

// ── PETS ──
const PETS = [
  { id:'koi',    name:'Lucky Koi',       icon:'🐟', bonus:{Rare:2},              coinMul:1,   xpMul:1,   desc:'+2% Rare',            cost:1000  },
  { id:'octo',   name:'Smart Octopus',   icon:'🐙', bonus:{},                    coinMul:1,   xpMul:1.1, desc:'+10% XP',             cost:2000  },
  { id:'puffer', name:'Treasure Puffer', icon:'🐡', bonus:{},                    coinMul:1.1, xpMul:1,   desc:'+10% Coin',           cost:3500  },
  { id:'dragon', name:'Crypto Dragon',   icon:'🐉', bonus:{Legendary:2,Mythic:1},coinMul:1,  xpMul:1,   desc:'+2%Legend +1%Mythic', cost:10000 },
];

// ── MISSIONS ──
const MISSIONS = [
  { id:'m1', title:'Pemancing Pemula',    desc:'Tangkap 5 ikan Common',           type:'catch_rarity', rarity:'Common',    target:5,  reward:{coins:200,xp:50},          rl:'+200💰 +50XP'    },
  { id:'m2', title:'Trader Forex',        desc:'Tangkap 3 pair Forex',            type:'catch_ids',    ids:['usd_idr','eur_usd','gbp_usd','usd_jpy','aud_usd','usd_chf','eur_jpy','gbp_jpy','usd_cad'], target:3, reward:{coins:400,xp:100}, rl:'+400💰 +100XP' },
  { id:'m3', title:'Crypto Hunter',       desc:'Tangkap 5 aset Crypto',           type:'catch_ids',    ids:['doge','shib','ada','matic','sol','dot','avax','link','bnb','ltc','atom','xrp','eth','ripple','btc','eth_btc','satoshi','qbtc','gmwhale','idx_dragon'], target:5, reward:{coins:500,xp:150}, rl:'+500💰 +150XP' },
  { id:'m4', title:'Penangkap Legendaris',desc:'Tangkap 1 ikan Legendary',        type:'catch_rarity', rarity:'Legendary', target:1,  reward:{coins:1000,gems:2,xp:300}, rl:'+1000💰 +2💎'   },
  { id:'m5', title:'Sultan Saham',        desc:'Tangkap saham BBCA dan BBRI',     type:'catch_both',   ids:['bbca','bbri'],                                               reward:{coins:600,xp:200},  rl:'+600💰 +200XP'   },
  { id:'m6', title:'Pencari Mythic',      desc:'Tangkap 1 ikan Mythic',           type:'catch_rarity', rarity:'Mythic',    target:1,  reward:{coins:5000,gems:10,xp:1000},rl:'+5000💰 +10💎'  },
  { id:'m7', title:'Kolektor Aquarium',   desc:'Kumpulkan 20 ikan total',          type:'total_catch',                       target:20, reward:{coins:800,xp:250},        rl:'+800💰 +250XP'   },
  { id:'m8', title:'Pancing Kuat!',       desc:'Tangkap ikan berat 50kg+',        type:'heavy_catch',                       target:1,  reward:{gems:3,xp:400},            rl:'+3💎 +400XP'     },
  { id:'m9', title:'Explorer Spot',       desc:'Pancing di semua spot',           type:'spot_catch',                        target:4,  reward:{coins:600,frags:5,xp:300}, rl:'+600💰 +5🔩'    },
  { id:'m10',title:'Master Fusi',         desc:'Lakukan 3x Fish Fusion',          type:'fusion_count',                      target:3,  reward:{gems:5,xp:500},            rl:'+5💎 +500XP'     },
];

// ── EXCHANGE RECIPES ──
const RECIPES = [
  { id:'r1', name:'Common Bait', desc:'5 Common → Bait Gratis',   costType:'rarity', rarity:'Common', amount:5,  reward:{type:'bait', val:0}, cd:0,     icon:'🪱' },
  { id:'r2', name:'Pro Bait',   desc:'3 Uncommon → Pro Bait',    costType:'rarity', rarity:'Uncommon',amount:3, reward:{type:'bait', val:1}, cd:30000, icon:'🦐' },
  { id:'r3', name:'Turbo Bait', desc:'2 Rare → Turbo Bait',       costType:'rarity', rarity:'Rare',   amount:2,  reward:{type:'bait', val:2}, cd:60000, icon:'🎯' },
  { id:'r4', name:'Fragmen',    desc:'300 Coin → 5 Fragment',    costType:'coins',  amount:300,       reward:{type:'frags', val:5}, cd:0,   icon:'🔩' },
  { id:'r5', name:'Frag → Bait',desc:'10 Frag → Legendary Bait', costType:'frags',  amount:10,        reward:{type:'bait', val:3}, cd:120000, icon:'✨' },
  { id:'r6', name:'Rod Upgrade',desc:'20 Frag → Level Rod',       costType:'frags',  amount:20,        reward:{type:'rod_upgrade'},  cd:0,     icon:'🎣' },
];

// ── FUSION RECIPES ──
const FUSIONS = [
  { id:'f1', fromRarity:'Common',    fromCount:3, toRarity:'Uncommon',  cd:0      },
  { id:'f2', fromRarity:'Uncommon',  fromCount:3, toRarity:'Rare',      cd:15000  },
  { id:'f3', fromRarity:'Rare',      fromCount:2, toRarity:'Epic',      cd:60000  },
  { id:'f4', fromRarity:'Epic',      fromCount:2, toRarity:'Legendary', cd:180000 },
  { id:'f5', fromRarity:'Legendary', fromCount:2, toRarity:'Mythic',    cd:600000 },
];

const XP_TABLE = [0,100,250,450,700,1000,1400,1900,2500,3200,4000,5000,6200,7600,9200,11000,13200,15700,18500,21600,25000,30000];
const BITE_WINDOW_MS = 3000;

/* ══════════════════════════════════
   2. GAME STATE
══════════════════════════════════ */
let G = {
  playerName:'Angler', coins:0, gems:0, xp:0, level:1,
  currentMap:'river', rodLevel:0, baitLevel:0,
  activePet:null, ownedPets:[],
  inventory:{},
  totalCaught:0, totalCoinsEarned:0, legendaryCount:0, mythicCount:0,
  heaviestCatch:0,
  missionProg:{}, missionClaimed:{},
  sfx:true, music:false,
  // New v4
  fragments:0,
  recipeCooldowns:{},
  fusionCooldowns:{},
  dailyExchangeDate:'', dailyExchangeUsed:{},
  lastLoginDate:'', loginStreak:0,
  spotsVisited:{},
  fusionsDone:0,
  worldScrollX:0,
  currentSpot:'shallow',
};

function saveG()  { try { localStorage.setItem('cft4_save', JSON.stringify(G)); } catch(e){} }
function loadG()  { try { const s=localStorage.getItem('cft4_save'); if(s) G=Object.assign(G,JSON.parse(s)); } catch(e){} }
function resetG() { localStorage.removeItem('cft4_save'); location.reload(); }

/* ══════════════════════════════════
   3. FISHING SCENE (Canvas 2D)
══════════════════════════════════ */
class FishingScene {
  constructor(canvas) {
    this.cv  = canvas;
    this.ctx = canvas.getContext('2d');
    this.t   = 0;
    this.W   = 0; this.H = 0;
    this.waterY  = 0;
    this.rodBase = { x:0, y:0 };
    this.rodTip  = { x:0, y:0 };
    this.bobber  = { x:0, y:0, visible:false, ripple:0, biting:false };
    this.line    = { active:false };
    this.fishes  = [];
    this.effects = [];
    this.worldObjects = []; // trees, rocks, ducks
    this.spawnTimer = null;
    this.running = false;
    this.phase = 'idle';
    this.onBite = null;
    this.onCastDone = null;
    // Scroll
    this.worldW  = 0;   // total world width
    this.scrollX = 0;   // current scroll (0 = leftmost)
    this.maxScrollX = 0;
    this.isDragging  = false;
    this.dragStartX  = 0;
    this.dragStartScroll = 0;
    this.lastDragX   = 0;
    this.velocity    = 0;
  }

  resize() {
    const wrap = this.cv.parentElement;
    const W = wrap.clientWidth  || 320;
    const H = this.cv.clientHeight || 220;
    const dpr = window.devicePixelRatio || 1;
    this.cv.width  = W * dpr;
    this.cv.height = H * dpr;
    this.cv.style.width  = W + 'px';
    this.cv.style.height = H + 'px';
    this.ctx.scale(dpr, dpr);
    this.W = W; this.H = H;
    this.waterY  = H * 0.47;
    this.rodBase = { x: W * 0.82, y: H * 0.12 };
    this.rodTip  = { x: W * 0.55, y: H * 0.26 };
    this.worldW = W * WORLD_SCALE;
    this.maxScrollX = this.worldW - W;
    this.scrollX = Math.min(this.scrollX, this.maxScrollX);
    this._buildWorldObjects();
    this._updateCurrentSpot();
    updateSpotHUD();
  }

  _buildWorldObjects() {
    this.worldObjects = [];
    const W = this.worldW, H = this.H, wy = this.waterY;
    // Trees along the shore (above waterline)
    const treePositions = [0.04,0.12,0.22,0.31,0.44,0.55,0.67,0.78,0.88,0.95];
    treePositions.forEach((fx,i) => {
      this.worldObjects.push({ type:'tree', wx: fx*W, wy: wy - 5, variant: i%3 });
    });
    // Rocks at water edge
    const rockPos = [0.08,0.18,0.35,0.50,0.62,0.75,0.91];
    rockPos.forEach((fx,i) => {
      this.worldObjects.push({ type:'rock', wx: fx*W, wy: wy + 4, sz: 8+i%3*4 });
    });
    // Lily pads on water
    const lilyPos = [0.14,0.28,0.42,0.58,0.71,0.85];
    lilyPos.forEach((fx) => {
      this.worldObjects.push({ type:'lily', wx: fx*W, wy: wy+8 });
    });
    // Ducks (animated)
    this.worldObjects.push({ type:'duck', wx: W*0.2,  wy: wy+6, vx:0.3, minX:W*0.05,  maxX:W*0.35 });
    this.worldObjects.push({ type:'duck', wx: W*0.55, wy: wy+5, vx:-0.25, minX:W*0.40, maxX:W*0.70 });
    this.worldObjects.push({ type:'duck', wx: W*0.80, wy: wy+7, vx:0.2,  minX:W*0.65, maxX:W*0.95 });
    // Log / floating wood
    const logPos = [0.25, 0.60, 0.82];
    logPos.forEach(fx => {
      this.worldObjects.push({ type:'log', wx: fx*W, wy: wy+2, sz: 22+Math.random()*12 });
    });
    // Spot marker flags
    SPOTS.forEach(sp => {
      this.worldObjects.push({ type:'flag', wx: sp.worldFrac * W, wy: wy - 50, spot: sp });
    });
  }

  _updateCurrentSpot() {
    if (!this.W) return;
    const frac = this.scrollX / this.maxScrollX;
    let nearest = SPOTS[0], minDist = 999;
    SPOTS.forEach(sp => {
      // Map worldFrac to scroll fraction: spotScrollX = sp.worldFrac * (worldW-W) -- approximate
      const spotFrac = sp.worldFrac;
      const d = Math.abs(frac - spotFrac);
      if (d < minDist) { minDist = d; nearest = sp; }
    });
    G.currentSpot = nearest.id;
    G.spotsVisited = G.spotsVisited || {};
    G.spotsVisited[nearest.id] = true;
    // Update spot visit mission
    if (!G.missionProg) G.missionProg = {};
    G.missionProg['m9'] = Object.keys(G.spotsVisited).length;
  }

  /* ── TOUCH/MOUSE DRAG for scroll ── */
  attachDragEvents() {
    const cv = this.cv;
    // Touch
    cv.addEventListener('touchstart', e => {
      if (this.phase !== 'idle' && this.phase !== 'waiting') return;
      this.isDragging = true;
      this.dragStartX = e.touches[0].clientX;
      this.dragStartScroll = this.scrollX;
      this.velocity = 0;
    }, { passive:true });
    cv.addEventListener('touchmove', e => {
      if (!this.isDragging) return;
      const dx = this.dragStartX - e.touches[0].clientX;
      this.velocity = e.touches[0].clientX - this.lastDragX;
      this.lastDragX = e.touches[0].clientX;
      this.scrollX = Math.max(0, Math.min(this.maxScrollX, this.dragStartScroll + dx));
      this._updateCurrentSpot();
      updateSpotHUD();
    }, { passive:true });
    cv.addEventListener('touchend', () => {
      this.isDragging = false;
      // Momentum scrolling
      let vel = -this.velocity;
      const momentum = () => {
        if (Math.abs(vel) < 0.5) return;
        this.scrollX = Math.max(0, Math.min(this.maxScrollX, this.scrollX + vel));
        vel *= 0.88;
        this._updateCurrentSpot();
        updateSpotHUD();
        requestAnimationFrame(momentum);
      };
      requestAnimationFrame(momentum);
    }, { passive:true });
    // Mouse
    cv.addEventListener('mousedown', e => {
      if (this.phase !== 'idle' && this.phase !== 'waiting') return;
      this.isDragging = true;
      this.dragStartX = e.clientX;
      this.dragStartScroll = this.scrollX;
      this.velocity = 0;
    });
    cv.addEventListener('mousemove', e => {
      if (!this.isDragging) return;
      const dx = this.dragStartX - e.clientX;
      this.velocity = e.clientX - this.lastDragX;
      this.lastDragX = e.clientX;
      this.scrollX = Math.max(0, Math.min(this.maxScrollX, this.dragStartScroll + dx));
      this._updateCurrentSpot();
      updateSpotHUD();
    });
    cv.addEventListener('mouseup', () => { this.isDragging = false; });
    cv.addEventListener('mouseleave', () => { this.isDragging = false; });
  }

  start() { if(this.running) return; this.running=true; this._loop(); }
  stop()  { this.running=false; if(this._raf) cancelAnimationFrame(this._raf); }

  _loop() {
    if (!this.running) return;
    this.t += 0.016;
    this._update();
    this._draw();
    this._raf = requestAnimationFrame(() => this._loop());
  }

  _update() {
    // Update fish
    this.fishes.forEach(f => {
      if (f.state === 'swimming') {
        f.x  += f.vx;
        f.y  += Math.sin(this.t * f.freq + f.phase) * f.amplitude;
        if (f.canBite && this.bobber.visible) {
          const bx = this.bobber.x; // screen coords
          const dx = Math.abs(f.x - (bx + this.scrollX));
          const dy = Math.abs(f.y - this.waterY);
          if (dx < 22 && dy < 18) {
            f.state = 'biting';
            this.bobber.biting = true;
            this.bobber.ripple = 1;
            this._doSpawnSplash(bx, this.waterY, 12);
            this._doSpawnBubbles(bx, this.waterY, 7);
            if (this.onBite) this.onBite();
            return;
          }
        }
        if (f.x > this.worldW + 80 || f.x < -80) f.dead = true;
      }
    });
    this.fishes = this.fishes.filter(f => !f.dead);

    // Update duck positions
    this.worldObjects.forEach(o => {
      if (o.type === 'duck') {
        o.wx += o.vx;
        if (o.wx > o.maxX || o.wx < o.minX) o.vx *= -1;
      }
    });

    // Effects
    this.effects.forEach(e => {
      e.life -= 0.02;
      e.x += (e.vx || 0);
      e.y += (e.vy || 0);
      if (e.type === 'particle') e.vy += 0.06;
      if (e.type === 'bubble')   e.vy -= 0.04;
      if (e.r_grow) e.r += 0.4;
    });
    this.effects = this.effects.filter(e => e.life > 0);
    if (this.bobber.ripple > 0) this.bobber.ripple -= 0.018;
  }

  /* ── DRAW ── */
  _draw() {
    const ctx = this.ctx, W = this.W, H = this.H, wy = this.waterY;
    ctx.clearRect(0, 0, W, H);

    const map = MAPS.find(m => m.id === G.currentMap) || MAPS[0];
    const sx = this.scrollX;

    // Sky gradient
    const sg = ctx.createLinearGradient(0,0,0,wy);
    sg.addColorStop(0, map.skyA || '#87ceeb');
    sg.addColorStop(1, map.skyB || '#ffe0b2');
    ctx.fillStyle = sg; ctx.fillRect(0,0,W,wy);

    this._drawClouds(ctx,W,wy,sx);

    // Draw world objects (clipped to screen)
    this.worldObjects.forEach(o => {
      const sx_ = o.wx - sx;
      if (sx_ < -80 || sx_ > W+80) return;
      if (o.type==='tree')  this._drawTree(ctx, sx_, o.wy, o.variant);
      if (o.type==='rock')  this._drawRock(ctx, sx_, o.wy, o.sz);
      if (o.type==='lily')  this._drawLily(ctx, sx_, o.wy);
      if (o.type==='log')   this._drawLog(ctx, sx_, o.wy, o.sz);
      if (o.type==='flag')  this._drawFlag(ctx, sx_, o.wy, o.spot);
      if (o.type==='duck')  this._drawDuck(ctx, sx_, o.wy);
    });

    // Water body
    const wg = ctx.createLinearGradient(0,wy,0,H);
    const isDeep = ['abyss','trench'].includes(G.currentMap);
    wg.addColorStop(0,   isDeep ? '#1a0560' : '#1e6fa3');
    wg.addColorStop(0.4, isDeep ? '#0a0240' : '#0d2b4e');
    wg.addColorStop(1,   '#060e1f');
    ctx.fillStyle = wg; ctx.fillRect(0,wy,W,H-wy);

    this._drawWaves(ctx,W,wy,sx);
    this._drawSeaweed(ctx,W,H,wy,sx);
    this._drawUwBubbles(ctx,W,H,wy);

    // Scroll position indicator (mini bar)
    this._drawScrollBar(ctx,W,H);

    // Fishing rod
    this._drawRod(ctx);

    // Fishing line
    if (this.line.active && this.bobber.visible) {
      const bY = this.bobber.biting ? this.waterY+8 : this.waterY+Math.sin(this.t*2.5)*3;
      ctx.beginPath();
      ctx.moveTo(this.rodTip.x, this.rodTip.y);
      ctx.lineTo(this.bobber.x, bY);
      ctx.strokeStyle = this.bobber.biting ? 'rgba(255,150,0,.85)' : 'rgba(255,255,255,.55)';
      ctx.lineWidth = this.bobber.biting ? 1.8 : 1; ctx.stroke();
    }

    // Bobber
    if (this.bobber.visible) {
      const bY = this.bobber.biting
        ? this.waterY+8+Math.sin(this.t*6)*4
        : this.waterY+Math.sin(this.t*2.5)*3;
      this._drawBobber(ctx, this.bobber.x, bY);
      if (this.bobber.ripple > 0)
        this._drawRipple(ctx, this.bobber.x, this.waterY, this.bobber.ripple*25, this.bobber.ripple*.5);
    }

    // World fish
    this.fishes.forEach(f => {
      const screenX = f.x - sx;
      if (screenX > -50 && screenX < W+50) this._drawFish(ctx, f, screenX);
    });

    // Effects (screen coords)
    this.effects.forEach(e => this._drawEffect(ctx,e));
  }

  _drawScrollBar(ctx,W,H) {
    if (this.maxScrollX <= 0) return;
    const pct = this.scrollX / this.maxScrollX;
    const barW = 60, barH = 3;
    const x = (W - barW) / 2, y = H - 6;
    ctx.fillStyle = 'rgba(255,255,255,.1)';
    ctx.beginPath(); ctx.roundRect(x,y,barW,barH,2); ctx.fill();
    const thumbW = Math.max(8, barW / WORLD_SCALE);
    ctx.fillStyle = 'rgba(46,168,213,.6)';
    ctx.beginPath(); ctx.roundRect(x + pct*(barW-thumbW), y, thumbW, barH, 2); ctx.fill();
  }

  _drawClouds(ctx,W,wy,sx) {
    const cx = [
      W*0.1 + Math.sin(this.t*.06)*W*.15  + (sx*.06 % W),
      W*0.45 + Math.sin(this.t*.05+1)*W*.12 + (sx*.04 % W),
      W*0.8  + Math.sin(this.t*.07+2)*W*.1  + (sx*.05 % W),
    ];
    const cy = [wy*.25, wy*.38, wy*.18];
    cx.forEach((x,i) => {
      ctx.save(); ctx.globalAlpha=0.5; ctx.fillStyle='#fff';
      ctx.beginPath();
      ctx.arc(x, cy[i], 14,0,Math.PI*2);
      ctx.arc(x+16, cy[i]-5, 11,0,Math.PI*2);
      ctx.arc(x+32, cy[i], 14,0,Math.PI*2);
      ctx.fill(); ctx.restore();
    });
  }

  _drawTree(ctx, x, y, variant) {
    const trunkH = 22 + variant*4;
    // Trunk
    ctx.fillStyle = '#6B3A2A';
    ctx.fillRect(x-3, y-trunkH, 6, trunkH);
    // Foliage layers
    const colors = ['#1a7a2a','#228b2a','#2d9e3a'];
    ctx.fillStyle = colors[variant] || '#1a7a2a';
    ctx.beginPath(); ctx.arc(x, y-trunkH-12, 14+variant*2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = colors[(variant+1)%3];
    ctx.beginPath(); ctx.arc(x, y-trunkH-22, 10+variant, 0, Math.PI*2); ctx.fill();
  }

  _drawRock(ctx, x, y, sz) {
    ctx.fillStyle = '#556';
    ctx.beginPath();
    ctx.ellipse(x, y+sz/2, sz, sz*.55, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#778';
    ctx.beginPath();
    ctx.ellipse(x-2, y+sz*.3, sz*.65, sz*.35, -0.2, 0, Math.PI*2); ctx.fill();
  }

  _drawLily(ctx, x, y) {
    ctx.fillStyle = '#1a7a3a';
    ctx.beginPath(); ctx.ellipse(x, y, 10, 6, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#e84393';
    ctx.beginPath(); ctx.arc(x, y-3, 3, 0, Math.PI*2); ctx.fill();
  }

  _drawLog(ctx, x, y, sz) {
    ctx.fillStyle = '#7B4F2E';
    ctx.beginPath(); ctx.ellipse(x, y, sz, 6, 0, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#5A3820'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.ellipse(x, y, sz, 6, 0, 0, Math.PI*2); ctx.stroke();
    ctx.strokeStyle = '#9B6F4E'; ctx.lineWidth=1;
    for(let i=-2;i<=2;i++) {
      ctx.beginPath(); ctx.moveTo(x+i*sz*.2, y-5); ctx.lineTo(x+i*sz*.2, y+5); ctx.stroke();
    }
  }

  _drawFlag(ctx, x, y, spot) {
    // Pole
    ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y+55); ctx.stroke();
    // Flag
    const col = {shallow:'#2ecc71',river:'#3498db',deep:'#9b59b6',rocks:'#e67e22'}[spot.id]||'#3498db';
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x+18, y+6); ctx.lineTo(x, y+12); ctx.fill();
    // Label
    ctx.fillStyle = 'rgba(255,255,255,.8)';
    ctx.font = 'bold 7px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(spot.emoji + spot.name.split(' ')[0], x, y+14);
  }

  _drawDuck(ctx, x, y) {
    ctx.save();
    ctx.font = '14px serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('🦆', x, y);
    ctx.restore();
  }

  _drawWaves(ctx,W,wy,sx) {
    ctx.beginPath();
    ctx.strokeStyle='rgba(255,255,255,.28)'; ctx.lineWidth=1.5;
    for(let x=0;x<=W;x+=3) {
      const y = wy+Math.sin((x+sx)*0.025+this.t*2.2)*3+Math.sin((x+sx)*0.055+this.t*1.5)*1.5;
      x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle='rgba(255,255,255,.1)'; ctx.lineWidth=4;
    for(let x=0;x<=W;x+=3) {
      const y = wy+Math.sin((x+sx)*0.025+this.t*2.2)*3;
      x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.stroke();
  }

  _drawSeaweed(ctx,W,H,wy,sx) {
    const positions = [W*.08, W*.38, W*.68, W*.88];
    positions.forEach((px,i) => {
      const sway = Math.sin(this.t*1.4+i*1.2)*6;
      const h = 28+i*7;
      ctx.beginPath(); ctx.moveTo(px,H);
      ctx.quadraticCurveTo(px+sway, H-h*.6, px+sway*1.4, H-h);
      ctx.strokeStyle='#1a7a2a'; ctx.lineWidth=3; ctx.lineCap='round'; ctx.stroke();
      ctx.beginPath(); ctx.arc(px+sway*1.4, H-h, 5,0,Math.PI*2);
      ctx.fillStyle='#2a9a3a'; ctx.fill();
    });
  }

  _drawUwBubbles(ctx,W,H,wy) {
    for(let i=0;i<6;i++) {
      const bx = W*(0.08+i*.17);
      const by = wy+(H-wy)*.8-((this.t*14+i*17)%(H-wy));
      ctx.beginPath(); ctx.arc(bx,by,2,0,Math.PI*2);
      ctx.strokeStyle='rgba(255,255,255,.2)'; ctx.lineWidth=1; ctx.stroke();
    }
  }

  _drawRod(ctx) {
    const {x:bx,y:by}=this.rodBase, {x:tx,y:ty}=this.rodTip;
    ctx.beginPath(); ctx.moveTo(bx+2,by+2); ctx.lineTo(tx+1,ty+1);
    ctx.strokeStyle='rgba(0,0,0,.3)'; ctx.lineWidth=5; ctx.lineCap='round'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(tx,ty);
    const rg=ctx.createLinearGradient(bx,by,tx,ty);
    rg.addColorStop(0,'#6B3410'); rg.addColorStop(1,'#C8A06A');
    ctx.strokeStyle=rg; ctx.lineWidth=4; ctx.stroke();
    for(let i=0;i<3;i++) {
      const p=(i+1)/4, gx=bx+(tx-bx)*p, gy=by+(ty-by)*p;
      ctx.beginPath(); ctx.arc(gx,gy,2.5,0,Math.PI*2);
      ctx.fillStyle='#C8A06A'; ctx.fill();
    }
    ctx.beginPath(); ctx.arc(bx,by,5,0,Math.PI*2);
    ctx.fillStyle='#8B4513'; ctx.fill();
    if(this.line.active) {
      ctx.beginPath(); ctx.arc(tx,ty,4,0,Math.PI*2);
      ctx.fillStyle='rgba(79,172,254,.6)'; ctx.fill();
    }
  }

  _drawBobber(ctx,x,y) {
    ctx.beginPath(); ctx.arc(x,y-5,6,Math.PI,0);
    ctx.fillStyle=this.bobber.biting?'#ff8800':'#e74c3c'; ctx.fill();
    ctx.beginPath(); ctx.arc(x,y+2,6,0,Math.PI);
    ctx.fillStyle='#fff'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(x,y-11); ctx.lineTo(x,y-5);
    ctx.strokeStyle='rgba(255,255,255,.6)'; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle='#444'; ctx.fillRect(x-6,y-1,12,2);
    if(this.bobber.biting) {
      ctx.save(); ctx.shadowBlur=14; ctx.shadowColor='#ff6600';
      ctx.beginPath(); ctx.arc(x,y-1,7,0,Math.PI*2);
      ctx.strokeStyle='rgba(255,150,0,.6)'; ctx.lineWidth=2; ctx.stroke();
      ctx.restore();
    }
  }

  _drawRipple(ctx,x,y,r,alpha) {
    if(r<1) return;
    ctx.beginPath(); ctx.arc(x,y+2,r,0,Math.PI*2);
    ctx.strokeStyle=`rgba(255,255,255,${alpha})`; ctx.lineWidth=1.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(x,y+2,r*1.6,0,Math.PI*2);
    ctx.strokeStyle=`rgba(255,255,255,${alpha*.45})`; ctx.lineWidth=1; ctx.stroke();
  }

  _drawFish(ctx,f,screenX) {
    ctx.save();
    ctx.translate(screenX, f.y);
    if(f.vx<0) ctx.scale(-1,1);
    if(f.glow) { ctx.shadowBlur=14; ctx.shadowColor=f.glowColor||'#4facfe'; }
    ctx.font=`${f.sz}px serif`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(f.emoji,0,0);
    ctx.restore();
  }

  _drawEffect(ctx,e) {
    if(e.life<=0) return;
    ctx.save(); ctx.globalAlpha=Math.max(0,e.life);
    if(e.type==='particle') {
      ctx.beginPath(); ctx.arc(e.x,e.y,e.r,0,Math.PI*2);
      ctx.fillStyle=e.color||'#7fd8f8'; ctx.fill();
    } else if(e.type==='bubble') {
      ctx.beginPath(); ctx.arc(e.x,e.y,Math.max(0,e.r),0,Math.PI*2);
      ctx.strokeStyle='rgba(180,220,255,.8)'; ctx.lineWidth=1; ctx.stroke();
    } else if(e.type==='splash') {
      ctx.beginPath(); ctx.arc(e.x,e.y,Math.max(0.1,e.r),0,Math.PI*2);
      ctx.fillStyle='rgba(130,200,255,.7)'; ctx.fill();
    }
    ctx.restore();
  }

  _doSpawnSplash(x,y,n) {
    for(let i=0;i<n;i++) {
      const a=Math.random()*Math.PI*2, sp=1+Math.random()*2.5;
      this.effects.push({type:'particle',x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-2.5,r:1.5+Math.random()*2.5,life:.7+Math.random()*.3,color:'#7fd8f8'});
    }
  }
  _doSpawnBubbles(x,y,n) {
    for(let i=0;i<n;i++) {
      this.effects.push({type:'bubble',x:x+(Math.random()-.5)*20,y:y+5,vy:-(0.3+Math.random()*.5),r:2+Math.random()*3,life:.8+Math.random()*.4});
    }
  }
  _doSpawnRipples(x,y) {
    for(let i=0;i<3;i++) {
      this.effects.push({type:'splash',x,y,r:3+i*4,r_grow:true,vy:0,vx:0,life:.9-i*.2});
    }
  }

  /* ── ACTIONS ── */
  doCast(targetXFrac) {
    this.phase='casting';
    this.fishes=[]; this.effects=[];
    this.bobber.visible=false; this.bobber.biting=false; this.line.active=false;
    if(this.spawnTimer) clearInterval(this.spawnTimer);
    const map=MAPS.find(m=>m.id===G.currentMap)||MAPS[0];
    const mapIdx=MAPS.indexOf(map);
    // Cast to a world position near current scroll center
    const targetScreenX = this.W * (0.2 + (targetXFrac||0)*0.35);
    const sx=this.rodTip.x, sy=this.rodTip.y;
    const ex=targetScreenX, ey=this.waterY;
    const dur=700; const t0=performance.now();
    const flyAnim=(now)=>{
      const p=Math.min((now-t0)/dur,1);
      const ep=p<.5?2*p*p:-1+(4-2*p)*p;
      this.bobber._flyX=sx+(ex-sx)*ep;
      this.bobber._flyY=sy+(ey-sy)*ep-Math.sin(p*Math.PI)*70;
      if(p<1){requestAnimationFrame(flyAnim);return;}
      this.bobber.x=ex; this.bobber.y=ey;
      this.bobber.visible=true; this.bobber.ripple=1;
      this.line.active=true; this.phase='waiting';
      this._doSpawnSplash(ex,ey,14);
      this._doSpawnRipples(ex,ey);
      playSFX('splash');
      this._startSpawning(mapIdx);
      if(this.onCastDone) this.onCastDone();
    };
    requestAnimationFrame(flyAnim);
  }

  _startSpawning(mapIdx) {
    if(this.spawnTimer) clearInterval(this.spawnTimer);
    let spawns=0; const maxSpawns=5+mapIdx; let biterScheduled=false;
    const spawnOne=()=>{
      if(this.phase!=='waiting'){clearInterval(this.spawnTimer);return;}
      this._spawnAmbientFish();
      spawns++;
      if(!biterScheduled && spawns>=1+Math.floor(Math.random()*2)) {
        biterScheduled=true;
        const b=BAITS[G.baitLevel];
        const delay=b.waitMin+Math.random()*(b.waitMax-b.waitMin);
        setTimeout(()=>{ if(this.phase==='waiting') this._spawnBiterFish(); },delay);
      }
      if(spawns>=maxSpawns) clearInterval(this.spawnTimer);
    };
    this.spawnTimer=setInterval(spawnOne,800+Math.random()*600);
    setTimeout(spawnOne,300);
  }

  _spawnAmbientFish() {
    const fromLeft=Math.random()>.5;
    const depth=this.waterY+12+Math.random()*(this.H-this.waterY-25);
    const sp=(0.5+Math.random()*.8)*(fromLeft?1:-1);
    const emojis=['🐟','🐠','🐡','🦈','🐬','🐚'];
    // In world coords
    const startWorldX = fromLeft ? this.scrollX-50 : this.scrollX+this.W+50;
    this.fishes.push({
      x:startWorldX, y:depth, vx:sp,
      freq:1+Math.random()*2, phase:Math.random()*6, amplitude:1+Math.random()*1.5,
      emoji:emojis[Math.floor(Math.random()*emojis.length)],
      sz:18+Math.random()*8,
      state:'swimming', canBite:false, glow:false, dead:false,
    });
  }

  _spawnBiterFish() {
    if(this.phase!=='waiting') return;
    const fromLeft=Math.random()>.5;
    const sp=(1.2+Math.random()*.8)*(fromLeft?1:-1);
    const startWorldX = fromLeft ? this.scrollX-50 : this.scrollX+this.W+50;
    this.fishes.push({
      x:startWorldX, y:this.waterY+8, vx:sp,
      freq:3, phase:0, amplitude:.5,
      emoji:'🐟', sz:24,
      state:'swimming', canBite:true, glow:true, glowColor:'#ffd700', dead:false,
    });
  }

  doBreak() {
    this._doSpawnSplash(this.bobber.x,this.waterY,8);
    this.line.active=false; this.bobber.visible=false; this.bobber.biting=false;
    this.phase='rodbreak';
    if(this.spawnTimer) clearInterval(this.spawnTimer);
  }

  doCatch() {
    this._doSpawnSplash(this.bobber.x,this.waterY,20);
    this._doSpawnBubbles(this.bobber.x,this.waterY,12);
    this._doSpawnRipples(this.bobber.x,this.waterY);
    this.line.active=false; this.bobber.visible=false; this.bobber.biting=false;
    this.fishes=[]; this.phase='result';
    if(this.spawnTimer) clearInterval(this.spawnTimer);
    // Catch fly animation
    showCatchFlyAnim(this.bobber.x, this.bobber.y, '🐟');
    playSFX('catch');
  }

  doReset() {
    if(this.spawnTimer) clearInterval(this.spawnTimer);
    this.fishes=[]; this.effects=[];
    this.bobber.visible=false; this.bobber.biting=false; this.line.active=false;
    this.phase='idle';
  }
}

/* ══════════════════════════════════
   4. DROP RATE ENGINE
══════════════════════════════════ */
function calcRates() {
  const r={...BASE_RATES};
  const rod=RODS[G.rodLevel];
  const map=MAPS.find(m=>m.id===G.currentMap);
  const pet=G.activePet?PETS.find(p=>p.id===G.activePet):null;
  const spot=SPOTS.find(s=>s.id===G.currentSpot);

  let lb=G.level>=31?10:G.level>=21?6:G.level>=11?4:G.level>=6?2:0;
  r.Common=Math.max(0,r.Common-lb);
  r.Rare+=lb*.4; r.Epic+=lb*.3; r.Legendary+=lb*.2; r.Mythic+=lb*.1;

  applyBonus(r,rod.bonus||{});
  if(pet) applyBonus(r,pet.bonus||{});
  if(map) applyBonus(r,map.bonus||{},false);
  if(spot) applyBonus(r,spot.bonus||{},false);

  const total=Object.values(r).reduce((a,b)=>a+b,0)||1;
  const n={};
  for(const [k,v] of Object.entries(r)) n[k]=(v/total)*100;
  return n;
}

function applyBonus(r,bonus,reduceCommon=true) {
  for(const [k,v] of Object.entries(bonus)) {
    r[k]=(r[k]||0)+v;
    if(reduceCommon) r.Common=Math.max(0,r.Common-v);
  }
}

function pickRarity() {
  const rates=calcRates();
  const roll=Math.random()*100;
  let cum=0;
  for(const rr of ['Mythic','Legendary','Epic','Rare','Uncommon','Common']) {
    cum+=rates[rr]||0;
    if(roll<=cum) return rr;
  }
  return 'Common';
}
function pickFish(rarity) { const p=FISH_DATA[rarity]; return p[Math.floor(Math.random()*p.length)]; }
function rollWeight(rarity) { const [mn,mx]=WEIGHT_RANGE[rarity]; return +(mn+Math.random()*(mx-mn)).toFixed(1); }

function calcFishValue(fish,rarity,weight) {
  const wr=WEIGHT_RANGE[rarity];
  const wf=1+(weight-wr[0])/(wr[1]-wr[0]+0.01);
  const pm=RARITY_PRICE_MUL[rarity]||1;
  const pet=G.activePet?PETS.find(p=>p.id===G.activePet):null;
  const cm=pet?pet.coinMul:1;
  return Math.round(fish.baseVal*wf*pm*cm*.25);
}

/* ══════════════════════════════════
   5. FISHING STATE MACHINE
══════════════════════════════════ */
const STATES=['idle','casting','waiting','bite','reeling','rodbreak','miss','result'];
let fishingPhase='idle', pendingCatch=null, pullProgress=0;
let biteTimer=null, biteCountInt=null, autoReelInt=null;
let scene=null;

function setPhase(ph) {
  fishingPhase=ph;
  STATES.forEach(s=>{
    const el=$('st-'+s); if(!el) return;
    if(s===ph){el.classList.remove('hidden');el.classList.add('active');}
    else{el.classList.add('hidden');el.classList.remove('active');}
  });
}

function doCast() {
  if(fishingPhase!=='idle') return;
  setPhase('casting');
  scene.onCastDone=()=>{setPhase('waiting');startWaitArc();};
  scene.onBite=onFishBite;
  scene.doCast(Math.random());
  playSFX('cast');
}

function doCancel() {
  clearTimeout(biteTimer);
  stopBiteCountdown(); stopWaitArc();
  scene.doReset(); setPhase('idle');
}

function onFishBite() {
  if(fishingPhase!=='waiting') return;
  stopWaitArc();
  const rarity=pickRarity();
  const fish=pickFish(rarity);
  const weight=rollWeight(rarity);
  pendingCatch={rarity,fish,weight};
  // Update biter emoji
  const bf=scene.fishes.find(f=>f.canBite);
  if(bf) bf.emoji=fish.icon;
  setPhase('bite'); playSFX('bite');
  startBiteCountdown();
  biteTimer=setTimeout(onMiss,BITE_WINDOW_MS);
}

function doPull() {
  if(fishingPhase!=='bite') return;
  clearTimeout(biteTimer); stopBiteCountdown();
  const {rarity,fish,weight}=pendingCatch;
  const rod=RODS[G.rodLevel];
  if(weight>rod.maxKg) {
    scene.doBreak(); doShake(); setPhase('rodbreak');
    setText('break-sub', fish.name+' terlalu berat!');
    setText('break-detail', `Berat: ${weight}kg | Max rod: ${rod.maxKg}kg`);
    playSFX('break'); pendingCatch=null; return;
  }
  pullProgress=0; setPhase('reeling');
  const reelFishEl=$('reel-fish-icon'); if(reelFishEl) reelFishEl.textContent=fish.icon;
  setText('reel-weight', weight+' kg');
  setText('reel-type', rarity);
  const rtEl=$('reel-type'); if(rtEl) rtEl.className='reel-type tag-'+rarity;
  updateTensionBar(weight,rod.maxKg); updateReelBar(); playSFX('reel');
  if(weight>rod.maxKg*.5) {
    autoReelInt=setInterval(()=>{
      if(fishingPhase!=='reeling'){clearInterval(autoReelInt);return;}
      pullProgress=Math.max(0,pullProgress-(weight/rod.maxKg)*4);
      updateReelBar();
      if(weight>rod.maxKg*.75){doShake();playSFX('fight');}
    },1200);
  }
}

function doReel() {
  if(fishingPhase!=='reeling') return;
  const {weight}=pendingCatch;
  const rod=RODS[G.rodLevel];
  const gain=Math.max(5,28-(weight/rod.maxKg)*18);
  pullProgress=Math.min(100,pullProgress+gain);
  updateReelBar(); playSFX('reel');
  if(pullProgress>=100){clearInterval(autoReelInt);setTimeout(onCatchSuccess,120);}
}

function onCatchSuccess() {
  if(!pendingCatch) return;
  clearInterval(autoReelInt);
  const {rarity,fish,weight}=pendingCatch; pendingCatch=null;
  const value=calcFishValue(fish,rarity,weight);
  const xpMap={Common:10,Uncommon:20,Rare:40,Epic:80,Legendary:200,Mythic:500};
  const pet=G.activePet?PETS.find(p=>p.id===G.activePet):null;
  let xp=Math.round((xpMap[rarity]||10)*(pet?pet.xpMul:1)*RODS[G.rodLevel].xpMul);
  let gems=rarity==='Epic'?1:rarity==='Legendary'?3:rarity==='Mythic'?10:0;
  let frags=rarity==='Rare'?1:rarity==='Epic'?2:rarity==='Legendary'?5:rarity==='Mythic'?15:0;

  G.inventory[fish.id]=G.inventory[fish.id]||{count:0,totalWeight:0};
  G.inventory[fish.id].count++;
  G.inventory[fish.id].totalWeight=+(G.inventory[fish.id].totalWeight+weight).toFixed(1);
  G.totalCaught++; if(rarity==='Legendary') G.legendaryCount++; if(rarity==='Mythic') G.mythicCount++;
  if(weight>G.heaviestCatch) G.heaviestCatch=weight;
  G.coins+=value; G.gems+=gems; G.fragments+=frags;
  G.totalCoinsEarned+=value;
  addXP(xp); updateMissions(fish,rarity,weight); saveG();

  scene.doCatch(); doShake();
  // Update fly fish icon
  const flyFish=$('catch-fly-fish'); if(flyFish) flyFish.textContent=fish.icon;
  showResult(fish,rarity,weight,value,xp,gems,frags);
  updateHUD();
}

function onMiss() {
  if(fishingPhase!=='bite') return;
  stopBiteCountdown(); pendingCatch=null;
  scene.doReset(); scene.phase='idle';
  setPhase('miss'); playSFX('miss');
}

function updateReelBar() {
  const fill=$('reel-bar-fill'), pct=$('reel-pct');
  if(fill) fill.style.width=pullProgress+'%';
  if(pct)  pct.textContent=Math.floor(pullProgress)+'%';
}

function updateTensionBar(weight,maxKg) {
  const ratio=weight/maxKg;
  const fill=$('tension-bar-fill'), warn=$('tension-warn');
  if(!fill) return;
  const pct=Math.min(100,ratio*100);
  fill.style.width=pct+'%';
  fill.style.background=pct>80?'linear-gradient(90deg,#ff4444,#ff0000)':pct>50?'linear-gradient(90deg,#ff6b35,#ffd700)':'linear-gradient(90deg,#56ab2f,#a8e063)';
  if(warn) warn.textContent=pct>80?'⚠️ KRITIS!':pct>50?'⚠️ Berat':'';
}

function showResult(fish,rarity,weight,coins,xp,gems,frags) {
  setPhase('result');
  const card=$('result-card'); if(card) card.className='result-card rc-'+rarity;
  setText('res-icon',fish.icon); setText('res-rarity',rarity.toUpperCase());
  setText('res-size',sizeLabel(weight)); setText('res-weight',weight+' kg');
  setText('res-name',fish.name); setText('res-coins','+'+coins+' 💰'); setText('res-xp','+'+xp+' XP');
  const bonusEl=$('res-bonus');
  if(bonusEl) {
    let b=gems>0?'+'+gems+' 💎  ':'';
    if(frags>0) b+='🔩 +'+frags+' frag  ';
    if(rarity==='Mythic') b+='🌈 MYTHIC CATCH!';
    else if(rarity==='Legendary') b+='⭐ LEGENDARY!';
    else if(weight>=50) b+='🏆 IKAN MONSTER!';
    bonusEl.textContent=b;
  }
  spawnSparkles(rarity); playSFX(rarity);
}

function showCatchFlyAnim(x,y,icon) {
  const overlay=$('catch-fly-overlay'); if(!overlay) return;
  overlay.style.display='block';
  const fish=$('catch-fly-fish'); if(fish) { fish.textContent=icon; fish.style.left=x+'px'; fish.style.bottom='30%'; }
  setTimeout(()=>{ overlay.style.display='none'; },900);
}

/* ══════════════════════════════════
   6. WAIT ARC & BITE COUNTDOWN
══════════════════════════════════ */
let waitArcIv=null, waitArcP=0;

function startWaitArc() {
  const arc=$('wait-arc'); if(arc) arc.style.strokeDashoffset='188';
  waitArcP=0; clearInterval(waitArcIv);
  const bait=BAITS[G.baitLevel];
  const avg=(bait.waitMin+bait.waitMax)/2;
  const step=188/(avg/50);
  waitArcIv=setInterval(()=>{
    waitArcP=Math.min(waitArcP+step,188);
    const a2=$('wait-arc'); if(a2) a2.style.strokeDashoffset=188-waitArcP;
    if(waitArcP>=188) clearInterval(waitArcIv);
  },50);
}
function stopWaitArc() {
  clearInterval(waitArcIv);
  const arc=$('wait-arc'); if(arc) arc.style.strokeDashoffset='188';
}

let biteCountStart=0;
function startBiteCountdown() {
  biteCountStart=Date.now();
  const bar=$('bite-cd-fill'); if(bar) bar.style.width='100%';
  clearInterval(biteCountInt);
  biteCountInt=setInterval(()=>{
    const pct=Math.max(0,100-((Date.now()-biteCountStart)/BITE_WINDOW_MS)*100);
    const b2=$('bite-cd-fill'); if(b2) b2.style.width=pct+'%';
    if(pct<=0) clearInterval(biteCountInt);
  },40);
}
function stopBiteCountdown() {
  clearInterval(biteCountInt);
  const bar=$('bite-cd-fill'); if(bar) bar.style.width='100%';
}

/* ══════════════════════════════════
   7. SPOT HUD UPDATE
══════════════════════════════════ */
function updateSpotHUD() {
  const spot=SPOTS.find(s=>s.id===G.currentSpot)||SPOTS[0];
  // Spot chips
  const chipsEl=$('spot-chips');
  if(chipsEl) {
    chipsEl.innerHTML=SPOTS.map(s=>`<div class="spot-chip ${s.id===G.currentSpot?'active-spot':''}">${s.emoji} ${s.name}</div>`).join('');
  }
  // Bonus strip
  setText('sbs-name', spot.name);
  const bonusKeys=Object.keys(spot.bonus);
  const bonusStr=bonusKeys.length?bonusKeys.map(k=>`+${spot.bonus[k]}% ${k}`).join(' '):' Balanced';
  setText('sbs-bonus', bonusStr);
  const sbsIcon=$('.sbs-icon'); if(sbsIcon) sbsIcon.textContent=spot.emoji;
  // Scene HUD spot
  setText('sh-spot', spot.emoji+' '+spot.name);
}

/* ══════════════════════════════════
   8. XP & LEVELING
══════════════════════════════════ */
function addXP(amt) {
  G.xp+=amt; let lvd=false;
  while(G.level<XP_TABLE.length-1 && G.xp>=XP_TABLE[G.level]){G.level++;lvd=true;}
  if(lvd) showLevelUp();
  updateHUD();
}
function showLevelUp() {
  setText('lvl-text','🎉 Kamu sekarang Level '+G.level+'!');
  const lb=$('lvl-bonus');
  if(lb){const b=G.level>=31?'+10% rare':G.level>=21?'+6% rare':G.level>=11?'+4% rare':G.level>=6?'+2% rare':'';lb.textContent=b;}
  showModal('modal-lvl'); playSFX('levelup');
}
function xpProgress() {
  const curr=XP_TABLE[G.level-1]||0;
  const next=XP_TABLE[G.level]||XP_TABLE[XP_TABLE.length-1];
  return Math.min(((G.xp-curr)/(next-curr))*100,100);
}

/* ══════════════════════════════════
   9. HUD
══════════════════════════════════ */
function updateHUD() {
  setText('hud-coins',fmt(G.coins)); setText('hud-gems',fmt(G.gems));
  setText('hud-frags',G.fragments||0); setText('hud-lv','Lv.'+G.level);
  setText('hud-name',G.playerName); setText('hud-xp-txt',fmt(G.xp)+'xp');
  setText('mkt-coins',fmt(G.coins)); setText('exc-frags',G.fragments||0);

  const xpFill=$('hud-xp-fill'); if(xpFill) xpFill.style.width=xpProgress()+'%';

  const map=MAPS.find(m=>m.id===G.currentMap);
  if(map){setText('inf-map',map.emoji+' '+map.name);setText('map-badge',map.name);}
  const rod=RODS[G.rodLevel];
  if(rod){
    setText('inf-rod',rod.icon+' '+rod.name);
    const rodFill=$('rod-str-fill');
    if(rodFill) rodFill.style.width=((G.rodLevel+1)/RODS.length*100)+'%';
    setText('rod-str-label',rod.maxKg+'kg');
    $('sh-rod')&&setText('sh-rod',rod.icon+' '+rod.name);
  }
  setText('s-catch',G.totalCaught); setText('s-xp',fmt(G.xp));
  setText('s-leg',G.legendaryCount); setText('s-myth',G.mythicCount);
  const nr=RODS[G.rodLevel+1];
  setText('rod-cost',nr?fmt(nr.cost):'MAX');
  const nb=BAITS[G.baitLevel+1];
  setText('bait-cost',nb?fmt(nb.cost):'MAX');
  const rb=$('btn-upg-rod'); if(rb) rb.disabled=!nr||G.coins<nr.cost;
  const bb=$('btn-upg-bait'); if(bb) bb.disabled=!nb||G.coins<nb.cost;
}

/* ══════════════════════════════════
   10. SPARKLES & SHAKE
══════════════════════════════════ */
function spawnSparkles(rarity) {
  const c=$('result-sparks'); if(!c) return; c.innerHTML='';
  const count={Mythic:22,Legendary:18,Epic:14,Rare:9}[rarity]||5;
  const col={Common:'#6bcb4a',Uncommon:'#4fa8d8',Rare:'#a855f7',Epic:'#f39c12',Legendary:'#ef4444',Mythic:'#f093fb'}[rarity]||'#fff';
  for(let i=0;i<count;i++) {
    const s=document.createElement('div'); s.className='sparkle';
    s.style.cssText=`left:${20+Math.random()*60}%;top:${15+Math.random()*70}%;background:${col};width:${3+Math.random()*5}px;height:${3+Math.random()*5}px;--sx:${(Math.random()-.5)*140}px;--sy:${(Math.random()-.5)*120}px;animation-delay:${Math.random()*.35}s;`;
    c.appendChild(s); setTimeout(()=>s.remove(),1200);
  }
}
function doShake() {
  const el=$('shake-overlay'); if(!el) return;
  el.classList.remove('shaking'); void el.offsetWidth;
  el.classList.add('shaking'); setTimeout(()=>el.classList.remove('shaking'),450);
}

/* ══════════════════════════════════
   11. AQUARIUM
══════════════════════════════════ */
function renderAquarium(filter='all') {
  const grid=$('aq-grid'); if(!grid) return;
  const all=getAllFish();
  const shown=filter==='all'?all:all.filter(f=>f.rarity===filter);
  const total=Object.values(G.inventory).reduce((a,b)=>a+(b.count||0),0);
  setText('aq-count',total+' ikan');
  if(!shown.length){grid.innerHTML=`<div class="empty-st"><span>🎣</span><p>${filter==='all'?'Belum ada ikan!':'Tidak ada '+filter}</p></div>`;return;}
  grid.innerHTML=shown.map(({fish,rarity,count,totalWeight})=>{
    const avgW=count?+(totalWeight/count).toFixed(1):0;
    return `<div class="fish-card rarity-${rarity}">
      <div class="fc-ic">${fish.icon}</div>
      <div class="fc-nm">${fish.name}</div>
      <div class="fc-qty">×${count}</div>
      <div class="fc-wt">⚖️ ~${avgW}kg</div>
      <div class="fc-rar tag-${rarity}">${rarity}</div>
    </div>`;
  }).join('');
}

function getAllFish() {
  const res=[];
  for(const [id,info] of Object.entries(G.inventory)) {
    const cnt=info.count||info||0; const tw=info.totalWeight||0;
    if(cnt<=0) continue;
    for(const [rarity,arr] of Object.entries(FISH_DATA)) {
      const fish=arr.find(f=>f.id===id);
      if(fish){res.push({fish,rarity,count:cnt,totalWeight:tw});break;}
    }
  }
  return res;
}
function getFishById(id) {
  for(const [rarity,arr] of Object.entries(FISH_DATA)) {
    const fish=arr.find(f=>f.id===id);
    if(fish) return{fish,rarity};
  }
  return null;
}

/* ══════════════════════════════════
   12. MARKET
══════════════════════════════════ */
function renderSell() {
  const grid=$('mkt-sell-grid'); if(!grid) return;
  const all=getAllFish();
  if(!all.length){grid.innerHTML=`<div class="empty-st"><span>🐟</span><p>Inventori kosong</p></div>`;return;}
  grid.innerHTML=all.map(({fish,rarity,count,totalWeight})=>{
    const avgW=count?+(totalWeight/count).toFixed(1):0;
    const sellPx=calcFishValue(fish,rarity,avgW);
    return `<div class="mfc"><div class="mfc-ic">${fish.icon}</div>
      <div class="mfc-nm">${fish.name}</div>
      <div class="fc-rar tag-${rarity}">${rarity}</div>
      <div class="mfc-qty">×${count} · ~${avgW}kg</div>
      <div class="mfc-pr">💰 ${sellPx}/ekor</div>
      <button class="btn-sell" data-id="${fish.id}" data-price="${sellPx}">📤 Jual 1</button>
    </div>`;
  }).join('');
  grid.querySelectorAll('.btn-sell').forEach(b=>b.addEventListener('click',()=>sellFish(b.dataset.id,+b.dataset.price)));
}
function renderBuy() {
  const grid=$('mkt-buy-grid'); if(!grid) return;
  const stock=[...FISH_DATA.Common.slice(0,3),...FISH_DATA.Uncommon.slice(0,2),...FISH_DATA.Rare.slice(0,1)];
  grid.innerHTML=stock.map(fish=>{
    const rarity=rarityOf(fish.id);
    const avgW=WEIGHT_RANGE[rarity][0]+0.5;
    const price=Math.round(calcFishValue(fish,rarity,avgW)*1.6);
    return `<div class="mfc"><div class="mfc-ic">${fish.icon}</div>
      <div class="mfc-nm">${fish.name}</div>
      <div class="fc-rar tag-${rarity}">${rarity}</div>
      <div class="mfc-pr">💰 ${price}</div>
      <button class="btn-buy-npc" data-id="${fish.id}" data-price="${price}">📥 Beli</button>
    </div>`;
  }).join('');
  grid.querySelectorAll('.btn-buy-npc').forEach(b=>b.addEventListener('click',()=>buyFish(b.dataset.id,+b.dataset.price)));
}
function sellFish(id,price) {
  const info=G.inventory[id];
  if(!info||(info.count||info)<=0) return;
  const f=getFishById(id); if(!f) return;
  if(typeof G.inventory[id]==='object'){G.inventory[id].count--;if(G.inventory[id].count<=0)delete G.inventory[id];}
  else{G.inventory[id]--;if(!G.inventory[id])delete G.inventory[id];}
  G.coins+=price;
  showToast('📤 Dijual: '+f.fish.name+' +'+price+'💰');
  updateHUD();renderSell();saveG();
}
function buyFish(id,price) {
  if(G.coins<price){showToast('💸 Coin tidak cukup!');return;}
  G.coins-=price;
  if(!G.inventory[id]) G.inventory[id]={count:0,totalWeight:0};
  const r=rarityOf(id); const w=rollWeight(r);
  G.inventory[id].count++;
  G.inventory[id].totalWeight=+(G.inventory[id].totalWeight+w).toFixed(1);
  const f=getFishById(id);
  showToast('📥 Dibeli: '+(f?f.fish.name:id));
  updateHUD();renderBuy();saveG();
}
function rarityOf(id) {
  for(const [r,a] of Object.entries(FISH_DATA)) if(a.find(f=>f.id===id)) return r;
  return 'Common';
}

/* ══════════════════════════════════
   13. EXCHANGE CENTER
══════════════════════════════════ */

// ── COUNT BY RARITY ──
function countByRarity(rarity) {
  return getAllFish().filter(f=>f.rarity===rarity).reduce((a,b)=>a+b.count,0);
}

// ── FISH FUSION ──
function renderFusion() {
  const grid=$('fusion-grid'); if(!grid) return;
  const now=Date.now();
  grid.innerHTML=FUSIONS.map(f=>{
    const have=countByRarity(f.fromRarity);
    const canFuse=have>=f.fromCount;
    const cdKey='fus_'+f.id;
    const cdLeft=G.fusionCooldowns[cdKey]?Math.max(0,G.fusionCooldowns[cdKey]-now):0;
    const onCd=cdLeft>0;
    const fromEmoji={Common:'🐟',Uncommon:'🐠',Rare:'🐡',Epic:'🐙',Legendary:'🐋'}[f.fromRarity]||'🐟';
    const toEmoji={Uncommon:'🐠',Rare:'🐡',Epic:'🐙',Legendary:'🐋',Mythic:'🐉'}[f.toRarity]||'🐟';
    const needTxt=canFuse?`✅ Punya ${have}/${f.fromCount}`:`❌ Perlu ${f.fromCount} (punya ${have})`;
    const cdTxt=onCd?`CD: ${Math.ceil(cdLeft/1000)}s`:'';
    return `<div class="fusion-card">
      <div class="fusion-visual">
        <div class="fv-input">
          <div class="fi-fish">${fromEmoji}</div>
          <div class="fi-count">×${f.fromCount}</div>
        </div>
        <div class="fv-arrow">➡️</div>
        <div class="fv-output">
          <div class="fo-fish">${toEmoji}</div>
          <div class="fo-rar tag-${f.toRarity}">${f.toRarity}</div>
        </div>
      </div>
      <div class="fusion-info">
        <div class="fi-title">${f.fromRarity} → ${f.toRarity}</div>
        <div class="fi-need ${canFuse?'can-fuse':'cant-fuse'}">${needTxt}</div>
        ${cdTxt?`<div class="rc-cd">${cdTxt}</div>`:''}
      </div>
      <button class="btn-fuse" data-id="${f.id}" ${(!canFuse||onCd)?'disabled':''}>${onCd?'⏳ CD':'⚗️ Fusi'}</button>
    </div>`;
  }).join('');
  grid.querySelectorAll('.btn-fuse').forEach(b=>b.addEventListener('click',()=>doFusion(b.dataset.id)));
}

function doFusion(id) {
  const f=FUSIONS.find(x=>x.id===id); if(!f) return;
  const have=countByRarity(f.fromRarity);
  if(have<f.fromCount){showToast('❌ Ikan tidak cukup!');return;}
  // Remove fish of fromRarity
  let toRemove=f.fromCount;
  const allFish=getAllFish().filter(x=>x.rarity===f.fromRarity);
  for(const item of allFish) {
    if(toRemove<=0) break;
    const remove=Math.min(toRemove,item.count);
    G.inventory[item.fish.id].count-=remove;
    if(G.inventory[item.fish.id].count<=0) delete G.inventory[item.fish.id];
    toRemove-=remove;
  }
  // Add fused fish
  const newFish=pickFish(f.toRarity);
  const newWeight=rollWeight(f.toRarity);
  if(!G.inventory[newFish.id]) G.inventory[newFish.id]={count:0,totalWeight:0};
  G.inventory[newFish.id].count++;
  G.inventory[newFish.id].totalWeight=+(G.inventory[newFish.id].totalWeight+newWeight).toFixed(1);
  G.totalCaught++;
  // Cooldown
  if(f.cd>0) {
    G.fusionCooldowns=G.fusionCooldowns||{};
    G.fusionCooldowns['fus_'+f.id]=Date.now()+f.cd;
    // Start re-render timer
    setTimeout(()=>renderFusion(), f.cd+100);
  }
  G.fusionsDone=(G.fusionsDone||0)+1;
  G.missionProg['m10']=(G.missionProg['m10']||0)+1;
  const xpGain={Uncommon:30,Rare:80,Epic:150,Legendary:350,Mythic:800}[f.toRarity]||30;
  addXP(xpGain);
  showToast(`⚗️ Fusi berhasil! Dapat ${newFish.icon} ${newFish.name}`);
  playSFX(f.toRarity);
  updateHUD(); renderFusion(); saveG();
}

// ── MYSTERY BOX ──
function doMysteryBox(useGem) {
  if(useGem) {
    if(G.gems<3){showToast('💎 Gem tidak cukup!');return;}
    G.gems-=3;
  } else {
    if(G.coins<500){showToast('💸 Butuh 500💰');return;}
    G.coins-=500;
  }
  // Animate box
  const boxIcon=$('mys-box-icon');
  if(boxIcon){boxIcon.style.animation='none';void boxIcon.offsetWidth;boxIcon.textContent='🎁';boxIcon.style.animation='mysBox .1s ease-in-out 5';}
  setTimeout(()=>{
    const result=rollMysteryBox(useGem);
    applyMysteryResult(result);
    const resEl=$('mys-result'); if(resEl) resEl.style.display='block';
    setText('mys-res-icon', result.icon);
    setText('mys-res-text', result.text);
    if(boxIcon) boxIcon.textContent='✨';
    playSFX('catch'); updateHUD(); saveG();
  }, 600);
}

function rollMysteryBox(premium) {
  const roll=Math.random()*100;
  if(premium) {
    if(roll<15) return rollMysReward('Mythic');
    if(roll<40) return rollMysReward('Legendary');
    if(roll<70) return rollMysReward('Epic');
    if(roll<90) return {type:'frags',val:20,icon:'🔩',text:'Dapat 20 Fragment Langka!'};
    return {type:'bait',val:3,icon:'✨',text:'Legendary Bait ×2!'};
  } else {
    if(roll<5)  return rollMysReward('Legendary');
    if(roll<20) return rollMysReward('Epic');
    if(roll<45) return rollMysReward('Rare');
    if(roll<65) return {type:'frags',val:8,icon:'🔩',text:'Dapat 8 Fragment!'};
    if(roll<80) return {type:'coins',val:300+Math.floor(Math.random()*400),icon:'💰',text:''};
    if(roll<90) return {type:'bait',val:2,icon:'🎯',text:'Turbo Bait ×1!'};
    return rollMysReward('Common');
  }
}

function rollMysReward(rarity) {
  const fish=pickFish(rarity); const w=rollWeight(rarity);
  return {type:'fish',rarity,fish,weight:w,icon:fish.icon,text:`${fish.icon} ${fish.name} (${w}kg) ${rarity}!`};
}

function applyMysteryResult(r) {
  if(r.type==='fish') {
    if(!G.inventory[r.fish.id]) G.inventory[r.fish.id]={count:0,totalWeight:0};
    G.inventory[r.fish.id].count++;
    G.inventory[r.fish.id].totalWeight=+(G.inventory[r.fish.id].totalWeight+r.weight).toFixed(1);
    G.totalCaught++;
    if(r.rarity==='Legendary') G.legendaryCount++;
    if(r.rarity==='Mythic') G.mythicCount++;
  } else if(r.type==='frags') {
    G.fragments+=r.val; if(!r.text) r.text=`🔩 Dapat ${r.val} Fragment!`;
  } else if(r.type==='coins') {
    G.coins+=r.val; if(!r.text) r.text=`💰 Dapat ${r.val} Coin!`;
  } else if(r.type==='bait') {
    G.baitLevel=Math.min(BAITS.length-1,r.val);
    if(!r.text) r.text=`${BAITS[r.val].name} diaktifkan!`;
  }
}

// ── DAILY EXCHANGE ──
function getDailyOffers() {
  const today=new Date().toDateString();
  // Seed-based pseudo-random using date
  let seed=0; for(let c of today) seed+=c.charCodeAt(0);
  const seededRandom=(n)=>{seed=(seed*9301+49297)%233280;return (seed/233280)*n;};
  return [
    {id:'d1',desc:`${Math.floor(seededRandom(8)+5)} Common Fish → ${Math.floor(seededRandom(200)+200)}💰`,costType:'rarity',rarity:'Common',amount:Math.floor(seededRandom(8)+5),reward:{type:'coins',val:Math.floor(seededRandom(200)+200)},icon:'🐟'},
    {id:'d2',desc:`${Math.floor(seededRandom(4)+2)} Uncommon Fish → ${Math.floor(seededRandom(5)+3)}🔩`,costType:'rarity',rarity:'Uncommon',amount:Math.floor(seededRandom(4)+2),reward:{type:'frags',val:Math.floor(seededRandom(5)+3)},icon:'🐠'},
    {id:'d3',desc:`${Math.floor(seededRandom(3)+1)} Rare Fish → Pro Bait`,costType:'rarity',rarity:'Rare',amount:Math.floor(seededRandom(3)+1),reward:{type:'bait',val:1},icon:'🐡'},
    {id:'d4',desc:`${Math.floor(seededRandom(200)+100)}💰 → ${Math.floor(seededRandom(4)+2)}🔩`,costType:'coins',amount:Math.floor(seededRandom(200)+100),reward:{type:'frags',val:Math.floor(seededRandom(4)+2)},icon:'💰'},
  ];
}

function renderDailyExchange() {
  const list=$('daily-list'); if(!list) return;
  const today=new Date().toDateString();
  if(G.dailyExchangeDate!==today){G.dailyExchangeDate=today;G.dailyExchangeUsed={};}
  const offers=getDailyOffers();
  // Countdown to midnight
  const now=new Date(); const tomorrow=new Date(now); tomorrow.setHours(24,0,0,0);
  const diff=tomorrow-now; const h=Math.floor(diff/3600000),m=Math.floor((diff%3600000)/60000);
  setText('daily-reset',`Reset: ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`);

  list.innerHTML=offers.map(o=>{
    const used=G.dailyExchangeUsed[o.id];
    const rewardText=o.reward.type==='coins'?`+${o.reward.val}💰`:o.reward.type==='frags'?`+${o.reward.val}🔩`:o.reward.type==='bait'?`${BAITS[o.reward.val].name}`:'';
    return `<div class="daily-card ${used?'used':''}">
      <div class="dc-visual">${o.icon}</div>
      <div class="dc-info">
        <div class="dc-title">${o.desc}</div>
        <div class="dc-desc">Reward: ${rewardText}</div>
      </div>
      <button class="btn-daily-trade" data-id="${o.id}" ${used?'disabled':''}>
        ${used?'✓ Done':'Tukar'}
      </button>
    </div>`;
  }).join('');
  list.querySelectorAll('.btn-daily-trade').forEach(b=>b.addEventListener('click',()=>doDailyTrade(b.dataset.id)));
}

function doDailyTrade(id) {
  const today=new Date().toDateString();
  if(G.dailyExchangeDate!==today){G.dailyExchangeDate=today;G.dailyExchangeUsed={};}
  if(G.dailyExchangeUsed[id]){showToast('Sudah digunakan hari ini!');return;}
  const offers=getDailyOffers();
  const o=offers.find(x=>x.id===id); if(!o) return;

  if(o.costType==='rarity') {
    const have=countByRarity(o.rarity);
    if(have<o.amount){showToast(`❌ Perlu ${o.amount} ${o.rarity} fish!`);return;}
    let toRem=o.amount;
    getAllFish().filter(f=>f.rarity===o.rarity).forEach(item=>{
      if(toRem<=0) return;
      const rem=Math.min(toRem,item.count);
      G.inventory[item.fish.id].count-=rem;
      if(G.inventory[item.fish.id].count<=0) delete G.inventory[item.fish.id];
      toRem-=rem;
    });
  } else if(o.costType==='coins') {
    if(G.coins<o.amount){showToast(`💸 Butuh ${o.amount}💰`);return;}
    G.coins-=o.amount;
  }
  applyMysteryResult(o.reward);
  G.dailyExchangeUsed[id]=true;
  const rewardText=o.reward.type==='coins'?`+${o.reward.val}💰`:o.reward.type==='frags'?`+${o.reward.val}🔩`:'Berhasil!';
  showToast('✅ Tukar berhasil! '+rewardText);
  updateHUD(); renderDailyExchange(); saveG();
}

// ── RECIPES ──
function renderRecipes() {
  const list=$('recipe-list'); if(!list) return;
  const now=Date.now();
  list.innerHTML=RECIPES.map(r=>{
    const cdLeft=G.recipeCooldowns[r.id]?Math.max(0,G.recipeCooldowns[r.id]-now):0;
    const onCd=cdLeft>0;
    let canDo=false;
    if(r.costType==='rarity') canDo=countByRarity(r.rarity)>=r.amount;
    else if(r.costType==='coins') canDo=G.coins>=r.amount;
    else if(r.costType==='frags') canDo=(G.fragments||0)>=r.amount;

    const rewardText=r.reward.type==='bait'?BAITS[r.reward.val].name:r.reward.type==='frags'?`${r.reward.val} Fragment`:r.reward.type==='rod_upgrade'?'Rod Level Up':'?';
    const costText=r.costType==='rarity'?`${r.amount}x ${r.rarity} fish`:r.costType==='coins'?`${r.amount}💰`:`${r.amount}🔩`;
    return `<div class="recipe-card">
      <div class="rc-visual">${r.icon} <span class="rc-arrow">→</span> ${r.reward.type==='bait'?'🎯':r.reward.type==='frags'?'🔩':'🎣'}</div>
      <div class="rc-info">
        <div class="rc-title">${r.name}</div>
        <div class="rc-cost">${costText} → ${rewardText}</div>
        ${onCd?`<div class="rc-cd">⏳ ${Math.ceil(cdLeft/1000)}s</div>`:''}
      </div>
      <button class="btn-recipe" data-id="${r.id}" ${(!canDo||onCd)?'disabled':''}>
        ${onCd?'⏳':'Tukar'}
      </button>
    </div>`;
  }).join('');
  list.querySelectorAll('.btn-recipe').forEach(b=>b.addEventListener('click',()=>doRecipe(b.dataset.id)));
}

function doRecipe(id) {
  const r=RECIPES.find(x=>x.id===id); if(!r) return;
  const now=Date.now();
  if(G.recipeCooldowns[id]&&G.recipeCooldowns[id]>now){showToast('⏳ Masih cooldown!');return;}

  if(r.costType==='rarity') {
    if(countByRarity(r.rarity)<r.amount){showToast('❌ Tidak cukup!');return;}
    let toRem=r.amount;
    getAllFish().filter(f=>f.rarity===r.rarity).forEach(item=>{
      if(toRem<=0)return;
      const rem=Math.min(toRem,item.count);
      G.inventory[item.fish.id].count-=rem;
      if(G.inventory[item.fish.id].count<=0) delete G.inventory[item.fish.id];
      toRem-=rem;
    });
  } else if(r.costType==='coins') {
    if(G.coins<r.amount){showToast('💸 Coin tidak cukup!');return;}
    G.coins-=r.amount;
  } else if(r.costType==='frags') {
    if((G.fragments||0)<r.amount){showToast('🔩 Fragment tidak cukup!');return;}
    G.fragments-=r.amount;
  }

  // Apply reward
  if(r.reward.type==='bait') { G.baitLevel=Math.max(G.baitLevel,r.reward.val); showToast('🎯 '+BAITS[r.reward.val].name+' didapat!'); }
  else if(r.reward.type==='frags') { G.fragments+=r.reward.val; showToast('🔩 +'+r.reward.val+' Fragment!'); }
  else if(r.reward.type==='rod_upgrade') {
    const nr=RODS[G.rodLevel+1];
    if(nr){G.rodLevel++;showToast('🎣 Rod upgrade ke '+nr.name+'!');}
    else{showToast('🎣 Rod sudah MAX!');if(r.costType==='frags')G.fragments+=r.amount;}
  }

  if(r.cd>0) { G.recipeCooldowns[id]=now+r.cd; setTimeout(()=>renderRecipes(),r.cd+100); }
  updateHUD(); renderRecipes(); saveG();
}

function renderExchange() {
  renderFusion(); renderRecipes(); renderDailyExchange();
}

/* ══════════════════════════════════
   14. MISSIONS
══════════════════════════════════ */
function updateMissions(fish,rarity,weight) {
  MISSIONS.forEach(m=>{
    if(G.missionClaimed[m.id]) return;
    const p=G.missionProg[m.id]||0;
    if(m.type==='catch_rarity'  && rarity===m.rarity)      G.missionProg[m.id]=Math.min(p+1,m.target);
    if(m.type==='catch_ids'     && (m.ids||[]).includes(fish.id)) G.missionProg[m.id]=Math.min(p+1,m.target);
    if(m.type==='catch_both'){
      const s=G.missionProg[m.id+'_s']||{};
      if((m.ids||[]).includes(fish.id)) s[fish.id]=true;
      G.missionProg[m.id+'_s']=s; G.missionProg[m.id]=Object.keys(s).length;
    }
    if(m.type==='total_catch')  G.missionProg[m.id]=G.totalCaught;
    if(m.type==='heavy_catch' && weight>=50) G.missionProg[m.id]=1;
    if(m.type==='spot_catch')  G.missionProg[m.id]=Object.keys(G.spotsVisited||{}).length;
    if(m.type==='fusion_count') G.missionProg[m.id]=G.fusionsDone||0;
  });
  renderMissions();
}

function renderMissions() {
  const list=$('miss-list'); if(!list) return;
  const ready=MISSIONS.filter(m=>{const p=G.missionProg[m.id]||0,t=m.target||(m.ids?m.ids.length:1);return !G.missionClaimed[m.id]&&p>=t;}).length;
  setText('miss-badge',ready+' siap klaim');
  list.innerHTML=MISSIONS.map(m=>{
    const p=G.missionProg[m.id]||0,t=m.target||(m.ids?m.ids.length:1);
    const pct=Math.min((p/t)*100,100),done=p>=t,claimed=G.missionClaimed[m.id];
    return `<div class="miss-card ${claimed?'claimed':done?'done':''}">
      <div class="mc-head"><div class="mc-title">${claimed?'✅ ':done?'🎉 ':'🎯 '}${m.title}</div><div class="mc-reward">${m.rl}</div></div>
      <div class="mc-desc">${m.desc}</div>
      <div class="mc-bar"><div class="mc-fill" style="width:${pct}%"></div></div>
      <div class="mc-foot"><div class="mc-count">${Math.min(p,t)} / ${t}</div>
        <button class="btn-claim" data-id="${m.id}" ${!done||claimed?'disabled':''}>${claimed?'✓ Claimed':done?'🎁 Klaim!':'Belum...'}</button>
      </div>
    </div>`;
  }).join('');
  list.querySelectorAll('.btn-claim').forEach(b=>{if(!b.disabled)b.addEventListener('click',()=>claimMission(b.dataset.id));});
}

function claimMission(id) {
  const m=MISSIONS.find(x=>x.id===id); if(!m||G.missionClaimed[id]) return;
  G.missionClaimed[id]=true;
  if(m.reward.coins) G.coins+=m.reward.coins;
  if(m.reward.gems)  G.gems+=m.reward.gems;
  if(m.reward.frags) G.fragments+=m.reward.frags;
  if(m.reward.xp)    addXP(m.reward.xp);
  showToast('🎉 Mission selesai! '+m.rl);
  updateHUD();renderMissions();saveG();
}

/* ══════════════════════════════════
   15. PETS
══════════════════════════════════ */
function renderPets() {
  const grid=$('pets-grid'); if(!grid) return;
  const ap=G.activePet?PETS.find(p=>p.id===G.activePet):null;
  setText('pet-badge',ap?ap.icon+' '+ap.name+' aktif':'Tidak ada');
  grid.innerHTML=PETS.map(pet=>{
    const owned=G.ownedPets.includes(pet.id),active=G.activePet===pet.id;
    return `<div class="pet-card ${active?'active-pet':owned?'owned':'locked'}">
      <div class="pet-ic">${pet.icon}</div>
      <div class="pet-nm">${pet.name}</div>
      <div class="pet-bn">${pet.desc}</div>
      <div class="pet-st ${active?'pst-a':owned?'pst-o':'pst-c'}">${active?'⭐ Aktif':owned?'✓ Milikmu':'💰 '+fmt(pet.cost)}</div>
      ${owned?`<button class="btn-equip" data-id="${pet.id}">${active?'Lepas':'Pasang'}</button>`:`<button class="btn-buy-pet" data-id="${pet.id}">Beli ${fmt(pet.cost)}💰</button>`}
    </div>`;
  }).join('');
  grid.querySelectorAll('.btn-equip').forEach(b=>b.addEventListener('click',()=>equipPet(b.dataset.id)));
  grid.querySelectorAll('.btn-buy-pet').forEach(b=>b.addEventListener('click',()=>buyPet(b.dataset.id)));
}
function equipPet(id) {
  G.activePet=G.activePet===id?null:id;
  const p=PETS.find(x=>x.id===id);
  showToast(G.activePet?p.icon+' '+p.name+' dipasang!':'Pet dilepas');
  renderPets();updateHUD();saveG();
}
function buyPet(id) {
  const p=PETS.find(x=>x.id===id);
  if(!p||G.ownedPets.includes(id)){showToast('Sudah punya!');return;}
  if(G.coins<p.cost){showToast('💸 Butuh '+fmt(p.cost)+'💰');return;}
  G.coins-=p.cost;G.ownedPets.push(id);
  showToast('🎉 '+p.icon+' '+p.name+' dibeli!');
  renderPets();updateHUD();saveG();
}

/* ══════════════════════════════════
   16. MAP
══════════════════════════════════ */
function renderMap() {
  const grid=$('map-grid'); if(!grid) return;
  grid.innerHTML=MAPS.map(m=>`
    <div class="map-card ${G.currentMap===m.id?'selected':''}" data-id="${m.id}" style="background:${m.bg}">
      <div class="mc-em">${m.emoji}</div>
      <div class="mc-nm">${m.name}</div>
      <div class="mc-dc">${m.desc}</div>
      <div class="mc-bn">${m.bl}</div>
    </div>`).join('');
  grid.querySelectorAll('.map-card').forEach(c=>c.addEventListener('click',()=>selectMap(c.dataset.id)));
}
function selectMap(id) {
  G.currentMap=id;
  const m=MAPS.find(x=>x.id===id);
  showToast('🗺️ Pindah ke '+m.name);
  if(scene) scene.resize();
  renderMap();updateHUD();saveG();
}

/* ══════════════════════════════════
   17. UPGRADES
══════════════════════════════════ */
function upgradeRod() {
  const nr=RODS[G.rodLevel+1];
  if(!nr){showToast('🎣 Rod sudah MAX!');return;}
  if(G.coins<nr.cost){showToast('💸 Butuh '+fmt(nr.cost)+'💰');return;}
  G.coins-=nr.cost;G.rodLevel++;
  showToast('⬆️ Upgrade ke '+nr.name+'! Max '+nr.maxKg+'kg');
  updateHUD();saveG();
}
function upgradeBait() {
  const nb=BAITS[G.baitLevel+1];
  if(!nb){showToast('🪱 Bait sudah MAX!');return;}
  if(G.coins<nb.cost){showToast('💸 Butuh '+fmt(nb.cost)+'💰');return;}
  G.coins-=nb.cost;G.baitLevel++;
  showToast('⬆️ Upgrade ke '+nb.name+'!');
  updateHUD();saveG();
}

/* ══════════════════════════════════
   18. DAILY LOGIN
══════════════════════════════════ */
function checkDailyLogin() {
  const today=new Date().toDateString();
  if(G.lastLoginDate===today) return;
  const yesterday=new Date(Date.now()-86400000).toDateString();
  G.loginStreak=G.lastLoginDate===yesterday?(G.loginStreak||0)+1:1;
  G.lastLoginDate=today;
  // Rewards scale with streak
  const streak=G.loginStreak;
  const coinReward=100*Math.min(streak,7);
  const fragReward=streak>=3?Math.floor(streak/3):0;
  const gemReward=streak>=7?1:0;
  G.coins+=coinReward; G.fragments+=fragReward; G.gems+=gemReward;
  // Show modal
  const rewardsEl=$('daily-rewards');
  if(rewardsEl) {
    let html=`<div class="dr-item"><span>💰</span>+${coinReward}</div>`;
    if(fragReward>0) html+=`<div class="dr-item"><span>🔩</span>+${fragReward}</div>`;
    if(gemReward>0)  html+=`<div class="dr-item"><span>💎</span>+${gemReward}</div>`;
    rewardsEl.innerHTML=html;
  }
  setText('daily-login-text',`Hari ke-${streak} berturut-turut! Makin besar hadiahnya!`);
  showModal('modal-daily');
  updateHUD(); saveG();
}

/* ══════════════════════════════════
   19. SETTINGS
══════════════════════════════════ */
function renderSettings() {
  const sd=$('stat-disp');
  if(sd) sd.innerHTML=`Total tangkap: ${G.totalCaught}<br>Coin diperoleh: ${fmt(G.totalCoinsEarned)}💰<br>Terberat: ${G.heaviestCatch}kg<br>Legendary: ${G.legendaryCount} · Mythic: ${G.mythicCount}<br>Fragment: ${G.fragments||0}🔩<br>Login streak: ${G.loginStreak||1} hari<br>Rod: ${RODS[G.rodLevel].name}<br>Bait: ${BAITS[G.baitLevel].name}`;
  const ni=$('name-input'); if(ni) ni.value=G.playerName;
  const si=$('tog-sfx');    if(si) si.checked=G.sfx;
  const mi=$('tog-music');  if(mi) mi.checked=G.music;
}

/* ══════════════════════════════════
   20. SFX
══════════════════════════════════ */
let _actx=null;
function getActx() {
  if(!_actx) _actx=new(window.AudioContext||window.webkitAudioContext)();
  if(_actx.state==='suspended') _actx.resume();
  return _actx;
}
function playSFX(type) {
  if(!G.sfx) return;
  try {
    const ctx=getActx();
    const osc=ctx.createOscillator(), gain=ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    const C={
      cast:    {f:330,f2:440,t:'sine',     d:.18,v:.2},
      splash:  {f:200,f2:150,t:'sawtooth', d:.25,v:.22},
      bite:    {f:660,f2:880,t:'sine',     d:.2, v:.25},
      reel:    {f:280,f2:380,t:'sine',     d:.1, v:.12},
      fight:   {f:180,f2:120,t:'square',   d:.18,v:.15},
      miss:    {f:220,f2:100,t:'sawtooth', d:.3, v:.18},
      break:   {f:150,f2:80, t:'square',   d:.4, v:.2},
      catch:   {f:523,f2:784,t:'sine',     d:.35,v:.25},
      Common:  {f:440,f2:550,t:'sine',     d:.22,v:.2},
      Uncommon:{f:523,f2:660,t:'sine',     d:.28,v:.22},
      Rare:    {f:659,f2:880,t:'triangle', d:.32,v:.25},
      Epic:    {f:784,f2:1047,t:'triangle',d:.4, v:.28},
      Legendary:{f:1047,f2:1568,t:'square',d:.55,v:.2},
      Mythic:  {f:1319,f2:2093,t:'sawtooth',d:.9,v:.18},
      levelup: {f:880,f2:1320,t:'sine',   d:.6, v:.28},
      fusion:  {f:600,f2:900,t:'triangle',d:.4, v:.22},
    }[type]||{f:440,f2:550,t:'sine',d:.2,v:.2};
    osc.type=C.t;
    osc.frequency.setValueAtTime(C.f,ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(C.f2,ctx.currentTime+C.d);
    gain.gain.setValueAtTime(C.v,ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+C.d);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime+C.d+.01);
  } catch(e){}
}

/* ══════════════════════════════════
   21. UI HELPERS
══════════════════════════════════ */
let _toastTimer=null;
function showToast(msg) {
  const el=$('toast'); if(!el) return;
  el.textContent=msg; el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer=setTimeout(()=>el.classList.remove('show'),2600);
}
function showModal(id){const el=$(id);if(el)el.style.display='flex';}
function hideModal(id){const el=$(id);if(el)el.style.display='none';}
function setText(id,t){const el=$(id);if(el)el.textContent=t;}
function $(id){return document.getElementById(id);}
function fmt(n){n=Math.floor(n);if(n>=1000000)return(n/1000000).toFixed(1)+'M';if(n>=1000)return(n/1000).toFixed(1)+'K';return n.toString();}

/* ══════════════════════════════════
   22. TAB SWITCHING
══════════════════════════════════ */
const ALL_TABS=['fishing','aquarium','market','exchange','missions','pets','map','settings'];

function switchTab(tab) {
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  ALL_TABS.forEach(t=>{
    const el=$('tab-'+t); if(!el) return;
    if(t===tab){el.classList.remove('hidden');el.classList.add('active');el.style.display='flex';}
    else{el.classList.add('hidden');el.style.display='none';}
  });
  if(tab==='aquarium')  renderAquarium();
  if(tab==='market')    {renderSell();renderBuy();}
  if(tab==='exchange')  renderExchange();
  if(tab==='missions')  renderMissions();
  if(tab==='pets')      renderPets();
  if(tab==='map')       renderMap();
  if(tab==='settings')  renderSettings();
}

function initMktTabs() {
  document.querySelectorAll('.mkt-tab').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.mkt-tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const t=btn.dataset.mt;
      ['sell','buy'].forEach(p=>{
        const el=$('mt-'+p); if(!el) return;
        el.classList.toggle('hidden',p!==t); el.style.display=p===t?'block':'none';
      });
      if(t==='sell') renderSell(); if(t==='buy') renderBuy();
    });
  });
}

function initExcTabs() {
  document.querySelectorAll('.exc-tab').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.exc-tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const t=btn.dataset.et;
      ['fusion','mystery','daily','recipes'].forEach(p=>{
        const el=$('et-'+p); if(!el) return;
        el.classList.toggle('hidden',p!==t); el.style.display=p===t?'flex':'none';
      });
      if(t==='fusion')  renderFusion();
      if(t==='daily')   renderDailyExchange();
      if(t==='recipes') renderRecipes();
    });
  });
}

function initFilters() {
  document.querySelectorAll('.filt').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.filt').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active'); renderAquarium(btn.dataset.f);
    });
  });
}

/* ══════════════════════════════════
   23. MAIN INIT
══════════════════════════════════ */
function init() {
  loadG();

  // Ensure new fields
  if(!G.fragments)         G.fragments=0;
  if(!G.recipeCooldowns)   G.recipeCooldowns={};
  if(!G.fusionCooldowns)   G.fusionCooldowns={};
  if(!G.dailyExchangeUsed) G.dailyExchangeUsed={};
  if(!G.spotsVisited)      G.spotsVisited={};
  if(G.fusionsDone===undefined) G.fusionsDone=0;

  // Start button
  const btnStart=$('btn-start');
  if(btnStart) {
    const startGame=(e)=>{
      e.preventDefault(); e.stopPropagation();
      $('splash-screen').style.display='none';
      $('game-wrapper').style.display='flex';
      initCanvas();
      setPhase('idle');
      updateHUD();
      updateSpotHUD();
      renderMissions();
      checkDailyLogin();
      try{getActx();}catch(x){}
    };
    btnStart.addEventListener('click',startGame);
    btnStart.addEventListener('touchend',startGame,{passive:false});
  }

  // Nav
  document.querySelectorAll('.nav-btn').forEach(btn=>{
    btn.addEventListener('click',()=>switchTab(btn.dataset.tab));
  });

  // Fishing buttons
  ['btn-cast'].forEach(id=>{
    $(id)?.addEventListener('click',doCast);
    $(id)?.addEventListener('touchend',e=>{e.preventDefault();doCast();},{passive:false});
  });
  $('btn-cancel')?.addEventListener('click',doCancel);
  ['btn-pull'].forEach(id=>{
    $(id)?.addEventListener('click',doPull);
    $(id)?.addEventListener('touchend',e=>{e.preventDefault();doPull();},{passive:false});
  });
  ['btn-reel'].forEach(id=>{
    $(id)?.addEventListener('click',doReel);
    $(id)?.addEventListener('touchend',e=>{e.preventDefault();doReel();},{passive:false});
  });

  $('btn-miss-retry')?.addEventListener('click',()=>{scene.doReset();setPhase('idle');});
  $('btn-break-retry')?.addEventListener('click',()=>{scene.doReset();setPhase('idle');});
  $('btn-continue')?.addEventListener('click',()=>{scene.doReset();setPhase('idle');});

  // Upgrades
  $('btn-upg-rod')?.addEventListener('click',upgradeRod);
  $('btn-upg-bait')?.addEventListener('click',upgradeBait);

  // Level up
  $('btn-lvl-ok')?.addEventListener('click',()=>hideModal('modal-lvl'));

  // Daily login
  $('btn-daily-ok')?.addEventListener('click',()=>hideModal('modal-daily'));

  // Mystery box
  $('btn-mys-500')?.addEventListener('click',()=>doMysteryBox(false));
  $('btn-mys-gem')?.addEventListener('click',()=>doMysteryBox(true));

  // Settings
  $('tog-sfx')?.addEventListener('change',e=>{G.sfx=e.target.checked;saveG();});
  $('tog-music')?.addEventListener('change',e=>{G.music=e.target.checked;saveG();});
  $('name-input')?.addEventListener('input',e=>{G.playerName=e.target.value.trim()||'Angler';updateHUD();saveG();});
  $('btn-reset')?.addEventListener('click',()=>showModal('modal-reset'));
  $('btn-yes-reset')?.addEventListener('click',resetG);
  $('btn-no-reset')?.addEventListener('click',()=>hideModal('modal-reset'));

  initMktTabs(); initExcTabs(); initFilters();

  // Starter bonus
  if(!G.totalCaught && !G.coins) {
    G.coins=200; G.fragments=5;
    showToast('🎣 Selamat datang! +200💰 +5🔩 starter!');
    saveG();
  }

  document.addEventListener('touchstart',()=>{try{getActx();}catch(e){}},{once:true,passive:true});
  window.addEventListener('resize',()=>{if(scene)scene.resize();});
}

function initCanvas() {
  const cv=$('game-canvas'); if(!cv) return;
  scene=new FishingScene(cv);
  scene.resize();
  scene.start();
  scene.attachDragEvents();
  // Restore scroll position
  scene.scrollX=G.worldScrollX||0;
  const sh=$('scene-hud'); if(sh) sh.style.display='flex';
  updateHUD();
  // Periodically save scroll position
  setInterval(()=>{if(scene){G.worldScrollX=scene.scrollX;}},2000);
}

document.addEventListener('DOMContentLoaded',init);
