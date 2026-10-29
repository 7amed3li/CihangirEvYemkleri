# Complete SEO Route & Indexability Inventory
**Target Project:** Cihangir Ev Yemekleri & Pide  
**Canonical Domain:** `https://www.cihangirevyemekler.com.tr`  
**Locales (10):** `tr` (Default), `en`, `ar`, `ru`, `fa`, `fr`, `de`, `it`, `es`, `zh`  

---

## 1. Summary Statistics
- **Total Static Core Routes:** 10
- **Total Dynamic Dishes:** 88
- **Total Public Routes:** 98 routes × 10 locales = **980 indexable canonical pages**
- **Sitemap Entries:** Exactly 980 URLs (each with 11 reciprocal language alternates: 10 locales + x-default)
- **Admin/Internal Routes:** 8 pages (all marked `noindex, nofollow` and disallowed in robots.txt)

---

## 2. Core Public Route Matrix

| Route Path | Type | Indexable | Canonical URL (TR sample) | Sitemap | Hreflang Alternates |
|---|---|---|---|---|---|
| `/` | Redirect | No (307) | Resolves to `/tr` | Excluded | Points to `/tr` |
| `/[locale]` | Home Page | **Yes** | `https://www.cihangirevyemekler.com.tr/tr` | **Yes** | 10 locales + x-default |
| `/[locale]/menu` | Digital Menu | **Yes** | `https://www.cihangirevyemekler.com.tr/tr/menu` | **Yes** | 10 locales + x-default |
| `/[locale]/about` | Restaurant Story | **Yes** | `https://www.cihangirevyemekler.com.tr/tr/about` | **Yes** | 10 locales + x-default |
| `/[locale]/contact` | Location & Contact | **Yes** | `https://www.cihangirevyemekler.com.tr/tr/contact` | **Yes** | 10 locales + x-default |
| `/[locale]/delivery` | Service & Takeaway Policy | **Yes** | `https://www.cihangirevyemekler.com.tr/tr/delivery` | **Yes** | 10 locales + x-default |
| `/[locale]/allergens` | Allergen Information | **Yes** | `https://www.cihangirevyemekler.com.tr/tr/allergens` | **Yes** | 10 locales + x-default |
| `/[locale]/faq` | Frequently Asked Questions | **Yes** | `https://www.cihangirevyemekler.com.tr/tr/faq` | **Yes** | 10 locales + x-default |
| `/[locale]/terms` | Terms of Service | **Yes** | `https://www.cihangirevyemekler.com.tr/tr/terms` | **Yes** | 10 locales + x-default |
| `/[locale]/privacy` | Privacy Notice | **Yes** | `https://www.cihangirevyemekler.com.tr/tr/privacy` | **Yes** | 10 locales + x-default |
| `/[locale]/cancellation` | Cancellation & Order Policy | **Yes** | `https://www.cihangirevyemekler.com.tr/tr/cancellation` | **Yes** | 10 locales + x-default |

---

## 3. Dynamic Dish Detail Routes (88 items)
Every item below is indexed across all 10 locales with unique meta descriptions, localized Schema.org `MenuItem` JSON-LD, and reciprocal hreflang links:

`asci-tabagi`, `etli-kuru-fasulye`, `kuru-fasulye`, `tavuk-sote`, `et-sote`, `izmir-kofte`, `kadinbudu-kofte`, `karniyarik`, `musakka`, `tas-kebabi`, `hunkar-begendi`, `orman-kebabi`, `sebzeli-tavuk`, `tavuk-haslama`, `kuzu-haslama`, `pilav-ustu-et`, `pilav-ustu-tavuk`, `biber-dolma`, `yaprak-sarma`, `lahana-sarma`, `taze-fasulye`, `bezelye`, `ispanak`, `bamya`, `patlican-kebabi`, `pirasa`, `kapuska`, `enginar`, `barbunya`, `nohut`, `mercimek-corbasi`, `ezogelin-corbasi`, `tavuk-suyu-corba`, `yayla-corbasi`, `tarhana-corbasi`, `kelle-paca`, `iskembe`, `domates-corbasi`, `sebze-corbasi`, `dugun-corbasi`, `kiymali-pide`, `kasarli-pide`, `kusbasili-pide`, `karisik-pide`, `sucuklu-pide`, `kusbasili-kasarli-pide`, `kiymali-kasarli-pide`, `tavuklu-pide`, `ispanakli-pide`, `beyaz-peynirli-pide`, `vejetaryen-pide`, `lahmacun`, `kasarli-lahmacun`, `pirinc-pilavi`, `sehriyeli-pirinc-pilavi`, `bulgur-pilavi`, `patates-puresi`, `makarna`, `cacik`, `yogurt`, `coban-salata`, `mevsim-salata`, `gavurdagi-salata`, `sutlac`, `kazandibi`, `kemalpasa`, `revani`, `baklava`, `irmik-helvasi`, `sekerpare`, `trilece`, `profiterol`, `kadayif`, `turk-kahvesi`, `ayran`, `bitki-caylari`, `cola`, `cay`, `fanta`, `meyve-sulari`, `nescafe`, `soda`, `su`, `salgam`, `limonata`, `gazoz`, `taze-portakal-suyu`.

---

## 4. Non-Indexable & Disallowed Routes

| Route | Role | Robots Meta | Robots.txt Disallow |
|---|---|---|---|
| `/admin` | Administration Portal Login / Root | `noindex, nofollow` | Yes (`/admin`) |
| `/admin/login` | Admin Authentication | `noindex, nofollow` | Yes (`/admin`) |
| `/admin/setup` | First-time Setup | `noindex, nofollow` | Yes (`/admin`) |
| `/admin/categories` | Category Management | `noindex, nofollow` | Yes (`/admin`) |
| `/admin/products` | Dish & Price Manager | `noindex, nofollow` | Yes (`/admin`) |
| `/admin/daily-menu` | Daily Menu Scheduling | `noindex, nofollow` | Yes (`/admin`) |
| `/admin/offers` | Offer Management | `noindex, nofollow` | Yes (`/admin`) |
| `/admin/settings` | Restaurant System Settings | `noindex, nofollow` | Yes (`/admin`) |
| `/api/admin/*` | Private Admin API Endpoints | Blocked by API Guard | Yes (`/api/admin`) |
| `*` (404 / Invalid URL) | Global Not Found Handler | `noindex` | N/A |
