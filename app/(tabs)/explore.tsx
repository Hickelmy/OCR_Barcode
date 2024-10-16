import React, { useState, useEffect } from 'react'; 
import { View, FlatList, Button, StyleSheet, Dimensions, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const TabTwoScreen = () => {
  const [images, setImages] = useState([]);
  const [numColumns, setNumColumns] = useState(2);
  const [loading, setLoading] = useState(true);

  // Função para buscar imagens do servidor e atualizar o cache
  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/get_images');
      const fetchedImages = response.data.map((item : any) => ({
        id: item._id,
        src: item.image,
      }));

      // Armazena as imagens no estado e atualiza o cache
      setImages(fetchedImages);
      await AsyncStorage.setItem('imagesCache', JSON.stringify(fetchedImages));
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar imagens:', error);
      setLoading(false);
    }
  };

  // Função para carregar imagens do cache local
  const loadImagesFromCache = async () => {
    try {
      const cachedImages = await AsyncStorage.getItem('imagesCache');
      if (cachedImages) {
        setImages(JSON.parse(cachedImages));
      } else {
        await fetchImages();
      }
    } catch (error) {
      console.error('Erro ao carregar imagens do cache:', error);
    }
  };

  // Carrega as imagens do cache e também consulta o servidor para verificar se há novas imagens
  useEffect(() => {
    const initialize = async () => {
      await loadImagesFromCache();
      fetchImages(); // Sempre atualiza com as imagens mais recentes do servidor
    };
    initialize();
  }, []);

  // Alterna entre 2 e 3 colunas para a galeria
  const toggleColumns = () => {
    setNumColumns((prevColumns) => (prevColumns === 2 ? 3 : 2));
  };

  // Renderização de cada imagem na galeria
  const renderImageItem = ({ item } : any) => {
    const { width } = Dimensions.get('window');
    const imageSize = (width - 20) / numColumns - 10;

    return (
      <Image
        source={{ uri: item.src }}
        style={{
          width: imageSize,
          height: 150,
          margin: 5,
          borderRadius: 10,
        }}
        resizeMode="cover"
      />
    );
  };

  return (
    <View style={styles.container}>
      <Button
        title={`Mudar para ${numColumns === 2 ? '3' : '2'} Colunas`}
        onPress={toggleColumns}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={images}
          renderItem={renderImageItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          key={numColumns} // Garantir renderização correta ao mudar o número de colunas
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
});

export default TabTwoScreen;
