# MOAZZ Portfolio Website

A modern, fullstack portfolio website built with **NestJS** backend and **Next.js** frontend, connected to **Supabase** via **Prisma ORM**.

## 🚀 Tech Stack

### Backend
- **NestJS** v11.x - Progressive Node.js framework
- **Prisma ORM** v5.22.0 - Next-generation ORM
- **PostgreSQL** - Supabase cloud database
- **Swagger/OpenAPI** - API documentation
- **TypeScript** - Type-safe development

### Frontend
- **Next.js** v16.0.5 - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** v4 - Utility-first CSS framework
- **Space Grotesk & Syne** - Custom Google Fonts

## 📁 Project Structure

```
moazz-web/
├── backend/                    # NestJS backend
│   ├── src/
│   │   ├── main.ts            # Application entry point
│   │   ├── app.module.ts      # Root module
│   │   ├── prisma/            # Prisma service
│   │   ├── projects/          # Projects module
│   │   ├── experiences/       # Experiences module
│   │   └── articles/          # Articles module
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   └── .env                   # Environment variables
│
└── frontend/                  # Next.js frontend
    ├── app/
    │   ├── page.tsx           # Home page
    │   ├── layout.tsx         # Root layout
    │   └── globals.css        # Global styles
    ├── components/            # React components
    │   ├── Navbar.tsx
    │   ├── Hero.tsx
    │   ├── ProjectCard.tsx
    │   ├── ExperienceTimeline.tsx
    │   └── Footer.tsx
    ├── types/                 # TypeScript types
    │   └── index.ts
    ├── lib/                   # Utilities
    │   └── api.ts             # API client
    └── .env.local             # Environment variables
```

## 🎨 Design Features

- **Dark Theme** - Primary background: `#0a0a0a`
- **Lime Accent** - Brand color: `#ccff00`
- **Brutal Design** - Sharp edges with box-shadow effects
- **Custom Typography** - Space Grotesk (body) & Syne (display)
- **Responsive Layout** - Mobile-first design
- **Smooth Animations** - CSS transitions and animations

## 🛠️ Installation & Setup

### Prerequisites
- Node.js v18+ 
- npm or yarn
- PostgreSQL database (Supabase account)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in `backend/` directory:
```env
# Database
DATABASE_URL="postgresql://postgres.xxintgplwpofqrwdzcko:jPODRAZY4Emx6RnJ@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.xxintgplwpofqrwdzcko:jPODRAZY4Emx6RnJ@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres"

# API Configuration
PORT=3001
CORS_ORIGIN=http://localhost:3000

# Supabase
SUPABASE_URL=https://xxintgplwpofqrwdzcko.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

4. Run Prisma migrations:
```bash
npx prisma db push
npx prisma generate
```

5. Start the development server:
```bash
npm run start:dev
```

Backend will be available at: `http://localhost:3001`
API Documentation (Swagger): `http://localhost:3001/api/docs`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file in `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

4. Start the development server:
```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## 📊 Database Schema

### Projects Table
- `id` - UUID (Primary Key)
- `title` - String
- `description` - Text
- `slug` - String (Unique)
- `thumbnail_url` - String (Optional)
- `tech_stack` - JSONB Array
- `demo_url` - String (Optional)
- `repo_url` - String (Optional)
- `created_at` - Timestamp

### Experiences Table
- `id` - UUID (Primary Key)
- `position` - String
- `company` - String
- `start_date` - String
- `end_date` - String (Optional)
- `description` - Text
- `order` - Integer
- `created_at` - Timestamp

### Articles Table
- `id` - UUID (Primary Key)
- `title` - String
- `slug` - String (Unique)
- `content` - Text
- `is_published` - Boolean
- `published_at` - Timestamp (Optional)
- `created_at` - Timestamp

## 🔌 API Endpoints

### Projects
- `GET /api/v1/projects` - Get all projects
- `GET /api/v1/projects/:slug` - Get project by slug
- `POST /api/v1/projects` - Create new project
- `PUT /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project

### Experiences
- `GET /api/v1/experiences` - Get all experiences
- `GET /api/v1/experiences/:id` - Get experience by ID
- `POST /api/v1/experiences` - Create new experience
- `PUT /api/v1/experiences/:id` - Update experience
- `DELETE /api/v1/experiences/:id` - Delete experience

### Articles
- `GET /api/v1/articles` - Get all articles
- `GET /api/v1/articles/published` - Get published articles only
- `GET /api/v1/articles/:slug` - Get article by slug
- `POST /api/v1/articles` - Create new article
- `PUT /api/v1/articles/:id` - Update article
- `DELETE /api/v1/articles/:id` - Delete article

## 🚢 Deployment

### Backend Deployment (Vercel/Railway/Render)

1. Set environment variables on your platform
2. Build the application:
```bash
npm run build
```
3. Start production server:
```bash
npm run start:prod
```

### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variable: `NEXT_PUBLIC_API_URL`
3. Deploy automatically on push

## 🎯 Features

- ✅ RESTful API with full CRUD operations
- ✅ Type-safe backend and frontend
- ✅ API documentation with Swagger
- ✅ Responsive design with Tailwind CSS
- ✅ Server-side rendering with Next.js
- ✅ Database ORM with Prisma
- ✅ PostgreSQL database via Supabase
- ✅ Custom components with brutal design style
- ✅ SEO optimized
- ✅ Smooth animations and transitions

## 📝 Development Notes

### Backend Development
- Use `npm run start:dev` for hot-reload development
- Access Swagger docs at `/api/docs` for API testing
- Run `npx prisma studio` to view/edit database via GUI

### Frontend Development
- Use `npm run dev` for hot-reload development
- Components use Tailwind utility classes
- API client is located in `lib/api.ts`
- Types are synced with backend DTOs in `types/index.ts`

## 🐛 Troubleshooting

### Backend won't start
- Check if `.env` file exists with correct database credentials
- Verify database connection using Prisma Studio: `npx prisma studio`
- Clear TypeScript cache: Delete all `*.tsbuildinfo` files

### Frontend API errors
- Ensure backend is running on port 3001
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS settings in backend `main.ts`

### Database connection errors
- Use Supabase Session Pooler (port 6543) for IPv4 compatibility
- Verify connection string format in `.env`

## 📄 License

MIT License - feel free to use this project for your own portfolio!

## 👤 Author

**MOAZZ**
- Portfolio: [moazz.dev](https://moazz.dev)
- GitHub: [@moazz](https://github.com/moazz)
- Email: hello@moazz.dev

---

Built with ❤️ using NestJS, Next.js, and Supabase
