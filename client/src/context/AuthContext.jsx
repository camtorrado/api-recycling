import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest, verifyTokenRequet } from "../api/auth.js";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    const signup = async (user) => {
        try {
            const res = await registerRequest(user);
            console.log(res.data);
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            setErrors([error.response.data.message]);
            console.log(error.response.status);
            console.log(error.toJSON());
        }
    };

    const signin = async (user) => {
        try {
            const res = await loginRequest(user);
            console.log(res);
            setIsAuthenticated(true);
            setUser(res.data);
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
             setErrors([error.response.data.message]);
            
        }
    };

    const logout = () => {
        Cookies.remove("token");
        setIsAuthenticated(false);
        setUser(null);
    };

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    const checkLogin = async () => {
        const cookies = Cookies.get();

        if (!cookies.token) {
            setIsAuthenticated(false);
            setLoading(false);
            return setUser(null);
        }

        try {
            const res = await verifyTokenRequet(cookies.token);
            if (!res.data) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            setIsAuthenticated(true);
            setUser(res.data);
            setLoading(false);
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);
        }
    };

    useEffect(() => {
        checkLogin();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                signup,
                signin,
                logout,
                user,
                isAuthenticated,
                errors,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};