export default function RestaurantFooter() {
  return (
    <footer className="restaurant-footer" id="ulasim">
      <div className="footer-head"><div><span className="eyebrow">CİHANGİR’DE BİR MAHALLE SOFRASI</span><h2>Yolun düşerse,<br /><em>kapımız açık.</em></h2></div><a className="map-button" href="https://maps.google.com/?q=Firuza%C4%9Fa,+Firuza%C4%9Fa+Camii+Sk.+No:1+A,+34425+Beyo%C4%9Flu/%C4%B0stanbul" target="_blank" rel="noreferrer">Yol tarifi al <span>↗</span></a></div>
      <div className="footer-details">
        <div><span className="footer-label">ADRES</span><p>Firuzağa Camii Sk. No:1 A<br />Beyoğlu / İstanbul</p></div>
        <div><span className="footer-label">HER GÜN</span><p>08:30 — 22:30<br /><small>Sıcacık ev yemekleri, gün boyu.</small></p></div>
        <div><span className="footer-label">PAKET & GEL-AL</span><p>Cihangir ve Beyoğlu çevresine<br /><small>Telefonla sipariş, restorandan gel-al.</small></p></div>
        <a className="footer-call" href="tel:+902122513696"><span>Bir tabak ayıralım mı?</span><b>0212 251 36 96 ↗</b></a>
      </div>
      <div className="footer-bottom"><a className="footer-brand" href="#top">cihangir<span> · ev yemekleri & pide</span></a><span>Güzel yemek, iyi hissettirir.</span><a href="#top">Yukarı çık ↑</a></div>
    </footer>
  );
}
