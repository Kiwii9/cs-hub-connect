# KFU Study Hub

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

---

<details open>
<summary>🇬🇧 English</summary>

**KFU Study Hub** is a modern resource-sharing platform for King Faisal University students across all colleges and majors.

It is designed as a portfolio-ready full-stack project that demonstrates front-end development, Supabase authentication, cloud storage, database design, and academic-integrity moderation.

## Key Features

- **KFU email-gated authentication** using official `@student.kfu.edu.sa` and `@kfu.edu.sa` domains.
- **KFU-wide course catalog structure** with college and major fields.
- **Resource sharing** for student-made notes and helpful lecture links.
- **Search and filters** by course, college, major, academic year, semester, batch, and lecturer.
- **Academic-integrity reporting** for leaked exams, copyrighted material, or cheating content.
- **Responsive professional UI** built with React, TypeScript, Tailwind CSS, and shadcn-ui.
- **Supabase backend** for authentication, database records, and private resource storage.

## Local Setup

```bash
npm ci
npm run dev
```

## Production Build

```bash
npm run build
```

## Supabase Migration

Apply the included migration before production deployment:

```bash
supabase db push
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

</details>

<details>
<summary>🇸🇦 العربية</summary>

**KFU Study Hub** هو تطبيق حديث لمشاركة الموارد الدراسية لطلاب جامعة الملك فيصل في جميع الكليات والتخصصات.

المشروع مناسب للعرض في البورتفوليو لأنه يوضح مهارات تطوير الواجهة الأمامية، المصادقة، التخزين السحابي، تصميم قاعدة البيانات، وإدارة النزاهة الأكاديمية.

## المميزات الرئيسية

- **تسجيل دخول ببريد جامعة الملك فيصل** عبر نطاقات `@student.kfu.edu.sa` و `@kfu.edu.sa`.
- **هيكلة تدعم جميع كليات وتخصصات الجامعة** من خلال حقول الكلية والتخصص.
- **مشاركة الموارد الدراسية** مثل الملاحظات وروابط المحاضرات المفيدة.
- **بحث وتصفية** حسب المقرر، الكلية، التخصص، السنة الدراسية، الفصل، الدفعة، والمحاضر.
- **نظام بلاغات للنزاهة الأكاديمية** ضد التسريبات أو المحتوى المخالف أو المواد المحمية بحقوق نشر.
- **واجهة احترافية ومتجاوبة** مبنية باستخدام React و TypeScript و Tailwind CSS و shadcn-ui.
- **خلفية Supabase** للمصادقة وقاعدة البيانات وتخزين الملفات الخاصة.

## التشغيل المحلي

```bash
npm ci
npm run dev
```

## بناء نسخة الإنتاج

```bash
npm run build
```

## تفعيل تعديلات Supabase

قبل النشر، نفّذ الهجرة المرفقة:

```bash
supabase db push
```

## متغيرات البيئة

أنشئ ملف `.env` بناءً على `.env.example`:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

</details>
