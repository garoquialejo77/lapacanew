import React, {
  PropsWithChildren,
  createContext,
  useState
} from "react";

export type SesionContent = {
  isSessionSuccess: Boolean;
  setIsSessionSuccess: (c: any) => void;
  user: string;
  setUser: (c: any) => void;
  messagesNumber: string;
  setMessagesNumber: (c: any) => void;
};

export const SesionContext = createContext<SesionContent | null>({
  isSessionSuccess: false,
  setIsSessionSuccess: () => {},
  user: "",
  setUser:  () => {},
  messagesNumber: "",
  setMessagesNumber:  () => {},
});

export const SesionProvider = ({ children }: PropsWithChildren) => {
  const [isSessionSuccess, setIsSessionSuccess] = useState(false);
  const [user, setUser] = useState("");
  const [messagesNumber, setMessagesNumber] = useState("");


  return (
    <SesionContext.Provider value={{ isSessionSuccess, setIsSessionSuccess, user, setUser, messagesNumber, setMessagesNumber }}>
      {children}
    </SesionContext.Provider>
  );
};
