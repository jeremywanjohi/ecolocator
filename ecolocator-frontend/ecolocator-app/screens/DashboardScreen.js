import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

const DashboardScreen = ({ route, navigation }) => {
    const { officerName, officerId } = route.params ?? { officerName: 'Officer', officerId: null };
    const [rewardPoints, setRewardPoints] = useState(0);

    useEffect(() => {
        fetchRewardPoints();
    }, []);

    const fetchRewardPoints = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/reward-points/${officerId}`);
            const data = await response.json();
            setRewardPoints(data.totalRewardPoints || 0);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch reward points.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.welcomeText}>Welcome, {officerName}</Text>
            <View style={styles.quickActions}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddEntryScreen', { officerId })}>
                    <Text style={styles.buttonText}>Add New Weighing Entry</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ViewHistoryScreen', { officerId })}>
                    <Text style={styles.buttonText}>View History</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GenerateReportsScreen', { officerId })}>
                    <Text style={styles.buttonText}>Generate Reports</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.rewardPointsContainer}>
                <Text style={styles.rewardPointsText}>Total Reward Points: {rewardPoints} Points</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#F9F9F9',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    quickActions: {
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    rewardPointsContainer: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    rewardPointsText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default DashboardScreen;
