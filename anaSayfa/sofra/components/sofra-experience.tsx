'use client';

import { useMemo, useState } from 'react';
import { dishes, modes, type Dish, type FoodMode } from '@/data/menu';
import RestaurantFooter from '@/components/restaurant-footer';

function price(value: number) {
  return `${value.toLocaleString('tr-TR')} ₺`;
}

export default function SofraExperience() {
  const [mode, setMode] = useState<FoodMode>('all');
  const [active, setActive] = useState<Dish | null>(null);
  const visible = useMemo(() => mode === 'all' ? dishes : dishes.filter((dish) => dish.mode === mode || (mode === 'quick' && dish.mode === 'home')), [mode]);

  return (
    <main>
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Cihangir ana sayfa"><span className="wordmark-icon">C</span><span>cihangir<small>EV YEMEKLERİ & PİDE</small></span></a>
        <a className="top-link" href="#sofra">Sofraya otur <span>↘</span></a>
        <a className="phone-link" href="tel:+902122513696"><span className="phone-dot" /> 0212 251 36 96</a>
      </header>

      <section className="intro" id="top">
        <div className="intro-note"><span className="sun-mark">✳</span> CİHANGİR’DE, HER GÜN TAZE</div>
        <h1>Bugün<br /><em>ne pişse?</em></h1>
        <div className="intro-bottom">
          <p>Biraz ev yemeği, biraz fırından sıcak pide.<br />Sen seç, sofrayı beraber kuralım.</p>
          <a href="#sofra" className="scroll-cue"><span>SOFRAYI KUR</span><span className="scroll-arrow">↓</span></a>
        </div>
        <span className="intro-stamp" aria-hidden="true">EV<br />GİBİ<br /><b>✳</b></span>
        <div className="intro-plate" aria-hidden="true"><span>YERİN<br />HAZIR</span><b>✳</b><small>AFİYET OLSUN</small></div>
      </section>

      <section className="table-section" id="sofra" aria-label="Etkileşimli yemek seçimi">
        <div className="table-heading">
          <div><span className="eyebrow">ÖNCE CANIN NE İSTİYOR?</span><h2>Bir yer açalım.</h2></div>
          <span className="table-count">MENÜDEN<br /><b>{visible.length.toString().padStart(2, '0')} TABAK</b></span>
        </div>
        <div className="mode-picker" role="tablist" aria-label="Yemek kategorileri">
          {modes.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={mode === item.id} className={`mode-tab ${mode === item.id ? 'is-active' : ''}`} onClick={() => { setMode(item.id); setActive(null); }}>
              <span>{item.label}</span><small>{item.tiny}</small>
            </button>
          ))}
        </div>

        <div className={`table-scene ${mode === 'oven' ? 'scene-oven' : ''}`}>
          <div className="scene-caption caption-left"><span>GÜNÜN<br />TENCERESİ</span><i>↘</i></div>
          <div className="linen-runner" aria-hidden="true" />
          <div className="place-setting place-one" aria-hidden="true"><span /></div>
          <div className="place-setting place-two" aria-hidden="true"><span /></div>
          <div className="cutlery cutlery-one" aria-hidden="true"><i /><i /></div>
          <div className="cutlery cutlery-two" aria-hidden="true"><i /><i /></div>
          <div className="herb-sprig sprig-one" aria-hidden="true">✳</div>
          <div className="herb-sprig sprig-two" aria-hidden="true">✳</div>
          {visible.map((dish, index) => (
            <button key={dish.id} className={`dish-object dish-${index + 1} ${active?.id === dish.id ? 'dish-selected' : ''}`} type="button" onClick={() => setActive(dish)} aria-label={`${dish.name}, ${price(dish.price)} — detayları aç`}>
              <span className="dish-art-wrap"><img src={dish.art} alt="" className="dish-art" /><span className="dish-halo" /></span>
              <span className="dish-tag"><small>{dish.note}</small><b>{dish.name}</b><i>{price(dish.price)}</i></span>
            </button>
          ))}
          <div className="scene-note note-top">BUGÜNÜN<br />GÜZELİ</div>
          <div className="scene-note note-bottom">AFİYET<br />OLSUN!</div>
          <div className="scene-center-mark">C<br /><span>sofra</span></div>
        </div>
        <p className="scene-hint"><span>↗</span> Bir tabağa dokun; ayrıntısı sofrada yerini bulsun.</p>

        <div className={`dish-detail ${active ? 'detail-open' : ''}`} aria-live="polite" aria-hidden={!active}>
          {active && <>
            <button className="detail-close" type="button" onClick={() => setActive(null)} aria-label="Detayları kapat">×</button>
            <span className="eyebrow">{active.note}</span>
            <div className="detail-main"><div><h3>{active.name}</h3><p>{active.description}</p></div><strong>{price(active.price)}</strong></div>
            <a href={`tel:+902122513696`} className="order-button">Bu tabağı sor / sipariş ver <span>↗</span></a>
          </>}
        </div>
      </section>

      <section className="closing-line">
        <span className="closing-star">✳</span><p>Bir tabak yemek.<br /><em>Biraz ev hissi.</em></p><span className="closing-script">Bekleriz.</span>
      </section>
      <RestaurantFooter />
    </main>
  );
}
