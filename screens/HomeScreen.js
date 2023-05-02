import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, FlatList, Image } from "react-native"
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from "../contexts/AuthContext"
import { CoffeeContext } from "../contexts/CoffeeContext"
import { DBContext } from "../contexts/DBcontext"
import { addDoc, collection } from "firebase/firestore"
import { ListItem } from "../components/ListItem"
import { ListItemSeparator } from "../components/ListItemSeparator"
import IonIcons from '@expo/vector-icons/Ionicons'
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import * as ImagePicker from 'expo-image-picker';
import { firebaseConfig } from "../config/Config"
import { useRoute, useNavigation } from '@react-navigation/native'

import {
  getFirestore,

  query,
  onSnapshot,
} from 'firebase/firestore'
export function HomeScreen(props) {
  const navigation = useNavigation()
  const authStatus = useContext(AuthContext)
  const CaffeeItem = useContext(CoffeeContext)
  const DB = useContext(DBContext)
  const storage = getStorage(initializeApp(firebaseConfig))


  const [showModal, setShowModal] = useState(false)
  const [itemName, setItemName] = useState("")
  const [itemDesc, setItemDesc] = useState("")
  const [itemPrice, setItemPrice] = useState("")
  const [newimage, setImage] = useState("");


  const [noteData, setNoteData] = useState([])
  const [CoffeeData, setCoffeeData] = useState([])


  //save data
  const saveNote = async () => {
    setShowModal(false)
    const noteObj = {
      ImageUrl: newimage,
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

  //image picker
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
      console.log("image location:" + newimage)
    }
  };





  // image upload
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
        xhr.open("Get", newimage, true)
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
            setImage(downloadURL);
          });
        }
      );

    }

    if (newimage != null) {
      uploadImage();
      //setImage(imageUrl)
    }
  }, [newimage]);

  useEffect(() => {
    if (!authStatus) {
      navigation.reset({ index: 0, routes: [{ name: "Signin" }] })
    }
  }, [authStatus])

  const ListClickHandler = (data) => {
    navigation.navigate("Coffee", data)
    console.log("id" + data)
  }



  return (
    <View style={styles.screen}>
      {/* modal element */}

      <Text style={styles.headingText}>KANGAROO CAFE</Text>
      <Modal
        transparent={false}
        animationType="slide"
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
{/* THIS MODEL WILL ADD THE DATA TO THE DATABASE */}
        <View style={styles.modal}>
          <TouchableOpacity >
            <Text style={styles.image} onPress={pickImage}>Select Image</Text>
            {newimage && <Image source={{ uri: newimage }} style={{
              width: 300, height: 400, padding: 20, alignSelf: 'center',
            }} />}
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
        data={CaffeeItem}
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
  headingText:{
    fontSize:30,
textAlign:"center",
fontWeight:"bold",
padding:7,
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
    backgroundColor: "#52C1FF",
    margin: 20,
  },
  closeButton: {
    backgroundColor: "#000000",
    padding: 10,
    flex: 1,
    backgroundColor: "#52C1FF",
    margin: 20,
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
  image: {
    fontSize: 30,
    textAlign: "center",
    padding: 10,
    marginBottom: 20,
  }

})

