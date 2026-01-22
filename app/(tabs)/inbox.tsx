import { Card } from "@/components/Card";
import { NavHeader } from "@/components/NavHeader";
import { router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SesionContext } from "../contexts/sesionProvider";
import { getMessages } from "../services/messageService";

type Message = {
  id: number;
  from: string;
  to: string;
  message: string;
  product: string | null;
  answered: string | null;
  reaction: string | null;
  product_image: string;
  product_title: string;
  created_at?: string;
  updated_at?: string;
};

type SesionContent = {
  isSessionSuccess: Boolean;
  setIsSessionSuccess: (c: any) => void;
  user: string;
  setUser: (c: any) => void;
  messagesNumber: string;
  setMessagesNumber: (c: any) => void;
  token: string;
};

export default function InboxScreen() {
  const [messages, setMessages] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  //const [token, setToken] = useState("");

  const {
    isSessionSuccess,
    setIsSessionSuccess,
    user,
    setUser,
    messagesNumber,
    setMessagesNumber,
    token,
  } = useContext(SesionContext) as SesionContent;

  useEffect(() => {
    if (isSessionSuccess) {
      loadMessages();
    } else {
      router.replace("/login");
    }
  }, [isSessionSuccess]);

  function onBack(event: any) {
    router.replace("/");
  }

  function onPressCard(messageSelected: Message) {
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
    } = messageSelected;
    router.push({
      pathname: "/detailinbox",
      params: {
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
      },
    });
  }

  const loadMessages = async (pageNumber = 1) => {
    try {
      const res = await getMessages(1, user, token);

      if (pageNumber === 1) {
        setMessages(res.data);
      } else {
        setMessages((prev) => [...prev, ...res.data]);
      }

      setPage(res.current_page);
      setLastPage(res.last_page);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <NavHeader
          backgroundColor="black"
          colorText="white"
          textTitle="Tus mensajes"
          justifyContent="left"
          onBackStepClicked={(step: any) => onBack(step)}
          withRigthIcon
        />
        <View>
          <FlatList
            data={messages}
            style={styles.containerMessages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => onPressCard(item)}
                style={styles.containerCard}
              >
                <Card
                  id={item.id}
                  title={item.from}
                  description={item.product_title}
                  image={item.product_image}
                  footer={item.message}
                  type="horizontal"
                  ellipsis={true}
                />
              </Pressable>
            )}
            ListFooterComponent={
              isLoading ? <ActivityIndicator style={{ margin: 10 }} /> : null
            }
            onEndReached={() => {
              if (page < lastPage) {
                loadMessages(page + 1);
              }
            }}
            onEndReachedThreshold={0.5}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 8,
  },
  containerMessages: {
    padding: 16,
  },
  containerCard: {
    marginTop: 16,
  },
});
