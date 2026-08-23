# 📚 BookBuyRent (BookBuddy)

A modern, production-ready Book Marketplace and Rental Web Application built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, and **MongoDB Atlas**.

---

## 🚀 Key Features

- **Direct Frictionless Commerce**: Browse, search, filter, and view books with zero login required for buyers/renters.
- **WhatsApp Integration**: Instant pre-filled, URL-encoded WhatsApp messages for **Buy** or **Rent** inquiries with complete book metadata.
- **Excel Inventory Management**:
  - **Add New Mode**: Incremental batch upload with duplicate detection and error reporting.
  - **Replace Existing Mode**: Safe source-of-truth inventory update marking unlisted books as inactive without data loss.
- **Robust Admin Dashboard**: Secure cookie-based authentication, book inventory management, pricing updates, availability toggles, and import history logs.
- **MongoDB Atlas Integration**: Optimized indexes, high performance, and connection caching for Next.js serverless runtimes.
- **SEO & Accessibility**: Dynamic metadata, OpenGraph tags, semantic markup, responsive design across mobile/tablet/desktop.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB Atlas with Mongoose ODM
- **Validation**: Zod
- **Excel Processing**: SheetJS (`xlsx`)
- **Authentication**: JWT/Session via `jose` + `bcryptjs`
- **Testing**: Vitest

---

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js 18.18+ or 20+ / 22+
- MongoDB Atlas Free Tier Cluster

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local` and fill in the required variables:
```bash
cp .env.example .env.local
```

### 4. Admin Seeding
```bash
npm run seed:admin
```

### 5. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
