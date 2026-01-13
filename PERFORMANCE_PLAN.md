# Performance Optimization Plan

## Phase 1: Quick Wins (Frontend & Dependencies)
1.  **Remove Dead Dependencies**:
    - Uninstall `react-scripts` from the frontend to reduce `node_modules` size and install time.
    - Audit and remove unused libraries in both backend and frontend.
2.  **Enable Gzip/Brotli Compression**:
    - Ensure the backend (Express) uses `compression` middleware for serving responses.
3.  **Vite Build Optimization**:
    - Review `vite.config.ts` to ensure code splitting is configured (e.g., `manualChunks`).

## Phase 2: Backend Query Optimization
1.  **Refactor `getAllTeamMembers`**:
    - **Current**: Fetches all users/teams and filters in a loop in Node.js.
    - **Optimization**: Rewrite using a MongoDB Aggregation Pipeline (`$lookup`, `$match`, `$group`) to filter data at the database level.
    - **Metric**: Measure API response time for this endpoint before and after.
2.  **Indexing**:
    - Review `backend/models` and ensure fields used in filters (e.g., `userEmail`, `team`, `role`) are indexed.
    - Use `mongoose.set('debug', true)` temporarily to identify slow queries.

## Phase 3: Frontend Rendering & State
1.  **Reduce Bundle Size**:
    - Use dynamic imports (`React.lazy`) for heavy routes (e.g., `react-apexcharts`, `react-quill`).
2.  **React Query Optimization**:
    - Ensure `staleTime` and `cacheTime` are configured appropriately to avoid unnecessary refetches.
3.  **Virtualization**:
    - If data tables (Mantine DataTable) display large datasets, ensure virtualization is enabled to render only visible rows.

## Monitoring Tools
-   **Backend**: Integrate `morgan` (already present) with a logging service or simple file logging to track response times. Consider `pm2` monitoring if deploying with PM2.
-   **Frontend**: Use Google Lighthouse and React DevTools Profiler to measure First Contentful Paint (FCP) and component re-renders.
