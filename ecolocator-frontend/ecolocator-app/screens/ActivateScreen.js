import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';

const ActivateScreen = ({ navigation, route }) => {
    const email = route.params?.email;

    useEffect(() => {
        const activateAccount = async () => {
            try {
                const response = await fetch(`http://192.168.100.74:5000/activate?email=${encodeURIComponent(email)}`, {
                    method: 'GET',
                });
                if (response.ok) {
                    const message = await response.text();
                    Alert.alert('Success', message);
                    setTimeout(() => {
                        navigation.navigate('Homepage', { activated: true });
                    }, 3000); // Redirect after 3 seconds
                } else {
                    const errorData = await response.text();
                    Alert.alert('Error', errorData || 'Activation failed. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                Alert.alert('Error', 'An error occurred. Please try again.');
            }
        };

        if (email) {
            activateAccount();
        } else {
            Alert.alert('Error', 'No email provided for activation.');
            navigation.navigate('Welcome');
        }
    }, [email, navigation]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Activating your account...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
});

export default ActivateScreen;
