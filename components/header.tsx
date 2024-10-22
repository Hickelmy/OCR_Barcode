import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Header = () => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerText}>Cross Label</Text>

        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#1a73e8',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logo: {
        width: 50, // Tamanho da imagem do logotipo
        height: 20,
        resizeMode: 'contain',
    },
});

export default Header;
