# Current State Analysis & Feature Breakdown

## 1. Executive Summary
The application is a comprehensive **CRM (Customer Relationship Management) and ERP (Enterprise Resource Planning)** system tailored for a digital agency or software house. It solves the problem of managing the entire lifecycle of a client—from lead acquisition (via website forms) to sales conversion, invoicing, payment processing, and ongoing project management. It also tracks employee performance and team organization.

## 2. Technology Stack

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js (REST API architecture)
*   **Database**: MongoDB (Mongoose ODM). Currently uses two distinct database connections (`ebook-sales-dashboard` and `signup-forms`).
*   **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` for hashing.
*   **Key Libraries**: `aws-sdk` (S3 storage), `socket.io` (Real-time comms), `nodemailer` (Email), `authorizenet` (Payments).

### Frontend
*   **Framework**: React 18
*   **Build Tool**: Vite (though `react-scripts` is present in dependencies, it is unused).
*   **State Management**: Redux Toolkit (User/Theme state) + React Query (Server state/caching).
*   **Styling**: Tailwind CSS + Mantine UI components.
*   **Routing**: React Router DOM v6.

## 3. User Roles & Permissions
The system supports a granular permission system with **12 distinct roles**, allowing for complex organizational hierarchies.

*   **Administrators**: `superAdmin`, `admin` (Full access).
*   **Management**: `manager`, `pmManager` (Project Manager Manager), `upsellManager`.
*   **Sales Team**: `frontsell` (Initial contact), `upsell` (Existing clients), `crossSell`.
*   **Operations**: `dataEntry` (Lead input), `ppc` (Pay-Per-Click specialists), `pm` (Project Managers).
*   **General**: `user` (Base role).

## 4. Feature Breakdown

### A. Customer Relationship Management (CRM)
*   **Lead Management**:
    *   **Frontend**: `AllLeads.jsx`, `AddLeads.jsx`.
    *   **Backend**: `leadRoute.js`, `formsRoute.js`.
    *   **Function**: Capture leads from website forms (`signup-forms` DB) or manual entry. Assign leads to specific users or teams. Track status (New, Contacted, Converted).
*   **Client Management**:
    *   **Frontend**: `Client.jsx`.
    *   **Backend**: `userRoute.js` (Clients are likely stored as users or leads with specific status).
    *   **Function**: Manage client details and history.

### B. Sales & Finance (ERP)
*   **Sales Tracking**:
    *   **Frontend**: `AllSales.jsx`, `AddSales.jsx`.
    *   **Backend**: `salesRoute.js`, `orderRoute.js`.
    *   **Function**: Record closed deals, amount, services sold, and assign to sales agents.
*   **Invoicing & Payments**:
    *   **Frontend**: `InvoicePreview.jsx`, `ChargePayment.jsx`, `PaymentScreen.jsx`.
    *   **Backend**: `invoiceRoute.js`, `paymentRoute.js`, `cardInfoRoute.js`.
    *   **Function**: Generate PDF invoices. Process credit card payments (via Authorize.Net). Track payment status (Pending, Partial, Paid).
*   **Expense Management**:
    *   **Frontend**: `AllExpense.jsx`.
    *   **Backend**: `expenseRoute.js`.
    *   **Function**: Track company or team expenses.

### C. Team & Performance Management
*   **Team Structure**:
    *   **Frontend**: (Dashboard/Settings).
    *   **Backend**: `teamRoute.js`.
    *   **Function**: Group users into teams (e.g., "Front Sell Team A"). Assign managers.
*   **Performance Analytics**:
    *   **Frontend**: `Index.jsx` (Dashboard).
    *   **Backend**: `dashboardRoute.js`, `performanceRoute.js`.
    *   **Function**: Track revenue by agent, conversion rates, and sales trends.

### D. Communication & Notifications
*   **Real-time Chat**:
    *   **Frontend**: `Mailbox.jsx` (likely includes chat interface).
    *   **Backend**: `chatRoute.js`, `messageRoute.js`, `socket.io`.
    *   **Function**: Internal team chat or client communication.
*   **Notifications**:
    *   **Backend**: `notificationRoute.js`, `webpushRoutes.js`.
    *   **Function**: System alerts for new leads, assigned tasks, or payment failures.

## 5. Security Note
*   The presence of `cardInfoRoute.js` and `ccListRoute.js` suggests the application might be handling raw credit card data. **Immediate Security Audit is recommended** to ensure PCI-DSS compliance, as storing raw card details is high-risk.
