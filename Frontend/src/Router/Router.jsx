import { createBrowserRouter } from "react-router-dom";

import Error from "@pages/Error/Error";
import MainLayout from "@layouts/MainLayout";
import Login from "@pages/Auth/Login/Login";
import SignUp from "@pages/Auth/SignUp/SignUp";
import Home from "@pages/Home/Home";
import Batches from "@pages/Batches/Batches";
import WaitList from "@pages/WaitList/WaitList";
import PendingTestList from "@pages/PendingTestList/PendingTestList";
import Trainess from "@pages/Trainess/Trainess";
import DetailsTrainess from "@pages/Trainess/DetailsTrainess";
import Users from "@pages/Users/Users";
import PendingUsers from "@pages/PendingUsers/pendingUsers";
import HoldList from "@pages/HoldList/HoldList";
import Refund from "@pages/Refund/Refund";
import BlackList from "@pages/BlackList/BlackList";
import Settings from "@pages/Settings/Settings";
import DetailsBatch from "@pages/Batches/DetailsBatch";
import Profile from "@pages/Auth/Profile/Profile";
import Class from "@src/pages/Batches/Classes/Class";
import Attendance from "@src/pages/Batches/Classes/Attendance/Attendance";
import Roles from "@src/pages/Roles/Roles";
import Branches from "@src/pages/Branches/Branches";
import Trainer_Attendance from "@src/pages/Batches/Classes/Attendance/Trainer Attendance/Trainer_Attendance";
import TrainerAttendanceDetails from "@src/pages/Batches/Classes/Attendance/Trainer Attendance/TrainerAttendanceDetails";
import Inbox from "@src/pages/Inbox/Inbox";
import ForgetPassword from "@src/pages/Auth/ForgetPassword/ForgetPassword";
import Reset from "@src/pages/Auth/Reset/Reset";
import Notification from "@src/pages/Notification/Notification";
import BranchLogs from "@src/pages/LogsOperations/BranchLogs";

const Router = createBrowserRouter([
  {
    path: "*",
    element: <Error />,
  },
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/branches",
        element: <Branches />,
      },
      {
        path: "/batches",
        element: <Batches />,
      },
      {
        path: "/batch/:id",
        element: <DetailsBatch />,
      },
      {
        path: "/batch/:id/class/:id",
        element: <Class />,
      },
      {
        path: "/batch/:id/class/:id/Attendance",
        element: <Attendance />,
      },
      {
        path: "/trainer-attendance",
        element: <Trainer_Attendance />,
      },
      {
        path: "/trainer-attendance/:id",
        element: <TrainerAttendanceDetails />,
      },
      {
        path: "/waitlist",
        element: <WaitList />,
      },
      {
        path: "/pendingtest",
        element: <PendingTestList />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/pendingusers",
        element: <PendingUsers />,
      },
      {
        path: "/roles",
        element: <Roles />,
      },
      {
        path: "/trainess",
        element: <Trainess />,
      },
      {
        path: "/trainess/:id/details",
        path: "/trainess/:id/details",
        element: <DetailsTrainess />,
      },
      {
        path: "/logs/branch",
        element: <BranchLogs />,
      },
      {
        path: "/holdlist",
        element: <HoldList />,
      },
      {
        path: "/refunded",
        element: <Refund />,
      },
      {
        path: "/blacklist",
        element: <BlackList />,
      },
      {
        path: "/setting",
        element: <Settings />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/inbox",
        element: <Inbox />,
      },
      {
        path: "/notification",
        element: <Notification />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "/reset-password",
    element: <Reset />,
  },
]);

export default Router;
