import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const baseUrl = process.env.EXPO_PUBLIC_IP_ADDRESS;

      // Try user login
      const userResponse = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        Alert.alert('Success', userData.message || 'Login successful!');
        switch (userData.role) {
          case 'admin':
            navigation.navigate('AnalyticsDashboardScreen', { firstName: userData.firstName, lastName: userData.lastName });
            break;
          case 'weighing_officer':
            navigation.navigate('DashboardScreen', { firstName: userData.firstName, lastName: userData.lastName, email: userData.email, userId: userData.userId });
            break;
          default:
            navigation.navigate('Homepage', { firstName: userData.firstName, lastName: userData.lastName, email: userData.email, userId: userData.userId });
            break;
        }
      } else {
        // If user login fails, try shop login
        const shopResponse = await fetch(`${baseUrl}/shoplogin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (shopResponse.ok) {
          const shopData = await shopResponse.json();
          Alert.alert('Success', shopData.message || 'Login successful!');
          navigation.navigate('ShopRedemptionsScreen', { shopId: shopData.shopId, shopName: shopData.shopName });
        } else {
          const shopData = await shopResponse.json();
          Alert.alert('Error', shopData.error || 'Login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email to reset password.');
      return;
    }

    try {
      const baseUrl = process.env.EXPO_PUBLIC_IP_ADDRESS;
      const response = await fetch(`${baseUrl}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'A reset password link has been sent to your email.');
      } else {
        Alert.alert('Error', data.error || 'Failed to send reset password email. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          placeholderTextColor="#A0A0A0"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#A0A0A0"
        />
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <Pressable style={styles.link} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Don't have an account? Register</Text>
        </Pressable>
        <Pressable style={styles.link} onPress={handleForgotPassword}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    paddingVertical: 20,
  },
  formContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 12,
    paddingLeft: 16,
    backgroundColor: '#FFF',
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
  },
  linkText: {
    color: '#4CAF50',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LoginScreen;
