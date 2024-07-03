import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView, BackHandler } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import images from '../assets/images';

const Homepage = ({ route }) => {
    const { firstName, lastName, email, phoneNumber, userId } = route.params || { firstName: 'John', lastName: 'Doe', phoneNumber: '123456', email: 'Jr@example.com', userId: 1 };
    const [pointsBalance, setPointsBalance] = useState(0);
    const navigation = useNavigation();

    useEffect(() => {
        fetchPointsBalance();
    }, []);

    const fetchPointsBalance = async () => {
        try {
            console.log(`Fetching reward points for user ID: ${userId}`);
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/reward-points/${userId}`);
            const data = await response.json();
            console.log('Fetched Reward Points:', data);
            if (response.ok && data.points_balance !== undefined) {
                setPointsBalance(data.points_balance);
            } else {
                Alert.alert('Error', 'Unable to retrieve your reward points at this time.');
            }
        } catch (error) {
            console.error('Error fetching reward points:', error);
            Alert.alert('Error', 'There was an issue fetching your reward points. Please try again later.');
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => true;
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome, <Text style={styles.highlightText}>{firstName} {lastName}</Text>!</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', { firstName, lastName, email, phoneNumber })}>
                        <Ionicons name="person-circle-outline" size={28} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.pointsContainer}>
                <Text style={styles.pointsTitle}>Your Reward Points</Text>
                <Text style={styles.points}>{pointsBalance}</Text>
                <Text style={styles.pointsSubText}>+20% increase month-over-month</Text>
            </View>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>What would you like to do?</Text>
                <Text style={styles.subHeading}>Select an activity to get started</Text>
                <View style={styles.activitiesContainer}>
                    <TouchableOpacity style={styles.activity} onPress={() => navigation.navigate('MapScreen', { email, userId })}>
                        <View style={styles.imageContainer}>
                            <Image style={styles.activityIcon} source={images.map} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.activityText}>Find Nearest Center</Text>
                            <Text style={styles.activitySubText}>Locate nearby recycling centers</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.activity} onPress={() => navigation.navigate('RewardPointsScreen', { userId, email })}>
                        <View style={styles.imageContainer}>
                            <Image style={styles.activityIcon} source={images.store} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.activityText}>Rewards</Text>
                            <Text style={styles.activitySubText}>View and redeem your points</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.activity} onPress={() => navigation.navigate('TypesOfWasteScreen')}>
                        <View style={styles.imageContainer}>
                            <Image style={styles.activityIcon} source={require('../assets/waste.png')} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.activityText}>Types of Waste</Text>
                            <Text style={styles.activitySubText}>Learn more about waste types</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.activity}>
                        <View style={styles.imageContainer}>
                            <Image style={styles.activityIcon} source={require('../assets/help-desk.png')} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.activityText}>Support</Text>
                            <Text style={styles.activitySubText}>Get help and support</Text>
                        </View>
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
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    highlightText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'green',
    },
    pointsContainer: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    pointsTitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 5,
    },
    points: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'green',
    },
    pointsSubText: {
        fontSize: 16,
        color: '#999',
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subHeading: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
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
        height: 200,
    },
    imageContainer: {
        width: '100%',
        height: '60%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityIcon: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    textContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    activitySubText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
});

export default Homepage;
