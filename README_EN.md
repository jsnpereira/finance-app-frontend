# Finance App Frontend

🇺🇸 **English** | 🇧🇷 [Português](README.md)

React application with TypeScript and OAuth2/OIDC authentication via Keycloak.

## 📖 About the Project

This project was developed as part of my web development and modern authentication studies, focusing on building a professional frontend application using React, TypeScript, and Keycloak. It serves as a practical example for my portfolio, demonstrating applied knowledge in frontend architecture, security, and integration with corporate identity providers.

## 🚀 Technologies

- **React 18** with TypeScript
- **React Router v6** for navigation
- **Bootstrap 5** + React Bootstrap for responsive UI
- **Keycloak** for OAuth2/OIDC authentication (without external libraries)
- **OAuth2 Authorization Code Flow** with PKCE

## 📋 Prerequisites

- Node.js 16+ and npm
- Keycloak server running on `http://localhost:8080`
- Configured realm: `finance-realm`
- Configured client: `frontend-finance-app`

## ⚙️ Keycloak Configuration

### 1. Create Realm

- Name: `finance-realm`

### 2. Create Client

- **Client ID:** `frontend-finance-app`
- **Client Type:** OpenID Connect
- **Access Type:** public
- **Standard Flow Enabled:** ON
- **Direct Access Grants Enabled:** ON
- **Valid Redirect URIs:** `http://localhost:3000/*`
- **Valid Post Logout Redirect URIs:** `http://localhost:3000/*`
- **Web Origins:** `http://localhost:3000`

### 3. Configure Roles (Optional)

Create roles in the realm or client as needed. Roles will be displayed in the user dashboard.

## 🛠️ Installation

1. **Clone the repository and install dependencies:**

```bash
npm install
```

2. **Configure the file `src/config/keycloak.config.ts`:**
   - Adjust `baseUrl`, `realm` and `clientId` according to your environment
   - URLs are already pre-configured for `finance-realm`

3. **Run the project:**

```bash
npm start
```

The application will be available at `http://localhost:3000`

## 🎯 Features

- ✅ **Automatic login** - Direct redirect to Keycloak when accessing the application
- ✅ **User registration** - Registration via Keycloak page
- ✅ **Modern interface** - Bootstrap 5 with responsive design and gradient
- ✅ **User dashboard** - Displays name, email, username, and all roles
- ✅ **Route protection** - Private routes with authentication verification
- ✅ **Complete logout** - Ends SSO session on Keycloak and local data
- ✅ **TypeScript** - Static typing and code safety
- ✅ **Pure OAuth2** - No dependency on third-party Keycloak libraries

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Login.tsx       # Login page
│   ├── Cadastro.tsx    # Registration page
│   ├── Home.tsx        # User dashboard
│   ├── Callback.tsx    # Processes OAuth callback
│   └── PrivateRoute.tsx # HOC for protected routes
├── config/             # Configurations
│   └── keycloak.config.ts # Keycloak config
├── types/              # TypeScript definitions
│   └── auth.types.ts   # Authentication types
├── utils/              # Utilities
│   └── authUtils.ts    # Authentication functions
├── App.tsx             # Main component
└── index.tsx           # Entry point
```

## 🔐 Authentication Flow (OAuth2 Authorization Code)

### 1. Login (Automatic)

```
User accesses http://localhost:3000
    ↓
Automatically redirects to Keycloak
    ↓
GET /realms/finance-realm/protocol/openid-connect/auth
    ?client_id=frontend-finance-app
    &redirect_uri=http://localhost:3000/callback
    &response_type=code
    &scope=openid profile email
    ↓
User enters credentials on Keycloak
    ↓
Keycloak redirects to /callback?code=AUTHORIZATION_CODE
    ↓
App exchanges code for access_token via POST /token
    ↓
App fetches user information via GET /userinfo
    ↓
Stores tokens and user info in localStorage
    ↓
Redirects to /home (Dashboard)
```

### 2. Registration

```
User accesses /cadastro
    ↓
Automatically redirects to Keycloak registration
    ↓
GET /realms/finance-realm/protocol/openid-connect/registrations
    ↓
User fills out registration form
    ↓
After registration, follows login flow
    ↓
Returns to /callback → /home
```

### 3. Logout (Complete)

```
User clicks "Sign Out"
    ↓
Clears localStorage (tokens and user info)
    ↓
Redirects to Keycloak logout
    ↓
GET /realms/finance-realm/protocol/openid-connect/logout
    ?client_id=frontend-finance-app
    &post_logout_redirect_uri=http://localhost:3000
    ↓
Keycloak ends SSO session
    ↓
Redirects to http://localhost:3000 (without authentication)
```

## 🔗 Keycloak Endpoints

The endpoints are configured in `src/config/keycloak.config.ts`:

| Endpoint         | URL                                                                                |
| ---------------- | ---------------------------------------------------------------------------------- |
| **Login**        | `http://localhost:8080/realms/finance-realm/protocol/openid-connect/auth`          |
| **Registration** | `http://localhost:8080/realms/finance-realm/protocol/openid-connect/registrations` |
| **Logout**       | `http://localhost:8080/realms/finance-realm/protocol/openid-connect/logout`        |
| **Token**        | `http://localhost:8080/realms/finance-realm/protocol/openid-connect/token`         |
| **UserInfo**     | `http://localhost:8080/realms/finance-realm/protocol/openid-connect/userinfo`      |

## 📂 Data Structure

### LocalStorage

The system stores in localStorage:

- `access_token` - JWT access token
- `refresh_token` - Refresh token
- `user_info` - JSON with user data (name, email, username, roles)

### User Info (Example)

```json
{
  "name": "John Silva",
  "email": "john@example.com",
  "username": "john.silva",
  "roles": ["admin", "user", "finance-manager"],
  "sub": "user-uuid"
}
```

## 🔧 Troubleshooting

### Error: "Invalid redirect uri"

- Check if `http://localhost:3000/*` is in **Valid Redirect URIs** in the Keycloak client

### Error: "Invalid parameter: redirect_uri" on logout

- Add `http://localhost:3000/*` to **Valid Post Logout Redirect URIs** in the Keycloak client

### SSO session persists after logout

- Make sure the `doLogout()` function is calling the Keycloak logout endpoint

### TypeScript errors

- Run `npm install` again
- Check if `@types/react`, `@types/react-dom` and `@types/node` are installed

## 📝 Development Note

I used GitHub Copilot to accelerate the creation of boilerplate code and annotations, but all application architecture, Keycloak integration, testing strategy, and project organization were my technical decisions.
