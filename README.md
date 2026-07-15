# Quick Wheels 🚗

A full-stack vehicle rental web application built with the MERN stack, allowing users to browse, book, and manage vehicle rentals, with a dedicated admin dashboard for inventory and booking management.

Built as a project expo submission at **Sreenidhi Institute of Science and Technology (SNIST)**.

---

## 🔗 Live Demo

- **Frontend:** [https://quick-wheels.vercel.app](https://quick-wheels.vercel.app)
- **Backend API:** [https://quick-wheels-oua9.onrender.com](https://quick-wheels-oua9.onrender.com)

---

## ✨ Features

- User registration & login with JWT authentication
- Browse available vehicles with details and images
- Book a vehicle for a selected date range
- View personal booking/rental history
- QR-based booking scanner for verification
- Admin dashboard with:
  - Vehicle inventory management (add/edit/delete)
  - Booking management and status tracking
  - Dashboard stats and recent activity feed

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- React Router
- Context API for authentication state

**Backend**
- Node.js
- Express.js
- JWT for authentication
- MongoDB (Mongoose)

**Database & Hosting**
- MongoDB Atlas (cloud database)
- Backend deployed on **Render**
- Frontend deployed on **Vercel**

---

## 📁 Project Structure

```
rentProject/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   └── server.js
└── frontend/
    └── rent/
        ├── src/
        │   ├── components/
        │   ├── context/
        │   └── pages/
        └── vite.config.js
```

---

## ⚙️ Getting Started (Local Setup)

### 1. Clone the repository
```bash
git clone https://github.com/shivajakkula06/Quick-Wheels.git
cd Quick-Wheels
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run the backend:
```bash
node server.js
```

### 3. Frontend setup
```bash
cd ../frontend/rent
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` (default Vite port) and the backend on `http://localhost:5000`.

---

## 👥 Team

- Shiva Jakkula
- G Neeraj
- Ch Vinay Kumar
- L Suraj Reddy

---

## 📄 License

This project was built for academic purposes as part of the SNIST project expo.
