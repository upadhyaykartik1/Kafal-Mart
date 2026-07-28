# KafalMart Backend API

Node.js + Express + MongoDB API powering restaurants, menus, cart, orders, and auth for KafalMart.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment file and fill in your own values:
   ```bash
   cp .env.example .env
   ```
   At minimum, set `MONGO_URI` (a local MongoDB instance or a MongoDB Atlas connection string) and `JWT_SECRET` (any long random string).

3. (Optional) Seed sample restaurants and menu items — the same three restaurants shown on the live site:
   ```bash
   npm run seed
   ```

4. Run the server:
   ```bash
   npm run dev     # with nodemon, auto-restarts on changes
   # or
   npm start
   ```

The API runs on `http://localhost:5000` by default (`PORT` in `.env`).

## API overview

### Auth
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create an account (`name`, `phone`, `password`, optional `email`, `address`) |
| POST | `/api/auth/login` | – | Log in with `phone` + `password`, returns a JWT |
| GET | `/api/auth/me` | ✅ | Get the logged-in user's profile |

Send the JWT as `Authorization: Bearer <token>` on protected routes.

### Restaurants & menu
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/restaurants` | – | List restaurants (optional `?category=food` or `grocery`) |
| GET | `/api/restaurants/:id` | – | Restaurant details + its menu |
| POST | `/api/restaurants` | admin | Create a restaurant |
| PUT | `/api/restaurants/:id` | admin | Update a restaurant |
| DELETE | `/api/restaurants/:id` | admin | Remove a restaurant |
| GET | `/api/restaurants/:id/menu` | – | Menu items for a restaurant |
| POST | `/api/restaurants/:id/menu` | admin | Add a menu item |
| PUT | `/api/menu/:id` | admin | Update a menu item |
| DELETE | `/api/menu/:id` | admin | Remove a menu item |

### Cart (per logged-in user)
| Method | Route | Description |
|---|---|---|
| GET | `/api/cart` | Get the current cart |
| POST | `/api/cart/items` | Add an item — body: `{ menuItemId, quantity }` |
| PUT | `/api/cart/items/:menuItemId` | Change quantity — body: `{ quantity }` (0 removes it) |
| DELETE | `/api/cart/items/:menuItemId` | Remove one item |
| DELETE | `/api/cart` | Empty the cart |

A cart only holds items from one restaurant at a time — matches how the frontend and most delivery apps behave.

### Orders
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/orders` | ✅ | Place an order from the current cart — body: `{ deliveryAddress }` |
| GET | `/api/orders` | ✅ | List the current user's past orders |
| GET | `/api/orders/:id` | ✅ | Order details |
| PUT | `/api/orders/:id/status` | admin | Update order status |

Every order response includes a `whatsappLink` — a pre-filled `wa.me` link with the order summary, so the order can be confirmed over WhatsApp the same way the current site works.

## Making an admin user

There's no public "become admin" route on purpose. After registering a normal account, flip its role directly in the database:

```js
// in a mongo shell or Compass
db.users.updateOne({ phone: "919999999999" }, { $set: { role: "admin" } })
```

## Connecting the frontend

The `index.html` / `style.css` / `script.js` in the `kafalmart-frontend` folder are currently static and link to `kafalmart.in/restaurants`, `/cart`, etc. as placeholders. To wire them to this API:
- Replace those links with `fetch()` calls to the routes above (e.g. `fetch('/api/restaurants')` to populate the restaurant cards).
- Store the JWT from login/register in memory or a secure cookie, and attach it as a Bearer token on cart/order requests.
- Set `CLIENT_URL` in `.env` to your deployed frontend URL so CORS allows it.
