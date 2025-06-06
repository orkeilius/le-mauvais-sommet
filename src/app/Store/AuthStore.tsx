import {createContext, ReactNode, useEffect, useMemo, useReducer} from "react";
import TokenSingleton from "@/src/Repository/TokenSingleton";
import LoginRepository from "@/src/Repository/LoginRepository";
import User from "@/src/model/User";

interface AuthStoreProps {
    user: User | null,

    isLoading: boolean,
    dispatch: React.Dispatch<{ action: "login" | "logout" | "setLoading"; value: User | null | boolean }>;

}

export const AuthContext = createContext<AuthStoreProps>({
    user: null, 
    isLoading: true,
    dispatch: () => {
    }
});

export default function AuthStore({children}: Readonly<{ children: ReactNode }>) {

    const authReducer = (state: any, {action, value}: { action: string; value: any }) => {
        switch (action) {
            case "login":
                return { ...state, user: value, isLoading: false };
            case "logout":
                return { ...state, user: null, isLoading: false };
            case "setLoading":
                return { ...state, isLoading: value };
            default:
                return state;
        }
    }

    const [authState, dispatch] = useReducer(authReducer, { user: null, isLoading: true });

    useEffect(() => {
        TokenSingleton.getInstance().getTokenFromStorage().then(() => {
            if (TokenSingleton.getInstance().getToken() !== null) {
                LoginRepository.getInstance().getLoggedUser().then(newUser => {
                    dispatch({action: "login", value: newUser});
                })
            } else {
                dispatch({action: "setLoading", value: false});
            }
        })
    }, []);

    const contextValue = useMemo(() : AuthStoreProps => ({
        user: authState.user,
        isLoading: authState.isLoading,
        dispatch
    }), [authState])
    
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )

}