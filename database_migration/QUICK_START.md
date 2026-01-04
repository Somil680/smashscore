# 🚀 Quick Start Migration Guide

## Fast Migration (5 Minutes)

### Step 1: Create Tables in NEW Project (2 min)

1. Open **NEW** Supabase project → SQL Editor
2. Copy entire contents of `create_tables.sql`
3. Paste and run
4. ✅ Done! Tables created

### Step 2: Export Data from OLD Project (2 min)

1. Open **OLD** Supabase project → SQL Editor
2. Copy entire contents of `export_all_data.sql`
3. Paste and run
4. Copy all 6 result sets (one for each table)
5. Save to a text file

### Step 3: Import Data to NEW Project (1 min)

1. Open **NEW** Supabase project → SQL Editor
2. Paste all the INSERT statements you copied
3. Run
4. ✅ Done! Data migrated

## Verification (30 seconds)

Run this in your NEW project:

```sql
SELECT 
    'players' as table_name, COUNT(*) as count FROM players
UNION ALL SELECT 'teams', COUNT(*) FROM teams
UNION ALL SELECT 'tournaments', COUNT(*) FROM tournaments
UNION ALL SELECT 'tournament_participants', COUNT(*) FROM tournament_participants
UNION ALL SELECT 'matches', COUNT(*) FROM matches
UNION ALL SELECT 'match_scores', COUNT(*) FROM match_scores;
```

Compare counts with your OLD project - they should match!

## That's It! 🎉

Your database is now migrated. Update your app's environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-new-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-new-anon-key
```

