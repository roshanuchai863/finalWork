import { View, StyleSheet } from 'react-native'

export function ListItemSeparator(props) {
  return (
    <View style={styles.separator} ></View>
  )
}

const styles = StyleSheet.create({
  separator: {
    backgroundColor: '#CCCCCC',
    height: 2,
  }
})
