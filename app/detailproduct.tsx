import { NavHeader } from "@/components/NavHeader";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { sendMessage } from "./services/messageService";


const { width } = Dimensions.get("window");

const data = [
  { id: "1", title: "Slide 1" },
  { id: "2", title: "Slide 2" },
  { id: "3", title: "Slide 3" },
];

type ImageType = {
  id: string;
  image: string;
};

export default function DetailProductScreen() {
  const [text, setText] = useState("");
  const [modalType, setModalType] = useState("");
  const [modalVisible, setModaVisible] = useState(false);
  const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [index, setIndex] = useState(0);
  const [images, setImages] = useState<ImageType[]>([]);
  const flatListRef = useRef(null);
  const {
    id,
    title,
    description,
    image1,
    image2,
    image3,
    image4,
    price,
    user,
  } = useLocalSearchParams();


  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setIndex(slideIndex);
  };

  useEffect(() => {
    const imagesList = [image1, image2, image3, image4]
      .map((image, index) => ({
        id: index.toString(),
        image,
      }))
      .filter((item) => item.image);
    setImages(imagesList as ImageType[]);
  }, []);

  function onBack(event: any) {
    router.replace("/");
  }

  async function toogleModal(isSubmit: Boolean) {
    console.log("es submitt", isSubmit);
    if (isSubmit && text.length > 3 && !isLoading) {
      setIsLoading(true)
      console.log("enviar mensaje", text);
      console.log("el id", id)
      try {
        const res = await sendMessage(text, user, "2", id.toString());
        console.log("el ressss", res)
        setModalSuccessVisible(true)
        setIsLoading(false)
        
      } catch (error) {
        console.error(error);
        setIsLoading(false)
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
            
            <TouchableOpacity style={styles.modalcontainer}   >
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
          textTitle="Detalle de la Paca"
          justifyContent="left"
          onBackStepClicked={(step: any) => onBack(step)}
          withRigthIcon
        />
        <View>
          <FlatList
            ref={flatListRef}
            data={images}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image
                  style={{ height: "100%", width: "100%" }}
                  source={{
                    uri: `${process.env.EXPO_PUBLIC_HOST}/storage/uploads/${item.image}`,
                  }}
                />
              </View>
            )}
          />

          {/* Indicadores */}
          <View style={styles.dots}>
            {images.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, { opacity: i === index ? 1 : 0.3 }]}
              />
            ))}
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.price}>{price}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => toogleModal(false)}
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
  },
  card: {
    width,
    height: 350,
    justifyContent: "center",
    alignItems: "center",
    padding:16
  },
  text: { fontSize: 22, color: "#fff" },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#333",
    marginHorizontal: 5,
  },
  title: {
    fontFamily: "sans-serif",
    fontWeight: "bold",
    fontSize: 20,
    color: "black",
    textAlign: "left",
    marginBottom: 12,
  },
  price: {
    fontFamily: "sans-serif",
    fontWeight: "medium",
    fontSize: 18,
    color: "black",
    textAlign: "left",
    marginBottom: 16,
  },
  description: {
    fontFamily: "sans-serif",
    fontWeight: "regular",
    fontSize: 18,
    color: "#666666",
    textAlign: "left",
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
  footer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
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
});
