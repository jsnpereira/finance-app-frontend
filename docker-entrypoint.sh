#!/usr/bin/env sh
set -eu

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
