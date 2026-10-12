# Forma — Dynamic PDF Template Management System

A full-stack template studio with a React/Vite/TypeScript frontend, Express/TypeScript API, MongoDB/Mongoose persistence, and server-side Puppeteer PDF generation.

## Features

- Document Master library with five seeded templates, search, and category filtering.
- Live color and typography preview, alignment/bold controls, default template management.
- Logo upload (image data URL stored with configuration; 1 MB frontend limit).
- Dark mode.
- MongoDB-backed template configuration.
- PDF preview in a new tab and downloadable PDF generated on the server.
- Request validation (Zod), centralized errors, security headers, CORS, and PDF rate limiting.

## Requirements

- Node.js 20+
- MongoDB local instance or MongoDB Atlas database
- Chrome/Puppeteer system dependencies on the server (Puppeteer normally downloads its compatible Chrome during install)

## Local setup

### 1. Start MongoDB

Use a local MongoDB service or create an Atlas cluster and obtain a connection string.

### 2. Start the backend

```bash
cd server
cp .env.example .env
# Set MONGODB_URI and CLIENT_ORIGIN in .env
npm install
npm run seed
npm run dev
```

The API runs at `http://localhost:4000`. Health check: `GET http://localhost:4000/api/health`.

### 3. Start the frontend

In another terminal:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. Set `VITE_API_URL` if your backend is not at `http://localhost:4000/api`.

### 4. Production build

```bash
# backend
cd server && npm run build && npm start

# frontend (separate terminal)
cd client && npm run build
```

## API documentation

Base URL: `http://localhost:4000/api`

### `GET /templates`

Returns active templates.

### `GET /templates/default`

Returns `{ "template": {...}, "config": {...} }` for the default configuration.

### `GET /templates/:id/config`

Returns a saved configuration for the supplied MongoDB template ObjectId.

### `POST /templates/save`

JSON request:
```json
{
  "templateId": "MONGODB_TEMPLATE_OBJECT_ID",
  "isDefault": true,
  "primaryColor": "#4f46e5",
  "secondaryColor": "#a5b4fc",
  "headerFont": "Roboto",
  "bodyFont": "Arial",
  "footerFont": "Open Sans",
  "fontSize": 10,
  "headerBold": true,
  "bodyBold": false,
  "footerBold": false,
  "headerAlign": "left",
  "bodyAlign": "left",
  "footerAlign": "center"
}
```
Logo is optional: `logoDataUrl` may be a base64 data URL for PNG/JPEG/WebP/SVG and must be within the request size limit. The server validates IDs, colors, fonts, sizes, and alignment. If `isDefault` is true, other configurations are unset as default before the configuration is saved.

### `PUT /templates/:id/default`

Makes the specified active template the default.

### `POST /pdf/generate`

JSON request:
```json
{
  "documentType": "invoice",
  "templateId": "MONGODB_TEMPLATE_OBJECT_ID",
  "data": {
    "invoiceNumber": "INV001",
    "customerName": "John Doe",
    "companyName": "Example Co",
    "items": [
      {"description": "Consulting", "quantity": 1, "rate": 12500}
    ],
    "notes": "Payment due within 15 days."
  }
}
```

Supported document types: `invoice`, `voucher`, `booking`, `quotation`, `report`. `templateId` is optional: if omitted, the saved default configuration is used. The response is binary `application/pdf` with a download filename. To use the saved default in all cases, omit `templateId`; pass it only when you intentionally want a specific template's saved configuration.

### `GET /health`

Returns API and database connection status.

## Database collections

- `templates`: name, description, thumbnail key, category, active state, timestamps.
- `templateconfigurations`: unique template reference, default state, colors, fonts, font size, bold/alignment controls, optional logo data URL, timestamps.

## Deployment

### Frontend (Netlify or Vercel)

- Root directory: `client`
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api`
- Configure SPA fallback to `index.html` if needed.

### Backend (Render or Railway)

- Root directory: `server`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment variables: `MONGODB_URI`, `CLIENT_ORIGIN` (full frontend origin), `NODE_ENV=production`, and optionally `PORT` (platform normally injects this).
- Ensure Puppeteer's browser dependencies are installed. If deployment cannot launch Chromium on the chosen host, use a Docker image with Chrome dependencies or a host that supports Puppeteer.
- Run `npm run seed` once after the production database is configured.

Do not commit `.env` files or MongoDB credentials. The app currently has no authentication; add authentication and authorization before exposing template administration to the public internet.

## Demo checklist

1. Open Document Master and select different templates.
2. Change primary/secondary colors, fonts, sizes, alignment, and bold options.
3. Upload a logo and toggle dark mode.
4. Save configuration and reload to confirm persistence.
5. Set a default template.
6. Preview and download a PDF, then verify that the generated document uses saved styles.
7. Show API health and endpoint documentation.

## Current scope / production hardening

The client renders a local live preview and the server renders final PDFs independently from the same configuration model; exact pixel parity can vary by browser font availability. For a public production deployment, add admin authentication, audit logging, stricter SVG/logo sanitization, object storage for logos, tests/CI, and transactional default-template updates for concurrent administrators.
