import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useContext } from 'react'
import { FBAuthContext } from '../contexts/FBAuthContext'
import { signOut } from 'firebase/auth'

export function SignOutButton( props ) {
  const FBauth = useContext(FBAuthContext)
  
  const SignOutHandler = () => {
    signOut(FBauth).then( 
      () => {
        // signed out
      }
    )
  }
  return (
    <View>
      <Pressable onPress={ () => SignOutHandler() }>
        <Text>{ props.text }</Text>
      </Pressable>
    </View>
  )
}