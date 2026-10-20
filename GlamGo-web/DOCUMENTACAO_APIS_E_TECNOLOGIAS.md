# GlamGo - Documentação Detalhada de APIs e Tecnologias

Este documento apresenta uma visão técnica e detalhada de toda a arquitetura, tecnologias, bibliotecas, algoritmos e catálogo de APIs REST implementados na plataforma **GlamGo** (antigo AGhataCris).

---

## 1. Visão Geral da Arquitetura

O **GlamGo** é uma plataforma web progressiva (PWA) de contratação e gestão de serviços de beleza e bem-estar sob demanda e agendados. O sistema conecta três papéis principais:
- **Cliente**: busca profissionais no raio de 15km, agenda serviços únicos ou combinados, solicita pronto-atendimento, favorita profissionais e salões, e visualiza histórico de recibos.
- **Freelancer Autônoma**: gerencia agenda interativa, horários e compromissos, aceita chamados, reserva cadeiras/bancadas ociosas em salões parceiros, gerencia catálogo de serviços ofertados com proteção de senha e controla carteira financeira.
- **Salão Parceiro (Lei do Salão Parceiro nº 13.352/2016)**: monetiza espaços ociosos anunciando cadeiras, macas e bancadas com comissionamento automatizado via Split Payment.

### Padrão Arquitetural
- **Arquitetura**: Client-Server com SPA (Single Page Application) modular no frontend e Monólito Modular REST no backend.
- **Design System**: Minimalista Monocromático Preto & Branco (`#000000`, `#FFFFFF`, `#111111`, `#FAFAFA`) com acentos em Emerald (`#16A34A` para valores/confirmações) e Coral (`#DC2626` para cancelamentos/alertas).
- **Offline-First & Sincronização**: Frontend possui camada de cache e fallback no `localStorage` gerido pela classe `StateManager`, sincronizando bidirecionalmente com a API e o banco de dados relacional.

---

## 2. Tecnologias Utilizadas

### 2.1. Frontend
| Tecnologia | Utilização no Projeto |
| :--- | :--- |
| **HTML5 Semântico** | Estruturação de layouts, tags semânticas, acessibilidade, meta-tags SEO e PWA. |
| **Vanilla JavaScript (ES6+)** | Lógica de negócio no cliente, renderização de views, validações reativas, manipulação do DOM sem dependências de frameworks pesados. |
| **Vanilla CSS3** | Design System com variáveis CSS (`variables.css`), micro-animações, layout flexbox/grid, glassmorphism e mobile viewport simulator. Sem Tailwind para total controle e portabilidade. |
| **Hash-based SPA Router** | Roteamento dinâmico sem reload (`#/cliente/*`, `#/freelancer/*`, `#/salao/*`, `#/auth/*`). |
| **Observer Pattern (Pub/Sub)** | `StateManager` emite notificações reativas para re-renderizar telas e atualizar badges, saldo e notificações. |
| **Progressive Web App (PWA)** | `manifest.json` e Service Worker (`sw.js`) para suporte a instalação em dispositivos móveis e cache de recursos estáticos. |

### 2.2. Backend & Servidor
| Tecnologia | Utilização no Projeto |
| :--- | :--- |
| **Node.js (v24)** | Runtime JavaScript de alta performance do lado do servidor. |
| **HTTP Server Nativo** | Servidor HTTP nativo do Node.js (`node:http`), implementando roteamento RESTful de baixo overhead sem dependência de Express. |
| **CORS & Headers Seguros** | Headers de Cross-Origin Resource Sharing e Content-Type configurados para tráfego seguro de JSON. |
| **JSON Parser Assíncrono** | Middleware customizado para parsing de stream de buffers em payloads JSON estruturados. |

### 2.3. Banco de Dados Relacional
| Tecnologia | Utilização no Projeto |
| :--- | :--- |
| **SQLite Nativo (`node:sqlite`)** | Utilização do driver relacional síncrono oficial `DatabaseSync` do Node.js v24. |
| **Modo WAL (Write-Ahead Logging)** | `PRAGMA journal_mode = WAL;` para garantir concorrência eficiente de leitura e escrita. |
| **Integridade Referencial** | `PRAGMA foreign_keys = ON;` com validação estrita de integridade e constraints `CHECK` e `FOREIGN KEY`. |
| **Transações ACID** | Controle de transações seguras para operações financeiras e de reservas de espaço. |

---

## 3. Algoritmos e Regras de Negócio Específicas

1. **Fórmula de Haversine (`src/utils/haversine.js`) - RF03 & RNF01**:
   - Calcula a distância geodésica em quilômetros entre duas coordenadas $(\text{lat}_1, \text{lon}_1)$ e $(\text{lat}_2, \text{lon}_2)$ na curvatura da Terra:
   $$d = 2R \cdot \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
   - Filtra profissionais e espaços rigorosamente dentro do raio máximo de **15 km**.

2. **Criptografia e Hashing Seguro de Senhas (`src/utils/crypto.js`) - RNF03**:
   - Utiliza `crypto.pbkdf2Sync` com algoritmo **SHA-512**, **100.000 iterações** e salt criptográfico aleatório de **16 bytes**.
   - Comparação segura com `crypto.timingSafeEqual` para prevenir ataques de temporização (*timing attacks*).

3. **Split Payment Automatizado (Lei do Salão Parceiro nº 13.352/2016) - RF10**:
   - Ao finalizar cada atendimento, o sistema liquida automaticamente:
     - **Taxa da Plataforma**: 10% fixos do valor total.
     - **Taxa do Salão Parceiro**: valor da locação do espaço/cadeira conforme contratado.
     - **Valor Líquido da Freelancer**: $\text{Valor Total} - \text{Taxa Salão} - \text{Taxa Plataforma}$.
     - Registro auditável na tabela `transacao`.

4. **Detecção de Conflitos de Agenda e Duração Múltipla**:
   - O cliente pode selecionar múltiplos serviços simultâneos (ex: Chapinha + Maquiagem).
   - O sistema calcula a soma cumulativa da duração em minutos e bloqueia toda a janela de horário para evitar sobreposição na agenda da profissional.

5. **Controle de Segurança com Senha para Procedimentos**:
   - A criação e a exclusão de serviços ofertados exigem confirmação obrigatória de senha em modal no próprio aplicativo.

---

## 4. Catálogo Detalhado de APIs REST (`/api/*`)

Todas as requisições e respostas utilizam o formato `application/json; charset=utf-8`.

### 4.1. Autenticação e Usuários

#### `POST /api/auth/register`
Cadastra um novo usuário no sistema.
- **Body**:
```json
{
  "nome_completo": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "senha": "senhaSegura123",
  "telefone": "(11) 99999-9999", // Padrão com DDD e até 9 dígitos para Cliente
  "cpf": "000.000.000-00",        // Para Freelancer Autônoma
  "cnpj": "00.000.000/0000-00",   // Para Salão Parceiro
  "tipo_perfil": "Cliente | Freelancer | Salao",
  "especialidade": "Opcional para Freelancer/Salão",
  "latitude": -23.55052,
  "longitude": -46.633308
}
```
- **Resposta (201 Created)**:
```json
{
  "success": true,
  "user": {
    "id_usuario": 149,
    "nome_completo": "Nome do Usuário",
    "email": "usuario@exemplo.com",
    "telefone": "(11) 99999-9999",
    "tipo_perfil": "Cliente"
  }
}
```

#### `POST /api/auth/login`
Autentica o usuário com email e senha.
- **Body**:
```json
{
  "email": "mariana.silva@beauty.com",
  "senha": "senhaCadastrada"
}
```
- **Resposta (200 OK)**:
```json
{
  "success": true,
  "user": {
    "id_usuario": 2,
    "nome_completo": "Mariana Silva",
    "email": "mariana.silva@beauty.com",
    "tipo_perfil": "Freelancer",
    "saldo": 1420.50
  }
}
```

#### `POST /api/auth/verify-password`
Verifica a senha do usuário autenticado para autorizar operações sensíveis (ex: cadastro ou exclusão de procedimentos).
- **Body**:
```json
{
  "email": "mariana.silva@beauty.com",
  "senha": "12345678",
  "id_usuario": 2
}
```
- **Resposta (200 OK)**:
```json
{
  "success": true,
  "valid": true,
  "message": "Senha autenticada com sucesso."
}
```

#### `POST /api/auth/forgot-password`
Gera token de recuperação e simula o disparo de e-mail de redefinição.
- **Body**:
```json
{
  "email": "mariana.silva@beauty.com"
}
```
- **Resposta (200 OK)**:
```json
{
  "success": true,
  "message": "Instruções de recuperação enviadas com sucesso para o e-mail informado.",
  "email": "mariana.silva@beauty.com"
}
```

#### `GET /api/me?id_usuario=:id`
Retorna os dados cadastrais, financeiros e contadores do usuário.
- **Query Params**: `id_usuario` (inteiro)
- **Resposta (200 OK)**:
```json
{
  "user": {
    "id_usuario": 2,
    "nome_completo": "Mariana Silva",
    "tipo_perfil": "Freelancer",
    "saldo": 1420.50,
    "ganhos_hoje": 380.00,
    "avaliacao_media": 4.95
  }
}
```

#### `PUT /api/me/location`
Atualiza a geolocalização do usuário logado.
- **Body**:
```json
{
  "id_usuario": 2,
  "latitude": -23.5650,
  "longitude": -46.6600
}
```

---

### 4.2. Profissionais e Geolocalização (Raio 15km)

#### `GET /api/profissionais`
Busca profissionais dentro do raio de 15km a partir das coordenadas informadas, aplicando a fórmula de Haversine.
- **Query Params**:
  - `lat`: Latitude de referência do cliente (ex: `-23.55052`)
  - `lon`: Longitude de referência do cliente (ex: `-46.633308`)
  - `modalidade`: `Domicilio | Salao | Ambos` (opcional)
  - `busca`: termo de busca textual por nome ou especialidade (opcional)
- **Resposta (200 OK)**:
```json
{
  "profissionais": [
    {
      "id_usuario": 103,
      "nome_completo": "Juliana Costa",
      "especialidade": "Manicure Gel & Nail Art",
      "avaliacao": 5.0,
      "distanciaKm": 2.1,
      "precoEstimado": 85.00,
      "modalidade": "Salao",
      "avatar": "https://images.unsplash.com/photo-..."
    }
  ],
  "total": 1
}
```

---

### 4.3. Espaços Ociosos em Salões Parceiros (Lei do Salão Parceiro)

#### `GET /api/espacos`
Lista os espaços disponíveis para locação por hora para profissionais freelancers.
- **Query Params**:
  - `lat`, `lon`: Coordenadas para calcular a distância do salão.
  - `id_salao`: Filtrar por salão específico (opcional).
- **Resposta (200 OK)**:
```json
{
  "espacos": [
    {
      "id_espaco": 1,
      "id_salao": 3,
      "nome_salao": "Studio Elegance Jardins",
      "tipo_espaco": "Cadeira de Cabelo",
      "preco_hora": 25.00,
      "status": "Disponível",
      "distanciaKm": 1.2
    }
  ]
}
```

#### `POST /api/espacos`
Anuncia um novo espaço ocioso no salão parceiro.
- **Body**:
```json
{
  "id_salao": 3,
  "tipo_espaco": "Bancada de Maquiagem",
  "descricao": "Espaço com espelho camarim e iluminação LED",
  "preco_hora": 20.00
}
```

#### `POST /api/espacos/reservar`
Reserva um espaço ocioso com prazo garantido de chegada de 30 minutos (1800 segundos).
- **Body**:
```json
{
  "id_espaco": 1,
  "id_freelancer": 2
}
```
- **Resposta (200 OK)**:
```json
{
  "success": true,
  "reserva": {
    "id_espaco": 1,
    "status": "Reservado",
    "tempoRestanteSegundos": 1800,
    "nome_salao": "Studio Elegance Jardins"
  }
}
```

---

### 4.4. Catálogo de Serviços Ofertados

#### `GET /api/servicos`
Lista os serviços ofertados por um profissional ou salão.
- **Query Params**: `id_usuario` (opcional)
- **Resposta (200 OK)**:
```json
{
  "servicos": [
    {
      "id_servico": 1,
      "id_usuario": 2,
      "nome": "Chapinha & Escova Modeladora",
      "descricao": "Alisamento térmico e escova com fixação duradoura",
      "preco": 80.00,
      "duracao_minutos": 60,
      "ativo": 1
    }
  ]
}
```

#### `POST /api/servicos`
Cadastra um novo procedimento no catálogo do profissional (exige confirmação de senha).
- **Body**:
```json
{
  "id_usuario": 2,
  "nome": "Corte & Hidratação Profunda",
  "descricao": "Corte personalizado e nutrição com produtos premium",
  "preco": 110.00,
  "duracao_minutos": 60,
  "senha": "senhaDoUsuario"
}
```

#### `DELETE /api/servicos/:id`
Inativa/remove um serviço do catálogo do profissional (exige confirmação de senha).
- **Parâmetro de Rota**: `id` (ID do serviço)
- **Body**:
```json
{
  "id_usuario": 2
}
```
- **Resposta (200 OK)**:
```json
{
  "success": true,
  "message": "Serviço inativado com sucesso."
}
```

---

### 4.5. Atendimentos & Agendamentos

#### `GET /api/atendimentos`
Consulta a lista de atendimentos do sistema com suporte a múltiplos filtros.
- **Query Params**:
  - `id_cliente`: Filtrar histórico do cliente.
  - `id_freelancer`: Filtrar agenda da freelancer.
  - `status`: Filtrar por status (`Pendente | Em Andamento | Concluído | Cancelado`).
- **Resposta (200 OK)**:
```json
{
  "atendimentos": [
    {
      "id_atendimento": 1001,
      "id_cliente": 1,
      "id_freelancer": 2,
      "cliente_nome": "Isabela Santos",
      "freelancer_nome": "Mariana Silva",
      "servico": "Maquiagem & Penteado",
      "tipo": "Domicílio",
      "data_agendamento": "2026-10-19",
      "hora_agendamento": "09:30",
      "status": "Concluído",
      "valor_total": 280.00,
      "taxa_salao": 0.00,
      "taxa_plataforma": 28.00,
      "valor_liquido": 252.00
    }
  ]
}
```

#### `POST /api/atendimentos`
Cria um novo chamado de pronto atendimento ou agendamento de múltiplos serviços.
- **Body**:
```json
{
  "id_cliente": 1,
  "id_freelancer": 2,
  "id_espaco": 1,
  "servico": "Design de Sobrancelhas + Corte",
  "tipo": "No Salão | Domicílio",
  "valor_total": 205.00,
  "taxa_salao": 20.00,
  "distancia_km": 1.2,
  "data_agendamento": "2026-10-19",
  "hora_agendamento": "14:30",
  "duracao_minutos": 105,
  "servicos_adicionais_json": "[{...}]"
}
```

#### `PATCH /api/atendimentos/:id/status` e `PUT /api/atendimentos/:id/status`
Atualiza o status de um atendimento (ex: aceitar, recusar, iniciar, concluir ou cancelar).
- **Body**:
```json
{
  "status": "Em Andamento | Recusado | Concluído | Cancelado"
}
```
- **Transições de Estado (RF06 & Split Payment)**:
  - `Pendente` ➔ `Em Andamento`: Profissional aceita a solicitação de atendimento (RF06).
  - `Pendente` ➔ `Recusado`: Profissional recusa o atendimento com confirmação in-app (RF06).
  - `Em Andamento` ➔ `Concluído`: Finalização do serviço com liquidação contábil e rateio financeiro (Split Payment na tabela `transacao` e crédito na carteira da freelancer).
  - `Em Andamento` ou `Pendente` ➔ `Cancelado`: Cancelamento com modal interno de confirmação in-app.
- **Resposta (200 OK)**:
```json
{
  "success": true,
  "message": "Status do atendimento alterado para Em Andamento.",
  "atendimento": {
    "id_atendimento": 1043,
    "status": "Em Andamento"
  }
}
```

---

### 4.6. Requisito RF06: Gestão de Solicitações Pendentes (Visualização, Aceite e Recusa)

O requisito **RF06** assegura autonomia para a profissional autônoma escolher quais chamados atender:
1. **Visualização Centralizada**:
   - **Dashboard Home (`#/freelancer`)**: Bloco destacado **"🔔 SOLICITAÇÕES PENDENTES (RF06)"** exibindo avatar da cliente, avaliação em estrelas, distância via GPS, serviço solicitado, data/hora e valores (total e repasse líquido).
   - **Agenda Interativa (`#/freelancer/agenda`)**: Destaque com badge âmbar `Pendente` na linha do tempo do dia.
2. **Ação de Aceite (`window.aceitarSolicitacaoAtendimento`)**:
   - Ao clicar em **"✓ Aceitar Atendimento"**, o status transiciona para `'Em Andamento'` no banco de dados e no estado local. O chamado passa imediatamente a ser o serviço ativo com previsão de chegada e botão "Finalizar Atendimento".
3. **Ação de Recusa (`window.abrirModalRecusarSolicitacao`)**:
   - Ao clicar em **"✕ Recusar"**, abre um modal de confirmação no padrão do aplicativo (sem popups externos), permitindo rejeitar o atendimento e atualizando o status para `'Recusado'`.
4. **Cancelamento In-App de Agenda (`window.confirmarCancelamentoAgenda`)**:
   - Totalmente integrado ao design system interno (`UI.openModal`), eliminando caixas de diálogo nativas do navegador (`window.confirm`) para uma experiência 100% PWA mobile nativa.

---

### 4.6. Transações & Recibos Fiscais

#### `GET /api/transacoes/:idAtendimento`
Retorna os dados fiscais e o split payment discriminado do atendimento para renderização de recibos.
- **Resposta (200 OK)**:
```json
{
  "transacao": {
    "id_transacao": 501,
    "id_atendimento": 1001,
    "valor_total": 280.00,
    "taxa_plataforma": 28.00,
    "taxa_salao": 0.00,
    "valor_freelancer": 252.00,
    "status_pagamento": "Liquidado",
    "created_at": "2026-10-19 10:30:00"
  }
}
```

---

### 4.7. Formas de Pagamento

#### `GET /api/pagamentos?id_usuario=:id`
Retorna as formas de pagamento salvas do usuário (PIX, dados bancários de repasse ou cartão).

#### `POST /api/pagamentos`
Cadastra ou atualiza os dados de pagamento ou recebimento.
- **Body**:
```json
{
  "id_usuario": 2,
  "tipo": "PIX | Cartão | Transferência",
  "dados": {
    "chave_pix": "mariana.silva@beauty.com",
    "titular": "Mariana Silva"
  }
}
```

---

## 5. Estrutura de Diretórios do Projeto

```
GlamGo-web/
├── css/
│   ├── base.css              # Reset, tipografia Inter/Outfit e estilos globais
│   ├── components.css        # Modais, botões, badges, calendário e formulários
│   ├── layout.css            # Viewport mobile, header, bottom-bar e containers
│   ├── variables.css         # Design Tokens Preto & Branco (Minimalismo GlamGo)
│   └── views.css             # Estilos específicos de cada view e cards
├── database/
│   ├── aghatacris.db         # Banco relacional SQLite com WAL ativado
│   ├── db.js                 # Camada de conexão e métodos query/queryOne/run
│   ├── schema.sql            # Definição DDL das tabelas e índices
│   ├── seed.sql              # Carga inicial com clientes, profissionais e salões
│   └── sync_calendar_data.js # Script de sincronização de atendimentos do calendário
├── js/
│   ├── api.js                # Cliente HTTP frontend para consumo dos endpoints /api
│   ├── app.js                # Bootstrap e inicialização do sistema
│   ├── router.js             # Gerenciamento de rotas SPA
│   ├── state.js              # StateManager reativo e persistência local
│   ├── components/
│   │   ├── agendamentoModal.js # Modal de agendamento, serviços e exclusão com senha
│   │   ├── header.js         # Header responsivo com status online
│   │   ├── modal.js          # Utilitários de modal, recibos e recuperação de senha
│   │   ├── navbar.js         # Barra inferior de navegação por papel
│   │   └── roleSwitcher.js   # Seletor dinâmico de perfis (Cliente, Freelancer, Salão)
│   └── views/
│       ├── authView.js       # Login e cadastro com toggle de senha
│       ├── clienteHomeView.js# Busca com raio Haversine e favoritos
│       ├── clienteFavoritasView.js # Lista de favoritos
│       ├── clienteHistoricoView.js # Histórico de atendimentos e recibos
│       ├── freelancerHomeView.js   # Dashboard da profissional com radar 15km
│       ├── freelancerAgendaView.js # Calendário interativo com dots de agendamento
│       ├── freelancerCarteiraView.js # Extrato financeiro e repasse
│       ├── salaoHomeView.js  # Gestão de espaços ociosos do salão parceiro
│       └── perfilView.js     # Perfil e configurações do usuário
├── src/
│   ├── config.js             # Configurações do servidor e porta HTTP
│   ├── controllers/
│   │   └── apiControllers.js # Controladores de autenticação, serviços e reservas
│   ├── models/
│   │   ├── AtendimentoModel.js # Repositório de atendimentos
│   │   ├── EspacoModel.js    # Repositório de espaços de salões
│   │   ├── PagamentoModel.js # Repositório de formas de pagamento
│   │   ├── ServicoModel.js   # Repositório de serviços ofertados
│   │   ├── TransacaoModel.js # Repositório financeiro de split payment
│   │   └── UsuarioModel.js   # Repositório de usuários
│   ├── routes/
│   │   └── apiRouter.js      # Despachante principal de rotas REST
│   └── utils/
│       ├── crypto.js         # Criptografia PBKDF2/SHA-512 e timingSafeEqual
│       └── haversine.js      # Cálculo geodésico no raio de 15km
├── index.html                # Ponto de entrada SPA com viewport de smartphone
├── manifest.json             # Manifesto PWA
├── package.json              # Configuração do projeto Node.js
├── server.js                 # Ponto de entrada do servidor HTTP REST
├── test_backend.js           # Suite de testes unitários do backend
└── test_integration.js       # Suite de testes de integração e ponta a ponta
```

---

## 6. Instruções para Execução e Testes

### Instalação de Dependências
O projeto foi desenvolvido para rodar com dependências mínimas no Node.js v24:
```bash
npm install
```

### Inicializar Servidor de Desenvolvimento
```bash
npm run dev
# ou
node server.js
```
O servidor estará acessível em: **`http://localhost:3000`**.

### Executar Testes Automatizados
```bash
# Testes do backend (banco relacional, criptografia, haversine e modelos)
node test_backend.js

# Testes de integração de fluxo de atendimento e split payment
node test_integration.js
```
