import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useContext } from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SesionContext } from "../contexts/sesionProvider";

type SesionContent = {
  isSessionSuccess: Boolean;
  setIsSessionSuccess: (c: any) => void;
  user: string;
  setUser: (c: any) => void;
  messagesNumber: string;
  setMessagesNumber: (c: any) => void;
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isSessionSuccess, setIsSessionSuccess, user, setUser, messagesNumber, setMessagesNumber } = useContext(
    SesionContext
  ) as SesionContent;

  return (
    <SafeAreaProvider>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Nuevo',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="add-circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Buzón",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="mail.fill" color={color} />,
          tabBarBadge: messagesNumber
        }}
      />
    </Tabs>
    </SafeAreaProvider>
  );
}
