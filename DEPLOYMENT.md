# Koore Government Administration - Production Deployment Guide

This guide covers deploying the Koore Government Administration system to production.

## 🏗️ Architecture Overview

- **Frontend**: Next.js 14 (React-based)
- **Backend**: Laravel 11 (PHP 8.4)
- **Database**: MySQL 8.0
- **Authentication**: JWT-based with role management
- **File Storage**: Laravel's local storage system
- **Web Server**: Nginx (recommended)

## 📋 Prerequisites

- Ubuntu 20.04+ or similar Linux distribution
- Docker & Docker Compose (recommended) OR manual setup
- Domain name with SSL certificate
- MySQL 8.0+
- PHP 8.4+ with required extensions
- Node.js 18+
- Nginx or Apache web server

## 🚀 Deployment Options

### Option 1: Docker Deployment (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/asm2212/koore-gov-adm.git
   cd koore-gov-adm
   ```

2. **Configure environment variables**
   ```bash
   # Backend
   cp backend/.env.production.example backend/.env
   # Edit backend/.env with your production values
   
   # Frontend
   cp frontend/.env.production.example frontend/.env.production
   # Edit frontend/.env.production with your production values
   ```

3. **Set up SSL certificates**
   ```bash
   mkdir ssl
   # Copy your SSL certificates to the ssl/ directory
   # ssl/certificate.crt
   # ssl/private.key
   ```

4. **Deploy with Docker Compose**
   ```bash
   # Create environment file for Docker
   echo "DB_PASSWORD=your-secure-db-password" > .env
   echo "DB_ROOT_PASSWORD=your-secure-root-password" >> .env
   
   # Start the services
   docker-compose -f docker-compose.production.yml up -d
   ```

### Option 2: Manual Deployment

#### Backend Setup

1. **Install PHP and extensions**
   ```bash
   sudo apt update
   sudo apt install php8.4 php8.4-fpm php8.4-mysql php8.4-xml php8.4-mbstring php8.4-curl php8.4-zip php8.4-gd php8.4-bcmath
   ```

2. **Install Composer**
   ```bash
   curl -sS https://getcomposer.org/installer | php
   sudo mv composer.phar /usr/local/bin/composer
   ```

3. **Set up the backend**
   ```bash
   cd backend
   composer install --no-dev --optimize-autoloader
   cp .env.production.example .env
   # Edit .env with your production values
   php artisan key:generate
   php artisan jwt:secret
   ```

4. **Configure database**
   ```bash
   # Create MySQL database and user
   mysql -u root -p
   CREATE DATABASE koore_gov_adm_prod;
   CREATE USER 'koore_user_prod'@'localhost' IDENTIFIED BY 'secure-password';
   GRANT ALL PRIVILEGES ON koore_gov_adm_prod.* TO 'koore_user_prod'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

5. **Run migrations and optimize**
   ```bash
   php artisan migrate --force
   php artisan db:seed --force
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   php artisan storage:link
   ```

#### Frontend Setup

1. **Install Node.js and dependencies**
   ```bash
   cd frontend
   npm install
   cp .env.production.example .env.production
   # Edit .env.production with your production values
   ```

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Start the application**
   ```bash
   npm start
   # Or use PM2 for process management
   npm install -g pm2
   pm2 start npm --name "koore-frontend" -- start
   ```

#### Nginx Configuration

1. **Install Nginx**
   ```bash
   sudo apt install nginx
   ```

2. **Configure Nginx**
   ```bash
   sudo cp backend/nginx-production.conf /etc/nginx/sites-available/koore-api
   sudo ln -s /etc/nginx/sites-available/koore-api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
APP_NAME="Koore Government Administration"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=koore_gov_adm_prod
DB_USERNAME=koore_user_prod
DB_PASSWORD=your-secure-password

JWT_SECRET=your-jwt-secret
FRONTEND_URL=https://your-domain.com
```

#### Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
NEXT_PUBLIC_APP_NAME="Koore Government Administration"
```

## 🔒 Security Checklist

- [ ] SSL certificates installed and configured
- [ ] Database credentials are secure
- [ ] JWT secret is cryptographically secure
- [ ] File permissions are set correctly (755 for directories, 644 for files)
- [ ] Debug mode is disabled in production
- [ ] CORS is configured for your domain only
- [ ] Security headers are enabled
- [ ] Database backups are configured
- [ ] Log monitoring is set up

## 📊 Monitoring & Maintenance

### Log Files
- **Laravel**: `storage/logs/laravel.log`
- **Nginx**: `/var/log/nginx/koore-api-access.log` and `/var/log/nginx/koore-api-error.log`
- **MySQL**: `/var/log/mysql/error.log`

### Regular Maintenance
```bash
# Clear caches
php artisan cache:clear
php artisan config:clear

# Update dependencies (test first!)
composer update
npm update

# Database backup
mysqldump -u root -p koore_gov_adm_prod > backup_$(date +%Y%m%d_%H%M%S).sql
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check FRONTEND_URL in backend .env
   - Verify Nginx CORS headers
   - Ensure API URL is correct in frontend

2. **Database Connection Issues**
   - Verify MySQL service is running
   - Check database credentials
   - Ensure database exists

3. **File Upload Issues**
   - Check storage directory permissions
   - Verify storage link exists
   - Check file size limits in PHP and Nginx

4. **JWT Token Issues**
   - Regenerate JWT secret
   - Clear application cache
   - Check token expiration settings

## 📞 Support

For issues and support:
- Check the logs first
- Review this deployment guide
- Create an issue on GitHub: https://github.com/asm2212/koore-gov-adm/issues

## 🔄 Updates

To update the application:
1. Backup your database
2. Pull latest changes: `git pull origin main`
3. Update dependencies: `composer install --no-dev` and `npm install`
4. Run migrations: `php artisan migrate`
5. Clear caches: `php artisan cache:clear`
6. Rebuild frontend: `npm run build`

## 📈 Performance Optimization

- Enable OPcache for PHP
- Use Redis for caching and sessions
- Configure CDN for static assets
- Enable Gzip compression
- Optimize database queries
- Use queue workers for background tasks
