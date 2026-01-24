import { Card } from "@/components/Card";
import { NavHeader } from "@/components/NavHeader";
import { HelloWave } from "@/components/hello-wave";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { validationsNewUser } from "@/constants/validations";
import { validate } from "@/utils/validator";
import { FontAwesome } from "@expo/vector-icons";
import { useRootNavigation, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View
} from "react-native";
import { SesionContext } from "../contexts/sesionProvider";
import { sendRegister } from "../services/authService";
import { getMessages } from "../services/messageService";
import { getProducts } from "../services/productService";

type Product = {
  id: number;
  title: string;
  description: string;
  image1: string;
  image2: string | null;
  image3: string | null;
  image4: string | null;
  user: string;
  category: string;
  price: string;
  created_at?: string;
  updated_at?: string;
};

type SesionContent = {
  isSessionSuccess: Boolean;
  setIsSessionSuccess: (c: any) => void;
  userLogued: string;
  setUserLogued: (c: any) => void;
  messagesNumber: string;
  setMessagesNumber: (c: any) => void;
};

export default function HomeScreen() {
  const rootNavigation = useRootNavigation ();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRegisterVisible, setModalRegisterVisible] = useState(false);
  const [modalLoginVisible, setModalLoginVisible] = useState(false);
  const [isRegisterValidated, setIsRegisterValidated] = useState(false);

  const [products, setProducts] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [page, setPage] = useState(1);
  const [success, setSuccess] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();

  const {
    isSessionSuccess,
    setIsSessionSuccess,
    userLogued,
    setUserLogued,
    messagesNumber,
    setMessagesNumber,
  } = useContext(SesionContext) as SesionContent;

  useEffect(() => {

   loadProducts();
    if (text) {
      loadProducts(page, text);
    }

    onValidateForm();
  }, [text, email, password, confirmPassword, success]);

  function onChangeText(event: any) {
    setText(event);
    setPage(1);
  }


  function onChangeName(event: any) {
    setName(event);
  }

  function onChangeEmail(event: any) {
    setEmail(event);
  }

  function onChangePassword(event: any) {
    setPassword(event);
  }

  function onChangeConfirmPassword(event: any) {
    setConfirmPassword(event);
    onValidateForm();
  }


  const loadProducts = async (pageNumber = 1, search = "") => {
 
    if (loading) return;
    setLoading(true);
    try {
      const res = await getProducts(pageNumber, search);
      setSuccess(true)
      if (pageNumber === 1) {
        setProducts(res.data);
      } else {
        setProducts((prev) => [...prev, ...res.data]);
      }

      setPage(res.current_page);
      setLastPage(res.last_page);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  function onPressCard(product: Product) {
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
    } = product;
    router.push({
      pathname: "/detailproduct",
      params: {
        id,
        title,
        description,
        image1,
        image2,
        image3,
        image4,
        price,
        user,
      },
    });
  }

  async function toogleModal() {
    setModalVisible(!modalVisible);
  }

  function onLogin() {
  router.replace('/login')
  }

  function onRegister() {
    setModalVisible(false);
    setModalRegisterVisible(true);
  }

  function onCancel() {
    setModalRegisterVisible(false);
  }

  function onSendLogin() {
    setModalLoginVisible(false);
  }

  async function onSendRegister() {
    setIsLoadingRegister(true);
    try {
      const res = await sendRegister(name, email, password);
      setIsLoadingRegister(false);
      setModalRegisterVisible(false);
      if (res?.errors) {
        console.log("con errorresss", res.errors);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function onValidateForm() {
    let validated = true;
    const data = [{ value: name }, { value: email }, { value: password }];
    data.forEach((key, index) => {
      validated =
        validated && validate(key, validationsNewUser[index].validations);
    });

    setIsRegisterValidated(validated && confirmPassword === password);
  }

  async function onGetMessages() {
    try {
      const res = await getMessages(1, userLogued, token);
      setMessagesNumber(res.total.toString());
    } catch (error) {
      console.error(error);
    }
  }

  return (
<View style={{ flex: 1 }}>


      {success && !loading ? (
        <View style={{ flex: 1 }}>
          <NavHeader
            backgroundColor="black"
            colorText="white"
            withLeftIcon="menu"
            textTitle="La Pacapp"
            justifyContent="space-between"
          />

          <View style={styles.containerInput}>
            <FontAwesome name="search" size={20} color="black" />
            <TextInput
              style={[styles.input, { borderColor: "none" }]}
              onChangeText={onChangeText}
              value={text}
              placeholder="Buscar"
              underlineColorAndroid="transparent"
            />
          </View>

          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 16 }}
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable onPress={() => onPressCard(item)} style={styles.containerCard}>
                <Card
                  id={item.id}
                  title={item.title}
                  image={item.image1}
                  footer={item.price}
                  
                />
              </Pressable>
            )}
            ListHeaderComponent={
              <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Pacas de Hoy!</ThemedText>
                <HelloWave />
              </ThemedView>
            }
            ListFooterComponent={
              loading ? <ActivityIndicator style={{ margin: 10 }} /> : null
            }
            onEndReached={() => {
              if (page < lastPage) {
                loadProducts(page + 1, text);
              }
            }}
            onEndReachedThreshold={0.5}
          />
        </View>
      ) : (
        <View style={styles.containerLoader}><ActivityIndicator size="large"></ActivityIndicator></View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
},
  content: {
    padding: 16,
  },
  containerLoader:{
    display:"flex",
    justifyContent:"center",
    height:100
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
  containerCard:{
    marginTop: 16
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
