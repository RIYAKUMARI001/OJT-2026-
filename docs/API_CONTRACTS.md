# API Contracts

This document outlines the REST APIs for the AI Interior Design Platform MVP.

## Authentication

### 1. Register (New)
**POST** `/auth/register`
- **Description:** Register a new user.
- **Headers:** None
- **Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Responses:**
  - `201 OK`: `{ "token": "JWT", "userId": "string", "name": "string" }`
  - `400 ERR`: `{ "error": "Invalid input" }`

### 2. Login
**POST** `/auth/login`
- **Description:** Login to the platform.
- **Headers:** None
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Responses:**
  - `200 OK`: `{ "token": "JWT", "userId": "string", "name": "string", "expiresIn": "7d" }`
  - `401 ERR`: `{ "error": "Invalid credentials" }`

---

## Designs

### 3. Save Design
**POST** `/designs`
- **Description:** Create a new design layout.
- **Headers:** `Authorization: Bearer <jwt>`
- **Body:**
  ```json
  {
    "roomType": "string",
    "width": 10,
    "height": 12,
    "wallColor": "#FFFFFF",
    "floorColor": "#E0E0E0",
    "furniture": [
      {
        "itemId": "string",
        "name": "string",
        "category": "string",
        "posX": 2.5,
        "posY": 3.0,
        "width": 2,
        "height": 4,
        "rotation": 90,
        "color": "#000000"
      }
    ]
  }
  ```
- **Responses:**
  - `201 OK`: `{ "designId": "string", "createdAt": "ISO8601" }`
  - `400 ERR`: `{ "error": "Invalid input", "field": "width" }`

### 4. Fetch User Designs (Updated from `/designs/:userId`)
**GET** `/designs`
- **Description:** Get all designs for the authenticated user.
- **Headers:** `Authorization: Bearer <jwt>`
- **Responses:**
  - `200 OK`: `{ "designs": [DesignObject] }`
  - `404 ERR`: `{ "error": "No designs found" }`

### 5. Fetch Single Design (New)
**GET** `/designs/:designId`
- **Description:** Get specific design to load into the 3D canvas.
- **Headers:** `Authorization: Bearer <jwt>`
- **Responses:**
  - `200 OK`: `{ "design": DesignObject }`
  - `404 ERR`: `{ "error": "Design not found" }`

### 6. Update Design
**PUT** `/designs/:designId`
- **Description:** Update an existing design's layout and colors.
- **Headers:** `Authorization: Bearer <jwt>`
- **Body:**
  ```json
  {
    "furniture": [
      {
        "itemId": "string",
        "name": "string",
        "category": "string",
        "posX": 1.5,
        "posY": 4.0,
        "width": 2,
        "height": 4,
        "rotation": 0,
        "color": "#000000"
      }
    ],
    "wallColor": "#F5F5F5",  // Optional
    "floorColor": "#D3D3D3"  // Optional
  }
  ```
- **Responses:**
  - `200 OK`: `{ "success": true, "updatedAt": "ISO8601" }`
  - `403 ERR`: `{ "error": "Forbidden" }`

---

## Furniture & Catalog

### 7. Furniture List
**GET** `/furniture/catalog`
- **Description:** Fetch the list of available furniture to drag-and-drop.
- **Query Params:** 
  - `category` (optional)
  - `page` (optional, default 1)
- **Responses:**
  - `200 OK`: `{ "items": [FurnitureItem], "total": 50 }`

---

## Export

### 8. Export to PDF/PNG
**POST** `/export/pdf`
- **Description:** Export the design canvas as an image or pdf.
- **Headers:** `Authorization: Bearer <jwt>`
- **Body:**
  ```json
  {
    "designId": "string",
    "format": "pdf",   // "pdf" | "png"
    "imageBase64": "string"  // Tip: Pass the generated Base64 canvas image from frontend
  }
  ```
- **Responses:**
  - `200 OK`: `{ "fileUrl": "string", "expiresIn": "24h" }`
- **Timeout:** 15000ms
