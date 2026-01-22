import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState
} from "react";
import { sendMe } from "../services/authService";

export type SesionContent = {
  isSessionSuccess: Boolean;
  setIsSessionSuccess: (c: any) => void;
  user: string;
  setUser: (c: any) => void;
  messagesNumber: string;
  setMessagesNumber: (c: any) => void;
  token: string;
  setToken: (c: any) => void;
};

export const SesionContext = createContext<SesionContent | null>({
  isSessionSuccess: false,
  setIsSessionSuccess: () => {},
  user: "",
  setUser:  () => {},
  messagesNumber: "",
  setMessagesNumber:  () => {},
  token: "",
  setToken:  () => {},
});

export const SesionProvider = ({ children }: PropsWithChildren) => {
  const [isSessionSuccess, setIsSessionSuccess] = useState(false);
  const [user, setUser] = useState("");
  const [messagesNumber, setMessagesNumber] = useState("");
  const [token, setToken] = useState("");

  useEffect(()=>{
    validateToken()
  },[])
  
  async function validateToken() {
    const tokenTemp = await AsyncStorage.getItem("auth");
    if(tokenTemp){
      try {

        const responses = await sendMe(tokenTemp);
        if (responses.message === "Unauthenticated.") {
          AsyncStorage.removeItem("auth");
          setIsSessionSuccess(false)
          setToken("")
        } else {
          setIsSessionSuccess(true)
          setToken(tokenTemp)
        }
      } catch (error: unknown) {
        console.log("el errror", error);
        setIsSessionSuccess(false)
        setToken("")
      }
    }


  }
  

  return (
    <SesionContext.Provider value={{ isSessionSuccess, setIsSessionSuccess, user, setUser, messagesNumber, setMessagesNumber, token, setToken }}>
      {children}
    </SesionContext.Provider>
  );
};
