# ZM-shop

# 🛍️ MERN E-Commerce Data Schema

This document defines the **MongoDB (Mongoose)** schema structure for an e-commerce web application built with the **MERN stack** — **MongoDB, Express.js, React, Node.js**.

---

## 📑 Overview

The application supports multiple user roles, product management, orders, carts, wishlists, reviews, coupons, and more.



## 👤 User

| Field | Type | Description |
|-------|------|-------------|
| `username` | String | Display name of the user |
| `email` | String (unique) | Used for login |
| `password` | String (hashed) | User password |
| `role` | Enum: `['user','admin','delivery','moderator']` | Access control |
| `addresses` | Array | User's saved addresses |
| `createdAt` | Date | Auto timestamp |
| `updatedAt` | Date | Auto timestamp |

### 🏠 Address Sub-Schema
```js
{
  label: String,
  address: String,
  firstname: String,
  lastname: String,
  phone: String,
  isDefault: { type: Boolean, default: false }
}
````

---

## 🛒 Product

| Field             | Type                     | Description             |
| ----------------- | ------------------------ | ----------------------- |
| `title`           | String                   | Product name            |
| `slug`            | String                   | SEO-friendly identifier |
| `price`           | Number                   | Current price           |
| `oldPrice`        | Number                   | Previous price          |
| `stock`           | Number                   | Available units         |
| `size`            | String                   | Size variant            |
| `color`           | String                   | Color variant           |
| `description`     | String                   | Detailed info           |
| `productOverview` | Array of key-value pairs | Technical details       |
| `coverImage`      | String                   | Main image URL          |
| `images`          | Array                    | Additional images       |
| `isDeleted`       | Boolean                  | Soft delete flag        |
| `categoryId`      | ObjectId → `Category`    | Product category        |
| `brand`           | String                   | Optional brand          |
| `tags`            | Array                    | For filtering/search    |
| `ratingsAverage`  | Number                   | Average user rating     |
| `ratingsCount`    | Number                   | Number of reviews       |
| `createdAt`       | Date                     | Auto timestamp          |
| `updatedAt`       | Date                     | Auto timestamp          |

---

## ⭐ Review

| Field         | Type                 | Description        |
| ------------- | -------------------- | ------------------ |
| `productId`   | ObjectId → `Product` | Reviewed product   |
| `userId`      | ObjectId → `User`    | Reviewer           |
| `rating`      | Number (1–5)         | Rating value       |
| `title`       | String               | Review headline    |
| `description` | String               | Review text        |
| `helpful`     | Number               | Helpful vote count |
| `createdAt`   | Date                 | Auto timestamp     |
| `updatedAt`   | Date                 | Auto timestamp     |

---

## 🛍️ Cart

| Field       | Type              | Description       |
| ----------- | ----------------- | ----------------- |
| `userId`    | ObjectId → `User` | Cart owner        |
| `items`     | Array             | Items in the cart |
| `createdAt` | Date              | Auto timestamp    |
| `updatedAt` | Date              | Auto timestamp    |

### 🧾 Item Sub-Schema

```js
{
  productId: { type: ObjectId, ref: 'Product' },
  productName: String,
  coverImage: String,
  addToCartPrice: Number,
  quantity: Number,
  deliveryPrice: Number
}
```

---

## ❤️ Wishlist

| Field        | Type                          | Description    |
| ------------ | ----------------------------- | -------------- |
| `userId`     | ObjectId → `User`             | Wishlist owner |
| `productIds` | Array of ObjectId → `Product` | Saved items    |

---

## 🏷️ Category

| Field      | Type                  | Description               |
| ---------- | --------------------- | ------------------------- |
| `title`    | String                | Category name             |
| `slug`     | String                | SEO slug                  |
| `parentId` | ObjectId → `Category` | Parent category           |
| `image`    | String                | Category thumbnail        |
| `depth`    | Number                | Category level (computed) |

---

## 🎟️ Coupon

| Field                | Type                         | Description      |
| -------------------- | ---------------------------- | ---------------- |
| `userId`             | ObjectId → `User` (optional) | Assigned user    |
| `code`               | String (unique)              | Coupon code      |
| `discountPercentage` | Number                       | Discount percent |
| `isActive`           | Boolean                      | Validity flag    |
| `expirationDate`     | Date                         | Expiration date  |

---

## 📦 Order

| Field             | Type                                                 | Description             |
| ----------------- | ---------------------------------------------------- | ----------------------- |
| `userId`          | ObjectId → `User`                                    | Buyer                   |
| `orderNumber`     | String                                               | Unique order identifier |
| `items`           | Array                                                | Purchased products      |
| `shippingStatus`  | Enum: `['pending','shipped','completed','canceled']` | Shipment state          |
| `paymentStatus`   | Enum: `['unpaid','paid','refunded']`                 | Payment state           |
| `shippingAddress` | Object                                               | Delivery address        |
| `totalAmount`     | Number                                               | Total order value       |
| `createdAt`       | Date                                                 | Auto timestamp          |
| `updatedAt`       | Date                                                 | Auto timestamp          |

### 📦 Item Sub-Schema

```js
{
  productId: { type: ObjectId, ref: 'Product' },
  quantity: Number,
  price: Number
}
```

---

## ❓ FAQ

| Field      | Type   | Description  |
| ---------- | ------ | ------------ |
| `question` | String | FAQ question |
| `answer`   | String | FAQ answer   |

---

## 💬 Contact (via Socket.IO)

Real-time customer support and admin chat using **WebSockets**.
Message schema example (future implementation):

```js
{
  senderId: ObjectId,
  receiverId: ObjectId,
  message: String,
  timestamp: Date,
  seen: Boolean
}
```

---

## 🧠 Notes

* All passwords should be **hashed using bcrypt**.
* Use **JWT tokens** for authentication.
* Ensure **indexes** on `email`, `slug`, and `code` for performance.
* All models should include `createdAt` and `updatedAt` via `timestamps: true`.

---

## 🧰 Tech Stack

| Layer    | Technology                              |
| -------- | --------------------------------------- |
| Frontend | React.js (with Redux or TanStack Query) |
| Backend  | Node.js + Express.js                    |
| Database | MongoDB + Mongoose                      |
| Auth     | JWT, bcrypt                             |
| Realtime | Socket.IO                               |

---

## 📁 Example Folder Structure

```
/models
  ├── user.model.js
  ├── product.model.js
  ├── review.model.js
  ├── cart.model.js
  ├── wishlist.model.js
  ├── category.model.js
  ├── coupon.model.js
  ├── order.model.js
  ├── faq.model.js
```

---

> **Author:** Michelle Magdy
> **Stack:** MERN
> **License:** MIT

---

✨ *Feel free to fork this project and extend the schema with payment, delivery tracking, and analytics!*

```
