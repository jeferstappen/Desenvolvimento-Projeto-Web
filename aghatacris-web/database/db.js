/**
 * AGhataCris - Conexão e Inicialização do Banco de Dados Relacional
 * Utiliza o driver relacional nativo com suporte a chaves estrangeiras, índices e transações ACID.
 */

const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'aghatacris.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');
const SEED_PATH = path.join(__dirname, 'seed.sql');

class DatabaseConnection {
  constructor(customPath) {
    this.dbPath = customPath || DB_PATH;
    this.db = null;
    this.init();
  }

  init() {
    try {
      this.db = new DatabaseSync(this.dbPath);
      // Habilitar integridade de chaves estrangeiras e journal WAL para alta concorrência
      this.db.exec('PRAGMA foreign_keys = ON;');
      this.db.exec('PRAGMA journal_mode = WAL;');

      // Executar schema se tabelas não existirem
      if (fs.existsSync(SCHEMA_PATH)) {
        const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
        this.db.exec(schemaSql);
      }

      // Verificar se tabela usuario possui dados, se não, aplicar seed
      const userCount = this.db.prepare('SELECT COUNT(*) AS count FROM usuario').get();
      if (!userCount || userCount.count === 0) {
        if (fs.existsSync(SEED_PATH)) {
          const seedSql = fs.readFileSync(SEED_PATH, 'utf8');
          this.db.exec(seedSql);
          console.log('✅ Banco de dados relacional inicializado com dados de seed com sucesso.');
        }
      }
    } catch (err) {
      console.error('❌ Erro ao inicializar o banco de dados:', err);
      throw err;
    }
  }

  query(sql, params = []) {
    try {
      const stmt = this.db.prepare(sql);
      return stmt.all(...params);
    } catch (err) {
      console.error(`Erro na consulta SQL: "${sql}"`, err);
      throw err;
    }
  }

  queryOne(sql, params = []) {
    try {
      const stmt = this.db.prepare(sql);
      return stmt.get(...params) || null;
    } catch (err) {
      console.error(`Erro na consulta SQL One: "${sql}"`, err);
      throw err;
    }
  }

  run(sql, params = []) {
    try {
      const stmt = this.db.prepare(sql);
      return stmt.run(...params);
    } catch (err) {
      console.error(`Erro na execução SQL: "${sql}"`, err);
      throw err;
    }
  }

  exec(sql) {
    return this.db.exec(sql);
  }

  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Singleton de conexão global
const dbInstance = new DatabaseConnection();

module.exports = {
  db: dbInstance,
  DatabaseConnection
};
