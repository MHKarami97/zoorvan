# تجربه‌نامه — Jekyll PWA Experience Sharing Platform

پروژه‌ای برای ثبت و اشتراک‌گذاری تجربه‌های واقعی مردم (کار در شرکت، خرید از فروشگاه،
سفر، تعامل با افراد خدماتی و ...)، ساخته‌شده با **Jekyll**، به‌صورت **PWA کامل** (قابل نصب،
آفلاین‌کار) و آماده هاست روی **GitHub Pages**.

---

## ۱. معماری پروژه

```
jekyll-tajrobe/
├── _config.yml            # تنظیمات اصلی سایت
├── Gemfile
├── manifest.webmanifest    # Web App Manifest — نصب PWA (طبق MDN)
├── sw.js                   # Service Worker — کش آفلاین (Network-first برای HTML)
├── offline.html            # صفحه fallback هنگام قطع اینترنت
├── search.json             # فید JSON از تمام تجربه‌ها برای جستجوی سمت کلاینت
├── search.html             # صفحه جستجو (فیلتر لحظه‌ای روی search.json)
├── tags.html               # صفحه برچسب‌ها (ابر برچسب + فیلتر خودکار)
├── _data/
│   ├── categories.yml      # منبع واحد دسته‌بندی‌ها
│   └── navigation.yml      # آیتم‌های منو (خانه، دسته‌بندی، برچسب، جستجو، ثبت، درباره)
├── _experiences/           # کالکشن Jekyll — هر فایل = یک تجربه
├── _layouts/                (default, page, experience)
├── _includes/
│   ├── head.html            # متادیتای PWA، manifest، آیکون‌ها، theme-color
│   ├── header.html          # ناوبری + دکمه «نصب اپلیکیشن»
│   ├── footer.html          # فوتر + بارگذاری pwa.js
│   └── experience-card.html # کارت تجربه با تگ‌های قابل کلیک
├── assets/
│   ├── css/main.css         # استایل کامل، PWA-safe-area، ریسپانسیو تا ۴۲۰px
│   ├── js/main.js           # منوی موبایل
│   ├── js/pwa.js            # ثبت Service Worker + مدیریت پرامپت نصب
│   ├── js/search.js         # موتور جستجوی سمت کلاینت (fetch از search.json)
│   └── images/icons/        # آیکون‌های PWA در تمام سایزهای استاندارد + ماسک‌ابل
└── README.md
```

---

## ۲. قابلیت PWA — چه اضافه شد؟

| مورد | فایل | توضیح |
|---|---|---|
| نصب روی موبایل/دسکتاپ | `manifest.webmanifest` | شامل `name`, `icons` (۹ سایز)، `display: standalone`، `start_url`، `shortcuts` |
| کار آفلاین | `sw.js` + `offline.html` | استراتژی Network-First برای صفحات HTML و Cache-First برای فایل‌های استاتیک |
| آیکون‌های استاندارد | `assets/images/icons/` | ۷۲ تا ۵۱۲ پیکسل + نسخه Maskable برای اندروید |
| نصب سفارشی | `pwa.js` | گوش‌دادن به `beforeinstallprompt` و نمایش دکمه «نصب اپلیکیشن» در هدر |
| تجربه بومی در iOS | `head.html` | متاتگ‌های `apple-mobile-web-app-*` و `apple-touch-icon` |
| رعایت Safe Area | `main.css` | `env(safe-area-inset-top/bottom)` برای گوشی‌های دارای Notch |

این پیکربندی دقیقاً معیارهای نصب PWA طبق داکیومنت رسمی `web.dev/articles/install-criteria`
را پوشش می‌دهد: HTTPS (که GitHub Pages به‌صورت پیش‌فرض فراهم می‌کند)، manifest با
`name`/`short_name`، آیکون ۱۹۲ و ۵۱۲ پیکسل، `start_url`، و `display: standalone`.
ساختار manifest نیز طبق مرجع رسمی MDN (`developer.mozilla.org/docs/Web/Progressive_web_apps/Manifest`)
نوشته شده است.

> ⚠️ نکته مهم: Service Worker فقط روی **HTTPS** یا `localhost` کار می‌کند. GitHub Pages
> به‌صورت پیش‌فرض HTTPS دارد، پس بعد از انتشار نیازی به تنظیم اضافه نیست.

---

## ۳. قابلیت‌های کمک به کاربر (دسته‌بندی، تگ، سرچ)

| قابلیت | آدرس | توضیح |
|---|---|---|
| دسته‌بندی | `/categories/` | تجربه‌ها به تفکیک ۸ دسته با ناوبری چیپ‌مانند بالای صفحه |
| برچسب‌ها | `/tags/` | ابر برچسب خودکار (Auto tag cloud) از تمام فایل‌های `_experiences`، بدون نیاز به نگهداری دستی لیست |
| جستجو | `/search/` | جستجوی لحظه‌ای (debounced) در عنوان، شهر، برچسب و نام شرکت/فرد؛ از `search.json` تغذیه می‌شود |
| جستجوی سریع در هدر | صفحه اصلی | فرم هیرو مستقیماً به `/search/?q=...` هدایت می‌شود |
| فیلتر در کارت‌ها | همه‌جا | هر کارت تجربه، حداکثر ۳ تگ قابل کلیک نشان می‌دهد که به بخش مرتبط در `/tags/` می‌رود |

`search.json` به‌صورت خودکار توسط Jekyll از روی تمام فایل‌های کالکشن `_experiences` ساخته
می‌شود؛ یعنی برای افزودن تجربه جدید کافی است فقط فایل Markdown اضافه شود و جستجو/تگ‌ها
بدون هیچ کار دستی اضافه به‌روزرسانی می‌شوند.

---

## ۴. راه‌اندازی محلی (Local Setup)

```bash
gem install bundler
cd jekyll-tajrobe
bundle install
bundle exec jekyll serve
# سایت روی http://localhost:4000 — Service Worker روی localhost هم فعال است
```

برای تست کامل PWA (نصب، آفلاین) در Chrome DevTools:
1. تب **Application → Manifest** را باز کنید تا اعتبار manifest را ببینید.
2. تب **Application → Service Workers** برای بررسی ثبت sw.js.
3. آیکون نصب (⊕) در نوار آدرس کروم باید ظاهر شود.

---

## ۵. اتصال فرم به Formspree

۱. در [formspree.io](https://formspree.io) ثبت‌نام کنید و فرم بسازید.
۲. Form ID را کپی کرده و در `_config.yml` مقدار `formspree_form_id` را جایگزین کنید.

فرم `submit.html` به‌صورت خودکار این مقدار را در `action` قرار می‌دهد. نام فیلدها فارسی و
خوانا هستند (`name="عنوان تجربه"`) تا ایمیل دریافتی مستقیماً قابل استفاده باشد
(طبق `help.formspree.io/articles/building-your-form/building-an-html-form/`).

---

## ۶. افزودن تجربه جدید (توسط مدیر سایت)

فایل Markdown جدید در `_experiences/` با این Front Matter بسازید:

```markdown
---
title: "عنوان تجربه"
category: work
location: "شهر، کشور"
author_name: "نام یا ناشناس"
company_or_person: "نام شرکت/فرد (اختیاری)"
address: "آدرس (اختیاری)"
contact: "تماس (اختیاری)"
date: 2026-07-22
rating: 4
recommend: "بله، پیشنهاد می‌کنم"
price_range: "اختیاری"
tags: [تگ۱, تگ۲]
image: /assets/images/نام-عکس.jpg
images: ["/assets/images/img1.jpg"]
videos: ["/assets/videos/clip1.mp4"]
---
متن کامل تجربه...
```

این تجربه به‌طور خودکار در صفحه اصلی، دسته‌بندی مربوطه، `/tags/`، و `/search/` ظاهر می‌شود
— بدون هیچ تغییر دیگری در کد.

---

## ۷. هاست روی GitHub Pages

```bash
git init && git add . && git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/tajrobe-nameh.git
git push -u origin main
```

سپس در **Settings → Pages** منبع را روی شاخه `main` تنظیم کنید. مقدار `url` و `baseurl`
در `_config.yml` را با آدرس واقعی خودتان هماهنگ کنید (طبق
`docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll`).

---

## ۸. نکات Performance و UI موبایل

- تمام دکمه‌ها و لینک‌های ناوبری در موبایل حداقل ۴۴px ارتفاع دارند (استاندارد Apple HIG/Material).
- Grid کارت‌ها در موبایل به ۲ ستون (و زیر ۴۲۰px به ۱ ستون) تبدیل می‌شود.
- تصاویر با `loading="lazy"` و پس‌زمینه اسکلتون (`--color-deco`) بارگذاری می‌شوند.
- CSS به `env(safe-area-inset-*)` احترام می‌گذارد تا در گوشی‌های دارای Notch/Home Indicator
  محتوا زیر نوار سیستم پنهان نشود.
- Service Worker با استراتژی Network-First روی HTML باعث می‌شود کاربر همیشه محتوای
  به‌روز ببیند، ولی در قطعی اینترنت صفحه `offline.html` یا نسخه کش‌شده نمایش داده شود.

---

## منابع

- [Jekyll Collections](https://jekyllrb.com/docs/collections/)
- [GitHub Pages + Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll)
- [Formspree HTML Forms](https://formspree.io/html/)
- [MDN — Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest)
- [web.dev — PWA Install Criteria](https://web.dev/articles/install-criteria)
- [MDN Service Worker Cookbook](https://github.com/mdn/serviceworker-cookbook)

---

نویسنده: Mohammad Hossein Karami — [mhkarami97.ir](https://mhkarami97.ir)
