<div align="center">

# Kek Lapis

**Sarawak's definitive traditional and modern Kek Lapis registry, bakery directory, and heritage archive.**

[Live Demo](https://localhost:3000) · [Report Bug](https://github.com/mhdhamka/keklapis/issues) · [Request Feature](https://github.com/mhdhamka/keklapis/issues)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)

</div>

---

## Overview

**Kek Lapis** breaks away from static web registries. Built with a high-contrast editorial heritage aesthetic, it functions as an interactive archive for Sarawak layered cakes. Visitors can discover verified bakeries, compare recipes, explore geographical origins via an interactive map, and review baking standards and heritage certifications in real time.

---

## Interactive Registry Preview

<div align="center">

![Kek Lapis Archive & Inspector](./src/assets/images/sandbox.png)

*Heritage archive data analysis and interactive bakery registry inspector pane*

</div>

---

## Key Features

* **Signature Color Palette Engine:** 5-color aesthetic border accents matching traditional Kek Lapis visual standards (`#7A5C3E`, `#B3936A`, `#2E4A35`, `#5B6E53`, `#D4C4A8`).
* **Smart Bakery & Variant Filters:** Instant search and category toggles to surface traditional or modern variants.
* **Registry Modal Inspector:**
  * **Recipe Records:** Live ingredient and specification details embedded in the UI.
  * **Heritage Verification:** Automated breakdown of KKM approvals, halal certification, and master bakery status.
  * **Bakery Location Map:** Visual geographic mapping of regional bakeries across Sarawak.
* **Editorial Preloader:** Smooth transitions styled for archival exploration.

---

## Tech Stack

| Layer / Category | Technology & Specification |
| :--- | :--- |
| **Framework** | Next.js 16 with App Router (React Server Components) |
| **Frontend** | React 19, TypeScript, Tailwind CSS, Custom CSS Keyframes & Typography |
| **Storage** | JSON file (`data/db.json`) via `lib/json-store.ts` — no database server required |
| **Internationalization** | `next-intl` (English `en` as default, Standard Malay `ms`, and Bahasa Sarawak `bms`) |
| **API Documentation** | Swagger / OpenAPI available at `/docs` |
| **Deployment** | Native Node.js with systemd / standalone output |

---

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 10+

### Installation

```bash
# Clone the repository
git clone [https://github.com/mhdhamka/keklapis.git](https://github.com/mhdhamka/keklapis.git)
cd keklapis

# Install dependencies
npm install

# Set up environment variables (optional — only for chatbot/analytics)
cp .env.example .env.local
# Edit .env.local as needed

```

### Development

```bash
# Start Next.js dev server
npm run dev

```

The app will be available at `http://localhost:3000`. No database setup is required — all data is read from and written to `data/db.json` at runtime.

---

## Environment Variables

Create `.env.local` for development (all optional):

```bash
# Chatbot (optional)
GROQ_API_KEY=""

# Analytics (optional)
NEXT_PUBLIC_UMAMI_SCRIPT_URL=""
NEXT_PUBLIC_UMAMI_WEBSITE_ID=""

```

The JSON store needs no environment variables. See `.env.example` for the authoritative list.

---

## Production Deployment

### Native Node.js Deployment (Recommended)

Build the standalone Next.js app and run it directly with Node.js:

```bash
# Build for production (cross-platform compatible)
npm run build

# Start the production server (Linux / macOS / Bash)
./start-prod.sh

# Or start directly using Node.js (ideal for Windows or manual testing)
node .next/standalone/server.js

```

### Auto-start on Boot

For Linux servers requiring auto-start, install the systemd service:

```bash
# Install native systemd service
sudo ./scripts/install-native.sh

# Or manually:
sudo cp keklapis-native.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now keklapis-native

```
---

## Project Structure

```text
keklapis/
├── app/                        # Next.js App Router
│   ├── api/                    # API routes
│   │   ├── export/             # CSV/JSON export endpoints
│   │   └── ...
│   ├── (routes)/               # Page routes & views
│   └── layout.tsx              # Root layout
├── components/                 # React components & editorial primitives
│   └── ui/                     # shadcn/ui components
├── lib/                        # Utilities and helpers
│   ├── db/                     # Data operations (JSON store wrappers)
│   │   ├── products.ts         # Product queries
│   │   ├── registry.ts         # Registry queries
│   │   └── ...
│   ├── json-store.ts           # JSON file storage engine
│   ├── products.ts             # Compatibility shim
│   ├── features.ts             # Feature flags
│   └── types/                  # TypeScript types
├── data/                       # JSON database
│   └── db.json                 # All app data
├── i18n/                       # Internationalization config
├── messages/                   # Translation files
│   ├── ms.json                 # Malay
│   ├── bms.json                # Sarawakian Malay
│   └── en.json                 # English
└── scripts/                    # Deployment scripts

```

---

## Core Architecture & APIs

### Data Architecture

* JSON file storage via `lib/json-store.ts` (atomic tmp+rename writes, in-memory cache, serialized writes).
* Images stored as files in `public/images/db/`, not inside the data store.
* Thin wrappers over the JSON store manage products, brands, sources, manufacturers, and images with snake_case field names.

### API Routes

* `/api/products` — Product search and filtering with pagination
* `/api/registry` — Bakery location and verification data
* `/api/brands` — Brand listings and parent houses
* `/api/export/products` — CSV and JSON export endpoints for analysis
* `/api/openapi` — OpenAPI specification and interactive Swagger UI at `/docs`

---

If you found this project interesting, consider giving it a star!

Crafted with ⚡ by mhdhamka

</div>
