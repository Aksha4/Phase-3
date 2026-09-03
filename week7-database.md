# Week 7 Database Schema Documentation

## Overview

Week 7 extends the existing SQLite database by associating products with authenticated users.

## Users

The existing `users` table stores registered application users.

## Products

The `products` table contains:

| Column | Purpose |
|---|---|
| id | Product primary key |
| user_id | Authenticated user associated with the product |
| name | Product name |
| description | Product description |
| price | Product price |
| created_at | Creation timestamp |

## User-Product Relationship

A product created through the authenticated API stores the user's ID in `user_id`.

Flow:

Login → JWT → `req.user.id` → Product creation → `products.user_id`

## Week 7 Migration

A separate migration was created:

```text
src/migrations/week7Migration.js