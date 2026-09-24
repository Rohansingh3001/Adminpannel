# Product Admin Dashboard

A modern, responsive Product Admin Dashboard built with Next.js, React, Tailwind CSS, and Axios. It interfaces with the DummyJSON API to provide a comprehensive management interface for products.

## Tech Stack
* **Framework:** Next.js (App Router), React
* **Styling:** Tailwind CSS
* **HTTP Client:** Axios
* **Icons:** Lucide React
* **Backend:** DummyJSON API

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables
The application uses the `NEXT_PUBLIC_API_URL` environment variable for the DummyJSON endpoint.
If not provided, it defaults to `https://dummyjson.com`.

Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=https://dummyjson.com
```

## Features Complete
* **Authentication:** Login using DummyJSON auth credentials (`emilys` / `emilyspass`). Secure routes protected by `AuthGuard`.
* **Product Catalog:** Table view for desktop, responsive card view for mobile.
* **Pagination:** Server-side pagination with URL state syncing and configurable page sizes.
* **Search:** Debounced search query that resets the pagination, aborts stale requests, and prevents race conditions.
* **Filtering & Sorting:** Filter by category and sort by price, rating, or title. State is fully maintained in URL parameters.
* **CRUD Operations:** Detailed product view, Add, Edit, and Delete actions with optimistic local UI updates and loading/error states.
* **Validation:** Robust form validation preventing negative prices/stocks and empty required fields.

## API Architecture
* **Centralized Axios Client:** Found in `src/lib/axios.ts`, it automatically injects the stored `auth_token` into headers and globally intercepts `401 Unauthorized` responses to securely log out users.
* **Separation of Concerns:** API logic is segregated into `src/api/auth.ts`, `src/api/products.ts`, and `src/api/categories.ts`. Components only call these specialized modules.

## Important Technical Decisions

### Search & Category Limitation
The DummyJSON API does not natively support simultaneously searching and filtering by category.
**Decision:** When both search and category parameters are present, the application gives precedence to the search parameter. A small alert banner notifies the user of this API limitation to preserve good UX.

### Request Race Conditions
When a user rapidly types in the search bar, multiple API requests fire.
**Decision:** An `AbortController` is used in `useProducts` to cancel previous unfinished network requests when a new search triggers. This prevents stale API responses from overwriting the latest search results.

### DummyJSON Mutation Behavior
DummyJSON's `POST`, `PUT`, and `DELETE` requests simulate the mutation but do not persist the changes on their server.
**Decision:** The dashboard relies on React state to apply optimistic local UI updates after a successful simulated API request, ensuring the user immediately sees the deletion or addition. A clear note in the Add/Edit form reminds users that changes are session-based.

### URL-driven State Management
**Decision:** Parameters such as `page`, `pageSize`, `search`, `category`, `sort`, and `order` are actively synced with the browser's URL query string. This makes the dashboard state perfectly shareable and robust to page refreshes.

## AI Usage Note
AI was utilized during the development to rapidly bootstrap the standard layout shell and generate repetitive Tailwind utility classes for responsive grids and form styling.

**Problem and Solution with AI:**
* **Problem:** Ensuring that the search debouncing works efficiently without causing a flicker or unnecessary re-renders when the URL query string was updated.
* **Solution:** I consulted the AI on the best hooks pattern for URL debouncing in the Next.js App router. The AI recommended separating the local text input state from the URL update, employing a `useDebounce` hook, and executing a `router.push` only when the debounced value effectively differed from the current URL parameter. This cleanly resolved the UI flicker and kept the URL strictly as the source of truth for the API fetch.
