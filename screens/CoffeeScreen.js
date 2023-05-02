import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet } from "react-native"
import { useState, useEffect } from 'react'

export function CoffeeScreen(props) {
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')

  const saveNote = () => {
    setShowModal(false)
    const noteObj = {
      ImageUrl: ImageUrl,
      productTitle: itemName,
      productDesc: itemDesc,
      productPrice: itemPrice,
    }
    props.add(noteObj)
  }

  return (
    <View style={styles.screen}>
      <Text>Home Screen</Text>
      {/* modal element */}
      <Modal
        transparent={false}
        animationType="slide"
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modal}>
          <TouchableOpacity style={styles.imagePickerBtn}>
            <Text style={styles.modalLabel} onPress={pickImage}>Select Image</Text>
            {image && <Image source={{ uri: image }} style={{ width: 300, height: 300 }} />}
          </TouchableOpacity>

          <Text style={styles.modalLabel}>Item Name</Text>
          <TextInput
            style={styles.modalInput}
            value={itemName}
            onChangeText={(val) => setItemName(val)}
          />



          <Text style={styles.modalLabel} >Description</Text>
          <TextInput
            multiline={true}
            style={styles.modalInput2}
            value={itemDesc}
            onChangeText={(val) => setItemDesc(val)}
          />


          <Text style={styles.modalLabel}>Price</Text>
          <TextInput
            style={styles.modalInput}
            value={itemPrice}
            onChangeText={(val) => setItemPrice(val)}
          />

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.buttonText} >Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => saveNote()}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>

        </View>
      </Modal>
      {/* button to open modal */}
      <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)} >
        <Text style={styles.buttonText}>Add Note</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
  },
  modal: {
    padding: 10,
    paddingTop: 50,
    flex: 1,
    justifyContent: "start",
    margin: 20,
    backgroundColor: "lightblue",
  },
  modalInput: {
    fontSize: 18,
    backgroundColor: "#ffffff",
  },
  modalInput2: {
    minHeight: 80,
    fontSize: 18,
    backgroundColor: "#ffffff",
  },
  modalLabel: {
    fontSize: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#000000",
    padding: 5,
    flex: 1,
  },
  addButton: {
    padding: 5,
    backgroundColor: "green",
    flex: 1,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 12,
    textAlign: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    marginVertical: 10,
  }
})