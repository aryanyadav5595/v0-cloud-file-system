# CloudFiles - Cloud File & Notes Management System

A full-stack cloud storage and notes management application built with Next.js 16, Azure Blob Storage, and Azure Cosmos DB.

## Features

- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Cloud File Storage**: Upload, download, and manage files using Azure Blob Storage
- **Notes Management**: Create, edit, and organize notes with tags
- **Real-time Dashboard**: View statistics and recent activity
- **Single-Page Application**: Unified tabbed interface for seamless navigation
- **Responsive Design**: Mobile-first design with beautiful UI components

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Azure Cosmos DB
- **Storage**: Azure Blob Storage
- **Authentication**: JWT with jose, bcrypt
- **UI Components**: Radix UI + shadcn/ui

## Prerequisites

- Node.js 18+ 
- Azure Account with:
  - Azure Storage Account (for Blob Storage)
  - Azure Cosmos DB Account

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=your_azure_storage_connection_string

# Azure Cosmos DB
AZURE_COSMOS_ENDPOINT=your_cosmos_endpoint
AZURE_COSMOS_KEY=your_cosmos_key
AZURE_COSMOS_DATABASE_ID=CloudFileSystemDB

# JWT Secret
JWT_SECRET=your_jwt_secret_key_change_in_production
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env.local`
   - Fill in your Azure credentials

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

5. **Create an account**:
   - Click "Get Started" to sign up
   - After login, you'll be redirected to `/app` with the main application

## Project Structure

```
├── app/                      # Next.js app router pages
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── files/           # File management endpoints
│   │   └── notes/           # Notes management endpoints
│   ├── app/                 # Main application (single-page with tabs)
│   ├── login/               # Login page
│   └── signup/              # Signup page
├── components/              # React components
│   ├── auth/                # Authentication components
│   ├── dashboard/           # Dashboard components (stats cards)
│   ├── files/               # File management components
│   ├── notes/               # Notes components
│   └── ui/                  # Reusable UI components
├── lib/                     # Utility functions
│   ├── azure-blob.ts        # Azure Blob Storage utilities
│   ├── cosmos-db.ts         # Cosmos DB utilities
│   ├── auth.ts              # Authentication utilities
│   ├── types.ts             # TypeScript type definitions
│   └── utils.ts             # General utilities
└── proxy.ts                 # Middleware for route protection
```

## Application Structure

The main application at `/app` is a single-page application with three tabs:

1. **Dashboard**: Overview of your files, notes, and storage statistics
2. **Files**: Upload, download, and manage your files with drag-and-drop support
3. **Notes**: Create, edit, and organize notes with tags

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Files
- `GET /api/files` - List all user files
- `POST /api/files/upload` - Upload a file
- `GET /api/files/[fileId]` - Get file metadata
- `GET /api/files/[fileId]/download` - Download file
- `DELETE /api/files/[fileId]` - Delete file

### Notes
- `GET /api/notes` - List all user notes
- `POST /api/notes` - Create a new note
- `GET /api/notes/[noteId]` - Get specific note
- `PATCH /api/notes/[noteId]` - Update note
- `DELETE /api/notes/[noteId]` - Delete note

## Azure Setup

### Blob Storage Container
The application automatically creates a `user-files` container in your Azure Storage Account.

### Cosmos DB Containers
The application automatically creates these containers in your Cosmos DB database:
- `users` - User accounts (partitioned by userId)
- `files` - File metadata (partitioned by userId)
- `notes` - User notes (partitioned by userId)
- `folders` - Folder structure (partitioned by userId)

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT tokens with 7-day expiration
- HTTP-only cookies for token storage
- Partitioned data access (users can only access their own data)
- Secure file storage with Azure Blob Storage
- Protected routes with middleware

## Deployment

This application can be deployed to Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

## License

MIT
