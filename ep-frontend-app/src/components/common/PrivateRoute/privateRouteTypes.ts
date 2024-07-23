import { RouterProps } from "react-router-dom";

export interface PrivateRouteProps extends RouterProps {
    element: React.ReactElement;
}