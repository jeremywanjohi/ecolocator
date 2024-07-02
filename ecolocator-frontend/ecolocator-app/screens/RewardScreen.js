import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const RewardScreen = ({ route, navigation }) => {
    const { rewardPoints } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thank you for helping the environment today!</Text>
            <Text style={styles.rewardText}>You've earned</Text>
            <Text style={styles.points}>{rewardPoints} RCOINS</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Homepage')} style={styles.button}>
                <Text style={styles.buttonText}>Go to homepage</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F9F9F9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    rewardText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
    },
    points: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4CAF50',
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default RewardScreen;
