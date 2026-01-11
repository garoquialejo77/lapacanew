import { FormContainerContext } from "@/app/contexts/formContainerProvider";
import { useContext, useEffect, useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { FormContainerStep } from "./FormContainerStep";


export type GlobalContent = {
  formData: any[]
  setFormData:(c: any) => void
  isSubmit: false, // set a default value
  setIsSubmit: (c: any) => void
}  


export function FormContainer({ titleHeader, onSubmitData, validations, error, toogleError, success, toogleSuccess }: any) {
  const [currentStep, setCurrentStep] = useState(1);
  const [validationCurrentStep, setValidationCurrentStep] = useState({});

  const {formData, setFormData, isSubmit, setIsSubmit} = useContext(FormContainerContext) as GlobalContent

  useEffect(() => {
    getValidationsStep();
  }, [currentStep]);

  function getValidationsStep() {
    const validationStep = validations.find(
      (step: any, index: any) => step?.step === currentStep
    );
    setValidationCurrentStep(validationStep);
  }

  function navigateToStep(event: any) {
    setCurrentStep(event);
  }

  function submitData() {
    setIsSubmit(true)
  }

  return (
    <View style={styles.container}>
     
      <View style={styles.itemformcontainer}>
      <Modal
          animationType="slide"
          transparent={false}
          visible={error}
          onRequestClose={() => {
            Alert.alert('Hubo un error al crear el producto, intenta más tarde');
            toogleError(!error);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hubo un error al crear el producto, intenta más tarde</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => toogleError(!error)}>
                <Text style={styles.textStyle}>Aceptar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={success}
          onRequestClose={() => {
            Alert.alert('Producto creado correctamente');
            toogleSuccess(!success);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Producto creado correctamente</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => toogleSuccess(!success)}>
                <Text style={styles.textStyle}>Aceptar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <FormContainerStep
          titleHeader={titleHeader}
          currentStep={currentStep}
          onClickNext={(event: any) => navigateToStep(event)}
          onClickSubmit={(data: any) => submitData()}
          validations={validationCurrentStep}
        ></FormContainerStep>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  itemformcontainer: {
    flex: 1,
    height: "100%",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
