// AdminHomepage.js
import React from 'react';
import { View, Text, StyleSheet, Alert, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; 
import Sidebar from './Sidebar';

const AdminHomepage = ({ route, navigation }) => {
    const { firstName, lastName } = route.params;

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => true;

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => navigation.reset({
                        index: 0,
                        routes: [{ name: 'Welcome' }],
                    })
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Sidebar navigation={navigation} firstName={firstName} lastName={lastName} handleLogout={handleLogout} />
            <View style={styles.content}>
                <Text style={styles.contentText}>Select an option from the sidebar</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentText: {
        fontSize: 22,
        color: '#333',
    },
});

export default AdminHomepage;
