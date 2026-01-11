import { Pressable, Text, View, Image } from "react-native";
import { FormContainerPhoto } from "./FormContainerPhoto";
import { StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from '@expo/vector-icons/Entypo';
import { router } from "expo-router";

export function NavHeader({
  textTitle,
  image,
  onBackStepClicked,
  backgroundColor,
  withRigthIcon,
  justifyContent,
  withLeftIcon
}: any) {
  function onBackClicked() {
    onBackStepClicked();
  }

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }, {justifyContent:justifyContent}]}>
      {withRigthIcon ? (
        <Pressable style={styles.containerIconRight}>
          <AntDesign
            onPress={onBackClicked}
            name="arrow-left"
            size={24}
            color="#FFFFFF"
          />
        </Pressable>
      ) :false}

      <View style={styles.containerTitle}>
        {image ?  <Image
              style={styles.containerImage}
              source={{
                uri: `${process.env.EXPO_PUBLIC_HOST}/storage/uploads/${image}`,
              }}
            /> : false}
        <Text style={[image? {marginLeft:16}: false,{ color: "#FFFFFF", fontSize: 30 }]}>{textTitle}</Text>
      </View>
      {withLeftIcon ? (
        <Pressable style={styles.containerIconLeft}>
          <Entypo name="menu" size={24} color="white" />
        </Pressable>
      ) : false}


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems:"center",
    borderColor: "black",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "rgb(216, 216, 216)",
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#FFC300",
    maxHeight: 80,
    paddingTop: 16,
    paddingBottom:16
  },

  containerTitle: {
    paddingLeft: 16,
    display:"flex",
    width:"100%",
    height:"100%",
    flexDirection:"row"
  },

  containerIconRight: {
    justifyContent: "center",
    paddingLeft: 16
  },
  containerIconLeft:{
    display:"flex",
    paddingRight: 16
  },
  containerImage:{
    height: "100%", 
    width: "15%",
    borderRadius: 200,
  }
});
