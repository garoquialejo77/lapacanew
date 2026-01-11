import { View } from "react-native";
import { FormContainerPhoto } from "./FormContainerPhoto";
import { StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { FormContainerInputText } from "./FormContainerInputText";
import { FormContainerInputArea } from "./FormContainerInputArea";
import { NavHeader } from "./NavHeader";
import { router } from "expo-router";
import { FormContainerCard } from "./FormContainerCard";

export type GlobalContent = {
  formData: any;
  setFormData: (c: any) => void;
};
export function FormContainerStep({
  onClickNext,
  onClickSubmit,
  titleHeader,
  validations,
}: any) {
  const [currentStep, setCurrentStep] = useState<any>(1);

  useEffect(() => {
    if (currentStep >= 1) {
    } else {
      router.replace("/");
    }
  }, [currentStep]);

  function onBackStep(event: any) {
    setCurrentStep(currentStep - 1);
  }

  function onNextStep(event: any) {
    if (event === "submit") {
      onSubmit();
    } else {
      setCurrentStep(currentStep + 1);
      onClickNext(event);
    }
  }

  function onSubmit() {
    onClickSubmit();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <NavHeader
          textTitle={titleHeader}
          onBackStepClicked={(step: any) => onBackStep(step)}
          withRigthIcon
        ></NavHeader>
      </View>
      <View style={styles.content}>
        <FormContainerPhoto
          keyName="images"
          visible={currentStep === 1}
          buttonLabel="Siguiente"
          stepNumber={1}
          navigationTo="next"
          onButttonClick={(event: any) => onNextStep(event)}
          title="Selecciona las imagenes"
          validations={validations}
        ></FormContainerPhoto>

        <FormContainerCard
          keyName="category"
          visible={currentStep === 2}
          buttonLabel="Siguiente"
          onButttonClick={(event: any) => onNextStep(event)}
          stepNumber={2}
          navigationTo="next"
          title="Selecciona la categoria"
          validations={validations}
        ></FormContainerCard>

        <FormContainerInputText
          keyName="title"
          visible={currentStep === 3}
          label="Titulo del producto"
          buttonLabel="Siguiente"
          onButttonClick={(event: any) => onNextStep(event)}
          stepNumber={3}
          navigationTo="next"
          validations={validations}
        ></FormContainerInputText>

        <FormContainerInputArea
          keyName="description"
          visible={currentStep === 4}
          label="Titulo del producto"
          buttonLabel="Siguiente"
          onButttonClick={(event: any) => onNextStep(event)}
          stepNumber={4}
          navigationTo="next"
          validations={validations}
        ></FormContainerInputArea>

        <FormContainerInputText
          keyName="price"
          visible={currentStep === 5}
          label="Precio del producto"
          buttonLabel="Enviar"
          onButttonClick={(event: any) => onNextStep(event)}
          stepNumber={5}
          navigationTo="submit"
          validations={validations}
        ></FormContainerInputText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F9F9F9",
  },
  itemformcontainer: {
    flex: 1,
    height: "100%",
  },
  footer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    paddingBottom: 16,
    backgroundColor: "rgba(33, 150, 243, 1.00)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 16,
  },
  textbutton: {
    color: "white",
  },
  content: {
    height: "90%",
  },
  header: {
    height: "8%",
  },
});
