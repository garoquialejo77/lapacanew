import { FormContainerContext } from "@/app/contexts/formContainerProvider";
import { validate } from "@/utils/validator";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { useContext, useEffect, useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";

export type GlobalContent = {
  formData: any[];
  setFormData: (c: any) => void;
};

interface DataNewProduct {
  form: any[];
  key: string;
  value: string[];
}

export function FormContainerPhoto({
  visible,
  buttonLabel,
  onButttonClick,
  stepNumber,
  navigationTo,
  title,
  validations,
}: any) {
  const [modalVisible, setModaVisible] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [imagesListUri, setImagesListUri] = useState<any[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const { formData, setFormData } = useContext(
    FormContainerContext
  ) as GlobalContent;

  const renderMiniImages = [0, 1, 2, 3];

  useEffect(() => {
    isValidate({ form: "newProduct", key: `images`, value: images });
  }, [images]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      aspect: [4, 3],
      base64: false,
      quality: 1,
    });
    upadteImages(result);
    toogleModal();
  };

  const pickPhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      quality: 1,
    });
    upadteImages(result);
    toogleModal();
  };

  function toogleModal() {
    setModaVisible(!modalVisible);
  }

  function onSelectImage(imageId: number) {
    setCurrentImage(imageId);
    if (!images[imageId]?.uri) {
      setModaVisible(true);
    }
  }

  function isValidate(data: DataNewProduct) {
    if (validations?.validations) {
      setIsValid(validate(data, validations.validations));
    }
  }

  async function upadteImages(result: any) {
    let nameFile = `${Number(new Date())}${Math.floor(
      Math.random() * 100000000
    ).toString()}`;
    const imageListTemp = [...images];
    const imagesListUriTemp = [...imagesListUri];
    if (result.assets) {
      const response = await fetch(result?.assets[0].uri);
      const blob = await response.blob();
      const type = blob.type.split("/")[1];
      const file = new File([blob], `${nameFile}.${type}`, { type: blob.type });

      imageListTemp[currentImage] = { file: file, uri: result.assets[0].uri };
      imagesListUriTemp[currentImage] = result.assets[0].uri;
      setImages(imageListTemp);
      setImagesListUri(imagesListUriTemp);
    }
  }

  function onClickButton() {
    navigationTo === "next"
      ? onButttonClick(stepNumber + 1)
      : onButttonClick("submit");
    const formDataTemp = formData.filter((data) => data.key != "images");
    setFormData([
      ...formDataTemp,
      { form: "newProduct", key: `images`, value: images },
    ]);
  }

  return (
    <View style={visible ? styles.container : styles.novisible}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.addcamercontainer}>
          {!images[currentImage] ? (
            <Pressable onPress={toogleModal}>
              <MaterialIcons
                name="add-a-photo"
                size={140}
                style={styles.addcamera}
                color="black"
              />
            </Pressable>
          ) : (
            <Pressable onPress={toogleModal}>
              <Image
                source={{ uri: imagesListUri[currentImage] }}
                style={styles.image}
              />
            </Pressable>
          )}
        </View>
        <View>
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalcontainer}>
              <View style={styles.modalcontent}>
                <View>
                  <Text style={styles.titleText}>Imagen del Producto</Text>
                </View>
                <View style={styles.buttonscontainer}>
                  <Pressable
                    style={styles.imagetypecontainer}
                    onPress={pickPhoto}
                  >
                    <Ionicons name="camera" size={32} color="#FFC300" />
                  </Pressable>
                  <Pressable
                    style={styles.imagetypecontainer}
                    onPress={pickImage}
                  >
                    <Ionicons name="images" size={32} color="#FFC300" />
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>

        <View style={styles.containerminis}>
          {renderMiniImages.map((img, index) => (
            <View style={styles.mini} key={index}>
              <Pressable onPress={() => onSelectImage(index)}>
                {images[index] ? (
                  <Image
                    source={{ uri: imagesListUri[index] }}
                    style={styles.imageMini}
                  />
                ) : (
                  <MaterialIcons
                    name="add-a-photo"
                    size={60}
                    style={styles.addcamera}
                    color="black"
                  />
                )}
              </Pressable>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.footer}>
        <Pressable
          style={
            !isValid
              ? [styles.button, styles.disabledButton]
              : ({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]
          }
          onPress={() => {
            onClickButton();
          }}
          disabled={!isValid}
        >
          <Text style={styles.textbutton}>{buttonLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9F9F9",
  },
  content: {
    paddingBottom: 32,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "black",
    display: "flex",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
  },
  modalcontainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalcontent: {
    display: "flex",
    height: "25%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  imagetypecontainer: {
    borderRadius: 10,
    backgroundColor: "#F9F9F9",
    padding: 16,
  },
  buttonscontainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    marginBottom: 16,
  },
  addcamercontainer: {
    display: "flex",
    justifyContent: "center",
    height: "70%",
    alignItems: "center",
  },
  addcamera: {
    color: "#B0B0B0",
  },
  containerminis: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "20%",
    marginBottom: 64,
    padding: 16,
    justifyContent: "space-around",
  },
  mini: {
    display: "flex",
    height: "100%",
    width: "25%",
  },
  imageMini: {
    width: 60,
    height: 60,
  },
  novisible: {
    display: "none",
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
  disabledButton: {
    backgroundColor: "#dfdfdf",
  },
});
