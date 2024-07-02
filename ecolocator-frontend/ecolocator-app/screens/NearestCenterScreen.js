import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as Location from 'expo-location';

const NearestCenterScreen = ({ route, navigation }) => {
  const { userId, email, selectedMaterials } = route.params ?? { userId: null, selectedMaterials: [], email: null };
  const [location, setLocation] = useState(null);
  const [recyclingCenters, setRecyclingCenters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        setIsLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      fetchRecyclingCenters(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const fetchRecyclingCenters = async (latitude, longitude) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/recycling-centers?lat=${latitude}&lng=${longitude}`);
      const data = await response.json();

      console.log("Recycling Centers Data: ", data); // Debugging statement

      // Ensure that the response is an array
      if (Array.isArray(data)) {
        setRecyclingCenters(data);
      } else {
        console.error("API response is not an array:", data);
        setRecyclingCenters([]);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Fetch Recycling Centers Error: ", error); // Debugging statement
      Alert.alert('Error', 'Failed to fetch recycling centers.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Select a place to go:</Text>
      {recyclingCenters.map((center) => (
        <TouchableOpacity key={center.CenterID} style={styles.centerCard} onPress={() => navigation.navigate('DirectionsScreen', { center, userId, email })}>
          <View>
            <Text style={styles.centerName}>{center.CenterName}</Text>
            <Text style={styles.centerAddress}>{center.Address}</Text>
          </View>
          <Text style={styles.centerDistance}>{center.Distance.toFixed(2)} meters</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  centerCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  centerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  centerAddress: {
    fontSize: 14,
    color: '#666',
  },
  centerDistance: {
    fontSize: 14,
    color: 'green',
  },
});

export default NearestCenterScreen;
