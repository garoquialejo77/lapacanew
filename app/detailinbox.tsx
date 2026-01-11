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
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SesionContext } from "./contexts/sesionProvider";
import { getMessagesDetail, sendAnswer } from "./services/messageService";

type SesionContent = {
  user: string;
  setUser: (c: any) => void;
};

export default function DetailInboxScreen() {
  const [text, setText] = useState("");
  const [modalVisible, setModaVisible] = useState(false);
  const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [detailMessages, setDetailMessages] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const { user, setUser } = useContext(SesionContext) as SesionContent;
  const {
    id,
    from,
    to,
    message,
    product,
    answered,
    reaction,
    product_image,
    product_title,
    created_at,
    updated_at,
  } = useLocalSearchParams();

  useEffect(() => {
    loadDetailMessages();
  }, []);

  function onBack(event: any) {
    router.replace("/inbox");
  }

  const loadDetailMessages = async (pageNumber = 1) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await getMessagesDetail(1, id.toString());
      if (pageNumber === 1) {
        setDetailMessages(res.data);
      } else {
        setDetailMessages((prev) => [...prev, ...res.data]);
      }

      setPage(res.current_page);
      setLastPage(res.last_page);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  async function toogleModal(isSubmit: Boolean) {
    console.log("aqui")
    if (isSubmit && text.length > 3 && !isLoading) {
      setIsLoading(true);
      try {
        const res = await sendAnswer(id.toString(), text, from, to);
        setModalSuccessVisible(true);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }
    setModaVisible(!modalVisible);
  }

  function onChangeText(event: any) {
    setText(event);
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View>
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
          >
            <TouchableOpacity style={styles.modalcontainer} >
              <View style={styles.modalcontent}>
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
                    onPress={() => toogleModal(true)}
                  >
                    <Text style={styles.textbutton}>Enviar Mensaje</Text>
                  </Pressable>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
          <Modal
            visible={modalSuccessVisible}
            transparent={true}
            animationType="slide"
          >
            <TouchableOpacity style={styles.modalcontainer}>
              <View style={styles.modalcontent}>
                <View>
                  <Text>Mensaje enviado correctamente</Text>
                  <Pressable
                    style={({ pressed }) => [
                      styles.button,
                      styles.mt_16,
                      pressed && { opacity: 0.8 },
                    ]}
                    onPress={() => setModalSuccessVisible(false)}
                  >
                    <Text style={styles.textbutton}>Aceptar</Text>
                  </Pressable>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
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

          <View style={styles.containerMessages}></View>
          <View style={styles.containerFrom}>

            <FlatList
              data={detailMessages}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View
                  style={
                    user.toString() === item.from
                      ? styles.containerFromMessageOwn
                      : styles.containerFromMessage
                  }
                >
                  <Text style={user.toString() == item.from ? styles.messageTextOwn: ''}>{item.message}</Text>
                </View>
              )}
              ListFooterComponent={
                loading ? <ActivityIndicator style={{ margin: 10 }} /> : null
              }
              onEndReached={() => {
                if (page < lastPage) {
                  loadDetailMessages(page + 1);
                }
              }}
              onEndReachedThreshold={0.5}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => toogleModal()}
          >
            <Text style={styles.textbutton}>Enviar Mensaje</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    height: "100%",
    width: "100%",
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

  containerFrom: {
    display: "flex",
    flexDirection: "column",
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
    padding: 16,
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
  messageTextOwn:{
    color: "white"
  }
});
