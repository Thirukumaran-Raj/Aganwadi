# 👶🍲 Anganwadi Portal

A full-stack web application designed to digitize and streamline the daily operations of Anganwadi centers. This portal empowers workers to easily manage beneficiary data, track daily attendance, and monitor essential inventory in real-time.

---

## 🚀 Features

- 🔐 **Secure Authentication** — Role-based login system secured with JSON Web Tokens (JWT).
- 👦 **Beneficiary Management** — Register new children, track demographic data, and view individual profiles.
- 📋 **Daily Tracker** — Interactive daily roster to log child attendance and meal distribution.
- 📦 **Inventory Management** — Real-time tracking system for food, medicine, and general supplies with quick-adjust controls.
- ☁️ **Cloud Database** — Fully integrated with MongoDB Atlas for secure, scalable data storage.

---

## 🛠️ Tech Stack

**Frontend**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

**Backend**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

---

## 📂 Project Structure

```
Anganwadi/
├── backend/        # Node.js/Express server & MongoDB models
└── frontend/       # React application & UI components
```

---

## 💻 Local Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/Thirukumaran-Raj/Aganwadi.git
cd Aganwadi
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key
```

Start the backend server:

```bash
npm run dev
```

### 3. Setup the Frontend

Open a **new terminal window**:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173` by default.

---

## 📝 Future Scope

- [ ] Height/weight health growth charts
- [ ] Automated low-inventory email alerts
- [ ] Multi-language support (Tamil / English)

---

<p align="center">
  Developed with ❤️ by <strong>Thirukumaran Rajendran</strong>
</p>
