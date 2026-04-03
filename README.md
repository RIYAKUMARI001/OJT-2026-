# AI Interior Design Platform 🏠

A modern, AI-powered interior design platform that helps users visualize and plan their room layouts with ease.

## 🚀 Key Features

- **Dynamic Room Setup**: Custom dimensions (8ft - 20ft) and wall color selection.
- **Furniture Catalog**: Room-type aware catalog (Living Room, Bedroom, Kitchen, Office).
- **Save & Load**: Securely save your designs to the cloud and access them later.
- **Premium UI**: Clean, responsive interface built with NativeWind.
- **Monorepo Architecture**: Integrated frontend (Expo) and backend (Express) in one place.

## 🛠️ Tech Stack

- **Frontend**: React Native, Expo, TypeScript, NativeWind (Tailwind CSS), Zustand.
- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose), JWT Auth.
- **Documentation**: API contracts and design guides under `/docs`.

## 📦 Project Structure

```text
├── backend/       # Express.js API
├── frontend/      # React Native Expo App
├── docs/          # API & Project Documentation
└── artifacts/     # Design and progress logs
```

## 🏁 Getting Started

### 1. Prerequisite
- Node.js 18+
- MongoDB (Local or Atlas)

### 2. Installation
Install root dependencies:
```bash
npm install
```

### 3. Backend Setup
1. `cd backend`
2. Create `.env` from `.env.example`
3. Run: `npm run dev`

### 4. Frontend Setup
1. `cd frontend`
2. Run: `npx expo start`

## 📄 License
This project is licensed under the [MIT License](LICENSE).

---
*Developed for OJT 2026 - Interior Design AI MVP.*
