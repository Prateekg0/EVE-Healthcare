# EVE Healthcare · Diagnostics

A full-stack diagnostic test booking app. The client uses React, Vite, and Tailwind CSS v4; the API uses Express, MongoDB and Mongoose (MERN). It includes JWT signup/login, searchable centres and tests, authenticated bookings, simulated payments, and an idempotent provider webhook.

## Run locally

Requirements: Node.js 20+, npm, and MongoDB 6+ (local or Atlas).

How to run in local system
```sh
# Set MONGODB_URI and a long random JWT_SECRET in .env
npm install
npm run dev
```

The Vite client runs at http://localhost:5173 and proxies `/api` to the Express API at http://localhost:5000. `npm run build` builds the client into `dist/`; `npm start` runs the API. MongoDB stores users, bookings, and payments. The read-only centre/test catalogue is loaded from `server/data/centres.json`.

## Project structure

```text
src/
  api/client.js              Shared HTTP client and API error handling
  context/AuthContext.jsx    Authentication state and session persistence
  components/                Header, footer, cards, modals, and toast UI
  pages/                     Centre search and booking history screens
  App.jsx                    Page composition and top-level UI state
  main.jsx                   React bootstrap only
  styles.css                 Tailwind theme, base styles, and illustration details
app.js                       Express app setup and router mounting
server/
  config/                    MongoDB connection
  controllers/               Request handling and application logic
  middlewares/               Authentication checks
  models/                    User, booking, and payment schemas
  routes/                    URL definitions mapped to controllers
  data/centres.json          Read-only centre and test catalogue
  utils/                     Catalogue and JWT helpers
  index.js                   Database setup and server startup
```

For a Docker setup, use `docker compose up --build`; the app is available at http://localhost:5000. The Express server serves the Vite production build when `dist/` exists.

## Product flow

1. Browse centres and filter by area, test name, or category.
2. Create an account or log in, choose a future appointment (up to 90 days ahead), then confirm the booking.
3. Open **My bookings** to pay or cancel a pending booking. Mock payments succeed about 88% of the time. Success confirms the booking; failure marks it failed.

## API

All request and response bodies are JSON. Protected routes require `Authorization: Bearer <JWT>`. Dates are ISO 8601 timestamps. Error responses have a human-readable `message` and an appropriate 4xx/5xx status.

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Create account (`name`, `email`, `password`, minimum 8 chars); returns JWT and user |
| POST | `/api/auth/login` | No | Login; returns JWT and user |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/centres?q=&category=` | No | Search centres and offered tests |
| GET | `/api/centres/:id` | No | Centre details and tests |
| GET | `/api/bookings` | Yes | Current user's bookings |
| POST | `/api/bookings` | Yes | Book `{ "centreId", "testId", "appointmentAt" }` |
| PATCH | `/api/bookings/:id/cancel` | Yes | Cancel a pending booking owned by the caller |
| POST | `/api/payments` or `/payments/` | Yes | Simulate payment for `{ "bookingId" }` |
| POST | `/api/payments/webhook` or `/payments/webhook/` | Provider | Apply `{ "bookingId", "eventId", "status" }`; status is `SUCCESS` or `FAILED` |
| GET | `/api/health` | No | Liveness check |

Centre catalogue endpoints are public and read-only. To add or update centres/tests, edit `server/data/centres.json` and redeploy. Keep every centre and test `_id` as a unique 24-character hexadecimal string; existing bookings store these IDs. If `WEBHOOK_SECRET` is set, webhook calls must include the matching `x-webhook-secret` header. Leave it unset only for local simulation.

Example booking and payment:

```sh
curl -X POST http://localhost:5000/api/bookings \\
  -H 'Authorization: Bearer YOUR_JWT' -H 'Content-Type: application/json' \\
  -d '{"centreId":"CENTRE_ID","testId":"TEST_ID","appointmentAt":"2026-10-10T09:30:00.000Z"}'

curl -X POST http://localhost:5000/api/payments \\
  -H 'Authorization: Bearer YOUR_JWT' -H 'Content-Type: application/json' \\
  -d '{"bookingId":"BOOKING_ID"}'
```

Webhook retries may reuse the same `eventId`: the payment record has a unique event ID, so a repeat for the same booking returns the original result without applying the state transition twice. Reusing an event ID for another booking returns `409`. A webhook event is accepted only while the booking is pending.

## Data model

- **User**: name, normalized unique email, bcrypt password hash.
- **Centre catalogue**: read-only JSON records with name, location/address, hours/rating, and tests (name/category/description/duration/price). No centre documents or admin CRUD are needed in MongoDB.
- **Booking**: user reference, centre/test IDs and snapshots of test name, centre name, location and price, appointment date, status. The snapshot preserves what was booked if catalogue details later change.
- **Payment**: booking/user references, unique provider event ID, result and amount. The unique event ID is the webhook idempotency key.

