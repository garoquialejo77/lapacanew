import { validationsLogin } from "@/constants/validations";
import { validate } from "@/utils/validator";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SesionContext } from "./contexts/sesionProvider";
import { sendLogin, sendMe } from "./services/authService";

type SesionContent = {
  isSessionSuccess: Boolean;
  setIsSessionSuccess: (c: any) => void;
  userLogued: string;
  setUserLogued: (c: any) => void;
  messagesNumber: string;
  setMessagesNumber: (c: any) => void;
  setToken: (c: any) => void;
};

export default function LoginScreen() {
  const [modalLoginVisible, setModalLoginVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoginValidated, setIsLoginValidated] = useState(false);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  const router = useRouter();

  const {
    isSessionSuccess,
    setIsSessionSuccess,
    userLogued,
    setUserLogued,
    messagesNumber,
    setMessagesNumber,
    setToken
  } = useContext(SesionContext) as SesionContent;

  useEffect(() => {
    onValidateForm();
    console.log("logueado", userLogued)
  }, [email, password, userLogued]);

  function onChangeEmail(event: any) {
    setEmail(event);
  }

  function onChangePassword(event: any) {
    setPassword(event);
  }

  async function toogleModal() {
    setModalVisible(!modalVisible);
  }

  function onLogin() {
    setModalVisible(false);
    setModalLoginVisible(true);
  }

  function onCancel() {
    setModalLoginVisible(false);
  }

  async function onSendLogin() {
    setIsLoadingLogin(true);
    setModalLoginVisible(false);
    try {
      const res = await sendLogin(email, password);
      setIsLoadingLogin(false);
      setModalLoginVisible(false);
     
      if (res?.access_token) {
        await AsyncStorage.setItem('auth', res.access_token);
        setIsSessionSuccess(true);
        setToken(res.access_token)
        const responses = await sendMe(res.access_token);
        console.log("responseeesssss",responses)
        setUserLogued(responses.id)
        router.replace("/"); 
      }else{
        setModalLoginVisible(true);
      }
    } catch (error) {
      setModalLoginVisible(true);
    }
  }

  function onValidateForm() {
    let validated = true;
    const data = [{ value: email }, { value: password }];
    data.forEach((key, index) => {
      validated =
        validated && validate(key, validationsLogin[index].validations);
    });

    setIsLoginValidated(validated);
  }

  return (
    <View style={styles.container}>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <TouchableOpacity style={styles.modalcontainer}>
          <View style={styles.modalcontent}>
            <View>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.mt_16,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={onLogin}
              >
                <Text style={styles.textbutton}>Ingresar</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.mt_16,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={onSendLogin}
              >
                <Text style={styles.textbutton}>Regitrarse</Text>
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {isLoadingLogin ? (
              <ActivityIndicator size="large" />
            ) :<Modal
        visible={modalLoginVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalcontainer}>
          <View style={styles.modalcontent}>
            {isLoadingLogin ? (
              <ActivityIndicator size="large" />
            ) : (
              <View>
                <View>
                  <Text style={styles.titleRegisterText}>Ingresar</Text>
                </View>
                <TextInput
                  placeholder="Escribe tu correo electronico"
                  style={email ? styles.inputRegister : styles.placeHolder}
                  onChangeText={onChangeEmail}
                  value={email}
                ></TextInput>

                <TextInput
                  placeholder="Password"
                  style={password ? styles.inputRegister : styles.placeHolder}
                  onChangeText={onChangePassword}
                  value={password}
                ></TextInput>

                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    styles.mt_16,
                    isLoginValidated ? styles.button : styles.disabledButton,
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={onSendLogin}
                >
                  <Text style={styles.textbutton}>Enviar</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    styles.mt_16,
                    styles.cancel,
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={onCancel}
                >
                  <Text style={styles.textbutton}>Cancelar</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  input: {
    height: 40,
    width: "80%",
    marginLeft: 8,
    outline: "none",
  },
  containerInput: {
    display: "flex",
    borderWidth: 1,
    borderRadius: 10,
    margin: 16,
    borderColor: "black",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  mt_16: {
    marginTop: 16,
  },
  button: {
    marginBottom: 16,
    backgroundColor: "#FFC300",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 16,
    borderRadius: 20,
    paddingBottom: 16,
  },
  cancel: {
    backgroundColor: "#000000",
  },
  textbutton: {
    color: "white",
  },
  modalcontainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalcontent: {
    display: "flex",
    width: "80%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    justifyContent: "center",
  },
  inputRegister: {
    height: 60,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "90%",
    borderRadius: 10,
    borderColor: "rgba(33, 150, 243, 1.00)",
  },
  titleRegisterText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  placeHolder: {
    height: 60,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "90%",
    borderRadius: 10,
    borderColor: "rgba(33, 150, 243, 1.00)",
    color: "gray",
    fontSize: 10,
  },
  disabledButton: {
    backgroundColor: "#dfdfdf",
  },
});
