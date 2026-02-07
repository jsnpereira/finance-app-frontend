# Frontend + Keycloak — Configuração de Ambiente

Este documento descreve **como o frontend React deve ser configurado para rodar com Keycloak**, sem embutir variáveis de ambiente no build da imagem Docker.

A ideia central é:
- **A imagem do frontend é genérica**
- **As variáveis são injetadas no runtime**, no momento em que o container sobe

---

## 🎯 Objetivo de Arquitetura

- Frontend e Keycloak rodam **no mesmo EC2**
- Cada um em **containers separados**
- Comunicação interna via Docker network
- Frontend lê configurações **em tempo de execução**, não no build

---

## 🧱 Stack

- React
- Keycloak
- Docker / Docker Compose
- EC2 (Amazon Linux 2)

---

## 📁 Estrutura Esperada do Frontend

```
frontend/
├── public/
│   └── env.js
├── src/
│   └── config/
│       └── keycloak.config.ts
├── Dockerfile
├── docker-entrypoint.sh
├── docker/
│   └── nginx.conf
└── docker-compose.yml
```

---

## 🔑 Variáveis Necessárias

Essas variáveis **não devem estar no build**:

```
KEYCLOAK_BASE_URL
KEYCLOAK_REALM
KEYCLOAK_CLIENT_ID
KEYCLOAK_REDIRECT_URI
KEYCLOAK_LOGOUT_REDIRECT_URI
```

---

## 🌍 Estratégia Correta para React em Docker

React **não lê variáveis em runtime sozinho**.  
Solução: gerar um arquivo `env.js` dinamicamente ao subir o container.

---

## 🧩 Arquivo `public/env.js`

Esse arquivo será sobrescrito no start do container:

```js
window._env_ = {
  KEYCLOAK_BASE_URL: "",
  KEYCLOAK_REALM: "",
  KEYCLOAK_CLIENT_ID: "",
  KEYCLOAK_REDIRECT_URI: "",
  KEYCLOAK_LOGOUT_REDIRECT_URI: ""
};
```

---

## ⚙️ Script de Runtime (`docker-entrypoint.sh`)

```bash
#!/bin/sh

cat <<EOF > /usr/share/nginx/html/env.js
window._env_ = {
  KEYCLOAK_BASE_URL: "${KEYCLOAK_BASE_URL}",
  KEYCLOAK_REALM: "${KEYCLOAK_REALM}",
  KEYCLOAK_CLIENT_ID: "${KEYCLOAK_CLIENT_ID}",
  KEYCLOAK_REDIRECT_URI: "${KEYCLOAK_REDIRECT_URI}",
  KEYCLOAK_LOGOUT_REDIRECT_URI: "${KEYCLOAK_LOGOUT_REDIRECT_URI}"
};
EOF

exec nginx -g "daemon off;"
```

---

## 🐳 Dockerfile do Frontend

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY public ./public
COPY src ./src
COPY tsconfig.json ./

RUN npm run build

FROM nginx:1.25-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /entrypoint.sh
COPY --from=build /app/build /usr/share/nginx/html

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
```

---

## 🧠 Uso no Código React

```ts
const env = (window as any)._env_;

const keycloakConfig = {
  url: env.KEYCLOAK_BASE_URL,
  realm: env.KEYCLOAK_REALM,
  clientId: env.KEYCLOAK_CLIENT_ID
};
```

---

## 🐙 Docker Compose (Frontend + Keycloak)

```yaml
version: "3.8"

services:
  keycloak:
    image: quay.io/keycloak/keycloak:24
    container_name: keycloak
    command: start-dev
    ports:
      - "8080:8080"
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    restart: unless-stopped

  frontend:
    image: jeisonp/frontend-app:latest
    container_name: frontend
    ports:
      - "3000:80"
    env_file:
      - .env.local
    depends_on:
      - keycloak
    restart: unless-stopped
```

---

## 🔧 Configuração do Client no Keycloak

- **Valid Redirect URIs:** `http://localhost:3000/*`
- **Valid Post Logout Redirect URIs:** `http://localhost:3000/*`
- **Web Origins:** `http://localhost:3000`

Se esses valores não baterem com o `KEYCLOAK_REDIRECT_URI`, o Keycloak retorna `Invalid parameter: redirect_uri`.

---

## ✅ Benefícios Dessa Abordagem

✔ Uma única imagem para todos ambientes  
✔ Variáveis trocadas sem rebuild  
✔ Compatível com EC2, ECS, Kubernetes  
✔ Arquitetura limpa e profissional  

---

## 🚀 Próximo Passo

- Externalizar Keycloak DB (Postgres)
- HTTPS com Nginx + Certbot
- CI/CD (GitHub Actions)

---

📌 **Este documento foi pensado para ser lido por humanos e por IA (ChatGPT / Codex).**
