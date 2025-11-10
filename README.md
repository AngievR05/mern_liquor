<h1 align="center">🦒 The Drunken Giraffe – Spirited Sign-In</h1>
<h3 align="center">A playful, accessible MERN stack e-commerce experience that blends gamified UX with robust backend architecture.</h3>

<p align="center">
  <img src="./assets/drunken_giraffe_preview.png" width="820" alt="Drunken Giraffe cover image placeholder"/>
</p>

---

## 📌 Table of Contents
1. [About the Project](#1-about-the-project)  
2. [Tech Stack](#2-tech-stack)  
3. [Getting Started](#3-getting-started)  
4. [Features & Usage](#4-features--usage)  
5. [Demonstration](#5-demonstration)  
6. [Architecture / System Design](#6-architecture--system-design)  
7. [My Contributions](#7-my-contributions)  
8. [Testing](#8-testing)  
9. [Highlights & Challenges](#9-highlights--challenges)  
10. [Reflection](#10-reflection)  
11. [Roadmap / Future Improvements](#11-roadmap--future-improvements)  
12. [Contributing & License](#12-contributing--license)  
13. [Authors & Contact Info](#13-authors--contact-info)  
14. [Acknowledgements](#14-acknowledgements)  

---

## 1. 🧠 About the Project

### 1.1 Project Description
**The Drunken Giraffe** is a creative full-stack MERN e-commerce app that introduces **Spirited Sign-In** — a gamified authentication experience where users must sort virtual bottles correctly to access the store.  
For accessibility, a traditional form-based login fallback is provided. The project demonstrates a balance between creative UX design and secure backend logic.

---

## 2. ⚙️ Tech Stack

<div align="center">

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=fff)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=fff)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=fff)
![JWT](https://img.shields.io/badge/JWT-000?logo=jsonwebtokens&logoColor=fff)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?logo=socket.io&logoColor=fff)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=000)
![Multer](https://img.shields.io/badge/Multer-FBBF24?logo=multer&logoColor=fff)

</div>

---

## 3. 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account

### Installation
```bash
git clone https://github.com/AngievR05/mern_liquor.git
cd mern_liquor/creative-auth-bartender

# Backend
cd server
npm install
cp .env.example .env
# Add MONGO_URI, JWT_SECRET, EMAIL_USER, EMAIL_PASS
npm run dev

# Frontend
cd ../client
npm install
npm start
```
Visit the app locally at: [http://localhost:3000](http://localhost:3000)

---

## 4. ✨ Features & Usage

| Area           | Features |
|----------------|-----------|
| 🔐 **Auth** | Gamified login (**Spirited Sign-In**) + accessible fallback |
| 🛍 **Products** | Full CRUD functionality with image upload via Multer |
| 💬 **Reviews** | Star ratings (1–5 in 0.25 increments) + comments |
| 🛒 **Cart** | Persistent cart (localStorage), quantity control, validation, and email receipts |
| 🤖 **Chat Bot** | Typing delay, smart replies, iOS-like chat UI |
| 📄 **Admin API** | Documented with Swagger at `/api-docs` |

### Screenshots
> Replace placeholders with actual images once uploaded.

<p align="center">
  <img src="./assets/welcome.png" alt="Welcome Screenshot" width="820"><br/>
  <img src="./assets/game.png" alt="Game Screenshot" width="820"><br/>
  <img src="./assets/home.png" alt="Home Screenshot" width="820"><br/>
  <img src="./assets/chat.png" alt="Chat Screenshot" width="820"><br/>
  <img src="./assets/store.png" alt="Store Screenshot" width="820"><br/>
</p>

---

## 5. 🎥 Demonstration
🎬 [View Demo Video](https://drive.google.com/file/d/16Sv2tlr-Nr2eCJgAm2r7PXTFBhzCyIqj/view?usp=drive_link)

**Covers:**  
- Game-based login and fallback  
- Cart + checkout flow  
- Chatbot interaction  
- Product management and order creation  

---

## 6. 🧩 Architecture / System Design
- **Frontend:** React for UI, Context API for cart & global state  
- **Backend:** Node.js/Express REST API  
- **Database:** MongoDB Atlas for persistent data storage  
- **File Handling:** Multer for uploads (`client/public/uploads`)  
- **Notifications:** Nodemailer for order confirmations  
- **Real-Time:** Socket.io for chatbot events  

---

## 7. 👩‍💻 My Contributions – *Angie van Rooyen*
As part of **Team Bug Squashers**, I led front-end integration and assisted with back-end configuration.  
My contributions included:

- UI Components: `ChatWidget`, `CheckoutForm`, `SearchBar`, `FilterPanel`, `ReviewForm`, `ProductCard`
- State Management: `CartContext`, `Cart`, `Checkout`, accessibility-focused login, and **GameScreens** (`GameFailure`, `GameSuccess`)
- Backend Routes & Controllers: `productController`, `registerUser`, `authMiddleware`, `gameRoutes`, `orderRoutes`, `uploadRoutes`
- Infrastructure: Assisted in configuring and maintaining **server.js** with Express middleware and route integration

---

## 8. 🧪 Testing

Manual testing performed on:
- Spirited Sign-In game logic  
- Authentication and token persistence  
- Cart operations, total calculation, and checkout validation  
- Order creation and email verification  

*Future Work:* Add automated integration tests using Vitest or Cypress.

---

## 9. ⚡ Highlights & Challenges

| Highlights | Challenges |
|-------------|-------------|
| Gamified authentication system (Spirited Sign-In) | Ensuring accessibility for users unable to play the game |
| Socket.io chatbot with personality | Upload reliability via Multer |
| LocalStorage-powered cart | Review and cart state synchronization |
| iOS-style chat aesthetics | Performance under concurrent user sessions |

---

## 10. 🎓 Reflection – *Angie van Rooyen*

Developing **The Drunken Giraffe** taught me how to balance **playful, creative UX concepts** with **serious security and accessibility requirements**.  
I learned to:
- Implement a gamified authentication flow while maintaining data integrity.
- Architect complex React-Express data flows in a multi-developer environment.
- Debug concurrency, routing, and upload challenges across a live development team.
- Approach software design holistically — blending aesthetics, logic, and empathy.

This project reinforced my belief that **technical systems can and should evoke joy**, and that playfulness in design doesn’t have to compromise performance or inclusivity.

---

## 11. 🔭 Roadmap / Future Improvements
- Add user dashboards and order history  
- Store profile images in database instead of local storage  
- Deploy to Render/Vercel with cloud MongoDB integration  
- Implement full test coverage  

---

## 12. 🤝 Contributing & License

### Contributing
Contributions welcome:
```bash
git checkout -b feature/awesome-feature
git commit -m "Added something new"
git push origin feature/awesome-feature
```
Then open a pull request.

### License
This project is **educational** and part of the **Open Window DV200 portfolio**.  
© Bug Squashers 2025 – All rights reserved.  
No redistribution or commercial use permitted.

---

## 13. 👥 Authors & Contact Info

**Angie van Rooyen**  
📧 241077@virtualwindow.co.za  
🔗 [GitHub](https://github.com/AngievR05)

**Xander Poalses**  
📧 241322@virtualwindow.co.za  
🔗 [GitHub](https://github.com/241322)

**Dhiali Chetty**  
📧 231299@virtualwindow.co.za  
🔗 [GitHub](https://github.com/Dhiali)

**Tsungai Katsuro**  
📧 tsungai@openwindow.co.za  
🔗 [GitHub](https://github.com/TsungaiKats)

---

## 14. 🙏 Acknowledgements

- Open Window Creative Computing Faculty  
- Stack Overflow, GitHub Copilot, MDN Docs  
- Nodemailer + Socket.io communities  
- Chart.js + Swagger contributors  
- Every bug that made us better 🐞  

> 💡 *“Playfulness in design isn’t frivolous — it’s human.”*
