# GlamGo (Desenvolvimento de Projeto Web)

Plataforma de beleza e bem-estar conectando **Clientes**, **Freelancers Autônomas** e **Salões Parceiros** (Lei do Salão Parceiro nº 13.352/2016).

---

## 🚀 Principais Funcionalidades

- **Módulo Cliente**:
  - Busca geolocalizada de profissionais e salões no raio de 15km via Fórmula de Haversine.
  - Agendamento de procedimentos com suporte a múltiplos serviços combinados.
  - Sistema de favoritos (favoritar profissionais e salões).
  - Chamados de pronto atendimento sob demanda.
  - Histórico completo de atendimentos e emissão de recibos detalhados.

- **Módulo Freelancer Autônoma**:
  - Dashboard operacional com radar geolocalizado de 15km em tempo real.
  - Controle de agenda interativo com marcação dinâmica de dias com atendimentos (pontos verdes).
  - Navegação semanal e visão mensal completa do calendário.
  - Reserva de cadeiras, macas e bancadas ociosas em salões parceiros (com timer garantido de 30 min).
  - Gestão de serviços ofertados com proteção de senha para cadastro e exclusão em modal dedicado.
  - Extrato financeiro transparente com cálculo de Split Payment.

- **Módulo Salão Parceiro**:
  - Anúncio e gestão de postos de trabalho ociosos.
  - Receita passiva garantida pela locação de espaços com repasse automatizado.

---

## 🛠️ Tecnologias e Arquitetura

- **Frontend**: HTML5 Semântico, Vanilla JavaScript (ES6+), Vanilla CSS3 com tokens de design minimalistas monocromáticos preto & branco, SPA Router baseado em hash, StateManager com Pub/Sub e PWA.
- **Backend**: Node.js (v24), Servidor HTTP RESTful nativo sem dependências externas pesadas.
- **Banco de Dados**: SQLite nativo (`node:sqlite` / `DatabaseSync`), modo WAL, integridade referencial ativa e transações ACID.
- **Segurança**: Criptografia de senhas com PBKDF2/SHA-512 e 100.000 iterações com salt seguro (`crypto.timingSafeEqual`).
- **Geolocalização**: Algoritmo de Haversine com precisão esférica.

---

## 📖 Documentação Completa das APIs

Para conferir o catálogo completo de endpoints REST (`/api/*`), schemas de banco, estruturas de requisição/resposta e regras de negócio, consulte o documento:
👉 **[DOCUMENTACAO_APIS_E_TECNOLOGIAS.md](./DOCUMENTACAO_APIS_E_TECNOLOGIAS.md)**

---

## 💻 Como Rodar o Projeto

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor:
   ```bash
   node server.js
   ```
3. Acesse no navegador:
   **`http://localhost:3000`**

### Testes Automatizados
```bash
# Testes do backend (banco, criptografia, haversine e modelos)
node test_backend.js

# Testes de integração de fluxos e split payment
node test_integration.js
```
