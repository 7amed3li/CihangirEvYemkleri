import React from "react";
import { RESTAURANT_CONFIG } from "@/data/restaurantConfig";

export default function RestaurantJsonLd({ locale }: { locale: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: RESTAURANT_CONFIG.name,
    description:
      "Anne şefkatiyle pişen taze tencere yemekleri, fırından yeni çıkmış çıtır pideler ve Cihangir'in en samimi esnaf sofrası. Beyoğlu, İstanbul.",
    image: "https://www.cihangirevyemekler.com.tr/splash/logo-original.webp",
    url: `https://www.cihangirevyemekler.com.tr/${locale}`,
    hasMap: RESTAURANT_CONFIG.address.googleMapsDirectionsUrl,
    telephone: RESTAURANT_CONFIG.phone.tel,
    priceRange: "₺₺",
    servesCuisine: [
      "Turkish",
      "Traditional Home Cooking",
      "Pide",
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
      latitude: RESTAURANT_CONFIG.address.coordinates.latitude.toString(),
      longitude: RESTAURANT_CONFIG.address.coordinates.longitude.toString(),
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
    hasMenu: `https://www.cihangirevyemekler.com.tr/${locale}/menu`,
    acceptsReservations: "False",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
