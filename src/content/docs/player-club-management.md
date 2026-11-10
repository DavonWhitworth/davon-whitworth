---
title: Player Club Management
description: "Player Club Management is a sports-focused website and management platform for presenting athletes and organizing their profiles."
updated: "2026-11-09"
---

Player Club Management is a sports-focused website and management platform for presenting athletes and organizing their profiles. The public-facing site includes home, about, services, resources, contact, sign-in, athlete showcase, and individual athlete portfolio pages. Administrators can manage athlete records, upload portrait images, and build sport-specific data cards for football, baseball, basketball, and soccer seasons.

The frontend uses React, TypeScript, Vite, and React Router to create the page structure and navigation. Styled Components and custom CSS handle the visual design, while Axios communicates with backend services. Firebase is used for authentication, Firestore data storage, and Firebase Storage for athlete images and other media. The project also includes an Express and TypeScript backend connected to MongoDB through Mongoose; it provides authentication and protected athlete routes, uses JWT for session tokens, bcrypt for password hashing, CORS and Helmet for security configuration, and Morgan for request logging.
