import { createBrowserRouter } from "react-router-dom";
import Auth from "../pages/Auth";
import Home from "../pages/Home";
import Level from "../pages/Level";
import Test from "../pages/Test";
import MainLayout from "../layout/MainLayout";
import { checkAuthLoader, checkEnglishLevelLoader } from "../utils/auth";
import Dictionary from "../pages/Dictionary";

export const router = createBrowserRouter([
  {
    path: "/",
    loader: checkEnglishLevelLoader,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/dictionary",
        element: <MainLayout />,
        children: [{ index: true, element: <Dictionary /> }],
      },
      {
        path: "/test",
        element: <MainLayout />,
        children: [{ index: true, element: <Test /> }],
      },
      {
        path: "/writing",
        element: <MainLayout />,
        children: [{ index: true, element: <Test /> }],
      },
      {
        path: "/chat",
        element: <MainLayout />,
        children: [{ index: true, element: <Test /> }],
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/level",
    element: <Level />,
    loader: checkAuthLoader,
  },
]);
