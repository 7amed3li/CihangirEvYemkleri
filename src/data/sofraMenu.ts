export type FoodMode = 'all' | 'home' | 'oven' | 'quick' | 'popular';

export type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  mode: Exclude<FoodMode, 'all'>;
  art: string;
  note: string;
};

export const modes: { id: FoodMode; label: string; tiny: string }[] = [
  { id: 'all', label: 'Kur sofrayı', tiny: 'Hepsinden' },
  { id: 'home', label: 'Ev yemeği', tiny: 'Tencereden' },
  { id: 'oven', label: 'Taş fırın', tiny: 'Fırından' },
  { id: 'quick', label: 'Hızlı bir şey', tiny: 'Pratik' },
  { id: 'popular', label: 'Çok sevilenler', tiny: 'Favoriler' },
];

export const dishes: Dish[] = [
  {
    id: 'et-sote', name: 'Et sote', description: 'Dana eti, domates ve yeşil biber. Harlı ateş, bol kekik.', price: 550,
    mode: 'home', art: '/sofra/et-sote.jpg', note: 'Tencereden yeni',
  },
  {
    id: 'karisik-pide', name: 'Karışık pide', description: 'Taş fırın hamurunda kıyma, kuşbaşı et, sucuk ve kaşar.', price: 350,
    mode: 'oven', art: '/sofra/karisik-pide.jpg', note: 'Taş fırından',
  },
  {
    id: 'kuru-fasulye', name: 'Kuru fasulye', description: 'İspir fasulyesi; salçalı tereyağlı suyunda ağır ağır.', price: 220,
    mode: 'home', art: '/sofra/kuru-fasulye.jpg', note: 'Ev usulü',
  },
  {
    id: 'asci-tabagi', name: 'Aşçı tabağı', description: 'Günün tenceresinden, pilavından; şefin içinden geldiği gibi.', price: 650,
    mode: 'popular', art: '/sofra/asci-tabagi.jpg', note: 'Şefin seçimi',
  },
  {
    id: 'gunun-menu', name: 'Günün menüsü 1', description: 'Günün et yemeği, sıcak çorba ve tereyağlı pilav.', price: 420,
    mode: 'quick', art: '/sofra/gunun-menu.jpg', note: 'Bugünlük sofra',
  },
  {
    id: 'izmir-kofte', name: 'İzmir köfte', description: 'Fırında patates, biber ve domates sosuyla.', price: 400,
    mode: 'popular', art: '/sofra/izmir-kofte.jpg', note: 'Mahallenin favorisi',
  },
];

