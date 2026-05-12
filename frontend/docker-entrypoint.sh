#!/bin/sh
set -eu

cat > /app/public/runtime-config.js <<EOF
window.__ALLCOURTS_CONFIG__ = {
  NEXT_PUBLIC_API_URL: "${NEXT_PUBLIC_API_URL:-}"
};
EOF

exec npm start
