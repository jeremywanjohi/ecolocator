import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CheckBox } from 'react-native-elements';

const MapScreen = ({ route, navigation }) => {
  const { userId = null, email = null } = route.params ?? {};
  const [materials, setMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/materials`);
      if (!response.ok) {
        throw new Error('Failed to fetch materials.');
      }
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to fetch materials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMaterial = (materialId) => {
    setSelectedMaterials((prevSelectedMaterials) => {
      if (prevSelectedMaterials.includes(materialId)) {
        return prevSelectedMaterials.filter((id) => id !== materialId);
      } else {
        return [...prevSelectedMaterials, materialId];
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedMaterials.length === 0) {
      Alert.alert('Error', 'Please select at least one material.');
      return;
    }

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/recycle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          materials: selectedMaterials,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Materials recycled successfully.');
        navigation.navigate('NearestCenterScreen', { userId, email, selectedMaterials });
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'Failed to recycle materials.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while recycling materials.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Select Materials to Recycle</Text>
      {materials.map((material) => (
        <CheckBox
          key={material.CategoryID}
          title={material.CategoryName}
          checked={selectedMaterials.includes(material.CategoryID)}
          onPress={() => handleSelectMaterial(material.CategoryID)}
        />
      ))}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Recycle</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MapScreen;
