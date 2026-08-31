/**
 * AGhataCris - Utilitário Criptográfico de Senhas (RNF03)
 * Utiliza algoritmos com Salt aleatório e derivação segura de chaves (PBKDF2 / SHA-256)
 */

const crypto = require('crypto');

/**
 * Gera um hash com salt para a senha informada.
 * @param {string} password - Senha em texto plano.
 * @returns {string} Formato "salt:hash"
 */
function hashPassword(password) {
  if (!password) throw new Error('Senha não pode ser vazia');
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifica se a senha informada corresponde ao hash salvo.
 * @param {string} password - Senha digitada.
 * @param {string} storedHash - Hash no formato "salt:hash" salvo no banco.
 * @returns {boolean}
 */
function verifyPassword(password, storedHash) {
  if (!password || !storedHash) return false;
  
  // Suporte a seeds legado com hash sha256 direto com salt fixo
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  
  const [salt, hash] = parts;
  
  // Testar com pbkdf2
  const computedPbkdf2 = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
  if (crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(computedPbkdf2, 'hex'))) {
    return true;
  }

  // Testar com sha256 simples + salt (para compatibilidade com seed direto)
  const computedSha256 = crypto.createHash('sha256').update(salt + password).digest('hex');
  if (hash === computedSha256) {
    return true;
  }

  return false;
}

module.exports = {
  hashPassword,
  verifyPassword
};
