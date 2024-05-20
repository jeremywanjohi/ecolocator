import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Import the useFocusEffect hook
import { Ionicons } from '@expo/vector-icons'; // Make sure you have @expo/vector-icons installed

const Homepage = ({ route, navigation }) => {
    const { firstName, lastName } = route.params;

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                // Prevent back navigation
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => navigation.reset({
                        index: 0,
                        routes: [{ name: 'Welcome' }],
                    })
                }
            ]
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome, {firstName} {lastName}!</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.pointsContainer}>
                <Text style={styles.pointsText}>You have</Text>
                <Text style={styles.points}>3000 RCOINS</Text>
            </View>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Stores, Coupons & Rewards</Text>
                <View style={styles.cardsContainer}>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Bata</Text>
                        <Text style={styles.cardDescription}>Enjoy 30% off discount at Bata</Text>
                        <Text style={styles.cardFooter}>60 days left</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Apple</Text>
                        <Text style={styles.cardDescription}>Enjoy 10% off discount at Apple</Text>
                        <Text style={styles.cardFooter}>72 days left</Text>
                    </View>
                </View>
            </View>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Activities</Text>
                <View style={styles.activitiesContainer}>
                    <TouchableOpacity style={styles.activity}>
                        <Ionicons name="location-outline" size={24} color="green" />
                        <Text style={styles.activityText}>Find Nearest Place</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.activity}>
                        <Ionicons name="recycle-outline" size={24} color="green" />
                        <Text style={styles.activityText}>Recycle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.activity}>
                        <Ionicons name="newspaper-outline" size={24} color="green" />
                        <Text style={styles.activityText}>News</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.activity}>
                        <Ionicons name="storefront-outline" size={24} color="green" />
                        <Text style={styles.activityText}>Stores & Rewards</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.activity}>
                        <Ionicons name="leaf-outline" size={24} color="green" />
                        <Text style={styles.activityText}>Types of Waste</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.activity}>
                        <Ionicons name="headset-outline" size={24} color="green" />
                        <Text style={styles.activityText}>Support</Text>
                    </TouchableOpacity>
                </View>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    pointsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    pointsText: {
        fontSize: 16,
        color: '#666',
    },
    points: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
        marginLeft: 5,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
        marginBottom: 5,
    },
    cardDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    cardFooter: {
        fontSize: 12,
        color: '#999',
    },
    activitiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    activity: {
        width: '48%',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
        alignItems: 'center',
        marginBottom: 15,
    },
    activityText: {
        fontSize: 14,
        color: '#666',
        marginTop: 10,
    },
    logoutButton: {
        backgroundColor: '#FF6347',
        padding: 8,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default Homepage;
