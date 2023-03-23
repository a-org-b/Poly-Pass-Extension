import React, { useContext, useEffect } from "react";
import "./App.css";
import {
  createBrowserRouter,
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
  createRoutesFromElements,
  RouterProvider,
  createMemoryRouter,
  createHashRouter,
} from "react-router-dom";
import Wallet from "./pages/wallet";
import Create from "./pages/create";
import { WalletContext } from "./contexts/WalletContext";
import Unlock from "./pages/unlock";
import MyPasswords from "./pages/my-passwords";
import PassDetails from "./pages/my-passwords/pass-details";
import { GetPasswords, Message, MessageKey } from "./types";
import { usePolyBase } from "./hooks/usePolyBase";
import Records from "./pages/records";
function App() {
  const { get_passwords } = usePolyBase();
  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route path="/records" element={<Records />} />,
      <Route path="/" element={<Navigate to="/wallet" />} />,
      <Route path="/my-passwords" element={<MyPasswords />} />,
      <Route path="/create" element={<Create />} />,
      <Route path="/wallet" element={<Wallet />} />,
      <Route path="/unlock" element={<Unlock />} />,
      <Route path="/my-passwords/:id" element={<PassDetails />} />,
    ])
  );

  return <RouterProvider router={router} />;
}

export default App;
