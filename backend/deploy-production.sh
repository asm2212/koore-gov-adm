#!/bin/bash

# Laravel Production Deployment Script
# Run this script to optimize Laravel for production

echo "🚀 Starting Laravel Production Deployment..."

# 1. Install production dependencies
echo "📦 Installing production dependencies..."
composer install --no-dev --optimize-autoloader

# 2. Generate application key (if not set)
echo "🔑 Generating application key..."
php artisan key:generate --force

# 3. Generate JWT secret (if not set)
echo "🔐 Generating JWT secret..."
php artisan jwt:secret --force

# 4. Clear and cache configuration
echo "⚙️ Optimizing configuration..."
php artisan config:clear
php artisan config:cache

# 5. Clear and cache routes
echo "🛣️ Optimizing routes..."
php artisan route:clear
php artisan route:cache

# 6. Clear and cache views
echo "👁️ Optimizing views..."
php artisan view:clear
php artisan view:cache

# 7. Optimize autoloader
echo "🔄 Optimizing autoloader..."
composer dump-autoload --optimize

# 8. Run database migrations
echo "🗄️ Running database migrations..."
php artisan migrate --force

# 9. Seed database (if needed)
echo "🌱 Seeding database..."
php artisan db:seed --force

# 10. Create storage link
echo "🔗 Creating storage link..."
php artisan storage:link

# 11. Set proper permissions
echo "🔒 Setting file permissions..."
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# 12. Clear all caches
echo "🧹 Clearing caches..."
php artisan cache:clear
php artisan event:clear
php artisan queue:clear

echo "✅ Laravel production deployment completed!"
echo "📋 Don't forget to:"
echo "   - Configure your web server (Nginx/Apache)"
echo "   - Set up SSL certificates"
echo "   - Configure database backups"
echo "   - Set up monitoring and logging"
echo "   - Configure queue workers (if using queues)"
