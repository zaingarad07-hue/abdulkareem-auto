# عبد الكريم أوتو · Abdulkareem Auto

موقع تعريفي سينمائي لتخصيص مصابيح السيارات — مبني بـ React + Vite + Tailwind + Framer Motion.

---

## ✏️ تعديل بيانات العميل (مهم)

كل البيانات في ملف واحد: **`src/config.ts`**

```ts
whatsapp: "971500000000",   // ← ضع رقم العميل الحقيقي هنا (بدون + أو مسافات)
phoneDisplay: "+971 50 000 0000",
location: "Dubai, UAE",
instagram: "abdulkareemauto",
```

غيّر الرقم → كل أزرار الواتساب والنموذج تتحدّث تلقائياً.

---

## 🖥️ التشغيل محلياً

```bash
npm install
npm run dev      # يفتح على http://localhost:3000
```

## 🏗️ بناء نسخة الإنتاج

```bash
npm run build    # المخرجات في مجلد dist/
npm run preview  # لمعاينة نسخة الإنتاج
```

---

## 🚀 النشر على GitHub + Vercel

### 1) رفع على GitHub
```bash
git init
git add .
git commit -m "Abdulkareem Auto — initial site"
git branch -M main
git remote add origin https://github.com/USERNAME/abdulkareem-auto.git
git push -u origin main
```

### 2) النشر على Vercel
1. ادخل https://vercel.com وسجّل بحساب GitHub.
2. اضغط **Add New → Project** واختر المستودع.
3. Vercel يكتشف Vite تلقائياً:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. اضغط **Deploy** — خلال دقيقة يعطيك رابطاً مثل `abdulkareem-auto.vercel.app` لعرضه على العميل.

> أي `git push` بعد ذلك ينشر التحديث تلقائياً.

---

## 📁 الأصول (الصور والفيديو)

| الملف | الاستخدام |
|------|-----------|
| `public/images/hero.jpg`   | خلفية الهيرو + قسم Craft |
| `public/images/after.jpg`  | صورة "بعد" في المقارنة |
| `public/images/before.jpg` | صورة "قبل" في المقارنة |
| `public/videos/*.mp4`       | فيديوهات العرض |

لتبديل أي صورة: ضع ملفاً بنفس الاسم في نفس المجلد.

---

## 🎬 فيديو ترويجي (Remotion)

فيديو ترويجي بدقة 1080p (12 ثانية) مبني بـ [Remotion](https://remotion.dev)،
بنفس هوية الموقع (خط Orbitron + توهّج سماوي + خلفية داكنة). الكود في
`src/remotion/` والتركيبة المسجّلة اسمها `PromoVideo`.

```bash
npm run video          # يفتح Remotion Studio للمعاينة والتعديل الحيّ
npm run video:render   # يصدّر الفيديو إلى out/promo-video.mp4
npm run video:still    # يصدّر صورة ثابتة (poster) إلى out/promo-poster.png
npm run video:fonts    # يعيد توليد الخطوط المضمّنة (عند تغييرها)
```

> الخطوط (Orbitron + Tajawal) مضمّنة كـ base64 داخل `src/remotion/font-faces.ts`
> حتى يعمل التصدير بدون إنترنت. بيانات العمل (الهاتف، إنستغرام، الموقع) في
> `src/remotion/constants.ts`.

> أول تشغيل لـ `video:render` يحمّل Chrome Headless Shell تلقائياً.
