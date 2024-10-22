import React from 'react';
import { View, Text, TextInput, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

const LoginPage = () => {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Cross Label</Text>
                </View>
                <View style={styles.contentContainer}>
                    <Image
                        source={{ uri: '../../assets/images/loginImg.svg' }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Username"
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Password"
                            secureTextEntry
                            style={styles.input}
                        />
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
    },
    card: {
        width: width * 0.6,
        backgroundColor: '#f0f0f3',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 8,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerContainer: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#007bff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#fff',
        shadowOffset: {
            width: -3,
            height: -3,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: width * 0.25,
        height: width * 0.25,
        borderRadius: 10,
        marginRight: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    inputContainer: {
        flex: 1,
    },
    input: {
        height: 50,
        borderRadius: 10,
        backgroundColor: '#f0f0f3',
        marginBottom: 15,
        paddingHorizontal: 15,
        shadowColor: '#fff',
        shadowOffset: {
            width: -3,
            height: -3,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 8,
    },
    button: {
        backgroundColor: '#007bff',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});

export default LoginPage;
