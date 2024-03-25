import React, { createContext, useState } from 'react';
import { FontAwesome } from "@expo/vector-icons";
import "../global.css";
import { Tabs } from "expo-router";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={iconMargin} {...props} />;
}
const iconMargin = { marginBottom: -3 }

export default function Layout() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Tabs screenOptions={options}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Accueil',
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="(tabs)/books"
          options={{
            title: 'Books',
            headerShown: false,
            tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
          }}
        />
      </Tabs>
    </QueryClientProvider>
  )
}

const options = {
  headerShown: false,
  tabBarShowLabel: false,
};
