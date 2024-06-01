import { Text, ScrollView, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';

import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { useNavigation } from 'expo-router';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Link } from 'expo-router';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import BottomSheet from '@/Components/BottomSheet';
import * as Location from 'expo-location';
import useLocationStore from '../store/locationStore';
import MapViewDirections from 'react-native-maps-directions';
import useUserStore from '@/store/userStore';


const Main = () => {
  const mapViewRef = useRef(null);
  const navigation = useNavigation();
  const { pickupLocation, destinationLocation } = useLocationStore();
  const userData = useUserStore();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const openConfirmModal = () => {
    console.log('Confirm ride', {...pickupLocation, ...destinationLocation});
    bottomSheetRef.current?.present();
  };

  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Function to request location permission and retrieve current location
    const getLocationAsync = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          throw new Error("Location permission not granted");
        }

        const location = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        });

        useLocationStore.setState((state) => ({
          pickupLocation: {
            ...state.pickupLocation,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        }));
      } catch (error) {
        Alert.alert(
          "Error",
          "Failed to get current location. Please check your location settings."
        );
        console.error("Location error:", error);
      }
    };

    getLocationAsync();
  }, []);

  useEffect(() => {
    // Function to perform reverse geocoding and set address in pickup location TextInput
    const getAddressFromLocation = async () => {
      if (location) {
        try {
          const address = await Location.reverseGeocodeAsync({
            latitude: location.latitude,
            longitude: location.longitude,
          });

          console.log("address", address);
          // Assuming address is an array of objects containing address information
          // You may need to adjust this based on the response from reverseGeocodeAsync
          const formattedAddress = `${address[0].streetNumber}, ${address[0].street}, ${address[0].subregion}, ${address[0].city}, ${address[0].country}`;
          useLocationStore.setState((state) => ({
            pickupLocation: {
              ...state.pickupLocation,
              address: formattedAddress,
            },
          }));
        } catch (error) {
          console.error("Reverse geocoding error:", error);
        }
      }
    };

    getAddressFromLocation();
  }, [location]);

  useEffect(() => {
    // Fit the map to the coordinates of pickup and destination locations
    if (mapViewRef.current && pickupLocation && destinationLocation) {
      const coordinates = [pickupLocation, destinationLocation];
      mapViewRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    }
  }, [pickupLocation, destinationLocation]);

  return (
    <View style={styles.container}>
      <BottomSheet ref={bottomSheetRef} />
      <MapView ref={mapViewRef} showsUserLocation={true} style={styles.map} region={{...pickupLocation, latitudeDelta: 0.03,
            longitudeDelta: 0.03}}>
        {pickupLocation && (
          <Marker coordinate={pickupLocation} title="Pickup" />
        )}
        {destinationLocation && (
          <Marker coordinate={destinationLocation} title="Destination" />
        )}
        {pickupLocation && destinationLocation && (
          <MapViewDirections
            origin={pickupLocation}
            destination={destinationLocation}
            apikey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY}
            strokeWidth={4}
            strokeColor="hotpink"
          />
        )}
      </MapView>
      <View style={styles.absoluteBox}>
        <TouchableOpacity style={styles.button} onPress={openConfirmModal}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.lightGrey,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  map: {
    flex: 1,
  },
  absoluteBox: {
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    margin: 16,
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  boxIcon: {
    position: "absolute",
    left: 15,
    top: 18,
    zIndex: 1,
  },
});

export default Main;
