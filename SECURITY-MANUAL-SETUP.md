# 🔒 Manual Security Hardening Guide for DigitalOcean Droplet
## Prevent DDoS Attacks and Compromise

> **CRITICAL**: Your previous droplet was compromised and used in a DDoS attack. Follow EVERY step below to prevent this from happening again.

---

## 📋 Table of Contents
1. [Initial Setup](#1-initial-setup)
2. [SSH Hardening](#2-ssh-hardening-critical)
3. [Firewall Configuration](#3-firewall-configuration)
4. [Fail2Ban Setup](#4-fail2ban-setup)
5. [System Hardening](#5-system-hardening)
6. [Docker Security](#6-docker-security)
7. [Monitoring & Logging](#7-monitoring--logging)
8. [Regular Maintenance](#8-regular-maintenance)

---

## 1. Initial Setup

### 1.1 Update System
```bash
# Always run as first step on new droplet
sudo apt update && sudo apt upgrade -y
sudo apt autoremove -y
```

### 1.2 Set Hostname
```bash
sudo hostnamectl set-hostname mobilklar-frontend
```

### 1.3 Install Essential Security Tools
```bash
sudo apt install -y \
    ufw \
    fail2ban \
    unattended-upgrades \
    rkhunter \
    lynis \
    aide \
    logwatch \
    iptables-persistent
```

---

## 2. SSH Hardening (CRITICAL)

### 2.1 Create Non-Root User First
```bash
# Create deployment user
sudo adduser deployuser
sudo usermod -aG sudo deployuser

# Switch to this user
su - deployuser
```

### 2.2 Setup SSH Keys (MUST DO BEFORE DISABLING PASSWORD AUTH)

**On your LOCAL machine:**
```bash
# Generate SSH key if you don't have one
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub
```

**On the DROPLET (as deployuser):**
```bash
# Create .ssh directory
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add your public key
nano ~/.ssh/authorized_keys
# Paste your public key here, save and exit

chmod 600 ~/.ssh/authorized_keys
```

### 2.3 Test SSH Key Access
**In a NEW terminal (don't close your current session!):**
```bash
ssh deployuser@YOUR_DROPLET_IP
```

If this works, continue. If not, FIX IT before proceeding!

### 2.4 Harden SSH Configuration
```bash
sudo nano /etc/ssh/sshd_config
```

**Add/modify these settings:**
```bash
# Disable root login
PermitRootLogin no

# Disable password authentication
PasswordAuthentication no
PubkeyAuthentication yes
ChallengeResponseAuthentication no

# No empty passwords
PermitEmptyPasswords no

# Limit attempts
MaxAuthTries 3
MaxSessions 2

# Disable unnecessary features
X11Forwarding no
AllowAgentForwarding no
PermitTunnel no

# Set idle timeout (5 minutes)
ClientAliveInterval 300
ClientAliveCountMax 2

# Use only strong ciphers
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes256-ctr
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com
KexAlgorithms curve25519-sha256,diffie-hellman-group16-sha512

# Limit to specific user
AllowUsers deployuser

# Increase logging
LogLevel VERBOSE
```

### 2.5 Restart SSH (ONLY if you tested key access!)
```bash
sudo systemctl restart sshd
```

---

## 3. Firewall Configuration

### 3.1 Basic UFW Setup
```bash
# Reset firewall
sudo ufw --force reset

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw default deny routed

# Allow SSH with rate limiting (prevents brute force)
sudo ufw limit 22/tcp comment 'SSH - Rate Limited'

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'
sudo ufw allow 443/udp comment 'HTTP/3'

# Enable logging
sudo ufw logging on

# Enable firewall
sudo ufw enable
```

### 3.2 Advanced Firewall Rules (DDoS Protection)
```bash
# Limit connections per IP to prevent DDoS
sudo iptables -A INPUT -p tcp --dport 80 -m connlimit --connlimit-above 20 --connlimit-mask 32 -j REJECT --reject-with tcp-reset
sudo iptables -A INPUT -p tcp --dport 443 -m connlimit --connlimit-above 20 --connlimit-mask 32 -j REJECT --reject-with tcp-reset

# Drop invalid packets
sudo iptables -A INPUT -m conntrack --ctstate INVALID -j DROP

# Block common attack patterns
sudo iptables -A INPUT -p tcp --tcp-flags ALL NONE -j DROP
sudo iptables -A INPUT -p tcp --tcp-flags ALL ALL -j DROP
sudo iptables -A INPUT -p tcp ! --syn -m state --state NEW -j DROP

# Block fragmented packets
sudo iptables -A INPUT -f -j DROP

# Save rules
sudo netfilter-persistent save
```

### 3.3 Verify Firewall
```bash
sudo ufw status verbose
sudo iptables -L -n -v
```

---

## 4. Fail2Ban Setup

### 4.1 Create Jail Configuration
```bash
sudo nano /etc/fail2ban/jail.local
```

**Add this configuration:**
```ini
[DEFAULT]
# Ban time: 1 hour
bantime = 3600
# Check window: 10 minutes
findtime = 600
# Max attempts before ban
maxretry = 3
# Your email for alerts
destemail = admin@mobilklar.no
sendername = Fail2Ban-Mobilklar
# Action: ban and send email
action = %(action_mwl)s

# SSH Protection
[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 7200
findtime = 600

# SSH DDoS Protection
[sshd-ddos]
enabled = true
port = 22
filter = sshd-ddos
logpath = /var/log/auth.log
maxretry = 2
bantime = 7200

# Nginx Protection (add after installing nginx/caddy)
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

# Repeat offenders (ban for 1 week)
[recidive]
enabled = true
filter = recidive
logpath = /var/log/fail2ban.log
action = %(action_mwl)s
bantime = 604800
findtime = 86400
maxretry = 3
```

### 4.2 Start Fail2Ban
```bash
sudo systemctl enable fail2ban
sudo systemctl restart fail2ban
```

### 4.3 Check Fail2Ban Status
```bash
# Overall status
sudo fail2ban-client status

# Check specific jail
sudo fail2ban-client status sshd

# View banned IPs
sudo fail2ban-client status sshd | grep "Banned IP"
```

---

## 5. System Hardening

### 5.1 Kernel Security Parameters
```bash
sudo nano /etc/sysctl.conf
```

**Add these security settings:**
```bash
# === NETWORK SECURITY ===

# Disable IP forwarding
net.ipv4.ip_forward = 0
net.ipv6.conf.all.forwarding = 0

# Disable source packet routing
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0

# Disable ICMP redirects (prevents MITM attacks)
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv4.conf.all.secure_redirects = 0

# Enable IP spoofing protection
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Ignore ICMP broadcasts (smurf attack protection)
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Ignore bogus ICMP errors
net.ipv4.icmp_ignore_bogus_error_responses = 1

# === DDoS PROTECTION ===

# Enable TCP SYN cookies (prevents SYN flood attacks)
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_syn_retries = 2
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_max_syn_backlog = 4096

# Increase connection tracking
net.netfilter.nf_conntrack_max = 2000000
net.netfilter.nf_conntrack_tcp_timeout_time_wait = 30

# TCP hardening
net.ipv4.tcp_rfc1337 = 1
net.ipv4.tcp_timestamps = 0

# === LOGGING ===

# Log suspicious packets
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.default.log_martians = 1

# === PERFORMANCE ===

# Increase file watchers (for Node.js/Next.js)
fs.inotify.max_user_watches = 524288

# Increase system limits
fs.file-max = 2097152
net.core.somaxconn = 65535
net.ipv4.tcp_max_tw_buckets = 1440000

# Connection limits
net.core.netdev_max_backlog = 5000
```

**Apply settings:**
```bash
sudo sysctl -p
```

### 5.2 Automatic Security Updates
```bash
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades
```

**Configure automatic updates:**
```bash
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESMApps:${distro_codename}-apps-security";
    "${distro_id}ESM:${distro_codename}-infra-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
```

**Enable automatic updates:**
```bash
sudo nano /etc/apt/apt.conf.d/20auto-upgrades
```

```bash
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
```

---

## 6. Docker Security

### 6.1 Install Docker Securely
```bash
# Remove old versions
sudo apt remove docker docker-engine docker.io containerd runc

# Install from official repository
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 6.2 Harden Docker Configuration
```bash
sudo nano /etc/docker/daemon.json
```

**Add security configuration:**
```json
{
  "live-restore": true,
  "userland-proxy": false,
  "no-new-privileges": true,
  "icc": false,
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 64000,
      "Soft": 64000
    }
  }
}
```

**Restart Docker:**
```bash
sudo systemctl restart docker
```

### 6.3 Add User to Docker Group
```bash
sudo usermod -aG docker deployuser
# Log out and back in for this to take effect
```

### 6.4 Docker Security Best Practices

**In your docker-compose.yml:**
```yaml
services:
  app:
    # Run as non-root user
    user: "1000:1000"
    
    # Read-only root filesystem
    read_only: true
    
    # Disable new privileges
    security_opt:
      - no-new-privileges:true
    
    # Limit resources
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
    
    # Only expose necessary ports
    expose:
      - "3000"
    
    # Don't use host network
    network_mode: bridge
```

---

## 7. Monitoring & Logging

### 7.1 Create Security Check Script
```bash
sudo nano /usr/local/bin/security-check.sh
```

**Add this script:**
```bash
#!/bin/bash
echo "=== SECURITY STATUS CHECK ==="
echo ""
echo "📊 System Uptime:"
uptime
echo ""
echo "🔥 Firewall Status:"
sudo ufw status numbered
echo ""
echo "🚫 Fail2Ban Status:"
sudo fail2ban-client status
echo ""
echo "📡 Listening Ports:"
sudo netstat -tulpn | grep LISTEN
echo ""
echo "👥 Active SSH Sessions:"
who
echo ""
echo "❌ Recent Failed Login Attempts:"
sudo grep "Failed password" /var/log/auth.log | tail -10
echo ""
echo "🔒 Banned IPs (SSH):"
sudo fail2ban-client status sshd | grep "Banned IP list"
echo ""
echo "🐳 Docker Containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "💾 Disk Usage:"
df -h / | tail -1
echo ""
echo "💻 Memory Usage:"
free -h
echo ""
echo "🔄 Last 10 System Updates:"
grep "upgrade" /var/log/dpkg.log | tail -10
echo ""
```

**Make it executable:**
```bash
sudo chmod +x /usr/local/bin/security-check.sh
```

**Run it:**
```bash
security-check.sh
```

### 7.2 Setup Daily Security Reports
```bash
sudo nano /etc/cron.daily/security-report
```

```bash
#!/bin/bash
LOGFILE="/var/log/security-report.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "=== Security Report - $DATE ===" >> $LOGFILE
echo "" >> $LOGFILE

echo "Failed SSH Attempts:" >> $LOGFILE
grep "Failed password" /var/log/auth.log | tail -20 >> $LOGFILE

echo "" >> $LOGFILE
echo "Fail2Ban Summary:" >> $LOGFILE
fail2ban-client status sshd >> $LOGFILE 2>&1

echo "" >> $LOGFILE
echo "Active Connections:" >> $LOGFILE
netstat -an | grep ESTABLISHED | wc -l >> $LOGFILE

echo "" >> $LOGFILE
echo "Disk Usage:" >> $LOGFILE
df -h / >> $LOGFILE

echo "========================================" >> $LOGFILE
echo "" >> $LOGFILE
```

**Make it executable:**
```bash
sudo chmod +x /etc/cron.daily/security-report
```

### 7.3 Monitor Logs in Real-Time
```bash
# Watch authentication attempts
sudo tail -f /var/log/auth.log

# Watch Fail2Ban bans
sudo tail -f /var/log/fail2ban.log

# Watch firewall logs
sudo tail -f /var/log/ufw.log

# Watch all Docker logs
docker compose logs -f
```

---

## 8. Regular Maintenance

### 8.1 Daily Tasks
```bash
# Check security status
security-check.sh

# Check for suspicious activity
sudo grep "Failed password" /var/log/auth.log | tail -20

# Check Docker containers
docker ps
```

### 8.2 Weekly Tasks
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Check disk space
df -h

# Review security reports
sudo cat /var/log/security-report.log | tail -100

# Run security audit
sudo lynis audit system --quick
```

### 8.3 Monthly Tasks
```bash
# Full security audit
sudo lynis audit system

# Check for rootkits
sudo rkhunter --check --skip-keypress

# Review and rotate logs
sudo logrotate -f /etc/logrotate.conf

# Update Docker images
cd /var/www/mobilklar/EdTech-Platform
docker compose pull
docker compose up -d --build

# Clean Docker resources
docker system prune -a --volumes --force
```

---

## 9. Quick Reference Commands

### Firewall
```bash
# Check status
sudo ufw status verbose

# Allow a port temporarily
sudo ufw allow 8080/tcp

# Delete a rule
sudo ufw delete allow 8080/tcp

# Reload firewall
sudo ufw reload
```

### Fail2Ban
```bash
# Check status
sudo fail2ban-client status

# Check specific jail
sudo fail2ban-client status sshd

# Unban an IP
sudo fail2ban-client set sshd unbanip 192.168.1.100

# Ban an IP manually
sudo fail2ban-client set sshd banip 192.168.1.100
```

### SSH
```bash
# Test SSH config
sudo sshd -t

# Reload SSH
sudo systemctl reload sshd

# Check SSH logs
sudo grep sshd /var/log/auth.log | tail -20
```

### Docker
```bash
# View logs
docker compose logs -f

# Restart service
docker compose restart

# Stop all containers
docker compose down

# Clean up
docker system prune -a
```

---

## ⚠️ Emergency Recovery

If you get locked out:

1. **Use DigitalOcean Console Access:**
   - Go to your droplet in DO dashboard
   - Click "Access" → "Launch Recovery Console"

2. **Temporarily enable password auth:**
   ```bash
   sudo sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
   sudo systemctl restart sshd
   ```

3. **Fix your SSH keys and then re-disable:**
   ```bash
   sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
   sudo systemctl restart sshd
   ```

---

## 📝 Security Checklist

Use this checklist for every new droplet:

- [ ] System updated (`apt update && apt upgrade`)
- [ ] Non-root user created
- [ ] SSH keys configured
- [ ] SSH password auth disabled
- [ ] Root login disabled
- [ ] Firewall (UFW) enabled with strict rules
- [ ] Fail2Ban installed and configured
- [ ] Automatic security updates enabled
- [ ] System hardening (sysctl) applied
- [ ] Docker installed and hardened
- [ ] Security monitoring scripts setup
- [ ] Tested SSH access from multiple locations
- [ ] Documentation reviewed
- [ ] DNS records updated
- [ ] SSL/TLS certificates configured
- [ ] Regular backups configured

---

## 🔗 Additional Resources

- [DigitalOcean Security Best Practices](https://www.digitalocean.com/community/tutorials/recommended-security-measures-to-protect-your-servers)
- [CIS Ubuntu Benchmark](https://www.cisecurity.org/benchmark/ubuntu_linux)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [Fail2Ban Documentation](https://www.fail2ban.org/wiki/index.php/Main_Page)

---

**Remember:** Security is an ongoing process, not a one-time setup. Regularly review logs, update systems, and stay informed about new threats.
