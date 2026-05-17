# ==============================================
# Global Configuration (MUST BE FIRST)
# ==============================================
{
    log {
        output file /var/log/caddy/error.log
        level ERROR
    }
}

# ==============================================
# Main Frontend App - mobilklar.no
# ==============================================
mobilklar.no, www.mobilklar.no {
    encode gzip

    # Block malicious paths
    @blocked {
        path *.php
        path *.aspx
        path *.asp
        path */wp-admin/*
        path */wp-login.php
        path */xmlrpc.php
        path */.env
        path */.git/*
        path */config/*
        path */phpmyadmin/*
    }
    handle @blocked {
        abort
    }

    # Block bad bots
    @bad_bots {
        header User-Agent *bot*
        header User-Agent *crawler*
        header User-Agent *spider*
        header User-Agent *scraper*
        header User-Agent *nikto*
        header User-Agent *sqlmap*
        header User-Agent *masscan*
    }
    handle @bad_bots {
        abort
    }

    # Reverse proxy to Next.js frontend
    reverse_proxy mobilklar-frontend:3000 {
        transport http {
            dial_timeout 10s
            response_header_timeout 30s
        }
        # Health check
        health_uri /api/health
        health_interval 30s
        health_timeout 5s
    }

    # Security headers for main app
    header {
        # HSTS
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

        # Frame protection
        X-Frame-Options "SAMEORIGIN"

        # Content sniffing protection
        X-Content-Type-Options "nosniff"

        # XSS protection
        X-XSS-Protection "1; mode=block"

        # Referrer policy
        Referrer-Policy "strict-origin-when-cross-origin"

        # CSP - media-src allows Cloudinary videos; connect-src allows API calls
        Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com; style-src 'self' 'unsafe-inline' https://translate.googleapis.com https://fonts.googleapis.com https://www.gstatic.com; img-src 'self' data: https:; media-src 'self' https://res.cloudinary.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://api.mobilklar.no https://translate.googleapis.com https://translate-pa.googleapis.com; object-src 'none'; base-uri 'self'; form-action 'self';"

        # Permissions policy
        Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()"

        # Remove server header
        -Server
    }

    # Logging
    log {
        output file /var/log/caddy/mobilklar-access.log {
            roll_size 100MB
            roll_keep 5
            roll_keep_for 720h
        }
        format json
        level INFO
    }
}


# ==============================================
# Admin Dashboard - admin.mobilklar.no
# ==============================================
admin.mobilklar.no, www.admin.mobilklar.no {
    encode gzip

    # Block malicious paths
    @blocked {
        path *.php
        path *.aspx
        path *.asp
        path */wp-admin/*
        path */wp-login.php
        path */xmlrpc.php
        path */.env
        path */.git/*
        path */config/*
        path */phpmyadmin/*
    }
    handle @blocked {
        abort
    }

    # Block bad bots
    @bad_bots {
        header User-Agent *bot*
        header User-Agent *crawler*
        header User-Agent *spider*
        header User-Agent *scraper*
        header User-Agent *nikto*
        header User-Agent *sqlmap*
        header User-Agent *masscan*
    }
    handle @bad_bots {
        abort
    }

    # Proxy API requests to backend with /api/v1 prefix
    @api {
        path /auth/*
        path /admin/*
    }
    handle @api {
        rewrite * /api/v1{uri}
        reverse_proxy https://api.mobilklar.no {
            header_up Host {upstream_hostport}
        }
    }

    # Proxy /api/* requests directly (already has the prefix)
    @api_direct {
        path /api/*
    }
    handle @api_direct {
        reverse_proxy https://api.mobilklar.no {
            header_up Host {upstream_hostport}
        }
    }

    # Reverse proxy to React admin dashboard (for static files)
    reverse_proxy mobilklar-admin-dashboard:9500 {
        transport http {
            dial_timeout 10s
            response_header_timeout 30s
        }
    }

    # Security headers for admin dashboard
    header {
        # HSTS
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

        # Frame protection
        X-Frame-Options "SAMEORIGIN"

        # Content sniffing protection
        X-Content-Type-Options "nosniff"

        # XSS protection
        X-XSS-Protection "1; mode=block"

        # Referrer policy
        Referrer-Policy "strict-origin-when-cross-origin"

        # CSP - media-src allows Cloudinary videos; connect-src allows API calls
        Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; media-src 'self' https://res.cloudinary.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://api.mobilklar.no; object-src 'none'; base-uri 'self'; form-action 'self';"

        # Permissions policy
        Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()"

        # CORS headers for API access
        Access-Control-Allow-Origin "https://mobilklar.no"
        Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
        Access-Control-Allow-Headers "Content-Type, Authorization"
        Access-Control-Allow-Credentials "true"

        # Remove server header
        -Server
    }

    # Handle OPTIONS preflight requests
    @options {
        method OPTIONS
    }
    handle @options {
        header Access-Control-Allow-Origin "https://mobilklar.no"
        header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
        header Access-Control-Allow-Headers "Content-Type, Authorization"
        header Access-Control-Allow-Credentials "true"
        header Access-Control-Max-Age "86400"
        respond 204
    }

    # Logging
    log {
        output file /var/log/caddy/admin-access.log {
            roll_size 100MB
            roll_keep 5
            roll_keep_for 720h
        }
        format json
        level INFO
    }
}
