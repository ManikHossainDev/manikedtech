services:
  caddy:
    image: caddy:2-alpine
    container_name: mobilklar-caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
      - caddy_logs:/var/log/caddy
    networks:
      - mobilklar_shared
    # SECURITY: No healthcheck to reduce unnecessary network traffic
    security_opt:
      - no-new-privileges:true
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 128M

networks:
  mobilklar_shared:
    name: mobilklar_shared
    driver: bridge

volumes:
  caddy_data:
    driver: local
  caddy_config:
    driver: local
  caddy_logs:
    driver: local
