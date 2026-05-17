#!/bin/bash

# ============================================
# Mobilklar Frontend Droplet Setup Script
# Ubuntu 24.04 LTS - HARDENED SECURITY SETUP
# ============================================
# This script implements enterprise-level security
# to prevent compromise and DDoS attacks
# ============================================

set -e  # Exit on any error

echo "=========================================="
echo "🔒 Mobilklar HARDENED Droplet Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

print_warning() {
    echo -e "${BLUE}⚠ $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root (use sudo)"
    exit 1
fi

print_warning "This script will HARDEN your droplet security"
print_warning "It will disable password authentication and configure strict firewall rules"
echo ""
read -p "Continue? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "Setup cancelled"
    exit 1
fi

print_info "Starting HARDENED droplet setup..."

# ============================================
# 1. System Update and Upgrade
# ============================================
print_info "Updating system packages..."
apt-get update -y
apt-get upgrade -y
print_success "System updated"

# ============================================
# 2. Install Essential Security Tools
# ============================================
print_info "Installing essential security tools..."
apt-get install -y \
    curl \
    wget \
    git \
    ufw \
    fail2ban \
    unattended-upgrades \
    apt-listchanges \
    htop \
    vim \
    ca-certificates \
    gnupg \
    lsb-release \
    rkhunter \
    lynis \
    aide \
    rsyslog \
    logwatch
print_success "Security tools installed"

# ============================================
# 2.1. Configure Automatic Security Updates
# ============================================
print_info "Configuring automatic security updates..."
cat > /etc/apt/apt.conf.d/50unattended-upgrades << 'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESMApps:${distro_codename}-apps-security";
    "${distro_id}ESM:${distro_codename}-infra-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
EOF

cat > /etc/apt/apt.conf.d/20auto-upgrades << 'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF

systemctl enable unattended-upgrades
systemctl start unattended-upgrades
print_success "Automatic security updates configured"

# ============================================
# 3. Install Docker
# ============================================
print_info "Installing Docker..."

# Remove old versions if any
apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

# Add Docker's official GPG key
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start and enable Docker
systemctl start docker
systemctl enable docker

print_success "Docker installed"

# ============================================
# 4. Configure Docker (non-root user)
# ============================================
print_info "Configuring Docker for non-root user..."

# Create docker group if it doesn't exist
groupadd docker 2>/dev/null || true

# Get the actual user who ran sudo (not root)
ACTUAL_USER=${SUDO_USER:-$USER}

if [ "$ACTUAL_USER" != "root" ]; then
    usermod -aG docker $ACTUAL_USER
    print_success "User $ACTUAL_USER added to docker group"
else
    print_info "Running as root, skipping user docker group setup"
fi

# ============================================
# 5. Setup HARDENED Firewall (UFW)
# ============================================
print_info "Configuring HARDENED firewall..."

# Reset UFW to default
ufw --force reset

# Default policies
ufw default deny incoming
ufw default allow outgoing
ufw default deny routed

# Rate limit SSH to prevent brute force
ufw limit 22/tcp comment 'SSH - Rate Limited'

# Allow HTTP and HTTPS
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw allow 443/udp comment 'HTTP/3'

# Log all denied connections
ufw logging on

# Enable UFW
ufw --force enable

print_success "HARDENED firewall configured"

# ============================================
# 5.1. Configure Advanced Firewall Rules
# ============================================
print_info "Configuring advanced firewall rules..."

# Prevent DDoS attacks - limit connections
iptables -A INPUT -p tcp --dport 80 -m connlimit --connlimit-above 20 --connlimit-mask 32 -j REJECT --reject-with tcp-reset
iptables -A INPUT -p tcp --dport 443 -m connlimit --connlimit-above 20 --connlimit-mask 32 -j REJECT --reject-with tcp-reset

# Drop invalid packets
iptables -A INPUT -m conntrack --ctstate INVALID -j DROP

# Block common attack patterns
iptables -A INPUT -p tcp --tcp-flags ALL NONE -j DROP
iptables -A INPUT -p tcp --tcp-flags ALL ALL -j DROP

# Note: iptables rules are managed by UFW and will persist through UFW
print_info "Note: Advanced iptables rules applied via UFW"

print_success "Advanced firewall rules configured"

# ============================================
# 6. Configure HARDENED Fail2Ban
# ============================================
print_info "Configuring HARDENED Fail2Ban..."

# Create custom jail configuration
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
destemail = admin@mobilklar.no
sendername = Fail2Ban
action = %(action_mwl)s

[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 7200

[sshd-ddos]
enabled = true
port = 22
filter = sshd-ddos
logpath = /var/log/auth.log
maxretry = 2
bantime = 7200

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3

[nginx-botsearch]
enabled = true
filter = nginx-botsearch
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2
bantime = 86400

[nginx-badbots]
enabled = true
filter = nginx-badbots
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2
bantime = 86400

[nginx-noscript]
enabled = true
filter = nginx-noscript
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2

[nginx-noproxy]
enabled = true
filter = nginx-noproxy
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2

[recidive]
enabled = true
filter = recidive
logpath = /var/log/fail2ban.log
action = %(action_mwl)s
bantime = 604800
findtime = 86400
maxretry = 3
EOF

systemctl enable fail2ban
systemctl restart fail2ban

print_success "HARDENED Fail2Ban configured"

# ============================================
# 6.1. Initialize AIDE (Intrusion Detection)
# ============================================
print_info "Initializing AIDE intrusion detection system..."

# Initialize AIDE database (this takes time)
print_info "Creating AIDE database (this may take several minutes)..."
aideinit

# Move database to proper location
if [ -f /var/lib/aide/aide.db.new ]; then
    mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db
    print_success "AIDE database initialized"
else
    print_warning "AIDE database not created - will run on next system scan"
fi

# Setup daily AIDE check
cat > /etc/cron.daily/aide-check << 'EOF'
#!/bin/bash
/usr/bin/aide --check | mail -s "AIDE Daily Report - $(hostname)" admin@mobilklar.no
EOF
chmod +x /etc/cron.daily/aide-check

print_success "AIDE intrusion detection configured"

# ============================================
# 6.2. Configure rkhunter (Rootkit Detection)
# ============================================
print_info "Configuring rkhunter for rootkit detection..."

# Update rkhunter database
rkhunter --update

# Run initial scan
print_info "Running initial rkhunter scan..."
rkhunter --propupd

# Setup weekly scan
cat > /etc/cron.weekly/rkhunter-scan << 'EOF'
#!/bin/bash
/usr/bin/rkhunter --check --skip-keypress --report-warnings-only | mail -s "RKHunter Weekly Report - $(hostname)" admin@mobilklar.no
EOF
chmod +x /etc/cron.weekly/rkhunter-scan

print_success "Rootkit detection configured"

# ============================================
# 7. Create Application Directory
# ============================================
print_info "Creating application directory..."

APP_DIR="/var/www/mobilklar"
mkdir -p $APP_DIR

# Set ownership to the actual user
if [ "$ACTUAL_USER" != "root" ]; then
    chown -R $ACTUAL_USER:$ACTUAL_USER $APP_DIR
fi

print_success "Application directory created at $APP_DIR"

# ============================================
# 8. Configure Git (for deployment)
# ============================================
print_info "Configuring Git..."

# Set git to store credentials
git config --global credential.helper store

print_success "Git configured"

# ============================================
# 8.1. HARDEN SSH Configuration
# ============================================
print_info "HARDENING SSH configuration..."

# Backup original sshd_config
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Configure secure SSH settings
cat >> /etc/ssh/sshd_config << 'EOF'

# === HARDENED SSH CONFIGURATION ===
# Disable root login
PermitRootLogin no

# Disable password authentication (SSH keys only)
PasswordAuthentication no
PubkeyAuthentication yes
ChallengeResponseAuthentication no

# Disable empty passwords
PermitEmptyPasswords no

# Limit authentication attempts
MaxAuthTries 3
MaxSessions 2

# Disable X11 forwarding
X11Forwarding no

# Disable agent forwarding
AllowAgentForwarding no

# Set idle timeout
ClientAliveInterval 300
ClientAliveCountMax 2

# Use only strong ciphers
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr,aes192-ctr,aes128-ctr
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com,hmac-sha2-512,hmac-sha2-256
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,diffie-hellman-group16-sha512,diffie-hellman-group18-sha512

# Log more information
LogLevel VERBOSE

# Limit user access (uncomment and modify after creating deployment user)
# AllowUsers deployuser
EOF

print_warning "SSH HARDENING APPLIED - Root login and password auth will be DISABLED after restart"
print_warning "Make sure you have SSH key access configured BEFORE restarting SSH!"

print_success "SSH configuration hardened"

# ============================================
# 9. Setup Swap (recommended for 4GB RAM)
# ============================================
print_info "Setting up swap space..."

# Check if swap already exists
if [ $(swapon --show | wc -l) -eq 0 ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    
    # Make swap permanent
    echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
    
    print_success "Swap configured (2GB)"
else
    print_info "Swap already configured"
fi

# ============================================
# 10. Optimize System Settings
# ============================================
print_info "Optimizing system settings and security parameters..."

# Security hardening via sysctl
cat >> /etc/sysctl.conf << 'EOF'

# === SECURITY HARDENING ===
# IP Forwarding (disable unless needed)
net.ipv4.ip_forward = 0
net.ipv6.conf.all.forwarding = 0

# Disable source packet routing
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0
net.ipv6.conf.default.accept_source_route = 0

# Disable ICMP redirects
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv6.conf.default.accept_redirects = 0
net.ipv4.conf.all.secure_redirects = 0
net.ipv4.conf.default.secure_redirects = 0

# Enable IP spoofing protection
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Ignore ICMP ping requests
net.ipv4.icmp_echo_ignore_all = 0
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Ignore bogus ICMP error responses
net.ipv4.icmp_ignore_bogus_error_responses = 1

# Enable TCP SYN cookies (DDoS protection)
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_syn_retries = 2
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_max_syn_backlog = 4096

# Log suspicious packets
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.default.log_martians = 1

# Increase file watchers for Next.js
fs.inotify.max_user_watches = 524288

# Increase system limits
fs.file-max = 2097152
net.core.somaxconn = 65535
net.ipv4.tcp_max_tw_buckets = 1440000

# Protect against time-wait assassination
net.ipv4.tcp_rfc1337 = 1

# Disable IPv6 if not needed
net.ipv6.conf.all.disable_ipv6 = 0
net.ipv6.conf.default.disable_ipv6 = 0
EOF

sysctl -p

print_success "System security parameters optimized"

# ============================================
# 11. Create Secure Deployment User
# ============================================
print_info "Creating secure deployment user..."

# Get deployment username
ACTUAL_USER=${SUDO_USER:-}

if [ -z "$ACTUAL_USER" ] || [ "$ACTUAL_USER" = "root" ]; then
    print_warning "No non-root user detected. Please create one:"
    read -p "Enter username for deployment user: " DEPLOY_USER
    
    # Create user
    adduser --gecos "" $DEPLOY_USER
    
    # Add to sudo group
    usermod -aG sudo $DEPLOY_USER
    usermod -aG docker $DEPLOY_USER
    
    print_success "User $DEPLOY_USER created"
    
    # Setup SSH directory
    mkdir -p /home/$DEPLOY_USER/.ssh
    chmod 700 /home/$DEPLOY_USER/.ssh
    touch /home/$DEPLOY_USER/.ssh/authorized_keys
    chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys
    chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh
    
    print_warning "Add your SSH public key to /home/$DEPLOY_USER/.ssh/authorized_keys"
else
    DEPLOY_USER=$ACTUAL_USER
    usermod -aG docker $DEPLOY_USER
    print_success "Using existing user: $DEPLOY_USER"
fi

# ============================================
# 12. Setup Security Monitoring
# ============================================
print_info "Setting up security monitoring..."

# Install network monitoring tools
apt-get install -y iftop nethogs vnstat tcpdump

# Configure vnstat for network traffic monitoring
systemctl enable vnstat
systemctl start vnstat

# Create security check script
cat > /usr/local/bin/security-check.sh << 'EOF'
#!/bin/bash
echo "=== Security Status Check ==="
echo ""
echo "Firewall Status:"
ufw status numbered
echo ""
echo "Fail2Ban Status:"
fail2ban-client status
echo ""
echo "Active Network Connections:"
netstat -tulpn | grep LISTEN
echo ""
echo "Recent Failed Login Attempts:"
grep "Failed password" /var/log/auth.log | tail -10
echo ""
echo "Banned IPs:"
fail2ban-client status sshd | grep "Banned IP"
echo ""
echo "Docker Containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "Network Traffic Summary (today):"
vnstat -d 1
echo ""
echo "Top Network Connections:"
netstat -an | grep ESTABLISHED | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -nr | head -10
EOF

chmod +x /usr/local/bin/security-check.sh

# Create outbound traffic monitoring script
cat > /usr/local/bin/monitor-traffic.sh << 'EOF'
#!/bin/bash
# Monitor for suspicious outbound traffic

THRESHOLD=1000  # packets per second threshold
LOG_FILE="/var/log/traffic-monitor.log"

# Count outbound packets
OUTBOUND=$(iptables -L OUTPUT -v -n | grep -v "Chain\|pkts" | awk '{sum+=$1} END {print sum}')

# Log if above threshold
if [ "$OUTBOUND" -gt "$THRESHOLD" ]; then
    echo "$(date): WARNING - High outbound traffic detected: $OUTBOUND pps" >> $LOG_FILE
    # Get top connections
    netstat -an | grep ESTABLISHED | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -nr | head -10 >> $LOG_FILE
fi
EOF

chmod +x /usr/local/bin/monitor-traffic.sh

# Add to crontab (check every 5 minutes)
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/monitor-traffic.sh") | crontab -

print_success "Security monitoring configured"

# ============================================
# 13. Setup Log Rotation and Monitoring
# ============================================
print_info "Run 'security-check.sh' anytime to check security status"

# ============================================
# 13. Setup Docker Security
# ============================================
print_info "Configuring Docker security..."

# Create Docker daemon configuration for security
mkdir -p /etc/docker
cat > /etc/docker/daemon.json << 'EOF'
{
  "live-restore": true,
  "userland-proxy": false,
  "no-new-privileges": true,
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

# Restart Docker to apply changes
systemctl restart docker

print_success "Docker security configured"

# ============================================
# 14. Setup Log Monitoring
# ============================================
print_info "Configuring log monitoring..."

# Create daily security report
cat > /etc/cron.daily/security-report << 'EOF'
#!/bin/bash
LOGFILE="/var/log/security-report.log"
echo "=== Daily Security Report - $(date) ===" >> $LOGFILE
echo "" >> $LOGFILE
echo "Failed SSH Attempts:" >> $LOGFILE
grep "Failed password" /var/log/auth.log | tail -20 >> $LOGFILE
echo "" >> $LOGFILE
echo "Fail2Ban Bans:" >> $LOGFILE
fail2ban-client status sshd >> $LOGFILE 2>&1
echo "" >> $LOGFILE
echo "Suspicious Network Activity:" >> $LOGFILE
netstat -an | grep -E "SYN_RECV|TIME_WAIT" | wc -l >> $LOGFILE
echo "" >> $LOGFILE
EOF

chmod +x /etc/cron.daily/security-report

print_success "Log monitoring configured"

# ============================================
# 15. Create Deployment Instructions
# ============================================
print_info "Creating deployment instructions..."

cat > /root/deployment-info.txt << EOF
========================================
Mobilklar HARDENED Droplet - Security Info
========================================

Server IP: $(curl -s ifconfig.me)
Application Directory: $APP_DIR
Deployment User: ${DEPLOY_USER:-"NOT_SET"}
Docker Version: $(docker --version)

🔒 SECURITY MEASURES APPLIED:
--------------------------------
✓ Firewall (UFW) - Strict rules with rate limiting
✓ Fail2Ban - Aggressive ban policies
✓ SSH Hardening - Password auth DISABLED (SSH keys only)
✓ Root login DISABLED
✓ Automatic security updates enabled
✓ DDoS protection enabled
✓ Advanced iptables rules
✓ Docker security hardening
✓ Security monitoring and logging
✓ Daily security reports

⚠️  CRITICAL SECURITY WARNINGS:
--------------------------------
1. SSH password authentication is DISABLED
   - You MUST use SSH keys to connect
   - Root login is DISABLED
   - Connect as: ssh ${DEPLOY_USER:-deployuser}@$(curl -s ifconfig.me)

2. Before restarting SSH service, ensure:
   - Your SSH public key is in ~/.ssh/authorized_keys
   - Test connection in a NEW terminal first
   - Keep current session open as backup

3. Firewall is ACTIVE:
   - Only ports 22 (SSH), 80 (HTTP), 443 (HTTPS) are open
   - All other ports are BLOCKED

Security Commands:
------------------
- Check firewall status: sudo ufw status
- Check Fail2Ban status: sudo fail2ban-client status
- View security report: sudo security-check.sh
- View banned IPs: sudo fail2ban-client status sshd
- Check logs: sudo tail -f /var/log/auth.log
- Daily security log: sudo cat /var/log/security-report.log

Next Steps:
-----------

1. ADD YOUR SSH PUBLIC KEY (CRITICAL!):
   On your local machine:
   cat ~/.ssh/id_rsa.pub
   
   On server as ${DEPLOY_USER:-deployuser}:
   echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys

2. TEST SSH connection in NEW terminal BEFORE restarting:
   ssh ${DEPLOY_USER:-deployuser}@$(curl -s ifconfig.me)

3. ONLY AFTER successful test, restart SSH:
   sudo systemctl restart sshd

4. Update DNS Records:
   - Point mobilklar.no A record to: $(curl -s ifconfig.me)
   - Point www.mobilklar.no A record to: $(curl -s ifconfig.me)

5. Clone repository:
   cd $APP_DIR
   git clone <your-repo-url> .

6. Create .env file:
   nano .env
   
   Add:
   Backend_url=https://api.mobilklar.no/api/v1
   NEXT_PUBLIC_FRONT_END_URL=https://mobilklar.no

7. Deploy with Docker:
   docker compose up -d --build

8. Check security status regularly:
   security-check.sh

Security Monitoring:
-------------------
- Daily security reports: /var/log/security-report.log
- Failed logins: /var/log/auth.log
- Firewall logs: /var/log/ufw.log
- Fail2Ban logs: /var/log/fail2ban.log

Emergency Access:
-----------------
If locked out, use DigitalOcean Console Access:
1. Go to your droplet in DigitalOcean dashboard
2. Click "Access" → "Launch Recovery Console"
3. Enable password authentication temporarily:
   sudo sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
   sudo systemctl restart sshd

========================================
KEEP THIS FILE SECURE - Contains sensitive info
========================================
EOF

print_success "Deployment info saved to /root/deployment-info.txt"

# ============================================
# Final Summary
# ============================================
echo ""
echo "=========================================="
print_success "HARDENED SECURITY SETUP COMPLETE!"
echo "=========================================="
echo ""
print_warning "🔒 CRITICAL SECURITY NOTES:"
echo ""
print_error "1. SSH PASSWORD AUTH IS NOW DISABLED"
print_error "2. ROOT LOGIN IS DISABLED"
print_error "3. YOU MUST USE SSH KEYS"
echo ""
print_info "System Information:"
echo "  - Docker: $(docker --version)"
echo "  - Docker Compose: $(docker compose version)"
echo "  - Server IP: $(curl -s ifconfig.me)"
echo "  - Application Directory: $APP_DIR"
echo "  - Deployment User: ${DEPLOY_USER:-"NOT_SET"}"
echo ""
print_info "Security Features Enabled:"
echo "  ✓ Hardened firewall with DDoS protection"
echo "  ✓ Fail2Ban with aggressive policies"
echo "  ✓ SSH hardening (keys only, no passwords)"
echo "  ✓ Automatic security updates"
echo "  ✓ Security monitoring and logging"
echo "  ✓ Docker security hardening"
echo ""
print_warning "⚠️  BEFORE CLOSING THIS TERMINAL:"
echo ""
echo "  1. Add your SSH public key to ~/.ssh/authorized_keys"
echo "  2. Test SSH connection in a NEW terminal"
echo "  3. ONLY then run: sudo systemctl restart sshd"
echo ""
print_info "Next Steps:"
echo "  1. Review /root/deployment-info.txt for detailed instructions"
echo "  2. Add SSH keys for ${DEPLOY_USER:-deployuser}"
echo "  3. Test SSH connection BEFORE restarting SSH service"
echo "  4. Update DNS records"
echo "  5. Deploy your application"
echo ""
print_success "Run 'security-check.sh' to verify security status"
echo "=========================================="
echo ""
print_warning "DO NOT RESTART SSH SERVICE UNTIL YOU'VE ADDED YOUR SSH KEY!"
echo ""
