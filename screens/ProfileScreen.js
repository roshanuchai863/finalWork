
import { View, Text } from 'react-native'
import { SignOutButton } from '../components/SignOutButton'

export function ProfileScreen () {
 
  return (
    <View>
      <Text>User Profile</Text>
      <SignOutButton text="Sign out" />
    </View>
  )
}