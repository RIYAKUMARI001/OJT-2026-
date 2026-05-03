# AI Interior Design Platform 🏠

A simple and easy-to-use AI interior design platform that helps you visualize your perfect room layout before buying any furniture.

## 🚀 What's Inside

- **Interactive 2D Drag & Drop**: Pick furniture from the catalog and drag it anywhere on the grid.
- **Smart Grid System**: Realistic 1x1 ft grid to help you measure the space.
- **Snapshot Feature**: Take a picture of your layout with one tap and save or share it directly from your phone.
- **Custom Room Setup**: Pick your room type, set dimensions, and even change the wall color.
- **Cloud Saving**: All your designs are saved securely so you don't lose your work.
- **Clean UI**: Beautiful, premium design built to feel smooth on mobile.

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
