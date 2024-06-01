import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from 'expo-router';
import Colors from '@/constants/Colors';
import useUserStore from '@/store/userStore';

const Page = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const setUser = useUserStore((state) => state.setUser);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful login
        console.log("Login successful:", data);
        useUserStore.setState((state) => ({
          firstName: data.data.first_name,
          lastName: data.data.last_name,
          userId: data.data.id,
        }));
        navigation.navigate("main");
        // Navigate to the next screen or update state as needed
      } else {
        // Handle login error
        console.error("Error:", data.error);
        Alert.alert('Login Failed', 'Invalid username or password');
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert('Error', 'An error occurred while logging in. Please try again later.');
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your username"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />
      <TouchableOpacity style={styles.fullButton} onPress={handleLogin}>
        <Text style={styles.footerText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.signUpText}>Don't have an account yet?</Text>
      <TouchableOpacity style={styles.fullButton} onPress={() => { navigation.navigate('signup');}}>
        <Text style={styles.footerText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  signUpText: {
    marginTop: 20,
    marginBottom: 10,
    color: Colors.mediumDark
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 18,
  },
  fullButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  footerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Page;