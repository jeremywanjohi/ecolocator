import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

const ViewHistoryScreen = ({ route }) => {
    const { officerId } = route.params ?? { officerId: null };
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/view-history/${officerId}`);
            const data = await response.json();
            setHistory(data);
            setIsLoading(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch history.');
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const tableHead = ['Date', 'Material', 'Weight', 'Center', 'Reward Points'];
    const tableData = history.map(entry => [
        entry.RecycleDate,
        entry.MaterialType,
        entry.Weight,
        entry.CenterID,
        entry.PointsEarned
    ]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>View History</Text>
            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                <Row data={tableHead} style={styles.head} textStyle={styles.text} />
                <Rows data={tableData} textStyle={styles.text} />
            </Table>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Export CSV</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Export Excel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Export PDF</Text>
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
    },
    head: {
        height: 40,
        backgroundColor: '#f1f8ff',
    },
    text: {
        margin: 6,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ViewHistoryScreen;
