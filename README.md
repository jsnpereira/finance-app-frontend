# Finance App Frontend

🇺🇸 [English](README_EN.md) | 🇧🇷 **Português**

Aplicação React com TypeScript e autenticação OAuth2/OIDC via Keycloak.

## 📖 Sobre o Projeto

Este projeto foi desenvolvido como parte dos meus estudos em desenvolvimento web e autenticação moderna, com foco em construir uma aplicação frontend profissional usando React, TypeScript e Keycloak. Ele serve como um exemplo prático para o meu portfólio, demonstrando conhecimentos aplicados em arquitetura de frontend, segurança e integração com provedores de identidade corporativos.

## 🚀 Tecnologias

- **React 18** com TypeScript
- **React Router v6** para navegação
- **Bootstrap 5** + React Bootstrap para UI responsiva
- **Keycloak** para autenticação OAuth2/OIDC (sem bibliotecas externas)
- **OAuth2 Authorization Code Flow** com PKCE

## 📋 Pré-requisitos

- Node.js 16+ e npm
- Servidor Keycloak rodando em `http://localhost:8080`
- Realm configurado: `finance-realm`
- Client configurado: `frontend-finance-app`

## ⚙️ Configuração do Keycloak

### 1. Criar Realm

- Nome: `finance-realm`

### 2. Criar Client

- **Client ID:** `frontend-finance-app`
- **Client Type:** OpenID Connect
- **Access Type:** public
- **Standard Flow Enabled:** ON
- **Direct Access Grants Enabled:** ON
- **Valid Redirect URIs:** `http://localhost:3000/*`
- **Valid Post Logout Redirect URIs:** `http://localhost:3000/*`
- **Web Origins:** `http://localhost:3000`

### 3. Configurar Roles (Opcional)

Crie roles no realm ou no client conforme necessário. As roles serão exibidas no dashboard do usuário.

## 🛠️ Instalação

1. **Clone o repositório e instale as dependências:**

```bash
npm install
```

2. **Configure o arquivo `src/config/keycloak.config.ts`:**
   - Ajuste `baseUrl`, `realm` e `clientId` conforme seu ambiente
   - URLs já estão pré-configuradas para `finance-realm`

3. **Execute o projeto:**

```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## 🎯 Funcionalidades

- ✅ **Login automático** - Redirecionamento direto para Keycloak ao acessar a aplicação
- ✅ **Cadastro de usuários** - Registro via página do Keycloak
- ✅ **Interface moderna** - Bootstrap 5 com design responsivo e gradiente
- ✅ **Dashboard do usuário** - Exibe nome, email, username e todas as roles
- ✅ **Proteção de rotas** - Rotas privadas com verificação de autenticação
- ✅ **Logout completo** - Encerra sessão SSO no Keycloak e dados locais
- ✅ **TypeScript** - Tipagem estática e segurança de código
- ✅ **OAuth2 puro** - Sem dependência de bibliotecas de terceiros do Keycloak

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Login.tsx       # Página de login
│   ├── Cadastro.tsx    # Página de cadastro
│   ├── Home.tsx        # Dashboard do usuário
│   ├── Callback.tsx    # Processa callback OAuth
│   └── PrivateRoute.tsx # HOC para rotas protegidas
├── config/             # Configurações
│   └── keycloak.config.ts # Config do Keycloak
├── types/              # Definições TypeScript
│   └── auth.types.ts   # Types de autenticação
├── utils/              # Utilitários
│   └── authUtils.ts    # Funções de autenticação
├── App.tsx             # Componente principal
└── index.tsx           # Entry point
```

## 🔐 Fluxo de Autenticação (OAuth2 Authorization Code)

### 1. Login (Automático)

```
Usuário acessa http://localhost:3000
    ↓
Redireciona automaticamente para Keycloak
    ↓
GET /realms/finance-realm/protocol/openid-connect/auth
    ?client_id=frontend-finance-app
    &redirect_uri=http://localhost:3000/callback
    &response_type=code
    &scope=openid profile email
    ↓
Usuário insere credenciais no Keycloak
    ↓
Keycloak redireciona para /callback?code=AUTHORIZATION_CODE
    ↓
App troca o código por access_token via POST /token
    ↓
App busca informações do usuário via GET /userinfo
    ↓
Armazena tokens e user info no localStorage
    ↓
Redireciona para /home (Dashboard)
```

### 2. Cadastro

```
Usuário acessa /cadastro
    ↓
Redireciona automaticamente para registro do Keycloak
    ↓
GET /realms/finance-realm/protocol/openid-connect/registrations
    ↓
Usuário preenche formulário de cadastro
    ↓
Após cadastro, segue fluxo de login
    ↓
Retorna para /callback → /home
```

### 3. Logout (Completo)

```
Usuário clica em "Sair da Conta"
    ↓
Limpa localStorage (tokens e user info)
    ↓
Redireciona para logout do Keycloak
    ↓
GET /realms/finance-realm/protocol/openid-connect/logout
    ?client_id=frontend-finance-app
    &post_logout_redirect_uri=http://localhost:3000
    ↓
Keycloak encerra sessão SSO
    ↓
Redireciona para http://localhost:3000 (sem autenticação)
```

## 🔗 Endpoints Keycloak

Os endpoints estão configurados em `src/config/keycloak.config.ts`:

| Endpoint     | URL                                                                                |
| ------------ | ---------------------------------------------------------------------------------- |
| **Login**    | `http://localhost:8080/realms/finance-realm/protocol/openid-connect/auth`          |
| **Registro** | `http://localhost:8080/realms/finance-realm/protocol/openid-connect/registrations` |
| **Logout**   | `http://localhost:8080/realms/finance-realm/protocol/openid-connect/logout`        |
| **Token**    | `http://localhost:8080/realms/finance-realm/protocol/openid-connect/token`         |
| **UserInfo** | `http://localhost:8080/realms/finance-realm/protocol/openid-connect/userinfo`      |

## 📂 Estrutura de Dados

### LocalStorage

O sistema armazena no localStorage:

- `access_token` - Token JWT de acesso
- `refresh_token` - Token para renovação
- `user_info` - JSON com dados do usuário (name, email, username, roles)

### User Info (Exemplo)

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "username": "joao.silva",
  "roles": ["admin", "user", "finance-manager"],
  "sub": "uuid-do-usuario"
}
```

## 🔧 Troubleshooting

### Erro: "Invalid redirect uri"

- Verifique se `http://localhost:3000/*` está em **Valid Redirect URIs** no client do Keycloak

### Erro: "Invalid parameter: redirect_uri" no logout

- Adicione `http://localhost:3000/*` em **Valid Post Logout Redirect URIs** no client do Keycloak

### Sessão SSO persiste após logout

- Certifique-se de que a função `doLogout()` está chamando o endpoint de logout do Keycloak

### TypeScript erros

- Execute `npm install` novamente
- Verifique se `@types/react`, `@types/react-dom` e `@types/node` estão instalados

## 📝 Nota sobre Desenvolvimento

Utilizei o GitHub Copilot para acelerar a criação de trechos de boilerplate e anotações, porém toda a arquitetura da aplicação, a integração com o Keycloak, a estratégia de testes e a organização do projeto foram decisões técnicas minhas.
