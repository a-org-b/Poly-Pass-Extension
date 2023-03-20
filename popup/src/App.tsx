import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Wallet from "./pages/wallet";
import Create from "./pages/create";
import { WalletProvider } from "./contexts/WalletContext";
import Unlock from "./pages/unlock";
import MyPasswords from "./pages/my-passwords";
import PassDetails from "./pages/my-passwords/pass-details";

const router = createBrowserRouter([
  {
    path: "/wallet",
    element: <Wallet />,
  },
  {
    path: "/create",
    element: <Create />,
  },
  {
    path: "/unlock",
    element: <Unlock />,
  },
  {
    path: "/my-passwords",
    element: <MyPasswords />,
  },
  {
    path: "/my-passwords/:id",
    element: <PassDetails />,
  },
]);

function App() {
  return (
    <WalletProvider>
      <RouterProvider router={router} />
    </WalletProvider>
  );
}

export default App;
