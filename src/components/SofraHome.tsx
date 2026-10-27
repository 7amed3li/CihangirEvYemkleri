"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { dishes, modes, type Dish, type FoodMode } from "@/data/sofraMenu";
import "@/app/sofra-home.css";

function price(value: number) {
  return `${value.toLocaleString("tr-TR")} ₺`;
}

const PHONE_TEL = "+902122513696";

// left % per column — three columns on desktop, two on mobile; rows are laid out in px so the table adapts to the dish count
const COLS_DESKTOP = [6, 37, 68];
const COLS_MOBILE = [2, 51];
const TRAY = 110;
const ROTATIONS = [-4, 3, -2, 4, -3, 2];

type Pos = { x: number; y: number };

export default function SofraHome({ locale = "tr" }: { locale?: string }) {
  const [mode, setMode] = useState<FoodMode>("all");
  const [active, setActive] = useState<Dish | null>(null);
  const [moved, setMoved] = useState<Record<string, Pos>>({});
  const [dragId, setDragId] = useState<string | null>(null);
  const [topId, setTopId] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [table, setTable] = useState<Record<string, number>>({});
  const [over, setOver] = useState(false);
  const [bump, setBump] = useState(false);
  const [copied, setCopied] = useState(false);
  const trayRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);
  const visible = useMemo(
    () =>
      mode === "all"
        ? dishes
        : dishes.filter((dish) => dish.mode === mode || (mode === "quick" && dish.mode === "home")),
    [mode]
  );

  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 800);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => { setMoved({}); }, [mobile]);

  const cols = mobile ? COLS_MOBILE : COLS_DESKTOP;
  const rows = Math.max(1, Math.ceil(visible.length / cols.length));
  const cell = mobile ? 215 : 235;
  const sceneH = rows * cell + 40 + TRAY;
  const posOf = (dish: Dish, index: number): Pos => {
    const r = Math.floor(index / cols.length);
    const def = { x: cols[index % cols.length], y: ((20 + r * cell) / sceneH) * 100 };
    return moved[dish.id] ?? def;
  };

  const addToTable = (dish: Dish) => {
    setTable((t) => ({ ...t, [dish.id]: (t[dish.id] ?? 0) + 1 }));
    setBump(true);
    window.setTimeout(() => setBump(false), 600);
  };
  const changeQty = (id: string, delta: number) =>
    setTable((t) => {
      const q = (t[id] ?? 0) + delta;
      const n = { ...t };
      if (q <= 0) delete n[id]; else n[id] = q;
      return n;
    });
  const items = dishes.filter((d) => table[d.id]);
  const count = items.reduce((s, d) => s + table[d.id], 0);
  const total = items.reduce((s, d) => s + table[d.id] * d.price, 0);
  const copyList = async () => {
    const text = `Cihangir sofram:\n${items.map((d) => `${table[d.id]}x ${d.name} — ${price(d.price * table[d.id])}`).join("\n")}\nToplam: ${price(total)}`;
    try { await navigator.clipboard.writeText(text); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch {}
  };

  const onDown = (e: React.PointerEvent<HTMLButtonElement>, dish: Dish, p: Pos) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id: dish.id, sx: e.clientX, sy: e.clientY, ox: p.x, oy: p.y, moved: false };
    setTopId(dish.id);
  };
  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    const scene = sceneRef.current;
    if (!d || !scene) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (!d.moved && Math.hypot(dx, dy) < 6) return;
    if (!d.moved) { d.moved = true; setDragId(d.id); setActive(null); }
    const rect = scene.getBoundingClientRect();
    const el = e.currentTarget;
    const maxX = Math.max(0, 100 - (el.offsetWidth / rect.width) * 100);
    const maxY = Math.max(0, 100 - (el.offsetHeight / rect.height) * 100);
    const x = Math.min(maxX, Math.max(0, d.ox + (dx / rect.width) * 100));
    const y = Math.min(maxY, Math.max(0, d.oy + (dy / rect.height) * 100));
    setMoved((m) => ({ ...m, [d.id]: { x, y } }));
    const tr = trayRef.current?.getBoundingClientRect();
    setOver(!!tr && e.clientX > tr.left - 24 && e.clientX < tr.right + 24 && e.clientY > tr.top - 24 && e.clientY < tr.bottom + 24);
  };
  const onUp = (dish: Dish) => {
    const d = drag.current;
    drag.current = null;
    setDragId(null);
    if (!d) return;
    if (!d.moved) { setActive(dish); return; }
    if (over) {
      addToTable(dish);
      setMoved((m) => { const n = { ...m }; delete n[dish.id]; return n; });
    }
    setOver(false);
  };

  const surprise = () => {
    const pool = visible.filter((d) => d.id !== active?.id);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (!pick) return;
    setTopId(pick.id);
    setActive(pick);
  };


  return (
    <div className="sofra-home">
      <section className="intro" id="top">
        <div className="intro-note"><span className="sun-mark">✳</span> CİHANGİR’DE, HER GÜN TAZE</div>
        <h1>Bugün<br /><em>ne pişse?</em></h1>
        <div className="intro-bottom">
          <p>Biraz ev yemeği, biraz fırından sıcak pide.<br />Sen seç, sofrayı beraber kuralım.</p>
          <a href="#sofra" className="scroll-cue"><span>SOFRAYI KUR</span><span className="scroll-arrow">↓</span></a>
        </div>
        <div className="intro-cta">
          <Link href={`/${locale}/menu`} className="cta cta-menu">
            <span className="cta-icon">✳</span>
            <span className="cta-text"><small>TÜM TABAKLAR</small><b>Menüyü aç</b></span>
            <span className="cta-arrow">→</span>
          </Link>
          <a href={`tel:${PHONE_TEL}`} className="cta cta-call">
            <span className="cta-icon"><span className="phone-ring" />☎</span>
            <span className="cta-text"><small>SİPARİŞ & YER AYIRT</small><b>0212 251 36 96</b></span>
            <span className="cta-arrow">↗</span>
          </a>
        </div>
        <span className="intro-stamp" aria-hidden="true">EV<br />GİBİ<br /><b>✳</b></span>
        <div className="intro-plate" aria-hidden="true"><span>YERİN<br />HAZIR</span><b>✳</b><small>AFİYET OLSUN</small></div>
      </section>

      <div className="ribbon" aria-hidden="true">
        <div className="ribbon-track">
          {[0, 1].map((k) => (
            <span key={k}>✳ TAZE TENCERE ✳ TAŞ FIRIN PİDE ✳ EV YAPIMI ✳ HER GÜN 08:30–22:30 ✳ CİHANGİR ✳ AFİYET OLSUN </span>
          ))}
        </div>
      </div>

      <section className="table-section" id="sofra" aria-label="Etkileşimli yemek seçimi">
        <div className="table-heading">
          <div><span className="eyebrow">ÖNCE CANIN NE İSTİYOR?</span><h2>Bir yer açalım.</h2></div>
          <span className="table-count">MENÜDEN<br /><b>{visible.length.toString().padStart(2, "0")} TABAK</b></span>
        </div>
        <div className="mode-picker" role="tablist" aria-label="Yemek kategorileri">
          {modes.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={mode === item.id} className={`mode-tab ${mode === item.id ? "is-active" : ""}`} onClick={() => { setMode(item.id); setActive(null); setMoved({}); }}>
              <span>{item.label}</span><small>{item.tiny}</small>
            </button>
          ))}
          <button type="button" className="mode-tab surprise-tab" onClick={surprise}><span>✳ Şaşırt beni</span><small>Karar veremedim</small></button>
        </div>

        <div ref={sceneRef} style={{ height: sceneH }} className={`table-scene ${mode === "oven" ? "scene-oven" : ""}`}>
          <div className="scene-caption caption-left"><span>GÜNÜN<br />TENCERESİ</span><i>↘</i></div>
          <div className="linen-runner" aria-hidden="true" />
          <div className="place-setting place-one" aria-hidden="true"><span /></div>
          <div className="place-setting place-two" aria-hidden="true"><span /></div>
          <div className="cutlery cutlery-one" aria-hidden="true"><i /><i /></div>
          <div className="cutlery cutlery-two" aria-hidden="true"><i /><i /></div>
          <div className="herb-sprig sprig-one" aria-hidden="true">✳</div>
          <div className="herb-sprig sprig-two" aria-hidden="true">✳</div>
          {visible.map((dish, index) => {
            const p = posOf(dish, index);
            return (
              <button
                key={dish.id}
                className={`dish-object free ${active?.id === dish.id ? "dish-selected" : ""} ${dragId === dish.id ? "is-dragging" : ""}`}
                style={{ left: `${p.x}%`, top: `${p.y}%`, zIndex: topId === dish.id ? 20 : 3, ["--rot" as string]: `${ROTATIONS[index % ROTATIONS.length]}deg` }}
                type="button"
                onPointerDown={(e) => onDown(e, dish, p)}
                onPointerMove={onMove}
                onPointerUp={() => onUp(dish)}
                onPointerCancel={() => { drag.current = null; setDragId(null); }}
                onClick={(e) => { if (e.detail === 0) setActive(dish); }}
                aria-label={`${dish.name}, ${price(dish.price)} — detayları aç`}
              >
                <span role="button" tabIndex={-1} className="quick-add" aria-label={`${dish.name} sofraya ekle`} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); addToTable(dish); }}>{table[dish.id] ? table[dish.id] : "+"}</span>
                <span className="dish-art-wrap"><img src={dish.art} alt="" className="dish-art" draggable={false} /><span className="dish-halo" /></span>
                <span className="dish-tag"><small>{dish.note}</small><b>{dish.name}</b><i>{price(dish.price)}</i></span>
              </button>
            );
          })}
          <div className="scene-note note-top">BUGÜNÜN<br />GÜZELİ</div>
          <div className="scene-note note-bottom">AFİYET<br />OLSUN!</div>
          <div ref={trayRef} className={`tray ${over ? "tray-over" : ""} ${bump ? "tray-bump" : ""}`} aria-hidden="true">
            <span className="tray-icon">{over ? "↓" : "✳"}</span>
            <span className="tray-text"><b>{over ? "Bırak, sofraya girsin!" : "Tabakları buraya bırak"}</b><small>{count > 0 ? `${count} TABAK · ${price(total)}` : "SOFRAN BOŞ"}</small></span>
          </div>
        </div>
        <p className="scene-hint">
          <span>↗</span> Bir tabağa dokun, ayrıntısı açılsın. Sürükle, tepsiye bırak, sofranı kur.
          {Object.keys(moved).length > 0 && (
            <button type="button" className="reset-table" onClick={() => setMoved({})}>↺ Sofrayı topla</button>
          )}
        </p>

        <div className={`dish-detail ${active ? "detail-open" : ""}`} aria-live="polite" aria-hidden={!active}>
          {active && (
            <>
              <button className="detail-close" type="button" onClick={() => setActive(null)} aria-label="Detayları kapat">×</button>
              <span className="eyebrow">{active.note}</span>
              <div className="detail-main"><div><h3>{active.name}</h3><p>{active.description}</p></div><strong>{price(active.price)}</strong></div>
              <div className="detail-actions">
                <button type="button" className="add-button" onClick={() => addToTable(active)}>+ Sofraya ekle{table[active.id] ? ` (${table[active.id]})` : ""}</button>
                <a href={`tel:${PHONE_TEL}`} className="order-button">Bu tabağı sor / sipariş ver <span>↗</span></a>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="receipt-wrap" aria-label="Sofram">
        <div className={`receipt ${bump ? "receipt-bump" : ""}`}>
          <div className="receipt-head"><span className="eyebrow">SİPARİŞ FİŞİ</span><h3>Sofram</h3></div>
          {items.length === 0 ? (
            <p className="receipt-empty">Henüz boş. Tabakları tepsiye sürükle, ya da üzerindeki <b>+</b> düğmesine bas.</p>
          ) : (
            <ul className="receipt-list">
              {items.map((d) => (
                <li key={d.id}>
                  <span className="r-name">{d.name}</span>
                  <span className="r-qty">
                    <button type="button" onClick={() => changeQty(d.id, -1)} aria-label="Azalt">−</button>
                    <b>{table[d.id]}</b>
                    <button type="button" onClick={() => changeQty(d.id, 1)} aria-label="Artır">+</button>
                  </span>
                  <span className="r-price">{price(d.price * table[d.id])}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="receipt-total"><span>TOPLAM</span><strong>{price(total)}</strong></div>
          <div className="receipt-actions">
            <a href={`tel:${PHONE_TEL}`} className={`receipt-call ${items.length === 0 ? "is-disabled" : ""}`}>Sofrayı ara, sipariş ver ↗</a>
            <button type="button" onClick={copyList} disabled={items.length === 0}>{copied ? "Kopyalandı ✓" : "Listeyi kopyala"}</button>
            <button type="button" onClick={() => setTable({})} disabled={items.length === 0}>Temizle</button>
          </div>
        </div>
      </section>

      <section className="info-strip" aria-label="Bilgi">
        <div className="info-card"><span className="info-num">01</span><h3>Taş fırın</h3><p>Pideler siparişle açılır, taş fırında pişer.</p></div>
        <div className="info-card"><span className="info-num">02</span><h3>Günlük tencere</h3><p>Yemekler her sabah taze hazırlanır, tükenince biter.</p></div>
        <div className="info-card"><span className="info-num">03</span><h3>Gel-al & paket</h3><p>Cihangir ve Beyoğlu çevresine sıcak servis.</p></div>
        <a className="info-card info-call" href={`tel:${PHONE_TEL}`}><span className="info-num">↗</span><h3>0212 251 36 96</h3><p>Ara, sipariş ver, yerini ayırt.</p></a>
      </section>


      <section className="closing-line">
        <span className="closing-star">✳</span><p>Bir tabak yemek.<br /><em>Biraz ev hissi.</em></p><span className="closing-script">Bekleriz.</span>
      </section>
    </div>
  );
}
