import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Wallet from "./pages/wallet";
import Create from "./pages/create";
import { WalletProvider } from "./contexts/WalletContext";
import Unlock from "./pages/unlock";
import MyPasswords from "./pages/my-passwords";

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
]);

function App() {
  return (
    <WalletProvider>
      <RouterProvider router={router} />
    </WalletProvider>
  );
}

export default App;
