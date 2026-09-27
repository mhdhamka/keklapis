
## Tech Stack

| Layer / Category | Technology & Specification |
| :--- | :--- |
| **Framework** | Next.js 16 with App Router (React Server Components) |
| **Frontend** | React 19, TypeScript, Tailwind CSS, Custom CSS Keyframes & Typography |
| **Storage** | JSON file (`data/db.json`) via `lib/json-store.ts` — no database server required |
| **Internationalization** | `next-intl` (English `en` as default, Standard Malay `ms`, and Bahasa Sarawak `bms`) |
| **AI Integration** | Google Gemini API (`@google/genai`) |
| **Deployment** | Native Node.js with systemd / standalone output |

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
* `/api/chat` — AI Copilot endpoint powered by the Google Gemini API via `googleopenai`

---

## Project Structure

```text
keklapis/
├── app/                        # Next.js App Router
│   ├── api/                    # API routes
│   │   ├── export/             # CSV/JSON export endpoints
│   │   ├── chat/               # Google/GenAI endpoints
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