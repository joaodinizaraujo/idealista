-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS db_ideas_system
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE db_ideas_system;

-- Tabela de perfis (profiles)
CREATE TABLE tb_profiles (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de usuários (users)
CREATE TABLE tb_users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    2fa_code VARCHAR(6),
    profile_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_profile FOREIGN KEY (profile_id) 
        REFERENCES tb_profiles(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    INDEX idx_email (email),
    INDEX idx_profile_id (profile_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de ideias (ideas)
CREATE TABLE tb_ideas (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(255) NOT NULL,
    owner_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_ideas_owner FOREIGN KEY (owner_id) 
        REFERENCES tb_users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    INDEX idx_owner_id (owner_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de votos (votes)
CREATE TABLE tb_votes (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    idea_id VARCHAR(255) NOT NULL,
    vote_type ENUM('UP', 'DOWN') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_votes_user FOREIGN KEY (user_id) 
        REFERENCES tb_users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_votes_idea FOREIGN KEY (idea_id) 
        REFERENCES tb_ideas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    UNIQUE KEY uk_user_idea_vote (user_id, idea_id),
    INDEX idx_user_id (user_id),
    INDEX idx_idea_id (idea_id),
    INDEX idx_vote_type (vote_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Perfis iniciais de ADM e normal
INSERT INTO tb_profiles (id, title, description, created_at) VALUES
('53eb37cc-c75d-4f0e-9d0f-0c0b93e03120', 'Administrador', 'Perfil com acesso total ao sistema, pode gerenciar usuários, ideias e configurações', NOW()),
('9a018850-e4fd-410e-a246-9fe5a132220e', 'Normal', 'Perfil padrão para usuários, pode criar ideias e votar', NOW());