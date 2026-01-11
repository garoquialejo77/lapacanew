import { View, StyleSheet, TextInput, Text, Pressable } from "react-native";
import { useEffect, useState, useContext } from "react";
import { validate } from "@/utils/validator";
import { FormContainerContext } from "@/app/contexts/formContainerProvider";

export type GlobalContent = {
  formData: any[]
  setFormData:(c: any) => void
}

interface DataNewProduct {
  form: string;
  key: string;
  value: string;
}

export function FormContainerInputText({
  keyName,
  visible,
  label,
  buttonLabel,
  onButttonClick,
  stepNumber,
  navigationTo,
  validations,
}: any) {
  const [text, setText] = useState("");
  const [isValid, setIsValid] = useState(false);
  const {formData, setFormData} = useContext(FormContainerContext) as GlobalContent


  useEffect(() => {
    isValidate({ form: "newProduct", key: keyName, value: text });
  }, [text]);

  function onChangeText(event: any) {
    setText(event);
  }

  function isValidate(data: DataNewProduct) {
    if (validations?.validations) {
      setIsValid(validate(data, validations.validations));
    }
  }

  function onClickButton() {
    const formDataTemp = formData.filter(data => data.key != keyName)
    setFormData([...formDataTemp, { form: "newProduct", key: keyName, value: text }])
    navigationTo === "next"
      ? onButttonClick(stepNumber + 1)
      : onButttonClick("submit");
  }

  return (
    <View style={visible ? styles.container : styles.novisible}>
      <View>
        <Text style={styles.titleText}>{label}</Text>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      ></TextInput>
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
  },
  input: {
    height: 60,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width:"90%",
    borderRadius: 10,
    borderColor: "rgba(33, 150, 243, 1.00)",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
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
