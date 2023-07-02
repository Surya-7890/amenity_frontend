import React,{ createContext } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [userToken, setUserToken] = React.useState(null);

    const login = (id) => {
        setIsLoading(false);
        setUserToken(id);
    }

    const logout = () => {
        setIsLoading(false);
        setUserToken(null)
    }

    return (
        <UserContext.Provider value={{ login, logout, isLoading, setIsLoading, setUserToken, userToken }}>
            {children}
        </UserContext.Provider>
    )
}