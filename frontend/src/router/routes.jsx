import { lazy } from "react";
import RecoverIdCover from "../pages/Auth/RecoverIdCover";
import IconDashboard from "../components/Icon/Menu/IconMenuCharts";
import IconLeads from "../components/Icon/Menu/IconMenuDatatables";
import IconSales from "../components/Icon/Menu/IconMenuInvoice";
// import IconExpense from "../components/Icon/Menu/IconMenuDocumentation";
import IconUsers from "../components/Icon/Menu/IconMenuUsers";
// import IconChat from '../components/Icon/IconChatDots';
// import IconInbox from "../components/Icon/Menu/IconMenuDatatables";
// import Support from "../pages/Support";
// import AllSalesPersons from "../pages/Sales Team/AllSalesPersons";
import AllUsers from "../pages/Sales Team/AllUsers";
import ManagerTeam from "../pages/Sales Team/ManagerTeam";
import AllSignUps from "../pages/Leads/AllSignUps";
import AllOldLeads from "../pages/Leads/OldSignUps";
import UnlockCover from "../pages/Auth/UnlockCover";
import Client from "../pages/Client";
// import ClientDetails from "../pages/Sales Team/ClientDetails";
// import CardInfo from "../pages/CardInfo";
import BillingTable from "../components/DataTables/BillingTable";
import InvoicePreview from "../pages/InvoicePreview";
// import ChargePayment from "../pages/ChargePayment";
import IconUsersGroup from "../components/Icon/IconUsersGroup";
// import Mailbox from "../pages/Mailbox/Mailbox";
// import IconMail from "../components/Icon/IconMail";


const ClientDetails = lazy(() => import("../pages/Sales Team/ClientDetails"));
// const Support = lazy(() => import("../pages/Support"));
// const AdminSupport = lazy(() => import("../pages/AdminSupport"));
const LoginCover = lazy(() => import("../pages/Auth/LoginCover"));
const RegisterCover = lazy(() => import("../pages/Auth/RegisterCover"));
const UnlockBox = lazy(() => import("../pages/Auth/UnlockBox"));
const Dashboard = lazy(() => import("../pages/Index"));
const UserDashboard = lazy(() =>
  import("../pages/Sales Team/SalesPersonDashboard")
);
const AddLeads = lazy(() => import("../pages/Leads/AddLeads"));
const AllLeads = lazy(() => import("../pages/Leads/AllLeads"));
const AllSales = lazy(() => import("../pages/Sales/AllSales"));
const AddSales = lazy(() => import("../pages/Sales/AddSales"));
// const AddExpense = lazy(() => import("../pages/Expense/AddExpense"));
// const AllExpense = lazy(() => import("../pages/Expense/AllExpense"));
// const AddSalesPerson = lazy(() => import("../pages/Sales Team/AddSalesUser"));
const SalesPerson = lazy(() => import("../pages/Sales Team/AllSalesPersons"));
const SalesTeams = lazy(() => import("../pages/Sales Team/AllSalesTeams"));
const SalesPersonDetail = lazy(() =>
  import("../pages/Sales Team/SalesPersonDetail")
);
const TeamDashboard = lazy(() =>
  import("../pages/Sales Team/TeamDashboard")
);
const AccountSetting = lazy(() => import("../pages/AccountSetting"));

const routes = [
  // {
  //   lable: "Leads",
  //   layout: "default",
  //   role: ["admin"],
  //   icon: (
  //     <IconUsers
  //       className="group-hover:!text-primary shrink-0"
  //       fill="currentColor"
  //     />
  //   ),
  //   subRoutes: [
  //     {
  //       path: "/add-leads",
  //       label: "Add Leads",
  //       layout: "default",
  //       element: <AddLeads />,
  //       role: ["admin"],
  //     },
  //     {
  //       path: "/all-leads",
  //       label: "All Leads",
  //       layout: "default",
  //       element: <AllLeads />,
  //     },
  //   ],
  // },
  {
    lable: "Sales Dashboard",
    path: "/sales-dashboard",
    element: <UserDashboard />,
    layout: "default",
    role: ["manager", "upsellManager", "frontsell", "upsell", "upFront", "pmManager", "pm"],
    icon: (
      <IconDashboard
        className="group-hover:!text-primary shrink-0"
        fill="currentColor"
      />
    ),
  },
  {
    lable: "Dashboard",
    path: "/",
    element: <Dashboard />,
    layout: "default",
    role: ["admin"],
    icon: (
      <IconDashboard
        className="group-hover:!text-primary shrink-0"
        fill="currentColor"
      />
    ),
  },
  {
    path: "/add-leads",
    element: <AddLeads />,
    layout: "default",
    role: ["ppc", "admin", "manager", "frontsell", "upsellManager", "upsell", "upFront", "pmManager", "pm"]
  },
  // {
  //   lable: 'Packages',
  //   path: '/packages',
  //   role: ["admin"],
  //   element: <AddLeads />,
  //   layout: "default",
  //   icon: <IconUsers className="group-hover:!text-primary shrink-0" fill="currentColor" />,
  //   // subRoutes: [
  //   //   { path: '/packages-list', label: 'Packages List' },
  //   //   { path: '/packages/add', label: 'Add Packages' },
  //   // ],
  // },
  {
    lable: "SignUps",
    path: "/all-signups",
    element: <AllSignUps />,
    layout: "default",
    role: ["manager", "frontsell", "admin", "ppc", "upFront"],
    icon: (
      <IconLeads
        className="group-hover:!text-primary shrink-0"
        fill="currentColor"
      />
    ),
  },
  {
    lable: "Old Clients",
    path: "/old-clients",
    element: <AllOldLeads />,
    layout: "default",
    role: ["admin", "manager", "frontsell" ,"upFront", "upsellManager", "upsell"],
    icon: (
      <IconLeads
        className="group-hover:!text-primary shrink-0"
        fill="currentColor"
      />
    ),
  },
  {
    lable: "Leads",
    path: "/leads",
    element: <AllLeads />,
    layout: "default",
    role: ["superAdmin", "admin", "manager", "frontsell", "upFront", "ppc", "upsellManager", "pmManager"],
    icon: (
      <IconLeads
        className="group-hover:!text-primary shrink-0"
        fill="currentColor"
      />
    ),
  },

  // {
  //   lable: "Leads",
  //   path: "/leads",
  //   layout: "default",
  //   role: ["admin", "manager", "frontsell", "ppc", "upsellManager", "upFront"],
  //   icon: (
  //     <IconLeads
  //       className="group-hover:!text-primary shrink-0"
  //       fill="currentColor"
  //     />
  //   ),
  //   subRoutes: [
  //     {
  //       path: '/leads/all-leads',
  //       label: 'All Leads',
  //       element: <AllSales />,
  //       layout: 'default',
  //       role: ["admin", "manager", "frontsell", "ppc", "upsellManager", "upFront" ],
  //     },
  //     {
  //       path: '/leads/belleuve-publishers',
  //       label: 'Belleuve Publishers',
  //       element: <AllSales />,
  //       layout: 'default',
  //       role: ["admin", "manager", "frontsell", "ppc", "upsellManager", "upFront" ],
  //     },
  //     {
  //       path: '/leads/urban-quill-publishings',
  //       label: 'Urban Quill',
  //       element: <AddSales />,
  //       layout: 'default',
  //       role: ["admin", "manager", "frontsell", "ppc", "upsellManager", "upFront" ],
  //     },
  //     {
  //       path: '/leads/american-writers-association',
  //       label: 'American Writers',
  //       element: <AddSales />,
  //       layout: 'default',
  //       role: ["admin", "manager", "frontsell", "ppc", "upsellManager", "upFront" ],
  //     },
  //     {
  //       path: '/leads/book-publishings',
  //       label: 'Book Publishings',
  //       element: <AddSales />,
  //       layout: 'default',
  //       role: ["admin", "manager", "frontsell", "ppc", "upsellManager", "upFront" ],
  //     },
  //     {
  //       path: '/leads/data-sheet',
  //       label: 'Data Sheet',
  //       element: <AddSales />,
  //       layout: 'default',
  //       role: ["admin", "manager", "upsellManager", "upFront" ],
  //     },
  //   ],
  // },

  // {
  //   path: "/leads/all-leads",
  //   element: <AllLeads />,
  //   layout: "default",
  //   role: ["admin", "manager", "frontsell", "ppc", "upsellManager", "upFront" ],
  // },
  // {
  //   path: "/leads/belleuve-publishers",
  //   element: <AllLeads />,
  //   layout: "default",
  //   role: ["admin", "manager", "frontsell", "ppc", "upsellManager", "upFront" ],
  // },
  // {
  //   path: "/leads/urban-quill-publishings",
  //   element: <AllLeads />,
  //   layout: "default",
  //   role: ["admin", "manager", "frontsell", "ppc", "upsellManager", "upFront"],
  // },
  // {
  //   path: "/leads/american-writers-association",
  //   element: <AllLeads />,
  //   layout: "default",
  //   role: ["admin", "manager", "frontsell", "ppc", "upsellManager", "upFront"],
  // },
  // {
  //   path: "/leads/book-publishings",
  //   element: <AllLeads />,
  //   layout: "default",
  //   role: ["admin", "manager", "frontsell", "ppc", "upsellManager", "upFront"],
  // },
  // {
  //   path: "/leads/data-sheet",
  //   element: <AllLeads />,
  //   layout: "default",
  //   role: ["admin", "superAdmin", "salesUser", "upFront"],
  // },
  {
    path: "/add-sales/:leadId",
    element: <AddSales />,
    layout: "default",
    role: ["admin", "manager", "upsellManager", "frontsell", "upsell", "upFront"],
  },
  {
    lable: "Sales",
    path: "/sales",
    element: <AllSales />,
    layout: "default",
    role: ["admin", "manager", "upsellManager", "frontsell", "upsell", "upFront"],
    icon: (
      <IconSales
        className="group-hover:!text-primary shrink-0"
        fill="currentColor"
      />
    ),
    subRoutes: [
      {
        path: '/sales/all-sales',
        label: 'All Sales',
        element: <AllSales />,
        layout: 'default',
        role: ["admin", "manager", "upsellManager", "frontsell", "upsell", "upFront"],
      },
      {
        path: '/sales/front-sales',
        label: 'Front Sale',
        element: <AllSales />,
        layout: 'default',
        role: ["admin", "manager", "frontsell", "upFront"],
      },
      {
        path: '/sales/up-sales',
        label: 'Up Sale',
        element: <AddSales />,
        layout: 'default',
        role: ["admin", "upsellManager", "upsell", "upFront"],
      },
      {
        path: '/sales/cross-sales',
        label: 'Cross Sale',
        element: <AddSales />,
        layout: 'default',
        role: ["admin", "manager", "frontsell", "upFront"],
      },
    ],
  },
  {
    path: "/sales/all-sales",
    element: <AllSales />,
    layout: "default",
    role: ["admin", "manager", "upsellManager", "frontsell", "upsell", "upFront"],
  },
  {
    path: "/sales/front-sales",
    element: <AllSales />,
    layout: "default",
    role: ["admin", "manager", "frontsell", "upFront"],
  },
  {
    path: "/sales/up-sales",
    element: <AllSales />,
    layout: "default",
    role: ["admin", "upsellManager", "upsell", "upFront"],
  },
  {
    path: "/sales/cross-sales",
    element: <AllSales />,
    layout: "default",
    role: ["admin", "manager", "frontsell", "upFront"],
  },
  {
    lable: "All Clients",
    path: "/clients",
    element: <Client />,
    layout: "default",
    role: ["admin"],
    icon: (
      <IconUsers
        className="group-hover:!text-primary shrink-0"
        fill="currentColor"
      />
    ),
  },
  {
    path: "/clients/:id",
    element: <ClientDetails />,
    layout: "default",
    role: ["admin", "manager", "upsellManager", "upFront", "pmManager", "pm"],
  },
  {
    lable: "All Invoices",
    path: "/invoices",
    element: <BillingTable />,
    layout: "default",
    role: ["admin", "manager", "upsellManager", "frontsell", "upsell", "upFront"],
    icon: (
      <IconSales
        className="group-hover:!text-primary shrink-0"
        fill="currentColor"
      />
    ),
  },
  // {
  //   path: "/invoice/pay/:id",
  //   element: <ChargePayment />,
  //   layout: "default",
  //   role: ["superAdmin", "admin", "manager"],
  // },
  {
    path: "/invoice/:id",
    element: <InvoicePreview />,
    layout: "default",
    role: ["superAdmin", "admin"],
  },
  // {
  //   lable: "Add Expense",
  //   path: "/add-expense",
  //   element: <AddExpense />,
  //   layout: "default",
  //   role: ["superAdmin", "admin", "dataEntry"],
  //   icon: (
  //     <IconExpense
  //       className="group-hover:!text-primary shrink-0"
  //       fill="currentColor"
  //     />
  //   ),
  // },
  // {
  //   lable: "All Expenses",
  //   path: "/all-expenses",
  //   element: <AllExpense />,
  //   layout: "default",
  //   role: ["superAdmin", "admin", "dataEntry"],
  //   icon: (
  //     <IconExpense
  //       className="group-hover:!text-primary shrink-0"
  //       fill="currentColor"
  //     />
  //   ),
  // },
  // {
  //   lable: "Add Sale Persons",
  //   path: "/Add-Sale-Person",
  //   element: <AddSalesPerson />,
  //   layout: "default",
  //   role: ["superAdmin", "admin", "manager"],
  //   icon: (
  //     <IconUsers
  //       className="group-hover:!text-primary shrink-0"
  //       fill="currentColor"
  //     />
  //   ),
  // },
  {
    lable: "All Sale Persons",
    path: "/All-Sale-Person",
    element: <AllUsers />,
    layout: "default",
    role: ["admin"],
    icon: (
      <IconUsers
        className="group-hover:!text-primary shrink-0"
        fill="currentColor"
      />
    ),
  },
  {
    lable: "Sales Teams",
    path: "/sales-managers",
    element: <SalesTeams />,
    layout: "default",
    role: ["admin", "manager", "upsellManager", "upFront", "pmManager"],
    icon: (
      <IconUsersGroup
        className="group-hover:!text-primary shrink-0"
        fill="currentColor"
      />
    ),
  },
  {
    path: "/sales-manager-teams/:managerId",
    element: <ManagerTeam />,
    layout: "default",
    role: ["superAdmin", "admin", "manager"],
  },
  {
    path: "/sales-teams/:id",
    element: <SalesPerson />,
    layout: "default",
    role: ["superAdmin", "admin", "manager"],
  },
  {
    path: "/sales-persons/:id",
    element: <SalesPersonDetail />,
    layout: "default",
    role: ["admin", "manager", "upsellManager", "upFront", "pmManager"],
  },
  {
    path: "/team-dashboard/:teamId",
    element: <TeamDashboard />,
    layout: "default",
    role: ["admin", "manager", "upsellManager", "upFront", "pmManager"],
  },
  // {
  //   lable: 'Support',
  //   path: '/support',
  //   element: <Support />,
  //   layout: 'default',
  //   role: ["superAdmin", 'admin', 'manager', "ppc", 'user', "upSellManager", "frontsell", "upsell", "upFront"],
  //   icon: <IconChat className="group-hover:!text-primary shrink-0" fill="currentColor" />,
  // },
  // {
  //   lable: 'Mail Box',
  //   path: '/mailbox',
  //   element: <Mailbox />,
  //   layout: 'default',
  //   role: ["superAdmin", 'admin', 'manager', "ppc", 'user', "upSellManager", "frontsell", "upsell", "upFront"],
  //   icon: <IconMail className="group-hover:!text-primary shrink-0" fill="currentColor" />,
  // },
  // {
  //   lable: 'Admin Support',
  //   path: '/admin-support',
  //   element: <AdminSupport />,
  //   layout: 'default',
  //   role: ['admin'],
  //   icon: <IconChat className="group-hover:!text-primary shrink-0" fill="currentColor" />,
  // },
  {
    path: "/profile",
    element: <AccountSetting />,
    layout: "default",
  },
  {
    path: "/auth/login",
    element: <LoginCover />,
    layout: "blank",
  },
  {
    path: "/auth/register",
    element: <RegisterCover />,
    layout: "blank",
  },
  {
    path: "/auth/lockscreen",
    element: <UnlockBox />,
    layout: "blank",
  },

  {
    path: "/password/reset",
    element: <RecoverIdCover />,
    layout: "blank",
  },
  {
    path: "/password/reset/:token",
    element: <UnlockCover />,
    layout: "blank",
  },
];

export { routes };
