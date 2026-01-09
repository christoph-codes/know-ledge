# Deployment Guide

This project is configured for deployment to Vercel (frontend) and Render.com (backend) with npm workspaces support.

## Prerequisites

- The project uses npm workspaces for shared dependencies
- Both frontend and backend depend on the `@know-ledge/shared` package

## Frontend Deployment (Vercel)

### Option 1: Deploy from Root (Recommended)

1. Connect your repository to Vercel
2. Set the **Root Directory** to: `./` (keep empty for root)
3. Vercel will automatically use the `vercel.json` configuration which:
   - Builds the shared package first
   - Then builds the frontend
   - Uses Turbopack by default

### Option 2: Deploy from Frontend Directory

If you need to deploy only the frontend directory:

1. Set **Root Directory** to: `frontend`
2. Override the **Build Command** to: `npm run build:with-shared`
3. Keep **Output Directory** as: `.next`

### Environment Variables

Set these in your Vercel dashboard:

- `NEXT_PUBLIC_API_URL` - Your backend URL on Render.com

## Backend Deployment (Render.com)

### Option 1: Using render.yaml (Recommended)

1. Connect your repository to Render.com
2. The `render.yaml` file will automatically configure:
   - Build command: `cd .. && npm install && npm run build:shared && cd backend && npm run build`
   - Start command: `npm start`
   - Health check: `/api/healthcheck`

### Option 2: Manual Service Configuration

1. Create a new Web Service on Render.com
2. Set **Root Directory** to: `./` (root of repo)
3. Set **Build Command** to: `npm install && npm run build:shared && cd backend && npm run build`
4. Set **Start Command** to: `cd backend && npm start`

### Option 3: Docker Deployment

Use the provided `Dockerfile.backend`:

1. Set **Environment** to: `Docker`
2. Set **Dockerfile Path** to: `Dockerfile.backend`

### Environment Variables

Set these in your Render.com dashboard:

- `NODE_ENV=production`
- `DATABASE_URL` - Your PostgreSQL connection string
- `CORS_ORIGIN` - Your frontend URL on Vercel

## Local Development

```bash
# Install all dependencies
npm install

# Start frontend (with Turbopack)
npm run dev:frontend

# Start backend
npm run dev:backend

# Build everything
npm run build:shared && npm run build:frontend && npm run build:backend
```

## Key Points

- ✅ **Workspaces**: Both deployments handle npm workspaces correctly
- ✅ **Turbopack**: Frontend uses Turbopack by default with workspace compatibility
- ✅ **TypeScript**: All type imports from `@know-ledge/shared` work properly
- ✅ **Build order**: Shared package is built before frontend/backend
- ✅ **Production ready**: Optimized for production deployments

## Troubleshooting

If you encounter module resolution issues:

- Ensure the shared package builds successfully first
- Check that `@know-ledge/shared` is listed in package.json dependencies
- Verify the workspace configuration in the root package.json
