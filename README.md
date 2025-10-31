# Credit Jambo - Admin Dashboard

Administrative interface for **Credit Jambo Savings Management System**.

---

## Quick Start with Docker

**Prerequisites:** Backend must be running first (see [creditjambo-client repository](https://github.com/kwizeradev/creditjambo-client))

```bash
# Clone the repository
git clone https://github.com/kwizeradev/creditjambo-admin

cd creditjambo-admin

# Install dependencies
npm install

# Run setup script
npm run setup
```

This will:

1. Check if backend is running
2. Build Docker image
3. Start admin frontend
4. Make it available at **[http://localhost:5174](http://localhost:5174)**

Open **[http://localhost:5174](http://localhost:5174)** and login with:

* **Email:** `admin@creditjambo.com`
* **Password:** `Admin123!`

See [DOCKER_SETUP.md](DOCKER_SETUP.md) for the complete Docker guide.

---

## Table of Contents

* [Overview](#overview)
* [Tech Stack](#tech-stack)
* [Prerequisites](#prerequisites)
* [Project Structure](#project-structure)
* [Docker Setup](#docker-setup)
* [Manual Setup](#manual-setup)
* [Admin Features](#admin-features)
* [Backend Connection](#backend-connection)
* [Security Notes](#security-notes)

---

## Overview

Credit Jambo Admin Dashboard enables administrators to:

* Verify customer devices
* Manage customers and accounts
* Monitor transactions
* View analytics and statistics

---

## Tech Stack

### Frontend (Web)

* React 19
* Vite
* TypeScript
* Tailwind CSS
* React Query
* Recharts

### Backend Architecture

**One Backend = Practical**

A single backend service (in `creditjambo-client` repository) serves both client and admin endpoints.

**Why One Backend?**

* **Avoids Duplication:** No duplicate schemas or logic
* **Reduced Complexity:** Easier maintenance and deployment
* **Shared Database:** Same PostgreSQL database for both apps

---

## Prerequisites

* Node.js >= 22.x
* npm or yarn
* Git
* Access to the backend service (running in `creditjambo-client` repository)

---

## Project Structure

```bash
creditjambo-admin/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── docs/
```

---

## Docker Setup

### Prerequisites

1. Backend must be running (`creditjambo-client` repository)
2. Docker Desktop installed and running
3. Port **5174** available

### Quick Start

```bash
npm run setup
```

This will:

1. Check if backend is running
2. Build Docker image
3. Start admin frontend
4. Make it available at **[http://localhost:5174](http://localhost:5174)**

### Service Management

```bash
npm run logs           # View logs
npm run teardown       # Stop service
npm run docker:restart # Restart service
npm run teardown -- --all # Complete cleanup
```

---

## Manual Setup

### Prerequisites

Backend API must be running at **[http://localhost:4000](http://localhost:4000)**

### Installation

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local if needed
npm run dev
```

Open **[http://localhost:5174](http://localhost:5174)**

---

## Admin Features

### Device Management

* View all registered devices
* Filter unverified devices
* Verify/unverify devices
* View device information

### Customer Management

* View all customers
* View customer details
* View customer balances
* View customer transaction history

### Transaction Monitoring

* View all transactions
* Filter by type (deposit/withdraw)
* Filter by date range
* View transaction details

### Analytics Dashboard

* Total customers
* Total balance
* Transaction statistics
* Recent activity
* Charts and visualizations

---

## Backend Connection

### Configuration

The admin dashboard connects to the backend API from the `creditjambo-client` repository.

**Environment Variable:**

```bash
VITE_API_URL=http://localhost:4000/api
```

### Setup Both Repositories

**1. Clone and Start Backend (creditjambo-client):**

```bash
git clone https://github.com/kwizeradev/creditjambo-client
cd creditjambo-client
npm install
npm run setup
```

**2. Clone and Start Admin (creditjambo-admin):**

```bash
git clone https://github.com/kwizeradev/creditjambo-admin
cd creditjambo-admin
npm install
npm run setup
```

### CORS Configuration

Backend must allow admin origin.
In `creditjambo-client/backend/.env`:

```bash
CORS_ORIGIN=http://localhost:5174,...
```

---

## Default Admin Credentials

```bash
Email:    admin@creditjambo.com
Password: Admin123!
DeviceId: admin-web-device
```

These are seeded automatically when backend starts.

---

## Configuration

### Environment Variables

**Development (`.env.local`):**

```bash
VITE_API_URL=http://localhost:4000/api
```

### Port Configuration

Default port is **5174**. To change:

**Docker (`.env`):**

```bash
ADMIN_PORT=5175
```

**Manual (`vite.config.ts`):**

```typescript
server: {
  port: 5175,
}
```

---

## Architecture

```
┌─────────────────────────────────────────┐
│         Docker Container                │
├─────────────────────────────────────────┤
│  ┌──────────────────────────────────┐   │
│  │   Admin Frontend                 │   │
│  │   React + Vite                   │   │
│  │   Served by Nginx                │   │
│  │   Port 80 (internal)             │   │
│  └──────────────────────────────────┘   │
└──────────────┬──────────────────────────┘
               │
               │ Port Mapping
               ▼
┌─────────────────────────────────────────┐
│        Host Machine                     │
├─────────────────────────────────────────┤
│  :5174 → Admin Frontend                 │
└──────────────┬──────────────────────────┘
               │
               │ HTTP Requests
               ▼
┌─────────────────────────────────────────┐
│   Backend API (External Repository)     │
│   http://localhost:4000                 │
│   creditjambo-client/backend            │
└─────────────────────────────────────────┘
```

---

## Security Notes

### Authentication

* Admin login with JWT tokens
* Device-based authentication
* Session management
* Auto-refresh tokens

### Authorization

* Role-based access control
* Admin role required for all operations
* Device verification required

### Communication

* HTTPS in production
* CORS protection
* Secure token storage
* XSS protection

---

## Troubleshooting

### Cannot Connect to Backend

**Check backend is running:**

```bash
curl http://localhost:4000/api/health
```

**Check CORS configuration:**
Backend `.env` must include:

```bash
CORS_ORIGIN=http://localhost:5174
```

### Port Already in Use

Edit `.env`:

```bash
ADMIN_PORT=5175
```

### Login Issues

**Verify admin user exists:**

```bash
cd creditjambo-client
docker-compose exec backend npm run seed
```

**Default credentials:**

```bash
Email: admin@creditjambo.com
Password: Admin123!
DeviceId: admin-web-device
```

---

## Multi-Repository Setup

### Full System

**1. Backend + Database (`creditjambo-client`):**

```bash
git clone https://github.com/kwizeradev/creditjambo-client
cd creditjambo-client
npm install
npm run setup
```

**2. Admin Dashboard (`creditjambo-admin`):**

```bash
git clone https://github.com/kwizeradev/creditjambo-admin
cd creditjambo-admin
npm install
npm run setup
```

**3. Mobile App (`creditjambo-client/frontend`):**

```bash
cd creditjambo-client/frontend
npm install
npm start
```

### Service URLs

| Service         | URL                                            | Repository         |
| --------------- | ---------------------------------------------- | ------------------ |
| Backend API     | [http://localhost:4000](http://localhost:4000) | creditjambo-client |
| Admin Dashboard | [http://localhost:5174](http://localhost:5174) | creditjambo-admin  |
| Mobile App      | Expo (port 8081)                               | creditjambo-client |
| Database        | postgresql://localhost:5432                    | creditjambo-client |

---