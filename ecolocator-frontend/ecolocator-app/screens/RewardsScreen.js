// RewardsScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const rewards = [
  { id: '1', title: '30% off at Bata', expires: '60 days left' },
  { id: '2', title: '10% off at Apple', expires: '72 days left' },
];

const stores = [
  { id: '1', name: 'Bata', description: 'Recycle here and get discounts' },
  { id: '2', name: 'Apple', description: 'Recycle here and get discounts' },
];

const RewardsScreen = () => {
  const renderRewardItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardFooter}>{item.expires}</Text>
    </View>
  );

  const renderStoreItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Rewards</Text>
      <FlatList
        data={rewards}
        renderItem={renderRewardItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <Text style={styles.sectionTitle}>Available Stores</Text>
      <FlatList
        data={stores}
        renderItem={renderStoreItem}
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
  cardFooter: {
    fontSize: 12,
    color: '#999',
  },
});

export default RewardsScreen;
