/**
 * ════════════════════════════════════════════════════
 *  business config — عدّل بيانات العميل هنا فقط
 * ════════════════════════════════════════════════════
 *  بعد التعديل، كل الموقع (أزرار واتساب، الفوتر، النموذج)
 *  يتحدّث تلقائياً.
 */
export const BUSINESS = {
  // رقم واتساب بصيغة دولية بدون + أو مسافات (مثال: 9715XXXXXXXX)
  whatsapp: "971507343330",
  phoneDisplay: "+971 50 734 3330",
  location: "Dubai, UAE",
  locationAr: "دبي، الإمارات",
  hours: "Sat–Thu 10:00–20:00",
  instagram: "abdulkareemauto",              // بدون @
  // رسالة واتساب الجاهزة عند الضغط على أي زر حجز
  waMessage: "مرحباً، أود الاستفسار عن خدمات تخصيص مصابيح السيارات",
};

// رابط واتساب جاهز مع الرسالة
export const waLink = () =>
  `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(BUSINESS.waMessage)}`;
