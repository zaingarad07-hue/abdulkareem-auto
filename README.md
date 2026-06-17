# عبد الكريم أوتو · Abdulkareem Auto

موقع تعريفي سينمائي + متجر إلكتروني + لوحة تحكم لتخصيص مصابيح السيارات.
مبني بـ React 19 + Vite + Tailwind + Framer Motion + Supabase.

---

## ✏️ تعديل بيانات العميل

كل البيانات في ملف واحد: **`src/config.ts`**

```ts
whatsapp: "971507343330",     // رقم واتساب العميل (بدون + أو مسافات)
phoneDisplay: "+971 50 734 3330",
location: "Dubai, UAE",
instagram: "abdulkareemauto",
```

غيّر الرقم → كل أزرار الواتساب والنموذج تتحدّث تلقائياً.

---

## 🗄️ إعداد قاعدة البيانات (Supabase)

### 1) أنشئ مشروع Supabase
1. ادخل https://supabase.com وسجّل حساباً مجانياً
2. اضغط **New Project** واختر اسم المشروع وكلمة سر قوية لقاعدة البيانات
3. اختر منطقة قريبة من دبي (Frankfurt هو الأقرب حالياً)

### 2) شغّل سكربت إنشاء الجداول
1. من القائمة الجانبية، اختر **SQL Editor** → **New query**
2. انسخ كل محتوى `supabase/migrations/0001_initial_schema.sql` والصقه
3. اضغط **RUN** (Ctrl/Cmd + Enter)

سيُنشئ هذا:
- جداول `products`, `orders`, `categories`
- 17 ماركة سيارات معرّفة مسبقاً (Mercedes, BMW, Bugatti, Range Rover, إلخ)
- Storage bucket لصور المنتجات
- Row-Level Security سياسات
- وظائف `confirm_order` و `cancel_confirmed_order` لخصم/استعادة المخزون

### 3) أنشئ حساب admin لعبد الكريم
1. من القائمة، **Authentication → Users → Add user**
2. أدخل email وكلمة سر قوية وفعّل "Auto Confirm User"

### 4) انسخ مفاتيح الـ API
من **Project Settings → API**:
- `Project URL` → ضعه في `VITE_SUPABASE_URL`
- `anon public key` → ضعه في `VITE_SUPABASE_ANON_KEY`

---

## 🖥️ التشغيل محلياً

```bash
npm install
cp .env.example .env.local      # ثم عدّل القيم
npm run dev                     # يفتح على http://localhost:3000
```

افتح:
- **`/`** — الصفحة الرئيسية
- **`/shop`** — المتجر
- **`/cart`** — السلة
- **`/admin/login`** — تسجيل دخول الإدارة
- **`/admin`** — لوحة التحكم (بعد تسجيل الدخول)

---

## 🚀 النشر على Vercel

### 1) أضف متغيرات البيئة
في إعدادات مشروع Vercel → **Settings → Environment Variables**:
- `VITE_SUPABASE_URL` = رابط مشروع Supabase
- `VITE_SUPABASE_ANON_KEY` = الـ anon key
- طبّقها على Production + Preview + Development

### 2) Redeploy
من **Deployments → … → Redeploy** بدون cache.

---

## 📋 سير العمل لعبد الكريم

### إضافة منتج جديد
1. ادخل `/admin/login` وسجّل دخول
2. **Products → Add Product**
3. أدخل الاسم بالإنجليزي والعربي، الوصف، السعر، المخزون
4. اختر **Brand** (ماركة السيارة) و **Type** (نوع المنتج: DRL/Headlights/إلخ)
5. أكتب **Compatible Models** (الموديلات المتوافقة، مثل: `S-Class 2018-2024`)
6. ارفع صورة أو أكثر (السحب والإفلات يعمل)
7. فعّل **Featured** ليظهر في الصفحة الرئيسية
8. **Create Product**

### استلام طلب جديد
1. عميل يطلب من الموقع → يصلك تنبيه على واتساب + يظهر في `/admin/orders` بحالة `PENDING`
2. تتواصل مع العميل لتأكيد التوفر والتركيب
3. في `/admin/orders` → افتح الطلب → اضغط **CONFIRMED** → تُخصم الكميات تلقائياً
4. بعد التركيب → **COMPLETED**

### إخفاء منتج مؤقتاً (بدون حذف)
في جدول المنتجات → اضغط أيقونة العين 👁️ → يصبح **HIDDEN** ولا يظهر في المتجر العام لكن يبقى في قاعدة البيانات.

---

## 📁 بنية المشروع

```
src/
├── routes/                  # صفحات الراوتر
│   ├── HomePage.tsx
│   ├── ShopPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   └── admin/
│       ├── AdminLayout.tsx
│       ├── LoginPage.tsx
│       ├── DashboardPage.tsx
│       ├── ProductsPage.tsx
│       └── OrdersPage.tsx
├── sections/                # أقسام الصفحة الرئيسية
├── components/
│   ├── shop/                # ProductCard, CartDrawer, StockBadge
│   ├── admin/               # ProductForm
│   ├── Navigation.tsx
│   └── FloatingWhatsApp.tsx
├── contexts/                # CartContext, AuthContext
├── lib/supabase.ts          # Supabase client + types
├── config.ts                # بيانات العميل
└── ...
supabase/migrations/         # سكربتات قاعدة البيانات
```

---

## 🎨 الأصول (الصور والفيديو)

| الملف | الاستخدام |
|------|-----------|
| `public/images/hero.jpg`   | خلفية الهيرو + قسم Craft |
| `public/images/after.jpg`  | صورة "بعد" في المقارنة |
| `public/images/before.jpg` | صورة "قبل" في المقارنة |
| `public/videos/*.mp4`       | فيديوهات العرض |

لتبديل أي صورة: ضع ملفاً بنفس الاسم في نفس المجلد.
