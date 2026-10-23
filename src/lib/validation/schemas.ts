import { z } from "zod";

// Helper for decimal prices >= 0
const priceSchema = z
  .union([z.number(), z.string()])
  .transform((val) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    return Math.round(num * 100) / 100;
  })
  .pipe(
    z
      .number({ error: "Fiyat geçerli bir sayı olmalıdır." })
      .min(0, "Fiyat 0 veya daha büyük olmalıdır (Negatif fiyat kabul edilmez).")
  );

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
});

export const setupSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır."),
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
});

export const productSchema = z.object({
  name: z.string().min(2, "Ürün adı en az 2 karakter olmalıdır."),
  description: z.string().optional().nullable(),
  name_en: z.string().optional().nullable(),
  name_ar: z.string().optional().nullable(),
  categoryId: z.string().min(1, "Kategori seçilmelidir."),
  slug: z
    .string()
    .min(2, "Slug en az 2 karakter olmalıdır.")
    .regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir."),
  basePriceTRY: priceSchema,
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  orderIndex: z.coerce.number().int().default(0),
  priceChangeReason: z.string().optional().nullable(),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Kategori adı en az 2 karakter olmalıdır."),
  description: z.string().optional().nullable(),
  name_en: z.string().optional().nullable(),
  name_ar: z.string().optional().nullable(),
  slug: z
    .string()
    .min(2, "Slug en az 2 karakter olmalıdır.")
    .regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir."),
  orderIndex: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const dailyMenuSchema = z.object({
  dateString: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Tarih YYYY-MM-DD formatında olmalıdır."),
  notes: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
  productIds: z
    .array(z.string().min(1))
    .default([]),
});

export const offerItemSchema = z.object({
  productId: z.string().min(1, "Ürün seçilmelidir."),
  quantity: z
    .coerce
    .number()
    .int("Adet tam sayı olmalıdır.")
    .min(1, "Adet en az 1 olmalıdır."),
});

export const offerSchema = z.object({
  title: z.string().min(2, "Fırsat başlığı en az 2 karakter olmalıdır."),
  description: z.string().optional().nullable(),
  title_en: z.string().optional().nullable(),
  title_ar: z.string().optional().nullable(),
  slug: z
    .string()
    .min(2, "Slug en az 2 karakter olmalıdır.")
    .regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir."),
  sellingPrice: priceSchema,
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  validFrom: z.string().optional().nullable(),
  validUntil: z.string().optional().nullable(),
  orderIndex: z.coerce.number().int().default(0),
  items: z
    .array(offerItemSchema)
    .min(1, "Fırsat menüsüne en az bir ürün eklenmelidir."),
});

export const adminUserCreateSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır."),
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
  role: z.enum(["OWNER", "MANAGER", "EDITOR", "VIEWER"]),
});

export const adminUserUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional().nullable(),
  role: z.enum(["OWNER", "MANAGER", "EDITOR", "VIEWER"]).optional(),
  isActive: z.boolean().optional(),
});
