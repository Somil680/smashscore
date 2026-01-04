-- ============================================================================
-- SmashScore Database Migration Script
-- Export Data from OLD Supabase Project
-- ============================================================================
-- Run this script in your OLD Supabase project SQL Editor
-- Copy the output and save it to import_data.sql
-- ============================================================================

-- ============================================================================
-- EXPORT PLAYERS DATA
-- ============================================================================
-- Copy this output and use in import_data.sql
SELECT 
    'INSERT INTO players (id, created_at, name, image_url, active) VALUES (' ||
    quote_literal(id::text) || '::uuid, ' ||
    quote_literal(created_at) || '::timestamptz, ' ||
    quote_literal(name) || ', ' ||
    COALESCE(quote_literal(image_url), 'NULL') || ', ' ||
    COALESCE(active::text, 'true') ||
    ');' AS sql_statement
FROM players
ORDER BY created_at;

-- ============================================================================
-- EXPORT TEAMS DATA
-- ============================================================================
SELECT 
    'INSERT INTO teams (id, created_at, player_1_id, player_2_id) VALUES (' ||
    quote_literal(id::text) || '::uuid, ' ||
    quote_literal(created_at) || '::timestamptz, ' ||
    quote_literal(player_1_id::text) || '::uuid, ' ||
    COALESCE(quote_literal(player_2_id::text) || '::uuid', 'NULL') ||
    ');' AS sql_statement
FROM teams
ORDER BY created_at;

-- ============================================================================
-- EXPORT TOURNAMENTS DATA
-- ============================================================================
SELECT 
    'INSERT INTO tournaments (id, created_at, name, tournament_type, match_type, winner_team_id, points_per_game, max_game_set, final_match, user_id) VALUES (' ||
    quote_literal(id::text) || '::uuid, ' ||
    quote_literal(created_at) || '::timestamptz, ' ||
    quote_literal(name) || ', ' ||
    quote_literal(tournament_type) || ', ' ||
    quote_literal(match_type) || ', ' ||
    COALESCE(quote_literal(winner_team_id::text) || '::uuid', 'NULL') || ', ' ||
    points_per_game || ', ' ||
    max_game_set || ', ' ||
    COALESCE(final_match::text, 'false') || ', ' ||
    quote_literal(user_id::text) || '::uuid' ||
    ');' AS sql_statement
FROM tournaments
ORDER BY created_at;

-- ============================================================================
-- EXPORT TOURNAMENT_PARTICIPANTS DATA
-- ============================================================================
SELECT 
    'INSERT INTO tournament_participants (tournament_id, team_id) VALUES (' ||
    quote_literal(tournament_id::text) || '::uuid, ' ||
    quote_literal(team_id::text) || '::uuid' ||
    ');' AS sql_statement
FROM tournament_participants
ORDER BY tournament_id, team_id;

-- ============================================================================
-- EXPORT MATCHES DATA
-- ============================================================================
SELECT 
    'INSERT INTO matches (id, created_at, tournament_id, team_1_id, team_2_id, winner_team_id, tag, match_date) VALUES (' ||
    quote_literal(id::text) || '::uuid, ' ||
    quote_literal(created_at) || '::timestamptz, ' ||
    quote_literal(tournament_id::text) || '::uuid, ' ||
    quote_literal(team_1_id::text) || '::uuid, ' ||
    COALESCE(quote_literal(team_2_id::text) || '::uuid', 'NULL') || ', ' ||
    COALESCE(quote_literal(winner_team_id::text) || '::uuid', 'NULL') || ', ' ||
    COALESCE(quote_literal(tag), 'NULL') || ', ' ||
    quote_literal(match_date) || '::timestamptz' ||
    ');' AS sql_statement
FROM matches
ORDER BY created_at;

-- ============================================================================
-- EXPORT MATCH_SCORES DATA
-- ============================================================================
SELECT 
    'INSERT INTO match_scores (id, match_id, game_number, team_1_score, team_2_score) VALUES (' ||
    quote_literal(id::text) || '::uuid, ' ||
    quote_literal(match_id::text) || '::uuid, ' ||
    game_number || ', ' ||
    team_1_score || ', ' ||
    team_2_score ||
    ');' AS sql_statement
FROM match_scores
ORDER BY match_id, game_number;

-- ============================================================================
-- ALTERNATIVE: Use COPY command (faster for large datasets)
-- ============================================================================
-- Uncomment and run these in psql or Supabase SQL Editor:

-- COPY players TO STDOUT WITH CSV HEADER;
-- COPY teams TO STDOUT WITH CSV HEADER;
-- COPY tournaments TO STDOUT WITH CSV HEADER;
-- COPY tournament_participants TO STDOUT WITH CSV HEADER;
-- COPY matches TO STDOUT WITH CSV HEADER;
-- COPY match_scores TO STDOUT WITH CSV HEADER;

-- ============================================================================
-- END OF EXPORT SCRIPT
-- ============================================================================

