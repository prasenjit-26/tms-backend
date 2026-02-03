# TMS Backend

NestJS GraphQL backend for the TMS (Transport Management System) app.

## Tech Stack

- **NestJS**
- **GraphQL (Apollo)**
- **Prisma**
- **PostgreSQL**
- **JWT Auth** (roles: `admin`, `employee`)

## API

- **GraphQL Endpoint**: `http://localhost:3000/graphql`
- **GraphQL Playground**: enabled at the same URL in development

## Environment Variables

Create a `.env` file (not committed) and set:

- **`DATABASE_URL`** (required)
  - Example: `postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public`
- **`DIRECT_URL`** (optional)
  - Used by Prisma for certain providers/hosting platforms. If you don't need it, set it equal to `DATABASE_URL`.
- **`JWT_SECRET`** (required)
- **`JWT_EXPIRES_IN`** (optional, default `8h`)
- **`PORT`** (optional, default `3000`)

## Local Setup

```bash
yarn install
yarn prisma:generate
yarn prisma:migrate
yarn prisma:seed
```

## Run

```bash
# dev
yarn start:dev

# prod
yarn build
yarn start:prod
```

## Seeded Users

After running `yarn prisma:seed`, you can login with:

- **Admin**
  - Email: `admin@tms.dev`
  - Password: `admin123`
- **Employee**
  - Email: `employee@tms.dev`
  - Password: `employee123`

## RBAC Notes

- **Employee**: view-only access
- **Admin**: can flag/delete shipments (server-enforced via role guards)
