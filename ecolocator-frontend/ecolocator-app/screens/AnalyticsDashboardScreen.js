// AnalyticsDashboardScreen.js
import React, { useState, useEffect } from 'react';
import {
    VictoryBar, VictoryChart, VictoryTheme, VictoryTooltip, VictoryAxis, VictoryVoronoiContainer, VictoryPie
} from 'victory';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import Sidebar from './Sidebar';

const AnalyticsDashboardScreen = ({ route, navigation }) => {
    const { firstName, lastName } = route.params;
    const [bestCenters, setBestCenters] = useState([]);
    const [userRegistrations, setUserRegistrations] = useState([]);
    const [materialDistribution, setMaterialDistribution] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchBestCenters(), fetchUserRegistrations(), fetchMaterialDistribution()]);
        } finally {
            setLoading(false);
        }
    };

    const fetchBestCenters = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/stats/best-centers-weight`);
            const data = await response.json();
            if (response.ok) {
                const sortedData = data.sort((a, b) => a.total_weight - b.total_weight).map(center => ({
                    ...center,
                    total_weight: isNaN(center.total_weight) ? 0 : center.total_weight,
                    total_users: isNaN(center.total_users) ? 0 : center.total_users
                }));
                setBestCenters(sortedData);
            } else {
                alert('Error', data.message || 'Failed to fetch best centers.');
            }
        } catch (error) {
            alert('Error', 'An error occurred while fetching best centers.');
        }
    };

    const fetchUserRegistrations = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/stats/user-registrations`);
            const data = await response.json();
            if (response.ok) {
                const cleanedData = data.map(entry => ({
                    ...entry,
                    registrations: isNaN(entry.registrations) ? 0 : entry.registrations
                }));
                setUserRegistrations(cleanedData);
            } else {
                alert('Error', data.message || 'Failed to fetch user registrations.');
            }
        } catch (error) {
            alert('Error', 'An error occurred while fetching user registrations.');
        }
    };

    const fetchMaterialDistribution = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/stats/material-distribution`);
            const data = await response.json();
            if (response.ok) {
                const cleanedData = data.sort((a, b) => a.total_weight - b.total_weight).map(entry => ({
                    ...entry,
                    total_weight: isNaN(entry.total_weight) ? 0 : entry.total_weight
                }));
                setMaterialDistribution(cleanedData);
            } else {
                alert('Error', data.message || 'Failed to fetch material distribution.');
            }
        } catch (error) {
            alert('Error', 'An error occurred while fetching material distribution.');
        }
    };

    const renderSpinner = () => (
        <View style={styles.spinner} />
    );

    const renderBestCenters = () => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Best Performing Centers by Total Weight Recycled</Text>
            {bestCenters.length ? (
                <View style={styles.listContainer}>
                    {bestCenters.map(center => (
                        <View key={center.CenterID} style={styles.item}>
                            <Text style={styles.itemTitle}>{center.CenterName}</Text>
                            <Text style={styles.itemText}>
                                Total Weight Recycled: {Number(center.total_weight).toFixed(2)} kg
                            </Text>
                            <Text style={styles.itemText}>Total Users: {center.total_users}</Text>
                        </View>
                    ))}
                </View>
            ) : (
                <View>No data available.</View>
            )}
        </View>
    );

    const renderBarChart = (data, x, y, title, label) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{title}</Text>
            <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={20}
                containerComponent={<VictoryVoronoiContainer />}
            >
                <VictoryAxis
                    style={{
                        tickLabels: { angle: -45, fontSize: 12, padding: 10 },
                        axisLabel: { fontSize: 14, padding: 30 },
                        grid: { stroke: "none" }
                    }}
                />
                <VictoryAxis
                    dependentAxis
                    style={{
                        tickLabels: { fontSize: 12, padding: 10 },
                        axisLabel: { fontSize: 14, padding: 40 },
                        grid: { stroke: "#e0e0e0", strokeDasharray: "5,5" }
                    }}
                />
                <VictoryBar
                    data={data}
                    x={x}
                    y={y}
                    labels={({ datum }) => `${Number(datum[y]).toFixed(2)} ${label}`}
                    style={{
                        data: { fill: ({ index }) => `hsl(${index * 40}, 70%, 50%)`, width: 20 },
                        labels: { fontSize: 12, fill: "#333" }
                    }}
                    labelComponent={<VictoryTooltip />}
                    animate={{ duration: 500, onLoad: { duration: 1000 } }}
                />
            </VictoryChart>
        </View>
    );

    const renderPieChart = (data, x, y, title) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{title}</Text>
            <View style={styles.pieContainer}>
                <VictoryPie
                    data={data}
                    x={x}
                    y={y}
                    labels={({ datum }) => `${datum[x]}: ${Number(datum[y]).toFixed(2)} kg`}
                    style={{
                        labels: { fontSize: 12, fill: "#333" },
                    }}
                    colorScale={["#FF5733", "#33FF57", "#3357FF", "#FF33A5", "#FF8F33", "#33FFF8", "#8A33FF"]}
                    labelComponent={<VictoryTooltip />}
                    animate={{ duration: 500, onLoad: { duration: 1000 } }}
                />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Sidebar navigation={navigation} firstName={firstName} lastName={lastName} handleLogout={() => {}} />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                {loading ? renderSpinner() : (
                    <View style={styles.gridContainer}>
                        {renderBestCenters()}
                        <>
                            {renderBarChart(bestCenters, "CenterName", "total_weight", "Total Weight Recycled by Center", "kg")}
                            {renderBarChart(bestCenters, "CenterName", "total_users", "Total Users by Center", "users")}
                            {renderBarChart(userRegistrations, "month", "registrations", "User Registrations per Month", "users")}
                            {renderPieChart(materialDistribution, "CategoryName", "total_weight", "Material Distribution by Weight")}
                        </>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        padding: 20,
        backgroundColor: '#f0f8ff',
        fontFamily: 'Arial, sans-serif',
        lineHeight: 1.6,
    },
    gridContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        minHeight: 250,
        marginBottom: 20,
        flexBasis: '45%',
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        borderBottomWidth: 2,
        borderBottomColor: '#4CAF50',
        paddingBottom: 5,
    },
    listContainer: {
        paddingBottom: 20,
    },
    item: {
        backgroundColor: '#e8f5e9',
        padding: 15,
        borderRadius: 10,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: 10,
        textAlign: 'center',
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#388e3c',
    },
    itemText: {
        fontSize: 16,
        color: '#666',
    },
    spinner: {
        borderWidth: 16,
        borderColor: '#f3f3f3',
        borderTopWidth: 16,
        borderTopColor: '#4CAF50',
        borderRadius: 50,
        width: 120,
        height: 120,
        alignSelf: 'center',
        marginVertical: 50,
    },
    pieContainer: {
        width: '100%',
        height: 300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AnalyticsDashboardScreen;
