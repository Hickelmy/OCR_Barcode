import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Alert, Platform } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { CameraType } from 'expo-image-picker';

const HomeScreen = () => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [facing, setFacing] = useState(CameraType.back);

    const cameraRef = useRef<any>(null);

    const requestPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
        setHasPermission(status === 'granted' && mediaLibraryStatus.status === 'granted');
    };

    useEffect(() => {
        requestPermission();
    }, []);

    // const toggleCameraFacing = () => {
    //   setFacing(facing === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);
    // };

    const toggleCameraFacing = () => {
        setFacing(facing === CameraType.back ? CameraType.front : CameraType.back);
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            if (photo.uri) {
                if (Platform.OS === 'web') {
                    // Para web, faz o download da imagem
                    const response = await fetch(photo.uri);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'photo.jpg';
                    a.click();
                    window.URL.revokeObjectURL(url);
                } else {
                    // Para mobile, salva na galeria
                    try {
                        const asset = await MediaLibrary.createAssetAsync(photo.uri);
                        await MediaLibrary.createAlbumAsync('Camera', asset, false);
                        Alert.alert('Imagem salva!', 'A imagem foi salva na galeria com sucesso.');
                    } catch (error) {
                        console.error(error);
                        Alert.alert('Erro', 'Ocorreu um erro ao salvar a imagem na galeria.');
                    }
                }
            }
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            Alert.alert('Imagem selecionada!', 'Você selecionou uma imagem da galeria.');
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
                {Platform.OS !== 'web' ? (
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
                ) : (
                    <Text style={styles.message}>Camera not supported on web, use mobile app</Text>
                )}
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
});

export default HomeScreen;
