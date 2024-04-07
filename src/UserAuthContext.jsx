import React, {createContext, useContext, useEffect, useState} from 'react';

const AuthContext = createContext(null);

export function UserAuthContext({children}) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("split-bill:user")));

        // if (user == null) {
        //   console.log("UserAuthContext::no user")
        //   //localStorage.setItem("user", uuid());
    
        // } else {
        //   console.log(userID)
        //   config = genConfig("" + userID);
        // }
        const unsubscribe = () => {
            setUser(JSON.parse(localStorage.getItem("split-bill:user")));
        }

        // return a function that will call unsubscribe
        return () => {
            unsubscribe();
        }
    
    
    }, [])
    
    const register = (uuid, username, avatarSeed) => {
        localStorage.setItem("split-bill:user", JSON.stringify({id:uuid, username: username, avatarSeed: avatarSeed}));
        setUser(JSON.parse(localStorage.getItem("split-bill:user")));
    }


    return (
        <AuthContext.Provider value={{user, register}}> {children} </AuthContext.Provider>
    );
}

export function useAuth(){
    return useContext(AuthContext);
}
