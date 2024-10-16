import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as Tesseract from 'tesseract.js';

export default function App() {
  const [scanned, setScanned] = useState(false); 
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [ocrResult, setOcrResult] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await requestPermission();
      setHasPermission(status === 'granted');
      await MediaLibrary.requestPermissionsAsync();
    };

    getCameraPermissions();
  }, []);

  const handleImageCapture = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        if (!photo) {
          throw new Error('Failed to capture image');
        }
        setImageUri(photo.uri);
        handleSaveImage(photo.uri);
      }
    } catch (error) {
      console.error('Error capturing image: ', error);
    }
  };


  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };
  
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    }) as ImagePicker.ImagePickerResult;

    if (!result.canceled) {
      setImageUri(result.uri);
      performOcr(result.uri);
    }
  };

  const performOcr = async (uri: string) => {
    try {
      const result = await Tesseract.recognize(
        uri,
        'eng',
        {
          logger: (m) => console.log(m),
        }
      );
      setOcrResult(result.data.text);
    } catch (error) {
      console.error('OCR error: ', error);
    }
  };

  const handleSaveImage = async (uri: string) => {
    try {
      await MediaLibrary.createAssetAsync(uri);
      alert('Image saved to gallery!');
    } catch (error) {
      console.error('Save image error: ', error);
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.text}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  function toggleScanner() {
    setIsScannerActive((prev) => !prev);
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
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          mirror={true}
          mode="picture"
          // onBarcodeScanned={isScannerActive ? handleImageCapture : undefined}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: [
              'qr',
              'ean13',
              'ean8',
              'code39',
              'code93',
              'code128',
              'upc_a',
              'upc_e',
              'pdf417',
              'aztec',
              'datamatrix',
            ],
          }}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.sideButton} onPress={toggleCameraFacing}>
              <MaterialIcons name="flip-camera-ios" size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.captureButton} onPress={toggleScanner}>
              <MaterialIcons name="barcode-reader" size={50} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.captureButton} onPress={handleImageCapture}>
              <MaterialIcons name="camera" size={50} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sideButton} onPress={handleImagePick}>
              <MaterialIcons name="photo-library" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem} onPress={toggleCameraFacing}>
          <MaterialIcons name="camera-alt" size={30} color="#6c6c6c" />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.navItem} onPress={handleImagePick}>
          <MaterialIcons name="segment" size={30} color="#6c6c6c" />
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.navItem} onPress={() => handleSaveImage(imageUri)}>
          <FontAwesome name="server" size={30} color="#6c6c6c" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={toggleScanner}>
          <MaterialIcons name="barcode-reader" size={30} color="#6c6c6c" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleImageCapture}>
          <MaterialIcons name="save" size={30} color="#6c6c6c" />
        </TouchableOpacity>
      </View>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      {ocrResult && <Text style={styles.ocrText}>OCR Result: {ocrResult}</Text>}
    </View>
  );
}

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
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  ocrText: {
    textAlign: 'center',
    fontSize: 16,
    margin: 10,
  },
  text: {
  
  },
  button: {
  
  },
});

declare module 'tesseract.js';