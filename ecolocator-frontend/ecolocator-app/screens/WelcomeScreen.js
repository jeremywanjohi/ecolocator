import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Welcome to Ecolocator!</Text>
                <Text style={styles.subHeaderText}>Locate Recycling Centers and Earn Rewards</Text>
            </View>
           
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.signUpButtonText}>Create An Account</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.signInButtonText}>Login To Your Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    subHeaderText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    imageContainer: {
        marginVertical: 20,
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 250,
        resizeMode: 'contain',
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    signUpButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        marginBottom: 10,
    },
    signUpButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signInButton: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#4CAF50',
        width: '80%',
    },
    signInButtonText: {
        color: '#4CAF50',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default WelcomeScreen;
