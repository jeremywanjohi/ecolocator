import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Animated, Easing } from 'react-native';

const RedeemPointsScreen = ({ route, navigation }) => {
    const { shop, userId, rewardPoints, updatePointsBalance, email } = route.params;
    const [pointsToRedeem, setPointsToRedeem] = useState('');
    const scaleValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: 500,
            easing: Easing.bounce,
            useNativeDriver: true,
        }).start();
    }, [scaleValue]);

    const handleRedeem = async () => {
        const points = parseInt(pointsToRedeem);

        if (isNaN(points) || points <= 0) {
            Alert.alert('Error', 'Please enter a valid number of points.');
            return;
        }

        if (points > rewardPoints) {
            Alert.alert('Error', 'You do not have enough points.');
            return;
        }

        Alert.alert(
            'Confirm Redemption',
            `Are you sure you want to redeem ${points} points at ${shop.name}?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        try {
                            const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/redeem-points`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    userId,
                                    shopId: shop.shop_id,
                                    points,
                                    email,
                                }),
                            });

                            const data = await response.json();
                            console.log('Server response:', data);

                            if (response.ok) {
                                Alert.alert('Success', `You have redeemed ${points} points for ${data.amount} KES at ${shop.name}.`);
                                updatePointsBalance(rewardPoints - points); // Update the points balance
                                navigation.goBack();
                            } else {
                                console.error('Failed to redeem points:', data);
                                Alert.alert('Error', data.error || 'Failed to redeem points.');
                            }
                        } catch (error) {
                            console.error('Error while redeeming points:', error);
                            Alert.alert('Error', 'An error occurred while redeeming points.');
                        }
                    },
                },
            ]
        );
    };

    return (
        <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
            <Text style={styles.title}>Redeem Points at {shop.name}</Text>
            <Text style={styles.label}>Available Points: <Text style={styles.points}>{rewardPoints}</Text></Text>
            <TextInput
                style={styles.input}
                value={pointsToRedeem}
                onChangeText={setPointsToRedeem}
                keyboardType="numeric"
                placeholder="Enter points to redeem"
                placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.button} onPress={handleRedeem}>
                <Text style={styles.buttonText}>Redeem Points</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 22,
        marginBottom: 10,
        textAlign: 'center',
        color: '#666',
    },
    points: {
        fontWeight: 'bold',
        color: '#28a745',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 20,
        width: '80%',
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    button: {
        backgroundColor: '#28a745',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default RedeemPointsScreen;
