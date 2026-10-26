import { Locale } from "@/i18n/translations";
import { RESTAURANT_CONFIG } from "./restaurantConfig";

export interface PageMeta {
  title: string;
  description: string;
}

export const PAGES_META: Record<string, Record<Locale, PageMeta>> = {
  about: {
    tr: {
      title: "Hakkımızda | Cihangir Ev Yemekleri & Taş Fırın Pide",
      description:
        "Cihangir'in kalbinde geleneksel Türk ev yemekleri ve taş fırın pide lezzetleri. Taze tencere yemekleri, günlük menüler ve esnaf lokantası samimiyeti.",
    },
    en: {
      title: "About Us | Cihangir Home Kitchen & Stone-Oven Pide",
      description:
        "Traditional Turkish home-cooked dishes and authentic stone-oven pide in Cihangir, Beyoğlu, Istanbul. Fresh daily stews and welcoming hospitality.",
    },
    ar: {
      title: "عن المطعم | جيهانغير للمطبخ البيتي وبيدة الفرن الحجري",
      description:
        "مأكولات المطبخ التركي البيتي الأصيل وبيدة الفرن الحجري في قلب جيهانغير، بيوغلو، إسطنبول. يخنات يومية طازجة ونكهات عريقة.",
    },
    ru: {
      title: "О нас | Cihangir Домашняя Кухня & Пиде",
      description:
        "Традиционная турецкая домашняя кухня и пиде из каменной печи в Джихангире, Бейоглу, Стамбул.",
    },
    fa: {
      title: "درباره ما | آشپزخانه خانگی جیهانگیر و پیده تنوری",
      description:
        "غذاهای خانگی اصیل ترکی و پیده تنوری در قلب جیهانگیر، بیوغلو، استانبول.",
    },
    fr: {
      title: "À Propos | Cihangir Cuisine Maison & Pide au Four",
      description:
        "Cuisine familiale turque traditionnelle et pide cuit au four en pierre à Cihangir, Beyoğlu, Istanbul.",
    },
    de: {
      title: "Über Uns | Cihangir Hausküche & Steinofenpide",
      description:
        "Traditionelle türkische Hausmannskost und Steinofenpide im Herzen von Cihangir, Beyoğlu, Istanbul.",
    },
    it: {
      title: "Chi Siamo | Cihangir Cucina Casalinga & Pide",
      description:
        "Cucina casalinga tradizionale turca e pide dal forno a pietra a Cihangir, Beyoğlu, Istanbul.",
    },
    es: {
      title: "Sobre Nosotros | Cihangir Cocina Casera & Pide",
      description:
        "Cocina casera turca tradicional y pide al horno de piedra en Cihangir, Beyoğlu, Estambul.",
    },
    zh: {
      title: "关于我们 | 贾汉吉尔家常菜与石炉皮得",
      description:
        "位于伊斯坦布尔贝伊奥卢贾汉吉尔的正宗土耳其家常热菜与石炉皮得面饼。",
    },
  },
  contact: {
    tr: {
      title: "İletişim & Konum | Cihangir Ev Yemekleri & Pide",
      description:
        "Cihangir Ev Yemekleri & Pide adres, telefon ve çalışma saatleri. Firuzağa Camii Sokak No:1 A, Beyoğlu, İstanbul.",
    },
    en: {
      title: "Contact & Location | Cihangir Home Kitchen & Pide",
      description:
        "Address, phone number and opening hours for Cihangir Ev Yemekleri & Pide in Firuzağa, Beyoğlu, Istanbul.",
    },
    ar: {
      title: "تواصل معنا والموقع | جيهانغير للمطبخ البيتي",
      description:
        "العنوان ورقم الهاتف وساعات العمل لمطعم جيهانغير للمطبخ البيتي، فيروز أغا، بيوغلو، إسطنبول.",
    },
    ru: {
      title: "Контакты и адрес | Cihangir Ev Yemekleri",
      description:
        "Адрес, телефон и часы работы ресторана Cihangir Ev Yemekleri & Pide в Стамбуле.",
    },
    fa: {
      title: "تماس با ما و موقعیت | جیهانگیر",
      description:
        "آدرس، شماره تماس و ساعات کاری آشپزخانه خانگی و پیده جیهانگیر استانبول.",
    },
    fr: {
      title: "Contact & Localisation | Cihangir Cuisine Maison",
      description:
        "Adresse, téléphone et horaires d'ouverture de Cihangir Ev Yemekleri & Pide à Istanbul.",
    },
    de: {
      title: "Kontakt & Anfahrt | Cihangir Hausküche",
      description:
        "Adresse, Telefonnummer und Öffnungszeiten von Cihangir Ev Yemekleri & Pide in Istanbul.",
    },
    it: {
      title: "Contatti e Posizione | Cihangir Cucina Casalinga",
      description:
        "Indirizzo, telefono e orari di Cihangir Ev Yemekleri & Pide a Istanbul.",
    },
    es: {
      title: "Contacto y Ubicación | Cihangir Cocina Casera",
      description:
        "Dirección, teléfono y horarios de Cihangir Ev Yemekleri & Pide en Estambul.",
    },
    zh: {
      title: "联系我们与地址 | 贾汉吉尔家常菜",
      description: "贾汉吉尔家常菜与石炉皮得的地址、电话及营业时间信息。",
    },
  },
  delivery: {
    tr: {
      title: "Teslimat & Gel-Al | Cihangir Ev Yemekleri",
      description:
        "Gel-Al ve yerel paket servis bilgilendirmesi. Cihangir ve Beyoğlu çevresi sipariş detayları.",
    },
    en: {
      title: "Delivery & Pick-up | Cihangir Home Kitchen",
      description:
        "Pick-up and local neighborhood delivery details in Cihangir, Beyoğlu, Istanbul.",
    },
    ar: {
      title: "التوصيل والاستلام (Gel-Al) | جيهانغير للمطبخ البيتي",
      description:
        "معلومات استلام الطلبات من المطعم وخدمة التوصيل المحلي في جيهانغير وبيوغلو بإسطنبول.",
    },
    ru: {
      title: "Доставка и самовывоз | Cihangir Ev Yemekleri",
      description:
        "Информация о самовывозе и доставке по району Джихангир и Бейоглу.",
    },
    fa: {
      title: "ارسال و تحویل حضوری | جیهانگیر",
      description: "اطلاعات تحویل حضوری و ارسال محلی در جیهانگیر و بیوغلو.",
    },
    fr: {
      title: "Livraison & À Emporter | Cihangir Cuisine Maison",
      description:
        "Informations sur la vente à emporter et la livraison locale à Cihangir, Istanbul.",
    },
    de: {
      title: "Lieferung & Abholung | Cihangir Hausküche",
      description:
        "Informationen zu Abholung und lokaler Lieferung im Viertel Cihangir, Istanbul.",
    },
    it: {
      title: "Consegna e Asporto | Cihangir Cucina Casalinga",
      description:
        "Informazioni su asporto e consegna locale a Cihangir, Beyoğlu, Istanbul.",
    },
    es: {
      title: "Entrega y Para Llevar | Cihangir Cocina Casera",
      description:
        "Información sobre pedidos para llevar y entrega local en Cihangir, Estambul.",
    },
    zh: {
      title: "外送与自提 | 贾汉吉尔家常菜",
      description: "贾汉吉尔和贝伊奥卢周边的自提与本地送餐服务说明。",
    },
  },
  faq: {
    tr: {
      title: "Sıkça Sorulan Sorular | Cihangir Ev Yemekleri",
      description:
        "Yemeklerimiz, sipariş yöntemi, alerjenler ve çalışma saatleri hakkında sık sorulan sorular ve yanıtları.",
    },
    en: {
      title: "Frequently Asked Questions | Cihangir Home Kitchen",
      description:
        "Common questions about our daily dishes, stone-oven pide, ordering, hours and allergens.",
    },
    ar: {
      title: "الأسئلة الشائعة | جيهانغير للمطبخ البيتي",
      description:
        "إجابات موثوقة حول أطباقنا اليومية، فطائر البيدة، طرق الطلب وساعات العمل.",
    },
    ru: {
      title: "Часто задаваемые вопросы | Cihangir Ev Yemekleri",
      description: "Ответы на популярные вопросы о меню, заказе и часах работы.",
    },
    fa: {
      title: "سوالات متداول | آشپزخانه خانگی جیهانگیر",
      description: "پاسخ به سوالات رایج درباره غذاها، روش سفارش و ساعات کاری.",
    },
    fr: {
      title: "Foire Aux Questions | Cihangir Cuisine Maison",
      description:
        "Questions fréquentes sur nos plats du jour, le pide au four et la commande.",
    },
    de: {
      title: "Häufige Fragen (FAQ) | Cihangir Hausküche",
      description:
        "Wichtige Fragen und Antworten zu unseren Tagesgerichten, Pide und Bestellungen.",
    },
    it: {
      title: "Domande Frequenti | Cihangir Cucina Casalinga",
      description:
        "Risposte alle domande comuni sui piatti del giorno, pide e ordinazioni.",
    },
    es: {
      title: "Preguntas Frecuentes | Cihangir Cocina Casera",
      description:
        "Preguntas frecuentes sobre nuestros platos diarios, pide al horno y pedidos.",
    },
    zh: {
      title: "常见问题解答 | 贾汉吉尔家常菜",
      description: "关于我们的今日热菜、石炉皮得、点餐流程及营业时间的常见解答。",
    },
  },
  allergens: {
    tr: {
      title: "Alerjen & Mutfak Bilgilendirmesi | Cihangir Ev Yemekleri",
      description:
        "Mutfak içeriğimiz, glüten, kuruyemiş, süt ürünleri ve çapraz bulaşma risklerine dair resmi bilgilendirme.",
    },
    en: {
      title: "Allergen & Kitchen Policy | Cihangir Home Kitchen",
      description:
        "Important information regarding ingredients, gluten, dairy, nuts and shared kitchen environment.",
    },
    ar: {
      title: "دليل المكونات ومسببات الحساسية | جيهانغير للمطبخ البيتي",
      description:
        "تنبيهات هامة حول مسببات الحساسية، الغلوتين، منتجات الألبان وسياسة المطبخ المشترك.",
    },
    ru: {
      title: "Аллергены и состав | Cihangir Ev Yemekleri",
      description:
        "Информация об аллергенах, глютене, орехах и совместном приготовлении блюд.",
    },
    fa: {
      title: "اطلاعات مواد تشکیل‌دهنده و آلرژن‌ها | جیهانگیر",
      description:
        "اطلاعات رسمی درباره گلوتن، لبنیات، مغزها و محیط آماده‌سازی غذا.",
    },
    fr: {
      title: "Allergènes & Politique de Cuisine | Cihangir",
      description:
        "Informations sur les ingrédients, le gluten, les produits laitiers et notre cuisine.",
    },
    de: {
      title: "Allergene & Küchenhinweise | Cihangir Hausküche",
      description:
        "Wichtige Hinweise zu Zutaten, Gluten, Milchprodukten und Nüssen in unserer Küche.",
    },
    it: {
      title: "Allergeni e Politica della Cucina | Cihangir",
      description:
        "Informazioni su ingredienti, glutine, latticini e ambiente di cucina condiviso.",
    },
    es: {
      title: "Alérgenos e Información de Cocina | Cihangir",
      description:
        "Información sobre alérgenos, gluten, lácteos y ambiente de cocina compartida.",
    },
    zh: {
      title: "过敏原与后厨说明 | 贾汉吉尔家常菜",
      description: "关于食材、麸质、乳制品、坚果及共享后厨制作环境的官方说明。",
    },
  },
  terms: {
    tr: {
      title: "Kullanım Koşulları | Cihangir Ev Yemekleri",
      description: "Web sitesi kullanım koşulları ve sipariş bilgilendirmesi.",
    },
    en: {
      title: "Terms of Use | Cihangir Home Kitchen",
      description: "Website terms of use and ordering service conditions.",
    },
    ar: {
      title: "شروط الاستخدام | جيهانغير للمطبخ البيتي",
      description: "شروط وأحكام استخدام الموقع وعرض القائمة والطلب.",
    },
    ru: {
      title: "Условия использования | Cihangir Ev Yemekleri",
      description: "Условия использования сайта и правила оформления заказов.",
    },
    fa: {
      title: "شرایط استفاده | آشپزخانه خانگی جیهانگیر",
      description: "قوانین و شرایط استفاده از وبسایت و مشاهده منو.",
    },
    fr: {
      title: "Conditions d'Utilisation | Cihangir Cuisine Maison",
      description: "Conditions générales d'utilisation du site web et du menu.",
    },
    de: {
      title: "Nutzungsbedingungen | Cihangir Hausküche",
      description: "Nutzungsbedingungen der Website und Bestellhinweise.",
    },
    it: {
      title: "Termini di Utilizzo | Cihangir Cucina Casalinga",
      description: "Termini e condizioni di utilizzo del sito e del menu.",
    },
    es: {
      title: "Términos de Uso | Cihangir Cocina Casera",
      description: "Términos y condiciones de uso del sitio web y menú.",
    },
    zh: {
      title: "使用条款 | 贾汉吉尔家常菜",
      description: "网站使用条款与订餐服务说明。",
    },
  },
  privacy: {
    tr: {
      title: "Gizlilik Politikası | Cihangir Ev Yemekleri",
      description: "Kişisel verilerin korunması ve gizlilik bilgilendirmesi.",
    },
    en: {
      title: "Privacy Policy | Cihangir Home Kitchen",
      description: "Customer data privacy, cookies and protection notice.",
    },
    ar: {
      title: "سياسة الخصوصية | جيهانغير للمطبخ البيتي",
      description: "بيان حماية خصوصية بيانات العملاء وملفات تعريف الارتباط.",
    },
    ru: {
      title: "Политика конфиденциальности | Cihangir Ev Yemekleri",
      description: "Защита персональных данных и политика конфиденциальности.",
    },
    fa: {
      title: "سیاست حفظ حریم خصوصی | جیهانگیر",
      description: "حفاظت از اطلاعات مشتریان و حریم خصوصی در وبسایت.",
    },
    fr: {
      title: "Politique de Confidentialité | Cihangir Cuisine Maison",
      description: "Protection des données personnelles et cookies.",
    },
    de: {
      title: "Datenschutzerklärung | Cihangir Hausküche",
      description: "Informationen zum Schutz Ihrer persönlichen Daten.",
    },
    it: {
      title: "Informativa sulla Privacy | Cihangir Cucina Casalinga",
      description: "Tutela dei dati personali e informativa sulla privacy.",
    },
    es: {
      title: "Política de Privacidad | Cihangir Cocina Casera",
      description: "Protección de datos personales y política de privacidad.",
    },
    zh: {
      title: "隐私政策 | 贾汉吉尔家常菜",
      description: "客户隐私保护与数据收集使用政策说明。",
    },
  },
  cancellation: {
    tr: {
      title: "İptal ve İade Koşulları | Cihangir Ev Yemekleri",
      description: "Sipariş iptali ve teslimat süreci hakkında bilgilendirme.",
    },
    en: {
      title: "Cancellation & Refund Policy | Cihangir Home Kitchen",
      description: "Order cancellation and return conditions for food service.",
    },
    ar: {
      title: "سياسة الإلغاء والاسترداد | جيهانغير للمطبخ البيتي",
      description: "ضوابط إلغاء الطلبات وإعادة التحضير للوجبات الطازجة.",
    },
    ru: {
      title: "Правила отмены и возврата | Cihangir Ev Yemekleri",
      description: "Правила отмены свежеприготовленных заказов.",
    },
    fa: {
      title: "شرایط لغو و بازگشت سفارش | جیهانگیر",
      description: "راهنمای لغو سفارش غذاهای گرم و تازه تهیه شده.",
    },
    fr: {
      title: "Politique d'Annulation | Cihangir Cuisine Maison",
      description: "Conditions d'annulation de commandes de plats cuisinés.",
    },
    de: {
      title: "Stornierung & Rückgabe | Cihangir Hausküche",
      description: "Bedingungen für Stornierungen frischer Speisezubereitungen.",
    },
    it: {
      title: "Politica di Cancellazione | Cihangir Cucina Casalinga",
      description: "Termini di cancellazione e rimborso per i pasti freschi.",
    },
    es: {
      title: "Política de Cancelación | Cihangir Cocina Casera",
      description: "Condiciones de cancelación para pedidos de comida fresca.",
    },
    zh: {
      title: "取消与退款政策 | 贾汉吉尔家常菜",
      description: "现做新鲜餐食订单的取消与退换处理说明。",
    },
  },
};
