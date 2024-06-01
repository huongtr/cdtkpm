import { StyleSheet, View, Alert, Modal, Text,TouchableOpacity } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import MapView from 'react-native-maps';
import { useNavigation } from 'expo-router';
import * as Location from 'expo-location';
import useUserStore from '@/store/userStore';
import socketIOClient from 'socket.io-client';
import Colors from '@/constants/Colors';

const Main = () => {
  const mapViewRef = useRef(null);
  const navigation = useNavigation();
  const userData = useUserStore();

  const [location, setLocation] = useState(null);
  const [socket, setSocket] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [rideId, setRideId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [rideInfo, setRideInfo] = useState({});


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
      } catch (error) {
        Alert.alert(
          "Error",
          "Failed to get current location. Please check your location settings."
        );
        console.error("Location error:", error);
      }
    };

    getLocationAsync();

    const socket = socketIOClient('ws://localhost:3001');
    setSocket(socket);

    socket.on('connect', () => {
      console.log('WebSocket connection established');
      socket.emit('add_session', { driver_id: userData.userId });
    });

    socket.on("ride_requested", async (data) => {
      const pickupAddress = await Location.reverseGeocodeAsync({
        latitude: data.pickup_location.latitude,
        longitude: data.pickup_location.longitude,
      });
      const dropoffAddress = await Location.reverseGeocodeAsync({
        latitude: data.dropoff_location.latitude,
        longitude: data.dropoff_location.longitude,
      });

      const formatAddress = (address) => {
        return `${address[0].streetNumber}, ${address[0].street}, ${address[0].district}, ${address[0].subregion},  ${address[0].city}`;
      };

      setPickupLocation(formatAddress(pickupAddress));
      setDropoffLocation(formatAddress(dropoffAddress));
      setRideId(data.ride_id);
      setShowModal(true);
    });

    socket.on("request_accepted", async (data) => {
      try {
        // Fetch user information from the server
        console.log("request accepted: ");
        const response = await fetch(
          `http://localhost:3000/users/${data.user_id}`
        );
        const userData = await response.json();
        console.log("get user data: ", userData);

        setRideInfo({
          userName: `${userData.data.first_name} ${userData.data.last_name}`,
          userPhone: userData.data.mobile_phone
        });
        setShowInfoModal(true);
      } catch (error) {
        console.error("Error: ", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("WebSocket connection closed");
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    let locationSubscription;

    const startLocationUpdates = async () => {
      locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          setLocation((prevLocation) => ({
            ...prevLocation,
            latitude,
            longitude,
          }));

          if (socket) {
            console.log('location', latitude, longitude)
            socket.emit('update_location', {
              driver_id: userData.userId, // replace with dynamic driver_id if needed
              longitude: longitude,
              latitude: latitude,
            });
          }
        }
      );
    };

    startLocationUpdates();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [socket]);

  const handleAccept = () => {
    if(socket) {
      socket.emit("accept_ride", { ride_id: rideId });
    }
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapViewRef}
        showsUserLocation={true}
        style={styles.map}
        region={location}
      />
      {/* Modal for displaying pickup location */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.locationLabel}>Pickup Location:</Text>
            <Text>{pickupLocation}</Text>
            <Text style={styles.locationLabel}>Dropoff Location:</Text>
            <Text>{dropoffLocation}</Text>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={handleAccept}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for displaying ride info */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showInfoModal}
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Ride accepted!</Text>
            <Text style={styles.modalText}>
              You're on your way to pick up {rideInfo.userName} at {pickupLocation}.
            </Text>
            <Text>Rider's phone number: {rideInfo.userPhone}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowInfoModal(false)}>
              <Text style={styles.closeButtonText}>Let's go!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  acceptButton: {
    backgroundColor: "#1AB48E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  acceptButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.primary
  },
  locationLabel: {
    marginTop: 10,
    fontWeight: "bold",
  },
});

export default Main;
