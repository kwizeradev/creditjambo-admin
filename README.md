# Credit Jambo - Admin Dashboard

Administrative interface for Credit Jambo Savings Management System.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Default Admin Credentials](#default-admin-credentials)
- [Admin Features](#admin-features)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Docker Setup](#docker-setup)
- [Deployment](#deployment)
- [Security Notes](#security-notes)
- [Assumptions](#assumptions)
- [License](#license)

## Overview

Credit Jambo Admin Dashboard enables administrators to:
- Verify customer devices
- Manage customers and accounts
- Monitor transactions
- View analytics and statistics

## Tech Stack

### Frontend (Web)
- React 19
- Vite
- TypeScript
- Tailwind CSS
- React Query
- Recharts

### Backend Architecture
**One Backend = Practical**: I chose to have a single backend service located in the `creditjambo-client` repository that serves both client and admin endpoints. This approach follows the standard pattern and is faster to build with less code duplication.

**Why One Backend?**
- **Avoids Duplication**: Having completely separate backends would mean duplicating Prisma schema, models, utilities, and business logic
- **Reduced Complexity**: Single codebase is easier to maintain and deploy
- **Shared Database**: Both applications use the same PostgreSQL database, making a single backend service logical

## Prerequisites

- Node.js >= 22.x
- npm or yarn
- Git
- Access to the backend service (running in creditjambo-client repository)

## Project Structure
```
creditjambo-admin/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── docs/
```

## Installation

[Installation instructions to be added]

## Database Setup

The admin dashboard connects to the backend service which manages the PostgreSQL database.

**Backend & Database Setup**: <a href="https://github.com/kwizeradev/creditjambo-client#database-setup" target="__blank" rel="noopener noreferrer">Database Setup</a>

The backend service (located in creditjambo-client repository) handles all database operations and API endpoints for both client and admin interfaces.

## Environment Variables

[Environment variables documentation to be added]

## Running the Application

[Run instructions to be added]

## Default Admin Credentials
```
Email: admin@creditjambo.com
Password: Admin123!
```

## Admin Features

[Admin features will be documented]

## API Documentation

[API documentation to be added]

## Testing

[Testing instructions to be added]

## Docker Setup

[Docker instructions to be added]

## Deployment

[Deployment guide to be added]

## Security Notes

[Security implementation to be added]

## Assumptions

[Project assumptions to be added]

## License

MIT License

---