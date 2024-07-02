import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';

const DirectionsScreen = ({ route, navigation }) => {
  const { center, userId, email } = route.params;
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLoading(false);
    })();
  }, []);

  const onReady = (result) => {
    setDistance(result.distance);
    setDuration(result.duration);
  };

  const handleConfirmArrival = () => {
    Alert.alert('Arrival Confirmed', 'You have arrived at the recycling center.');
    navigation.navigate('VerificationScreen', { email, userId });
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>This feature is not available on the web. Please use a mobile device.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="You are here"
        />
        <Marker
          coordinate={{
            latitude: parseFloat(center.Latitude),
            longitude: parseFloat(center.Longitude),
          }}
          title={center.CenterName}
        />
        <MapViewDirections
          origin={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          destination={{
            latitude: parseFloat(center.Latitude),
            longitude: parseFloat(center.Longitude),
          }}
          apikey="AIzaSyAYmbPdUmWlcHchJnx1LkIWw5B8l-ERFSo" // Replace with your Google Maps API Key
          strokeWidth={4}
          strokeColor="blue"
          onReady={onReady}
        />
      </MapView>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Following route:</Text>
        <View style={styles.routeContainer}>
          <Text style={styles.routeText}>Waiting for your arrival at {center.CenterName}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.exitButton}>
            <Text style={styles.exitButtonText}>Exit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleConfirmArrival} style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Confirm Arrival</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#f0f0f0',
  },
  map: {
    width: '100%',
    height: '80%',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 12,
  },
  infoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  routeContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  routeText: {
    fontSize: 17,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  exitButton: {
    backgroundColor: '#ccc',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 10,
  },
  exitButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
});

export default DirectionsScreen;


