import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
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
  currentPage: string;
  setCurrentPage: (c: any) => void;
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
  currentPage: "",
  setCurrentPage:  () => {},
});

export const SesionProvider = ({ children }: PropsWithChildren) => {
  const [isSessionSuccess, setIsSessionSuccess] = useState(false);
  const [userLogued, setUserLogued] = useState("");
  const [messagesNumber, setMessagesNumber] = useState("");
  const [token, setToken] = useState("");
  const [currentPage, setCurrentPage] = useState("");

  useEffect(()=>{
    validateToken()
    console.log("aquiuiu",userLogued)

  },[currentPage, userLogued])
  
  async function validateToken() {
    const tokenTemp = await AsyncStorage.getItem("auth");
    if(tokenTemp){
      try {

        const responses = await sendMe(tokenTemp);
        if (responses.message === "Unauthenticated.") {
          AsyncStorage.removeItem("auth");
          setIsSessionSuccess(false)
          setToken("")
        }else{
          setToken(tokenTemp)
          setUserLogued(responses.id)
        } 
      } catch (error: unknown) {
        console.log("el errror", error);
        setIsSessionSuccess(false)
        setToken("")
      }
    }else{
      router.replace("/login");
    }


  }
  

  return (
    <SesionContext.Provider value={{ isSessionSuccess, setIsSessionSuccess, userLogued, setUserLogued, messagesNumber, setMessagesNumber, token, setToken, currentPage, setCurrentPage }}>
      {children}
    </SesionContext.Provider>
  );
};
