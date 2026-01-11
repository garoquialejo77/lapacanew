import { View, StyleSheet, Image, Text } from "react-native";
import { useState } from "react";

type Card = {
  title: string;
  image: string;
  description?: string;
  footer: string;
  type: string;
  ellipsis: Boolean;
};

const [isLoadingImage, setIsLoadingImage] = useState(false);

function toggleLoading() {
  setIsLoadingImage(!isLoadingImage);
}



export function Card({
  title,
  image,
  description,
  footer,
  type,
  ellipsis,
}: Card) {

  function getHorizontalText(footer:any){
    if(ellipsis){
      return <Text   numberOfLines={1}
      ellipsizeMode="tail"
      style={{ width: 200 }} >{footer}</Text>
    
    }else{
      return  <Text style={styles.footerText}>{footer}</Text>
    }
     
   } 

  return (
    <View
      style={
        type != "horizontal" ? styles.container : styles.containerHorizontal
      }
    >
      <View
        style={
          type != "horizontal"
            ? styles.containerImage
            : styles.containerImageHorizontal
        }
      >
        {isLoadingImage ? (
          <Image
            source={require("@/assets/images/loading.gif")}
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        ) : (
          <Image
            onLoadEnd={() => toggleLoading}
            style={
              type === "horizontal"
                ? { width: 80, height: 80, borderRadius: "50%", padding: 8 }
                : { height: "100%" }
            }
            source={
              image
                ? {
                    uri: `${process.env.EXPO_PUBLIC_HOST}/storage/uploads/${image}`,
                  }
                : require("@/assets/images/avatar.png")
            }
          />
        )}
      </View>

      <View
        style={[
          styles.containerFooter,
          type === "horizontal" ? styles.m_16 : "",
        ]}
      >
        <View style={styles.borderTop}>
          <View style={styles.containerTitle}>
            <Text style={styles.titleText}>{title}</Text>
          </View>

          <View style={styles.containerDescription}>
          
    
            <Text style={styles.titleText}>{description}</Text>
          </View>

          {type != "horizontal" ? (
            <Text style={styles.footerText}>$ {footer}</Text>
          ) : (
            getHorizontalText(footer)
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    borderRadius: 15,
    boxShadow: "0 5px 20px rgba(0,0,0,.1)",
    padding: 8,
    height: 400,
  },
  containerHorizontal: {
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",

    borderRadius: 15,
    boxShadow: "0 5px 20px rgba(0,0,0,.1)",
    padding: 8,
    height: 150,
  },
  containerTitle: {
    backgroundColor: "white",
    height: "12%",
    marginBottom: 18,
    display: "flex",
  },

  containerDescription: {
    backgroundColor: "white",
    height: "12%",
    marginBottom: 18,
    display: "flex",
  },

  containerImage: {
    paddingTop: 8,
    backgroundColor: "white",
    height: "72%",
  },

  containerFooter: {
    paddingTop: 8,
    backgroundColor: "white",
    height: "12%",
  },

  m_16: {
    marginLeft: 16,
  },

  containerImageHorizontal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "20%",
  },

  borderTop: {
    paddingTop: 8,
    borderTopColor: "#F4F4F5",
    borderTopWidth: 1,
  },
  footerText: { fontSize: 16, fontWeight: 200, color: "#18181B" },
  titleText: { fontSize: 16, fontWeight: 700, color: "#18181B" },
});
