import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/Layout";
import { lazy } from "react";

/*
If you want to read about the changes, here is some background material:
https://reactrouter.com/en/6.28.0/upgrading/future#update-to-latest-v6x
https://reactrouter.com/en/main/route/hydrate-fallback-element
*/

const Room = lazy(() => import("../pages/Room/Room"));
const Rooms = lazy(() => import("../pages/Rooms/Rooms"));
const SignUp = lazy(() => import("../pages/SignUp/SignUp"));

const HydrateFallback = () => {
  return <div>Loading...</div>;
};

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Rooms />,
          hydrateFallbackElement: <HydrateFallback />,
        },
        {
          path: "/rooms/:id",
          element: <Room />,
          hydrateFallbackElement: <HydrateFallback />,
        },
      ],
    },
    {
      path: "/signup",
      element: <SignUp />,
      hydrateFallbackElement: <HydrateFallback />,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);
