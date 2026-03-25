# API Contracts (MVP)

Base URL: `http://localhost:4000`

## Auth

### POST `/auth/login`

- **Body**

```json
{ "email": "user@example.com", "password": "secret" }
```

- **200 OK**

```json
{ "token": "JWT", "userId": "string", "name": "string", "expiresIn": "7d" }
```

- **401**

```json
{ "error": "Invalid credentials" }
```

## Designs

### POST `/designs` (Save Design)

- **Headers**: `Authorization: Bearer <jwt>`
- **Body**

```json
{
  "roomType": "string",
  "width": 12,
  "height": 14,
  "wallColor": "#F5F0E8",
  "floorColor": "#D6D0C4",
  "furniture": []
}
```

- **201 OK**

```json
{ "designId": "string", "createdAt": "2026-03-17T00:00:00.000Z" }
```

- **400**

```json
{ "error": "Invalid input", "field": "width" }
```

### GET `/designs/:userId` (Load Design)

- **Headers**: `Authorization: Bearer <jwt>`
- **200 OK**

```json
{ "design": {} }
```

- **404**

```json
{ "error": "No design found" }
```

### PUT `/designs/:designId` (Update Design)

- **Headers**: `Authorization: Bearer <jwt>`
- **Body**

```json
{ "furniture": [], "wallColor": "#F5F0E8", "floorColor": "#D6D0C4" }
```

- **200 OK**

```json
{ "success": true, "updatedAt": "2026-03-17T00:00:00.000Z" }
```

- **403**

```json
{ "error": "Forbidden" }
```

## Furniture catalog

### GET `/furniture/catalog`

- **Query**: `category?`, `page?` (default `1`)
- **200 OK**

```json
{ "items": [], "total": 0 }
```

## Export

### POST `/export/pdf`

- **Body**

```json
{ "designId": "string", "format": "pdf" }
```

- **200 OK**

```json
{ "fileUrl": "string", "expiresIn": "24h" }
```

- **Timeout**: 15000ms

