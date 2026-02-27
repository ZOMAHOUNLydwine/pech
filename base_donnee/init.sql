-- Database initialization script for the Language Learning Platform

-- Extension for UUID generation if needed
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: languages
CREATE TABLE IF NOT EXISTS languages (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    native_name VARCHAR(100),
    flag VARCHAR(255),
    is_beninese BOOLEAN DEFAULT FALSE
);

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar VARCHAR(255),
    target_language_id VARCHAR(10) REFERENCES languages(id),
    learning_goal VARCHAR(50),
    current_level VARCHAR(50),
    learning_type VARCHAR(50),
    learning_mode VARCHAR(50) DEFAULT 'immersion',
    streak INTEGER DEFAULT 0,
    xp INTEGER DEFAULT 0,
    daily_goal INTEGER,
    is_premium BOOLEAN DEFAULT FALSE,
    subscription_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: badges
CREATE TABLE IF NOT EXISTS badges (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
);

-- Table: quests
CREATE TABLE IF NOT EXISTS quests (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    total_steps INTEGER NOT NULL,
    xp_reward INTEGER NOT NULL,
    classic_content TEXT,
    audio_url VARCHAR(255),
    audio_duration VARCHAR(10)
);

-- Join Table: user_badges
CREATE TABLE IF NOT EXISTS user_badges (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    badge_id VARCHAR(50) REFERENCES badges(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, badge_id)
);

-- Table: user_skills
CREATE TABLE IF NOT EXISTS user_skills (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    skill_name VARCHAR(50) NOT NULL, -- 'Ecoute', 'Lecture', etc.
    level INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, skill_name)
);

-- Table: user_completed_quests
CREATE TABLE IF NOT EXISTS user_completed_quests (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    quest_id VARCHAR(50) REFERENCES quests(id) ON DELETE CASCADE,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, quest_id)
);

-- SEED DATA

-- Languages
INSERT INTO languages (id, name, native_name, flag, is_beninese) VALUES
('fr', 'Français', NULL, '🇫🇷', FALSE),
('en', 'English', NULL, '🇬🇧', FALSE),
('es', 'Español', NULL, '🇪🇸', FALSE),
('fon', 'Fon', 'Fɔngbè', '🇧🇯', TRUE),
('yo', 'Yoruba', 'Yorùbá', '🇧🇯', TRUE),
('goun', 'Goun', 'Gungbe', '🇧🇯', TRUE),
('bariba', 'Bariba', 'Baatɔnum', '🇧🇯', TRUE),
('dendi', 'Dendi', 'Dendi', '🇧🇯', TRUE),
('adja', 'Adja', 'Ajagbe', '🇧🇯', TRUE),
('ditammari', 'Ditammari', 'Ditammari', '🇧🇯', TRUE),
('mina', 'Mina', 'Gen', '🇹🇬', TRUE),
('anii', 'Anii', 'Anii', '🇧🇯', TRUE),
('fulfulde', 'Fulfulde', 'Peul', '🇧🇯', TRUE),
('mahi', 'Mahi', 'Maxí', '🇧🇯', TRUE),
('idaatcha', 'Idaatcha', 'Idaatcha', '🇧🇯', TRUE),
('ife', 'Ifè', 'Ifè', '🇧🇯', TRUE),
('waama', 'Waama', 'Waama', '🇧🇯', TRUE),
('tem', 'Tem', 'Kotokoli', '🇧🇯', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Quests
INSERT INTO quests (id, title, description, category, total_steps, xp_reward, classic_content, audio_url, audio_duration) VALUES
('q1', 'Saluer correctement', 'Apprenez les salutations de base et le respect des aînés.', 'basics', 5, 100, '# Les Salutations\n\nAu Bénin, la salutation est un rituel important...', '/audio/salutations.mp3', '3:45'),
('q2', 'Se présenter', 'Dire qui vous êtes, d''où vous venez et ce que vous faites.', 'daily', 4, 150, '# Se présenter\n\nJe m''appelle...', '/audio/presentation.mp3', '4:20'),
('q3', 'Au marché', 'Négocier les prix et acheter des ingrédients locaux.', 'daily', 6, 200, '# Au marché\n\nCombien coûte ceci ?...', '/audio/marche.mp3', '5:10'),
('q4', 'Proverbes & Sagesse', 'Comprendre la philosophie derrière les mots.', 'culture', 3, 300, '# Proverbes\n\nLa patience est un chemin d''or...', '/audio/proverbes.mp3', '6:00')
ON CONFLICT (id) DO NOTHING;

-- Mock Admin User
INSERT INTO users (name, email, learning_mode, streak, xp) VALUES
('Admin', 'admin@example.com', 'immersion', 0, 0)
ON CONFLICT (email) DO NOTHING;

-- Initial Skills for Admin (assuming ID 1)
INSERT INTO user_skills (user_id, skill_name, level) VALUES
(1, 'Ecoute', 10),
(1, 'Lecture', 5),
(1, 'Expression', 0),
(1, 'Ecriture', 0)
ON CONFLICT (user_id, skill_name) DO NOTHING;
