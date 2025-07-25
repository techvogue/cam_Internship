# SecureSight Dashboard

A comprehensive security incident management dashboard built with Next.js, featuring real-time monitoring, incident tracking, and video playback capabilities.

## 🚀 Features

- **Real-time Security Monitoring** - Monitor multiple camera feeds and security incidents
- **Incident Management** - Track, view, and resolve security incidents
- **Video Playback** - Watch incident recordings with timeline controls
- **Camera Management** - Manage multiple security cameras across locations
- **User Authentication** - Secure login system with JWT tokens
- **Responsive Design** - Modern dark theme UI that works on all devices
- **Timeline View** - Chronological incident timeline with filtering options

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.4.2, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcryptjs
- **UI Components**: Custom components with Framer Motion animations
- **Development**: Turbopack for fast development builds

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database (local or cloud)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd securesight-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="your-postgresql-connection-string"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 4. Database Setup

Initialize and seed the database:

```bash
# Push database schema
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed the database with sample data
npm run seed
```

### 5. Run the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

## 👤 Default Login Credentials

```
Email: admin@mandlacx.com
Password: admin123
```

## 📁 Project Structure

```
securesight-dashboard/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── components/        # React components
│   │   ├── dashboard/         # Dashboard page
│   │   ├── incidents/         # Incidents management
│   │   ├── login/            # Authentication
│   │   └── ...
│   ├── controllers/           # Business logic controllers
│   ├── models/               # Database models
│   ├── types/                # TypeScript type definitions
│   ├── hooks/                # Custom React hooks
│   └── utils/                # Utility functions
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts              # Database seeding script
├── public/                   # Static assets
└── ...
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality
- `npm run seed` - Seed database with sample data

## 📊 Database Schema

The application uses the following main entities:

- **Users** - Authentication and user management
- **Cameras** - Security camera locations and details
- **Incidents** - Security incidents with timestamps, types, and status

## 🎯 Key Components

### Dashboard
- Overview of recent incidents
- Camera status monitoring
- Quick statistics and metrics

### Incident Management
- Timeline view of all incidents
- Detailed incident viewer with video playback
- Incident resolution workflow

### Video Player
- HTML5 video player with custom controls
- Thumbnail previews
- Multi-camera incident switching

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected API routes
- Secure database queries with Prisma

## 🎨 UI/UX Features

- Dark theme optimized for security operations
- Responsive design for desktop and mobile
- Smooth animations with Framer Motion
- Intuitive navigation and user experience

## 🔄 API Endpoints

- `POST /api/auth/login` - User authentication
- `GET /api/incidents` - Fetch incidents with filtering
- `GET /api/cameras` - Fetch camera information
- `PUT /api/incidents/[id]/resolve` - Resolve incidents

## 🧪 Sample Data

The application comes with pre-seeded data including:
- 4 security cameras across different locations
- 15 sample incidents of various types
- Mix of resolved and unresolved incidents

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure build passes
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team.

---

**SecureSight Dashboard** - Advanced Security Incident Management System
