import React, {
    createContext,
    ReactNode,
    useState,
    useEffect,
} from "react";
import { appPreferences } from "../utils";

interface AuthContextProps {
    isAuthenticated: boolean;
    userDetails: any;
    userToken: string;
    login: () => void;
    logout: () => void;
    setUserDetailsToContext: (userDetails: any) => void;
    setUserTokenToContext: (userToken: string) => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userDetails, setUserDetails] = useState<any>(null);
    const [userToken, setUserToken] = useState<any>(null);

    const login = async () => {
        setIsAuthenticated(true);
    };

    const logout = async () => {
        setIsAuthenticated(false);
        setUserDetails(null);
        setUserToken(null);
        await appPreferences.clearItems();
    };

    const setUserDetailsToContext = async (userDetails: any) => {
        setUserDetails(userDetails);
        await appPreferences.setItem("userDetails", JSON.stringify(userDetails));
    };

    const setUserTokenToContext = async (userToken: string) => {
        setUserToken(userToken);
        await appPreferences.setItem("userToken", userToken);
    }

    useEffect(() => {
        (async () => {
            const storedToken = await appPreferences.getItem("userToken");
            const storedUserDetails = await appPreferences.getItem(
                "userDetails"
            );

            setIsAuthenticated(() => {
                return storedToken ? true : false;
            });
            setUserToken(storedToken);
            setUserDetails(() => {
                return storedUserDetails ? JSON.parse(storedUserDetails) : null;
            });
        })();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                userDetails,
                userToken,
                login,
                logout,
                setUserDetailsToContext,
                setUserTokenToContext
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};