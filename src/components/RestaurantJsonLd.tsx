import React from "react";
import { RESTAURANT_CONFIG } from "@/data/restaurantConfig";

export default function RestaurantJsonLd({ locale }: { locale: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: RESTAURANT_CONFIG.name,
    description:
      "Cihangir'in kalbinde geleneksel Türk ev yemekleri ve taş fırın pide lezzetleri. Beyoğlu, İstanbul.",
    image: "https://cihangirevyemekler.com.tr/splash/logo-original.webp",
    url: `https://cihangirevyemekler.com.tr/${locale}`,
    telephone: RESTAURANT_CONFIG.phone.tel,
    priceRange: "₺₺",
    servesCuisine: [
      "Turkish",
      "Traditional Home Cooking",
      "Stone Oven Pide",
      "Ev Yemekleri",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: RESTAURANT_CONFIG.address.street,
      addressLocality: RESTAURANT_CONFIG.address.district,
      addressRegion: RESTAURANT_CONFIG.address.city,
      postalCode: RESTAURANT_CONFIG.address.postalCode,
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "41.032049",
      longitude: "28.981881",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "08:30",
        closes: "22:30",
      },
    ],
    hasMenu: `https://cihangirevyemekler.com.tr/${locale}/menu`,
    acceptsReservations: "False",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
