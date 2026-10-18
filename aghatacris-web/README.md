<div align="center">

# 💇‍♀️ AGhataCris

### Plataforma Web Responsiva de Pronto Atendimento Estético sob Demanda

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-0ea5e9?style=for-the-badge)]()
[![Licença](https://img.shields.io/badge/Licença-ISC-f59e0b?style=for-the-badge)]()

**Projeto Acadêmico — IFSP Birigui · Curso Superior de Tecnologia em Sistemas para Internet**
**Disciplina: Desenvolvimento de Projetos Web (2026)**

[🚀 Como Rodar](#-como-rodar-localmente) · [📋 Funcionalidades](#-funcionalidades) · [🏗️ Arquitetura](#️-arquitetura) · [📡 API REST](#-endpoints-da-api-rest) · [🗄️ Banco de Dados](#️-banco-de-dados)

</div>

---

## 📖 Sobre o Projeto

**AGhataCris** é uma plataforma web responsiva (PWA/SPA Mobile-First) que conecta **clientes** a **profissionais autônomos de estética** e **salões parceiros** em tempo real, com base em **geolocalização inteligente** e raio de busca de até 15 km.

O sistema resolve dois problemas simultâneos do mercado da beleza:

| Problema | Solução |
|---|---|
| Clientes precisam de atendimento estético urgente sem agendamento prévio | **Pronto Atendimento sob Demanda** — o profissional mais próximo aceita em tempo real |
| Profissionais autônomos pagam por espaços fixos mesmo sem movimento | **Aluguel de Cadeiras Ociosas** — salões parceiros anunciam espaços vagos por hora |

> Projeto desenvolvido em conformidade com a **Lei do Salão Parceiro (Lei nº 13.352/2016)** e as diretrizes de proteção de dados da **LGPD**.

---

## ✨ Funcionalidades

### 👤 Cliente (Consumidora Final)
- ✅ Cadastro com CPF e autenticação segura (PBKDF2/SHA-256)
- ✅ Radar de descoberta de profissionais num raio de **até 15 km** (Haversine)
- ✅ Mapa interativo com **Leaflet.js** mostrando profissionais próximas em tempo real
- ✅ Filtro de modalidade: **Em Domicílio** ou **No Salão Parceiro**
- ✅ Solicitação de **Pronto Atendimento Imediato** (sem agendamento)
- ✅ **Agendamento com calendário** (limite de 1 mês) e verificação de conflitos de horário
- ✅ Histórico de atendimentos e download de recibo
- ✅ Cadastro de **Cartão de Crédito** como forma de pagamento

### 💇‍♀️ Freelancer (Profissional Autônoma)
- ✅ Cadastro com CPF e perfil profissional completo
- ✅ Recepção e gestão de chamados pendentes em tempo real
- ✅ Listagem de **espaços ociosos** em salões parceiros por proximidade
- ✅ **Reserva expressa** de cadeira/maca com cronômetro de tolerância de 30 minutos
- ✅ Carteira virtual com extrato detalhado de **Split Payment**
- ✅ Cadastro de serviços ofertados via **Floating Action Button**
- ✅ Formas de recebimento: **Chave PIX** ou **Conta Corrente**

### 🏢 Salão Parceiro
- ✅ Cadastro com CNPJ (conforme Lei do Salão Parceiro)
- ✅ Publicação de espaços físicos ociosos (cadeiras, macas) com valor/hora
- ✅ Gestão do portfólio de espaços disponíveis
- ✅ Cadastro de serviços ofertados via **Floating Action Button**
- ✅ Recebimento via **Conta Corrente** (exclusivo para PJ)

### ⚡ Administrador da Plataforma
- ✅ Painel de métricas consolidadas: volume transacionado, receita, usuários ativos
- ✅ Mapa geográfico com distribuição de profissionais e clientes
- ✅ Controle deslizante para ajuste da taxa de retenção da plataforma (%)
- ✅ Auditoria de transações e Split Payment

---

## 🏗️ Arquitetura

```
aghatacris-web/
│
├── 📄 index.html              # Ponto de entrada do PWA (SPA)
├── 📄 server.js               # Servidor unificado (HTTP + REST API)
├── 📄 manifest.json           # Manifesto PWA
├── 📄 sw.js                   # Service Worker (cache offline)
│
├── 🎨 css/
│   ├── base.css               # Reset, variáveis, tipografia, layout
│   └── components.css         # Componentes: cards, modais, FAB, calendário
│
├── 🧠 js/
│   ├── app.js                 # Bootstrap da aplicação
│   ├── router.js              # SPA Router (hash-based)
│   ├── state.js               # Gerenciador de estado global
│   ├── api.js                 # Camada de comunicação com a API REST
│   ├── components/
│   │   ├── header.js
│   │   ├── modal.js
│   │   ├── navbar.js
│   │   ├── roleSwitcher.js    # Alternador de papéis (simulador)
│   │   └── agendamentoModal.js# FAB + Modal de agendamento com calendário
│   └── views/                 # Views do SPA (uma por rota)
│       ├── authView.js        # Login e Cadastro
│       ├── clienteHomeView.js
│       ├── freelancerHomeView.js
│       ├── salaoHomeView.js
│       ├── adminView.js
│       ├── perfilView.js
│       ├── editarPerfilView.js
│       └── pagamentoView.js
│
├── 🖥️ src/
│   ├── config.js
│   ├── controllers/
│   │   └── apiControllers.js
│   ├── models/
│   │   ├── UsuarioModel.js
│   │   ├── AtendimentoModel.js
│   │   ├── EspacoModel.js
│   │   ├── ServicoModel.js
│   │   ├── PagamentoModel.js
│   │   └── TransacaoModel.js
│   ├── routes/
│   │   └── apiRouter.js
│   └── utils/
│       ├── crypto.js          # PBKDF2/SHA-256
│       ├── haversine.js       # Cálculo de distância geográfica
│       └── splitPayment.js    # Motor de rateio financeiro
│
└── 🗄️ database/
    ├── schema.sql
    ├── aghatacris.db          # Banco SQLite com dados de teste
    └── migrate_services_payments.js
```

### Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| **Frontend** | HTML5 + CSS3 + JavaScript Vanilla | PWA/SPA sem framework, máxima performance |
| **Mapas** | Leaflet.js (CDN) | Open-source, leve, sem chave de API |
| **Backend** | Node.js 18+ (módulos nativos) | Zero dependências externas |
| **Banco de Dados** | SQLite 3 (modo WAL) | Embarcado, sem servidor separado |
| **Segurança** | PBKDF2 + Salt 16B (SHA-256) | Nativo `node:crypto` |
| **Geolocalização** | Haversine + Web Geolocation API | Cálculo server-side preciso |

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) **v18 ou superior**
- Git

> ⚡ **Não é necessário `npm install`** — o projeto usa apenas módulos nativos do Node.js, sem dependências externas!

### Passo a Passo

```bash
# 1. Clone o repositório
git clone https://github.com/jeferstappen/Desenvolvimento-Projeto-Web.git

# 2. Entre na pasta do projeto
cd Desenvolvimento-Projeto-Web/aghatacris-web

# 3. Inicie o servidor
node server.js
```

Acesse no navegador: **`http://localhost:3000/`**

```
======================================================
 🚀 Servidor AGhataCris Web & API REST Ativo!
 🌐 Frontend PWA: http://localhost:3000/
 📡 Health Check: http://localhost:3000/api/health
 📍 Raio de busca geográfico padrão: 15 km
======================================================
```

> O banco SQLite já vem populado com dados de teste prontos para demonstração!

---

## 📡 Endpoints da API REST

### Autenticação
| Método | Endpoint | Descrição |
|:---:|---|---|
| `POST` | `/api/auth/register` | Cadastro de novo usuário |
| `POST` | `/api/auth/login` | Autenticação |
| `GET` | `/api/auth/me` | Dados do usuário autenticado |

### Geolocalização & Descoberta
| Método | Endpoint | Descrição |
|:---:|---|---|
| `PUT` | `/api/usuarios/:id/localizacao` | Atualiza coordenadas GPS |
| `GET` | `/api/profissionais` | Lista profissionais no raio de 15 km |

### Atendimentos & Agendamentos
| Método | Endpoint | Descrição |
|:---:|---|---|
| `POST` | `/api/atendimentos` | Cria solicitação de atendimento |
| `GET` | `/api/atendimentos` | Lista atendimentos |
| `PUT` | `/api/atendimentos/:id/status` | Atualiza status |
| `GET` | `/api/agendamentos/ocupados` | Horários ocupados por profissional/data |

### Espaços Ociosos
| Método | Endpoint | Descrição |
|:---:|---|---|
| `POST` | `/api/espacos` | Publica espaço ocioso |
| `GET` | `/api/espacos` | Lista espaços disponíveis |
| `PUT` | `/api/espacos/:id/reserva` | Reserva espaço (cronômetro 30 min) |

### Serviços Ofertados
| Método | Endpoint | Descrição |
|:---:|---|---|
| `GET` | `/api/servicos/:usuarioId` | Lista serviços de um profissional |
| `POST` | `/api/servicos` | Cria novo serviço |
| `PUT` | `/api/servicos/:id` | Atualiza serviço |
| `DELETE` | `/api/servicos/:id` | Remove serviço |

### Formas de Pagamento
| Método | Endpoint | Descrição |
|:---:|---|---|
| `GET` | `/api/pagamentos/:usuarioId` | Lista formas de pagamento |
| `POST` | `/api/pagamentos` | Cadastra forma de pagamento |
| `DELETE` | `/api/pagamentos/:id` | Remove forma de pagamento |

### Administração
| Método | Endpoint | Descrição |
|:---:|---|---|
| `GET` | `/api/admin/metricas` | Métricas consolidadas |
| `PUT` | `/api/admin/taxa` | Atualiza taxa de retenção |

---

## 🗄️ Banco de Dados

### Tabelas Principais

| Tabela | Descrição |
|---|---|
| `usuario` | Clientes, freelancers, salões e admin (CPF/CNPJ, coordenadas GPS) |
| `atendimento` | Chamados com status, valor, data/hora de agendamento |
| `espaco` | Cadeiras/macas anunciadas por salões parceiros |
| `transacao` | Registro contábil do Split Payment |
| `servico_ofertado` | Portfólio de serviços de freelancers e salões |
| `forma_pagamento_usuario` | Cartões, chaves PIX e contas correntes tokenizados |
| `configuracao_plataforma` | Taxa de retenção e parâmetros globais |

### Regras de Split Payment (Lei nº 13.352/2016)

```
Valor Total do Serviço
    ├── 10% ──────────► Plataforma AGhataCris
    ├── R$ X ──────────► Salão Parceiro (aluguel da cadeira)
    └── Restante ──────► Profissional Autônoma (valor líquido)
```

---

## 🔐 Segurança

| Mecanismo | Implementação |
|---|---|
| **Hashing de Senhas** | PBKDF2 + Salt 16B + SHA-256 (100.000 iterações) |
| **CPF/CNPJ Imutáveis** | Bloqueados para edição após cadastro |
| **Tokenização de Pagamentos** | Apenas últimos 4 dígitos armazenados |
| **Confirmação por Senha** | Requerida para criação de serviços ofertados |
| **Limite de Agendamento** | Máximo 1 mês a partir da data atual |

---

## 📋 Requisitos Funcionais

| Código | Requisito | Status |
|:---:|---|:---:|
| **RF01** | Cadastro e Autenticação (4 perfis) | ✅ |
| **RF02** | Captura e Atualização de Geolocalização | ✅ |
| **RF03** | Radar de Proximidade (≤ 15 km, Haversine) | ✅ |
| **RF04** | Seleção de Modalidade (Domicílio / Salão) | ✅ |
| **RF05** | Solicitação de Pronto Atendimento | ✅ |
| **RF06** | Gestão de Chamados pela Freelancer | ✅ |
| **RF07** | Anúncio de Espaços Ociosos pelo Salão | ✅ |
| **RF08** | Listagem de Espaços por Proximidade | ✅ |
| **RF09** | Reserva Expressa com Cronômetro (30 min) | ✅ |
| **RF10** | Split Payment Automático | ✅ |

---

## 📁 Documentação

| Documento | Descrição |
|---|---|
| [`DOCUMENTACAO_1A_ETAPA_PONTO_DE_REFERENCIA.md`](./DOCUMENTACAO_1A_ETAPA_PONTO_DE_REFERENCIA.md) | Baseline da 1ª Etapa: Requisitos e Testes Manuais CTM-01 a CTM-17 |
| [`DOCUMENTACAO_INTEGRACAO_MODULO_1.md`](./DOCUMENTACAO_INTEGRACAO_MODULO_1.md) | Integração do Módulo 1 |
| [`DOCUMENTACAO_SPRINT_2.md`](./DOCUMENTACAO_SPRINT_2.md) | Relatório da Sprint 2 |
| [`database/schema.sql`](./database/schema.sql) | DDL completo do banco SQLite |

---

## 🎓 Informações Acadêmicas

| Campo | Informação |
|---|---|
| **Instituição** | IFSP — Instituto Federal de São Paulo, Câmpus Birigui |
| **Curso** | Tecnologia em Sistemas para Internet |
| **Disciplina** | Desenvolvimento de Projetos Web (2026) |
| **Discente** | Jeferson Fernando |

---

<div align="center">

</div>
