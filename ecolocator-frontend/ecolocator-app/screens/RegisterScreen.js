import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Pressable, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure you have @expo/vector-icons installed

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        console.log('Register button pressed');
        console.log(`Email: ${email}, Password: ${password}, Confirm Password: ${confirmPassword}, Phone Number: ${phoneNumber}`);
    
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }
    
        if (password.length < 8 || !/\d/.test(password) || !/[!@#$%^&*]/.test(password)) {
            Alert.alert('Error', 'Password must be at least 8 characters long and include numbers and special characters.');
            return;
        }
    
        try {
            const baseUrl = 'http://192.168.100.74:5000'; // Update the URL with your actual IP address
            const response = await fetch(`${baseUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, phoneNumber })
            });
    
            console.log('Response status:', response.status);
    
            if (response.ok) {
                const data = await response.json();
                console.log('Response data:', data);
                Alert.alert('Success', data.message || 'Registration successful! Please check your email to activate your account.');
                setMessage('Registration successful! Please check your email to activate your account.');
            } else {
                const errorData = await response.json();
                console.log('Error data:', errorData);
                Alert.alert('Error', errorData.error || 'Registration failed. Please try again.');
                setMessage(errorData.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'An error occurred. Please try again.');
            setMessage('An error occurred. Please try again.');
        }
    };
    

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
   
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Create Account</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    inputMode="email"
                    autoCapitalize="none"
                    placeholderTextColor="#A0A0A0"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#A0A0A0"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    placeholderTextColor="#A0A0A0"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    inputMode="tel"
                    placeholderTextColor="#A0A0A0"
                />
                <Pressable style={styles.button} onPress={handleRegister} role="button">
                    <Text style={styles.buttonText}>Sign Up</Text>
                </Pressable>
                {message ? <Text style={styles.message}>{message}</Text> : null}
                <View style={styles.requirements}>
                    <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                    <Text style={styles.requirement}>- At least 8 characters long</Text>
                    <Text style={styles.requirement}>- Includes numbers</Text>
                    <Text style={styles.requirement}>- Includes special characters (e.g., !@#$%^&*)</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        backgroundColor: '#F9F9F9',
        paddingVertical: 20,
    },
    header: {
        position: 'absolute',
        top: 40,
        left: 0,
        width: '100%',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    backButton: {
        alignSelf: 'flex-start',
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center',
        width: '90%',
        maxWidth: 400,
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
        marginTop: 80, // Adjusted margin to ensure the form is centered
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        height: 50,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 25,
        marginBottom: 12,
        paddingLeft: 16,
        backgroundColor: '#FFF',
        fontSize: 16,
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    message: {
        marginTop: 20,
        textAlign: 'center',
        color: 'red',
        fontSize: 16,
    },
    requirements: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    requirementsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    requirement: {
        fontSize: 14,
        marginBottom: 3,
        color: '#666',
    },
});

export default RegisterScreen;
