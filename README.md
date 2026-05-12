# 🚀 TaskFlow - Team Task Manager

TaskFlow is a production-ready MERN stack Team Task Management Web Application inspired by Trello and Asana. It helps teams create projects, assign tasks, track progress, collaborate in real time, and manage productivity efficiently through separate Admin and User panels.

🌐 Live Demo: https://team-task-manager-production-3b39.up.railway.app

---

# ✨ Features

## 🔐 Authentication

* JWT-based Login & Signup
* Role-Based Access Control (Admin/User)
* Protected Routes
* Secure Password Hashing using bcrypt

## 👨‍💼 Admin Panel

* Manage Users
* Create/Delete Projects
* Add/Remove Team Members
* Create/Edit/Delete Tasks
* Assign Tasks to Users
* View Team Analytics & Productivity

## 👤 User Panel

* View Assigned Tasks & Projects
* Update Task Status
* Add Comments
* Collaborate with Team Members
* Profile Management

## 📋 Task Management

* Drag & Drop Kanban Board
* Task Priorities (Low/Medium/High)
* Due Dates & Status Tracking
* Search & Filter Tasks
* Real-Time Updates using Socket.IO

## 📊 Dashboard & Analytics

* Total Tasks & Projects
* Completed & Pending Tasks
* Overdue Tasks
* Productivity Charts using Recharts

## 🎨 UI/UX

* Fully Responsive Design
* Dark/Light Mode
* Modern Blue-Purple Professional Theme
* Toast Notifications
* Smooth Animations

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* Recharts
* Framer Motion
* dnd-kit

## Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* Socket.IO

## Security

* JWT Authentication
* bcrypt Password Hashing
* Helmet
* CORS
* Rate Limiting

---

# 📦 Installation

## Prerequisites

* Node.js
* MongoDB Atlas or Local MongoDB
* Git

---

# ⚙️ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

Run Backend:

```bash
npm run dev
```

---

# 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```env
http://localhost:5173
```

---

# 🔑 Demo Admin Credentials

Use the following admin account to test admin features:

```env
Email: admin@taskflow.com
Password: admin123
```

⚠️ Change these credentials before production deployment.

---

# 🔐 Role-Based Access

## Admin

* Full access to users, projects, tasks, analytics

## User

* Manage assigned tasks & collaborate within projects

---

# 📁 Project Structure

```bash
frontend/
 ├── src/
 │   ├── components/
 │   ├── pages/
 │   ├── layouts/
 │   ├── services/
 │   ├── context/
 │   └── utils/

backend/
 ├── controllers/
 ├── routes/
 ├── middleware/
 ├── models/
 ├── config/
 └── utils/
```

---

# 🚀 Deployment

## Frontend

Deploy on:

* Railway
* Vercel

## Backend

Deploy on:

* Railway

## Database

* MongoDB Atlas

---

# 🌍 Live Deployment

🔗 https://team-task-manager-production-3b39.up.railway.app

---

# 📊 Core Modules

* Authentication System
* Admin Dashboard
* User Dashboard
* Project Management
* Task Management
* Real-Time Notifications
* Analytics Dashboard
* Kanban Board

---

# 🔥 Future Improvements

* File Uploads with Cloudinary
* Email Notifications
* Team Chat
* Calendar Integration
* PDF Report Export
* Activity Logs

---

# 📄 License

This project is developed for learning, assessment, and portfolio purposes.

---

# 👨‍💻 Author

Developed by Anurag Singh 🚀
