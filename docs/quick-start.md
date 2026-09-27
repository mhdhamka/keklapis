
## Quick Start

### Prerequisites

- Node.js 20+

### Installation

```bash
# Clone the repository
git clone https://github.com/mhdhamka/keklapis.git
cd keklapis

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local to add your Gemini API key

```

### Development

```bash
# Generate Prisma client artifacts
npx prisma generate

# Start Next.js dev server
npm run dev

```

The app will be available at `http://localhost:3000`. 

---

## Environment Variables & Configuration

### Environment Files

Create `.env.local` based on `.env.example`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# NextAuth / Auth.js Configuration (OAuth & Secrets)
# Run `npx auth secret` to generate a secure random string for AUTH_SECRET
AUTH_SECRET="run-npx-auth-secret-to-generate-a-secure-random-string"
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Google Gemini API Key for AI Copilot features
GEMINI_API_KEY=""

# Typesense Search Engine Configuration
TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=your_typesense_api_key_here

# PostgreSQL Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public"

```

### How to Get Your Typesense API Key from Docker
If you are running Typesense locally via Docker, your API key is defined in your Docker run command or docker-compose.yml file under the --api-key argument.

To find your running Typesense API key from the container, run:

```Bash
docker run -d \
  --name typesense \
  -p 8108:8108 \
  -v "$(pwd)/typesense-data:/data" \
  typesense/typesense:latest \
  --data-dir /data \
  --api-key=xyz \
  --enable-cors
```

If you already have a Typesense container running and need to verify or retrieve your API key, you can inspect it with:
```bash
docker inspect typesense | grep -i api-key
```

Alternatively, if you used the default development setup, the API key is typically set to the value you specified during container startup (e.g., xyz).

### How to Set Up PostgreSQL

* Ensure you have a PostgreSQL instance running locally or on a cloud provider (like Neon or Supabase).
* Create a dedicated database for the project (e.g., `keklapis`).
* Construct your connection string using your local credentials:
  * **Format:** `postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public`
  * **Example (Local):** `postgresql://postgres:password@localhost:5432/keklapis?schema=public`
* Push your Prisma schema and seed your database with existing records:

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### Package Manager (.npmrc)
The repository includes an .npmrc file to enforce strict dependency hoisting rules and lock engine version compatibility across modern package managers like npm and pnpm.

### Testing
The project is configured with both unit tests (Vitest) and end-to-end tests (Playwright).

```bash
# Run unit tests
npm run test

# Run End-to-End (E2E) UI tests
npx playwright test
```

### Internationalization (i18n) & Validation
* **Translation Files:** Located in `messages/` (`en.json`, `ms.json`, `bms.json`). Ensure all custom keys added to source code are synchronized across all translation files to prevent fallback rendering exceptions.
* **Data Validation:** Form submissions and incoming API requests are strictly validated using **Zod** (`lib/validations/contribution.ts`) via `.safeParse()` to reject malformed parameters or invalid payloads before storage operations occur.

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
