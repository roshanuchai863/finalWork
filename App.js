import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native'

// contexts
import { AuthContext } from './contexts/AuthContext'
import { CoffeeContext } from './contexts/CoffeeContext';
import { FBAuthContext } from './contexts/FBAuthContext';
import { DBContext } from './contexts/DBcontext';
// screens
import { HomeScreen } from './screens/HomeScreen';
import { SignUpScreen } from './screens/SignUp';
import { SignInScreen } from './screens/SignIn';
import { CoffeeScreen } from './screens/Coffee';
import { TabScreen } from './screens/TabScreen';
// firebase modules
import { firebaseConfig } from './config/Config';
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword
} from "firebase/auth"

import {
  getFirestore,
  collection,
  query,
  onSnapshot, doc, getDoc
} from 'firebase/firestore'


const Stack = createNativeStackNavigator();

const FBapp = initializeApp(firebaseConfig)
const FBauth = getAuth(FBapp)
const FBdb = getFirestore(FBapp)


export default function App() {
  const [auth, setAuth] = useState()

  const [CoffeeData, setCoffeeData] = useState([])
  const [itemName, setItemName] = useState([])
  const [itemDesc, setItemDesc] = useState([])
  const [itemPrice, setItemPrice] = useState([])
  const [image, setImage] = useState(null)


  onAuthStateChanged(FBauth, (user) => {
    if (user) {
      setAuth(user)
    }
    else {
      setAuth(null)
    }
  })

  useEffect(() => {
    if (CoffeeData.length === 0 && auth) {
      GetData()
      // readData();
      console.log("Dataare here")
      console.log(CoffeeData);

    }


  })

  const SignUp = (email, password) => {
    createUserWithEmailAndPassword(FBauth, email, password)
      .then((userCredential) => console.log(userCredential))
      .catch((error) => console.log(error))
  }

  const SignIn = (email, password) => {
    signInWithEmailAndPassword(FBauth, email, password)
      .then((userCredential) => console.log(userCredential))
      .catch((error) => console.log(error))
  }


  const GetData = () => {
    const userId = auth.uid
    const path = `users/${userId}/coffee`
    const dataQuery = query(collection(FBdb, path))
    const unsubscribe = onSnapshot(dataQuery, (responseData) => {
      let coffeeItems = []
      responseData.forEach((note) => {
        let item = note.data()
        item.id = note.id
        item.itemName = note.data().productPrice,
          item.itemDesc = note.data().productDesc,
          item.itemPrice = note.data().productTitle,
          item.image = note.data().ImageUrl,
          coffeeItems.push(item)
      })
      setCoffeeData(coffeeItems)
      console.log("final doc" + notes.data)
    })
  }




  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Signup">
          {(props) =>
            <FBAuthContext.Provider value={FBauth}>
              <AuthContext.Provider value={auth}>
                <SignUpScreen {...props} handler={SignUp} />
              </AuthContext.Provider>
            </FBAuthContext.Provider>
          }
        </Stack.Screen>
        <Stack.Screen name="Signin">
          {(props) =>
            <AuthContext.Provider value={auth}>
              <SignInScreen {...props} handler={SignIn} />
            </AuthContext.Provider>
          }
        </Stack.Screen>
        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {(props) =>
            <FBAuthContext.Provider value={FBauth} >
              <DBContext.Provider value={FBdb} >
                <AuthContext.Provider value={auth}>
                  <CoffeeContext.Provider value={CoffeeData} >
                    <TabScreen {...props} />
                  </CoffeeContext.Provider>
                </AuthContext.Provider>
              </DBContext.Provider>
            </FBAuthContext.Provider>
          }
        </Stack.Screen>
        <Stack.Screen name="Coffee">
          {(props) =>
            <DBContext.Provider value={FBdb}>
              <AuthContext.Provider value={auth}>
                <CoffeeScreen {...props} />
              </AuthContext.Provider>
            </DBContext.Provider>
          }
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
