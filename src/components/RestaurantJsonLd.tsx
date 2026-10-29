import React from "react";
import { RESTAURANT_CONFIG } from "@/data/restaurantConfig";
import { SITE_URL, localizedUrl } from "@/lib/seo";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/**
 * Restaurant entity built only from verified facts in RESTAURANT_CONFIG.
 * Intentionally omitted until confirmed by the owner: priceRange,
 * acceptsReservations, ratings/reviews, payment methods, delivery.
 */
export function buildRestaurantSchema(locale: string, description: string) {
  const c = RESTAURANT_CONFIG;
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}/#restaurant`,
    name: c.name,
    description,
    url: localizedUrl(locale),
    image: `${SITE_URL}/splash/logo-original.webp`,
    logo: `${SITE_URL}/icon-512.png`,
    telephone: c.phone.tel,
    hasMap: c.address.googleMapsDirectionsUrl,
    servesCuisine: ["Turkish", "Pide"],
    address: {
      "@type": "PostalAddress",
      streetAddress: c.address.street,
      addressLocality: c.address.district,
      addressRegion: c.address.city,
      postalCode: c.address.postalCode,
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: c.address.coordinates.latitude,
      longitude: c.address.coordinates.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: DAYS,
        opens: c.hours.openTime,
        closes: c.hours.closeTime,
      },
    ],
    hasMenu: localizedUrl(locale, "/menu"),
  };
}

export default function RestaurantJsonLd({
  locale,
  description,
}: {
  locale: string;
  description: string;
}) {
  const json = JSON.stringify(buildRestaurantSchema(locale, description)).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
