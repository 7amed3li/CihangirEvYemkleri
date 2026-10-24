export interface MenuItem {
  id: string;
  name: {
    tr: string;
    en?: string;
    ar?: string;
  };
  price: number;
  image?: string;
  description?: string;
  tags?: string[];
  trending?: boolean;
  priceNeedsConfirmation?: boolean;
  isAvailable?: boolean;
}

export interface MenuCategory {
  id: string;
  slug: string;
  category: {
    tr: string;
    en: string;
    ar?: string;
  };
  image?: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [
  {
    id: "ana-yemekler",
    slug: "ana-yemekler",
    category: {
      tr: "Ana Yemekler",
      en: "Main Dishes",
      ar: "الأطباق الرئيسية",
    },
    items: [
      {
        id: "asci-tabagi",
        name: { tr: "Aşçı tabağı", en: "Chef's Platter", ar: "طبق الشيف المشكل" },
        price: 650,
        tags: ["signature"],
        trending: true,
      },
      {
        id: "baget-firin",
        name: { tr: "Baget fırın", en: "Baked Chicken Drumsticks", ar: "دبابيس دجاج بالفرن" },
        price: 320,
        image: "/images/products/baget-firin.jpg",
        tags: [],
      },
      {
        id: "biber-dolmasi",
        name: { tr: "Biber dolması", en: "Stuffed Bell Peppers", ar: "فلفل محشي" },
        price: 370,
        image: "/images/products/biber-dolmasi.jpg",
        tags: [],
      },
      {
        id: "ciftlik-kebabi",
        name: { tr: "Çiftlik kebabı", en: "Farmhouse Kebab", ar: "كباب المزرعة" },
        price: 300,
        tags: [],
      },
      {
        id: "eksili-kofte",
        name: { tr: "Ekşili köfte", en: "Sour Meatball Stew", ar: "كفتة حامضة بالخضار" },
        price: 320,
        tags: [],
      },
      {
        id: "elbasan",
        name: { tr: "Elbasan", en: "Elbasan Tava", ar: "طاجن الباسان باللبن" },
        price: 370,
        tags: [],
      },
      {
        id: "et-sote",
        name: { tr: "Et sote", en: "Beef Sauté", ar: "سوتيه اللحم" },
        price: 550,
        image: "/images/products/et-sote.jpg",
        tags: ["signature"],
        trending: true,
      },
      {
        id: "etli-nohut",
        name: { tr: "Etli nohut", en: "Chickpea Stew with Beef", ar: "حمص باللحم" },
        price: 390,
        image: "/images/products/etli-nohut.jpg",
        tags: [],
      },
      {
        id: "firinda-tavuk",
        name: { tr: "Fırında tavuk", en: "Roasted Chicken", ar: "دجاج محمر بالفرن" },
        price: 320,
        image: "/images/products/firinda-tavuk.jpg",
        tags: [],
      },
      {
        id: "gunun-menu",
        name: { tr: "Günün menü", en: "Daily Menu 1", ar: "قائمة اليوم 1" },
        price: 420,
        tags: ["signature"],
        trending: true,
      },
      {
        id: "gunun-menu-2",
        name: { tr: "Günün menü 2", en: "Daily Menu 2", ar: "قائمة اليوم 2" },
        price: 400,
        tags: [],
      },
      {
        id: "guvec",
        name: { tr: "Güveç", en: "Clay Pot Meat & Veggie Casserole", ar: "طاجن غوفيتش فخار" },
        price: 400,
        image: "/images/products/guvec.jpg",
        tags: [],
      },
      {
        id: "ispanak",
        name: { tr: "Ispanak", en: "Sautéed Spinach", ar: "سبانخ مطبوخة" },
        price: 200,
        image: "/images/products/ispanak.jpg",
        tags: ["vegetarian"],
      },
      {
        id: "izmir-kofte",
        name: { tr: "İzmir köfte", en: "Izmir Style Meatballs", ar: "كفتة إزمير بالصلصة والبطاطس" },
        price: 400,
        image: "/images/products/izmir-kofte.jpg",
        tags: ["trending"],
        trending: true,
      },
      {
        id: "kara-lahana-dolmasi",
        name: { tr: "Kara lahana dolması", en: "Stuffed Collard Greens", ar: "محشي ورق الكرنب الأسود" },
        price: 370,
        tags: [],
      },
      {
        id: "karniyarik",
        name: { tr: "Karnıyarık", en: "Stuffed Eggplant with Minced Meat", ar: "كارني ياريك (باذنجان محشي باللحم)" },
        price: 350,
        image: "/images/products/karniyarik.jpg",
        tags: ["signature"],
        trending: true,
      },
      {
        id: "kavurma",
        name: { tr: "Kavurma", en: "Traditional Braised Beef (Kavurma)", ar: "قاورما اللحم البلدي" },
        price: 450,
        tags: ["signature"],
        trending: true,
      },
      {
        id: "kayseri-mantisi",
        name: { tr: "Kayseri mantısı", en: "Kayseri Manti (Turkish Dumplings)", ar: "مانتي قيصري بالزبادي والثوم" },
        price: 350,
        image: "/images/products/kayseri-mantisi.jpg",
        tags: ["signature"],
        trending: true,
      },
      {
        id: "kori-mantarli-tavuk",
        name: { tr: "Köri mantarlı tavuk", en: "Curry Mushroom Chicken", ar: "دجاج بالكاري والفطر" },
        price: 280,
        tags: [],
      },
      {
        id: "krema-kori-tavuk",
        name: { tr: "Krema köri tavuk", en: "Creamy Curry Chicken", ar: "دجاج بالكريمة والكاري" },
        price: 280,
        tags: [],
        priceNeedsConfirmation: true,
      },
      {
        id: "kuru-fasulye",
        name: { tr: "Kuru fasulye", en: "Traditional White Bean Stew", ar: "فاصوليا بيضاء تركية" },
        price: 220,
        image: "/images/products/kuru-fasulye.jpg",
        tags: ["signature"],
        trending: true,
      },
      {
        id: "kuzu-incik",
        name: { tr: "Kuzu incik", en: "Slow-cooked Lamb Shank", ar: "موزة ضأن مطهوة على نار هادئة" },
        price: 400,
        tags: ["signature"],
        trending: true,
      },
      {
        id: "mantar-tavuk-sote",
        name: { tr: "Mantar tavuk sote", en: "Mushroom & Chicken Sauté", ar: "سوتيه الدجاج والفطر" },
        price: 320,
        tags: [],
      },
      {
        id: "mix-tabak-2",
        name: { tr: "Mix tabak 2", en: "Mixed Dish Combo 2", ar: "طبق مشكل 2" },
        price: 400,
        tags: [],
      },
      {
        id: "musakka",
        name: { tr: "Musakka", en: "Eggplant Moussaka", ar: "مسقعة باذنجان باللحم" },
        price: 370,
        image: "/images/products/musakka.jpg",
        tags: [],
      },
      {
        id: "pirasa",
        name: { tr: "Pırasa", en: "Braised Leeks in Olive Oil", ar: "كراث بزيت الزيتون" },
        price: 260,
        tags: ["vegetarian"],
      },
      {
        id: "sebzeli-kofte",
        name: { tr: "Sebzeli köfte", en: "Meatballs with Vegetables", ar: "كفتة بالخضار" },
        price: 400,
        tags: [],
      },
      {
        id: "tas-kebabi-500",
        name: { tr: "Taş kebabı (Büyük)", en: "Tas Kebab Beef Stew (Large)", ar: "طاس كباب باللحم البقري (كبير)" },
        price: 500,
        tags: ["signature"],
        trending: true,
      },
      {
        id: "tas-kebabi-350",
        name: { tr: "Taş kebabı", en: "Tas Kebab Beef Stew", ar: "طاس كباب باللحم البقري" },
        price: 350,
        image: "/images/products/tas-kebabi-350.jpg",
        tags: [],
      },
      {
        id: "tavuk-haslama",
        name: { tr: "Tavuk haşlama", en: "Boiled Chicken & Veggie Soup-Stew", ar: "دجاج مسلوق بالخضار والبطاطس" },
        price: 290,
        tags: [],
      },
      {
        id: "tavuk-sote",
        name: { tr: "Tavuk sote", en: "Chicken Sauté", ar: "سوتيه دجاج" },
        price: 250,
        image: "/images/products/tavuk-sote.jpg",
        tags: [],
      },
      {
        id: "taze-fasulye",
        name: { tr: "Taze fasulye", en: "Green Beans in Olive Oil", ar: "فاصوليا خضراء بزيت الزيتون" },
        price: 270,
        image: "/images/products/taze-fasulye.jpg",
        tags: ["vegetarian"],
      },
      {
        id: "turlu",
        name: { tr: "Türlü", en: "Mixed Vegetable Stew", ar: "تورلو (خضار مشكلة مطبوخة)" },
        price: 270,
        tags: ["vegetarian"],
      },
    ],
  },
  {
    id: "corbalar",
    slug: "corbalar",
    category: {
      tr: "Çorbalar",
      en: "Soups",
      ar: "الشوربات",
    },
    items: [
      {
        id: "ezogelin",
        name: { tr: "Ezogelin", en: "Ezogelin Soup", ar: "شوربة إيزوجيلين" },
        price: 120,
        image: "/images/products/ezogelin.jpg",
        tags: ["signature"],
        trending: true,
      },
      {
        id: "mercimek",
        name: { tr: "Mercimek", en: "Red Lentil Soup", ar: "شوربة عدس أحمر" },
        price: 120,
        image: "/images/products/mercimek.jpg",
        tags: ["vegetarian"],
        trending: true,
      },
      {
        id: "sebze-corbasi",
        name: { tr: "Sebze çorbası", en: "Fresh Vegetable Soup", ar: "شوربة خضار طازجة" },
        price: 110,
        tags: ["vegetarian"],
      },
      {
        id: "tavuk-suyu",
        name: { tr: "Tavuk suyu", en: "Chicken Broth Soup", ar: "شوربة مرق الدجاج" },
        price: 160,
        tags: ["signature"],
        trending: true,
      },
      {
        id: "yayla-corbasi",
        name: { tr: "Yayla çorbası", en: "Yayla Yogurt Soup", ar: "شوربة يايلا بالزبادي والنعناع" },
        price: 140,
        tags: ["vegetarian"],
      },
    ],
  },
  {
    id: "salatalar",
    slug: "salatalar",
    category: {
      tr: "Salatalar",
      en: "Salads & Cold Appetizers",
      ar: "السلطات والمقبلات الباردة",
    },
    items: [
      {
        id: "cacik",
        name: { tr: "Cacık", en: "Cacık (Cold Cucumber Yogurt)", ar: "جاجيك (خيار باللبن والثوم)" },
        price: 80,
        image: "/images/products/cacik.jpg",
        tags: ["vegetarian"],
        trending: true,
      },
      {
        id: "coban-salata",
        name: { tr: "Çoban salata", en: "Shepherd's Salad", ar: "سلطة الرعاة التركية (شوبان)" },
        price: 150,
        tags: ["vegetarian"],
        trending: true,
      },
      {
        id: "havuc-tarator",
        name: { tr: "Havuç tarator", en: "Carrot Tarator with Yogurt", ar: "تاراتور الجزر بالزبادي" },
        price: 100,
        tags: ["vegetarian"],
      },
      {
        id: "mevsim-salatasi",
        name: { tr: "Mevsim salatası", en: "Seasonal Garden Salad", ar: "سلطة الموسم الخضراء" },
        price: 150,
        tags: ["vegetarian"],
      },
      {
        id: "semizotu",
        name: { tr: "Semizotu", en: "Purslane with Yogurt", ar: "سلطة الرجلة بالزبادي" },
        price: 100,
        tags: ["vegetarian"],
      },
    ],
  },
  {
    id: "yan-urunler",
    slug: "yan-urunler",
    category: {
      tr: "Yan Ürünler",
      en: "Side Dishes & Rice",
      ar: "الأطباق الجانبية والأرز",
    },
    items: [
      {
        id: "bulgur",
        name: { tr: "Bulgur", en: "Bulgur Pilaf", ar: "برغل تركي مفلفل" },
        price: 140,
        tags: ["vegetarian"],
      },
      {
        id: "makarna",
        name: { tr: "Makarna", en: "Pasta of the Day", ar: "مكرونة اليوم" },
        price: 140,
        tags: ["vegetarian"],
      },
      {
        id: "pilavustu-kuru",
        name: { tr: "Pilavüstü kuru", en: "Rice topped with White Beans", ar: "أرز يعلوه فاصوليا بيضاء (بيلاف أوستو كورو)" },
        price: 190,
        tags: ["signature"],
        trending: true,
      },
      {
        id: "pirinc-pilavi",
        name: { tr: "Pirinç pilavı", en: "Turkish Butter Rice", ar: "أرز تركي بالشعيرية والزبدة" },
        price: 100,
        tags: ["vegetarian"],
        trending: true,
      },
      {
        id: "yogurt",
        name: { tr: "Yoğurt", en: "Authentic Turkish Yogurt Bowl", ar: "زبادي بلدي طازج" },
        price: 50,
        tags: ["vegetarian"],
      },
    ],
  },
  {
    id: "pideler",
    slug: "pideler",
    category: {
      tr: "Pideler",
      en: "Stone Oven Pide",
      ar: "فطائر البيدة بالفرن الحجري",
    },
    items: [
      {
        id: "karisik-pide",
        name: { tr: "Karışık pide", en: "Mixed Pide", ar: "بيدة مشكلة" },
        price: 350,
        tags: ["signature"],
        trending: true,
      },
      {
        id: "kasarli-pide",
        name: { tr: "Kaşarlı pide", en: "Kashar Cheese Pide", ar: "بيدة بجبن القشقوان الذائب" },
        price: 300,
        tags: ["vegetarian"],
        trending: true,
      },
      {
        id: "kavurmali-kasarli",
        name: { tr: "Kavurmalı kaşarlı", en: "Braised Beef & Kashar Pide", ar: "بيدة قاورما مع قشقوان" },
        price: 650,
        tags: ["signature"],
        trending: true,
      },
      {
        id: "kavurmali-pide",
        name: { tr: "Kavurmalı pide", en: "Braised Beef Pide", ar: "بيدة بلحم القاورما" },
        price: 600,
        tags: ["signature"],
      },
      {
        id: "kiymali-kasarli",
        name: { tr: "Kıymalı kaşarlı", en: "Minced Meat & Kashar Pide", ar: "بيدة لحم مفروم مع قشقوان" },
        price: 500,
        image: "/images/products/kiymali-kasarli.jpg",
        tags: [],
      },
      {
        id: "kiymali-pide",
        name: { tr: "Kıymalı pide", en: "Minced Meat Pide", ar: "بيدة باللحم المفروم المتبل" },
        price: 480,
        tags: ["trending"],
        trending: true,
      },
      {
        id: "koy-peynirli-pide",
        name: { tr: "Köy peynirli pide", en: "Village Cheese Pide", ar: "بيدة جبن القرية البلدي" },
        price: 380,
        tags: ["vegetarian"],
      },
      {
        id: "kusbasili-kasarli",
        name: { tr: "Kuşbaşılı kaşarlı", en: "Diced Meat & Kashar Pide", ar: "بيدة قطع لحم العجل مع قشقوان" },
        price: 500,
        tags: ["signature"],
        trending: true,
      },
      {
        id: "kusbasili-pide",
        name: { tr: "Kuşbaşılı pide", en: "Diced Meat Pide (Kuşbaşılı)", ar: "بيدة بقطع لحم العجل (كوشباشيلي)" },
        price: 480,
        tags: ["signature"],
        trending: true,
      },
      {
        id: "pastirmali-kasarli",
        name: { tr: "Pastırmalı kaşarlı", en: "Pastrami & Kashar Pide", ar: "بيدة بسطرمة وقشقوان" },
        price: 450,
        tags: [],
      },
      {
        id: "pastirmali-pide",
        name: { tr: "Pastırmalı pide", en: "Pastrami Pide", ar: "بيدة بالبسطرمة التركية" },
        price: 400,
        tags: [],
      },
      {
        id: "sosisli-pide",
        name: { tr: "Sosisli pide", en: "Sausage Pide", ar: "بيدة بالنقانق" },
        price: 350,
        tags: [],
      },
      {
        id: "sucuklu-kasarli",
        name: { tr: "Sucuklu kaşarlı", en: "Spicy Turkish Sucuk & Kashar Pide", ar: "بيدة سجق تركي وقشقوان" },
        price: 450,
        tags: ["trending"],
        trending: true,
      },
      {
        id: "sucuklu-pide",
        name: { tr: "Sucuklu pide", en: "Turkish Sucuk Pide", ar: "بيدة بالسجق التركي" },
        price: 400,
        tags: [],
      },
      {
        id: "tavuklu",
        name: { tr: "Tavuklu", en: "Chicken Pide", ar: "بيدة بالدجاج المتبل" },
        price: 380,
        tags: [],
      },
      {
        id: "trabzon-peynirli",
        name: { tr: "Trabzon peynirli", en: "Trabzon Artisan Cheese Pide", ar: "بيدة جبن طرابزون الشهير" },
        price: 500,
        tags: ["signature", "vegetarian"],
        trending: true,
      },
    ],
  },
  {
    id: "tatlilar",
    slug: "tatlilar",
    category: {
      tr: "Tatlı Çeşitleri",
      en: "Desserts",
      ar: "الحلويات",
    },
    items: [
      {
        id: "firinda-sutlac",
        name: { tr: "Fırında sütlaç", en: "Baked Rice Pudding", ar: "أرز بالحليب مخبوز بالفرن (سوتلاش)" },
        price: 200,
        image: "/images/products/firinda-sutlac.jpg",
        tags: ["signature", "vegetarian"],
        trending: true,
      },
      {
        id: "kadayif",
        name: { tr: "Kadayıf", en: "Traditional Kadayif with Walnuts", ar: "قطايف تركية مقرمشة بالمكسرات" },
        price: 150,
        tags: ["vegetarian"],
        trending: true,
      },
      {
        id: "kibris-tatlisi",
        name: { tr: "Kıbrıs tatlısı", en: "Cyprus Dessert with Cream", ar: "حلوى قبرص بالقشطة" },
        price: 200,
        tags: ["vegetarian"],
      },
      {
        id: "sekerpare",
        name: { tr: "Şekerpare", en: "Sekerpare (Almond Semolina Cakes)", ar: "شكر باره بالعسل" },
        price: 200,
        tags: ["vegetarian"],
      },
      {
        id: "tatli",
        name: { tr: "Tatlı", en: "Special Chef's Dessert", ar: "حلوى اليوم الخاصة" },
        price: 180,
        tags: ["vegetarian"],
      },
    ],
  },
  {
    id: "icecekler",
    slug: "icecekler",
    category: {
      tr: "Sıcak Soğuk İçecekler",
      en: "Hot & Cold Beverages",
      ar: "المشروبات الساخنة والباردة",
    },
    items: [
      {
        id: "ayran",
        name: { tr: "Ayran", en: "Chilled Turkish Ayran", ar: "عيران بلدي مثلج" },
        price: 70,
        tags: ["vegetarian"],
        trending: true,
      },
      {
        id: "bitki-caylari",
        name: { tr: "Bitki çayları", en: "Herbal Teas Selection", ar: "شاي أعشاب طبيعية" },
        price: 100,
        tags: ["vegetarian"],
      },
      {
        id: "cola",
        name: { tr: "Cola", en: "Coca-Cola", ar: "كوكاكولا" },
        price: 70,
        tags: [],
      },
      {
        id: "cay",
        name: { tr: "Çay", en: "Brewed Turkish Tea (Demleme)", ar: "شاي تركي مخدر بالاستكانة" },
        price: 50,
        tags: ["vegetarian"],
        trending: true,
      },
      {
        id: "fanta",
        name: { tr: "Fanta", en: "Fanta", ar: "فانتا" },
        price: 70,
        tags: [],
      },
      {
        id: "meyve-sulari",
        name: { tr: "Meyve suları", en: "Fruit Juices", ar: "عصائر فواكه" },
        price: 70,
        tags: ["vegetarian"],
      },
      {
        id: "nescafe",
        name: { tr: "Nescafe", en: "Nescafe Coffee", ar: "نسكافيه" },
        price: 100,
        tags: ["vegetarian"],
      },
      {
        id: "soda",
        name: { tr: "Soda", en: "Sparkling Mineral Water (Soda)", ar: "مياه معدنية غازية (صودا)" },
        price: 50,
        tags: ["vegetarian"],
      },
      {
        id: "su",
        name: { tr: "Su", en: "Natural Spring Water", ar: "مياه ينابيع طبيعية" },
        price: 30,
        tags: ["vegetarian"],
      },
      {
        id: "turk-kahvesi",
        name: { tr: "Türk kahvesi", en: "Authentic Turkish Coffee", ar: "قهوة تركية أصلية على الرمل" },
        price: 70,
        tags: ["signature"],
        trending: true,
      },
    ],
  },
  {
    id: "az-menu",
    slug: "az-menu",
    category: {
      tr: "Az Menü",
      en: "Small Portions (Az Menü)",
      ar: "وجبات صغيرة (أز منيو - نصف كمية)",
    },
    items: [
      {
        id: "az-corba",
        name: { tr: "Az çorba", en: "Half Portion Soup", ar: "نصف شوربة" },
        price: 70,
        tags: [],
      },
      {
        id: "az-dolma",
        name: { tr: "Az dolma", en: "Half Portion Stuffed Peppers/Cabbage", ar: "نصف محشي" },
        price: 200,
        tags: [],
      },
      {
        id: "az-et-yemegi",
        name: { tr: "Az et yemeği", en: "Half Portion Meat Dish", ar: "نصف وجبة لحم" },
        price: 270,
        tags: [],
      },
      {
        id: "az-kofte",
        name: { tr: "Az köfte", en: "Half Portion Meatballs", ar: "نصف وجبة كفتة" },
        price: 250,
        tags: [],
      },
      {
        id: "az-kuru",
        name: { tr: "Az kuru", en: "Half Portion White Beans", ar: "نصف فاصوليا بيضاء" },
        price: 100,
        tags: [],
      },
      {
        id: "az-pilav",
        name: { tr: "Az pilav", en: "Half Portion Rice", ar: "نصف طبق أرز" },
        price: 70,
        tags: [],
      },
      {
        id: "az-sebze-yemegi",
        name: { tr: "Az sebze yemeği", en: "Half Portion Vegetable Stew", ar: "نصف وجبة خضار" },
        price: 170,
        tags: [],
      },
      {
        id: "az-sehriye",
        name: { tr: "Az şehriye", en: "Half Portion Vermicelli Pilaf", ar: "نصف طبق شعيرية" },
        price: 60,
        tags: [],
      },
      {
        id: "az-tavuk",
        name: { tr: "Az tavuk", en: "Half Portion Chicken Dish", ar: "نصف وجبة دجاج" },
        price: 200,
        tags: [],
      },
    ],
  },
];
