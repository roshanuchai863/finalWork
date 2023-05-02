import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Pressable, Image } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { DBContext } from '../contexts/DBcontext'
import { doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore'
import IonIcons from '@expo/vector-icons/Ionicons'
import * as ImagePicker from 'expo-image-picker';
import { getDoc } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from "firebase/storage";


export function CoffeeScreen(props) {
  const navigation = useNavigation()
  const authStatus = useContext(AuthContext)
  const DB = useContext(DBContext)
  const route = useRoute()
  const { id, title, content, price, ImageUrl } = route.params
  const storage = getStorage();


  const [itemName, setItemName] = useState(title)
  const [itemDesc, setItemDesc] = useState(content)
  const [itemPrice, setItemPrice] = useState(price)
  const [image, setImage] = useState(ImageUrl);

  const [showModal, setShowModal] = useState(false)

  const deleteNote = async () => {
    const path = `users/${authStatus.uid}/coffee`
    await deleteDoc(doc(DB, path, id))
    navigation.goBack()
  }


  const updateNote = async () => {
    const path = `users/${authStatus.uid}/coffee`
    await updateDoc(doc(DB, path, id), {
      ImageUrl: image,
      productTitle: itemName,
      productDesc: itemDesc,
      productPrice: itemPrice,
    })
    navigation.goBack()
  }




  //on openscreen display datainto input field
  useEffect(() => {
    const readData = async () => {
      const docRef = doc(DB, `users/${authStatus.uid}/coffee`, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setImage(docSnap.data().ImageUrl);
        console.log("iamge location:" + (docSnap.data().ImageUrl))
        setItemName(docSnap.data().productTitle);
        setItemDesc(docSnap.data().productDesc);
        setItemPrice(docSnap.data().productPrice);
        console.log("all data" + docSnap.data())

      }
    }
    readData();
  }, [])

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
            setImage(downloadURL);
            console.log("image source:" + image + "userid:" + authStatus.uid);
          });
        }
      );

    }

    if (image != null) {
      uploadImage();
      //setImage(imageUrl)
    }
  }, [image]);


  return (
    <View style={styles.screen}>

      <TouchableOpacity style={styles.imagePickerBtn}>
        <Text style={styles.imageviews} onPress={pickImage}>Select Image</Text>
        {image && <Image source={{ uri: image }} style={{
          width: 300, height: 400, padding: 20, alignSelf: 'center',
        }} />}</TouchableOpacity>

      <Text style={styles.label}>Item Name</Text>
      <TextInput
        style={styles.input}
        value={itemName}
        onChangeText={(val) => setItemName(val)}
      />



      <Text style={styles.label} >Description</Text>
      <TextInput
        multiline={true}
        style={styles.input}
        value={itemDesc}
        onChangeText={(val) => setItemDesc(val)}
      />


      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        value={itemPrice}
        onChangeText={(val) => setItemPrice(val)}
      />
      <View style={styles.row}>
        <TouchableOpacity style={styles.delete} onPress={() => setShowModal(true)}>
          <IonIcons name="trash-outline" size={28} color="black" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.save} onPress={() => updateNote()}>
          <IonIcons name="save-outline" size={28} color="black" />
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>




      </View>
      {/* Modal */}
      <Modal visible={showModal} style={styles.modal}>
        <View style={styles.row}>
          <Pressable style={styles.deleteNote} onPress={() => deleteNote()}>
            <Text>Delete coffee?</Text>
          </Pressable>
          <Pressable style={styles.cancelDelete} onPress={() => setShowModal(false)}>
            <Text>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  )
}
const styles = StyleSheet.create({
  screen: {
    marginHorizontal: 10,
  },
  label: {
    fontSize: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
  },
  input2: {
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    minHeight: 80,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  delete: {
    flex: 1,
    padding: 10,
  },
  save: {
    flex: 1,
    padding: 10,
  },
  deleteNote: {
    padding: 10,
    backgroundColor: "#f9db81"
  },
  cancelDelete: {
    padding: 10,
    backgroundColor: "#dbf981"
  },
  modal: {
    padding: 20,
    paddingTop: 100,
  },
  imageviews: {
    fontSize: 30,
    textAlign: "center",
    padding: 10,
    marginBottom: 20,
  }
})