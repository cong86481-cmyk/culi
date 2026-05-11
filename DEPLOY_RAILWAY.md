# Railway Deployment

## Setup

1. Go to [Railway](https://railway.app) and create account

2. Create new project → Add PostgreSQL database

3. Add Environment Variables:
   ```
   DATABASE_URL = (from Railway PostgreSQL)
   JWT_SECRET = (generate random 32+ char string)
   NODE_ENV = production
   ```

4. Deploy:
   ```bash
   railway login
   railway init
   railway up
   ```

## Local Development with Railway DB

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Link project:
   ```bash
   railway link
   ```

3. Get database URL:
   ```bash
   railway variables
   ```

4. Add to .env:
   ```
   DATABASE_URL=postgresql://...
   ```

5. Push schema:
   ```bash
   npm run db:push
   ```
