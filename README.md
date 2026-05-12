# 🚀 TaskFlow - Team Task Manager

TaskFlow is a production-ready MERN stack application for team task management, featuring a Trello/Asana style Kanban board, real-time updates with Socket.IO, and detailed analytics.

## ✨ Features

- **Authentication**: JWT-based secure login/signup with role-based access control (Admin/User).
- **Admin Dashboard**: Comprehensive overview of users, projects, and team productivity.
- **Kanban Board**: Drag-and-drop task management with real-time sync across clients.
- **Projects**: Create projects, manage members, and track progress.
- **Tasks**: CRUD operations, priority levels, due dates, and comments.
- **Real-time**: Instant notifications and board updates via Socket.IO.
- **Dark Mode**: Beautiful, responsive blue-purple professional theme.
- **Analytics**: Visualized productivity charts using Recharts.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Framer Motion, Recharts, dnd-kit.
- **Backend**: Node.js, Express.js, MongoDB, Socket.IO.
- **Security**: JWT, bcrypt, Helmet, CORS, Rate Limiting.

## 📦 Installation

### Prerequisites
- Node.js installed
- MongoDB Atlas account or local MongoDB
- (Optional) Cloudinary account for uploads

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```
Run the server:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Run the client:
```bash
npm run dev
```

## 🔐 Role-Based Access
- **Admin**: Full access to user management, project creation, and global analytics.
- **User**: View assigned projects, update task statuses, and collaborate on tasks.

## 🚀 Deployment
- **Frontend**: Deploy on Vercel or Railway.
- **Backend**: Deploy on Railway with MongoDB Atlas.
- Ensure all environment variables are correctly set in the deployment dashboard.

---

Built with ❤️ by Antigravity
