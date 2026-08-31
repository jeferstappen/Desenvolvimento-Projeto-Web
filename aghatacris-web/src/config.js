/**
 * AGhataCris - Configurações Gerais do Sistema
 */

module.exports = {
  PORT: process.env.PORT || 3000,
  DEFAULT_RADIUS_KM: 15.0, // Raio padrão de 15km para RF03
  DEFAULT_PLATFORM_FEE_PERCENT: 10.0, // 10% de taxa padrão da plataforma
  DEFAULT_RESERVATION_TIMEOUT_MINUTES: 30, // 30 minutos de tolerância para salão (RF09)
  APP_NAME: 'AGhataCris',
  VERSION: '2.0.0 (Sprint 2)'
};
