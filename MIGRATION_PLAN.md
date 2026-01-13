# Modernization & TypeScript Migration Plan

## Phase 1: Preparation & Cleanup
1.  **Clean Codebase**:
    - Remove all commented-out code (git history preserves it if needed).
    - Remove `react-scripts` and other unused dependencies.
2.  **Initialize Testing**:
    - Set up `vitest` (for frontend) and `jest` (for backend) with a simple "smoke test" to ensure the app boots up.
    - **Goal**: Have a safety net before changing file extensions.

## Phase 2: Frontend Migration (Incremental)
1.  **Configuration**:
    - Ensure `tsconfig.json` is correctly set up for React + Vite.
    - Install types: `@types/react`, `@types/node`, `@types/react-dom`.
2.  **Migration Strategy**:
    - **Leaf Components First**: Start renaming `.jsx` to `.tsx` for simple components (e.g., buttons, inputs).
    - **Utils/Hooks**: Migrate utility functions and custom hooks, adding type definitions.
    - **State/API**: Define interfaces for Redux slices and API responses.
    - **Pages**: Migrate page components last.
3.  **Strict Mode**:
    - Start with `noImplicitAny: false` to allow gradual typing, then tighten rules later.

## Phase 3: Backend Migration
1.  **Configuration**:
    - Install `typescript`, `ts-node`, `@types/express`, `@types/mongoose`.
    - Create `tsconfig.json` for backend.
2.  **Migration Strategy**:
    - Rename `server.js` to `server.ts`.
    - Create interfaces for Mongoose models (extends `Document`).
    - Type Express Request/Response objects in controllers.
    - Refactor `require` to `import` statements.

## Phase 4: Library Upgrades
1.  **AWS SDK v3**:
    - Migrate from `aws-sdk` (v2) to `@aws-sdk/client-s3` (modular).
    - Update code in `backend/middleWare/awsUpload.js`.
2.  **Mongoose v8**:
    - Update Mongoose and fix any breaking changes in schema definitions or query syntax.
3.  **Express v5 (Optional)**:
    - Consider upgrading to Express v5 for better error handling, but priority is lower than AWS/Mongoose.

## Risks & Mitigation
-   **Breaking Changes**: Migration to TS often uncovers hidden bugs.
    -   *Mitigation*: rely on the test suite created in Phase 1.
-   **Time Consumption**: Full strict typing takes time.
    -   *Mitigation*: Use `any` temporarily where complex types block progress, and mark with `// TODO: Fix type`.
