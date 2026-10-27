# Cihangir — Sofra Experience

واجهة مطعم تفاعلية مبنية باستخدام Next.js وReact وTypeScript. صور الأطباق المستخدمة في واجهة القائمة موجودة محلياً تحت `public/art/source/`.

## المتطلبات

- Node.js 20 أو أحدث
- pnpm 11

## التشغيل محلياً

```bash
pnpm install --frozen-lockfile
pnpm dev
```

ثم افتح `http://localhost:3000`.

## بناء الإنتاج

```bash
pnpm build
pnpm start
```

لا يحتوي المشروع على `node_modules` أو مخرجات البناء؛ تُنشأ عند التثبيت والبناء.
