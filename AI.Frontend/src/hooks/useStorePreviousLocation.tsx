import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useStorePreviousLocation() {
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("previousLocation", location.pathname);
  }, [location]);
}