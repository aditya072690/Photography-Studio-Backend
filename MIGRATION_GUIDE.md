# Data Migration Guide

This guide will help you transfer your data from the TypeScript data files to your Supabase database.

## Prerequisites

1. ✅ Supabase account created
2. ✅ Database schema set up (run `supabase-setup.sql` in Supabase SQL Editor)
3. ✅ Backend `.env` file configured with Supabase credentials

## Step 1: Set Up Environment Variables

Make sure your `backend/.env` file has the following:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
# OR use anon key if service_role is not available
# SUPABASE_ANON_KEY=your_anon_key
```

## Step 2: Install Dependencies

If you haven't already, install the backend dependencies:

```bash
cd backend
npm install
```

## Step 3: Run the Migration

Run the migration script:

```bash
npm run migrate
```

Or directly with tsx:

```bash
npx tsx src/migrate-data.ts
```

## What Gets Migrated

### Gallery Data
- All images from `frontend/data/gallery.ts`
- Includes: image URLs, titles, categories, and descriptions
- Total: 15 gallery items

### Testimonials Data
- All testimonials from `frontend/data/testimonials.ts`
- Includes: client names, ratings, reviews, images
- Total: 6 testimonials

## Expected Output

You should see output like this:

```
🚀 Starting data migration to Supabase...

✅ Connected to Supabase

📸 Migrating gallery data...
Found 15 gallery items
✅ Successfully migrated 15 gallery items

💬 Migrating testimonials data...
Found 6 testimonials
✅ Successfully migrated 6 testimonials

✨ Migration completed!

You can now view your data in the Supabase dashboard:
  - Gallery: Table Editor → gallery
  - Testimonials: Table Editor → testimonials
```

## Troubleshooting

### Error: "Supabase credentials not found"
- Make sure your `backend/.env` file exists and has the correct values
- Check that you're running the command from the `backend` directory

### Error: "relation does not exist"
- You need to run the database setup SQL first
- Go to Supabase SQL Editor and run `supabase-setup.sql`

### Error: "duplicate key value"
- The data already exists in your database
- The script will skip migration if data already exists
- To re-migrate, clear the tables in Supabase dashboard first

### Error: "permission denied"
- Make sure you're using `SUPABASE_SERVICE_ROLE_KEY` (not anon key)
- The service role key has admin privileges needed for inserts

## Verifying the Migration

1. Go to your Supabase dashboard
2. Navigate to **Table Editor**
3. Check the `gallery` table - you should see 15 rows
4. Check the `testimonials` table - you should see 6 rows

## Updating the Data

If you need to update the data in the migration script:

1. Edit `backend/src/migrate-data.ts`
2. Update the `galleryData` or `testimonialsData` arrays
3. Clear the existing data in Supabase (optional, or the script will skip)
4. Run `npm run migrate` again

## Next Steps

After migration:
1. ✅ Data is now in Supabase
2. ✅ Your backend API can fetch data from Supabase
3. ✅ Your frontend can use the API endpoints
4. ✅ You can add/edit data through the Supabase dashboard or API

