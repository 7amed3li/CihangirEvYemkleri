/**
 * Centralized Restaurant Configuration for Cihangir Ev Yemekleri & Pide
 * Single Source of Truth for contact information, hours, location, and verified operational details.
 *
 * NOTE FOR RESTAURANT OWNER / ADMIN:
 * - Phone (+90 212 251 36 96) is the verified landline number.
 * - If you have a dedicated mobile WhatsApp business number, update `whatsAppMobileNumber` below.
 */

export interface RestaurantConfig {
  name: string;
  tagline: string;
  cuisine: string;
  address: {
    street: string;
    neighborhood: string;
    district: string;
    city: string;
    postalCode: string;
    country: string;
    fullText: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    googleMapsEmbedUrl: string;
    googleMapsDirectionsUrl: string;
  };
  phone: {
    display: string;
    tel: string;
  };
  whatsapp: {
    isConfirmedMobile: boolean;
    number: string; // If mobile WhatsApp is confirmed, place here (e.g. "905XXXXXXXXX")
    display: string;
    notes: string;
  };
  hours: {
    openTime: string;
    closeTime: string;
    display: string;
    days: string;
  };
  delivery: {
    pickupAvailable: boolean;
    localDeliveryAvailable: boolean;
    dineInAvailable: boolean;
    callToConfirmDelivery: boolean;
    serviceAreas: string[];
    notice: string;
  };
  allergens: {
    sharedKitchenWarning: boolean;
    statement: string;
  };
  social: {
    instagram?: string; // TODO: Admin to add verified handle
    facebook?: string;
  };
  website: string;
}

export const RESTAURANT_CONFIG: RestaurantConfig = {
  name: "Cihangir Ev Yemekleri & Pide",
  tagline: "Geleneksel Ev Yemekleri & Pide",
  cuisine: "Traditional Turkish Home Cooking & Pide",
  website: "https://www.cihangirevyemekler.com.tr",
  address: {
    street: "Yeni Yuva Sk. no:50A",
    neighborhood: "Cihangir",
    district: "Beyoğlu",
    city: "İstanbul",
    postalCode: "34433",
    country: "Türkiye",
    fullText: "Cihangir, Yeni Yuva Sk. no:50A, 34433 Beyoğlu/İstanbul",
    coordinates: {
      latitude: 41.0316557,
      longitude: 28.9830629,
    },
    googleMapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.8437998399587!2d28.9830629!3d41.0316557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab70055f09e5d%3A0xadf8e3693f45bf6e!2sCihangir%20Ev%20Yemekleri%20Pide!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str",
    googleMapsDirectionsUrl:
      "https://maps.app.goo.gl/AwAhkhwyL2DzQ97q8",
  },
  phone: {
    display: "+90 (212) 251 36 96",
    tel: "+902122513696",
  },
  whatsapp: {
    // 0212 is a landline. We default to false and clearly document this for the admin.
    isConfirmedMobile: false,
    number: "902122513696",
    display: "+90 212 251 36 96",
    notes:
      "Sabit hat numarasıdır. WhatsApp sipariş hattı işletme tarafından ayrıca belirlendiğinde güncellenmelidir.",
  },
  hours: {
    openTime: "08:30",
    closeTime: "22:30",
    display: "Her gün: 08:30 - 22:30",
    days: "Pazartesi - Pazar",
  },
  delivery: {
    pickupAvailable: true,
    localDeliveryAvailable: false,
    dineInAvailable: true,
    callToConfirmDelivery: false,
    serviceAreas: ["Cihangir"],
    notice:
      "Restoranımızda masada yemek (Dine-in) ve doğrudan gel-al (Takeaway / Paket yaptırma) hizmeti verilmektedir. Kurye ile adrese paket servisimiz bulunmamaktadır.",
  },
  allergens: {
    sharedKitchenWarning: true,
    statement:
      "Mutfak alanımızda un (glüten), süt ürünleri, yumurta, kuruyemiş ve susam içeren ürünler aynı ortamda hazırlanmaktadır. İleri derecede alerjisi olan misafirlerimizin sipariş öncesi doğrudan personelimizle iletişime geçmesini rica ederiz.",
  },
  social: {
    // TODO: Gerçek sosyal medya hesapları işletme sahibi tarafından sağlanınca buraya eklenecektir.
  },
};
