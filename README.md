# AgriTrade

AgriTrade is a MERN farm produce procurement and supply chain platform. It connects farmers, collection centers, inspectors, buyers, logistics teams, warehouses, and administrators in one role-based system.

## Features

- JWT authentication with bcrypt password hashing.
- Role-based access control with organization and region scoping.
- Mongoose models for users, organizations, regions, farmers, farms, produce lots, inspections, inventory, purchase orders, allocations, vehicles, drivers, shipments, settlements, disputes, notifications, reports, and audit logs.
- End-to-end lot workflow: farmer creates a lot, center receives it, inspector grades it, accepted inventory is allocated, shipment is delivered, settlement is calculated, reports and audit logs update.
- Reusable React application shell with landing page, role dashboards, mobile-friendly navigation, status badges, timelines, data tables, notifications, reports, and workflow forms.
- Seed data with realistic Indian agricultural produce and demo accounts.
- Centralized backend error handling, audit logging, validation helpers, pagination, search, filters, and workflow status guards.

## Demo Accounts

All seeded users use `Password123!`.

| Role | Email |
| --- | --- |
| Platform Admin | `admin@agritrade.com` |
| Farmer | `farmer@agritrade.com` |
| Collection Center Manager | `center@agritrade.com` |
| Quality Inspector | `inspector@agritrade.com` |
| Buyer | `buyer@agritrade.com` |
| Logistics Coordinator | `logistics@agritrade.com` |

## Setup

1. Copy `.env.example` to `backend/.env`.
2. Start MongoDB locally or set `MONGO_URI` to your MongoDB connection string.
3. Install dependencies:

```bash
npm run install:all
```

4. Seed demo data:

```bash
npm run seed
```

5. Run both apps:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000/api/health`

## API Structure

The backend exposes REST resources under:

```text
/api/auth
/api/users
/api/organizations
/api/regions
/api/farmers
/api/farms
/api/produce-categories
/api/lots
/api/inspections
/api/grading-criteria
/api/warehouses
/api/inventory
/api/inventory-movements
/api/purchase-orders
/api/allocations
/api/vehicles
/api/drivers
/api/shipments
/api/settlements
/api/disputes
/api/notifications
/api/reports
/api/audit-logs
```

Workflow endpoints include:

```text
POST /api/lots/:id/receive
POST /api/lots/:id/inspect
POST /api/lots/:id/accept
POST /api/lots/:id/reject
POST /api/purchase-orders/:id/allocate
POST /api/purchase-orders/:id/cancel
POST /api/shipments/:id/assign-vehicle
POST /api/shipments/:id/dispatch
POST /api/shipments/:id/in-transit
POST /api/shipments/:id/deliver
POST /api/settlements/:id/approve
POST /api/settlements/:id/pay
```

## Architecture

```text
backend/
  src/
    app.js
    server.js
    config/
    controllers/
    middleware/
    models/
    routes/
    seed/
    services/
    tests/
    utils/
frontend/
  src/
    components/
    data/
    layouts/
    pages/
    routes/
    services/
    store/
    utils/
```

## Security Notes

The API enforces authorization on protected routes, applies helmet, CORS, JSON body limits, rate limiting, input sanitization, scoped queries, structured errors, and audit records for critical workflow changes.

## Testing

```bash
npm test
```

Backend tests cover authentication utilities, lot status transitions, allocation constraints, shipment workflow, settlement math, and dispute status validation. Frontend tests cover key UI components.

## Deployment

- Set production environment variables.
- Use a managed MongoDB cluster.
- Build the frontend with `npm run build --prefix frontend`.
- Serve the backend with `npm start --prefix backend`.
- Put both behind HTTPS and configure `CLIENT_URL` and CORS accordingly.

## Future Enhancements

- SMS and WhatsApp notifications for farmer workflows.
- Offline-first collection center mode.
- Barcode or QR scanning through mobile camera.
- Advanced route optimization and geofencing.
- Marketplace bidding for buyers.
