# SmashScore Database Migration Guide

This guide will help you migrate your SmashScore database from one Supabase project to another.

## 📋 Prerequisites

- Access to your **OLD** Supabase project (SQL Editor)
- Access to your **NEW** Supabase project (SQL Editor)
- Basic knowledge of SQL

## 🚀 Migration Steps

### Step 1: Create Tables in New Project

1. Open your **NEW** Supabase project
2. Go to **SQL Editor**
3. Open and run `create_tables.sql`
   - This creates all tables, indexes, foreign keys, and RLS policies
   - ✅ Verify: Check that all 6 tables are created

### Step 2: Export Data from Old Project

You have **three options**:

#### Option A: Using export_all_data.sql (⭐ RECOMMENDED - Easiest)

1. Open your **OLD** Supabase project
2. Go to **SQL Editor**
3. Run `export_all_data.sql`
4. Copy the output from each SELECT statement (6 sections total)
5. Combine them in order: players → teams → tournaments → tournament_participants → matches → match_scores

#### Option B: Using Export Scripts (For Individual Tables)

1. Open your **OLD** Supabase project
2. Go to **SQL Editor**
3. Run `export_data.sql` for each table section
4. Copy the output SQL statements
5. Save them in order (players → teams → tournaments → tournament_participants → matches → match_scores)

#### Option C: Using Complete Migration Script (Alternative)

1. Open your **OLD** Supabase project
2. Go to **SQL Editor**
3. Run each SELECT statement in `complete_migration.sql` separately
4. Copy and combine all outputs

### Step 3: Import Data to New Project

1. Open your **NEW** Supabase project
2. Go to **SQL Editor**
3. Open `import_data_template.sql`
4. Replace the example INSERT statements with your exported data
5. Run the script

**OR** if you used `complete_migration.sql`:

1. Simply paste the output directly into SQL Editor
2. Run it

### Step 4: Verify Migration

Run these verification queries in your **NEW** project:

```sql
-- Count records in each table
SELECT 'players' as table_name, COUNT(*) as count FROM players
UNION ALL
SELECT 'teams', COUNT(*) FROM teams
UNION ALL
SELECT 'tournaments', COUNT(*) FROM tournaments
UNION ALL
SELECT 'tournament_participants', COUNT(*) FROM tournament_participants
UNION ALL
SELECT 'matches', COUNT(*) FROM matches
UNION ALL
SELECT 'match_scores', COUNT(*) FROM match_scores;

-- Verify foreign key relationships
SELECT 
    t.name as tournament_name,
    COUNT(DISTINCT tp.team_id) as participant_count,
    COUNT(DISTINCT m.id) as match_count
FROM tournaments t
LEFT JOIN tournament_participants tp ON t.id = tp.tournament_id
LEFT JOIN matches m ON t.id = m.tournament_id
GROUP BY t.id, t.name;
```

## 📁 File Structure

```
database_migration/
├── README.md                    # This file
├── create_tables.sql            # Create all tables in new project ⭐ START HERE
├── export_all_data.sql          # Export all data (RECOMMENDED) ⭐
├── export_data.sql              # Export data (alternative method)
├── import_data_template.sql      # Template for importing data
└── complete_migration.sql       # All-in-one export script (alternative)
```

## 🔍 Table Dependencies (Import Order)

Import data in this order to maintain foreign key constraints:

1. **players** (no dependencies)
2. **teams** (depends on: players)
3. **tournaments** (depends on: teams, auth.users)
4. **tournament_participants** (depends on: tournaments, teams)
5. **matches** (depends on: tournaments, teams)
6. **match_scores** (depends on: matches)

## ⚠️ Important Notes

### User IDs (auth.users)

- The `tournaments.user_id` references Supabase `auth.users(id)`
- If you're migrating to a new Supabase project with different users:
  - You'll need to map old user IDs to new user IDs
  - Or update `user_id` values after import to match new user IDs

### UUIDs

- All IDs are UUIDs and will be preserved during migration
- This ensures relationships remain intact

### Row Level Security (RLS)

- RLS policies are included in `create_tables.sql`
- After migration, users will only see their own tournaments
- Adjust policies if needed for your use case

## 🐛 Troubleshooting

### Error: Foreign Key Constraint Violation

**Problem**: Importing data out of order or missing referenced records.

**Solution**: 
- Ensure you import in the correct order (see above)
- Check that all referenced IDs exist before importing

### Error: User ID Not Found

**Problem**: `tournaments.user_id` references non-existent users.

**Solution**:
- First, ensure users exist in `auth.users` table
- Or temporarily disable FK checks (not recommended)
- Or update `user_id` values after import

### Error: Duplicate Key Violation

**Problem**: Trying to insert records with existing IDs.

**Solution**:
- Clear existing data first: `TRUNCATE TABLE match_scores, matches, tournament_participants, tournaments, teams, players CASCADE;`
- Or use `INSERT ... ON CONFLICT DO NOTHING` (modify export script)

## 📊 Alternative: Using Supabase Dashboard

If you prefer using the Supabase Dashboard:

1. **Export**: Use Supabase Dashboard → Database → Export data
2. **Import**: Use Supabase Dashboard → Database → Import data

However, the SQL scripts provide more control and preserve UUIDs better.

## ✅ Post-Migration Checklist

- [ ] All tables created successfully
- [ ] All data imported (verify counts match)
- [ ] Foreign key relationships intact
- [ ] RLS policies working correctly
- [ ] Test application with new database
- [ ] Update environment variables in your app

## 🔄 Updating Your Application

After migration, update your `.env.local` or environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-new-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-new-anon-key
```

## 📞 Need Help?

If you encounter issues:
1. Check the error message carefully
2. Verify data integrity with the verification queries
3. Ensure all foreign key relationships are correct
4. Check that user IDs match between old and new projects

---

**Good luck with your migration! 🎉**

