-- ============================================================================
-- SmashScore Complete Database Migration Script
-- All-in-one script to export from OLD and prepare for NEW Supabase project
-- ============================================================================
-- This script generates INSERT statements for all tables
-- Run in OLD Supabase project, then copy output to new project
-- ============================================================================
-- NOTE: This script uses string aggregation which may have limitations
-- For better results, use export_all_data.sql instead
-- ============================================================================

-- Generate all INSERT statements in correct order
-- Run each section separately and combine the outputs

-- PLAYERS
SELECT 
    '-- PLAYERS DATA' || E'\n' ||
    string_agg(
        'INSERT INTO players (id, created_at, name, image_url, active) VALUES (' ||
        quote_literal(id::text) || '::uuid, ' ||
        quote_literal(created_at) || '::timestamptz, ' ||
        quote_literal(name) || ', ' ||
        COALESCE(quote_literal(image_url), 'NULL') || ', ' ||
        COALESCE(active::text, 'true') ||
        ');',
        E'\n'
    ) AS players_export
FROM players;

-- TEAMS
SELECT 
    '-- TEAMS DATA' || E'\n' ||
    string_agg(
        'INSERT INTO teams (id, created_at, player_1_id, player_2_id) VALUES (' ||
        quote_literal(id::text) || '::uuid, ' ||
        quote_literal(created_at) || '::timestamptz, ' ||
        quote_literal(player_1_id::text) || '::uuid, ' ||
        COALESCE(quote_literal(player_2_id::text) || '::uuid', 'NULL') ||
        ');',
        E'\n'
    ) AS teams_export
FROM teams;

-- TOURNAMENTS
SELECT 
    '-- TOURNAMENTS DATA' || E'\n' ||
    string_agg(
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
        ');',
        E'\n'
    ) AS tournaments_export
FROM tournaments;

-- TOURNAMENT_PARTICIPANTS
SELECT 
    '-- TOURNAMENT_PARTICIPANTS DATA' || E'\n' ||
    string_agg(
        'INSERT INTO tournament_participants (tournament_id, team_id) VALUES (' ||
        quote_literal(tournament_id::text) || '::uuid, ' ||
        quote_literal(team_id::text) || '::uuid' ||
        ');',
        E'\n'
    ) AS participants_export
FROM tournament_participants;

-- MATCHES
SELECT 
    '-- MATCHES DATA' || E'\n' ||
    string_agg(
        'INSERT INTO matches (id, created_at, tournament_id, team_1_id, team_2_id, winner_team_id, tag, match_date) VALUES (' ||
        quote_literal(id::text) || '::uuid, ' ||
        quote_literal(created_at) || '::timestamptz, ' ||
        quote_literal(tournament_id::text) || '::uuid, ' ||
        quote_literal(team_1_id::text) || '::uuid, ' ||
        COALESCE(quote_literal(team_2_id::text) || '::uuid', 'NULL') || ', ' ||
        COALESCE(quote_literal(winner_team_id::text) || '::uuid', 'NULL') || ', ' ||
        COALESCE(quote_literal(tag), 'NULL') || ', ' ||
        quote_literal(match_date) || '::timestamptz' ||
        ');',
        E'\n'
    ) AS matches_export
FROM matches;

-- MATCH_SCORES
SELECT 
    '-- MATCH_SCORES DATA' || E'\n' ||
    string_agg(
        'INSERT INTO match_scores (id, match_id, game_number, team_1_score, team_2_score) VALUES (' ||
        quote_literal(id::text) || '::uuid, ' ||
        quote_literal(match_id::text) || '::uuid, ' ||
        game_number || ', ' ||
        team_1_score || ', ' ||
        team_2_score ||
        ');',
        E'\n'
    ) AS scores_export
FROM match_scores;

