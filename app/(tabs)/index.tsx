import React, { useState, useEffect, useRef } from 'react';  
import { Camera, CameraView } from 'expo-camera';
import { View, Text, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';
import { CameraType } from 'expo-camera/build/legacy/Camera.types';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const HomeScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facing, setFacing] = useState(CameraType.back);
  const [image, setImage] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  const requestPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  useEffect(() => {
    requestPermission();
  }, []);

  const toggleCameraFacing = () => {
    setFacing(facing === CameraType.back ? CameraType.front : CameraType.back);
  };

  const takePicture = async () => { 
    if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({ base64: true });

        if (photo.base64) {
            const base64Image = photo.base64;
            
            console.log("Início da imagem base64:", base64Image.substring(0, 100)); // Mostra os primeiros 100 caracteres

            try {
                const response = await fetch('http://localhost:4000/upload_image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ base64: base64Image }),
                });

                const result = await response.json();

                console.log('response : ',response)

                console.log('result : ',result)
                Alert.alert('Imagem enviada!', 'A imagem foi enviada e salva no MongoDB com sucesso.');
                console.log(result);
            } catch (error) {
                console.error(error);
                Alert.alert('Erro', 'Ocorreu um erro ao enviar a imagem para o MongoDB.');
            }
        } else {
            console.error("Imagem em base64 não capturada.");
        }
    }
};


  

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.answersText}>Project Label</Text>
        <TouchableOpacity style={styles.buttonGetUnlim}>
          <Text style={styles.buttonText}>CHECK</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mainContent}>
        <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.sideButton} onPress={toggleCameraFacing}>
              <MaterialIcons name="flip-camera-ios" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <MaterialIcons name="camera" size={50} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sideButton} onPress={pickImage}>
              <MaterialIcons name="photo-library" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="camera-alt" size={30} color="#6c6c6c" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="segment" size={30} color="#6c6c6c" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome name="server" size={30} color="#6c6c6c" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="barcode-reader" size={30} color="#6c6c6c" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="save" size={30} color="#6c6c6c" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  camera: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sideButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 50,
  },
  captureButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 50,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  answersText: {
    fontSize: 16,
    color: '#6c6c6c',
  },
  buttonGetUnlim: {
    backgroundColor: '#e6e6e6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 14,
    color: '#6c6c6c',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#e6e6e6',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 24,
    color: '#6c6c6c',
  },
});

export default HomeScreen;
