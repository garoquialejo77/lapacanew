import { NavHeader } from "@/components/NavHeader";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SesionContext } from "./contexts/sesionProvider";
import { getMessagesDetail, sendAnswer } from "./services/messageService";

type SesionContent = {
  isSessionSuccess: Boolean;
  setIsSessionSuccess: (c: any) => void;
  userLogued: string;
  setUserLogued: (c: any) => void;
  messagesNumber: string;
  setMessagesNumber: (c: any) => void;
  token: string;
};

export default function DetailInboxScreen() {
  const [text, setText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
  const [modalErrorVisible, setModalErrorVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [detailMessages, setDetailMessages] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const {
    id,
    from,
    to,
    user,
    message,
    product,
    answered,
    reaction,
    product_image,
    product_title,
    created_at,
    updated_at,
  } = useLocalSearchParams();

  const {
    isSessionSuccess,
    setIsSessionSuccess,
    userLogued,
    setUserLogued,
    messagesNumber,
    setMessagesNumber,
    token,
  } = useContext(SesionContext) as SesionContent;

  useEffect(() => {
    if (isSessionSuccess) {
      loadDetailMessages();
    } else {
      router.replace("/login");
    }
  }, [isSessionSuccess]);

  function onBack(event: any) {
    router.replace("/inbox");
  }

  const loadDetailMessages = async (pageNumber = 1) => {
    setIsLoading(true);
    try {
      const res = await getMessagesDetail(pageNumber, id.toString(), token);
      if (pageNumber === 1) {
        setDetailMessages(res.data);
      } else {
        setDetailMessages((prev) => [...prev, ...res.data]);
      }

      setPage(res.current_page);
      setLastPage(res.last_page);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  async function toogleModal(typeModal: String) {
    if (typeModal === "form") {
      setModalVisible(false);
    }

    if (typeModal === "success") {
      setModalSuccessVisible(false);
    }
  }

  function onChangeText(event: any) {
    setText(event);
  }

  async function onSendMessage() {
    setIsLoading(true);
    if (text.length > 3) {
      try {
        const res = await sendAnswer(id.toString(), text, userLogued, user.toString(), token);
        if (res.conversation_id) {
          setIsLoading(true);
          setModalVisible(false);
          setModalSuccessVisible(true);
        }
      } catch (error) {
        setIsLoading(true);
        setModalVisible(false);
        setModalErrorVisible(true);
      }
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!modalVisible ? (
       <View style={{ flex: 1 }}>
          <NavHeader
            backgroundColor="black"
            colorText="white"
            textTitle={from}
            image={product_image}
            justifyContent="left"
            onBackStepClicked={(step: any) => onBack(step)}
            withRigthIcon
          />
          <View style={styles.content}>
            <View style={styles.containerFrom}>
              <FlatList
                data={detailMessages}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 120 }}
                renderItem={({ item }) => (
                  <View
                    style={
                      userLogued.toString() === item.from
                        ? styles.containerFromMessageOwn
                        : styles.containerFromMessage
                    }
                  >
                    <Text
                      style={
                        userLogued.toString() == item.from
                          ? styles.messageTextOwn
                          : ""
                      }
                    >
                      {item.message}
                    </Text>
                  </View>
                )}
                ListFooterComponent={
                  isLoading ? (
                    <ActivityIndicator style={{ margin: 10 }} />
                  ) : null
                }
                onEndReached={() => {
                  if (page < lastPage) {
                    loadDetailMessages(page + 1);
                  }
                }}
                onEndReachedThreshold={0.5}
              />
            </View>
            <View style={styles.footer}>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => toogleModal("form")}
              >
                <Text style={styles.textbutton}>Enviar Mensaje</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        <View>
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
          >
            <TouchableOpacity style={styles.modalcontainer}>
              <View style={styles.modalcontent}>
                {isLoading ? (
                  <ActivityIndicator style={{ margin: 10 }} />
                ) : (
                  <View>
                    <TextInput
                      editable
                      multiline
                      numberOfLines={4}
                      maxLength={800}
                      onChangeText={(text) => onChangeText(text)}
                      value={text}
                      style={styles.input}
                    />
                    <Pressable
                      style={({ pressed }) => [
                        styles.button,
                        styles.mt_16,
                        pressed && { opacity: 0.8 },
                      ]}
                      onPress={() => onSendMessage()}
                    >
                      <Text style={styles.textbutton}>Enviar Mensaje</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </Modal>
          <Modal
            visible={modalSuccessVisible}
            transparent={true}
            animationType="slide"
          >
            <TouchableOpacity style={styles.modalcontainer}>
              {isLoading ? (
                <ActivityIndicator style={{ margin: 10 }} />
              ) : (
                <View style={styles.modalcontent}>
                  <View>
                    <Text>Mensaje enviado correctamente</Text>
                    <Pressable
                      style={({ pressed }) => [
                        styles.button,
                        styles.mt_16,
                        pressed && { opacity: 0.8 },
                      ]}
                      onPress={() => toogleModal("success")}
                    >
                      <Text style={styles.textbutton}>Aceptar</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </Modal>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  containerHeader: {
    display: "flex",
    flexDirection: "column",
    height: "10%",
  },
  containerMessages: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 16,
  },
  containerLoader: {
    display: "flex",
    justifyContent: "center",
    height: 100,
  },

  containerFrom: {
    flex: 1,
    width: "100%",
  },

  containerFromText: {
    paddingLeft: 16,
  },

  containerFromMessage: {
    display: "flex",
    justifyContent: "flex-start",
    backgroundColor: "#e9e9e980",
    borderRadius: 20,
    padding: 16,
    width: "70%",
    marginTop: 16,
  },
  containerFromMessageOwn: {
    display: "flex",
    justifyContent: "flex-end",
    backgroundColor: "black",
    borderRadius: 20,
    padding: 16,
    width: "70%",
    marginLeft: 100,
    marginTop: 16,
  },
  footer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    left: 0,
    right: 0,
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
  },
  input: {
    height: 200,
    width: "100%",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: "rgb(193 191 191)",
  },
  mt_16: {
    marginTop: 16,
  },
  messageTextOwn: {
    color: "white",
  },
});
