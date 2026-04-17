# API Examples

Base URL: `http://localhost:5000`

## Auth

### POST `/auth/register`
```json
{
  "email": "seller@example.com",
  "password": "StrongPassword123",
  "username": "seller_one",
  "role": "seller"
}
```

### POST `/auth/login`
```json
{
  "email": "seller@example.com",
  "password": "StrongPassword123"
}
```

## Users

### GET `/users/me` (Bearer token)

### PATCH `/users/me`
```json
{
  "bio": "Очень длинное описание профиля ... минимум 200 символов",
  "skills": ["React", "Node.js"],
  "country": "RU",
  "city": "Moscow",
  "timezone": "Europe/Moscow",
  "workStart": "09:00",
  "workEnd": "18:00",
  "phoneVerified": true
}
```

### PATCH `/users/switch-role`
```json
{
  "role": "seller"
}
```

## Services

### POST `/services`
```json
{
  "title": "Создам лендинг",
  "description": "Полное описание услуги",
  "priceBasic": 5000,
  "priceStandard": 9000,
  "pricePremium": 15000,
  "deliveryBasic": 3,
  "deliveryStandard": 5,
  "deliveryPremium": 7,
  "revisionsBasic": 1,
  "revisionsStandard": 2,
  "revisionsPremium": 5,
  "categoryId": "category-id"
}
```

### GET `/services?categoryId=...&minPrice=1000&maxPrice=10000&search=landing`

## Orders

### POST `/orders`
```json
{
  "serviceId": "service-id",
  "price": 5000,
  "deadline": "2026-05-01T10:00:00.000Z"
}
```

### PATCH `/orders/:id/status`
```json
{
  "status": "cancelled"
}
```

### POST `/orders/:id/complete`

## Reviews

### POST `/reviews`
```json
{
  "orderId": "order-id",
  "rating": 5,
  "text": "Отличная работа"
}
```

### GET `/reviews?sellerId=seller-id`

## Messages

### POST `/messages`
```json
{
  "receiverId": "user-id",
  "text": "Привет!"
}
```

### GET `/messages?peerId=user-id`

## Projects & Proposals

### POST `/projects`
```json
{
  "title": "Нужен Telegram-бот",
  "description": "Техническое задание",
  "budgetMin": 10000,
  "budgetMax": 20000
}
```

### GET `/projects`

### POST `/proposals`
```json
{
  "projectId": "project-id",
  "text": "Готов выполнить",
  "price": 15000
}
```

## Notifications

### GET `/notifications`

### POST `/notifications`
```json
{
  "type": "system",
  "text": "Тестовое уведомление"
}
```
