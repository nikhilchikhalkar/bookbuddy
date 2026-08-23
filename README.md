# 📚 BookBuddy — Production-Ready Next.js Book Buy & Rent Marketplace

A modern, high-performance **Book Marketplace and Rental Web Application** built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, and **MongoDB Atlas**.

---

## 🌟 Key Product & Architectural Features

### 1. Frictionless Direct Commerce
- **Zero Buyer/Renter Signup**: Visitors can immediately browse, search, and view books with zero login barriers.
- **WhatsApp Concierge Checkout**: 1-Click Buy / Rent buttons open WhatsApp with a pre-filled, URL-encoded message containing title, author, book ID, serial number, pricing, and chosen action.

### 2. High-Capacity Excel Inventory Management
- **Smart Column Normalization**: Automatically recognizes header variations (e.g. `Book ID`, `book_id`, `Sr Number`, `Serial No`, `MRP`, `Buy Price`).
- **Two Import Modes**:
  - **Option 1 — Add New (Incremental)**: Safely appends new titles, skips existing duplicates without overwriting, and returns conflict logs.
  - **Option 2 — Replace Existing (Source of Truth)**: Safely reconciles active inventory. Upserts sheet books and marks unlisted books as inactive (soft deactivation with zero data loss).
- **Downloadable Sample Template**: Admins can download a pre-formatted `.xlsx` template directly from the portal.
- **Detailed Validation**: Pre-import preview with row-by-row error detection and duplicate identification.

### 3. Secure Admin Portal
- **Session-Based Authentication**: Secure HTTP-only cookies with JWT (`jose`) and `bcryptjs` password hashing.
- **Rate-Limiting Safeguards**: Brute-force protection on admin login and batch import endpoints.
- **Live Inventory Controls**: Search, filter by category/status, inline price editing, availability toggles, and deactivation.
- **Audit Logs & History**: Complete import history with timestamped stats (total rows, inserted, updated, skipped, deactivated, error logs).

### 4. Production-Ready Architecture
- **Mongoose ODM Integration**: Next.js serverless connection caching with compound indexes for fast text and category search.
- **SEO & Accessibility**: Dynamic metadata, OpenGraph tags, Schema.org JSON-LD book markup, `robots.txt`, and dynamic `sitemap.xml`.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15+ (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 & Lucide Icons |
| **Database** | MongoDB Atlas Free Tier with Mongoose ODM |
| **Spreadsheet Engine** | SheetJS (`xlsx`) |
| **Validation** | Zod |
| **Security & Auth** | `jose` (JWT) + `bcryptjs` |
| **Testing** | Vitest (9 unit tests for WhatsApp builder, Excel parser, & validator) |

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/nikhilchikhalkar/bookbuddy.git
cd bookbuddy
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your `.env.local` file:
```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=book_marketplace

# Admin Authentication
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password
AUTH_SECRET=your_jwt_auth_secret_minimum_32_characters_long

# WhatsApp Number (International format without +, spaces, or dashes)
WHATSAPP_NUMBER=919876543210

# Base Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🍃 MongoDB Atlas Setup Guide

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a new **Free Tier (M0)** Cluster.
3. Under **Database Access**, create a database user with username and password.
4. Under **Network Access**, add IP `0.0.0.0/0` (or your deployment server IP) to the whitelist.
5. Click **Connect** → **Drivers (Node.js)** and copy the connection string into `MONGODB_URI` in `.env.local`.

---

## 🔐 Admin Account Setup

Run the secure admin seeding script to create or update the administrator account with bcrypt password hashing:
```bash
npm run seed:admin
```
Then log in at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

---

## 📊 Excel Spreadsheet Specifications

### Required Columns
| Column Header | Format | Description |
| :--- | :--- | :--- |
| **`Sr Number`** | Number / String | Serial number (e.g. `1`, `101`) |
| **`Book ID`** | String (Unique) | Unique identifier (e.g. `BK-1001`) |
| **`Title`** | String | Full title of the book |
| **`Author`** | String | Author name |
| **`Buy Price`** | Number | Purchase price (e.g. `450`) |

### Optional Columns
| Column Header | Format | Description |
| :--- | :--- | :--- |
| **`Rent Price`** | Number | Rental fee (e.g. `100`) |
| **`Currency`** | String | `INR`, `USD`, etc. (Default: `INR`) |
| **`Category`** | String | Category / Genre (e.g. `Self-Help`, `Fiction`) |
| **`Description`** | String | Book overview or synopsis |
| **`ISBN`** | String | 10 or 13-digit ISBN |
| **`Publisher`** | String | Publishing house |
| **`Published Year`** | Number | 4-digit year (1000 - 2100) |
| **`Available For Buy`** | Boolean | `Yes` / `No` / `TRUE` / `FALSE` (Default: `Yes`) |
| **`Available For Rent`** | Boolean | `Yes` / `No` / `TRUE` / `FALSE` (Default: `No`) |
| **`Active`** | Boolean | `Yes` / `No` / `TRUE` / `FALSE` (Default: `Yes`) |

---

## 🧪 Testing & Quality Assurance

```bash
# Run unit test suite (Vitest)
npm test

# Run ESLint validation
npm run lint

# Run production build
npm run build
```

---

## 📱 WhatsApp Order Flow

1. User clicks **Buy** or **Rent** on any book card or detail page.
2. The application computes the deep-link URL:
   `https://wa.me/919876543210?text=<ENCODED_MESSAGE>`
3. The message is pre-filled:
```text
Hello, I am interested in BUYING this book.

📚 Book Details:
• Title: Atomic Habits
• Author: James Clear
• Book ID: BK-1001
• Serial Number: 101
• Buy Price: ₹450
• Rent Price: ₹100
• Category: Self-Help

Please let me know the next steps.
```
4. WhatsApp opens immediately on the user's mobile or desktop.

---

## 📄 License
MIT License. Built for high-velocity, production-grade performance.
