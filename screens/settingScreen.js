
import { View, Text, StyleSheet } from 'react-native'
import { SignOutButton } from '../components/SignOutButton'
import { SafeAreaView } from 'react-native-safe-area-context'

export function SettingScreen() {

  return (
    <SafeAreaView>
      <View style={styles.screen}>
        <SignOutButton text="Sign out" />
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  screen: {

    fontSize: 50,
    textAlign: "center",
    fontWeight: "bold",
    padding: 7,
    marginTop: 10,

  }
})

