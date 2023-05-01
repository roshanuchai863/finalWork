import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcons from '@expo/vector-icons/Ionicons'

import { HomeScreen } from "./HomeScreen";
import { ProfileScreen } from "./ProfileScreen";

const Tab = createMaterialBottomTabNavigator();

export function TabScreen() {

  const HomeScreenOptions = {
    tabBarLabel: "Notes",
    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" color={color} size={28} />
  }

  const ProfileScreenOptions = {
    tabBarLabel: "Profile",
    tabBarIcon: ({ color }) => <IonIcons name="person-outline" color={color} size={28} />
  }
  return (
    <Tab.Navigator initialRouteName="Notes" activeColor="#e91e63">
      <Tab.Screen
        name="Notes"
        component={HomeScreen}
        options={HomeScreenOptions}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={ProfileScreenOptions}
      />
    </Tab.Navigator>
  )
}