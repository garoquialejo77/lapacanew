import {
  AntDesign,
  FontAwesome,
  FontAwesome6,
  MaterialIcons,
} from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { FormContainerContext } from "../app/contexts/formContainerProvider";
import { cardProductCategories } from "../constants/cardsList";
import { validate } from "../utils/validator";

export type GlobalContent = {
  formData: any[];
  setFormData: (c: any) => void;
};

interface DataNewProduct {
  form: string;
  key: string;
  value: string;
}

export function FormContainerCard({
  keyName,
  visible,
  buttonLabel,
  onButttonClick,
  stepNumber,
  navigationTo,
  title,
  validations,
}: any) {
  const [card, setCard] = useState("");
  const [isValid, setIsValid] = useState(false);
  const { formData, setFormData } = useContext(
    FormContainerContext
  ) as GlobalContent;

  useEffect(() => {
    isValidate({ form: "newProduct", key: `images`, value: card });
  }, [card]);

  function onClickCard(event: any) {
    setCard(event);
  }

  function isValidate(data: DataNewProduct) {
    if (validations?.validations) {
      setIsValid(validate(data, validations.validations));
    }
  }

  function onClickButton() {
    const formDataTemp = formData.filter((data) => data.key != keyName);
    setFormData([
      ...formDataTemp,
      { form: "newProduct", key: keyName, value: card },
    ]);
    navigationTo === "next"
      ? onButttonClick(stepNumber + 1)
      : onButttonClick("submit");
  }

  function getContainerCard(color: string, id: string): ViewStyle {
    return {
      borderRadius: 10,
      backgroundColor: color,
      borderWidth: id === card ? 4 : 2,
      borderColor:
        id === card ? "rgba(33, 150, 243, 1.00)" : "rgb(225, 232, 238)",
    };
  }

  return (
    <View style={visible ? styles.container : styles.novisible}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.containercards}>
          {cardProductCategories.map((category, index) => (
            <Pressable
              style={styles.card}
              onPress={() => onClickCard(category.id)}
              key={index}
            >
              <View
                style={[
                  styles.cardContainer,
                  getContainerCard(category.backgroundColor, category.id),
                ]}
              >
                <Text style={styles.cardTitle}>{category.title}</Text>

                <View style={styles.containerImage}>
                  {category.library === "FontAwesome" && (
                    <FontAwesome
                      name={category.image}
                      size={40}
                      color={category.iconColor}
                    />
                  )}
                  {category.library === "FontAwesome6" && (
                    <FontAwesome6
                      name={category.image}
                      size={40}
                      color={category.iconColor}
                    />
                  )}
                  {category.library === "MaterialIcons" && (
                    <MaterialIcons
                      name={category.image}
                      size={40}
                      color={category.iconColor}
                    />
                  )}
                  {category.library === "AntDesign" && (
                    <AntDesign
                      name={category.image}
                      size={40}
                      color={category.iconColor}
                    />
                  )}
                </View>
              </View>
            </Pressable>
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
  cardContainer: {
    padding: 16,
    margin: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",

    // sombra
    elevation: 4, // Android
    shadowColor: "#000", // iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  cardTitle: {
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 64,
    width: "100%",
  },
  content: {
    display: "flex",
    justifyContent: "center",
    paddingBottom: 32,
  },
  title: {
    color: "black",
    display: "flex",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  containercards: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    flexDirection: "row",
  },
  containerImage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "48%",
  },
  image: {
    width: 50,
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
  imagetypecontainer: {
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
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
    color: "rgba(33, 150, 243, 1.00)",
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
  cardSelected: {
    borderColor: "rgba(33, 150, 243, 1.00)",
    borderWidth: 2,
  },
  disabledButton: {
    backgroundColor: "#dfdfdf",
  },
});
