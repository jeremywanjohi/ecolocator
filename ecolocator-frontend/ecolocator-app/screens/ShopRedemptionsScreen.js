import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';

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
            <Text style={styles.redemptionText}>
                <Text style={styles.redemptionLabel}>User:</Text> {item.firstName} {item.lastName} ({item.email})
            </Text>
            <Text style={styles.redemptionText}>
                <Text style={styles.redemptionLabel}>Points Redeemed:</Text> {item.points_redeemed}
            </Text>
            <Text style={styles.redemptionText}>
                <Text style={styles.redemptionLabel}>Amount Redeemed:</Text> {item.amount_redeemed} KES
            </Text>
            <Text style={styles.redemptionText}>
                <Text style={styles.redemptionLabel}>Date:</Text> {new Date(item.date).toLocaleString()}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Redemptions for {shopName}</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#28a745" />
            ) : (
                <FlatList
                    data={redemptions}
                    renderItem={renderRedemption}
                    keyExtractor={(item) => (item.transaction_id ? item.transaction_id.toString() : Math.random().toString(36))}
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
        backgroundColor: '#f0f4f8',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#2d6a4f',
    },
    listContainer: {
        paddingBottom: 20,
    },
    redemptionContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    redemptionText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    redemptionLabel: {
        fontWeight: 'bold',
        color: '#2d6a4f',
    },
});

export default ShopRedemptionsScreen;
