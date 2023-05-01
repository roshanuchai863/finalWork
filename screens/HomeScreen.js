import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, FlatList, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from "../contexts/AuthContext"
import { NoteContext } from "../contexts/NoteContext"
import { DBContext } from "../contexts/DBcontext"
import { addDoc, collection } from "firebase/firestore"
import { ListItem } from "../components/ListItem"
import { ListItemSeparator } from "../components/ListItemSeparator"
import IonIcons from '@expo/vector-icons/Ionicons'
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import * as ImagePicker from 'expo-image-picker';
import { firebaseConfig } from "../config/Config"

export function HomeScreen(props) {
  const navigation = useNavigation()
  const authStatus = useContext(AuthContext)
  const Notes = useContext(NoteContext)
  const DB = useContext(DBContext)
  const storage = getStorage(initializeApp(firebaseConfig))

  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [itemName, setItemName] = useState("")
  const [itemDesc, setItemDesc] = useState("")
  const [itemPrice, setItemPrice] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [image, setImage] = useState("");
  const [noteData, setNoteData] = useState([])



  const saveNote = async () => {
    setShowModal(false)
    const noteObj = {
      ImageUrl: imageUrl,
      productTitle: itemName,
      productDesc: itemDesc,
      productPrice: itemPrice,
    }
    // add note to firebase
    const path = `users/${authStatus.uid}/coffee`
    const ref = await addDoc(collection(DB, path), noteObj)
    //resetting input fields
    setItemDesc("");
    setItemName("");
    setItemPrice("");
    setImage("");
  }
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log("image location:" + image)
    }
  };

  useEffect(() => {
    const uploadImage = async () => {
      const blobImage = await new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();

        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request Failed"));
        }
        xhr.responseType = "blob";
        xhr.open("Get", image, true)
        xhr.send();
      })

      // Create the file metadata

      const metadata = {
        contentType: 'image/jpeg'
      };

      // Upload file and metadata to the object 'images/mountains.jpg'
      const storageRef = ref(storage, `images/${authStatus.uid}/` + Date.now());
      const uploadTask = uploadBytesResumable(storageRef, blobImage, metadata);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on('state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');

          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;

            // ...

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            setImageUrl(downloadURL);
            console.log("image source:" + imageUrl + "userid:" + authStatus.uid);
          });
        }
      );

    }

    if (image != null) {
      uploadImage();
      //setImage(imageUrl)
    }
  }, [image]);

  useEffect(() => {
    if (!authStatus) {
      navigation.reset({ index: 0, routes: [{ name: "Signin" }] })
    }
  }, [authStatus])

  const ListClickHandler = (data) => {
    navigation.navigate("Detail", data)
  }

  return (
    <View style={styles.screen}>
      {/* modal element */}
      <Modal
        transparent={false}
        animationType="slide"
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        {/* <View style={styles.modal}>
          <Text style={styles.modalLabel}>Title</Text>
          <TextInput
            style={styles.modalInput}
            value={title}
            onChangeText={(val) => setTitle(val)}
          />
          <Text style={styles.modalLabel} >Note</Text>
          <TextInput
            multiline={true}
            style={styles.modalInput2}
            value={note}
            onChangeText={(val) => setNote(val)}
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
      </Modal> */}

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
        <IonIcons name="add-outline" size={28} color="white" />
      </TouchableOpacity>
      <FlatList
        data={Notes}
        renderItem={({ item }) => (
          <ListItem
            id={item.id}
            itemName={item.itemName}
            itemPrice={item.itemPrice}
            itemDesc={item.itemDesc}
            image={item.image}
            handler={ListClickHandler}
          />
        )}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={ListItemSeparator}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    position: "relative"
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
    padding: 10,
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 999,
  },
  addButton: {
    padding: 10,
    backgroundColor: "green",
    flex: 1,
  },
  closeButton: {
    backgroundColor: "#000000",
    padding: 10,
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
  },
  listItem: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },

})

