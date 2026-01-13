# Deep Backend Audit Report: Slow APIs & Performance Bottlenecks

## 1. Executive Summary
The backend suffers from **severe performance bottlenecks** primarily due to:
1.  **Sequential Database Calls**: Multiple independent queries are awaited one after another instead of running in parallel.
2.  **In-Memory Processing**: Large datasets are fetched into Node.js memory and filtered/counted there (e.g., `getTeamMembers`), causing high CPU and RAM usage.
3.  **Missing Indexes**: Critical fields used in filtering and sorting (`status`, `assigned.user`, `createdAt`) are not indexed, forcing MongoDB to perform full collection scans.
4.  **Inefficient Aggregations**: Usage of `$unwind` on large collections without prior filtering.

## 2. Module-Level Analysis

### A. Leads Module (`backend/controllers/leadController.js`)

#### **Problematic API: `getAllLeads`**
*   **Issue**: **Double Query Execution**.
    *   The code runs `Lead.find(baseFilter)...` *twice*: once to get the count (`filteredQuery.length`) and once to get the paginated data.
    *   It fetches *all* documents just to count them (`.length`), which crashes performance as data grows.
    *   **Impact**: Doubled response time + high memory usage.
*   **Fix**:
    *   Use `Lead.countDocuments(filter)` instead of fetching arrays.
    *   Remove the `isNew` mapping loop if possible, or optimize it.

#### **Problematic API: `registerUser` (Create Lead)**
*   **Issue**: **Multiple Sequential Lookups**.
    *   It calls `userModel.find` three separate times (for assigned users, for notification recipients, for assigned notifications).
*   **Fix**:
    *   Use `Promise.all` for parallel execution.
    *   Combine notification queries.

#### **Schema Issues (`backend/models/leadModel.js`)**
*   **Issue**: **No Indexes**.
    *   Queries filter by `status`, `brandName`, `assigned.user`, and `createdAt`, but no indexes exist.
*   **Fix**: Add compound indexes:
    ```javascript
    leadSchema.index({ "assigned.user": 1, status: 1 });
    leadSchema.index({ createdAt: -1 });
    leadSchema.index({ brandName: 1 });
    ```

---

### B. Team Module (`backend/controllers/teamController.js`)

#### **Problematic API: `getTeamMembers` (CRITICAL)**
*   **Issue**: **Massive In-Memory Operation**.
    *   It runs a `$lookup` to fetch **ALL leads** for every user in the team.
    *   It then filters these leads using `$filter` inside the aggregation pipeline to count statuses (New, Converted, etc.).
    *   **Scenario**: If a team has 10 users and each has 5,000 leads, the server loads **50,000 lead documents** into memory for *every request*.
*   **Fix**:
    *   Do **not** join the `leads` collection.
    *   Use a separate aggregation on the `leads` collection to group by `assigned.user` and `status`, then map the results to the team members.

#### **Problematic API: `getAllTeams`**
*   **Issue**: **Inefficient Lookup**.
    *   It scans the entire `users` collection to match `teams.team` with the team ID.
*   **Fix**:
    *   Ensure `teams.team` is indexed in `userModel`.
    *   Limit the `$lookup` scope if possible.

---

### C. Dashboard Module (`backend/controllers/dashboardController.js`)

#### **Problematic API: `getDashboardStats`**
*   **Issue**: **Sequential Execution Hell**.
    *   This function awaits **9 separate database queries** one by one.
    *   Response time = Sum of all 9 query times.
*   **Fix**:
    *   Wrap independent queries in `Promise.all([...])`.
    *   Response time = Max of the slowest query time.

#### **Problematic API: `getLeadStatusBreakdown`**
*   **Issue**: **Unbounded `$unwind`**.
    *   `{ $unwind: "$assigned" }` is applied to the *entire* `leads` collection.
    *   If you have 100,000 leads, this operation creates 100,000+ intermediate documents.
*   **Fix**:
    *   If you only need current status, filter first. If `assigned` status is needed, ensure `assigned.status` is indexed.

#### **Problematic API: `getServiceStats`**
*   **Issue**: **Redundant Aggregations**.
    *   It runs 3 separate aggregations with the same `$match` criteria.
*   **Fix**:
    *   Use MongoDB `$facet` to run multiple pipelines in a single database round-trip.

---

## 3. Prioritized Recommendations

### Immediate Fixes (High Impact, Low Effort)
1.  **Add Indexes**: Run the following commands in MongoDB Shell or add to code:
    ```javascript
    db.leads.createIndex({ "assigned.user": 1 })
    db.leads.createIndex({ status: 1 })
    db.leads.createIndex({ createdAt: -1 })
    db.users.createIndex({ "teams.team": 1 })
    ```
2.  **Parallelize Dashboard Queries**: Rewrite `getDashboardStats` to use `Promise.all`.

### Code Refactoring (Medium Effort)
3.  **Optimize `getAllLeads`**: Replace `filteredQuery.length` with `Lead.countDocuments()`.
4.  **Rewrite `getTeamMembers`**: Remove the `$lookup` to `leads`. Fetch lead counts separately using `Lead.aggregate([{ $match: { "assigned.user": { $in: teamUserIds } } }, { $group: ... }])`.

### Long Term
5.  **Data Archiving**: Move old leads (`OldLead`) to a cold storage collection to keep the active `leads` collection small and fast.
