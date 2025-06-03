# 🛡️ Creative Authentication + E-Commerce Platform – Spirited Sign-In 🦒🍷

An end-to-end MERN stack web app that fuses **creative login flows**, a **live product store**, **cart + checkout system**, and an **AI-style chatbot assistant**. It all starts with the playful **Spirited Sign-In** — a mini-game where users sort bottles to gain access.

Built for creative computing students who don’t just think outside the box — they redesign it.

---

## 📌 Table of Contents

- [Project Overview](#project-overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Creative Authentication](#creative-authentication)  
- [E-Commerce Features](#e-commerce-features)  
- [Live Chat Widget](#live-chat-widget)  
- [Getting Started](#getting-started)  
- [API Documentation](#api-documentation)  
- [Folder Structure](#folder-structure)  
- [Demo](#demo)  
- [Contributing](#contributing)  
- [License](#license)

---

## 🧠 Project Overview

This project combines **authentication innovation** with **real product functionality**. It’s a **creative twist on traditional UX**. From login via mini-game to smart product filtering, users get a smooth, styled, and intelligent shopping experience.

Built with students, artists, and rebels in mind.

---

## ✨ Features

### 🔑 Authentication
- 🎮 **Spirited Sign-In**: Bottle-sorting game for login
- 🧑‍🦽 Accessible fallback login
- 🔐 JWT-based authentication
- 🔑 Encrypted passwords with bcrypt

### 🛒 E-Commerce
- 📦 Add, edit, delete products (admin role optional)
- 🛍 Add items to cart with quantity control
- 💳 Checkout with styled form and card formatting
- 🎟 Order persistence with backend storage
- 💬 Reviews + 0.25 step star ratings
- 🇿🇦 Prices in South African Rand (R)

### 🧠 Live Chat Widget
- 🤖 Bot with smart routing (e.g., “go to cart”)
- 💬 Typing indicator & message delay
- 💾 Chat history with localStorage
- 📱 iOS-style animations

### 🎨 UI / UX
- Fully custom CSS (no Tailwind)
- Masonry product grid layout
- Mobile-friendly with responsive breakpoints
- Checkout and Cart pages with animated transitions

---

## 🧪 Creative Authentication Explained

### 🥃 Spirited Sign-In

Instead of passwords, users must **sort bottles correctly** in a game-like interface.

- Uses **memory, reflex, and visual logic**
- If failed, retry screen is shown
- If successful, token is granted and access is given

> 🔁 Accessible form login at `/accessibility-login`

---

## 🛠️ Tech Stack

| Frontend   | Backend    | Extras             |
|------------|------------|--------------------|
| React      | Node.js    | JWT Auth           |
| Bootstrap  | Express    | bcrypt             |
| React Icons| MongoDB    | Multer (uploads)   |
| CSS        | Mongoose   | Swagger UI         |
| Masonry    | Nodemailer | Socket.io (Chat)   |

---

## 🛍️ E-Commerce Features

- 👕 Dynamic product listings
- 🛠 Admins can upload products with images
- 🧾 Reviews with rating (0.25 steps)
- 🧃 Quantity control + cart persistence
- 🔒 Order saved with product ID and user data
- ✅ Checkout validation + success animation

---

## 💬 Live Chat Widget

- Click to open, iOS-style
- Routes to `/about`, `/store`, `/cart`, etc.
- Typing delay for realism
- Stores last session via localStorage
- Future: log conversation to DB (optional)

---

## 🚀 Getting Started

### 1. Clone the repo

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
- Product browsing + cart
- Checkout + order
- Chatbot navigation

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