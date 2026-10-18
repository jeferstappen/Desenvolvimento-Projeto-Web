<div align="center">

# 💇‍♀️ GlamGo

### Plataforma Web Responsiva de Pronto Atendimento Estético sob Demanda

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-000000?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3-000000?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-000000?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Maps-000000?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Status](https://img.shields.io/badge/Status-Concluído%20(Etapa%20Final)-000000?style=for-the-badge)]()
[![Licença](https://img.shields.io/badge/Licença-ISC-000000?style=for-the-badge)]()

**Projeto Acadêmico — IFSP Birigui · Curso Superior de Tecnologia em Sistemas para Internet**  
**Disciplina: Desenvolvimento de Projetos Web (2026)**

[🚀 Como Rodar](#-como-rodar-localmente) · [📋 Funcionalidades](#-funcionalidades) · [🏗️ Arquitetura](#️-arquitetura) · [📡 API REST](#-endpoints-da-api-rest) · [🗄️ Banco de Dados](#️-banco-de-dados) · [🔄 Relatório de Alterações](#-relatório-de-alterações-etapa-final)

</div>

---

## 📖 Sobre o Projeto

**GlamGo** é uma plataforma web responsiva (PWA/SPA Mobile-First) com design minimalista em **Preto e Branco**, desenvolvida para conectar **clientes** a **profissionais autônomos de estética** e **salões parceiros** em tempo real, utilizando **geolocalização inteligente** (raio de busca de até 15 km)[cite: 2, 4, 9, 11].

O sistema soluciona as principais ineficiências do mercado estético tradicional:
* **Para as Clientes:** Atendimento estético urgente sob demanda (sem a rigidez de agendamentos prolongados), permitindo escolher atendimento em domicílio ou na infraestrutura de um salão parceiro[cite: 2, 8, 9].
* **Para os Profissionais Freelancers:** Oportunidade de rentabilizar horas ociosas e acessar espaços de alto padrão sem os custos fixos de manter um ponto comercial[cite: 2, 5].
* **Para os Salões Parceiros:** Monetização de ativos ociosos (cadeiras e macas vazias) amparada juridicamente pela **Lei do Salão Parceiro (Lei nº 13.352/2016)**[cite: 3, 5, 20].

---

## ✨ Funcionalidades

### 👤 Cliente (Consumidora Final)
* Cadastro com validação de **CPF** e autenticação segura baseada em PBKDF2/SHA-256[cite: 23, 27].
* Radar de descoberta de profissionais num raio de até 15 km utilizando a fórmula de **Haversine**[cite: 10, 27].
* Mapa interativo com **Leaflet.js** para visualização espacial em tempo real.
* Seleção de modalidade: **Em Domicílio** ou **No Salão Parceiro**[cite: 9].
* Solicitação de pronto atendimento imediato ou agendamento via **calendário interativo** (com limite de 1 mês e bloqueio dinâmico de horários em conflito).
* Histórico de atendimentos com opção de download de recibos e gerenciamento de **Cartão de Crédito**.

### 💇‍♀️ Freelancer (Profissional Autônoma)
* Cadastro com CPF e perfis de atendimento customizados.
* Recepção, aceite ou recusa de chamados de clientes próximos em tempo real[cite: 10].
* Busca e **reserva expressa** de cadeiras ociosas em salões parceiros (com cronômetro de tolerância de 30 minutos)[cite: 9, 10, 24].
* Carteira digital com extrato detalhado de repasses e **Split Payment** automático[cite: 4, 19, 27].
* Cadastro rápido de serviços ofertados diretamente na interface por meio de um **Floating Action Button (FAB)**.
* Recebimento financeiro configurável via **Chave PIX** ou **Conta Corrente**.

### 🏢 Salão Parceiro
* Cadastro corporativo validado por **CNPJ** (em conformidade com a Lei do Salão Parceiro)[cite: 3].
* Painel de anúncio e gestão de infraestruturas físicas ociosas (preço por hora e tipo de espaço)[cite: 10, 20].
* Inclusão de serviços adicionais via **Floating Action Button (FAB)**.
* Recebimento de receita passiva mensal estruturado obrigatoriamente via **Conta Corrente**[cite: 20].

### ⚡ Administrador da Plataforma
* Dashboard analítico de métricas consolidadas (volume transacionado, receita e usuários ativos).
* Mapeamento geográfico global de clientes e prestadores.
* Configuração dinâmica da taxa de retenção administrativa da plataforma.

---

## 🏗️ Arquitetura do Sistema

glamgo-web/│├── 📄 index.html              # Ponto de entrada do PWA (SPA)├── 📄 server.js               # Servidor unificado (HTTP + REST API)├── 📄 manifest.json           # Manifesto PWA├── 📄 sw.js                   # Service Worker (cache offline)│├── 🎨 css/│   ├── base.css               # Reset, variáveis, tipografia P&B, layout│   └── components.css         # Componentes: cards, modais, FAB, calendário│├── 🧠 js/│   ├── app.js                 # Bootstrap da aplicação│   ├── router.js              # SPA Router (hash-based)│   ├── state.js               # Gerenciador de estado global│   ├── api.js                 # Camada de comunicação com a API REST│   ├── components/│   │   ├── header.js│   │   ├── modal.js│   │   ├── navbar.js│   │   ├── roleSwitcher.js    # Alternador de papéis (simulador)│   │   └── agendamentoModal.js# FAB + Modal de agendamento com calendário│   └── views/                 # Views do SPA (uma por rota)│       ├── authView.js        # Login e Cadastro (com CPF/CNPJ)│       ├── clienteHomeView.js│       ├── freelancerHomeView.js│       ├── salaoHomeView.js│       ├── adminView.js│       ├── perfilView.js│       ├── editarPerfilView.js│       └── pagamentoView.js│├── 🖥️ src/│   ├── config.js│   ├── controllers/│   │   └── apiControllers.js│   ├── models/│   │   ├── UsuarioModel.js│   │   ├── AtendimentoModel.js│   │   ├── EspacoModel.js│   │   ├── ServicoModel.js│   │   ├── PagamentoModel.js│   │   └── TransacaoModel.js│   ├── routes/│   │   └── apiRouter.js│   └── utils/│       ├── crypto.js          # PBKDF2/SHA-256│       ├── haversine.js       # Cálculo de distância geográfica│       └── splitPayment.js    # Motor de rateio financeiro│└── 🗄️ database/├── schema.sql├── glamgo.db              # Banco SQLite com dados de teste└── migrate_services_payments.js
### Stack Tecnológica
* **Frontend:** HTML5, CSS3 e JavaScript Vanilla estruturado em arquitetura PWA/SPA modular.
* **Mapeamento:** Biblioteca **Leaflet.js** integrada via CDN para renderização de mapas vetoriais.
* **Backend:** **Node.js (v18+)** executando rotas nativas e controlando requisições REST sem dependências externas de terceiros.
* **Persistência de Dados:** **SQLite 3** operando em modo WAL (Write-Ahead Logging) com suporte a integridade referencial e chaves estrangeiras ativas[cite: 27].
* **Segurança e Criptografia:** Módulo nativo `crypto` aplicando funções de hash **PBKDF2 com Salt de 16 bytes** e SHA-256[cite: 23, 27].

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
* [Node.js](https://nodejs.org/) versão **18 ou superior** instalada na máquina.
* Git.

> ⚡ **Nota:** O projeto foi planejado para rodar sem a necessidade de comandos como `npm install`, pois utiliza exclusivamente os módulos nativos do ecossistema Node.js.

### Passo a Passo
```bash
# 1. Clone o repositório para o seu ambiente local
git clone [https://github.com/jeferstappen/Desenvolvimento-Projeto-Web.git](https://github.com/jeferstappen/Desenvolvimento-Projeto-Web.git)

# 2. Acesse o diretório da aplicação web
cd Desenvolvimento-Projeto-Web/glamgo-web

# 3. Inicialize o servidor local unificado
node server.js
Abra o seu navegador de preferência e acesse: http://localhost:3000/[cite: 27]📡 Endpoints da API RESTA API RESTful implementada cobre exaustivamente os requisitos funcionais do sistema:   Autenticação e Perfil:POST /api/auth/register — Cadastro unificado de usuários.   POST /api/auth/login — Autenticação por credenciais seguras.   GET /api/auth/me — Recupera o contexto da sessão ativa.   PUT /api/usuarios/:id/perfil — Atualiza dados cadastrais editáveis do usuário.Geolocalização:PUT /api/usuarios/:id/localizacao — Atualiza coordenadas de latitude e longitude do GPS.   GET /api/profissionais — Varredura espacial via Haversine num raio de 15 km (contemplando freelancers e salões).   Espaços Físicos e Reservas:GET /api/espacos / POST /api/espacos — Gestão de infraestruturas ociosas de salões.   PUT /api/espacos/:id/reserva — Ativação de reserva expressa (tolerância de 30 minutos).   Serviços e Agendamentos:GET /api/servicos/:usuarioId / POST /api/servicos — Controle de portfólio via FAB[cite: 26].POST /api/atendimentos / PUT /api/atendimentos/:id/status — Ciclo de vida de chamados.   GET /api/agendamentos/ocupados — Consulta de slots bloqueados por conflito de horário no calendário.Gestão Financeira:GET /api/pagamentos/:usuarioId / POST /api/pagamentos — Gerenciamento tokenizado de meios de pagamento e PIX.Administração:GET /api/admin/metricas / PUT /api/admin/taxa — Métricas globais e ajuste de comissão[cite: 26, 27].🗄️ Estrutura do Banco de DadosO modelo relacional centraliza os atores na tabela unificada usuario, segregados por papéis (tipo_perfil), e gerencia o ecossistema financeiro e espacial através das tabelas:   usuario: Dados cadastrais, chaves fiscais (CPF/CNPJ), coordenadas geográficas e saldos de carteira.   espaco: Controle de macas e cadeiras de salões parceiros vinculadas a locações temporárias.   atendimento: Histórico e andamento de chamados imediatos ou agendados.   servico_ofertado: Catálogo de procedimentos executados pelos prestadores.forma_pagamento_usuario: Armazenamento tokenizado de cartões, contas e chaves PIX.transacao: Auditoria contábil do mecanismo de Split Payment:   Valor Total da Transação
    ├── 10% (Taxa Administrativa) ──► Plataforma GlamGo
    ├── Valor Fixo da Hora         ──► Salão Parceiro (Locação de Espaço)
    └── Valor Restante             ──► Profissional Freelancer (Líquido)
🔄 Relatório de Alterações (Etapa Final)A consolidação final do projeto incluiu as seguintes melhorias técnicas e correções homologadas:Correção de Autenticação e Sessão: Ajuste no algoritmo do utilitário crypto.js para assegurar a leitura correta do formato salt:hash (eliminando falhas de login 401) e delegação correta do evento de logout para o corpo do documento.Expansão de Cadastros Fiscais: Inclusão nativa de campos obrigatórios e imutáveis para CPF (clientes e freelancers) e CNPJ (salões parceiros) validados via máscara em frontend.Módulos de Perfil e Pagamentos: Criação das telas dedicadas #/perfil/editar e #/perfil/pagamento, aplicando a regra legal onde salões utilizam estritamente conta corrente, enquanto freelancers operam via PIX ou conta corrente.Interface Modular (FAB + Agendamento): Implementação de botões flutuantes (+) para cadastro rápido de portfólio de serviços e integração de um modal deslizante (bottom sheet) com calendário restrito a 1 mês e checagem de conflitos de horários ocupados.Bateria de Testes: Validação de 113 testes automatizados distribuídos entre testes de integração, rotas estáticas e unidades de negócio, complementados pelos casos de teste manuais CTM-01 a CTM-17.   🎓 Informações AcadêmicasCampoDetalheInstituiçãoInstituto Federal de Educação, Ciência e Tecnologia de São Paulo (IFSP) — Câmpus Birigui   ProgramaCurso Superior de Tecnologia em Sistemas para Internet (6º Semestre)DisciplinaDesenvolvimento de Projetos WebAutorJeferson Fernando   Ano2026
