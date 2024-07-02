// ManageRecyclingCentersScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal, StyleSheet, FlatList, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { GoogleMap, LoadScript, Marker as GoogleMarker } from '@react-google-maps/api';
import Sidebar from './Sidebar';

const ManageRecyclingCentersScreen = ({ route, navigation }) => {
    const { firstName, lastName } = route.params;
    const [recyclingCenters, setRecyclingCenters] = useState([]);
    const [newCenterName, setNewCenterName] = useState('');
    const [newCenterAddress, setNewCenterAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState({ latitude: -1.2921, longitude: 36.8219, lat: -1.2921, lng: 36.8219 }); // Default to Nairobi coordinates

    useEffect(() => {
        fetchRecyclingCenters();
    }, []);

    const fetchRecyclingCenters = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/recycling-centers_wl`);
            const data = await response.json();
            if (response.ok) {
                setRecyclingCenters(data);
            } else {
                Alert.alert('Error', data.message || 'Failed to fetch recycling centers.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while fetching recycling centers.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCenter = async () => {
        if (!newCenterName || !newCenterAddress) {
            Alert.alert('Error', 'Please enter both center name and address.');
            return;
        }

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/add-recycling-center`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newCenterName,
                    address: newCenterAddress,
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude
                }),
            });

            if (response.ok) {
                Alert.alert('Success', 'Recycling center added successfully');
                fetchRecyclingCenters();
                setNewCenterName('');
                setNewCenterAddress('');
                setModalVisible(false);
            } else {
                Alert.alert('Error', 'Failed to add recycling center.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while adding recycling center.');
        }
    };

    const handleRemoveCenter = async (centerId) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/remove-recycling-center`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ centerId }),
            });

            if (response.ok) {
                Alert.alert('Success', 'Recycling center removed successfully');
                fetchRecyclingCenters();
            } else {
                Alert.alert('Error', 'Failed to remove recycling center.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while removing recycling center.');
        }
    };

    const handleSelectLocation = (event) => {
        if (Platform.OS === 'web') {
            const { latLng } = event;
            setSelectedLocation({ latitude: latLng.lat(), longitude: latLng.lng(), lat: latLng.lat(), lng: latLng.lng() });
        } else {
            const { latitude, longitude } = event.nativeEvent.coordinate;
            setSelectedLocation({ latitude, longitude, lat: latitude, lng: longitude });
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.centerItem}>
            <View style={styles.centerInfo}>
                <Text style={styles.centerName}>{item.CenterName}</Text>
                <Text style={styles.centerLocation}>{item.Address}</Text>
                <Text style={styles.centerCoordinates}>Lat: {item.Latitude}, Lon: {item.Longitude}</Text>
            </View>
            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveCenter(item.CenterID)}>
                <Ionicons name="trash-outline" size={24} color="#FFF" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.outerContainer}>
            <Sidebar navigation={navigation} firstName={firstName} lastName={lastName} />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.title}>Manage Recycling Centers</Text>
                {loading ? (
                    <Text>Loading...</Text>
                ) : (
                    <FlatList
                        data={recyclingCenters}
                        renderItem={renderItem}
                        keyExtractor={item => item.CenterID.toString()}
                        contentContainerStyle={styles.listContainer}
                    />
                )}
                <View style={styles.addCenterContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Center Name"
                        value={newCenterName}
                        onChangeText={setNewCenterName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Center Address"
                        value={newCenterAddress}
                        onChangeText={setNewCenterAddress}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                        <Text style={styles.addButtonText}>Select Location</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addButton} onPress={handleAddCenter}>
                        <Text style={styles.addButtonText}>Add Center</Text>
                    </TouchableOpacity>
                </View>
                <Modal visible={modalVisible} animationType="slide">
                    <View style={styles.mapContainer}>
                        {Platform.OS === 'web' ? (
                            <LoadScript googleMapsApiKey="AIzaSyAYmbPdUmWlcHchJnx1LkIWw5B8l-ERFSo">
                                <GoogleMap
                                    mapContainerStyle={{ width: '100%', height: '400px' }}
                                    center={selectedLocation}
                                    zoom={10}
                                    onClick={handleSelectLocation}
                                >
                                    <GoogleMarker position={selectedLocation} />
                                </GoogleMap>
                            </LoadScript>
                        ) : (
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude: selectedLocation.latitude,
                                    longitude: selectedLocation.longitude,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}
                                onPress={handleSelectLocation}
                            >
                                <Marker coordinate={selectedLocation} />
                            </MapView>
                        )}
                        <TouchableOpacity style={styles.saveButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.saveButtonText}>Save Location</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    scrollViewContent: {
        flexGrow: 1,
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    listContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    centerItem: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    centerInfo: {
        flex: 1,
    },
    centerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    centerLocation: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    centerCoordinates: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    removeButton: {
        backgroundColor: '#FF6347',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addCenterContainer: {
        marginTop: 20,
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    input: {
        backgroundColor: '#F9F9F9',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        borderColor: '#DDD',
        borderWidth: 1,
    },
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    mapContainer: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        margin: 20,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ManageRecyclingCentersScreen;
