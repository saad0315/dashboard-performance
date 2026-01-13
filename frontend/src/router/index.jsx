// import { createBrowserRouter } from 'react-router-dom';
// import BlankLayout from '../components/Layouts/BlankLayout';
// import DefaultLayout from '../components/Layouts/DefaultLayout';
// import { routes } from './routes';

// const finalRoutes = routes.map((route) => {
//     return {
//         ...route,
//         element: route.layout === 'blank' ? <BlankLayout>{route.element}</BlankLayout> : <DefaultLayout>{route.element}</DefaultLayout>,
//     };
// });

// const router = createBrowserRouter(finalRoutes);

// export default router;


// import { createBrowserRouter } from 'react-router-dom';
// import BlankLayout from '../components/Layouts/BlankLayout';
// import DefaultLayout from '../components/Layouts/DefaultLayout';
// import { routes } from './routes';
// import AuthenticatedUser from '../components/AuthenticatedUser/AuthenticatedUser';

// const finalRoutes = routes.map((route) => {
//     const RouteComponent = route.layout === 'blank' ? BlankLayout : DefaultLayout;

//     return {
//         ...route,
//         element: <RouteComponent>{route.role ? <AuthenticatedUser element={route.element} roles={route.role} /> : route.element}</RouteComponent>,
//     };
// });

// const router = createBrowserRouter(finalRoutes);
// export default router;



// //////////////////////?/

import { createBrowserRouter } from 'react-router-dom';
import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import { routes } from './routes';
import AuthenticatedUser from '../components/AuthenticatedUser/AuthenticatedUser';

// Function to recursively process nested routes
const processRoutes = (routes) => {
    return routes.map((route) => {
        const RouteComponent = route.layout === 'blank' ? BlankLayout : DefaultLayout;
        return {
            ...route,
            element: <RouteComponent>{route.role ? <AuthenticatedUser element={route.element} roles={route.role} /> : route.element}</RouteComponent>,
        };
    });
};

const finalRoutes = processRoutes(routes); // Process main routes and their subroutes
const router = createBrowserRouter(finalRoutes);
export default router;




/////////////////////////////


// import { createBrowserRouter } from 'react-router-dom';
// import BlankLayout from '../components/Layouts/BlankLayout';
// import DefaultLayout from '../components/Layouts/DefaultLayout';
// import { routes } from './routes';
// import AuthenticatedUser from '../components/AuthenticatedUser/AuthenticatedUser';

// // Function to recursively process nested routes
// const processRoutes = (routes) => {
//     return routes.map((route) => {
//         const hasChildren = Array.isArray(route.subRoutes) && route.subRoutes.length > 0;
//         const RouteComponent = route.layout === 'blank' ? BlankLayout : DefaultLayout;

//         return {
//             ...route,
//             element: hasChildren
//                 ? <RouteComponent /> // will contain <Outlet />
//                 : route.role
//                     ? <AuthenticatedUser element={route.element} roles={route.role} />
//                     : route.element,
//             children: hasChildren
//                 ? processRoutes(route.subRoutes)
//                 : undefined,
//         };
//     });
// };

// const finalRoutes = processRoutes(routes); // Process main routes and their subroutes
// const router = createBrowserRouter(finalRoutes);
// export default router;



// import React from 'react';
// import { createBrowserRouter } from 'react-router-dom';
// import BlankLayout from '../components/Layouts/BlankLayout';
// import DefaultLayout from '../components/Layouts/DefaultLayout';
// import AuthenticatedUser from '../components/AuthenticatedUser/AuthenticatedUser';
// import { routes } from './routes';

// // Function to create the route element with the appropriate layout and authentication
// const createRouteElement = (route) => {
//     const RouteComponent = route.layout === 'blank' ? BlankLayout : DefaultLayout;
//     return <RouteComponent>{route.role ? <AuthenticatedUser element={route.element} roles={route.role} /> : route.element}</RouteComponent>;
// };

// // Recursive function to map routes and subroutes
// const mapRoutes = (routes) => {
//     return routes.map((route) => {
//         const mappedRoute = {
//             path: route.path,
//             element: createRouteElement(route),
//         };

//         if (route.subRoutes) {
//             mappedRoute.children = mapRoutes(route.subRoutes);
//         }
//         console.log(mappedRoute);

//         return mappedRoute;
//     });
// };

// // Generate the final routes with nested subroutes
// const finalRoutes = mapRoutes(routes);

// // Create the router
// const router = createBrowserRouter(finalRoutes);

// export default router;

// import React from 'react';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import BlankLayout from '../components/Layouts/BlankLayout';
// import DefaultLayout from '../components/Layouts/DefaultLayout';
// import AuthenticatedUser from '../components/AuthenticatedUser/AuthenticatedUser';
// import { routes } from './routes';

// const createRouteElement = (route) => {
//     const RouteComponent = route.layout === 'blank' ? BlankLayout : DefaultLayout;
//     return <RouteComponent>{route.role ? <AuthenticatedUser element={route.element} roles={route.role} /> : route.element}</RouteComponent>;
// };

// const generateRoutes = (routes) => {
//     return routes.map((route) => {
//         const routeObject = {
//             path: route.path,
//             element: createRouteElement(route),
//         };

//         if (route.subRoutes) {
//             routeObject.children = generateRoutes(route.subRoutes);
//         }

//         return routeObject;
//     });
// };

// const finalRoutes = generateRoutes(routes);

// const router = createBrowserRouter(finalRoutes);
// export default router;
