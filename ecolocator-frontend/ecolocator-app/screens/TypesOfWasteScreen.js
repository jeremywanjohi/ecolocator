import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const wasteTypes = [
  { id: '1', type: 'Paper', description: 'Newspapers, magazines, office paper, cardboard, etc.' },
  { id: '2', type: 'Glass', description: 'Bottles, jars, and other glass containers.' },
  { id: '3', type: 'Plastic', description: 'Bottles, containers, and various plastic items.' },
  { id: '4', type: 'Metal', description: 'Cans, tins, and aluminum foil.' },
  { id: '5', type: 'Electronics', description: 'Old electronics, cables, and batteries.' },
  { id: '6', type: 'Textiles', description: 'Old clothes, fabrics, and textiles.' },
];

const TypesOfWasteScreen = () => {
  const renderWasteItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.type}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Types of Waste</Text>
      <FlatList
        data={wasteTypes}
        renderItem={renderWasteItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  list: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 10,
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
  },
});

export default TypesOfWasteScreen;
