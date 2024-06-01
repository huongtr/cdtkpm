import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import React, { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Link } from 'expo-router';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import useLocationStore from '../store/locationStore';
import useUserStore from '../store/userStore';

const LocationSearchBar = ({ text, type }) => (
  <View style={styles.searchContainer}>
    <View style={styles.searchSection}>
      <Link href={`/(modal)/location-search?type=${type}`}  asChild>
          <TouchableOpacity style={styles.searchField} >
            <Ionicons style={styles.searchIcon} name="location-outline" size={20} color={Colors.medium} />
            <TextInput style={styles.input} placeholder={text} pointerEvents="none"/>
          </TouchableOpacity>
      </Link>
    </View>
  </View>
);

const CustomHeader = () => {
  const pickupLocation = useLocationStore((state) => state.pickupLocation);
  const destinationLocation = useLocationStore((state) => state.destinationLocation);
  const userData = useUserStore();

  console.log("pickup", pickupLocation);
  console.log("destination", destinationLocation);

  const [location, setLocation] = useState({
    latitude: 10.823099,
    longitude: 106.629662,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
          <Image
            style={styles.bike}
            source={require("@/assets/images/bike.png")}
          />

        <TouchableOpacity style={styles.titleContainer}>
          <Text style={styles.subtitle}>Hi {userData.firstName} {userData.lastName}!</Text>
          <Text style={styles.title}>Where are you going to?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <LocationSearchBar type="pickup" text={pickupLocation?.address || "Input pickup location"} />
      <LocationSearchBar type="destination" text={destinationLocation?.address || "Input destination"} />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  bike: {
    width: 30,
    height: 30,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    paddingTop: 6, 
    fontSize: 14,
    color: Colors.mediumDark,
  },
  locationName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileButton: {
    backgroundColor: Colors.lightGrey,
    padding: 10,
    borderRadius: 50,
  },
  searchContainer: {
    height: 50,
    backgroundColor: '#fff',
  },
  searchSection: {
    flexDirection: 'row',
    gap: 10,
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  searchField: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    padding: 10,
    color: Colors.mediumDark,
  },
  searchIcon: {
    paddingLeft: 10,
  },
  optionButton: {
    padding: 10,
    borderRadius: 50,
  },
  absoluteBox: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    margin: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  boxIcon: {
    position: 'absolute',
    left: 15,
    top: 18,
    zIndex: 1,
  },
});

export default CustomHeader;
