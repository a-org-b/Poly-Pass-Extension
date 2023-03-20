import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RouteGuard: React.FC<{
  component: JSX.Element;
  check: () => boolean;
  redirect: string;
}> = (p) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!p.check()) navigate(p.redirect);
  }, []);
  return <>{p.component}</>;
};

export default RouteGuard;
