// Sidebar.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Sidebar = ({ navigation, firstName, lastName, handleLogout }) => {
    return (
        <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
                <Text style={styles.welcomeText}>Admin {firstName} {lastName}</Text>
            </View>
            <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('ManageUsersScreen')}>
                <Ionicons name="people-outline" size={24} color="#4CAF50" />
                <Text style={styles.sidebarItemText}>Manage Users</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('ManageRewardsScreen')}>
                <Ionicons name="gift-outline" size={24} color="#FF9800" />
                <Text style={styles.sidebarItemText}>Manage Rewards</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('ManageRecyclingCentersScreen')}>
                <Ionicons name="recycle-outline" size={24} color="#03A9F4" />
                <Text style={styles.sidebarItemText}>Manage Recycling Centers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('AnalyticsDashboardScreen')}>
                <Ionicons name="stats-chart-outline" size={24} color="#9C27B0" />
                <Text style={styles.sidebarItemText}>Analytics Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="white" />
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    sidebar: {
        width: '30%',
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRightWidth: 1,
        borderRightColor: '#DDD',
    },
    sidebarHeader: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    sidebarItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#F5F5F5',
    },
    sidebarItemText: {
        fontSize: 18,
        marginLeft: 10,
        color: '#333',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF6347',
        padding: 10,
        borderRadius: 10,
        marginTop: 'auto',
    },
    logoutButtonText: {
        marginLeft: 10,
        color: 'white',
        fontSize: 18,
    },
});

export default Sidebar;
