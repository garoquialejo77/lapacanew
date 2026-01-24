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
  userLogued: string;
  setUserLogued: (c: any) => void;
  messagesNumber: string;
  setMessagesNumber: (c: any) => void;
  token: string;
  setToken: (c: any) => void;
};

export const SesionContext = createContext<SesionContent | null>({
  isSessionSuccess: false,
  setIsSessionSuccess: () => {},
  userLogued: "",
  setUserLogued:  () => {},
  messagesNumber: "",
  setMessagesNumber:  () => {},
  token: "",
  setToken:  () => {},
});

export const SesionProvider = ({ children }: PropsWithChildren) => {
  const [isSessionSuccess, setIsSessionSuccess] = useState(false);
  const [userLogued, setUserLogued] = useState("");
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
          setUserLogued(responses.id)
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
    <SesionContext.Provider value={{ isSessionSuccess, setIsSessionSuccess, userLogued, setUserLogued, messagesNumber, setMessagesNumber, token, setToken }}>
      {children}
    </SesionContext.Provider>
  );
};
