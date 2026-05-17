#!/bin/bash
set -e

# ====================================
# Dual-App Deployment Script
# ====================================
# Deploys both Next.js frontend and React admin dashboard
# on the same droplet with proper security configurations

echo "==================================================="
echo "   Deploying Mobilklar - Dual App Configuration   "
echo "==================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="mobilklar.no"
ADMIN_DOMAIN="admin.mobilklar.no"
DROPLET_IP="46.101.149.251"

# Check if running on droplet
if [ ! -f "/etc/nginx/sites-available/default" ] && [ ! -f "/opt/caddy/Caddyfile" ]; then
    echo -e "${YELLOW}Warning: This script should be run on the production droplet${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 1: Pre-deployment checks
echo ""
echo -e "${YELLOW}[1/8] Running pre-deployment security checks...${NC}"
if [ -f "./security-validation.sh" ]; then
    bash ./security-validation.sh
    if [ $? -ne 0 ]; then
        echo -e "${RED}Security validation failed. Fix issues before deploying.${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}Warning: security-validation.sh not found. Skipping validation.${NC}"
fi

# Step 2: Create Docker network if it doesn't exist
echo ""
echo -e "${YELLOW}[2/8] Creating Docker network...${NC}"
if ! docker network ls | grep -q "mobilklar-network"; then
    docker network create mobilklar-network
    echo -e "${GREEN}✓ Network created${NC}"
else
    echo -e "${GREEN}✓ Network already exists${NC}"
fi

# Step 3: Stop any running containers
echo ""
echo -e "${YELLOW}[3/8] Stopping existing containers...${NC}"
docker-compose -f docker-compose-caddy.yml down 2>/dev/null || true
docker-compose -f docker-compose.yml down 2>/dev/null || true
docker-compose -f docker-compose-admin.yml down 2>/dev/null || true
echo -e "${GREEN}✓ All containers stopped${NC}"

# Step 4: Pull latest images
echo ""
echo -e "${YELLOW}[4/8] Building fresh images...${NC}"
docker-compose -f docker-compose.yml build --no-cache
docker-compose -f docker-compose-admin.yml build --no-cache
echo -e "${GREEN}✓ Images built${NC}"

# Step 5: Deploy Caddy first (reverse proxy must be up first)
echo ""
echo -e "${YELLOW}[5/8] Deploying Caddy reverse proxy...${NC}"
docker-compose -f docker-compose-caddy.yml up -d
sleep 5
if docker ps | grep -q "caddy"; then
    echo -e "${GREEN}✓ Caddy is running${NC}"
else
    echo -e "${RED}✗ Caddy failed to start${NC}"
    docker-compose -f docker-compose-caddy.yml logs
    exit 1
fi

# Step 6: Deploy Next.js frontend
echo ""
echo -e "${YELLOW}[6/8] Deploying Next.js frontend...${NC}"
docker-compose -f docker-compose.yml up -d
sleep 10
if docker ps | grep -q "mobilklar-frontend"; then
    echo -e "${GREEN}✓ Next.js frontend is running${NC}"
else
    echo -e "${RED}✗ Frontend failed to start${NC}"
    docker-compose -f docker-compose.yml logs
    exit 1
fi

# Step 7: Deploy React admin dashboard
echo ""
echo -e "${YELLOW}[7/8] Deploying React admin dashboard...${NC}"
docker-compose -f docker-compose-admin.yml up -d
sleep 10
if docker ps | grep -q "mobilklar-admin-dashboard"; then
    echo -e "${GREEN}✓ Admin dashboard is running${NC}"
else
    echo -e "${RED}✗ Admin dashboard failed to start${NC}"
    docker-compose -f docker-compose-admin.yml logs
    exit 1
fi

# Step 8: Verify all services
echo ""
echo -e "${YELLOW}[8/8] Verifying deployment...${NC}"
echo ""
echo "Running containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Check health endpoints
echo "Testing health endpoints..."
sleep 5

# Test frontend
if curl -f -k https://${DOMAIN}/api/health &>/dev/null; then
    echo -e "${GREEN}✓ Frontend health check passed${NC}"
else
    echo -e "${YELLOW}⚠ Frontend health check not available (this may be normal if /api/health doesn't exist)${NC}"
fi

# Test admin dashboard
if curl -f -k https://${ADMIN_DOMAIN} &>/dev/null; then
    echo -e "${GREEN}✓ Admin dashboard is accessible${NC}"
else
    echo -e "${RED}✗ Admin dashboard not accessible${NC}"
fi

# Monitor startup logs
echo ""
echo "Recent logs from all services:"
echo "==============================="
echo ""
echo "Caddy logs:"
docker-compose -f docker-compose-caddy.yml logs --tail=10
echo ""
echo "Frontend logs:"
docker-compose -f docker-compose.yml logs --tail=10
echo ""
echo "Admin logs:"
docker-compose -f docker-compose-admin.yml logs --tail=10

# Final status
echo ""
echo "==================================================="
echo -e "${GREEN}   Deployment Complete!   ${NC}"
echo "==================================================="
echo ""
echo "Services deployed:"
echo "  • Caddy Reverse Proxy"
echo "  • Next.js Frontend: https://${DOMAIN}"
echo "  • React Admin Dashboard: https://${ADMIN_DOMAIN}"
echo ""
echo "Next steps:"
echo "  1. Verify both apps are accessible in browser"
echo "  2. Check security headers: curl -I https://${DOMAIN}"
echo "  3. Monitor traffic: sudo /usr/local/bin/monitor-traffic.sh"
echo "  4. View logs: docker-compose -f docker-compose-[service].yml logs -f"
echo ""
echo "Security monitoring:"
echo "  • AIDE: sudo aide --check"
echo "  • Rkhunter: sudo rkhunter --check"
echo "  • Fail2ban: sudo fail2ban-client status"
echo "  • UFW status: sudo ufw status verbose"
echo ""
echo -e "${YELLOW}Important: Monitor system for the first hour after deployment${NC}"
echo "==================================================="
