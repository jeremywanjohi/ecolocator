import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const GenerateReportsScreen = ({ route }) => {
    const { officerId } = route.params ?? { officerId: null };
    const [reportType, setReportType] = useState('Daily');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [report, setReport] = useState(null);

    const handleGenerateReport = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/generate-report?reportType=${reportType}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
            const data = await response.json();
            setReport(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to generate report.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Generate Reports</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Report Type:</Text>
                <Picker
                    selectedValue={reportType}
                    onValueChange={(itemValue) => setReportType(itemValue)}
                >
                    <Picker.Item label="Daily" value="Daily" />
                    <Picker.Item label="Weekly" value="Weekly" />
                    <Picker.Item label="Monthly" value="Monthly" />
                </Picker>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Start Date:</Text>
                <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        const currentDate = selectedDate || startDate;
                        setStartDate(currentDate);
                    }}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>End Date:</Text>
                <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        const currentDate = selectedDate || endDate;
                        setEndDate(currentDate);
                    }}
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleGenerateReport}>
                <Text style={styles.buttonText}>Generate Report</Text>
            </TouchableOpacity>
            {report && (
                <View style={styles.reportContainer}>
                    <Text style={styles.reportTitle}>Report</Text>
                    {report.map((entry, index) => (
                        <Text key={index} style={styles.reportText}>{JSON.stringify(entry)}</Text>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#F9F9F9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
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
    reportContainer: {
        marginTop: 20,
    },
    reportTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    reportText: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default GenerateReportsScreen;
