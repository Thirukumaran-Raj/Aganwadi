# 👶🍲 Anganwadi Portal

A full-stack web application designed to digitize and streamline the daily operations of Anganwadi centers. This portal empowers workers to easily manage beneficiary data, track daily attendance, and monitor essential inventory in real-time.

---

## 🚀 Features

- 🔐 **Secure Authentication** — Role-based login system secured with JSON Web Tokens (JWT).
- 🧑‍💼 **Staff Administration** — Admin-managed roles, account status, and centre assignments with an audit history.
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
JWT_SECRET=replace_with_a_long_random_secret
ADMIN_BOOTSTRAP_KEY=replace_with_a_separate_random_key
```

Generate separate random values for `JWT_SECRET` and `ADMIN_BOOTSTRAP_KEY` (for example, with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`). Keep the bootstrap key private; it is accepted only until the first administrator account is created.

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

For a new database, open `/setup-admin` and create the first administrator using the configured `ADMIN_BOOTSTRAP_KEY`. The bootstrap endpoint closes once an administrator exists. Administrators can then create staff accounts, assign centres, adjust roles or status, and review account audit events from **Staff & audit** in the dashboard.

### Production sign-in checks

- In Vercel, confirm `VITE_API_BASE_URL` points to the deployed backend and redeploy after changing it.
- In Render, confirm `MONGO_URI`, `JWT_SECRET`, and `ADMIN_BOOTSTRAP_KEY` are set in the backend service environment, then restart or redeploy the service.
- Check `https://<backend-host>/api/health`. A healthy response is HTTP 200 with `{"status":"ok","database":"connected"}`.
- In MongoDB Atlas, confirm the database user/password in `MONGO_URI` are current and the Atlas network access list allows the Render service to connect.
- If Render returns a wake error, check the service's deploy/runtime logs; a frontend change cannot restart an unavailable backend instance.

---

## 📝 Future Scope

- [ ] Height/weight health growth charts
- [ ] Automated low-inventory email alerts
- [ ] Multi-language support (Tamil / English)

---

<p align="center">
  Developed with ❤️ by <strong>Thirukumaran Rajendran</strong>
</p>
