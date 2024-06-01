import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from 'expo-router';
import Colors from '@/constants/Colors';

const SignUp = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const handleSignUp = async () => {
    let formIsValid = true;
    const newErrors = { ...errors };

    // Validation
    if (!username) {
      newErrors.username = "Username is required";
      formIsValid = false;
    } else {
      newErrors.username = "";
    }

    if (!password) {
      newErrors.password = "Password is required";
      formIsValid = false;
    } else {
      newErrors.password = "";
    }

    if (!firstName) {
      newErrors.firstName = "First Name is required";
      formIsValid = false;
    } else {
      newErrors.firstName = "";
    }

    if (!lastName) {
      newErrors.lastName = "Last Name is required";
      formIsValid = false;
    } else {
      newErrors.lastName = "";
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone Number is required";
      formIsValid = false;
    } else {
      newErrors.phoneNumber = "";
    }

    setErrors(newErrors);

    if (formIsValid) {
      // Proceed with sign-up process
      try {
        const response = await fetch('http://localhost:3000/signup', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
            mobile_phone: phoneNumber,
            first_name: firstName,
            last_name: lastName
          }),
        });

        const data = await response.json();

        if (response.ok) {
          Alert.alert("Success", "You have signed up successfully");
          navigation.navigate("index");
        } else {
          console.log(data.error);
          Alert.alert("Error", "Something went wrong");
        }
      } catch (error) {
        Alert.alert("Error", "Network error, please try again later");
      }
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
      <Text style={styles.error}>{errors.username}</Text>

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />
      <Text style={styles.error}>{errors.password}</Text>

      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Enter your first name"
      />
      <Text style={styles.error}>{errors.firstName}</Text>

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Enter your last name"
      />
      <Text style={styles.error}>{errors.lastName}</Text>

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
      />
      <Text style={styles.error}>{errors.phoneNumber}</Text>
      <TouchableOpacity style={styles.fullButton} onPress={handleSignUp}>
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
    marginBottom: 30
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
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    alignSelf: 'flex-start',
    marginBottom: 10,
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

export default SignUp;
