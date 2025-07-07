import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    element: JSX.Element;
}

export const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
    const session = localStorage.getItem("user");

    if (!session) return <Navigate to="/login" />;

    return element;
};