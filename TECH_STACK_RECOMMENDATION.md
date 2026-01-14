# Technology Recommendation & Roadmap

## 1. Executive Summary
For a software house internal CRM/ERP system that manages sales, designs, and ebooks, and aims for high scalability and complexity, we recommend migrating to **NestJS** (Backend) and **PostgreSQL** (Database). This combination offers the best balance of structure, type safety, and data integrity.

## 2. Backend Framework: NestJS vs. Express

### Recommendation: **NestJS**

| Feature | Express.js (Current) | NestJS (Recommended) | Why NestJS? |
| :--- | :--- | :--- | :--- |
| **Architecture** | Unopinionated; structure depends on developer. Current app has large controllers and mixed logic. | Opinionated; uses Modules, Controllers, and Services (Angular-like). | Enforces clean architecture, making it easier to scale and maintain as the team grows. |
| **TypeScript** | Optional; requires manual setup. | First-class citizen; built with TypeScript by default. | Validates the user's goal of strict typing. |
| **Testing** | Manual setup (Jest/Mocha). | Built-in testing architecture (Jest) for Unit and E2E tests. | Critical for "complex" applications to prevent regressions. |
| **Scalability** | Harder to maintain as codebase grows. | Modular system allows splitting app into microservices easily later. | Fits the "expand and make complex" goal. |

**Transition Strategy**:
- Since you are already planning a TypeScript migration, moving to NestJS is a logical step. It will require rewriting controllers, but the business logic (functions inside controllers) can be largely reused.

## 3. Database: PostgreSQL vs. MongoDB

### Recommendation: **PostgreSQL** (with JSONB)

| Feature | MongoDB (Current) | PostgreSQL (Recommended) | Why PostgreSQL? |
| :--- | :--- | :--- | :--- |
| **Data Structure** | Document-based; flexible. Good for unstructured logs or varying forms. | Relational (Tables). Strict schema. | Your app is highly relational: `Sales` belong to `Leads`, which belong to `Teams` and `Users`. SQL handles this natively with Foreign Keys. |
| **Integrity** | No native foreign key constraints (handled in code). Risk of "orphan" data (e.g., a Sale pointing to a deleted User). | ACID compliant. Enforces Foreign Keys (e.g., cannot delete a User if they have Sales). | Vital for financial data (Invoices, Sales, Refunds). |
| **Flexibility** | High. | High (via `JSONB`). | Use standard columns for core data (`amount`, `date`) and `JSONB` columns for dynamic `formData` or `attributes`. |
| **Reporting** | Complex aggregations (like the ones currently causing lag) can be slow. | SQL joins and aggregations are highly optimized and generally faster for analytical queries (Dashboards). | Solves the "dashboard response time" issue more effectively. |

**Verdict**: Use **PostgreSQL**.
- Use Relational Tables for: `Users`, `Teams`, `Sales`, `Invoices`, `Payments`.
- Use a `JSONB` column in the `Leads` table to store the dynamic data coming from different website forms. This gives you the best of both worlds (Relational Integrity + Flexibility).

## 4. Database Consolidation Plan
Currently, the app uses `db1` (ebook-sales) and `db2` (signup-forms).
**Goal**: Use a single database.

1.  **Audit `db2` Usage**: Identify which models use `db2`. (Likely `formModel.js` or similar).
2.  **Merge Data**:
    *   If migrating to Postgres: Create tables for `db1` models. Create a table for the `db2` data. Import data.
    *   If staying on Mongo: Export data from `signup-forms` and import into `ebook-sales-dashboard` under a new collection. Update code to use one connection.

## 5. Dead Code Removal Strategy
Removing unused code manually is risky without tests. Follow this safe process:

1.  **Logging**: Add a middleware in Express (or Interceptor in NestJS) that logs every accessed API route to a file or DB.
    ```javascript
    // Example Middleware
    app.use((req, res, next) => {
      console.log(`[USED ROUTE]: ${req.method} ${req.path}`);
      next();
    });
    ```
2.  **Monitor**: Run this in production for 1-2 weeks.
3.  **Compare**: Compare the list of "Used Routes" against your list of "All Routes".
4.  **Deprecate**: Mark identifying unused routes as deprecated (return 410 Gone or log a warning) for another week.
5.  **Delete**: Safely delete the code.

## 6. Summary of Roadmap
1.  **Immediate**: Fix performance (Indexes, Aggregations) on current stack (Node/Mongo).
2.  **Short-term**: Consolidate to one MongoDB database to simplify architecture.
3.  **Medium-term**: Initialize a **NestJS** project. Start migrating modules one by one (e.g., start with `Users` and `Auth`).
4.  **Long-term**: Switch DB to **PostgreSQL** during the NestJS migration (NestJS uses TypeORM/Prisma which makes working with Postgres easy).
