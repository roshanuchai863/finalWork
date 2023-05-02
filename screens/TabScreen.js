import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcons from '@expo/vector-icons/Ionicons'

import { HomeScreen } from "./HomeScreen";
import { SettingScreen } from "./settingScreen";

const Tab = createMaterialBottomTabNavigator();

export function TabScreen() {

  const HomeScreenOptions = {
    tabBarLabel: "Home",
    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" color={color} size={28} />
  }

  const ProfileScreenOptions = {
    tabBarLabel: "Setting",
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
        name="Setting"
        component={SettingScreen}
        options={ProfileScreenOptions}
      />
    </Tab.Navigator>
  )
}