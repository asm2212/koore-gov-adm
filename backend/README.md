# Koore Government Administration - Laravel Backend

This is the Laravel backend for the Koore Government Administration system, migrated from Express.js with Prisma to Laravel with Eloquent ORM.

## Features

- **Authentication**: JWT-based authentication with role-based access control
- **News Management**: CRUD operations for news articles with image upload
- **Contact Management**: Contact form submissions and admin management
- **Document Management**: File upload and management system
- **Admin Management**: User and admin management with role-based permissions

## Requirements

- PHP 8.1 or higher
- Composer
- MySQL 8.0 or higher
- Node.js (for frontend assets, if needed)

## Installation

1. **Clone the repository and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file with your database credentials:**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=koore_gov_adm
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

5. **Generate application key**
   ```bash
   php artisan key:generate
   ```

6. **Generate JWT secret**
   ```bash
   php artisan jwt:secret
   ```

7. **Create database and run migrations**
   ```bash
   php artisan migrate
   ```

8. **Seed the database with super admin**
   ```bash
   php artisan db:seed
   ```

9. **Create storage link for file uploads**
   ```bash
   php artisan storage:link
   ```

## Running the Application

```bash
php artisan serve
```

The API will be available at `http://localhost:8000/api`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout (requires auth)
- `GET /api/auth/me` - Get authenticated user (requires auth)

### News
- `GET /api/news` - Get all news (public)
- `GET /api/news/{id}` - Get single news (public)
- `POST /api/news` - Create news (requires auth)
- `PUT /api/news/{id}` - Update news (requires auth)
- `DELETE /api/news/{id}` - Delete news (requires auth)

### Contact
- `POST /api/contact` - Submit contact form (public)
- `GET /api/contact` - Get all messages (admin only)
- `GET /api/contact/{id}` - Get single message (admin only)
- `PATCH /api/contact/{id}/respond` - Mark as responded (admin only)

### Documents
- `GET /api/docs` - Get all documents (public)
- `GET /api/docs/{id}` - Get single document (public)
- `POST /api/docs` - Upload document (requires auth)
- `PUT /api/docs/{id}` - Update document (requires auth)
- `DELETE /api/docs/{id}` - Delete document (requires auth)

### Admin Management
- `GET /api/admins` - Get all admins (admin only)
- `GET /api/admins/count` - Count admins (admin only)
- `GET /api/admins/{id}` - Get single admin (admin only)
- `POST /api/admins` - Create admin (super admin only)
- `PUT /api/admins/{id}` - Update admin (super admin only)
- `DELETE /api/admins/{id}` - Delete admin (super admin only)
- `PATCH /api/admins/{id}/activate` - Activate admin (super admin only)
- `PATCH /api/admins/{id}/deactivate` - Deactivate admin (super admin only)
- `PATCH /api/admins/{id}/reset-password` - Reset password (super admin only)

## Default Super Admin Credentials

- **Email**: superadmin@example.com
- **Password**: SuperAdmin123!

## User Roles

- `SUPER_ADMIN`: Full system access
- `ADMIN`: Administrative access
- `WRITER`: Content creation access
- `PUBLIC`: Basic user access

## File Storage

Files are stored in `storage/app/public` and accessible via `/storage` URL path.

## Migration from Express.js

This Laravel backend replaces the previous Express.js + Prisma implementation with:
- **Eloquent ORM** instead of Prisma
- **Laravel's built-in authentication** with JWT
- **Laravel's file storage system** instead of Cloudinary
- **Laravel's validation system** instead of Zod
- **Laravel's routing system** instead of Express routes

## Development

For development, you can use:
```bash
php artisan serve --host=0.0.0.0 --port=8000
```

## Testing

Run tests with:
```bash
php artisan test
