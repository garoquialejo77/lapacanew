import { FormContainerContext } from "@/app/contexts/formContainerProvider";
import { FormContainer } from "@/components/FormContainer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { validationsNewProduct } from "../constants/validations";
import { newProduct } from "./services/productService";

export type GlobalContent = {
  formData: any[]
  setFormData:(c: any) => void
  isSubmit: false, // set a default value
  setIsSubmit: (c: any) => void
} 


export default function NewProductScreen() {

  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [endProccess, setEndProcess] = useState(false)
  const {formData, setFormData, isSubmit, setIsSubmit} = useContext(FormContainerContext) as GlobalContent
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(()=>{
    const cargarToken = async () => {
      const token = await AsyncStorage.getItem('auth');
      if(token){
        setToken(token);
      }else{
        router.replace('/login');
      }

    };

    cargarToken();
    if(endProccess){
      router.replace("/");
    }

    if(isSubmit){
      onNewProduct(formData)
    }
  }, [success, formData])


  async function onNewProduct(product: any,) {
    setLoading(true);
    try{
      const responses = await newProduct(product, token);
      setSuccess(true)
      setLoading(false);
    }catch(error : unknown){
      if(typeof(error)=== "string"){
        setError(true)
      }
      setLoading(false);
    
    }
    setIsSubmit(false)
  }

  function onToogleError(){
    setError(!error)
  }

  function onToogleSuccess(){
    setSuccess(!success)
    setEndProcess(true)
  }

  return (
    <>
      <SafeAreaProvider style={styles.container}>
      {!loading ? (
        <FormContainer
          validations={validationsNewProduct}
          titleHeader="Nuevo Producto"
          onSubmitData={(product: any) => onNewProduct(product)}
          error={error}
          success={success}
          toogleError={onToogleError}
          toogleSuccess={onToogleSuccess}
        ></FormContainer>) :(
          <View style={styles.containerLoader}><ActivityIndicator size="large"></ActivityIndicator></View>
        )}
      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  containerLoader:{
    display:"flex",
    justifyContent:"center",
    height:100
  },


});
