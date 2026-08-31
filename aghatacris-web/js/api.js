/**
 * AGhataCris - Cliente HTTP REST API Frontend (Sprint 2)
 * Conecta o cliente PWA com os endpoints RESTful do servidor.
 */

const API_BASE = '/api';

window.API = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Erro HTTP ${response.status}`);
      }
      return data;
    } catch (err) {
      console.warn(`[API Error: ${endpoint}]`, err.message);
      throw err;
    }
  },

  // Auth & Usuários
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async login(email, senha) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha })
    });
  },

  async getMe(id) {
    return this.request(`/auth/me?id_usuario=${id || 1}`);
  },

  async updateLocation(userId, latitude, longitude) {
    return this.request(`/usuarios/${userId}/localizacao`, {
      method: 'PUT',
      body: JSON.stringify({ latitude, longitude })
    });
  },

  async listUsers(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/usuarios?${qs}`);
  },

  // Profissionais com cálculo geográfico Haversine (RF03, RF04, RNF01)
  async getNearbyProfessionals(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/profissionais?${qs}`);
  },

  // Espaços Ociosos do Salão Parceiro (RF07, RF08, RF09)
  async listEspacos(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/espacos?${qs}`);
  },

  async createEspaco(espacoData) {
    return this.request('/espacos', {
      method: 'POST',
      body: JSON.stringify(espacoData)
    });
  },

  async reserveEspaco(idEspaco, idFreelancer) {
    return this.request(`/espacos/${idEspaco}/reserva`, {
      method: 'PUT',
      body: JSON.stringify({ id_freelancer: idFreelancer })
    });
  },

  async toggleEspacoStatus(idEspaco) {
    return this.request(`/espacos/${idEspaco}/status`, {
      method: 'PUT'
    });
  },

  // Atendimentos & Split Payment (RF05, RF06, RF10)
  async listAtendimentos(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/atendimentos?${qs}`);
  },

  async createAtendimento(atendimentoData) {
    return this.request('/atendimentos', {
      method: 'POST',
      body: JSON.stringify(atendimentoData)
    });
  },

  async updateAtendimentoStatus(idAtendimento, status) {
    return this.request(`/atendimentos/${idAtendimento}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  // Admin & Métricas
  async getAdminMetricas() {
    return this.request('/admin/metricas');
  },

  async updateAdminTaxa(taxa) {
    return this.request('/admin/taxa', {
      method: 'PUT',
      body: JSON.stringify({ taxa })
    });
  },

  async healthCheck() {
    return this.request('/health');
  }
};
