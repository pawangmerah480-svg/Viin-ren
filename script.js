/* ═══════════════════════════════════════════════
   CRYPTO FISHING TYCOON — script.js  v3.0
   Fish It Gileg Edition
   Canvas 2D Scene + Full Fishing Mechanic + EXCHANGE
═══════════════════════════════════════════════ */
'use strict';

/* ══════════════════════════════════
   1. DATA & CONSTANTS
══════════════════════════════════ */

const WEIGHT_RANGE = {
  Common:    [0.5,  2],
  Uncommon:  [1,    5],
  Rare:      [3,   15],
  Epic:      [10,  50],
  Legendary: [30, 150],
  Mythic:    [100,300],
};

function sizeLabel(kg) {
  if (kg < 2)   return 'Kecil';
  if (kg < 10)  return 'Sedang';
  if (kg < 50)  return 'Besar';
  return 'Boss';
}

const RODS = [
  { id:'basic',  name:'Basic Rod',  icon:'🎣', maxKg:10,  bonus:{},            cost:0,     xpMul:1   },
  { id:'trader', name:'Trader Rod', icon:'🎣', maxKg:25,  bonus:{Rare:2},      cost:500,   xpMul:1.2 },
  { id:'sultan', name:'Sultan Rod', icon:'🎣', maxKg:60,  bonus:{Epic:3},      cost:1500,  xpMul:1.5 },
  { id:'whale',  name:'Whale Rod',  icon:'🎣', maxKg:150, bonus:{Legendary:3}, cost:5000,  xpMul:2   },
  { id:'god',    name:'God Rod',    icon:'🪄', maxKg:500, bonus:{Mythic:4},    cost:20000, xpMul:3   },
];

const BAITS = [
  { name:'Basic Bait',     waitMin:3000, waitMax:5000, cost:0    },
  { name:'Pro Bait',       waitMin:2000, waitMax:3800, cost:200  },
  { name:'Turbo Bait',     waitMin:1200, waitMax:2500, cost:700  },
  { name:'Legendary Bait', waitMin:600,  waitMax:1500, cost:2000 },
];

const FISH_DATA = {
  Common: [
    { id:'doge',   name:'Dogecoin (DOGE)',              icon:'🐟', baseVal:28  },
    { id:'shib',   name:'Shiba Inu (SHIB)',             icon:'🐟', baseVal:22  },
    { id:'ada',    name:'Cardano (ADA)',                icon:'🐟', baseVal:32  },
    { id:'matic',  name:'Polygon (MATIC)',              icon:'🐟', baseVal:27  },
    { id:'usd_idr',name:'USD/IDR',                     icon:'🐟', baseVal:35  },
    { id:'eur_usd',name:'EUR/USD',                     icon:'🐟', baseVal:33  },
    { id:'bbri',   name:'Bank Rakyat Indonesia (BBRI)', icon:'🐟', baseVal:40  },
    { id:'tlkm',   name:'Telkom Indonesia (TLKM)',      icon:'🐟', baseVal:36  },
  ],
  Uncommon: [
    { id:'sol',    name:'Solana (SOL)',              icon:'🐠', baseVal:85  },
    { id:'dot',    name:'Polkadot (DOT)',            icon:'🐠', baseVal:80  },
    { id:'avax',   name:'Avalanche (AVAX)',          icon:'🐠', baseVal:90  },
    { id:'link',   name:'Chainlink (LINK)',          icon:'🐠', baseVal:83  },
    { id:'gbp_usd',name:'GBP/USD',                  icon:'🐠', baseVal:95  },
    { id:'usd_jpy',name:'USD/JPY',                  icon:'🐠', baseVal:90  },
    { id:'bbca',   name:'Bank Central Asia (BBCA)',  icon:'🐠', baseVal:105 },
    { id:'bmri',   name:'Bank Mandiri (BMRI)',       icon:'🐠', baseVal:100 },
  ],
  Rare: [
    { id:'bnb',    name:'Binance Coin (BNB)',          icon:'🐡', baseVal:200 },
    { id:'ltc',    name:'Litecoin (LTC)',              icon:'🐡', baseVal:185 },
    { id:'atom',   name:'Cosmos (ATOM)',               icon:'🐡', baseVal:195 },
    { id:'xrp',    name:'XRP',                        icon:'🐡', baseVal:215 },
    { id:'aud_usd',name:'AUD/USD',                    icon:'🐡', baseVal:230 },
    { id:'usd_chf',name:'USD/CHF',                    icon:'🐡', baseVal:220 },
    { id:'asii',   name:'Astra International (ASII)', icon:'🐡', baseVal:250 },
    { id:'unvr',   name:'Unilever Indonesia (UNVR)',   icon:'🐡', baseVal:240 },
  ],
  Epic: [
    { id:'eth',    name:'Ethereum (ETH)',   icon:'🐙', baseVal:500 },
    { id:'ripple', name:'Ripple (XRP)',     icon:'🐙', baseVal:475 },
    { id:'eur_jpy',name:'EUR/JPY',         icon:'🐙', baseVal:530 },
    { id:'gbp_jpy',name:'GBP/JPY',         icon:'🐙', baseVal:520 },
    { id:'indf',   name:'Indofood (INDF)', icon:'🐙', baseVal:550 },
    { id:'ggrm',   name:'Gudang Garam (GGRM)', icon:'🐙', baseVal:570 },
  ],
  Legendary: [
    { id:'btc',    name:'Bitcoin (BTC)',                icon:'🐋', baseVal:1400 },
    { id:'eth_btc',name:'ETH/BTC',                     icon:'🐋', baseVal:1300 },
    { id:'usd_cad',name:'USD/CAD',                     icon:'🐋', baseVal:1200 },
    { id:'bbni',   name:'Bank Negara Indonesia (BBNI)', icon:'🐋', baseVal:1500 },
  ],
  Mythic: [
    { id:'satoshi',   name:'Satoshi Coin (MYTHIC)', icon:'🐉', baseVal:4500 },
    { id:'qbtc',      name:'Quantum Bitcoin',       icon:'🐉', baseVal:5500 },
    { id:'gmwhale',   name:'Global Market Whale',   icon:'🐉', baseVal:7000 },
    { id:'idx_dragon',name:'IDX Dragon Asset',      icon:'🐉', baseVal:7500 },
  ],
};

const RARITY_PRICE_MUL = { Common:1, Uncommon:1.5, Rare:2.5, Epic:4, Legendary:8, Mythic:20 };
const BASE_RATES = { Common:55, Uncommon:20, Rare:12, Epic:7, Legendary:4, Mythic:2 };

const MAPS = [
  { id:'river',  name:'River Market', emoji:'🌊', desc:'Saham Indonesia umum', bonus:{Common:10},    bl:'+10% Common',    bg:'linear-gradient(135deg,#1a6fa3,#0d4a7a)', skyA:'#87ceeb', skyB:'#ffe0b2' },
  { id:'forex',  name:'Forex Ocean',  emoji:'💹', desc:'Pair forex dunia',     bonus:{Rare:5},       bl:'+5% Rare',       bg:'linear-gradient(135deg,#0a4f7a,#062040)', skyA:'#4682b4', skyB:'#b8d4e8' },
  { id:'crypto', name:'Crypto Sea',   emoji:'🪙', desc:'Cryptocurrency top',   bonus:{Epic:5},       bl:'+5% Epic',       bg:'linear-gradient(135deg,#1a3a7a,#0a1f5a)', skyA:'#3a4fa0', skyB:'#8898cc' },
  { id:'abyss',  name:'Whale Abyss',  emoji:'🌌', desc:'Legendary & Mythic!', bonus:{Legendary:5},  bl:'+5% Legendary',  bg:'linear-gradient(135deg,#1a0a5a,#300a8a)', skyA:'#1a0040', skyB:'#4a2080' },
  { id:'trench', name:'Mythic Trench',emoji:'🐉', desc:'Zona eksklusif Mythic',bonus:{Mythic:3},     bl:'+3% Mythic',     bg:'linear-gradient(135deg,#3a0a6a,#1a0040)', skyA:'#0a0020', skyB:'#2a0060' },
];

const PETS = [
  { id:'koi',    name:'Lucky Koi',       icon:'🐟', bonus:{Rare:2},             coinMul:1,   xpMul:1,    desc:'+2% Rare',             cost:1000 },
  { id:'octo',   name:'Smart Octopus',   icon:'🐙', bonus:{},                   coinMul:1,   xpMul:1.1,  desc:'+10% XP',              cost:2000 },
  { id:'puffer', name:'Treasure Puffer', icon:'🐡', bonus:{},                   coinMul:1.1, xpMul:1,    desc:'+10% Coin',            cost:3500 },
  { id:'dragon', name:'Crypto Dragon',   icon:'🐉', bonus:{Legendary:2,Mythic:1},coinMul:1, xpMul:1,    desc:'+2%Legend +1%Mythic',  cost:10000 },
];

const MISSIONS = [
  { id:'m1', title:'Pemancing Pemula',    desc:'Tangkap 5 ikan Common',           type:'catch_rarity', rarity:'Common',    target:5,  reward:{coins:200,xp:50},      rl:'+200💰 +50XP' },
  { id:'m2', title:'Trader Forex',        desc:'Tangkap 3 pair Forex',            type:'catch_ids',    ids:['usd_idr','eur_usd','gbp_usd','usd_jpy','aud_usd','usd_chf','eur_jpy','gbp_jpy','usd_cad'], target:3, reward:{coins:400,xp:100}, rl:'+400💰 +100XP' },
  { id:'m3', title:'Crypto Hunter',       desc:'Tangkap 5 aset Crypto',           type:'catch_ids',    ids:['doge','shib','ada','matic','sol','dot','avax','link','bnb','ltc','atom','xrp','eth','ripple','btc','eth_btc','satoshi','qbtc','gmwhale','idx_dragon'], target:5, reward:{coins:500,xp:150}, rl:'+500💰 +150XP' },
  { id:'m4', title:'Penangkap Legendaris',desc:'Tangkap 1 ikan Legendary',        type:'catch_rarity', rarity:'Legendary', target:1,  reward:{coins:1000,gems:2,xp:300}, rl:'+1000💰 +2💎' },
  { id:'m5', title:'Sultan Saham',        desc:'Tangkap saham BBCA dan BBRI',     type:'catch_both',   ids:['bbca','bbri'],                                             reward:{coins:600,xp:200},  rl:'+600💰 +200XP' },
  { id:'m6', title:'Pencari Mythic',      desc:'Tangkap 1 ikan Mythic',           type:'catch_rarity', rarity:'Mythic',    target:1,  reward:{coins:5000,gems:10,xp:1000}, rl:'+5000💰 +10💎' },
  { id:'m7', title:'Kolektor Aquarium',   desc:'Kumpulkan 20 ikan total',          type:'total_catch',                      target:20, reward:{coins:800,xp:250},     rl:'+800💰 +250XP' },
  { id:'m8', title:'Pancing Kuat!',       desc:'Tangkap ikan dengan berat 50kg+', type:'heavy_catch',                      target:1,  reward:{gems:3,xp:400},         rl:'+3💎 +400XP' },
];

const XP_TABLE = [0,100,250,450,700,1000,1400,1900,2500,3200,4000,5000,6200,7600,9200,11000,13200,15700,18500,21600,25000,30000];
const BITE_WINDOW_MS = 3000;

// FRAGMENT & EXCHANGE
const FRAGMENT_TYPES = ['trader','sultan','whale','god'];
const FRAGMENT_RECIPES = [
  { fragType: 'trader', cost: 5, rewardRarity: 'Epic', rewardCount: 1, desc: '5 Trader Fragment → 1 Ikan Epic' },
  { fragType: 'sultan', cost: 3, rewardRarity: 'Legendary', rewardCount: 1, desc: '3 Sultan Fragment → 1 Ikan Legendary' },
  { fragType: 'whale', cost: 5, rewardRarity: 'Legendary', rewardCount: 1, desc: '5 Whale Fragment → 1 Ikan Legendary' },
  { fragType: 'god', cost: 3, rewardRarity: 'Mythic', rewardCount: 1, desc: '3 God Fragment → 1 Ikan Mythic' },
];

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
  // Exchange
  fragments: { trader:0, sultan:0, whale:0, god:0 },
  exchangeCooldowns: {}, // untuk mystery box
};

function saveG()  { try { localStorage.setItem('cft3_save', JSON.stringify(G)); } catch(e){} }
function loadG()  { 
  try { 
    const s=localStorage.getItem('cft3_save'); 
    if(s) {
      let loaded = JSON.parse(s);
      // merge dengan default untuk properti baru
      G = Object.assign({}, G, loaded);
      // pastikan fragments ada
      if (!G.fragments) G.fragments = { trader:0, sultan:0, whale:0, god:0 };
      if (!G.exchangeCooldowns) G.exchangeCooldowns = {};
    }
  } catch(e){} 
}
function resetG() { localStorage.removeItem('cft3_save'); location.reload(); }

/* ══════════════════════════════════
   3. CANVAS FISHING SCENE (singkat, sudah ada di kode asli)
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
    this.spawnTimer = null;
    this.running = false;
    this.phase = 'idle';
    this.onBite = null;
    this.onCastDone = null;
  }
  resize() { /* sama seperti kode asli */ }
  start() { if(this.running) return; this.running=true; this._loop(); }
  stop()  { this.running=false; if(this._raf) cancelAnimationFrame(this._raf); }
  _loop() { /* ... */ }
  _update() { /* ... */ }
  _draw() { /* ... */ }
  _drawClouds(ctx, W, wy) { /* ... */ }
  _drawWaves(ctx, W, wy) { /* ... */ }
  _drawSeaweed(ctx, W, H, wy) { /* ... */ }
  _drawUwBubbles(ctx, W, H, wy) { /* ... */ }
  _drawRod(ctx) { /* ... */ }
  _drawBobber(ctx, x, y) { /* ... */ }
  _drawRipple(ctx, x, y, r, alpha) { /* ... */ }
  _drawFish(ctx, f) { /* ... */ }
  _drawEffect(ctx, e) { /* ... */ }
  _doSpawnSplash(x, y, n) { /* ... */ }
  _doSpawnBubbles(x, y, n) { /* ... */ }
  _doSpawnRipples(x, y) { /* ... */ }
  doCast(targetXFrac) { /* ... */ }
  _startSpawning(mapIdx) { /* ... */ }
  _spawnAmbientFish() { /* ... */ }
  _spawnBiterFish() { /* ... */ }
  doReel(fishIcon) { /* ... */ }
  doBreak() { /* ... */ }
  doCatch() { /* ... */ }
  doReset() { /* ... */ }
}

/* ══════════════════════════════════
   4. DROP RATE ENGINE (sama)
══════════════════════════════════ */
function calcRates() { /* ... */ }
function applyBonus(r, bonus, reduceCommon=true) { /* ... */ }
function pickRarity() { /* ... */ }
function pickFish(rarity) { /* ... */ }
function rollWeight(rarity) { /* ... */ }
function calcFishValue(fish, rarity, weight) { /* ... */ }

/* ══════════════════════════════════
   5. FISHING STATE MACHINE (sama)
══════════════════════════════════ */
const STATES = ['idle','casting','waiting','bite','reeling','rodbreak','miss','result'];
let fishingPhase = 'idle';
let pendingCatch = null;
let pullProgress = 0;
let biteTimer    = null;
let biteCountInt = null;
let autoReelInt  = null;
let scene = null;

function setPhase(ph) { /* ... */ }
function doCast() { /* ... */ }
function doCancel() { /* ... */ }
function onFishBite() { /* ... */ }
function doPull() { /* ... */ }
function doReel() { /* ... */ }
function onCatchSuccess() { /* ... */ }
function onMiss() { /* ... */ }
function updateReelBar() { /* ... */ }
function updateTensionBar(weight, maxKg) { /* ... */ }
function showResult(fish, rarity, weight, coins, xp, gems) { /* ... */ }
function spawnSparkles(rarity) { /* ... */ }
function doShake() { /* ... */ }
function showBiteAlert(show) { /* ... */ }

/* ══════════════════════════════════
   6. WAIT ARC & BITE COUNTDOWN (sama)
══════════════════════════════════ */
let waitArcIv = null;
let waitArcP  = 0;
function startWaitArc() { /* ... */ }
function stopWaitArc() { /* ... */ }
let biteCountStart = 0;
function startBiteCountdown() { /* ... */ }
function stopBiteCountdown() { /* ... */ }

/* ══════════════════════════════════
   7. XP & LEVELING (sama)
══════════════════════════════════ */
function addXP(amt) { /* ... */ }
function showLevelUp() { /* ... */ }
function xpProgress() { /* ... */ }

/* ══════════════════════════════════
   8. HUD (sama)
══════════════════════════════════ */
function updateHUD() { 
  setText('hud-coins', fmt(G.coins));
  setText('hud-gems',  fmt(G.gems));
  setText('hud-lv',    'Lv.' + G.level);
  setText('hud-name',  G.playerName);
  setText('hud-xp-txt', fmt(G.xp) + 'xp');
  setText('mkt-coins', fmt(G.coins));
  const xpFill = $('hud-xp-fill');
  if (xpFill) xpFill.style.width = xpProgress() + '%';
  const map = MAPS.find(m => m.id === G.currentMap);
  if (map) {
    setText('inf-map', map.emoji + ' ' + map.name);
    setText('map-badge', map.name);
  }
  const rod = RODS[G.rodLevel];
  if (rod) {
    setText('inf-rod', rod.icon + ' ' + rod.name);
    const rodFill = $('rod-str-fill');
    if (rodFill) rodFill.style.width = ((G.rodLevel+1) / RODS.length * 100) + '%';
    setText('rod-str-label', rod.maxKg + 'kg');
    $('sh-rod') && setText('sh-rod', rod.icon + ' ' + rod.name);
    $('sh-map') && setText('sh-map', map ? map.emoji + ' ' + map.name : '');
  }
  setText('s-catch', G.totalCaught);
  setText('s-xp',    fmt(G.xp));
  setText('s-leg',   G.legendaryCount);
  setText('s-myth',  G.mythicCount);
  const nr = RODS[G.rodLevel+1];
  setText('rod-cost', nr ? fmt(nr.cost) : 'MAX');
  const nb = BAITS[G.baitLevel+1];
  setText('bait-cost', nb ? fmt(nb.cost) : 'MAX');
  const rb = $('btn-upg-rod');
  if (rb) rb.disabled = !nr || G.coins < nr.cost;
  const bb = $('btn-upg-bait');
  if (bb) bb.disabled = !nb || G.coins < nb.cost;
  
  // Update fragment display di exchange nanti dipanggil terpisah
}

/* ══════════════════════════════════
   9. AQUARIUM (sama)
══════════════════════════════════ */
function renderAquarium(filter='all') { /* ... */ }
function getAllFish() { /* ... */ }
function getFishById(id) { /* ... */ }

/* ══════════════════════════════════
   10. MARKET (sama)
══════════════════════════════════ */
function renderSell() { /* ... */ }
function renderBuy() { /* ... */ }
function sellFish(id, price) { /* ... */ }
function buyFish(id, price) { /* ... */ }
function rarityOf(id) { /* ... */ }

/* ══════════════════════════════════
   11. MISSIONS (sama)
══════════════════════════════════ */
function updateMissions(fish, rarity, weight) { /* ... */ }
function renderMissions() { /* ... */ }
function claimMission(id) { /* ... */ }

/* ══════════════════════════════════
   12. PETS (sama)
══════════════════════════════════ */
function renderPets() { /* ... */ }
function equipPet(id) { /* ... */ }
function buyPet(id) { /* ... */ }

/* ══════════════════════════════════
   13. MAP (sama)
══════════════════════════════════ */
function renderMap() { /* ... */ }
function selectMap(id) { /* ... */ }

/* ══════════════════════════════════
   14. UPGRADES (sama)
══════════════════════════════════ */
function upgradeRod() { /* ... */ }
function upgradeBait() { /* ... */ }

/* ══════════════════════════════════
   15. SETTINGS (sama)
══════════════════════════════════ */
function renderSettings() { /* ... */ }

/* ══════════════════════════════════
   16. SFX (sama)
══════════════════════════════════ */
let _actx = null;
function getActx() { /* ... */ }
function playSFX(type) { /* ... */ }

/* ══════════════════════════════════
   17. UI HELPERS (sama)
══════════════════════════════════ */
let _toastTimer = null;
function showToast(msg) { /* ... */ }
function showModal(id) { /* ... */ }
function hideModal(id) { /* ... */ }
function setText(id, t) { const el=$(id); if(el) el.textContent=t; }
function $(id) { return document.getElementById(id); }
function fmt(n) {
  n=Math.floor(n);
  if(n>=1000000) return (n/1000000).toFixed(1)+'M';
  if(n>=1000) return (n/1000).toFixed(1)+'K';
  return n.toString();
}

/* ══════════════════════════════════
   18. TAB SWITCHING (tambah exchange)
══════════════════════════════════ */
const ALL_TABS = ['fishing','aquarium','market','missions','pets','map','exchange','settings'];

function switchTab(tab) {
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  ALL_TABS.forEach(t => {
    const el=$('tab-'+t);
    if (!el) return;
    if (t===tab) { el.classList.remove('hidden'); el.classList.add('active'); el.style.display='flex'; }
    else         { el.classList.add('hidden'); el.style.display='none'; }
  });
  if (tab==='aquarium') renderAquarium();
  if (tab==='market')   { renderSell(); renderBuy(); }
  if (tab==='missions') renderMissions();
  if (tab==='pets')     renderPets();
  if (tab==='map')      renderMap();
  if (tab==='exchange') renderExchange();
  if (tab==='settings') renderSettings();
}

/* Market sub-tabs */
function initMktTabs() {
  document.querySelectorAll('.mkt-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mkt-tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const t=btn.dataset.mt;
      ['sell','buy'].forEach(p => {
        const el=$('mt-'+p);
        if (!el) return;
        el.classList.toggle('hidden', p!==t);
        el.style.display=p===t?'block':'none';
      });
      if(t==='sell') renderSell();
      if(t==='buy')  renderBuy();
    });
  });
}

/* Aquarium filters */
function initFilters() {
  document.querySelectorAll('.filt').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filt').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderAquarium(btn.dataset.f);
    });
  });
}

/* ══════════════════════════════════
   19. EXCHANGE (BARU)
══════════════════════════════════ */
function renderExchange() {
  renderMysteryBox();
  renderFragmentShop();
  updateFragmentDisplay();
}

function renderMysteryBox() {
  const btn = $('#btn-buy-mystery');
  if (!btn) return;
  // cek cooldown
  const last = G.exchangeCooldowns['mystery'] || 0;
  const now = Date.now();
  const cooldownLeft = Math.max(0, 30000 - (now - last));
  const cdEl = $('#mystery-cooldown');
  if (cdEl) {
    if (cooldownLeft > 0) {
      cdEl.textContent = `⏳ Cooldown: ${Math.ceil(cooldownLeft/1000)} detik`;
      btn.disabled = true;
    } else {
      cdEl.textContent = '';
      btn.disabled = false;
    }
  }
}

function updateFragmentDisplay() {
  setText('frag-trader', G.fragments.trader || 0);
  setText('frag-sultan', G.fragments.sultan || 0);
  setText('frag-whale', G.fragments.whale || 0);
  setText('frag-god', G.fragments.god || 0);
}

function renderFragmentShop() {
  const grid = $('#fragment-shop-grid');
  if (!grid) return;
  grid.innerHTML = FRAGMENT_RECIPES.map(r => {
    const canBuy = (G.fragments[r.fragType] || 0) >= r.cost;
    return `<div class="mfc">
      <div class="mfc-ic">🔮</div>
      <div class="mfc-nm">${r.desc}</div>
      <div class="mfc-qty">${r.cost} ${r.fragType} fragment</div>
      <button class="btn-buy-npc" data-frag="${r.fragType}" data-cost="${r.cost}" data-rarity="${r.rewardRarity}" ${!canBuy?'disabled':''}>Tukar</button>
    </div>`;
  }).join('');
  grid.querySelectorAll('.btn-buy-npc').forEach(btn => {
    btn.addEventListener('click', () => {
      const frag = btn.dataset.frag;
      const cost = parseInt(btn.dataset.cost);
      const rarity = btn.dataset.rarity;
      exchangeFragment(frag, cost, rarity);
    });
  });
}

function exchangeFragment(fragType, cost, rewardRarity) {
  if (G.fragments[fragType] < cost) {
    showToast('🔮 Fragment tidak cukup!');
    return;
  }
  G.fragments[fragType] -= cost;
  const fish = getRandomFishFromRarity(rewardRarity);
  const weight = rollWeight(rewardRarity);
  addFishToInventory(fish, rewardRarity, weight);
  showToast(`🎣 Dapat ${fish.name} (${weight}kg)!`);
  updateHUD();
  renderFragmentShop();
  updateFragmentDisplay();
  saveG();
}

function addFishToInventory(fish, rarity, weight) {
  G.inventory[fish.id] = G.inventory[fish.id] || { count:0, totalWeight:0 };
  G.inventory[fish.id].count++;
  G.inventory[fish.id].totalWeight = +(G.inventory[fish.id].totalWeight + weight).toFixed(1);
  G.totalCaught++;
  if (rarity==='Legendary') G.legendaryCount++;
  if (rarity==='Mythic') G.mythicCount++;
  if (weight > G.heaviestCatch) G.heaviestCatch = weight;
}

function getRandomFishFromRarity(rarity) {
  const pool = FISH_DATA[rarity];
  return pool[Math.floor(Math.random() * pool.length)];
}

function openMysteryBox() {
  if (G.coins < 500) { showToast('💰 Coin tidak cukup!'); return; }
  const last = G.exchangeCooldowns['mystery'] || 0;
  const now = Date.now();
  if (now - last < 30000) {
    const sisa = Math.ceil((30000 - (now - last)) / 1000);
    showToast(`⏳ Tunggu ${sisa} detik lagi!`);
    return;
  }
  G.coins -= 500;
  G.exchangeCooldowns['mystery'] = now;
  
  const r = Math.random() * 100;
  let reward = '';
  if (r < 50) { // coin
    let coin = 100 + Math.floor(Math.random() * 201);
    G.coins += coin;
    reward = `${coin}💰`;
  } else if (r < 70) { // common fish
    let fish = getRandomFishFromRarity('Common');
    let weight = rollWeight('Common');
    addFishToInventory(fish, 'Common', weight);
    reward = `🐟 ${fish.name} (${weight}kg)`;
  } else if (r < 80) { // uncommon
    let fish = getRandomFishFromRarity('Uncommon');
    let weight = rollWeight('Uncommon');
    addFishToInventory(fish, 'Uncommon', weight);
    reward = `🐠 ${fish.name} (${weight}kg)`;
  } else if (r < 88) { // rare
    let fish = getRandomFishFromRarity('Rare');
    let weight = rollWeight('Rare');
    addFishToInventory(fish, 'Rare', weight);
    reward = `🐡 ${fish.name} (${weight}kg)`;
  } else if (r < 93) { // epic
    let fish = getRandomFishFromRarity('Epic');
    let weight = rollWeight('Epic');
    addFishToInventory(fish, 'Epic', weight);
    reward = `🐙 ${fish.name} (${weight}kg)`;
  } else if (r < 96) { // legendary
    let fish = getRandomFishFromRarity('Legendary');
    let weight = rollWeight('Legendary');
    addFishToInventory(fish, 'Legendary', weight);
    reward = `🐋 ${fish.name} (${weight}kg)`;
  } else if (r < 98) { // mythic
    let fish = getRandomFishFromRarity('Mythic');
    let weight = rollWeight('Mythic');
    addFishToInventory(fish, 'Mythic', weight);
    reward = `🐉 ${fish.name} (${weight}kg)`;
  } else { // fragment
    let fragType = FRAGMENT_TYPES[Math.floor(Math.random()*4)];
    G.fragments[fragType] = (G.fragments[fragType] || 0) + 5;
    reward = `5 🔮 ${fragType} fragment`;
  }
  showToast(`🎁 Mystery Box: dapat ${reward}!`);
  updateHUD();
  renderExchange();
  saveG();
}

/* ══════════════════════════════════
   20. MAIN INIT
══════════════════════════════════ */
function init() {
  loadG();

  /* ── START BUTTON ── */
  const btnStart = $('btn-start');
  if (btnStart) {
    const startGame = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const splash = $('splash-screen');
      const wrapper = $('game-wrapper');
      if (splash) splash.style.display = 'none';
      if (wrapper) wrapper.style.display = 'flex';
      initCanvas();
      setPhase('idle');
      updateHUD();
      renderMissions();
      try { getActx(); } catch(x){}
    };
    btnStart.addEventListener('click', startGame);
    btnStart.addEventListener('touchend', startGame, { passive:false });
  }

  /* Nav tabs */
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  /* Fishing buttons */
  $('btn-cast').addEventListener('click', doCast);
  $('btn-cast').addEventListener('touchend', e=>{ e.preventDefault(); doCast(); }, {passive:false});
  $('btn-cancel').addEventListener('click', doCancel);
  $('btn-pull').addEventListener('click', doPull);
  $('btn-pull').addEventListener('touchend', e=>{ e.preventDefault(); doPull(); }, {passive:false});
  $('btn-reel').addEventListener('click', doReel);
  $('btn-reel').addEventListener('touchend', e=>{ e.preventDefault(); doReel(); }, {passive:false});
  $('btn-miss-retry').addEventListener('click',   ()=>{ scene.doReset(); setPhase('idle'); });
  $('btn-break-retry').addEventListener('click',  ()=>{ scene.doReset(); setPhase('idle'); });
  $('btn-continue').addEventListener('click',     ()=>{ scene.doReset(); setPhase('idle'); });

  /* Upgrades */
  $('btn-upg-rod').addEventListener('click', upgradeRod);
  $('btn-upg-bait').addEventListener('click', upgradeBait);

  /* Level up modal */
  $('btn-lvl-ok').addEventListener('click', ()=>hideModal('modal-lvl'));

  /* Settings */
  $('tog-sfx').addEventListener('change', e=>{ G.sfx=e.target.checked; saveG(); });
  $('tog-music').addEventListener('change', e=>{ G.music=e.target.checked; saveG(); });
  $('name-input').addEventListener('input', e=>{ G.playerName=e.target.value.trim()||'Angler'; updateHUD(); saveG(); });

  /* Reset */
  $('btn-reset').addEventListener('click', ()=>showModal('modal-reset'));
  $('btn-yes-reset').addEventListener('click', resetG);
  $('btn-no-reset').addEventListener('click',  ()=>hideModal('modal-reset'));

  /* Exchange */
  $('btn-buy-mystery').addEventListener('click', openMysteryBox);
  // sub-tab exchange
  document.querySelectorAll('#tab-exchange .mkt-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#tab-exchange .mkt-tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const t=btn.dataset.mt;
      ['mystery','fragment'].forEach(p => {
        const el=$('mt-'+p);
        if (!el) return;
        el.classList.toggle('hidden', p!==t);
        el.style.display=p===t?'block':'none';
      });
    });
  });

  /* Sub-systems */
  initMktTabs(); initFilters();

  /* Starter bonus */
  if (!G.totalCaught && !G.coins) {
    G.coins = 150;
    showToast('🎣 Selamat datang! Kamu dapat 150💰 starter!');
    saveG();
  }

  /* Unlock AudioContext on any touch (iOS) */
  document.addEventListener('touchstart', () => { try { getActx(); } catch(e){} }, { once:true, passive:true });

  window.addEventListener('resize', () => { if (scene) scene.resize(); });
}

function initCanvas() {
  const cv = $('game-canvas');
  if (!cv) return;
  scene = new FishingScene(cv);
  scene.resize();
  scene.start();
  const sh = $('scene-hud');
  if (sh) sh.style.display = 'flex';
  updateHUD();
}

document.addEventListener('DOMContentLoaded', init);