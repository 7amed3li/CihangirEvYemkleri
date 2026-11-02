/**
 * Developer Profile & Case Study Data — Hamed Mohamed
 * Cihangir Ev Yemekleri & Pide Digital Case Study
 */

export interface CaseStudyContent {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    eyebrowTag: string;
    eyebrowCity: string;
    titleLine1: string;
    titleLine2: string;
    titleEm: string;
    titleLine3: string;
    description: string;
    ctaExplore: string;
    ctaMenu: string;
    devAvatar: string;
    devName: string;
    devRole: string;
    devIssue: string;
    roundelTop: string;
    roundelHour: string;
    roundelMinute: string;
    roundelBottom: string;
    noteTitle: string;
    noteSubtitle: string;
    sideLabel: string;
    bottomline: string;
    scrollDown: string;
  };
  facts: {
    tag: string;
    title: string;
    languages: string;
    languagesLabel: string;
    currencies: string;
    currenciesLabel: string;
    pagesCount: string;
    pagesLabel: string;
    foucScore: string;
    foucLabel: string;
    stampDistrict: string;
    stampCity: string;
  };
  story: {
    index: string;
    sectionName: string;
    tag: string;
    h2Part1: string;
    h2Em: string;
    h2Part2: string;
    lead: string;
    p: string;
    linkText: string;
    photoBadge: string;
    photoHeadline: string;
    photoLocation: string;
    photoCoord: string;
    principles: Array<{ num: string; title: string; desc: string }>;
  };
  experience: {
    index: string;
    sectionName: string;
    tag: string;
    h2Part1: string;
    h2Em: string;
    intro: string;
    stageCaption: string;
    notes: Array<{ symbol: string; title: string; desc: string }>;
    liveMenuTag: string;
    liveMenuTitle: string;
  };
  languages: {
    index: string;
    sectionName: string;
    tag: string;
    h2Part1: string;
    h2Em: string;
    h2Part2: string;
    intro: string;
    specs: Array<{ b: string; label: string }>;
    bottom1: string;
    bottom2: string;
  };
  splashCraft: {
    index: string;
    sectionName: string;
    tag: string;
    h2Part1: string;
    h2Em: string;
    intro: string;
    layersLabel: string;
    layersHint: string;
  };
  engineering: {
    index: string;
    sectionName: string;
    tag: string;
    h2Part1: string;
    h2Em: string;
    intro: string;
    items: Array<{ number: string; cat: string; title: string; desc: string; glyph: string }>;
    stackLabel: string;
    stack: string[];
    seoNoteMark: string;
    seoNoteTitle: string;
    seoNoteDesc: string;
    seoNoteStatus: string;
  };
  closing: {
    overline: string;
    h2Part1: string;
    h2Em: string;
    h2Part2: string;
    desc: string;
    ctaTalk: string;
    ctaPortfolio: string;
    creditLabel: string;
    creditName: string;
    whatsappUrl: string;
    portfolioUrl: string;
  };
}

export const devCaseStudyContent: Record<string, CaseStudyContent> = {
  tr: {
    meta: {
      title: "Tasarım ve Geliştirme — Hamed Mohamed | Cihangir Ev Yemekleri Case Study",
      description: "Tarihi Cihangir fırını ve ev yemekleri kültürünü, 10 dilde ve çoklu para biriminde çalışan yüksek performanslı bir dijital deneyime dönüştürdüm: Hamed Mohamed.",
    },
    hero: {
      eyebrowTag: "DIGITAL CASE STUDY",
      eyebrowCity: "BEYOĞLU · İSTANBUL",
      titleLine1: "Tarihi tencereden,",
      titleLine2: "çağdaş ",
      titleEm: "Cihangir",
      titleLine3: "dijital zanaatına.",
      description: "Beyoğlu’nun bohem sokaklarındaki tencere lezzetlerini ve odun ateşinde taze pide çeşitlerini; 10 dilde, çoklu kur dönüşümüyle ve saniyeler içinde açılan akıcı bir dijital deneyimde buluşturdum.",
      ctaExplore: "Vaka Analizini Keşfet",
      ctaMenu: "Canlı Menü Deneyimi",
      devAvatar: "HM",
      devName: "Hamed Mohamed",
      devRole: "Product Designer & Full-Stack Engineer",
      devIssue: "02 / CASE",
      roundelTop: "CİHANGİR · HER GÜN",
      roundelHour: "10",
      roundelMinute: "00",
      roundelBottom: "GÜNÜN TENCERESİ",
      noteTitle: "EV LEZZETİ",
      noteSubtitle: "TAŞ FIRIN PİDE",
      sideLabel: "GÜNÜN MENÜSÜ · GÜVEÇ · PİDE",
      bottomline: "PRODUCT DESIGN ✳ FULL-STACK ARCHITECTURE ✳ 10-LANGUAGE UX",
      scrollDown: "AŞAĞI KAYDIR",
    },
    facts: {
      tag: "PROJE METRİKLERİ",
      title: "Cihangir, dijital sahnede.",
      languages: "10",
      languagesLabel: "tam arayüz dili (RTL dahil)",
      currencies: "06",
      currenciesLabel: "canlı kur ve anlık dönüşüm",
      pagesCount: "970+",
      pagesLabel: "önceden derlenmiş statik sayfa (SSG)",
      foucScore: "0 ms",
      foucLabel: "Smart Splash ile sıfır ekran parlaması",
      stampDistrict: "BEYOĞLU",
      stampCity: "İSTANBUL",
    },
    story: {
      index: "01",
      sectionName: "PROBLEM → ÇÖZÜM",
      tag: "GASTRONOMİ & MİMARİ",
      h2Part1: "Mutfak gelenekseldi.",
      h2Em: "Deneyim çağdaş",
      h2Part2: "olmalıydı.",
      lead: "Cihangir Ev Yemekleri & Pide yalnızca sipariş verilen bir menü değil. Her sabah kaynayan tencereleri, Beyoğlu'na gelen yerli-yabancı misafirleri ve fırının sıcaklığını aynı akışta birleştiren bir mahalle simgesi.",
      p: "Benim amacım, bu zengin mutfağı mobilde yormayan, her dilden turistin ve mahalle sakininin saniyeler içinde aradığını bulduğu, kur farkını anında hesaplayan modern bir dijital gastronomi ürününe dönüştürmekti.",
      linkText: "Restoran Hakkında",
      photoBadge: "CİHANGİR EV YEMEKLERİ",
      photoHeadline: "Beyoğlu'nun kalbinde fırın & tencere lezzeti.",
      photoLocation: "CİHANGİR · İSTANBUL",
      photoCoord: "41°01′55″ N",
      principles: [
        {
          num: "01 / ŞEFFAFLIK",
          title: "Günün Menüsü Dinamizmi",
          desc: "Her gün değişen ev yemeklerini stok ve kategori bazında canlı filtrelerle anında sunmak.",
        },
        {
          num: "02 / KÜRESEL ERİŞİM",
          title: "10 Dilde Doğal Arayüz",
          desc: "Arapça ve Farsça'da kusursuz RTL hizalaması, Batı ve Doğu dillerinde tam yerelleştirme.",
        },
        {
          num: "03 / HIZ & HİS",
          title: "Sıfır Gecikme & Splash",
          desc: "10 katmanlı akıllı marka animasyonu ve 970 statik sayfa ile anında yüklenen sayfalar.",
        },
      ],
    },
    experience: {
      index: "02",
      sectionName: "İNTERAKTİF DENEYİM",
      tag: "CANLI ARAYÜZ PROTOTİPİ",
      h2Part1: "Günün tenceresi ve fırın,",
      h2Em: "parmaklarınızın ucunda.",
      intro: "Aşağıdaki interaktif telefon simülasyonunda sekmeler arasında geçiş yapabilir, para birimini değiştirebilir ve anlık fiyat dönüşümlerini canlı test edebilirsiniz.",
      stageCaption: "İnteraktif Arayüz Simülasyonu · Gerçek Kur ve Menü Akışı",
      notes: [
        {
          symbol: "🥘",
          title: "Günün Sıcak Tenceresi",
          desc: "Tas Kebabı, Elbasan Tava ve zeytinyağlılar mutfaktan çıktığı gibi anlık listelenir.",
        },
        {
          symbol: "🔥",
          title: "Odun Ateşinde fırın",
          desc: "Kıymalı, kaşarlı ve karışık pide siparişleri fırın sıcaklığıyla menüde öne çıkar.",
        },
        {
          symbol: "💱",
          title: "Dinamik Kur Dönüşümü",
          desc: "TRY (₺), USD ($), EUR (€) ve SAR (﷼) arasında anlık kurla tek dokunuşta geçiş.",
        },
      ],
      liveMenuTag: "CANLI RESTORAN MENÜSÜ",
      liveMenuTitle: "Cihangir Menüsünü Canlı İnceleyin",
    },
    languages: {
      index: "03",
      sectionName: "ÇOK DİLLİ MİMARİ",
      tag: "10 DİL · EVRENSEL ERİŞİLEBİLİRLİK",
      h2Part1: "Beyoğlu'ndan dünyaya,",
      h2Em: "kendi dilinde",
      h2Part2: "bir lezzet köprüsü.",
      intro: "Cihangir'i ziyaret eden her milletten misafir için arayüzü yalnızca tercüme etmedik; tipografisini, okuma yönünü (RTL/LTR) ve kültürel terimlerini en doğal biçimde kurguladık.",
      specs: [
        { b: "10", label: "Arayüz Dili" },
        { b: "RTL", label: "Arapça & Farsça Tam Destek" },
        { b: "SEO", label: "Her Dil İçin Ayrı URL Rotası" },
        { b: "0 ms", label: "İstemci Tarafı Anlık Dil Değişimi" },
      ],
      bottom1: "Her dil için optimize edilmiş hreflang etiketleri ve schema.org yapısı.",
      bottom2: "GOOGLE SERP VE YEREL ARAMALARDA MAKSİMUM GÖRÜNÜRLÜK",
    },
    splashCraft: {
      index: "04",
      sectionName: "MARKA ZANAATI",
      tag: "SMART SPLASH MİKRO-ANİMASYONU",
      h2Part1: "Bir amblemin doğuşu:",
      h2Em: "10 katmanlı montaj.",
      intro: "Ağır video veya GIF kullanmadan, sadece 318 KB'lık optimize WebP katmanları ve donanım hızlandırmalı CSS keyframe'leri ile inşa edilen açılış sahnesi.",
      layersLabel: "KATMANLARI İNCELEYİN",
      layersHint: "Her katmanın logonun neresini oluşturduğunu görmek için üzerine gelin veya tıklayın:",
    },
    engineering: {
      index: "05",
      sectionName: "TEKNİK MİMARİ",
      tag: "MODERN WEB MÜHENDİSLİĞİ",
      h2Part1: "Geleneksel lezzet,",
      h2Em: "en son teknoloji.",
      intro: "Yüksek hacimli sipariş trafiğine ve ani turist akınına dayanıklı, sıfır sunucu gecikmeli modern Next.js 16 mimarisi.",
      items: [
        {
          number: "01",
          cat: "PERFORMANS",
          title: "Next.js 16 SSG & Turbopack",
          desc: "970 statik sayfa derlenerek CDN kenar noktalarına dağıtıldı. Ziyaretçiler için sayfa yükleme süresi sıfıra yakın.",
          glyph: "⚡",
        },
        {
          number: "02",
          cat: "VERİTABANI",
          title: "Self-Healing PostgreSQL & Prisma",
          desc: "Otomatik DDL şeması oluşturan, veritabanı boşken kendini 10 dilde tohumlayan (auto-seed) dayanıklı veri katmanı.",
          glyph: "🗄️",
        },
        {
          number: "03",
          cat: "YÖNETİM",
          title: "Güvenli Admin Paneli",
          desc: "Argon2 şifrelemeli oturum, rol tabanlı yetkilendirme, ürün/kategori/menü yönetimi ve audit log denetim kaydı.",
          glyph: "🛡️",
        },
        {
          number: "04",
          cat: "SEO & ŞEMA",
          title: "Schema.org Restaurant Rich Snippets",
          desc: "Google zengin arama sonuçları için Restaurant, Menu, ItemAvailability ve Review şemalarının eksiksiz uygulanması.",
          glyph: "🔍",
        },
      ],
      stackLabel: "KULLANILAN TEKNOLOJİ YIĞINI",
      stack: [
        "Next.js 16",
        "React 19",
        "TypeScript",
        "PostgreSQL",
        "Prisma ORM",
        "Tailwind CSS",
        "Argon2",
        "Turbopack",
      ],
      seoNoteMark: "100%",
      seoNoteTitle: "Core Web Vitals & Mobil Mükemmellik",
      seoNoteDesc: "LCP, FID ve CLS metriklerinde yeşil bölge; her ekran boyutunda kusursuz tepkisellik.",
      seoNoteStatus: "Tüm Denetimlerden Tam Puanla Geçti",
    },
    closing: {
      overline: "İŞ BİRLİĞİ & İLETİŞİM",
      h2Part1: "Bir sonraki dijital",
      h2Em: "başyapıtınızı",
      h2Part2: "birlikte inşa edelim.",
      desc: "İster bir restoran zinciri, ister global bir e-ticaret markası olsun; gastronomi ve teknoloji arasındaki köprüyü en yüksek standartlarda kuruyorum.",
      ctaTalk: "WhatsApp'tan Yazın",
      ctaPortfolio: "Tüm Projelerimi İnceleyin",
      creditLabel: "TASARIM VE GELİŞTİRME",
      creditName: "Hamed Mohamed",
      whatsappUrl: "https://wa.me/905060453906",
      portfolioUrl: "https://hamedmohamed.dev",
    },
  },
  en: {
    meta: {
      title: "Design & Development — Hamed Mohamed | Cihangir Ev Yemekleri Case Study",
      description: "Transforming historic Beyoğlu pide pide and home-style dishes into an ultra-fast, 10-language digital culinary experience: Hamed Mohamed.",
    },
    hero: {
      eyebrowTag: "DIGITAL CASE STUDY",
      eyebrowCity: "BEYOĞLU · ISTANBUL",
      titleLine1: "From historic pots,",
      titleLine2: "to modern ",
      titleEm: "Cihangir",
      titleLine3: "digital craft.",
      description: "Bringing Beyoğlu’s bohemian stews and wood-fired artisan pides together into a fluid digital experience in 10 languages and multi-currency conversion.",
      ctaExplore: "Explore Case Study",
      ctaMenu: "Live Menu Experience",
      devAvatar: "HM",
      devName: "Hamed Mohamed",
      devRole: "Product Designer & Full-Stack Engineer",
      devIssue: "02 / CASE",
      roundelTop: "CİHANGİR · DAILY",
      roundelHour: "10",
      roundelMinute: "00",
      roundelBottom: "HOT POT SPECIALS",
      noteTitle: "HOME COOKING",
      noteSubtitle: "STONE OVEN PIDE",
      sideLabel: "DAILY POTS · CASSEROLE · PIDE",
      bottomline: "PRODUCT DESIGN ✳ FULL-STACK ARCHITECTURE ✳ 10-LANGUAGE UX",
      scrollDown: "SCROLL DOWN",
    },
    facts: {
      tag: "PROJECT METRICS",
      title: "Cihangir, digitally redefined.",
      languages: "10",
      languagesLabel: "full interface languages (with RTL)",
      currencies: "06",
      currenciesLabel: "live rates with instant conversion",
      pagesCount: "970+",
      pagesLabel: "prerendered static pages (SSG)",
      foucScore: "0 ms",
      foucLabel: "zero flash of unstyled content via Smart Splash",
      stampDistrict: "BEYOĞLU",
      stampCity: "ISTANBUL",
    },
    story: {
      index: "01",
      sectionName: "PROBLEM → SOLUTION",
      tag: "GASTRONOMY & ARCHITECTURE",
      h2Part1: "The food was heritage.",
      h2Em: "The experience",
      h2Part2: "had to be contemporary.",
      lead: "Cihangir Ev Yemekleri & Pide is not just a digital menu. It is an Istanbul culinary landmark uniting daily simmering pots, wood-fired hearth ovens, and cosmopolitan diners from across the world.",
      p: "My mission was to translate this rich gastronomic heritage into a frictionless mobile product: effortless discovery, instant currency adaptation, and zero-latency page loads in any language.",
      linkText: "About the Restaurant",
      photoBadge: "CİHANGİR EV YEMEKLERİ",
      photoHeadline: "Authentic pide & stew heritage in Istanbul.",
      photoLocation: "CİHANGİR · ISTANBUL",
      photoCoord: "41°01′55″ N",
      principles: [
        {
          num: "01 / CLARITY",
          title: "Daily Specials Dynamism",
          desc: "Real-time filtering of seasonal pots, authentic stews, and hot oven specialties.",
        },
        {
          num: "02 / REACH",
          title: "10-Language Native UX",
          desc: "Full bidirectional RTL typography for Arabic and Persian, natural tone for all locales.",
        },
        {
          num: "03 / SPEED",
          title: "Zero Latency & Smart Splash",
          desc: "10-layer micro-animation and 970 SSG pages opening in milliseconds without FOUC.",
        },
      ],
    },
    experience: {
      index: "02",
      sectionName: "INTERACTIVE EXPERIENCE",
      tag: "LIVE UI PROTOTYPE",
      h2Part1: "Daily pots and pide,",
      h2Em: "right at your fingertips.",
      intro: "Interact with the phone prototype below to toggle categories, switch currencies, and see real-time price calculations.",
      stageCaption: "Interactive UI Simulation · Real Exchange & Menu Flow",
      notes: [
        {
          symbol: "🥘",
          title: "Daily Simmering Pots",
          desc: "Tas Kebabı, Elbasan Tava, and olive oil dishes listed straight from the kitchen.",
        },
        {
          symbol: "🔥",
          title: "Wood-Fired pide",
          desc: "Minced meat, kasar cheese, and artisan pides highlighted straight from the hearth.",
        },
        {
          symbol: "💱",
          title: "Dynamic Currency Switcher",
          desc: "Instant live rates across TRY (₺), USD ($), EUR (€), and SAR (﷼).",
        },
      ],
      liveMenuTag: "LIVE RESTAURANT MENU",
      liveMenuTitle: "Browse the Live Cihangir Menu",
    },
    languages: {
      index: "03",
      sectionName: "MULTILINGUAL ARCHITECTURE",
      tag: "10 LANGUAGES · GLOBAL INCLUSIVITY",
      h2Part1: "From Beyoğlu to the world,",
      h2Em: "in every diner's",
      h2Part2: "native tongue.",
      intro: "We did not merely translate text; we adapted typography, directionality (RTL/LTR), and cultural food context for all 10 languages.",
      specs: [
        { b: "10", label: "Interface Languages" },
        { b: "RTL", label: "Full Arabic & Persian RTL Alignment" },
        { b: "SEO", label: "Dedicated Locale Subpaths for Google" },
        { b: "0 ms", label: "Zero-Reload Client Language Switching" },
      ],
      bottom1: "Optimized hreflang annotations and schema.org microdata for every locale.",
      bottom2: "MAXIMUM DISCOVERABILITY ON GOOGLE SEARCH & MAPS",
    },
    splashCraft: {
      index: "04",
      sectionName: "BRAND CRAFT",
      tag: "SMART SPLASH MICRO-ANIMATION",
      h2Part1: "Birth of an emblem:",
      h2Em: "10-layer assembly.",
      intro: "Zero heavy video or bloated GIFs. Built purely with 318 KB of optimized WebP layers and hardware-accelerated CSS keyframes.",
      layersLabel: "EXPLORE THE LAYERS",
      layersHint: "Hover or tap on any layer to inspect its role in assembling the brand mark:",
    },
    engineering: {
      index: "05",
      sectionName: "TECHNICAL ARCHITECTURE",
      tag: "MODERN WEB ENGINEERING",
      h2Part1: "Traditional taste,",
      h2Em: "bleeding-edge code.",
      intro: "Engineered on Next.js 16 with zero server latency, self-healing data schemas, and edge caching.",
      items: [
        {
          number: "01",
          cat: "PERFORMANCE",
          title: "Next.js 16 SSG & Turbopack",
          desc: "970 static pages prerendered and distributed across global edge CDN nodes.",
          glyph: "⚡",
        },
        {
          number: "02",
          cat: "DATABASE",
          title: "Self-Healing PostgreSQL & Prisma",
          desc: "Automated schema creation and self-seeding menu dataset in 10 languages on empty startup.",
          glyph: "🗄️",
        },
        {
          number: "03",
          cat: "MANAGEMENT",
          title: "Secured Admin Portal",
          desc: "Argon2 session hashing, role-based controls, inventory management, and audit logging.",
          glyph: "🛡️",
        },
        {
          number: "04",
          cat: "SEO & DATA",
          title: "Schema.org Restaurant Rich Snippets",
          desc: "Full structured metadata for menu items, pricing, availability, and business location.",
          glyph: "🔍",
        },
      ],
      stackLabel: "CORE TECHNOLOGY STACK",
      stack: [
        "Next.js 16",
        "React 19",
        "TypeScript",
        "PostgreSQL",
        "Prisma ORM",
        "Tailwind CSS",
        "Argon2",
        "Turbopack",
      ],
      seoNoteMark: "100%",
      seoNoteTitle: "Core Web Vitals & Mobile Excellence",
      seoNoteDesc: "All green across LCP, FID, and CLS benchmarks with buttery 60fps transitions.",
      seoNoteStatus: "Passing All Lighthouse & Vitals Audits",
    },
    closing: {
      overline: "COLLABORATE & CONNECT",
      h2Part1: "Let's craft your next",
      h2Em: "digital benchmark",
      h2Part2: "together.",
      desc: "Whether you run an iconic restaurant or a global digital brand, I bridge gastronomy, aesthetics, and engineering to build products that stand out.",
      ctaTalk: "Message on WhatsApp",
      ctaPortfolio: "View All Projects",
      creditLabel: "DESIGN & DEVELOPMENT",
      creditName: "Hamed Mohamed",
      whatsappUrl: "https://wa.me/905060453906",
      portfolioUrl: "https://hamedmohamed.dev",
    },
  },
  ar: {
    meta: {
      title: "التصميم والتطوير — حامد محمد | دراسة حالة مطعم جهانجير",
      description: "تحويل المطبخ المنزلي التاريخي وفرن الحجر العريق في جهانجير إلى تجربة رقمية فائقة السرعة بـ 10 لغات وتحويل عملات حي: حامد محمد.",
    },
    hero: {
      eyebrowTag: "دراسة حالة رقمية",
      eyebrowCity: "بيوغلو · إسطنبول",
      titleLine1: "من أواني المطبخ العريق،",
      titleLine2: "إلى حرفة ",
      titleEm: "جهانجير",
      titleLine3: "الرقمية الحديثة.",
      description: "دمجت نكهات المطبخ المنزلي وأفران الحطب التاريخية في شوارع جهانجير البوهيمية، في منصة رقمية سريعة بـ 10 لغات وتحويل فوري للعملات.",
      ctaExplore: "استكشف دراسة الحالة",
      ctaMenu: "تجربة القائمة الحية",
      devAvatar: "HM",
      devName: "حامد محمد",
      devRole: "مصمم منتجات ومطور برمجيات شامل (Full-Stack)",
      devIssue: "02 / دراسة حالة",
      roundelTop: "جهانجير · يومياً",
      roundelHour: "10",
      roundelMinute: "00",
      roundelBottom: "أطباق اليوم الطازجة",
      noteTitle: "أكل بيتي",
      noteSubtitle: "فطائر الفطائر",
      sideLabel: "منيو اليوم · طواجن · فطائر",
      bottomline: "تصميم منتجات ✳ هندسة برمجية شاملة ✳ تجربة مستخدم بـ 10 لغات",
      scrollDown: "مرر للأسفل",
    },
    facts: {
      tag: "مؤشرات المشروع",
      title: "جهانجير، على الساحة الرقمية.",
      languages: "10",
      languagesLabel: "لغات كاملة للواجهة (دعم كامل للعربية)",
      currencies: "06",
      currenciesLabel: "عملات دولية مع تحويل فوري للأسعار",
      pagesCount: "970+",
      pagesLabel: "صفحة ثابتة مُنشأة مسبقاً (SSG)",
      foucScore: "0 ms",
      foucLabel: "انعدام وميض الشاشة عبر الاسبلاش الذكي",
      stampDistrict: "بيوغلو",
      stampCity: "إسطنبول",
    },
    story: {
      index: "01",
      sectionName: "المشكلة → الحل",
      tag: "فنون الطهي والهندسة",
      h2Part1: "المذاق كان أصيلاً.",
      h2Em: "والتجربة",
      h2Part2: "يجب أن تكون عصرية.",
      lead: "مطعم جهانجير للأكلات المنزلية والفطائر ليس مجرد قائمة طعام، بل هو أيقونة عريقة تجمع بين الأواني الطازجة يومياً وأفران الحطب وزوار إسطنبول من كل أنحاء العالم.",
      p: "كانت مهمتي تحويل هذا المطبخ الغني إلى تجربة هاتف ذكية لا تشتت الزائر، وتساعد السائح وأهل الحي على الوصول لطلبهم ومعرفة الأسعار بعملتهم بثوانٍ معدودة.",
      linkText: "عن المطعم وتاريخه",
      photoBadge: "مطعم جهانجير إسطنبول",
      photoHeadline: "أكلات منزلية والفطائر في قلب بيوغلو.",
      photoLocation: "جهانجير · إسطنبول",
      photoCoord: "41°01′55″ N",
      principles: [
        {
          num: "01 / الشفافية",
          title: "ديناميكية منيو اليوم",
          desc: "عرض أطباق اليوم المتغيرة مع الفلترة الفورية حسب التوفر في المطبخ.",
        },
        {
          num: "02 / الوصول العالمي",
          title: "10 لغات بتجربة أصلية",
          desc: "دعم حقيقي لاتجاه RTL للغتين العربية والفارسية، وتوطين دقيق لكافة اللغات.",
        },
        {
          num: "03 / السرعة والأناقة",
          title: "انعدام التأخير والاسبلاش",
          desc: "حركة تركيب ذكية بـ 10 طبقات مع 970 صفحة ثابتة تُفتح بلمح البصر.",
        },
      ],
    },
    experience: {
      index: "02",
      sectionName: "التجربة التفاعلية",
      tag: "نموذج واجهة تفاعلي حي",
      h2Part1: "أكلات اليوم وفرن الحجر،",
      h2Em: "بين يديك مباشرة.",
      intro: "جرب محاكاة الهاتف أدناه للتنقل بين الأطباق، وتغيير العملات ورؤية التحويل التلقائي للأسعار في الوقت الفعلي.",
      stageCaption: "محاكاة هاتف تفاعلية · أسعار حية وتدفق القائمة",
      notes: [
        {
          symbol: "🥘",
          title: "أواني المطبخ اليومية",
          desc: "طاجن كباب الحلة، إلباسان، والأطباق بزيت الزيتون مباشرة من المطبخ.",
        },
        {
          symbol: "🔥",
          title: "فطائر الفطائر الحطب",
          desc: "فطائر اللحم والجبن والمشكل تخرج ساخنة من فوهة الفرن الحجري.",
        },
        {
          symbol: "💱",
          title: "محول عملات حي",
          desc: "تبديل فوري بين الليرة (₺)، الدولار ($)، اليورو (€)، والريال (﷼).",
        },
      ],
      liveMenuTag: "قائمة طعام المطعم الحية",
      liveMenuTitle: "تصفح منيو جهانجير الحي الآن",
    },
    languages: {
      index: "03",
      sectionName: "هندسة اللغات المتعددة",
      tag: "10 لغات · تجربة عالمية شاملة",
      h2Part1: "من بيوغلو إلى العالم،",
      h2Em: "بلسان كل زائر",
      h2Part2: "وثقافته.",
      intro: "لم نكتفِ بترجمة الكلمات، بل أعدنا ضبط اتجاه الواجهة (RTL)، والخطوط العربية الأصيلة، وسياق أسماء الأكلات لكل ثقافة.",
      specs: [
        { b: "10", label: "لغات للواجهة بالكامل" },
        { b: "RTL", label: "دعم كامل للغة العربية والفارسية" },
        { b: "SEO", label: "مسارات وروابط مخصصة لمحركات البحث" },
        { b: "0 ms", label: "تبديل فوري للغات دون إعادة تحميل" },
      ],
      bottom1: "وسوم hreflang وبيانات Schema.org منظمة لكل لغة بدقة متناهية.",
      bottom2: "أعلى مستوى للظهور في نتائج بحث جوجل والخرائط",
    },
    splashCraft: {
      index: "04",
      sectionName: "حرفة الهوية البصرية",
      tag: "شاشة الاسبلاش الذكية",
      h2Part1: "ولادة الشعار:",
      h2Em: "تركيب من 10 طبقات.",
      intro: "دون استخدام مقاطع فيديو ثقيلة؛ تم بناء الحركة بالكامل عبر صور WebP مدمجة بحجم 318 كيلوبايت فقط مع كود CSS فائق السرعة.",
      layersLabel: "استكشف طبقات الشعار",
      layersHint: "مرر أو انقر فوق أي طبقة لمعرفة دورها في تكوين الشعار:",
    },
    engineering: {
      index: "05",
      sectionName: "البنية التقنية",
      tag: "هندسة الويب الحديثة",
      h2Part1: "أصالة المذاق،",
      h2Em: "بأحدث التقنيات البرمجية.",
      intro: "مبني بأحدث إصدارات Next.js 16 المقاومة لضغط الزوار مع سرعة استجابة مذهلة.",
      items: [
        {
          number: "01",
          cat: "الأداء الفائق",
          title: "Next.js 16 SSG & Turbopack",
          desc: "970 صفحة ثابتة مُسبقة التوليد وموزعة على شبكات الـ CDN العالمية.",
          glyph: "⚡",
        },
        {
          number: "02",
          cat: "قواعد البيانات",
          title: "PostgreSQL & Prisma ذاتي الإصلاح",
          desc: "إنشاء الجداول تلقائياً وبذر البيانات بـ 10 لغات ذاتياً عند التشغيل لأول مرة.",
          glyph: "🗄️",
        },
        {
          number: "03",
          cat: "الإدارة والأمان",
          title: "لوحة تحكم آمنة للمطعم",
          desc: "تشفير Argon2، صلاحيات إدارية دقيقة، إدارة للمنتجات وسجلات تدقيق audit logs.",
          glyph: "🛡️",
        },
        {
          number: "04",
          cat: "السيو والبيانات المنظمة",
          title: "Schema.org Restaurant Rich Snippets",
          desc: "ترميز دقيق لبيانات المطعم والقائمة والأسعار لنتائج جوجل المتقدمة.",
          glyph: "🔍",
        },
      ],
      stackLabel: "حزمة التقنيات المستخدمة",
      stack: [
        "Next.js 16",
        "React 19",
        "TypeScript",
        "PostgreSQL",
        "Prisma ORM",
        "Tailwind CSS",
        "Argon2",
        "Turbopack",
      ],
      seoNoteMark: "100%",
      seoNoteTitle: "معايير Core Web Vitals وتجربة الهاتف",
      seoNoteDesc: "علامات كاملة في سرعة التحميل والاستجابة اللمسية واستقرار الشاشة.",
      seoNoteStatus: "اجتياز كافة اختبارات الأداء القياسية",
    },
    closing: {
      overline: "التواصل وبدء المشروعات",
      h2Part1: "لنصنع مشروعك الرقمي",
      h2Em: "المميز القادم",
      h2Part2: "معاً.",
      desc: "سواء كنت تدير سلسلة مطاعم رائدة أو علامة تجارية عالمية؛ أجمع بين التفكير التصميمي والهندسة البرمجية لبناء منتجات رقمية استثنائية.",
      ctaTalk: "محادثة عبر واتساب",
      ctaPortfolio: "تصفح كافة أعمالي",
      creditLabel: "التصميم والتطوير",
      creditName: "حامد محمد (Hamed Mohamed)",
      whatsappUrl: "https://wa.me/905060453906",
      portfolioUrl: "https://hamedmohamed.dev",
    },
  },
};

