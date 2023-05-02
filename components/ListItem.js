import { View, Text, Pressable, StyleSheet, Image } from 'react-native'
import { useState } from 'react'

export function ListItem(props) {
    //const [image, setimage] = useState()
    const data = {
        id: props.id,
        itemName: props.itemName,
        itemDesc: props.itemDesc,
        itemPrice: props.itemPrice,
        image: props.image,


    }
    console.log("data" + data)
    console.log("iamge location" + props.image);

    return (
        <Pressable onPress={() => props.handler(data)}>
            <View style={styles.item}>

                {props.image && <Image source={{ uri: props.image }} style={{ width: 200, height: 200 }} />}              
                  <Text style={styles.itemText}>{props.itemName}</Text>
                <Text style={styles.itemText}>{props.itemDesc}</Text>
                <Text style={styles.itemText}>{props.itemPrice}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    item: {
        padding: 10,
    },
    itemText: {
        fontSize: 18,
    }
})
