import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import MapView from 'react-native-maps';
import Colors from '@/constants/Colors';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Ionicons } from '@expo/vector-icons';
import useLocationStore from '@/store/locationStore';
import { useRoute } from '@react-navigation/native'; // Adjust based on your router library


const LocationSearch = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { type } = route.params;

  const handlePlaceSelection = (data, details) => {
    const point = details?.geometry?.location;

    if (!point) return;

    if (type === 'pickup') {
      useLocationStore.setState((state) => ({
        pickupLocation: {
          ...state.pickupLocation,
          latitude: point.lat,
          longitude: point.lng,
          address: data.description,
        },
      }));
    } else if (type === 'destination') {
      useLocationStore.setState((state) => ({
        destinationLocation: {
          ...state.destinationLocation,
          latitude: point.lat,
          longitude: point.lng,
          address: data.description,
        },
      }));
    }
  };

  const handlePlaceFetchFailure = (error) => {
    console.log(error);
    // Fallback to a default destination location if Google API fails
    const defaultDestinationLocation = {
      latitude: 10.776340,
      longitude: 106.687000,
      address: '12 Vo Thi Sau, District 3, Ho Chi Minh',
    };

    if (type === 'destination') {
      useLocationStore.setState((state) => ({
        destinationLocation: defaultDestinationLocation,
      }));
    }
  };


  return (
    <View style={{ flex: 1, height: '100%' }}>
      <GooglePlacesAutocomplete
        placeholder="Search or move the map"
        fetchDetails={true}
        onPress={handlePlaceSelection}
        // onFail={error => console.error(error)}
        onFail={error => handlePlaceFetchFailure(error)}

        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
          language: 'en',
        }}
        renderLeftButton={() => (
          <View style={styles.boxIcon}>
            <Ionicons name="search-outline" size={24} color={Colors.medium} />
          </View>
        )}
        styles={{
          container: {
            flex: 0,
          },
          textInput: {
            backgroundColor: Colors.grey,
            paddingLeft: 35,
            borderRadius: 10,
          },
          textInputContainer: {
            padding: 8,
            backgroundColor: '#fff',
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
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

export default LocationSearch;
