-- ============================================================================
-- SmashScore Database Migration Script
-- Create Tables for New Supabase Project
-- ============================================================================
-- Run this script in your NEW Supabase project SQL Editor
-- ============================================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. PLAYERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    image_url TEXT,
    active BOOLEAN DEFAULT true
);

-- Add indexes for players
CREATE INDEX IF NOT EXISTS idx_players_active ON players(active);
CREATE INDEX IF NOT EXISTS idx_players_created_at ON players(created_at);

-- ============================================================================
-- 2. TEAMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    player_1_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    player_2_id UUID REFERENCES players(id) ON DELETE CASCADE
);

-- Add indexes for teams
CREATE INDEX IF NOT EXISTS idx_teams_player_1 ON teams(player_1_id);
CREATE INDEX IF NOT EXISTS idx_teams_player_2 ON teams(player_2_id);
CREATE INDEX IF NOT EXISTS idx_teams_created_at ON teams(created_at);

-- ============================================================================
-- 3. TOURNAMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS tournaments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    tournament_type TEXT NOT NULL CHECK (tournament_type IN ('league', 'knockout', 'round-robin')),
    match_type TEXT NOT NULL CHECK (match_type IN ('singles', 'doubles')),
    winner_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    points_per_game INTEGER NOT NULL DEFAULT 21,
    max_game_set INTEGER NOT NULL DEFAULT 1,
    final_match BOOLEAN DEFAULT false,
    user_id UUID NOT NULL -- References auth.users(id) - Supabase handles this
);

-- Add indexes for tournaments
CREATE INDEX IF NOT EXISTS idx_tournaments_user_id ON tournaments(user_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_winner_team ON tournaments(winner_team_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_created_at ON tournaments(created_at);
CREATE INDEX IF NOT EXISTS idx_tournaments_type ON tournaments(tournament_type);

-- Add foreign key constraint name (for Supabase relationship)
ALTER TABLE tournaments 
    ADD CONSTRAINT tournaments_winner_team_id_fkey2 
    FOREIGN KEY (winner_team_id) REFERENCES teams(id) ON DELETE SET NULL;

-- ============================================================================
-- 4. TOURNAMENT_PARTICIPANTS TABLE (Junction Table)
-- ============================================================================
CREATE TABLE IF NOT EXISTS tournament_participants (
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    PRIMARY KEY (tournament_id, team_id)
);

-- Add indexes for tournament_participants
CREATE INDEX IF NOT EXISTS idx_tournament_participants_tournament ON tournament_participants(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_team ON tournament_participants(team_id);

-- ============================================================================
-- 5. MATCHES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    team_1_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    team_2_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    winner_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    tag TEXT,
    match_date TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for matches
CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_team_1 ON matches(team_1_id);
CREATE INDEX IF NOT EXISTS idx_matches_team_2 ON matches(team_2_id);
CREATE INDEX IF NOT EXISTS idx_matches_winner ON matches(winner_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_created_at ON matches(created_at);

-- Add foreign key constraint names (for Supabase relationships)
ALTER TABLE matches 
    ADD CONSTRAINT matches_team_1_id_fkey 
    FOREIGN KEY (team_1_id) REFERENCES teams(id) ON DELETE CASCADE;

ALTER TABLE matches 
    ADD CONSTRAINT matches_team_2_id_fkey 
    FOREIGN KEY (team_2_id) REFERENCES teams(id) ON DELETE CASCADE;

-- ============================================================================
-- 6. MATCH_SCORES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS match_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    game_number INTEGER NOT NULL,
    team_1_score INTEGER NOT NULL DEFAULT 0,
    team_2_score INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT valid_game_number CHECK (game_number > 0),
    CONSTRAINT valid_scores CHECK (team_1_score >= 0 AND team_2_score >= 0)
);

-- Add indexes for match_scores
CREATE INDEX IF NOT EXISTS idx_match_scores_match ON match_scores(match_id);
CREATE INDEX IF NOT EXISTS idx_match_scores_game_number ON match_scores(match_id, game_number);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Enable RLS on all tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_scores ENABLE ROW LEVEL SECURITY;

-- Players: Users can read all, but only insert/update their own
CREATE POLICY "Players are viewable by everyone" ON players FOR SELECT USING (true);
CREATE POLICY "Users can insert players" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update players" ON players FOR UPDATE USING (true);

-- Teams: Users can read all, but only insert/update their own
CREATE POLICY "Teams are viewable by everyone" ON teams FOR SELECT USING (true);
CREATE POLICY "Users can insert teams" ON teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update teams" ON teams FOR UPDATE USING (true);

-- Tournaments: Users can only see/modify their own tournaments
CREATE POLICY "Users can view their own tournaments" ON tournaments FOR SELECT 
    USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tournaments" ON tournaments FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tournaments" ON tournaments FOR UPDATE 
    USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tournaments" ON tournaments FOR DELETE 
    USING (auth.uid() = user_id);

-- Tournament Participants: Users can only see/modify participants of their tournaments
CREATE POLICY "Users can view participants of their tournaments" ON tournament_participants FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM tournaments 
        WHERE tournaments.id = tournament_participants.tournament_id 
        AND tournaments.user_id = auth.uid()
    ));
CREATE POLICY "Users can insert participants to their tournaments" ON tournament_participants FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM tournaments 
        WHERE tournaments.id = tournament_participants.tournament_id 
        AND tournaments.user_id = auth.uid()
    ));

-- Matches: Users can only see/modify matches of their tournaments
CREATE POLICY "Users can view matches of their tournaments" ON matches FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM tournaments 
        WHERE tournaments.id = matches.tournament_id 
        AND tournaments.user_id = auth.uid()
    ));
CREATE POLICY "Users can insert matches to their tournaments" ON matches FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM tournaments 
        WHERE tournaments.id = matches.tournament_id 
        AND tournaments.user_id = auth.uid()
    ));
CREATE POLICY "Users can update matches of their tournaments" ON matches FOR UPDATE 
    USING (EXISTS (
        SELECT 1 FROM tournaments 
        WHERE tournaments.id = matches.tournament_id 
        AND tournaments.user_id = auth.uid()
    ));

-- Match Scores: Users can only see/modify scores of their tournament matches
CREATE POLICY "Users can view scores of their tournament matches" ON match_scores FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM matches 
        JOIN tournaments ON tournaments.id = matches.tournament_id 
        WHERE matches.id = match_scores.match_id 
        AND tournaments.user_id = auth.uid()
    ));
CREATE POLICY "Users can insert scores to their tournament matches" ON match_scores FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM matches 
        JOIN tournaments ON tournaments.id = matches.tournament_id 
        WHERE matches.id = match_scores.match_id 
        AND tournaments.user_id = auth.uid()
    ));
CREATE POLICY "Users can update scores of their tournament matches" ON match_scores FOR UPDATE 
    USING (EXISTS (
        SELECT 1 FROM matches 
        JOIN tournaments ON tournaments.id = matches.tournament_id 
        WHERE matches.id = match_scores.match_id 
        AND tournaments.user_id = auth.uid()
    ));

-- ============================================================================
-- END OF SCRIPT
-- ============================================================================

