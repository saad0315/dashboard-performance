// import React, { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { Outlet, useNavigate } from "react-router-dom";

// const AuthenticatedUser = ({ allowedUsers }) => {
//   const { isAuthenticated, user } = useSelector((state) => state.user);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate(`/auth/login`);
//     } else {
//       navigate(`/`);
//     }
//   }, [user, navigate, allowedUsers, isAuthenticated]);

//   return <Outlet />;
// };

// export default AuthenticatedUser;

import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthenticatedUser = ({ element, roles, ...rest }) => {
  const { user, isAuthenticated, locked } = useSelector((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  if (locked) {
    return <Navigate to="/auth/lockscreen" />;
  }

  let redirectPath = null;

  switch (user?.role) {
    case "admin":
      redirectPath = "/";
      break;
    case "manager":
      redirectPath = "/all-signups";
      break;
    case "upsellManager":
      redirectPath = "/leads";
      break;
    case "upsell":
      redirectPath = "/sales-dashboard";
      break;
    case "frontsell":
      redirectPath = "/sales-dashboard";
      break;
    case "upFront":
      redirectPath = "/sales-dashboard";
      break;
    case "pmManager":
      redirectPath = "/sales-dashboard";
      break;
    case "pm":
      redirectPath = "/sales-dashboard";
      break;
    // case "manager":
    //   redirectPath = "/sales/all-sales";
    //   break;
    // case "dataEntry":
    //   redirectPath = "/all-sales";
    //   break;
    case "ppc":
      redirectPath = "/add-leads";
      break;
    default:
      redirectPath = "/";
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to={redirectPath} />;
  }

  return element;
};

export default AuthenticatedUser;
