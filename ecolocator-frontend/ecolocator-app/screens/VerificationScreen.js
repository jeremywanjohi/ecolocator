import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';

const VerificationScreen = ({ route, navigation }) => {
    const { userId } = route.params ?? { userId: null };
    const [validationCode, setValidationCode] = useState('');

    const handleSendCode = async () => {
        if (!validationCode) {
            Alert.alert('Error', 'Please enter the validation code.');
            return;
        }

        if (!userId) {
            Alert.alert('Error', 'User ID is missing.');
            return;
        }

        try {
            console.log('Sending validation code:', validationCode);
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/verify-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    code: validationCode,
                }),
            });

            const data = await response.json();
            console.log('Server response:', data);

            if (response.ok) {
                Alert.alert('Success', `Validation successful. Reward Points: ${data.rewardPoints}`);
                navigation.navigate('RewardScreen', { rewardPoints: data.rewardPoints });
            } else {
                console.error('Failed to validate code:', data);
                Alert.alert('Error', data.error || 'Failed to validate code.');
            }
        } catch (error) {
            console.error('Error while validating code:', error);
            Alert.alert('Error', 'An error occurred while validating code.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Verification</Text>
            <Text style={styles.label}>Insert the validation code:</Text>
            <TextInput
                style={styles.input}
                value={validationCode}
                onChangeText={setValidationCode}
                keyboardType="default"
                placeholder="Enter validation code here"
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sendButton} onPress={handleSendCode}>
                    <Text style={styles.sendButtonText}>Send Code</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#2D3748',
    },
    label: {
        fontSize: 18,
        marginBottom: 15,
        textAlign: 'center',
        color: '#4A5568',
    },
    input: {
        borderWidth: 1,
        borderColor: '#CBD5E0',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        marginBottom: 25,
        textAlign: 'center',
        fontSize: 18,
        color: '#2D3748',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: '#E2E8F0',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    cancelButtonText: {
        color: '#2D3748',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sendButton: {
        backgroundColor: '#38A169',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default VerificationScreen;
