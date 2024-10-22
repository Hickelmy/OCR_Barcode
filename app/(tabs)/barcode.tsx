import React, { useState } from 'react';
import { Button, Image, View, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';

export default function ImagePickerExample() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [lang, setLang] = useState('en');
  const [confidence, setConfidence] = useState(0.5);
  const [langOpen, setLangOpen] = useState(false);
  const [confidenceOpen, setConfidenceOpen] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const sendImage = async () => {
    if (image) {
      try {
        const base64Image = await convertToBase64(image);
        const response = await axios.post('http://10.58.64.123:7070/processar_imagem', {
          image: base64Image,
          lang,
          confidence,
        },
          {
            timeout: 30000,
          }
        );
        setProcessedImage(response.data.imagem_com_caixas_base64);
        setExtractedText(response.data.texto_extraido);
      } catch (error) {
        console.error('Error sending image:', error);
      }
    }
  };

  const convertToBase64 = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && (
        <View style={styles.contentContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={styles.selectContainer}>
            <Text>Language:</Text>
            <DropDownPicker
              open={langOpen}
              value={lang}
              items={[
                { label: 'English', value: 'en' },
                { label: 'Português', value: 'pt' },
                { label: 'Español', value: 'es' },
              ]}
              setOpen={setLangOpen}
              setValue={setLang}
              style={styles.picker}
            />
            <Text>Confidence:</Text>
            <DropDownPicker
              open={confidenceOpen}
              value={confidence}
              items={[
                { label: '0.5', value: 0.5 },
                { label: '0.7', value: 0.7 },
                { label: '0.9', value: 0.9 },
              ]}
              setOpen={setConfidenceOpen}
              setValue={setConfidence}
              style={styles.picker}
            />
          </View>
          <Button title="Send Image" onPress={sendImage} />
          {processedImage && <Image source={{ uri: processedImage }} style={styles.image} />}
          {extractedText && <Text style={styles.text}>{extractedText}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  selectContainer: {
    marginVertical: 20,
    width: 200,
  },
  picker: {
    marginVertical: 10,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});
