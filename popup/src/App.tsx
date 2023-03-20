import React, { useContext } from "react";
import logo from "./logo.svg";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Wallet from "./pages/wallet";
import Create from "./pages/create";
import { WalletContext, WalletProvider } from "./contexts/WalletContext";
import Unlock from "./pages/unlock";
import MyPasswords from "./pages/my-passwords";
import PassDetails from "./pages/my-passwords/pass-details";
import RouteGuard from "./components/RouteGuard";
import { wallet_exist } from "./wallet/wallet";

function App() {
  const wallet_context = useContext(WalletContext);
  const router = createBrowserRouter([
    {
      path: "/wallet",
      element: (
        <RouteGuard
          component={<Wallet />}
          check={() => {
            return !!wallet_context.wallet;
          }}
          redirect="/unlock"
        />
      ),
    },
    {
      path: "/create",
      element: <Create />,
    },
    {
      path: "/unlock",
      element: (
        <RouteGuard
          component={<Unlock />}
          check={wallet_exist}
          redirect="/create"
        />
      ),
    },
    {
      path: "/my-passwords",
      element: (
        <RouteGuard
          component={<MyPasswords />}
          check={wallet_exist}
          redirect="/create"
        />
      ),
    },
    {
      path: "/my-passwords/:id",
      element: <PassDetails />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
