import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RewardPointsScreen = ({ route, navigation }) => {
    const { email, userId } = route.params;

    const [rewardPoints, setRewardPoints] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [shops, setShops] = useState([]);

    const imageMap = {
        "../assets/green_haven.png": require('../assets/green_haven.png'),
        "../assets/sustainable_threads.png": require('../assets/sustainable_threads.png'),
        "../assets/nairobi_naturals.png": require('../assets/nairobi_naturals.png'),
        "../assets/zerowaste_haven.png": require('../assets/zerowaste_haven.png'),
    };

    const getImageUrl = (relativePath) => {
        return imageMap[relativePath];
    };

    useEffect(() => {
        fetchRewardPoints();
        fetchShops();
    }, []);

    const fetchRewardPoints = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/reward-points/${userId}`);
            const data = await response.json();
            console.log('Fetched Reward Points:', data);

            if (response.ok && data.points_balance !== undefined) {
                setRewardPoints(data.points_balance);
            } else {
                Alert.alert('Error', 'Failed to fetch reward points.');
            }
        } catch (error) {
            console.error('Error fetching reward points:', error);
            Alert.alert('Error', 'An error occurred while fetching reward points.');
        }
    };

    const fetchShops = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/shops`);
            const data = await response.json();
            console.log('Fetched Shops:', data);
            setShops(data);
        } catch (error) {
            console.error('Error fetching shops:', error);
            Alert.alert('Error', 'An error occurred while fetching shops.');
        }
    };

    const filteredShops = shops.filter(shop =>
        shop.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const updatePointsBalance = (newBalance) => {
        setRewardPoints(newBalance);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.shopItem}
            onPress={() => navigation.navigate('RedeemPointsScreen', { shop: item, userId, rewardPoints, updatePointsBalance, email })}
        >
            <Image source={getImageUrl(item.image_url)} style={styles.shopImage} />
            <Text style={styles.shopName}>{item.name}</Text>
            <Text style={styles.shopLocation}>{item.location}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Rewards</Text>
                <View style={styles.pointsContainer}>
                    <Text style={styles.pointsLabel}>Reward Points</Text>
                    <Text style={styles.pointsValue}>{rewardPoints} RCOINS</Text>
                    <Text style={styles.pointsChange}>+20% month over month</Text>
                </View>
            </View>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <Text style={styles.subTitle}>Where to Redeem</Text>
            <FlatList
                data={filteredShops}
                renderItem={renderItem}
                keyExtractor={item => item.shop_id.toString()}
                contentContainerStyle={styles.shopList}
                numColumns={2}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    pointsContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    pointsLabel: {
        fontSize: 18,
        color: '#666',
    },
    pointsValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'green',
    },
    pointsChange: {
        fontSize: 16,
        color: '#999',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        color: '#333',
    },
    subTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    shopList: {
        justifyContent: 'space-between',
    },
    shopItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        width: '48%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    shopImage: {
        width: '100%',
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
    },
    shopName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    shopLocation: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
});

export default RewardPointsScreen;
