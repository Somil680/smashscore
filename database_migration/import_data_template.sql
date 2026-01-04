-- ============================================================================
-- SmashScore Database Migration Script
-- Import Data to NEW Supabase Project
-- ============================================================================
-- Run this script in your NEW Supabase project SQL Editor
-- Replace the INSERT statements below with your exported data
-- ============================================================================

-- IMPORTANT: Import data in this order to maintain foreign key constraints:
-- 1. players
-- 2. teams
-- 3. tournaments
-- 4. tournament_participants
-- 5. matches
-- 6. match_scores

-- ============================================================================
-- STEP 1: DISABLE FOREIGN KEY CHECKS (Optional - for faster import)
-- ============================================================================
-- Note: PostgreSQL doesn't support disabling FK checks easily
-- So we'll import in the correct order instead

BEGIN;

-- ============================================================================
-- STEP 2: IMPORT PLAYERS DATA
-- ============================================================================
-- Paste your exported players INSERT statements here
-- Example:
-- INSERT INTO players (id, created_at, name, image_url, active) VALUES 
-- ('550e8400-e29b-41d4-a716-446655440000'::uuid, '2024-01-01 00:00:00+00'::timestamptz, 'Player 1', 'https://example.com/image1.png', true),
-- ('550e8400-e29b-41d4-a716-446655440001'::uuid, '2024-01-01 00:00:00+00'::timestamptz, 'Player 2', NULL, true);

-- ============================================================================
-- STEP 3: IMPORT TEAMS DATA
-- ============================================================================
-- Paste your exported teams INSERT statements here
-- Example:
-- INSERT INTO teams (id, created_at, player_1_id, player_2_id) VALUES 
-- ('660e8400-e29b-41d4-a716-446655440000'::uuid, '2024-01-01 00:00:00+00'::timestamptz, '550e8400-e29b-41d4-a716-446655440000'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid);

-- ============================================================================
-- STEP 4: IMPORT TOURNAMENTS DATA
-- ============================================================================
-- Paste your exported tournaments INSERT statements here
-- Example:
-- INSERT INTO tournaments (id, created_at, name, tournament_type, match_type, winner_team_id, points_per_game, max_game_set, final_match, user_id) VALUES 
-- ('770e8400-e29b-41d4-a716-446655440000'::uuid, '2024-01-01 00:00:00+00'::timestamptz, 'Summer Tournament', 'round-robin', 'singles', NULL, 21, 1, false, '880e8400-e29b-41d4-a716-446655440000'::uuid);

-- ============================================================================
-- STEP 5: IMPORT TOURNAMENT_PARTICIPANTS DATA
-- ============================================================================
-- Paste your exported tournament_participants INSERT statements here
-- Example:
-- INSERT INTO tournament_participants (tournament_id, team_id) VALUES 
-- ('770e8400-e29b-41d4-a716-446655440000'::uuid, '660e8400-e29b-41d4-a716-446655440000'::uuid);

-- ============================================================================
-- STEP 6: IMPORT MATCHES DATA
-- ============================================================================
-- Paste your exported matches INSERT statements here
-- Example:
-- INSERT INTO matches (id, created_at, tournament_id, team_1_id, team_2_id, winner_team_id, tag, match_date) VALUES 
-- ('990e8400-e29b-41d4-a716-446655440000'::uuid, '2024-01-01 00:00:00+00'::timestamptz, '770e8400-e29b-41d4-a716-446655440000'::uuid, '660e8400-e29b-41d4-a716-446655440000'::uuid, '660e8400-e29b-41d4-a716-446655440001'::uuid, '660e8400-e29b-41d4-a716-446655440000'::uuid, 'Match 1', '2024-01-01 12:00:00+00'::timestamptz);

-- ============================================================================
-- STEP 7: IMPORT MATCH_SCORES DATA
-- ============================================================================
-- Paste your exported match_scores INSERT statements here
-- Example:
-- INSERT INTO match_scores (id, match_id, game_number, team_1_score, team_2_score) VALUES 
-- ('aa0e8400-e29b-41d4-a716-446655440000'::uuid, '990e8400-e29b-41d4-a716-446655440000'::uuid, 1, 21, 15);

COMMIT;

-- ============================================================================
-- STEP 8: VERIFY DATA IMPORT
-- ============================================================================
-- Run these queries to verify your data was imported correctly:

-- SELECT COUNT(*) as player_count FROM players;
-- SELECT COUNT(*) as team_count FROM teams;
-- SELECT COUNT(*) as tournament_count FROM tournaments;
-- SELECT COUNT(*) as participant_count FROM tournament_participants;
-- SELECT COUNT(*) as match_count FROM matches;
-- SELECT COUNT(*) as score_count FROM match_scores;

-- ============================================================================
-- END OF IMPORT SCRIPT
-- ============================================================================

