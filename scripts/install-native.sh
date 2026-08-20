#!/bin/bash
# =============================================================================
# CariAir Native Systemd Service Installer (No Docker)
# =============================================================================
# This script installs CariAir to run natively with systemd for auto-start
# Use this when Docker has networking issues (e.g., in LXC containers)
#
# Usage:
#   sudo ./scripts/install-native.sh
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
APP_NAME="cariair"
INSTALL_DIR="/opt/${APP_NAME}"

echo -e "${GREEN}CariAir Native Systemd Service Installer${NC}"
echo "=========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Error: Please run as root (use sudo)${NC}"
    exit 1
fi

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}Error: pnpm is not installed${NC}"
    echo "Install with: npm install -g pnpm"
    exit 1
fi

echo -e "${GREEN}  ✓ Prerequisites met${NC}"

# Create installation directory
echo -e "${YELLOW}Step 1: Preparing installation directory...${NC}"
mkdir -p "${INSTALL_DIR}"

# Copy project files
echo -e "${YELLOW}Step 2: Copying project files...${NC}"
cd "$PROJECT_DIR"

# Copy all files (preserve structure)
rsync -av --exclude='node_modules' --exclude='.next' --exclude='.git' \
    "$PROJECT_DIR/" "${INSTALL_DIR}/" && echo "rsync complete" || {
    echo -e "${YELLOW}rsync not available, using cp instead...${NC}"
    cp -r "$PROJECT_DIR"/* "${INSTALL_DIR}/" 2>/dev/null || true
    cp -r "$PROJECT_DIR"/.[^.]* "${INSTALL_DIR}/" 2>/dev/null || true
}

cd "${INSTALL_DIR}"

# Remove node_modules and .next if they were copied accidentally
rm -rf "${INSTALL_DIR}/node_modules" "${INSTALL_DIR}/.next"

# Copy environment file
if [ -f "$PROJECT_DIR/.env.local" ]; then
    cp "$PROJECT_DIR/.env.local" "${INSTALL_DIR}/.env.production.local"
    echo -e "${GREEN}  ✓ Environment file configured${NC}"
else
    echo -e "${YELLOW}  ⚠ No .env.local found. Please create ${INSTALL_DIR}/.env.production.local${NC}"
fi

# Install dependencies
echo -e "${YELLOW}Step 3: Installing dependencies...${NC}"
cd "${INSTALL_DIR}"
pnpm install --frozen-lockfile

# Build the application
echo -e "${YELLOW}Step 4: Building application...${NC}"
export NODE_ENV=production
pnpm build

# Verify standalone build was created
if [ ! -d "${INSTALL_DIR}/.next/standalone" ]; then
    echo -e "${RED}Error: Standalone build not created${NC}"
    echo "Check the build output for errors."
    exit 1
fi

echo -e "${GREEN}  ✓ Build successful${NC}"

# Copy static files to standalone
echo -e "${YELLOW}Step 5: Setting up standalone server...${NC}"
cp -r "${INSTALL_DIR}/public" "${INSTALL_DIR}/.next/standalone/" 2>/dev/null || true
cp -r "${INSTALL_DIR}/.next/static" "${INSTALL_DIR}/.next/standalone/.next/" 2>/dev/null || true
cp -r "${INSTALL_DIR}/data" "${INSTALL_DIR}/.next/standalone/" 2>/dev/null || true

# Remove conflicting directories before moving standalone files
rm -rf "${INSTALL_DIR}/node_modules"
rm -rf "${INSTALL_DIR}/public"

# Move standalone build to install directory
mv "${INSTALL_DIR}/.next/standalone/"* "${INSTALL_DIR}/"
rmdir "${INSTALL_DIR}/.next/standalone" 2>/dev/null || true

echo -e "${GREEN}  ✓ Standalone server ready${NC}"

# Install systemd service
echo -e "${YELLOW}Step 6: Installing systemd service...${NC}"
cp "${PROJECT_DIR}/cariair-native.service" "/etc/systemd/system/${APP_NAME}.service"

# Reload systemd
systemctl daemon-reload

# Enable service
echo -e "${YELLOW}Step 7: Enabling auto-start on boot...${NC}"
systemctl enable "${APP_NAME}.service"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Installation Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Installation Directory: ${INSTALL_DIR}"
echo ""
echo "Available commands:"
echo "  sudo systemctl start ${APP_NAME}    - Start CariAir"
echo "  sudo systemctl stop ${APP_NAME}     - Stop CariAir"
echo "  sudo systemctl restart ${APP_NAME}  - Restart CariAir"
echo "  sudo systemctl status ${APP_NAME}    - Check status"
echo "  sudo journalctl -u ${APP_NAME} -f    - View logs"
echo ""
echo "The service is enabled and will auto-start on boot."
echo ""

# Try to start
read -p "Would you like to start CariAir now? (y/N) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Starting CariAir...${NC}"
    systemctl start "${APP_NAME}.service"
    sleep 2
    systemctl status "${APP_NAME}.service" --no-pager
fi
