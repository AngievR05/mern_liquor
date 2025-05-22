# 🛡️ Creative Authentication System – Spirited Sign-In

A full-stack MERN web app featuring a playful, game-based authentication method called **Spirited Sign-In**, where users sort virtual bottles correctly to gain access. For accessibility, users can also log in through a traditional form-based fallback.

---

## 📌 Table of Contents

- [Project Overview](#project-overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Creative Authentication Explained](#creative-authentication-explained)  
- [Getting Started](#getting-started)  
- [API Documentation](#api-documentation)  
- [Folder Structure](#folder-structure)  
- [Demo](#demo)  
- [Contributing](#contributing)  
- [License](#license)

---

## 🧠 Project Overview

This MERN stack project explores a creative twist on standard login forms. Users interact with a **mini bartender game** to prove identity, providing an intuitive and fun authentication experience. The app also supports an accessibility login for inclusivity.

---

## ✨ Features

- 🎮 Game-based login challenge (Spirited Sign-In)
- 🧑‍🦽 Accessible fallback login form
- 🔐 JWT token-based authentication
- 🔑 Password hashing using `bcryptjs`
- 🗃️ MongoDB integration
- 📄 REST API with Swagger documentation
- 📦 Fully modular and scalable codebase

---

## 🧪 Creative Authentication Explained

### 🥃 Spirited Sign-In

During login, users sort a series of drink bottles correctly in a game interface. Success grants access; failure shows a retry screen.

- **Why it’s creative:**  
  It uses **spatial memory, visual cues**, and **pattern matching** instead of traditional typing. It gamifies identity verification without compromising security.

- **Fallback option:**  
  A basic accessible login form is available at `/accessibility-login`.

---

## 🛠️ Tech Stack

- **Frontend:** React, TailwindCSS  
- **Backend:** Node.js, Express  
- **Database:** MongoDB, Mongoose  
- **Auth:** JWT, bcrypt  
- **Docs:** Swagger (via `swagger-jsdoc` and `swagger-ui-express`)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AngievR05/mern_liquor.git
cd mern_liquor/creative-auth-bartender
```

### 2. Install dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Setup your environment variables

Create a `.env` file in the `server` directory and add the following:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

Make sure to add `.env` to your `.gitignore` file so that sensitive information is not committed to GitHub.

---

### 4. Start the development servers

```bash
# Start backend server
cd server
npm run dev

# Start frontend server
cd ../client
npm start
```

---

## 🧾 API Documentation

Swagger UI is available for testing all backend routes.

Once the backend server is running, visit:  
[http://localhost:5000/apiDocumentation](http://localhost:5000/apiDocumentation)

This interface allows you to test endpoints like login, register, and game results directly from the browser.

---

## 📁 Folder Structure

```
mern_liquor/
│
├── creative-auth-bartender/
│   ├── server/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── server.js
│   │   ├── .gitignore
│   │   └── .env
│   │
│   ├── client/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── styles/
│   │   │   └── App.js
│   │   └── package.json
│   │
│   └── README.md
```

---

## 🎥 Demo

A short 5-minute video demo shows:

- Registering and logging in
- Game-based authentication in action
- Accessibility fallback login
- API and backend overview

**Link to video to be inserted here**

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repo
2. Create your branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a pull request

---

## 📜 License

MIT © 2025 BugSquashers