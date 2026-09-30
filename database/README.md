# Database Setup Guide - College AI Chatbot

This project uses **PostgreSQL** with SQLAlchemy ORM.

## Database Connection String Format
In your `backend/.env` file:
```env
DATABASE_URL=postgresql+psycopg://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DATABASE_NAME>
```

### Examples:
1. **Local PostgreSQL**:
   ```env
   DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/college_ai
   ```

2. **Neon / Supabase (Cloud PostgreSQL)**:
   ```env
   DATABASE_URL=postgresql+psycopg://neondb_owner:npg_xyz@ep-xyz.aws.neon.tech/neondb?sslmode=require
   ```

## Initializing the Schema
Run `init.sql` against your PostgreSQL database:

### Using psql CLI:
```bash
psql -U postgres -d college_ai -f database/init.sql
```

### Using Cloud Console (Neon / Supabase / pgAdmin):
Copy and paste the contents of `database/init.sql` into the SQL Editor and execute.
