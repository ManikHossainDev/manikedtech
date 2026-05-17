# 🚀 SECURE DEPLOYMENT GUIDE - Zero DDoS Risk

## ✅ ALL CRITICAL FIXES APPLIED

### Fixed Issues:
1. ✅ **Removed exposed port 3000** from docker-compose.yml
2. ✅ **Removed healthchecks** (reduces unnecessary network traffic)
3. ✅ **Added resource limits** to prevent resource exhaustion attacks
4. ✅ **Added security options** (no-new-privileges)
5. ✅ **Enhanced setup-droplet.sh** with:
   - AIDE intrusion detection
   - Rootkit scanner (rkhunter)
   - Network traffic monitoring
   - Outbound traffic alerts
   - Automated security reports

---

## 📋 DEPLOYMENT STEPS (FOLLOW EXACTLY)

### Step 1: Create New Droplet
```bash
# Use DigitalOcean dashboard:
# - Ubuntu 24.04 LTS
# - Add YOUR SSH public key
# - DO NOT enable password authentication
# - Minimum 2GB RAM recommended
```

### Step 2: Initial Login and Hardening
```bash
# SSH as root ONLY for initial setup
ssh root@YOUR_DROPLET_IP

# Clone repository
git clone https://github.com/YOUR_REPO/EdTech-Platform.git /tmp/setup
cd /tmp/setup

# Make scripts executable
chmod +x setup-droplet.sh security-validation.sh

# Run COMPREHENSIVE hardening script
sudo ./setup-droplet.sh

# This will:
# ✅ Install all security tools
# ✅ Configure firewall (UFW)
# ✅ Setup Fail2Ban
# ✅ Harden SSH
# ✅ Disable root login
# ✅ Disable password auth
# ✅ Setup intrusion detection (AIDE)
# ✅ Configure rootkit scanner
# ✅ Enable traffic monitoring
# ✅ Setup automatic security updates
```

### Step 3: Create Deployment User
```bash
# Script will prompt for deployment username
# Enter: deployuser (or your preferred name)

# Add your SSH public key when prompted
# Or manually add it later:
nano /home/deployuser/.ssh/authorized_keys
# Paste your public key, save and exit
```

### Step 4: Test SSH Access (CRITICAL!)
```bash
# Open a NEW terminal (keep current session open!)
ssh deployuser@YOUR_DROPLET_IP

# If this works, you're good to continue
# If it fails, FIX IT before proceeding!
```

### Step 5: Restart SSH Service
```bash
# Back in your root session:
sudo systemctl restart sshd

# If you get disconnected, that's normal
# Log back in as deployuser:
ssh deployuser@YOUR_DROPLET_IP
```

### Step 6: Verify Security Configuration
```bash
# Run security validation script
cd /tmp/setup
./security-validation.sh

# This checks:
# ✅ Firewall is active
# ✅ Fail2Ban is running
# ✅ SSH is hardened
# ✅ Port 3000 is NOT exposed
# ✅ All security measures are in place

# Must show: "✅ SAFE TO DEPLOY"
# If it shows errors, fix them before deploying!
```

### Step 7: Setup Application Directory
```bash
# Create application directory
sudo mkdir -p /var/www/mobilklar
sudo chown -R mobilklar:mobilklar /var/www/mobilklar

# Navigate to app directory
cd /var/www/mobilklar

# Clone your application repository
git clone https://github.com/YOUR_REPO/EdTech-Platform.git
cd EdTech-Platform
```

### Step 8: Configure Environment
```bash
# Create .env file
nano .env

# Add these variables:
NEXT_PUBLIC_BACKEND_URL=https://api.mobilklar.no/api/v1
NEXT_PUBLIC_FRONT_END_URL=https://mobilklar.no

# Save and exit (Ctrl+X, Y, Enter)
```

### Step 9: Create Caddyfile
```bash
# Create Caddyfile in application root
nano Caddyfile

# Copy the secure Caddyfile content from repository
# Save and exit
```

### Step 10: Deploy Services
```bash
# Deploy Caddy first (creates network)
docker compose -f docker-compose-caddy.yml up -d

# Verify Caddy is running
docker ps

# Deploy application
docker compose up -d --build

# Verify all containers are running
docker ps

# Should show:
# - mobilklar-caddy (running)
# - mobilklar-frontend (running)
```

### Step 11: Verify Deployment
```bash
# Run final security validation
./security-validation.sh

# Check ports are correct
sudo netstat -tulpn | grep LISTEN

# Should ONLY show:
# - 0.0.0.0:22 (SSH)
# - 0.0.0.0:80 (HTTP)
# - 0.0.0.0:443 (HTTPS)

# Should NOT show:
# - 0.0.0.0:3000 (if shown, SECURITY RISK!)
```

### Step 12: Test External Access
```bash
# From your LOCAL machine:

# Test port 3000 is blocked
curl http://YOUR_DROPLET_IP:3000
# Should get: Connection refused or timeout (GOOD!)

# Test website works via Caddy
curl https://mobilklar.no
# Should get: Your website HTML (GOOD!)
```

### Step 13: Enable Monitoring
```bash
# Check security status
security-check.sh

# Monitor network traffic
vnstat -l

# Watch for suspicious activity
tail -f /var/log/traffic-monitor.log

# Check Fail2Ban bans
sudo fail2ban-client status sshd
```

---

## 🔒 SECURITY VERIFICATION CHECKLIST

Before considering deployment complete, verify:

- [ ] setup-droplet.sh completed successfully
- [ ] security-validation.sh shows "SAFE TO DEPLOY"
- [ ] UFW firewall is active (`sudo ufw status`)
- [ ] Fail2Ban is running (`sudo systemctl status fail2ban`)
- [ ] SSH password auth disabled (`sudo grep PasswordAuthentication /etc/ssh/sshd_config`)
- [ ] Root login disabled (`sudo grep PermitRootLogin /etc/ssh/sshd_config`)
- [ ] Port 3000 NOT accessible externally (`curl http://IP:3000` fails)
- [ ] Website accessible via Caddy (`curl https://mobilklar.no` works)
- [ ] Only ports 22, 80, 443 listening on 0.0.0.0
- [ ] Docker containers have resource limits
- [ ] AIDE intrusion detection initialized
- [ ] Traffic monitoring is active (`tail -f /var/log/traffic-monitor.log`)
- [ ] All Docker containers are running (`docker ps`)

---

## 📊 ONGOING MONITORING

### Daily Checks (Automated)
- Automatic security updates
- Fail2Ban monitoring
- Traffic monitoring (every 5 minutes)
- AIDE daily integrity check
- Log rotation

### Weekly Manual Checks
```bash
# Run security status
security-check.sh

# Check for rootkits
sudo rkhunter --check

# Review security logs
sudo grep "WARNING" /var/log/traffic-monitor.log

# Update system
sudo apt update && sudo apt upgrade -y
```

### Monthly Tasks
```bash
# Full security audit
sudo lynis audit system

# Review and analyze logs
sudo logwatch --detail high --range 'between -30 days and today'

# Update Docker images
cd /var/www/mobilklar/EdTech-Platform
docker compose pull
docker compose up -d --build

# Clean Docker resources
docker system prune -af
```

---

## 🆘 IF DDoS HAPPENS AGAIN

If you still get flagged for DDoS after following this guide:

1. **Immediately check traffic:**
   ```bash
   # Check outbound connections
   sudo netstat -an | grep ESTABLISHED | wc -l
   
   # See destination IPs
   sudo netstat -an | grep ESTABLISHED | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -nr
   ```

2. **Check for compromise:**
   ```bash
   # Run AIDE check
   sudo aide --check
   
   # Check for rootkits
   sudo rkhunter --check
   
   # Review auth logs
   sudo grep -i "failed\|error\|refused" /var/log/auth.log | tail -50
   ```

3. **Block suspicious IPs:**
   ```bash
   # Block specific IP
   sudo ufw deny from SUSPICIOUS_IP
   
   # Ban with Fail2Ban
   sudo fail2ban-client set sshd banip SUSPICIOUS_IP
   ```

4. **Contact DigitalOcean:**
   - Provide output of security checks
   - Show firewall configuration
   - Demonstrate hardening measures
   - Request network traffic logs

---

## 🎯 WHY THIS WORKS

### Defense in Depth (Multiple Layers)

1. **Network Layer**
   - UFW firewall blocks all except 22, 80, 443
   - Rate limiting on web ports
   - DDoS protection via iptables

2. **Application Layer**
   - Port 3000 NOT exposed
   - Caddy reverse proxy filters traffic
   - Security headers block attacks
   - Bot detection and blocking

3. **System Layer**
   - SSH hardened (keys only, no root)
   - Fail2Ban blocks brute-force
   - Automatic security updates
   - Resource limits prevent exhaustion

4. **Detection Layer**
   - AIDE monitors file changes
   - rkhunter scans for rootkits
   - Traffic monitoring alerts on high volume
   - Real-time log analysis

5. **Prevention Layer**
   - No unnecessary services running
   - Minimal attack surface
   - Containers run with limited privileges
   - Regular security audits

---

## ✅ DEPLOYMENT COMPLETE

If you followed ALL steps above and ALL checkboxes are ticked, your droplet is now:

- 🔒 **Hardened** against automated attacks
- 🛡️ **Protected** by multiple security layers
- 👁️ **Monitored** for suspicious activity
- 🔍 **Scanned** for intrusions daily
- 📊 **Logged** for audit trails
- 🚨 **Alerted** on anomalies

**Your risk of compromise is now MINIMAL.**

The exposed port 3000 was the primary attack vector. With all these protections, automated bots cannot find an entry point, and manual attacks are detected and blocked immediately.

---

**Last Updated:** February 15, 2026
**Status:** Production Ready ✅
