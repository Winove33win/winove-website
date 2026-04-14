-- =========================================
-- Sistema de Propostas Comerciais
-- Schema MariaDB / MySQL
-- =========================================

CREATE DATABASE IF NOT EXISTS propostas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE propostas_db;

-- Tabela de usuários (admin único)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Dados da empresa (configurações)
CREATE TABLE IF NOT EXISTS company_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL DEFAULT '',
  cnpj VARCHAR(30) DEFAULT '',
  address TEXT DEFAULT '',
  city VARCHAR(100) DEFAULT '',
  state VARCHAR(50) DEFAULT '',
  zip VARCHAR(20) DEFAULT '',
  phone VARCHAR(50) DEFAULT '',
  email VARCHAR(255) DEFAULT '',
  website VARCHAR(255) DEFAULT '',
  logo_path VARCHAR(500) DEFAULT '',
  bank_name VARCHAR(100) DEFAULT '',
  bank_agency VARCHAR(50) DEFAULT '',
  bank_account VARCHAR(50) DEFAULT '',
  bank_pix VARCHAR(255) DEFAULT '',
  footer_text TEXT DEFAULT '',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Insert configuração inicial vazia
INSERT INTO company_settings (id) VALUES (1) ON DUPLICATE KEY UPDATE id=1;

-- Tabela de propostas
CREATE TABLE IF NOT EXISTS proposals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  proposal_number VARCHAR(50) UNIQUE NOT NULL,
  status ENUM('rascunho','enviada','em_negociacao','aprovada','rejeitada','cancelada') DEFAULT 'rascunho',

  -- Dados do cliente
  client_name VARCHAR(255) DEFAULT '',
  client_company VARCHAR(255) DEFAULT '',
  client_email VARCHAR(255) DEFAULT '',
  client_phone VARCHAR(50) DEFAULT '',
  client_cnpj VARCHAR(30) DEFAULT '',
  client_address TEXT DEFAULT '',
  client_city VARCHAR(100) DEFAULT '',
  client_state VARCHAR(50) DEFAULT '',
  client_contact_name VARCHAR(255) DEFAULT '',

  -- Dados da proposta
  proposal_title VARCHAR(255) DEFAULT '',
  responsible VARCHAR(255) DEFAULT '',
  validity_days INT DEFAULT 30,
  proposal_date DATE,
  valid_until DATE,

  -- Detalhes do projeto
  project_description TEXT DEFAULT '',
  project_objectives TEXT DEFAULT '',
  project_scope TEXT DEFAULT '',
  out_of_scope TEXT DEFAULT '',

  -- Estrutura técnica (JSON arrays/objects)
  technologies JSON,
  architecture TEXT DEFAULT '',
  integrations TEXT DEFAULT '',
  requirements TEXT DEFAULT '',

  -- Entregas (JSON array: [{title, description, deadline}])
  deliverables JSON,

  -- Cronograma (JSON array: [{phase, description, duration, start_week}])
  timeline JSON,

  -- Financeiro
  total_value DECIMAL(15,2) DEFAULT 0,
  discount_value DECIMAL(15,2) DEFAULT 0,
  final_value DECIMAL(15,2) DEFAULT 0,
  payment_method VARCHAR(100) DEFAULT '',
  payment_conditions TEXT DEFAULT '',
  installments INT DEFAULT 1,

  -- Condições
  warranty_months INT DEFAULT 3,
  warranty_description TEXT DEFAULT '',
  sla_response_time VARCHAR(100) DEFAULT '',
  support_description TEXT DEFAULT '',
  general_conditions TEXT DEFAULT '',

  -- Notas internas (não aparecem no PDF)
  internal_notes TEXT DEFAULT '',

  -- Controle
  sent_at TIMESTAMP NULL,
  approved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Índices
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_client ON proposals(client_company);
CREATE INDEX idx_proposals_date ON proposals(created_at);
