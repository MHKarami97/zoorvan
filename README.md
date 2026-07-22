# تجربه‌نامه — Jekyll Experience Sharing Platform

پروژه‌ای برای ثبت و اشتراک‌گذاری تجربه‌های واقعی مردم (کار در شرکت، خرید از فروشگاه،
سفر، تعامل با افراد خدماتی و ...)، ساخته‌شده با **Jekyll** و آماده هاست روی **GitHub Pages**.

---

## ۱. معماری پروژه

```
jekyll-tajrobe/
├── _config.yml           # تنظیمات اصلی سایت (عنوان، زبان، کالکشن‌ها، پلاگین‌ها)
├── Gemfile                # وابستگی‌های روبی (github-pages gem)
├── _data/
│   ├── categories.yml     # لیست دسته‌بندی‌های تجربه (منبع واحد حقیقت - Single Source of Truth)
│   └── navigation.yml     # آیتم‌های منوی اصلی
├── _experiences/          # کالکشن Jekyll — هر فایل = یک تجربه (Markdown + Front Matter)
├── _layouts/
│   ├── default.html       # لایوت پایه (header + footer + content)
│   ├── page.html          # لایوت صفحات ساده (درباره ما و ...)
│   └── experience.html    # لایوت اختصاصی نمایش تجربه (متادیتا، گالری، امتیاز)
├── _includes/
│   ├── head.html          # تگ‌های <head>, فونت، SEO
│   ├── header.html        # نوار ناوبری (ریسپانسیو با منوی موبایل)
│   ├── footer.html        # فوتر و لینک‌های دسته‌بندی
│   └── experience-card.html  # کامپوننت کارت تجربه (استفاده در چند صفحه - اصل DRY)
├── assets/
│   ├── css/main.css       # تمام استایل‌ها، مبتنی بر توکن‌های DESIGN.md (RTL + Mobile-first)
│   ├── js/main.js         # منوی موبایل + فیلتر جستجوی سمت کلاینت (Vanilla JS)
│   └── images/            # تصاویر placeholder — عکس‌های واقعی خود را جایگزین کنید
├── index.html             # صفحه اصلی (هیرو + دسته‌بندی‌ها + آخرین تجربه‌ها)
├── categories.html        # صفحه دسته‌بندی‌ها (تجربه‌ها به تفکیک هر دسته)
├── submit.html            # فرم ثبت تجربه (متصل به Formspree.io)
├── about.md               # درباره سایت
└── 404.html                # صفحه خطای ۴۰۴
```

### چرا این ساختار؟

- **Jekyll Collections** (`_experiences`) به‌جای پست‌های وبلاگی معمولی استفاده شده، چون هر
  تجربه شبیه یک "رکورد داده" با فیلدهای ثابت (لوکیشن، آدرس، امتیاز، رسانه) است، نه یک پست
  وبلاگی تاریخ‌محور صرف. این الگو دقیقاً همان چیزی است که داکیومنت رسمی Jekyll برای محتوای
  غیر پستی توصیه می‌کند (jekyllrb.com/docs/collections).
- **`_data/categories.yml`** به‌عنوان تنها منبع حقیقت (Single Source of Truth) برای
  دسته‌بندی‌ها استفاده شده تا افزودن دسته جدید فقط در یک فایل انجام شود و در همه‌جا
  (خانه، دسته‌بندی‌ها، فوتر، فرم ثبت) به‌طور خودکار به‌روزرسانی شود.
- **Front Matter Defaults** در `_config.yml` باعث می‌شود هر فایل در `_experiences` بدون
  نیاز به تکرار `layout: experience` در هر فایل، به‌طور خودکار لایوت مناسب را بگیرد.
- **کامپوننت `experience-card.html`** طبق اصل DRY در سه صفحه مختلف (خانه، دسته‌بندی‌ها،
  و به‌راحتی در صفحات آینده) استفاده می‌شود بدون تکرار HTML.

---

## ۲. راه‌اندازی محلی (Local Setup)

```bash
# نصب Ruby (در ویندوز از RubyInstaller استفاده کنید: https://rubyinstaller.org)
gem install bundler
cd jekyll-tajrobe
bundle install
bundle exec jekyll serve
# سایت روی http://localhost:4000 در دسترس است
```

---

## ۳. اتصال فرم به Formspree

۱. در [formspree.io](https://formspree.io) ثبت‌نام کنید و یک فرم جدید بسازید.
۲. Form ID خود را از بخش Integration کپی کنید (مثل `xabc1234`).
۳. در فایل `_config.yml`، مقدار `formspree_form_id` را با ID خودتان جایگزین کنید:

```yaml
formspree_form_id: "xabc1234"
```

فایل `submit.html` به‌صورت خودکار این مقدار را در `action` فرم قرار می‌دهد:
```html
action="https://formspree.io/f/{{ site.formspree_form_id }}"
```

طبق داکیومنت رسمی Formspree، هر `<input>` یا `<textarea>` که attribute `name` داشته باشد
به‌صورت خودکار در ایمیل دریافتی شما نمایش داده می‌شود — دقیقاً همین روش در فرم `submit.html`
با نام‌های فارسی فیلدها (مثل `name="عنوان تجربه"`) پیاده‌سازی شده است تا ایمیل دریافتی
خوانا باشد (help.formspree.io/articles/building-your-form/building-an-html-form).

---

## ۴. افزودن یک تجربه جدید به سایت (توسط مدیر سایت)

پس از دریافت فرم در ایمیل، یک فایل Markdown جدید در پوشه `_experiences/` بسازید:

```markdown
---
title: "عنوان تجربه"
category: work            # باید دقیقاً id یکی از دسته‌بندی‌های _data/categories.yml باشد
location: "شهر، کشور"
author_name: "نام یا ناشناس"
company_or_person: "نام شرکت/فرد (اختیاری)"
address: "آدرس دقیق (اختیاری)"
contact: "شماره تماس یا لینک (اختیاری)"
date: 2026-07-22
rating: 4                  # عدد ۱ تا ۵
recommend: "بله، پیشنهاد می‌کنم"
price_range: "محدوده قیمت (اختیاری)"
tags: [تگ۱, تگ۲]
image: /assets/images/نام-عکس.jpg
images: ["/assets/images/img1.jpg", "/assets/images/img2.jpg"]
videos: ["/assets/videos/clip1.mp4"]
---

متن کامل تجربه با فرمت Markdown اینجا نوشته می‌شود...
```

عکس‌ها و ویدیوها را در `assets/images/` یا `assets/videos/` قرار دهید. Jekyll به‌صورت
خودکار صفحه را در آدرس `/experiences/عنوان-انگلیسی-فایل/` منتشر می‌کند.

---

## ۵. هاست روی GitHub Pages

۱. یک ریپازیتوری جدید در گیت‌هاب بسازید (مثلاً `tajrobe-nameh`).
۲. محتوای این پوشه را push کنید:

```bash
git init
git add .
git commit -m "Initial commit - تجربه‌نامه"
git branch -M main
git remote add origin https://github.com/USERNAME/tajrobe-nameh.git
git push -u origin main
```

۳. در تنظیمات ریپازیتوری، بخش **Settings > Pages**، منبع را روی شاخه `main` تنظیم کنید.
۴. در `_config.yml`، مقدار `url` و `baseurl` را با آدرس واقعی گیت‌هاب‌پیجز خود هماهنگ کنید:
   - اگر ریپو نام `USERNAME.github.io` دارد → `baseurl: ""`
   - در غیر این صورت → `baseurl: "/tajrobe-nameh"`

طبق داکیومنت رسمی گیت‌هاب (docs.github.com/pages/setting-up-a-github-pages-site-with-jekyll)،
گیت‌هاب‌پیجز به‌طور پیش‌فرض Jekyll را build می‌کند، پس نیازی به build دستی یا CI جدا نیست؛
فقط باید gem `github-pages` در Gemfile باشد تا نسخه پلاگین‌ها با محیط گیت‌هاب سازگار بماند.

---

## ۶. نکات فنی و طراحی (Performance / Responsive)

- CSS و JS بدون فریم‌ورک خارجی (Vanilla) نوشته شده‌اند تا حجم صفحه کم و لود سریع بماند.
- تصاویر با `loading="lazy"` بارگذاری می‌شوند تا سرعت صفحات اولیه بهتر شود.
- طراحی Mobile-First است؛ منوی اصلی در صفحات کوچک به یک دراور تبدیل می‌شود (`main.js`).
- سیستم رنگ و تایپوگرافی از فایل `DESIGN.md` (سبک Airbnb) گرفته شده و در `main.css` به‌صورت
  CSS Custom Properties (توکن‌محور) پیاده‌سازی شده تا تغییر تم در آینده آسان باشد.
- زبان سایت فارسی و جهت RTL است (`dir="rtl"` روی `<html>` و در CSS).

---

## ۷. کارهای بعدی پیشنهادی (Roadmap)

- افزودن جستجوی واقعی با Lunr.js یا Algolia برای جستجوی سمت کلاینت پیشرفته‌تر.
- افزودن GitHub Action برای ساخت خودکار فایل تجربه از ایمیل‌های Formspree (Webhook + Zapier).
- افزودن صفحه امتیاز میانگین برای هر شرکت/فرد در صورت تکرار تجربه‌ها.

---

## منابع

- [Jekyll Collections — داکیومنت رسمی](https://jekyllrb.com/docs/collections/)
- [GitHub Pages + Jekyll — داکیومنت رسمی گیت‌هاب](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll)
- [Formspree — HTML Forms Guide](https://formspree.io/html/)
- [Formspree — Building an HTML Form](https://help.formspree.io/articles/building-your-form/building-an-html-form/)

---

نویسنده: Mohammad Hossein Karami — [mhkarami97.ir](https://mhkarami97.ir)
