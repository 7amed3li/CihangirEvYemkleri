import * as fs from "node:fs";
import * as path from "node:path";

// Master verified ingredients dictionary for all Turkish dishes in Cihangir Ev Yemekleri
const INGREDIENTS_MAP: Record<string, { ingredients: string[]; serving: string }> = {
  // Ana Yemekler
  "asci-tabagi": {
    ingredients: ["kuru fasulye (white beans)", "tas kebabi (tender braised beef cubes)", "pilav (steamed rice)", "taze fasulye (braised green beans)"],
    serving: "divided traditional chef tasting plate featuring a portion of each house stew"
  },
  "baget-firin": {
    ingredients: ["fırınlanmış tavuk baget (roasted chicken drumsticks)", "patates (roasted potato wedges)", "kekik ve pul biber (oregano and paprika marinade)", "zeytinyağı (olive oil)"],
    serving: "crisp golden-roasted chicken drumsticks glistening on a ceramic baking platter"
  },
  "biber-dolmasi": {
    ingredients: ["dolmalık yeşil biber (stuffed green bell peppers)", "dana kıyma ve pirinç (spiced minced beef and rice filling)", "domates salçası (tomato paste)", "nane ve soğan (mint and sweet onion)"],
    serving: "shallow ceramic dish, upright braised green peppers with light tomato juices"
  },
  "ciftlik-kebabi": {
    ingredients: ["kuşbaşı dana eti (cubed tender beef)", "bezelye (sweet green peas)", "havuç küpleri (diced carrots)", "patates (diced potatoes)", "domates sosu (savory tomato broth)"],
    serving: "rustic earthenware casserole dish, colorful hearty farm-style beef and garden vegetable stew"
  },
  "eksili-kofte": {
    ingredients: ["mini dana köfteler (petite spiced meatballs)", "havuç ve patates (diced carrots and potatoes)", "ekşili terbiye sosu (tangy egg-lemon yogurt broth)", "dereotu (fresh dill)"],
    serving: "ceramic soup bowl, tender meatballs and vegetables in velvety pale lemon-scented sauce"
  },
  "elbasan": {
    ingredients: ["haşlanmış kuzu eti (tender braised lamb)", "yoğurtlu sarımsaklı sos (baked garlic-yogurt béchamel glaze)", "pul biberli tereyağı (melted chili butter)"],
    serving: "oval baking dish, golden-brown gratin crust over tender pull-apart lamb"
  },
  "et-sote": {
    ingredients: ["dana kuşbaşı (tender beef cubes)", "yeşil biber (green peppers)", "kapya biber (red peppers)", "soğan (sliced onions)", "domates ve kekik (tomatoes and oregano)"],
    serving: "shallow earthenware pan, sizzling sautéed beef cubes with colorful peppers in savory jus"
  },
  "etli-nohut": {
    ingredients: ["nohut (plump cooked chickpeas)", "dana kuşbaşı (tender braised beef cubes)", "domates salçası (tomato paste)", "soğan (onion)", "tereyağı (butter)"],
    serving: "earthenware bowl, golden chickpeas and beef in warm red stew"
  },
  "firinda-tavuk": {
    ingredients: ["fırında kızarmış tavuk parçaları (oven-roasted golden chicken portions)", "patates dilimleri (herb-roasted potato wedges)", "kırmızı biber ve domates (roasted peppers and tomatoes)"],
    serving: "ceramic casserole, crispy browned chicken pieces with roasted potatoes in pan drippings"
  },
  "gunun-menu": {
    ingredients: ["özel günün et yemeği (chef's daily braised meat special)", "geleneksel çorba (daily artisan soup)", "pilav (steamed rice)"],
    serving: "artisan restaurant lunch setting, three distinct matching ceramic bowls"
  },
  "gunun-menu-2": {
    ingredients: ["günün taze sebze yemeği (chef's daily vegetable stew)", "mercimek çorbası (golden lentil soup)", "cacık (chilled yogurt)"],
    serving: "classic lunchtime tray, rustic homemade meal ensemble"
  },
  "guvec": {
    ingredients: ["kuzu eti (cubed lamb)", "patlıcan (roasted eggplant)", "domates (ripe tomatoes)", "sarımsak (whole garlic cloves)", "yeşil biber (green peppers)"],
    serving: "traditional earthenware güveç clay pot, bubbling hot summer vegetable and lamb stew"
  },
  "ispanak": {
    ingredients: ["taze ıspanak yaprakları (tender spinach leaves)", "soğan (sautéed sweet onions)", "hafif pirinç (grains of rice)", "zeytinyağı (extra virgin olive oil)", "yoğurt garnitürü (dollop of strained yogurt)"],
    serving: "white ceramic plate, braised deep green spinach topped with a dollop of thick yogurt"
  },
  "izmir-kofte": {
    ingredients: ["dana köfte (oval spiced minced beef meatballs)", "patates dilimleri (potato wedges)", "yeşil biber (green peppers)", "domates sosu (rich tomato sauce)"],
    serving: "ceramic casserole dish with köfte and roasted potato wedges in savory sauce"
  },
  "kara-lahana-dolmasi": {
    ingredients: ["kara lahana yaprakları (tender collard green leaves)", "dana kıymalı pirinç harcı (spiced minced beef and rice filling)", "tereyağlı salçalı sos (buttery tomato broth)"],
    serving: "rustic ceramic dish, neatly rolled dark green dolma rolls arranged with yogurt"
  },
  "karniyarik": {
    ingredients: ["patlıcan (roasted whole eggplant split open)", "dana kıyma (seasoned minced beef filling)", "soğan (minced onion)", "domates (diced tomato)", "yeşil biber (green pepper)"],
    serving: "oval serving dish, baked eggplant with glistening meat filling"
  },
  "kavurma": {
    ingredients: ["dana kavurma (slow-braised caramelized tender beef chunks in own juices)", "kaya tuzu (sea salt)", "iç yağı ve karabiber (black pepper and natural tallow)"],
    serving: "shallow copper skillet, sizzling tender dark beef chunks glistening with savory natural glaze"
  },
  "kayseri-mantisi": {
    ingredients: ["el açması mini mantı (tiny handmade beef-filled dumplings)", "sarımsaklı yoğurt (garlic yogurt sauce)", "kızdırılmış pul biberli tereyağı (sizzling paprika-infused butter drizzle)", "kuru nane (dried mint)"],
    serving: "shallow ceramic bowl, petite dumplings smothered in creamy garlic yogurt and red butter swirl"
  },
  "kori-mantarli-tavuk": {
    ingredients: ["tavuk göğsü şeritleri (sliced chicken breast)", "taze kültür mantarı (sliced button mushrooms)", "köri sosu (aromatic yellow curry sauce)", "krema (light cream)"],
    serving: "modern white ceramic bowl, tender chicken strips and mushrooms in fragrant golden-yellow curry sauce"
  },
  "krema-kori-tavuk": {
    ingredients: ["tavuk parçaları (tender chicken bites)", "köri baharatı (mild curry blend)", "yoğun krema (rich cooking cream)", "taze çekilmiş karabiber (cracked black pepper)"],
    serving: "white deep plate, velvety cream and curry glazed chicken bites"
  },
  "kuru-fasulye": {
    ingredients: ["İspir kuru fasulyesi (white beans)", "domates salçası (tomato paste)", "biber salçası (red pepper paste)", "soğan (onion)", "tereyağı (butter)"],
    serving: "shallow ceramic dish, rich red buttery broth"
  },
  "kuzu-incik": {
    ingredients: ["kuzu incik (slow-braised tender lamb shank on the bone)", "et suyu sosu (rich glistening savory pan reduction jus)", "taze kekik (fresh thyme)"],
    serving: "large ceramic dish, fork-tender whole lamb shank upright in dark glossy braising glaze"
  },
  "mantar-tavuk-sote": {
    ingredients: ["tavuk küpleri (cubed chicken)", "taze mantar dilimleri (sliced mushrooms)", "yeşil biber (green peppers)", "domates ve soğan (tomatoes and onions)"],
    serving: "shallow ceramic pan, sizzling chicken and button mushroom medley in pan juices"
  },
  "mix-tabak-2": {
    ingredients: ["karnıyarık (stuffed eggplant)", "pilav (steamed rice)", "taze fasulye (braised green beans)"],
    serving: "generous artisan dinner plate with harmoniously arranged Turkish classics"
  },
  "musakka": {
    ingredients: ["kızarmış patlıcan dilimleri (sliced roasted eggplant)", "dana kıyma harcı (seasoned minced beef filling)", "domates (sliced tomatoes)", "yeşil biber (green peppers)"],
    serving: "shallow earthenware baking dish, baked layered eggplant and spiced meat"
  },
  "pirasa": {
    ingredients: ["taze pırasa (sliced fresh leeks)", "havuç halkaları (sliced carrots)", "pirinç (grains of rice)", "sızma zeytinyağı (extra virgin olive oil)", "limon suyu (fresh lemon juice)"],
    serving: "white ceramic plate, glossy olive oil braised tender leeks and carrots with lemon glaze"
  },
  "sebzeli-kofte": {
    ingredients: ["dana köfte (grilled spiced meatballs)", "közlenmiş biber ve domates (charred peppers and tomatoes)", "patates dilimleri (roasted potatoes)"],
    serving: "ceramic serving plate, juicy meatballs arranged with charred colorful vegetables"
  },
  "tas-kebabi-500": {
    ingredients: ["kuşbaşı dana eti (tender cubed braised beef - large portion)", "soğan (onion)", "sarımsak (garlic)", "domates salçası (tomato paste)", "et suyu (savory meat jus)"],
    serving: "generous earthenware bowl, tender glossy beef cubes in rich brown-red gravy"
  },
  "tas-kebabi-350": {
    ingredients: ["kuşbaşı dana eti (tender cubed braised beef)", "soğan (onion)", "sarımsak (garlic)", "domates salçası (tomato paste)", "et suyu (savory meat jus)"],
    serving: "deep ceramic bowl, tender glossy beef cubes in rich brown-red gravy"
  },
  "tavuk-haslama": {
    ingredients: ["tavuk baget ve but (tender bone-in poached chicken)", "bütün patates ve havuç (tender whole potatoes and carrots)", "limonlu tavuk suyu (aromatic clear chicken broth)"],
    serving: "deep soup bowl, steaming comforting chicken broth with whole tender root vegetables"
  },
  "tavuk-sote": {
    ingredients: ["tavuk göğsü küpleri (diced chicken breast)", "yeşil biber (green peppers)", "kırmızı kapya biber (red bell pepper)", "soğan (onion)", "domates (fresh tomatoes)", "kekik (oregano)", "zeytinyağı (olive oil)"],
    serving: "shallow rustic bowl, colorful sautéed chicken and peppers in light tomato juices"
  },
  "taze-fasulye": {
    ingredients: ["taze yeşil fasulye (fresh green flat beans)", "domates (grated ripe tomatoes)", "soğan (sliced sweet onions)", "sızma zeytinyağı (extra virgin olive oil)"],
    serving: "white ceramic plate, glossy green braised beans with tender braised onions and tomatoes"
  },
  "turlu": {
    ingredients: ["patlıcan (eggplant)", "kabak (zucchini)", "taze fasulye (green beans)", "patates (potatoes)", "domates ve biber (tomatoes and peppers)", "zeytinyağı (olive oil)"],
    serving: "earthenware clay bowl, colorful medley of braised seasonal summer vegetables"
  },

  // Çorbalar
  "ezogelin": {
    ingredients: ["kırmızı mercimek (red lentils)", "bulgur (cracked wheat)", "pirinç (rice)", "nane (dried mint flakes)", "domates salçası (tomato paste)", "pul biber (red pepper flakes)"],
    serving: "soup bowl, textured rustic reddish soup with specks of dried mint"
  },
  "mercimek": {
    ingredients: ["kırmızı mercimek (red lentils)", "havuç (carrot)", "soğan (onion)", "tereyağı (melted butter)", "kimyon (ground cumin)"],
    serving: "deep soup bowl, smooth velvety golden-yellow soup"
  },
  "sebze-corbasi": {
    ingredients: ["havuç (carrots)", "kabak (zucchini)", "patates (potatoes)", "kereviz (celery)", "sebze suyu (clear aromatic vegetable broth)", "zeytinyağı (olive oil)"],
    serving: "white ceramic bowl, finely diced tender garden vegetables in steaming aromatic broth"
  },
  "tavuk-suyu": {
    ingredients: ["didilmiş tavuk eti (shredded tender chicken)", "tavuk kemik suyu (rich golden chicken broth)", "şehriye (fine vermicelli pasta)", "karabiber ve maydanoz (black pepper and parsley)"],
    serving: "deep soup bowl, clear steaming chicken soup with fine noodles and tender chicken shreds"
  },
  "yayla-corbasi": {
    ingredients: ["yoğurt (thick Turkish yogurt)", "pirinç (rice grains)", "nane ile kızdırılmış tereyağı (sizzling mint-infused butter)", "yumurta terbiyesi (egg yolk liaison)"],
    serving: "ceramic bowl, creamy white yogurt soup swirled with bright green dried mint butter"
  },

  // Salatalar
  "cacik": {
    ingredients: ["süzme yoğurt (thick chilled yogurt)", "salatalık (finely diced fresh cucumbers)", "sarımsak (minced garlic)", "kuru nane (dried mint)", "sızma zeytinyağı (extra virgin olive oil drizzle)"],
    serving: "white ceramic bowl, creamy cool yogurt garnished with fresh olive oil swirl and mint flakes"
  },
  "coban-salata": {
    ingredients: ["domates (diced ripe red tomatoes)", "salatalık (crisp diced cucumbers)", "sivri biber (green peppers)", "kırmızı soğan (thinly sliced red onions)", "maydanoz (fresh parsley)", "sızma zeytinyağı ve limon (extra virgin olive oil and lemon)"],
    serving: "white ceramic bowl, freshly tossed vibrant diced vegetables glistening with olive oil"
  },
  "havuc-tarator": {
    ingredients: ["rendelenmiş sotelenmiş havuç (grated sautéed sweet carrots)", "süzme sarımsaklı yoğurt (thick garlic yogurt)", "ceviz içi (crushed walnuts)", "sızma zeytinyağı (olive oil)"],
    serving: "shallow porcelain dish, bright orange carrot and yogurt spread topped with walnut halves"
  },
  "mevsim-salatasi": {
    ingredients: ["kıvırcık marul (crisp lettuce leaves)", "kırmızı lahana (shredded purple cabbage)", "rendelenmiş havuç (grated carrots)", "limon ve zeytinyağı (lemon and olive oil)"],
    serving: "ceramic bowl, vibrant tri-color fresh crisp garden salad"
  },
  "semizotu": {
    ingredients: ["taze semizotu yaprakları (crisp fresh purslane leaves)", "sarımsaklı süzme yoğurt (thick garlic yogurt)", "sızma zeytinyağı (extra virgin olive oil drizzle)", "pul biber (paprika flakes)"],
    serving: "white ceramic plate, tender green purslane leaves folded in chilled thick yogurt with red pepper oil swirl"
  },

  // Yan Ürünler & Pilavlar
  "bulgur": {
    ingredients: ["iri pilavlık bulgur (coarse durum wheat bulgur)", "domates salçası (tomato paste)", "soğan (sautéed onions)", "biber (green peppers)", "tereyağı (butter)"],
    serving: "shallow ceramic bowl, plump reddish-golden spiced bulgur grains"
  },
  "makarna": {
    ingredients: ["makarna (al dente penne pasta)", "hafif domates sosu veya tereyağı (light tomato reduction or butter glaze)", "taze maydanoz (parsley)"],
    serving: "white pasta bowl, steaming pasta coated in light savory butter glaze"
  },
  "pilavustu-kuru": {
    ingredients: ["tereyağlı pirinç pilavı (buttery steamed rice)", "İspir kuru fasulyesi (rich red white bean stew layered over rice)", "tereyağı (melted butter)"],
    serving: "classic Turkish dish, fluffy white rice crowned with savory red white bean stew"
  },
  "pirinc-pilavi": {
    ingredients: ["baldo pirinç (plump Baldo rice)", "arpa şehriye (toasted golden orzo vermicelli)", "tereyağı (butter)", "tavuk suyu (clear broth)"],
    serving: "shallow bowl, pristine fluffy white rice with toasted golden orzo grains"
  },
  "yogurt": {
    ingredients: ["kaymaklı tava yoğurdu (traditional thick set Turkish yogurt with creamy top layer)"],
    serving: "earthenware bowl, thick creamy white set yogurt with pristine texture"
  },

  // Pideler
  "karisik-pide": {
    ingredients: ["taş fırın pide hamuru (crisp boat crust)", "kıyma (seasoned minced beef)", "kuşbaşı et (cubed beef)", "kaşar peyniri (melted kashar cheese)", "sucuk (Turkish beef garlic sausage)"],
    serving: "wooden serving board, sliced long boat flatbread with variety of savory toppings"
  },
  "kasarli-pide": {
    ingredients: ["taş fırın pide hamuru (crisp boat crust)", "bol taze kaşar peyniri (generous melted golden bubbly kashar cheese)", "tereyağı (brushed butter on crust)"],
    serving: "wooden presentation board, sliced crispy pide with gooey golden bubbly cheese"
  },
  "kavurmali-kasarli": {
    ingredients: ["taş fırın pide hamuru (crisp boat crust)", "dana kavurma (rich braised caramelized beef)", "erimiş kaşar peyniri (melted kashar cheese)"],
    serving: "wooden board, sliced boat pide with sizzling rich beef kavurma chunks and melted cheese"
  },
  "kavurmali-pide": {
    ingredients: ["taş fırın pide hamuru (crisp boat crust)", "dana kavurma (rich caramelized braised beef chunks)", "tereyağı (butter glaze)"],
    serving: "wooden paddle board, wood-fired pide topped generously with savory meat chunks"
  },
  "kiymali-kasarli": {
    ingredients: ["taş fırın pide hamuru (crisp golden boat crust)", "baharatlı dana kıyma (seasoned minced beef)", "erimiş kaşar peyniri (melted golden kashar cheese)"],
    serving: "wooden presentation board, freshly baked sliced Turkish boat pide with bubbling cheese and meat"
  },
  "kiymali-pide": {
    ingredients: ["taş fırın pide hamuru (crisp boat crust)", "baharatlı dana kıyma (seasoned minced beef with onions and tomatoes)", "tereyağı (brushed butter)"],
    serving: "wooden board, traditional long boat-shaped minced meat pide sliced into neat sections"
  },
  "koy-peynirli-pide": {
    ingredients: ["taş fırın pide hamuru (crisp boat crust)", "geleneksel köy peyniri (crumbly village white cheese)", "maydanoz ve tereyağı (fresh parsley and butter)"],
    serving: "wooden board, golden crisp pide with browned artisan farm cheese and parsley"
  },
  "kusbasili-kasarli": {
    ingredients: ["taş fırın pide hamuru (crisp boat crust)", "marine kuşbaşı dana eti (tender marinated cubed beef)", "erimiş kaşar peyniri (melted kashar cheese)", "domates ve biber (tomato and pepper)"],
    serving: "wooden board, oven-hot sliced Turkish boat pide with bubbling cheese and charred beef pieces"
  },
  "kusbasili-pide": {
    ingredients: ["taş fırın pide hamuru (crisp boat crust)", "kuşbaşı dana eti (tender diced beef)", "domates ve yeşil biber (diced tomatoes and green peppers)", "kekik (oregano)"],
    serving: "wooden paddle, sliced boat pide with seared beef morsels and colorful peppers"
  },
  "pastirmali-kasarli": {
    ingredients: ["taş fırın pide hamuru (crisp boat crust)", "Çemenli dana pastırma (cured spiced beef pastrami slices)", "erimiş kaşar peyniri (melted kashar cheese)"],
    serving: "wooden presentation board, sliced pide with fragrant cured pastırma and melted cheese"
  },
  "pastirmali-pide": {
    ingredients: ["taş fırın pide hamuru (crisp boat crust)", "dilimlenmiş dana pastırma (thinly sliced spiced cured pastrami)", "tereyağı (butter glaze)"],
    serving: "wooden board, crisp stone-baked pide topped with dark red savory pastrami slices"
  },
  "sosisli-pide": {
    ingredients: ["taş fırın pide hamuru (crisp boat crust)", "dilimlenmiş sosis (sliced Turkish cocktail sausages)", "kaşar peyniri (melted cheese)"],
    serving: "wooden board, sliced flatbread with browned sausage rounds and cheese"
  },
  "sucuklu-kasarli": {
    ingredients: ["taş fırın pide hamuru (crisp boat crust)", "dilimlenmiş baharatlı kasap sucuk (spicy beef garlic sausage rounds)", "erimiş kaşar peyniri (melted kashar cheese)"],
    serving: "wooden board, freshly baked pide with charred sizzling sucuk slices and gooey cheese"
  },
  "sucuklu-pide": {
    ingredients: ["taş fırın pide hamuru (crisp boat crust)", "dilimlenmiş dana sucuk (sliced spicy garlic beef sausage)", "hafif tereyağı (butter on crust)"],
    serving: "wooden board, crisp boat flatbread with aromatic browned sausage slices"
  },
  "tavuklu-pide": {
    ingredients: ["taş fırın pide hamuru (crisp boat crust)", "marine tavuk göğsü parçaları (marinated chicken breast pieces)", "kaşar peyniri (melted kashar cheese)", "biber (peppers)"],
    serving: "wooden board, sliced pide with tender roasted chicken bites and golden cheese"
  },
  "trabzon-peynirli": {
    ingredients: ["taş fırın pide hamuru (crisp oval crust)", "Trabzon kolot peyniri (stretchy artisan Black Sea cheese)", "taze tereyağı (farm butter pooled in center)"],
    serving: "round wooden paddle, open oval pide with bubbling deep-melted stringy artisan cheese"
  },

  // Tatlılar
  "firinda-sutlac": {
    ingredients: ["süt (fresh whole milk)", "pirinç (rice)", "şeker (sugar)", "vanilya (vanilla)", "nişasta (starch)"],
    serving: "traditional circular clay güveç dish, creamy white pudding with caramelized golden-brown charred top surface"
  },
  "kadayif": {
    ingredients: ["tel kadayıf (shredded filo pastry threads)", "bol ceviz içi (generous crushed walnuts)", "tereyağı (clarified butter)", "şerbet (lemon-infused sugar syrup)"],
    serving: "square ceramic dessert plate, golden crisp shredded pastry square with walnut filling and glossy syrup"
  },
  "kibris-tatlisi": {
    ingredients: ["galeta unu ve cevizli kek tabanı (walnut and breadcrumb sponge base)", "sütlü krema muhallebi (silky milk pudding topping)", "hindistan cevizi rendesi (shredded coconut)"],
    serving: "dessert plate, layered slice of moist walnut cake topped with pristine white cream and coconut"
  },
  "sekerpare": {
    ingredients: ["irmikli hamur (golden baked semolina pastry cakes)", "şerbet (lemon-infused sugar syrup)", "fındık veya badem (whole blanched almond pressed in center)"],
    serving: "dessert dish, two plump glossy syrup-soaked golden semolina cakes"
  },
  "tatli": {
    ingredients: ["geleneksel şerbetli tatlı (chef's daily fresh artisan Turkish dessert)"],
    serving: "dessert plate, glistening golden Turkish pastry portion"
  },

  // İçecekler
  "ayran": {
    ingredients: ["taze süzme yoğurt (whisked Turkish yogurt)", "su (purified water)", "kaya tuzu (pinch of salt)"],
    serving: "traditional hammered copper mug (bakır maşrapa) with thick frothy bubbly white foam on top"
  },
  "bitki-caylari": {
    ingredients: ["ıhlamur ve adaçayı (brewed herbal linden and sage leaves)", "limon dilimi (fresh lemon slice)"],
    serving: "clear glass mug, steaming golden amber herbal tea"
  },
  "cola": {
    ingredients: ["Coca-Cola (chilled cola with ice cubes)"],
    serving: "tall clear glass with ice cubes and condensation beads"
  },
  "cay": {
    ingredients: ["Rize siyah çayı (traditional double-steeped Turkish black tea)"],
    serving: "classic curved thin-waist glass (ince belli çay bardağı) with deep ruby-red color (tavşan kanı) on a small porcelain saucer"
  },
  "fanta": {
    ingredients: ["Fanta (chilled orange soda)"],
    serving: "clear glass with ice and bright orange bubbly soda"
  },
  "meyve-sulari": {
    ingredients: ["taze vişne veya şeftali suyu (pure sour cherry or peach nectar)"],
    serving: "chilled drinking glass with rich deep colorful nectar"
  },
  "nescafe": {
    ingredients: ["sıcak kahve (hot brewed coffee with milk or crema)"],
    serving: "ceramic coffee mug with warm creamy foam"
  },
  "soda": {
    ingredients: ["doğal maden suyu (chilled sparkling mineral water with lemon slice)"],
    serving: "glass tumbler with effervescent fine bubbles and fresh lemon"
  },
  "su": {
    ingredients: ["doğal kaynak suyu (pure chilled spring water)"],
    serving: "crystal clear glass of water with crisp condensation"
  },
  "turk-kahvesi": {
    ingredients: ["taze çekilmiş Türk kahvesi (finely ground roasted coffee)", "su (water)", "bol köpük (thick velvety crema)"],
    serving: "traditional patterned porcelain fincan cup with dense dark crema, served with a small glass of water"
  },

  // Az Menü (Yarım Porsiyon)
  "az-corba": {
    ingredients: ["yarım porsiyon süzme mercimek çorbası (half portion smooth red lentil soup)", "tereyağı (butter)"],
    serving: "smaller petite ceramic soup bowl"
  },
  "az-dolma": {
    ingredients: ["biber dolması (single petite stuffed pepper)", "dana kıymalı pirinç harcı (meat and rice filling)"],
    serving: "small white plate, single tender stuffed pepper"
  },
  "az-et-yemegi": {
    ingredients: ["yarım porsiyon taş kebabı (half portion tender braised beef)", "et suyu (meat jus)"],
    serving: "petite ceramic bowl, tender glossy beef cubes"
  },
  "az-kofte": {
    ingredients: ["iki adet İzmir köfte (two spiced meatballs)", "patates ve domates sosu (potatoes and tomato sauce)"],
    serving: "small casserole dish, two meatballs and roasted potato wedge"
  },
  "az-kuru": {
    ingredients: ["yarım porsiyon İspir kuru fasulyesi (half portion white bean stew)", "tereyağlı salça sosu (buttery sauce)"],
    serving: "petite shallow bowl, white beans in rich red broth"
  },
  "az-pilav": {
    ingredients: ["yarım porsiyon tereyağlı pirinç pilavı (half portion fluffy rice with orzo)"],
    serving: "small porcelain bowl, fluffy white rice"
  },
  "az-sebze-yemegi": {
    ingredients: ["yarım porsiyon zeytinyağlı taze fasulye (half portion braised green flat beans)"],
    serving: "small white plate, glossy green beans in tomato sauce"
  },
  "az-sehriye": {
    ingredients: ["arpa şehriye pilavı (toasted orzo pasta pilaf in butter)"],
    serving: "petite ceramic dish, golden toasted orzo"
  },
  "az-tavuk": {
    ingredients: ["yarım porsiyon tavuk sote (half portion sautéed chicken and peppers)"],
    serving: "small rustic bowl, chicken breast cubes and peppers"
  }
};

const POS_DATA_CATEGORIES = [
  {
    slug: "ana-yemekler",
    name: "Ana Yemekler",
    products: [
      { slug: "asci-tabagi", name: "Aşçı tabağı" },
      { slug: "baget-firin", name: "Baget fırın" },
      { slug: "biber-dolmasi", name: "Biber dolması" },
      { slug: "ciftlik-kebabi", name: "Çiftlik kebabı" },
      { slug: "eksili-kofte", name: "Ekşili köfte" },
      { slug: "elbasan", name: "Elbasan" },
      { slug: "et-sote", name: "Et sote" },
      { slug: "etli-nohut", name: "Etli nohut" },
      { slug: "firinda-tavuk", name: "Fırında tavuk" },
      { slug: "gunun-menu", name: "Günün menü" },
      { slug: "gunun-menu-2", name: "Günün menü 2" },
      { slug: "guvec", name: "Güveç" },
      { slug: "ispanak", name: "Ispanak" },
      { slug: "izmir-kofte", name: "İzmir köfte" },
      { slug: "kara-lahana-dolmasi", name: "Kara lahana dolması" },
      { slug: "karniyarik", name: "Karnıyarık" },
      { slug: "kavurma", name: "Kavurma" },
      { slug: "kayseri-mantisi", name: "Kayseri mantısı" },
      { slug: "kori-mantarli-tavuk", name: "Köri mantarlı tavuk" },
      { slug: "krema-kori-tavuk", name: "Krema köri tavuk" },
      { slug: "kuru-fasulye", name: "Kuru fasulye" },
      { slug: "kuzu-incik", name: "Kuzu incik" },
      { slug: "mantar-tavuk-sote", name: "Mantar tavuk sote" },
      { slug: "mix-tabak-2", name: "Mix tabak 2" },
      { slug: "musakka", name: "Musakka" },
      { slug: "pirasa", name: "Pırasa" },
      { slug: "sebzeli-kofte", name: "Sebzeli köfte" },
      { slug: "tas-kebabi-500", name: "Taş kebabı (Büyük)" },
      { slug: "tas-kebabi-350", name: "Taş kebabı" },
      { slug: "tavuk-haslama", name: "Tavuk haşlama" },
      { slug: "tavuk-sote", name: "Tavuk sote" },
      { slug: "taze-fasulye", name: "Taze fasulye" },
      { slug: "turlu", name: "Türlü" }
    ]
  },
  {
    slug: "corbalar",
    name: "Çorbalar",
    products: [
      { slug: "ezogelin", name: "Ezogelin çorbası" },
      { slug: "mercimek", name: "Mercimek çorbası" },
      { slug: "sebze-corbasi", name: "Sebze çorbası" },
      { slug: "tavuk-suyu", name: "Tavuk suyu çorbası" },
      { slug: "yayla-corbasi", name: "Yayla çorbası" }
    ]
  },
  {
    slug: "salatalar",
    name: "Salatalar",
    products: [
      { slug: "cacik", name: "Cacık" },
      { slug: "coban-salata", name: "Çoban salata" },
      { slug: "havuc-tarator", name: "Havuç tarator" },
      { slug: "mevsim-salatasi", name: "Mevsim salatası" },
      { slug: "semizotu", name: "Semizotu salatası" }
    ]
  },
  {
    slug: "yan-urunler",
    name: "Yan Ürünler & Pilavlar",
    products: [
      { slug: "bulgur", name: "Bulgur pilavı" },
      { slug: "makarna", name: "Makarna" },
      { slug: "pilavustu-kuru", name: "Pilavüstü kuru fasulye" },
      { slug: "pirinc-pilavi", name: "Pirinç pilavı" },
      { slug: "yogurt", name: "Yoğurt" }
    ]
  },
  {
    slug: "pideler",
    name: "Taş Fırın Pideler",
    products: [
      { slug: "karisik-pide", name: "Karışık pide" },
      { slug: "kasarli-pide", name: "Kaşarlı pide" },
      { slug: "kavurmali-kasarli", name: "Kavurmalı kaşarlı pide" },
      { slug: "kavurmali-pide", name: "Kavurmalı pide" },
      { slug: "kiymali-kasarli", name: "Kıymalı kaşarlı pide" },
      { slug: "kiymali-pide", name: "Kıymalı pide" },
      { slug: "koy-peynirli-pide", name: "Köy peynirli pide" },
      { slug: "kusbasili-kasarli", name: "Kuşbaşılı kaşarlı pide" },
      { slug: "kusbasili-pide", name: "Kuşbaşılı pide" },
      { slug: "pastirmali-kasarli", name: "Pastırmalı kaşarlı pide" },
      { slug: "pastirmali-pide", name: "Pastırmalı pide" },
      { slug: "sosisli-pide", name: "Sosisli pide" },
      { slug: "sucuklu-kasarli", name: "Sucuklu kaşarlı pide" },
      { slug: "sucuklu-pide", name: "Sucuklu pide" },
      { slug: "tavuklu-pide", name: "Tavuklu pide" },
      { slug: "trabzon-peynirli", name: "Trabzon peynirli pide" }
    ]
  },
  {
    slug: "tatlilar",
    name: "Tatlı Çeşitleri",
    products: [
      { slug: "firinda-sutlac", name: "Fırında sütlaç" },
      { slug: "kadayif", name: "Kadayıf" },
      { slug: "kibris-tatlisi", name: "Kıbrıs tatlısı" },
      { slug: "sekerpare", name: "Şekerpare" },
      { slug: "tatli", name: "Günün tatlısı" }
    ]
  },
  {
    slug: "icecekler",
    name: "Sıcak & Soğuk İçecekler",
    products: [
      { slug: "ayran", name: "Ayran" },
      { slug: "bitki-caylari", name: "Bitki çayları" },
      { slug: "cola", name: "Coca-Cola" },
      { slug: "cay", name: "Demleme Çay" },
      { slug: "fanta", name: "Fanta" },
      { slug: "meyve-sulari", name: "Meyve suları" },
      { slug: "nescafe", name: "Nescafe" },
      { slug: "soda", name: "Maden suyu / Soda" },
      { slug: "su", name: "Su" },
      { slug: "turk-kahvesi", name: "Türk kahvesi" }
    ]
  },
  {
    slug: "az-menu",
    name: "Az Menü (Yarım Porsiyon)",
    products: [
      { slug: "az-corba", name: "Az çorba" },
      { slug: "az-dolma", name: "Az dolma" },
      { slug: "az-et-yemegi", name: "Az et yemeği" },
      { slug: "az-kofte", name: "Az köfte" },
      { slug: "az-kuru", name: "Az kuru fasulye" },
      { slug: "az-pilav", name: "Az pilav" },
      { slug: "az-sebze-yemegi", name: "Az sebze yemeği" },
      { slug: "az-sehriye", name: "Az şehriye" },
      { slug: "az-tavuk", name: "Az tavuk" }
    ]
  }
];

const allProducts = [];
for (const cat of POS_DATA_CATEGORIES) {
  for (const prod of cat.products) {
    const details = INGREDIENTS_MAP[prod.slug] || {
      ingredients: ["taze malzemeler (fresh authentic Turkish ingredients)"],
      serving: "traditional Turkish presentation plate"
    };
    allProducts.push({
      slug: prod.slug,
      name: prod.name,
      category: cat.name,
      ingredients: details.ingredients,
      serving: details.serving
    });
  }
}

const outputPath = path.resolve(process.cwd(), "data/products.json");
fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2), "utf-8");
console.log(`Successfully compiled all ${allProducts.length} verified products into data/products.json!`);
