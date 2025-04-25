import {createContext, ReactNode, useReducer} from "react";

interface AuthStoreProps {
    user: User | null,
    dispatch : React.Dispatch<{ action: "login"; value: User | null  }>;
}

export const AuthContext = createContext<AuthStoreProps>({user:null,dispatch:()=>{}});

export default function AuthStore({children}: { children: ReactNode }){

    const authReducer = (state,{action,value}) => {
        switch (action) {
            case "login":
                return state.set("user", value);
            default:
                return state;
        }
    }

    const [user,dispatch] = useReducer(authReducer,null);

    return (
        <AuthContext.Provider value={{user,dispatch}}>
            {children}
        </AuthContext.Provider>
    )

}