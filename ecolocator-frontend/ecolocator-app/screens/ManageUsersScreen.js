// ManageUsersScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import Sidebar from './Sidebar';

const ManageUsersScreen = ({ route, navigation }) => {
    const { firstName, lastName } = route.params;
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/users`);
            const data = await response.json();
            if (response.ok) {
                setUsers(data);
            } else {
                Alert.alert('Error', data.error || 'Failed to fetch users.');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            Alert.alert('Error', 'An error occurred while fetching users.');
        }
    };

    const handleDeleteUser = (userEmail) => {
        Alert.alert(
            "Delete User",
            "Are you sure you want to delete this user?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Yes", onPress: () => deleteUser(userEmail) }
            ]
        );
    };

    const deleteUser = async (userEmail) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/users/${userEmail}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: userEmail })
            });
            const data = await response.json();
            if (response.ok) {
                Alert.alert('Success', 'User deleted successfully!');
                fetchUsers(); // Refresh the user list
            } else {
                Alert.alert('Error', data.error || 'Failed to delete user.');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            Alert.alert('Error', 'An error occurred while deleting the user.');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.userContainer}>
            <Text style={styles.userText}>{item.firstName} {item.lastName}</Text>
            <Text style={styles.userText}>{item.email}</Text>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteUser(item.email)}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Sidebar navigation={navigation} firstName={firstName} lastName={lastName} handleLogout={() => {}} />
            <View style={styles.content}>
                <Text style={styles.title}>Manage Users</Text>
                <FlatList
                    data={users}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.email}
                    contentContainerStyle={styles.listContainer}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    content: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F9F9F9',
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
    userContainer: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
        marginBottom: 15,
    },
    userText: {
        fontSize: 16,
        color: '#333',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    editButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 10,
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default ManageUsersScreen;
