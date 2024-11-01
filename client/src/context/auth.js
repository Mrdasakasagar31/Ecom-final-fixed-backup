// =======
// >>>>>>> 99041aa28e8beb0f65f6285d0d6536fef8d9a7f0

import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: ""
    });

    // Set default axios base URL and headers
    axios.defaults.baseURL = 'https://ecom-final-fixed-backup.onrender.com';
    axios.defaults.headers.common['Authorization'] = auth?.token;

    useEffect(() => {
        const data = localStorage.getItem("auth");
        if (data) {
            const parseData = JSON.parse(data);
            setAuth({
                ...auth,
                user: parseData.user,
                token: parseData.token,
            });
        }

        // eslint-disable-next-line
    }, []);

    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };

