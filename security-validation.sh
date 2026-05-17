#!/bin/bash

# ============================================
# Pre-Deployment Security Validation Script
# ============================================
# Run this BEFORE deploying to verify security
# ============================================

set -e

echo "=================================================="
echo "🔒 SECURITY VALIDATION CHECK"
echo "=================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASSED=0
FAILED=0
WARNINGS=0

print_pass() {
    echo -e "${GREEN}✅ PASS:${NC} $1"
    ((PASSED++))
}

print_fail() {
    echo -e "${RED}❌ FAIL:${NC} $1"
    ((FAILED++))
}

print_warn() {
    echo -e "${YELLOW}⚠️  WARN:${NC} $1"
    ((WARNINGS++))
}

echo "🔍 Checking docker-compose.yml..."
echo ""

# Check 1: Port 3000 should NOT be exposed to host
if grep -q "ports:" docker-compose.yml && grep -q "3000:3000" docker-compose.yml; then
    print_fail "Port 3000 is EXPOSED to internet in docker-compose.yml"
    echo "   Fix: Remove 'ports: - \"3000:3000\"' line"
    echo "   Keep only 'expose: - \"3000\"'"
else
    print_pass "Port 3000 is NOT exposed (only internal access)"
fi

# Check 2: Port 9500 should NOT be exposed
if grep -q "9500:9500" docker-compose.yml 2>/dev/null; then
    print_fail "Port 9500 is EXPOSED to internet"
    echo "   Fix: Remove port exposure for admin dashboard"
else
    print_pass "Port 9500 is NOT exposed"
fi

# Check 3: Firewall status
echo ""
echo "🔥 Checking firewall..."
echo ""

if command -v ufw &> /dev/null; then
    if sudo ufw status | grep -q "Status: active"; then
        print_pass "UFW firewall is ACTIVE"
        
        # Check allowed ports
        ALLOWED_PORTS=$(sudo ufw status numbered | grep -E "ALLOW|LIMIT")
        
        if echo "$ALLOWED_PORTS" | grep -q "22"; then
            print_pass "SSH port 22 is allowed"
        else
            print_fail "SSH port 22 is NOT allowed (you may get locked out!)"
        fi
        
        if echo "$ALLOWED_PORTS" | grep -q "80"; then
            print_pass "HTTP port 80 is allowed"
        else
            print_warn "HTTP port 80 is not allowed (Caddy may not work)"
        fi
        
        if echo "$ALLOWED_PORTS" | grep -q "443"; then
            print_pass "HTTPS port 443 is allowed"
        else
            print_warn "HTTPS port 443 is not allowed (Caddy may not work)"
        fi
        
        # Check for exposed application ports
        if echo "$ALLOWED_PORTS" | grep -q "3000"; then
            print_fail "Port 3000 is ALLOWED in firewall (security risk!)"
        else
            print_pass "Port 3000 is blocked in firewall"
        fi
        
        if echo "$ALLOWED_PORTS" | grep -q "9500"; then
            print_fail "Port 9500 is ALLOWED in firewall (security risk!)"
        else
            print_pass "Port 9500 is blocked in firewall"
        fi
    else
        print_fail "UFW firewall is NOT active"
        echo "   Fix: Run 'sudo ufw enable'"
    fi
else
    print_fail "UFW is not installed"
    echo "   Fix: Run './setup-droplet.sh' to install and configure"
fi

# Check 4: Fail2Ban status
echo ""
echo "🚫 Checking Fail2Ban..."
echo ""

if command -v fail2ban-client &> /dev/null; then
    if sudo systemctl is-active --quiet fail2ban; then
        print_pass "Fail2Ban is running"
        
        # Check SSH jail
        if sudo fail2ban-client status sshd &> /dev/null; then
            print_pass "SSH jail is active"
            BANNED=$(sudo fail2ban-client status sshd | grep "Currently banned" | awk '{print $4}')
            echo "   Currently banned IPs: $BANNED"
        else
            print_warn "SSH jail is not configured"
        fi
    else
        print_fail "Fail2Ban is installed but not running"
        echo "   Fix: sudo systemctl start fail2ban"
    fi
else
    print_fail "Fail2Ban is not installed"
    echo "   Fix: Run './setup-droplet.sh'"
fi

# Check 5: SSH configuration
echo ""
echo "🔐 Checking SSH configuration..."
echo ""

if [ -f /etc/ssh/sshd_config ]; then
    # Check root login
    ROOT_LOGIN=$(sudo grep "^PermitRootLogin" /etc/ssh/sshd_config | awk '{print $2}')
    if [ "$ROOT_LOGIN" = "no" ]; then
        print_pass "Root login is DISABLED"
    else
        print_fail "Root login is ENABLED (security risk!)"
        echo "   Fix: Set 'PermitRootLogin no' in /etc/ssh/sshd_config"
    fi
    
    # Check password authentication
    PASS_AUTH=$(sudo grep "^PasswordAuthentication" /etc/ssh/sshd_config | awk '{print $2}')
    if [ "$PASS_AUTH" = "no" ]; then
        print_pass "Password authentication is DISABLED"
    else
        print_fail "Password authentication is ENABLED (brute-force risk!)"
        echo "   Fix: Set 'PasswordAuthentication no' in /etc/ssh/sshd_config"
    fi
else
    print_fail "SSH config file not found"
fi

# Check 6: Docker security
echo ""
echo "🐳 Checking Docker security..."
echo ""

if command -v docker &> /dev/null; then
    print_pass "Docker is installed"
    
    # Check if docker daemon is exposed
    if sudo netstat -tulpn | grep -q ":2375\|:2376"; then
        print_fail "Docker daemon is exposed on network (CRITICAL RISK!)"
    else
        print_pass "Docker daemon is not exposed"
    fi
    
    # Check for containers running as root
    if docker ps -q 2>/dev/null | xargs docker inspect --format='{{.Config.User}}' 2>/dev/null | grep -q "^$"; then
        print_warn "Some containers may be running as root"
        echo "   Review Dockerfile USER directive"
    else
        print_pass "Containers are not running as root"
    fi
else
    print_warn "Docker is not installed"
fi

# Check 7: Listening ports
echo ""
echo "📡 Checking listening ports..."
echo ""

if command -v netstat &> /dev/null; then
    LISTENING=$(sudo netstat -tulpn | grep LISTEN)
    
    # Should only have SSH, HTTP, HTTPS exposed
    EXPOSED_PORTS=$(echo "$LISTENING" | grep "0.0.0.0" | awk '{print $4}' | cut -d: -f2 | sort -u)
    
    echo "   Ports listening on 0.0.0.0:"
    echo "$EXPOSED_PORTS" | while read port; do
        case $port in
            22)
                echo "      $port (SSH) - OK"
                ;;
            80)
                echo "      $port (HTTP) - OK"
                ;;
            443)
                echo "      $port (HTTPS) - OK"
                ;;
            3000)
                print_fail "Port 3000 is listening on 0.0.0.0 (EXPOSED!)"
                echo "      This should only listen on Docker network"
                ;;
            9500)
                print_fail "Port 9500 is listening on 0.0.0.0 (EXPOSED!)"
                ;;
            *)
                print_warn "Unknown port $port is listening"
                ;;
        esac
    done
else
    print_warn "netstat not available, cannot check listening ports"
fi

# Check 8: .env file security
echo ""
echo "🔑 Checking environment files..."
echo ""

if [ -f .env ]; then
    print_pass ".env file exists"
    
    # Check for sensitive data not commented out
    if grep -q "PASSWORD\|SECRET\|KEY" .env | grep -v "^#"; then
        print_warn ".env contains sensitive variables (ensure it's not in git)"
    fi
    
    # Check .gitignore
    if [ -f .gitignore ] && grep -q ".env" .gitignore; then
        print_pass ".env is in .gitignore"
    else
        print_fail ".env is NOT in .gitignore (risk of exposing secrets!)"
    fi
else
    print_warn ".env file not found"
fi

# Check 9: System updates
echo ""
echo "🔄 Checking system security..."
echo ""

if command -v unattended-upgrades &> /dev/null; then
    print_pass "Automatic security updates are installed"
else
    print_fail "Automatic security updates not configured"
    echo "   Fix: Run './setup-droplet.sh'"
fi

# Check 10: Caddyfile security
echo ""
echo "📝 Checking Caddyfile..."
echo ""

if [ -f Caddyfile ]; then
    print_pass "Caddyfile exists"
    
    # Check for security headers
    if grep -q "Strict-Transport-Security" Caddyfile; then
        print_pass "HSTS header configured"
    else
        print_warn "HSTS header not found"
    fi
    
    if grep -q "Content-Security-Policy" Caddyfile; then
        print_pass "CSP header configured"
    else
        print_warn "CSP header not found"
    fi
    
    # Check for rate limiting or bot blocking
    if grep -q "@bad_bots\|@blocked" Caddyfile; then
        print_pass "Bot blocking rules found"
    else
        print_warn "No bot blocking rules configured"
    fi
else
    print_warn "Caddyfile not found in current directory"
fi

# Summary
echo ""
echo "=================================================="
echo "📊 SECURITY VALIDATION SUMMARY"
echo "=================================================="
echo ""
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL CRITICAL CHECKS PASSED!${NC}"
    echo ""
    echo "Your system appears to be properly secured."
    if [ $WARNINGS -gt 0 ]; then
        echo "Review warnings above for additional hardening."
    fi
    echo ""
    echo "✅ SAFE TO DEPLOY"
    exit 0
else
    echo -e "${RED}⛔ SECURITY ISSUES DETECTED!${NC}"
    echo ""
    echo "Fix the failed checks above before deploying."
    echo ""
    echo "❌ DO NOT DEPLOY UNTIL ALL CRITICAL ISSUES ARE FIXED"
    echo ""
    echo "Run './setup-droplet.sh' to fix most issues automatically."
    exit 1
fi
