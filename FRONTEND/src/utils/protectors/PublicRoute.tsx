import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
    element: JSX.Element;
}

export const PublicRoute = ({ element }: PublicRouteProps) => {
    const session = localStorage.getItem("user");

    if (session) return <Navigate to="/articleFeed" />;

    return element;
};