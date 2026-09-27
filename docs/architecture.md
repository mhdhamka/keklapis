
## Tech Stack

| Layer / Category | Technology & Specification |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Frontend** | React 19, TypeScript, Tailwind CSS |
| **Storage** | JSON file (`data/db.json`) |
| **I18n** | `next-intl` (EN, MS, BMS) |
| **AI Integration** | Google Gemini API (`@google/genai`) |
| **Deployment** | Vercel |

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

Kek Lapis/
├── .agents/                    # Agent skills & workflows
│   └── skills/                 # Shared assistant capabilities (Prisma, etc.)
├── .claude/                    # Claude-specific agent configurations
├── .cursor/                    # Cursor IDE configurations & rules
├── .devin/                     # Devin AI agent configurations
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
├── scripts/                    # Deployment scripts
├── .env.example                # Environment variables template
├── .gitattributes              # Git attributes configuration
├── .gitignore                  # Git ignore rules
├── .npmrc                      # NPM configuration settings
├── components.json             # shadcn/ui components configuration
├── global.d.ts                 # Global TypeScript definitions
├── kilo.json                   # Project/build settings
├── middleware.ts               # Next.js middleware
├── next.config.mjs             # Next.js configuration
├── package-lock.json           # Locked dependency versions
├── package.json                # Project dependencies & scripts
├── playwright.config.ts        # Playwright end-to-end testing config
├── postcss.config.mjs          # PostCSS configuration
├── prisma-next.md              # Prisma integration documentation
├── prisma.config.ts            # Prisma configuration
├── README.md                   # Project documentation
├── skills-lock.json            # AI skills lock file
└── tailwind.config.js          # Tailwind CSS configuration

```
---