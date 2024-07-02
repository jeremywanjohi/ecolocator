import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Modal, Pressable, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { email } = route.params;

    const [userDetails, setUserDetails] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editField, setEditField] = useState('');
    const [editValue, setEditValue] = useState('');
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [alternativeEmail, setAlternativeEmail] = useState('');

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/user?email=${email}`);
            const data = await response.json();

            if (response.ok) {
                setUserDetails(data);
                setAlternativeEmail(data.alternativeEmail || '');
            } else {
                Alert.alert('Error', data.error || 'Failed to fetch user details.');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            Alert.alert('Error', 'An error occurred while fetching user details.');
        }
    };

    const handleChooseImage = () => {
        setModalVisible(true);
    };

    const uploadImage = async (uri, email) => {
        const formData = new FormData();
        formData.append('image', {
            uri,
            name: 'profile.jpg',
            type: 'image/jpeg'
        });
        formData.append('email', email);

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/upload-profile-picture`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const rawResponse = await response.text();
            console.log('Raw Response:', rawResponse);

            const data = JSON.parse(rawResponse);

            if (response.ok) {
                setUserDetails(prevDetails => ({ ...prevDetails, profilePicture: data.imageUrl }));
                Alert.alert('Success', 'Profile picture updated successfully!');
            } else {
                Alert.alert('Error', data.error || 'Failed to update profile picture. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'An error occurred. Please try again.');
        }
    };

    const handleImagePick = async (type) => {
        try {
            let result;

            if (type === 'camera') {
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });
            } else if (type === 'gallery') {
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });
            } else if (type === 'delete') {
                setUserDetails(prevDetails => ({ ...prevDetails, profilePicture: null }));
                setModalVisible(false);
                return;
            }

            if (!result.canceled) {
                await uploadImage(result.assets[0].uri, email);
                setModalVisible(false);
            }
        } catch (error) {
            alert('Error uploading image: ' + error.message);
            setModalVisible(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Yes", onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) }
            ]
        );
    };

    const handleEditInfo = (field, value) => {
        setEditField(field);
        setEditValue(value);
        setEditModalVisible(true);
    };

    const saveEditInfo = async () => {
        try {
            let response;
            if (editField === 'Email') {
                response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/update-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ oldEmail: userDetails.email, newEmail: editValue })
                });
            } else if (editField === 'Phone') {
                response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/update-phone`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: userDetails.email, phoneNumber: editValue })
                });
            } else if (editField === 'Preferred Location') {
                response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/update-preferred-location`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: userDetails.email, preferredLocation: editValue })
                });
            } else if (editField === 'Alternative Email') {
                response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/update-alternative-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: userDetails.email, alternativeEmail: editValue })
                });
            }

            const data = await response.json();

            if (response.ok) {
                setUserDetails(prevDetails => ({
                    ...prevDetails,
                    email: editField === 'Email' ? editValue : prevDetails.email,
                    phoneNumber: editField === 'Phone' ? editValue : prevDetails.phoneNumber,
                    preferredLocation: editField === 'Preferred Location' ? editValue : prevDetails.preferredLocation,
                    alternativeEmail: editField === 'Alternative Email' ? editValue : prevDetails.alternativeEmail,
                }));
                Alert.alert('Success', `${editField} updated successfully!`);
            } else {
                Alert.alert('Error', data.error || `Failed to update ${editField}. Please try again.`);
            }
        } catch (error) {
            console.error(`Error updating ${editField}:`, error);
            Alert.alert('Error', `An error occurred while updating ${editField}. Please try again.`);
        } finally {
            setEditModalVisible(false);
        }
    };

    const handleChangePassword = async () => {
        try {
            if (newPassword !== confirmPassword) {
                Alert.alert('Error', 'New password and confirm password do not match');
                return;
            }

            const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, oldPassword, newPassword, confirmPassword })
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Password updated successfully!');
                setPasswordModalVisible(false);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                Alert.alert('Error', data.error || 'Failed to update password. Please try again.');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            Alert.alert('Error', 'An error occurred while updating password. Please try again.');
        }
    };

    if (!userDetails.email) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text>Loading...</Text>
            </View>
        );
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Your Profile</Text>
            <View style={styles.profileContainer}>
                <View style={styles.imageWrapper}>
                    <TouchableOpacity onPress={handleChooseImage}>
                        {userDetails.profilePicture ? (
                            <Image source={{ uri: `${process.env.EXPO_PUBLIC_IP_ADDRESS}${userDetails.profilePicture}` }} style={styles.image} />
                        ) : (
                            <View style={styles.emptyImageContainer}>
                                <Ionicons name="camera-outline" size={40} color="#fff" />
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleChooseImage} style={styles.cameraButton}>
                        <Ionicons name="camera-outline" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.name}>{userDetails.firstName} {userDetails.lastName}</Text>
                <Text style={styles.description}>22 year old dev from the Country Side</Text>
                <Text style={styles.activeSince}>Active since - {formatDate(userDetails.registrationDate)}</Text>
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={20} color="#28a745" />
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{userDetails.email}</Text>
                    <TouchableOpacity onPress={() => handleEditInfo('Email', userDetails.email)} style={styles.editButton}>
                        <Ionicons name="pencil-outline" size={20} color="#28a745" />
                    </TouchableOpacity>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={20} color="#28a745" />
                    <Text style={styles.infoLabel}>Phone</Text>
                    <Text style={styles.infoValue}>{userDetails.phoneNumber}</Text>
                    <TouchableOpacity onPress={() => handleEditInfo('Phone', userDetails.phoneNumber)} style={styles.editButton}>
                        <Ionicons name="pencil-outline" size={20} color="#28a745" />
                    </TouchableOpacity>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={20} color="#28a745" />
                    <Text style={styles.infoLabel}>Preferred Recycling Location</Text>
                    <Text style={styles.infoValue}>{userDetails.preferredLocation || 'Not Set'}</Text>
                    <TouchableOpacity onPress={() => handleEditInfo('Preferred Location', userDetails.preferredLocation)} style={styles.editButton}>
                        <Ionicons name="pencil-outline" size={20} color="#28a745" />
                    </TouchableOpacity>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={20} color="#28a745" />
                    <Text style={styles.infoLabel}>Secondary Email</Text>
                    <Text style={styles.infoValue}>{alternativeEmail}</Text>
                    <TouchableOpacity onPress={() => handleEditInfo('Alternative Email', alternativeEmail)} style={styles.editButton}>
                        <Ionicons name="pencil-outline" size={20} color="#28a745" />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity onPress={() => setPasswordModalVisible(true)} style={[styles.button, styles.changePasswordButton]}>
                <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={[styles.button, styles.logoutButton]}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable style={styles.modalContainer} onPress={() => setModalVisible(false)}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Select Profile Picture</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={() => handleImagePick('camera')}>
                            <Text style={styles.modalButtonText}>Use Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={() => handleImagePick('gallery')}>
                            <Text style={styles.modalButtonText}>Choose from Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={() => handleImagePick('delete')}>
                            <Text style={styles.modalButtonText}>Delete Image</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Edit {editField}</Text>
                        <TextInput
                            style={styles.input}
                            value={editValue}
                            onChangeText={setEditValue}
                        />
                        <TouchableOpacity style={styles.modalButton} onPress={saveEditInfo}>
                            <Text style={styles.modalButtonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setEditModalVisible(false)}>
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={passwordModalVisible}
                onRequestClose={() => setPasswordModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Change Password</Text>
                        <Text style={styles.modalDescription}>Please enter your old password, new password, and confirm your new password to change your password.</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Old Password"
                            secureTextEntry
                            value={oldPassword}
                            onChangeText={setOldPassword}
                            placeholderTextColor="#A0A0A0"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="New Password"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholderTextColor="#A0A0A0"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm New Password"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholderTextColor="#A0A0A0"
                        />
                        <TouchableOpacity style={styles.modalButton} onPress={handleChangePassword}>
                            <Text style={styles.modalButtonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setPasswordModalVisible(false)}>
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f7f9fc',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    imageWrapper: {
        position: 'relative',
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    emptyImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#007bff',
        borderRadius: 20,
        padding: 5,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginVertical: 5,
    },
    activeSince: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    infoContainer: {
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
        flex: 1,
    },
    infoValue: {
        fontSize: 16,
        color: '#666',
    },
    editButton: {
        marginLeft: 10,
    },
    button: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    changePasswordButton: {
        backgroundColor: '#007bff',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#dc3545',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    modalDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButton: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#007bff',
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#6c757d',
    },
    input: {
        width: '100%',
        padding: 10,
        borderRadius: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
    },
    loadingContainer: { 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProfileScreen;
