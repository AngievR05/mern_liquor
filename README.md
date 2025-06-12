
# 🛡️ Creative Authentication System – Spirited Sign-In

A full-stack MERN web app featuring a playful, game-based authentication method called **Spirited Sign-In**, where users sort virtual bottles correctly to gain access. For accessibility, users can also log in through a traditional form-based fallback.

---

## 📌 Table of Contents

1. [About the Project](#1-about-the-project)  
2. [Getting Started](#2-getting-started)  
3. [Features & Usage](#3-features--usage)  
4. [Demonstration](#4-demonstration)  
5. [Architecture / System Design](#5-architecture--system-design)  
6. [Testing](#6-testing)  
7. [Highlights & Challenges](#7-highlights--challenges)  
8. [Roadmap / Future Improvements](#8-roadmap--future-improvements)  
9. [Contributing & License](#9-contributing--license)  
10. [Authors & Contact Info](#10-authors--contact-info)  
11. [Acknowledgements](#11-acknowledgements)  

---

## 1. 🧠 About the Project

### 1.1 Project Description

A creative authentication MERN app where users sort drink bottles in a game to log in (Spirited Sign-In). Features a fallback login, full store functionality, cart, reviews, and a live chatbot.

### 1.2 Built With

- React, Node.js, Express, MongoDB Atlas
- JWT, bcrypt, Multer, Nodemailer, Socket.io, Swagger

---

## 2. 🚀 Getting Started

### 2.1 Prerequisites

- Node.js 18+
- MongoDB Atlas account

### 2.2 How to Install

```bash
# Clone the repo
git clone https://github.com/AngievR05/mern_liquor.git
cd mern_liquor/creative-auth-bartender

# Install backend dependencies
cd server
npm install

# Setup environment variables
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, EMAIL_USER, EMAIL_PASS

# Start backend
npm run dev

# Install frontend dependencies
cd ../client
npm install
npm start
```

Visit the app at:  
[http://localhost:3000](http://localhost:3000)

---

## 3. ✨ Features & Usage

| Area           | Features                                                                 |
|----------------|--------------------------------------------------------------------------|
| 🔐 Auth        | Game login + accessible fallback                                          |
| 🛍 Products    | View, add, edit, delete, and like products with image upload support               |
| 💬 Reviews     | Add star ratings (1–5 in 0.25 steps) and comments per product             |
| 🛒 Cart        | Local cart, quantity control, order saving, validation, email receipt     |
| 🤖 Chat Bot    | Typing delay, smart replies, page navigation, iOS-style UI                |
| 📄 Admin API   | Swagger UI available at `/api-docs`                                       |

### Screenshots

## Welcome Screenshot

![Welcome](creative-auth-bartender/client/src/assets/screenshots/Welcome.png)

## Game Screenshot

![Game](creative-auth-bartender/client/src/assets/screenshots/Game.png)

## Home Screenshot

![Home](creative-auth-bartender/client/src/assets/screenshots/Home.png)

## Chat Widget Screenshot

![Chat Widget](creative-auth-bartender/client/src/assets/screenshots/Chat.png)

## About Screenshot

![About](creative-auth-bartender/client/src/assets/screenshots/About.png)

## Store Screenshot

![Store](creative-auth-bartender/client/src/assets/screenshots/Store.png)

## Cart Screenshot

![Cart](creative-auth-bartender/client/src/assets/screenshots/Cart.png)

## Checkout Screenshot

![Checkout](creative-auth-bartender/client/src/assets/screenshots/Checkout.png)

## Dashboard Screenshot

![Dashboard](creative-auth-bartender/client/src/assets/screenshots/Dashboard.png)

## Seller Screenshot

![Seller](creative-auth-bartender/client/src/assets/screenshots/Seller.png)

## Application Screenshot

![Application](creative-auth-bartender/client/src/assets/screenshots/Application.png)

---

## 4. 🎥 Demonstration

[View Demo Video](https://drive.google.com/file/d/16Sv2tlr-Nr2eCJgAm2r7PXTFBhzCyIqj/view?usp=drive_link)


**Covers:**

- Registering and logging in  
- Spirited Sign-In in action  
- Cart + checkout + confirmation email  
- Live chatbot  
- Admin product management  

---

## 5. 🧠 Architecture / System Design

- React handles UI with Context for cart
- Node/Express REST API for all features
- MongoDB Atlas stores users, products, orders
- Multer uploads images to `client/public/uploads`
- Nodemailer sends order confirmation emails
- Socket.io powers live chat widget

---

## 6. 🧪 Testing

Manual testing done for:

- ✅ Game login logic
- ✅ Auth & token logic
- ✅ Cart price calculation
- ✅ Order creation & saving

Future: Add automated tests with Vitest or Cypress

---

## 🧱 Challenges & Struggles Faced

Throughout development, our team encountered several key challenges which we systematically worked through:

### 🔐 1. Authentication Game Integration
- **Challenge:** Creating a mini-game login system (`Spirited Sign-In`) that was both functional and engaging while still handling actual authentication logic securely.
- **Solution:** We separated game logic from user authentication logic, triggering user registration only on success while preserving security and flow.

### 📦 2. Image Uploads (Multer)
- **Challenge:** Product and profile image uploads weren’t saving correctly due to incorrect file paths and static serving misconfigurations.
- **Solution:** We properly configured `Multer` to store images in `/client/public/uploads` and ensured express was serving this directory statically. We also verified all form submissions were using `FormData`.

### 💾 3. Data Persistence & MongoDB
- **Challenge:** Certain product updates (like ratings and image paths) weren’t syncing properly with MongoDB due to frontend state issues and API mismatches.
- **Solution:** We debugged API responses and ensured backend routes used correct Mongoose schema structures. We implemented proper `.then()` chains or `async/await` logic to refresh data states after mutation.

### 🛒 4. Cart & Review System State Sync
- **Challenge:** Ratings and cart quantities weren’t updating correctly across components when navigating or submitting reviews.
- **Solution:** We refactored context providers (`CartContext`) and passed callback props to children where needed. Review submissions were followed by API fetch calls to refresh product data in the `Store` page.

---

## 7. ⚡ Highlights & Challenges

| Highlights                            | Challenges                                         |
|---------------------------------------|----------------------------------------------------|
| Spirited Sign-In game login UX        | Uploading images to local storage safely          |
| Star rating and comment UX            | Bot response delays + dynamic page routing        |
| Cart persistence (localStorage)       | Validating checkout + error handling              |
| Autocomplete product search           | Styling chat to feel like native iOS messaging    |

---

## 8. 🔭 Roadmap / Future Improvements

- [ ] User dashboard to track orders   
- [ ] Upload profile pictures to database    
- [ ] Deployment to Render/Vercel/Mongo Atlas  

---

## 9. 🤝 Contributing & License

### Contributing

Contributions are welcome!

```bash
git checkout -b feature/cool-feature
git commit -m "Added something awesome"
git push origin feature/cool-feature
```

Then open a pull request.

### License

This project is **not open source** and is intended for **educational portfolio use only**.

© Bug Squashers 2025. All rights reserved.  
*No redistribution or commercial use permitted.*

---

## 10. 👩‍💻 Authors & Contact Info

**Angie van Rooyen**  
📧 Email: [241077@virtualwindow.co.za](mailto:241077@virtualwindow.co.za)  
🔗 GitHub: [AngievR05](https://github.com/AngievR05)

**Xander Poalses**  
📧 Email: [241322@virtualwindow.co.za](mailto:241322@virtualwindow.co.za)  
🔗 GitHub: [241322](https://github.com/241322)

**Dhiali Chetty**  
📧 Email: [231299@virtualwindow.co.za](mailto:231299@virtualwindow.co.za)  
🔗 GitHub: [Dhiali](https://github.com/Dhiali)

**Tsungai Katsuro**  
📧 Email: [tsungai@openwindow.co.za](mailto:tsungai@openwindow.co.za)  
🔗 GitHub: [TsungaiKats](https://github.com/TsungaiKats)

---

## 11. 🙏 Acknowledgements

- Open Window Creative Computing Faculty  
- Stack Overflow, GitHub Copilot, MDN  
- Nodemailer + Socket.io Docs  
- The React community  
- Bugs squashed, lessons learned 🐞

> 💡 *“Documentation is the difference between a side project and a usable product.”*  
> — Every senior dev ever
