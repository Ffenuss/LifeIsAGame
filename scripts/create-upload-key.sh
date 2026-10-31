#!/usr/bin/env bash
# Creates a Play Store upload key and android/keystore.properties.
# The key and passwords are gitignored. Back them up somewhere safe: if you lose
# this key you must ask Google Play to reset your upload key.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT/android"

if [[ -f keystore.properties ]]; then
  echo "android/keystore.properties already exists. Move it aside first."
  exit 1
fi

STORE_FILE="${STORE_FILE:-release.keystore}"
KEY_ALIAS="${KEY_ALIAS:-upload}"
KEYSTORE_PASSWORD="${KEYSTORE_PASSWORD:-}"

if [[ -z "$KEYSTORE_PASSWORD" ]]; then
  read -r -s -p "Choose a keystore password (16+ characters): " KEYSTORE_PASSWORD
  echo
  read -r -s -p "Confirm the password: " CONFIRM
  echo
  if [[ "$KEYSTORE_PASSWORD" != "$CONFIRM" ]]; then
    echo "Passwords do not match."
    exit 1
  fi
fi

if [[ ${#KEYSTORE_PASSWORD} -lt 16 ]]; then
  echo "Use at least 16 characters for the keystore password."
  exit 1
fi

keytool -genkeypair \
  -keystore "$STORE_FILE" \
  -alias "$KEY_ALIAS" \
  -keyalg RSA \
  -keysize 4096 \
  -validity 10000 \
  -storepass "$KEYSTORE_PASSWORD" \
  -keypass "$KEYSTORE_PASSWORD" \
  -dname "CN=Life Estate, OU=Games, O=Life Estate, L=Internet, ST=Internet, C=US"

cat > keystore.properties <<EOF
storeFile=$STORE_FILE
storePassword=$KEYSTORE_PASSWORD
keyAlias=$KEY_ALIAS
keyPassword=$KEYSTORE_PASSWORD
EOF

chmod 600 keystore.properties "$STORE_FILE"

echo
echo "Created android/$STORE_FILE and android/keystore.properties."
echo "Back both files up. Then run: npm run android:bundle"
