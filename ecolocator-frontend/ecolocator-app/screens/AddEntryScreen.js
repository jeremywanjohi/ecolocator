import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const AddEntryScreen = ({ route, navigation }) => {
    const { officerId, email } = route.params ?? { officerId: null, email: null };
    const [userEmail, setUserEmail] = useState(email);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [materialType, setMaterialType] = useState('Plastic');
    const [weight, setWeight] = useState('');
    const [recyclingCenters, setRecyclingCenters] = useState([]);
    const [selectedCenter, setSelectedCenter] = useState('');

    useEffect(() => {
        fetchRecyclingCenters();
    }, []);

    const fetchRecyclingCenters = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/recycling-centers_wl`);
            const data = await response.json();
            setRecyclingCenters(Array.isArray(data) ? data : []);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch recycling centers.');
            setRecyclingCenters([]);
        }
    };

    const handleSubmit = async () => {
        if (!selectedCenter || !weight || !userEmail) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/add-weighing-entry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userEmail,
                    date,
                    materialType,
                    weight,
                    centerId: selectedCenter,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                Alert.alert('Success', `Weighing entry added successfully. Reward Points: ${data.rewardPoints}`);
                navigation.navigate('DashboardScreen');
            } else {
                const errorData = await response.json();
                console.error('Failed to add weighing entry:', errorData);
                Alert.alert('Error', errorData.error || 'Failed to add weighing entry.');
            }
        } catch (error) {
            console.error('Error while adding weighing entry:', error);
            Alert.alert('Error', 'An error occurred while adding weighing entry.');
        }
    };

    const showDateTimePicker = () => {
        setShowDatePicker(true);
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Add New Weighing Entry</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>User Email:</Text>
                <TextInput
                    style={styles.input}
                    value={userEmail}
                    onChangeText={setUserEmail}
                    keyboardType="email-address"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Date & Time:</Text>
                <TouchableOpacity onPress={showDateTimePicker} style={styles.dateTimePickerButton}>
                    <Text style={styles.dateTimePickerButtonText}>{date.toLocaleString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="datetime"
                        display="default"
                        onChange={onDateChange}
                        style={styles.dateTimePicker}
                    />
                )}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Material Type:</Text>
                <Picker
                    selectedValue={materialType}
                    onValueChange={(itemValue) => setMaterialType(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Plastic" value="Plastic" />
                    <Picker.Item label="Paper" value="Paper" />
                    <Picker.Item label="Glass" value="Glass" />
                    <Picker.Item label="Metal" value="Metal" />
                    <Picker.Item label="Electronics" value="Electronics" />
                    <Picker.Item label="Textiles" value="Textiles" />
                    <Picker.Item label="Organic" value="Organic" />
                </Picker>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Weight (kg):</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={weight}
                    onChangeText={setWeight}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Recycling Center:</Text>
                <Picker
                    selectedValue={selectedCenter}
                    onValueChange={(itemValue) => setSelectedCenter(itemValue)}
                    style={styles.picker}
                >
                    {recyclingCenters.map((center) => (
                        <Picker.Item key={center.CenterID} label={`${center.CenterName} - ${center.Address}`} value={center.CenterID} />
                    ))}
                </Picker>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    dateTimePickerButton: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    dateTimePickerButtonText: {
        fontSize: 16,
    },
    dateTimePicker: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    picker: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 5,
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

export default AddEntryScreen;
