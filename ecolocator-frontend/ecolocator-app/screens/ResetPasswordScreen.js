import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';

const ShopRedemptionsScreen = ({ route }) => {
    const { shopId, shopName } = route.params;
    const [redemptions, setRedemptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRedemptions();
    }, []);

    const fetchRedemptions = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/shop-redemptions/${shopId}`);
            if (response.ok) {
                const data = await response.json();
                console.log('Redemptions data:', data);  // Added logging for debug
                setRedemptions(data);
            } else {
                const errorData = await response.json();
                Alert.alert('Error', errorData.error || 'Failed to fetch redemptions.');
            }
        } catch (error) {
            console.error('Error fetching redemptions:', error);
            Alert.alert('Error', 'An error occurred while fetching redemptions.');
        } finally {
            setLoading(false);
        }
    };

    const renderRedemption = ({ item }) => (
        <View style={styles.redemptionContainer}>
            <Text style={styles.redemptionText}>User: {item.firstName} {item.lastName} ({item.email})</Text>
            <Text style={styles.redemptionText}>Points Redeemed: {item.points_redeemed}</Text>
            <Text style={styles.redemptionText}>Amount Redeemed: {item.amount_redeemed} KES</Text>
            <Text style={styles.redemptionText}>Date: {new Date(item.date).toLocaleString()}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Redemptions for {shopName}</Text>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={redemptions}
                    renderItem={renderRedemption}
                    keyExtractor={(item) => item.redemption_id ? item.redemption_id.toString() : Math.random().toString(36)}  // Updated keyExtractor
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    listContainer: {
        paddingBottom: 20,
    },
    redemptionContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    redemptionText: {
        fontSize: 16,
        color: '#333',
    },
});

export default ShopRedemptionsScreen;
