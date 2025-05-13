import {createContext, ReactNode, useEffect, useReducer} from "react";
import TokenSingleton from "@/src/Repository/TokenSingleton";
import LoginRepository from "@/src/Repository/LoginRepository";

interface AuthStoreProps {
    user: User | null,
    dispatch: React.Dispatch<{ action: "login"; value: User | null }>;
}

export const AuthContext = createContext<AuthStoreProps>({
    user: null, dispatch: () => {
    }
});

export default function AuthStore({children}: Readonly<{ children: ReactNode }>) {

    const authReducer = (state, {action, value}) => {
        switch (action) {
            case "login":
                console.log(state);
                return value;
            case "logout":
                return null
            default:
                return state;
        }
    }

    const [user, dispatch] = useReducer(authReducer, null);

    useEffect(() => {
        TokenSingleton.getInstance().getTokenFromStorage().then(() => {
            console.warn(TokenSingleton.getInstance().getToken());
            if (TokenSingleton.getInstance().getToken() !== null) {
                LoginRepository.getInstance().getLoggedUser().then(newUser => {
                    dispatch({action: "login", value: newUser});
                })
            }
        })
    }, []);


    return (
        <AuthContext.Provider value={{user, dispatch}}>
            {children}
        </AuthContext.Provider>
    )

}