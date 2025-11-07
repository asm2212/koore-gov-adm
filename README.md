# Koore Government Administration System

A comprehensive government administration system built with modern web technologies. **Now powered by Laravel backend with MySQL database!**

## 🚀 Features

- **News Management**: Create, edit, and publish news articles with image support
- **Contact Management**: Handle citizen inquiries and feedback
- **Document Management**: Upload and manage government documents
- **User Management**: Role-based access control for administrators
- **Multi-language Support**: English and Amharic language support
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **JWT Authentication**: Secure token-based authentication
- **File Upload System**: Local storage with Laravel's built-in system

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Language**: TypeScript

### Backend ⚡ **NEW: Laravel Implementation**
- **Framework**: Laravel 11 (PHP 8.4)
- **Database**: MySQL 8.0 with Eloquent ORM
- **Authentication**: JWT-based authentication with tymon/jwt-auth
- **File Storage**: Laravel's built-in storage system
- **Validation**: Laravel's validation system
- **API**: RESTful API with comprehensive endpoints

## 📁 Project Structure

```
koore-gov-adm/
├── frontend/                    # Next.js frontend application
├── backend/                     # Laravel backend API (NEW!)
├── backend-express-backup/      # Original Express.js backup
├── DEPLOYMENT.md               # Production deployment guide
├── docker-compose.production.yml # Docker deployment configuration
└── README.md                   # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- PHP 8.4+ with required extensions
- Composer
- MySQL 8.0+
- Node.js 18+ 
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/asm2212/koore-gov-adm.git
   cd koore-gov-adm
   ```

2. **Backend Setup (Laravel)**
   ```bash
   cd backend
   composer install
   cp .env.example .env
   # Configure your MySQL database in .env
   php artisan key:generate
   php artisan jwt:secret
   php artisan migrate
   php artisan db:seed
   php artisan storage:link
   php artisan serve
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api
   - API Health Check: http://localhost:8000/api/health

## 🔐 Default Credentials

- **Email**: superadmin@example.com
- **Password**: SuperAdmin123!

## 📚 API Documentation

The Laravel backend provides comprehensive RESTful APIs:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get authenticated user

### News Management
- `GET /api/news` - List all news (public)
- `GET /api/news/{id}` - Get single news (public)
- `POST /api/news` - Create news (auth required)
- `PUT /api/news/{id}` - Update news (auth required)
- `DELETE /api/news/{id}` - Delete news (auth required)

### Contact Management
- `POST /api/contact` - Submit contact form (public)
- `GET /api/contact` - List messages (admin only)
- `GET /api/contact/{id}` - Get single message (admin only)
- `PATCH /api/contact/{id}/respond` - Mark as responded (admin only)

### Document Management
- `GET /api/docs` - List documents (public)
- `POST /api/docs` - Upload document (auth required)
- `PUT /api/docs/{id}` - Update document (auth required)
- `DELETE /api/docs/{id}` - Delete document (auth required)

### Admin Management
- `GET /api/admins` - List admins (admin only)
- `POST /api/admins` - Create admin (super admin only)
- `PUT /api/admins/{id}` - Update admin (super admin only)
- `DELETE /api/admins/{id}` - Delete admin (super admin only)

## 🌍 Deployment

### Docker Deployment (Recommended)
```bash
# Configure environment variables
cp backend/.env.production.example backend/.env
cp frontend/.env.production.example frontend/.env.production

# Deploy with Docker Compose
docker-compose -f docker-compose.production.yml up -d
```

### Manual Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment instructions.

## ✨ What's New in Laravel Version

- **🚀 Performance**: Optimized with Laravel's built-in caching and optimization features
- **🔒 Security**: Enhanced security with Laravel's security features and CORS handling
- **📁 File Management**: Improved file upload system with Laravel Storage
- **🗄️ Database**: MySQL with Eloquent ORM for better performance and relationships
- **🔧 Maintenance**: Easier maintenance with Laravel's Artisan commands
- **📊 Logging**: Better error handling and logging with Laravel's logging system
- **🐳 Docker Ready**: Complete Docker setup for easy deployment

## 🔄 Migration from Express.js

The system has been successfully migrated from Express.js + Prisma to Laravel + Eloquent:
- ✅ All API endpoints maintained compatibility
- ✅ Database schema preserved with MySQL
- ✅ Authentication system enhanced with Laravel's features
- ✅ File upload system improved
- ✅ Production-ready configurations added

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Check the [DEPLOYMENT.md](DEPLOYMENT.md) guide
- Review the API documentation above

---

**🎉 Successfully migrated to Laravel! The system is now more robust, secure, and production-ready.**