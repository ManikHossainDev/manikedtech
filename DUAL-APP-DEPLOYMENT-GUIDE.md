# 🚀 DUAL-APP SECURE DEPLOYMENT GUIDE - Zero DDoS Risk

## ✅ CRITICAL SECURITY FEATURES

### Platform Architecture:
- **Next.js Frontend**: mobilklar.no (Port 3000 internal only)
- **React Admin Dashboard**: admin.mobilklar.no (Port 9500 internal only)
- **Caddy Reverse Proxy**: Handles HTTPS, security headers, CSP, CORS
- **Shared Security**: UFW, Fail2Ban, AIDE, rkhunter, traffic monitoring

### Security Hardening Applied:
1. ✅ **No exposed ports** - All apps internal, only Caddy exposes 80/443
2. ✅ **Resource limits** - Prevents exhaustion attacks (CPU/RAM caps)
3. ✅ **Security options** - no-new-privileges on all containers
4. ✅ **AIDE intrusion detection** - Hourly filesystem integrity checks
5. ✅ **Rootkit scanner** - Daily rkhunter scans
6. ✅ **Traffic monitoring** - 5-minute interval outbound traffic alerts
7. ✅ **CSP & CORS** - Proper headers for both apps
8. ✅ **Bot blocking** - Caddy blocks malicious bots and paths

---

## 📋 DEPLOYMENT STEPS

### Step 1: Create New Droplet on DigitalOcean

```bash
# Droplet specifications:
# - OS: Ubuntu 24.04 LTS
# - Size: Minimum 4GB RAM, 2 vCPUs (for dual-app setup)
# - Region: Choose closest to your users
# - SSH: Add YOUR public SSH key (NEVER use password auth)
# - Firewall: Will be configured by setup script
```

**Important**: Note your droplet's IP address (e.g., 46.101.149.251)

---

### Step 2: Initial SSH Connection

```bash
# From your local machine:
ssh root@YOUR_DROPLET_IP

# First login you should see:
# Welcome to Ubuntu 24.04 LTS...
```

---

### Step 3: Upload Project Files

```bash
# On your LOCAL machine (not droplet):
# Navigate to your project directory
cd /path/to/mobilklar-frontend/EdTech-Platform

# Copy entire project to droplet:
scp -r . root@YOUR_DROPLET_IP:/root/mobilklar-frontend

# Verify upload:
ssh root@YOUR_DROPLET_IP "ls -la /root/mobilklar-frontend"
```

---

### Step 4: Run Security Hardening Script

```bash
# On droplet (as root):
cd /root/mobilklar-frontend
chmod +x setup-droplet.sh
./setup-droplet.sh

# This script will:
# - Install Docker, Docker Compose
# - Configure UFW firewall (only 22, 80, 443)
# - Install and configure Fail2Ban
# - Install AIDE intrusion detection
# - Install rkhunter rootkit scanner
# - Set up traffic monitoring
# - Configure automated security checks
# - Harden SSH configuration

# ⏱️ Takes 10-15 minutes
```

**What to expect**:
- Script will ask for confirmation at certain steps
- Will see "Installing Docker...", "Configuring firewall...", etc.
- At the end: "✓ Droplet setup complete!"

---

### Step 5: Configure DNS Records

**Before deploying apps**, configure DNS to point to your droplet:

```
# In your domain registrar (e.g., Namecheap, GoDaddy):

# A Records:
mobilklar.no          →  YOUR_DROPLET_IP  (TTL: 300)
www.mobilklar.no      →  YOUR_DROPLET_IP  (TTL: 300)
admin.mobilklar.no    →  YOUR_DROPLET_IP  (TTL: 300)
www.admin.mobilklar.no →  YOUR_DROPLET_IP  (TTL: 300)
```

**Wait 5-10 minutes** for DNS propagation, then verify:

```bash
# From your local machine:
nslookup mobilklar.no
nslookup admin.mobilklar.no

# Should show YOUR_DROPLET_IP for both
```

---

### Step 6: Pre-Deployment Security Validation

```bash
# On droplet:
cd /root/mobilklar-frontend
chmod +x security-validation.sh
./security-validation.sh

# This checks:
# ✓ No exposed ports in docker-compose files
# ✓ Security options present
# ✓ Resource limits configured
# ✓ UFW firewall active
# ✓ Fail2Ban running
# ✓ AIDE installed

# Must pass all checks before deploying!
```

---

### Step 7: Deploy Both Applications

```bash
# On droplet:
cd /root/mobilklar-frontend
chmod +x deploy-both-apps.sh
./deploy-both-apps.sh

# Deployment order:
# 1. Creates Docker network
# 2. Stops any existing containers
# 3. Builds fresh images
# 4. Deploys Caddy (reverse proxy)
# 5. Deploys Next.js frontend
# 6. Deploys React admin dashboard
# 7. Verifies all services

# ⏱️ Takes 5-10 minutes
```

**Expected output**:
```
[1/8] Running pre-deployment security checks...
✓ All security checks passed

[2/8] Creating Docker network...
✓ Network created

[3/8] Stopping existing containers...
✓ All containers stopped

[4/8] Building fresh images...
✓ Images built

[5/8] Deploying Caddy reverse proxy...
✓ Caddy is running

[6/8] Deploying Next.js frontend...
✓ Next.js frontend is running

[7/8] Deploying React admin dashboard...
✓ Admin dashboard is running

[8/8] Verifying deployment...
✓ Frontend health check passed
✓ Admin dashboard is accessible

   Deployment Complete!
```

---

### Step 8: Verify Both Apps Are Accessible

```bash
# Test from local machine:
curl -I https://mobilklar.no
curl -I https://admin.mobilklar.no

# Check for security headers:
# - Strict-Transport-Security: max-age=31536000
# - X-Frame-Options: SAMEORIGIN
# - Content-Security-Policy: default-src 'self'...

# Open in browser:
# https://mobilklar.no        (main app)
# https://admin.mobilklar.no  (admin dashboard)
```

---

### Step 9: Monitor for First Hour

**CRITICAL**: Watch for suspicious activity in the first 60 minutes:

```bash
# On droplet - monitor traffic in real-time:
sudo /usr/local/bin/monitor-traffic.sh

# Check for DDoS attempts:
sudo tail -f /var/log/ufw.log

# View Caddy logs:
docker-compose -f docker-compose-caddy.yml logs -f

# Check blocked bots:
docker-compose -f docker-compose-caddy.yml logs | grep "abort"

# Fail2Ban status:
sudo fail2ban-client status sshd
```

---

## 🔍 POST-DEPLOYMENT VERIFICATION

### Check All Containers Are Running

```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Expected output:
# NAMES                        STATUS          PORTS
# caddy                        Up 5 minutes    80/tcp, 443/tcp
# mobilklar-frontend           Up 5 minutes    3000/tcp (internal only)
# mobilklar-admin-dashboard    Up 5 minutes    9500/tcp (internal only)
```

✅ **CRITICAL**: Ports column should show NO mappings like `0.0.0.0:3000->3000/tcp`

---

### Verify No Exposed Ports

```bash
# Check what's listening on public interface:
sudo netstat -tulpn | grep LISTEN

# Should only see:
# 0.0.0.0:22    (SSH)
# 0.0.0.0:80    (Caddy HTTP)
# 0.0.0.0:443   (Caddy HTTPS)

# Should NOT see:
# 0.0.0.0:3000  (Next.js) ❌
# 0.0.0.0:9500  (Admin) ❌
```

---

### Test Security Headers

```bash
# Frontend security headers:
curl -I https://mobilklar.no

# Must include:
# ✓ Strict-Transport-Security
# ✓ X-Frame-Options: SAMEORIGIN
# ✓ X-Content-Type-Options: nosniff
# ✓ Content-Security-Policy
# ✓ Permissions-Policy

# Admin security headers:
curl -I https://admin.mobilklar.no

# Must include same headers PLUS:
# ✓ Access-Control-Allow-Origin: https://mobilklar.no
```

---

### Test CORS Between Apps (if needed)

```bash
# Test if admin can call main app (or vice versa):
curl -I -X OPTIONS https://admin.mobilklar.no \
  -H "Origin: https://mobilklar.no" \
  -H "Access-Control-Request-Method: POST"

# Should return:
# HTTP/2 204
# Access-Control-Allow-Origin: https://mobilklar.no
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

---

### Check Intrusion Detection

```bash
# AIDE database should be initialized:
sudo aide --check

# Expected output:
# "AIDE found NO differences between database and filesystem"

# Check rkhunter:
sudo rkhunter --check --skip-keypress

# Should end with: "No rootkits found"
```

---

## 📊 MONITORING & MAINTENANCE

### Daily Monitoring Commands

```bash
# 1. Check container health:
docker ps

# 2. Check resource usage:
docker stats --no-stream

# 3. Monitor outbound traffic:
sudo /usr/local/bin/monitor-traffic.sh

# 4. Check for intrusions:
sudo aide --check

# 5. View Fail2Ban status:
sudo fail2ban-client status

# 6. Check UFW firewall:
sudo ufw status verbose
```

---

### View Application Logs

```bash
# Caddy logs (reverse proxy):
docker-compose -f docker-compose-caddy.yml logs -f --tail=100

# Frontend logs:
docker-compose -f docker-compose.yml logs -f --tail=100

# Admin dashboard logs:
docker-compose -f docker-compose-admin.yml logs -f --tail=100

# All logs combined:
docker-compose -f docker-compose-caddy.yml logs & \
docker-compose -f docker-compose.yml logs & \
docker-compose -f docker-compose-admin.yml logs
```

---

### Automated Security Reports

Security checks run automatically:

```bash
# AIDE checks: Every hour
# Cron: 0 * * * * /usr/bin/aide --check

# Rkhunter scans: Daily at 3 AM
# Cron: 0 3 * * * /usr/bin/rkhunter --check --skip-keypress

# Traffic monitoring: Every 5 minutes
# Cron: */5 * * * * /usr/local/bin/monitor-traffic.sh

# View cron jobs:
sudo crontab -l
```

---

### Update Applications

```bash
# Update Next.js frontend:
cd /root/mobilklar-frontend
git pull origin main  # or your deployment branch
docker-compose -f docker-compose.yml build --no-cache
docker-compose -f docker-compose.yml up -d

# Update React admin:
docker-compose -f docker-compose-admin.yml build --no-cache
docker-compose -f docker-compose-admin.yml up -d

# Or update both at once:
./deploy-both-apps.sh
```

---

## 🐛 TROUBLESHOOTING

### Problem: Frontend Not Accessible

```bash
# Check if container is running:
docker ps | grep mobilklar-frontend

# If not running, check logs:
docker-compose -f docker-compose.yml logs

# Common issues:
# - Build failed: Check Dockerfile syntax
# - Port conflict: Ensure no other app uses port 3000
# - Network issue: Verify mobilklar-network exists

# Restart:
docker-compose -f docker-compose.yml down
docker-compose -f docker-compose.yml up -d
```

---

### Problem: Admin Dashboard Not Accessible

```bash
# Check container status:
docker ps | grep mobilklar-admin-dashboard

# Check logs:
docker-compose -f docker-compose-admin.yml logs

# Verify Caddyfile has admin domain:
docker exec caddy cat /etc/caddy/Caddyfile | grep admin.mobilklar.no

# Test internal connectivity:
docker exec caddy wget -O- http://mobilklar-admin-dashboard:9500
```

---

### Problem: CORS Errors Between Apps

```bash
# Check Caddy configuration:
docker exec caddy cat /etc/caddy/Caddyfile | grep -A5 "Access-Control"

# Should see:
# Access-Control-Allow-Origin "https://mobilklar.no"
# Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"

# Reload Caddy config:
docker-compose -f docker-compose-caddy.yml restart
```

---

### Problem: CSP Blocking Resources

```bash
# Check browser console for CSP errors
# Common fixes:

# 1. External scripts not loading:
# Add domain to script-src in Caddyfile

# 2. Images not loading:
# Add domain to img-src in Caddyfile

# 3. Fonts not loading:
# Add domain to font-src in Caddyfile

# Edit Caddyfile:
nano Caddyfile

# Reload Caddy:
docker-compose -f docker-compose-caddy.yml restart
```

---

### Problem: High CPU/Memory Usage

```bash
# Check resource usage:
docker stats

# If frontend using too much:
# Increase limits in docker-compose.yml

# If admin using too much:
# Increase limits in docker-compose-admin.yml

# Current limits:
# Frontend: 2 CPUs, 2GB RAM
# Admin: 1 CPU, 1GB RAM
# Caddy: 1 CPU, 512MB RAM
```

---

### Problem: Suspected DDoS Attack

```bash
# 1. Check traffic immediately:
sudo /usr/local/bin/monitor-traffic.sh

# 2. View UFW blocked connections:
sudo tail -f /var/log/ufw.log

# 3. Check Caddy for blocked bots:
docker-compose -f docker-compose-caddy.yml logs | grep abort

# 4. Enable Fail2Ban for HTTP:
sudo fail2ban-client set nginx-limit-req banip OFFENDING_IP

# 5. Emergency: Block country:
# Use DigitalOcean cloud firewall to block country-level traffic

# 6. Nuclear option (only if under active attack):
sudo ufw deny from OFFENDING_IP
```

---

### Problem: SSL Certificate Issues

```bash
# Caddy auto-manages SSL, but if issues occur:

# 1. Check Caddy logs:
docker-compose -f docker-compose-caddy.yml logs | grep -i "certificate"

# 2. Verify DNS is correct:
nslookup mobilklar.no
nslookup admin.mobilklar.no

# 3. Force certificate renewal:
docker exec caddy caddy reload --config /etc/caddy/Caddyfile

# 4. Check Let's Encrypt rate limits:
# https://letsencrypt.org/docs/rate-limits/
```

---

## 🔐 SECURITY BEST PRACTICES

### 1. Never Expose Application Ports

❌ **WRONG**:
```yaml
ports:
  - "3000:3000"  # Exposes to internet
  - "9500:9500"  # Exposes to internet
```

✅ **CORRECT**:
```yaml
expose:
  - 3000  # Internal only
  - 9500  # Internal only
```

---

### 2. Always Use Resource Limits

```yaml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 2G
    reservations:
      cpus: '1'
      memory: 1G
```

---

### 3. Enable Security Options

```yaml
security_opt:
  - no-new-privileges:true
```

---

### 4. Keep Everything Updated

```bash
# Update system packages weekly:
sudo apt update && sudo apt upgrade -y

# Update Docker images monthly:
docker-compose pull
docker-compose up -d
```

---

### 5. Monitor Logs Regularly

```bash
# Set up log rotation to prevent disk fill:
sudo nano /etc/docker/daemon.json

{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}

sudo systemctl restart docker
```

---

## 📞 EMERGENCY CONTACTS

### If Under Active Attack:

1. **Immediate**: Run `sudo /usr/local/bin/monitor-traffic.sh`
2. **Check**: `sudo tail -f /var/log/ufw.log`
3. **Block IP**: `sudo ufw deny from OFFENDING_IP`
4. **Contact**: DigitalOcean support to enable cloud firewall
5. **Document**: Save logs for analysis

### Support Resources:

- DigitalOcean Support: https://www.digitalocean.com/support/
- Caddy Community: https://caddy.community/
- Docker Docs: https://docs.docker.com/

---

## ✅ DEPLOYMENT CHECKLIST

Before considering deployment complete, verify:

- [ ] DNS records point to droplet IP
- [ ] Both apps accessible via HTTPS
- [ ] No exposed ports (netstat check)
- [ ] Security headers present (curl -I check)
- [ ] Resource limits applied (docker inspect)
- [ ] UFW firewall active (ufw status)
- [ ] Fail2Ban running (fail2ban-client status)
- [ ] AIDE initialized (aide --check)
- [ ] Rkhunter configured (rkhunter --check)
- [ ] Traffic monitoring active (monitor-traffic.sh)
- [ ] Logs accessible (docker logs)
- [ ] SSL certificates valid (browser check)
- [ ] CORS working (if needed between apps)
- [ ] No console errors (browser devtools)
- [ ] Monitored for 1 hour post-deployment

---

## 🎉 SUCCESS!

If all checks pass, your dual-app deployment is secure and ready for production!

**Final reminder**: Monitor traffic for the first 24 hours and check logs daily.
