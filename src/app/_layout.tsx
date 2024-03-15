import React from 'react';
import { FontAwesome } from "@expo/vector-icons";
import "../global.css";
import { Tabs } from "expo-router";
import StoreProvider from '@/components/StoreProvider';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={iconMargin} {...props} />;
}
const iconMargin = { marginBottom: -3 }

export default function Layout() {
  return (
    <StoreProvider>
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
    </StoreProvider>
  )
}

const options = {
  headerShown: false,
  tabBarShowLabel: false,
};
