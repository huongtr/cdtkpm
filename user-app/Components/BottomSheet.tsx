import { View, Text, Button, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import React, { forwardRef, useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import useLocationStore from '@/store/locationStore';
import useUserStore from '@/store/userStore';
import socketIOClient from 'socket.io-client';


export type Ref = BottomSheetModal;

const BottomSheet = forwardRef<Ref>((props, ref) => {
  const [price, setPrice] = useState("30000 VND"); // Default price state
  const [sid, setSid] = useState(null); // Default price state
  const { pickupLocation, destinationLocation } = useLocationStore();
  const userData = useUserStore();
  const [loading, setLoading] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const waitingForDriverRef = useRef(waitingForDriver);

  const [modalMessage, setModalMessage] = useState('Waiting for drivers...');
  const [socket, setSocket] = useState(null);


  const snapPoints = useMemo(() => ["50%"], []);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );
  const { dismiss } = useBottomSheetModal();

  useEffect(() => {
    const newSocket = socketIOClient("ws://localhost:3001");
    setSocket(newSocket);

    newSocket.on("connected", (data) => {
      console.log(data.sid);
      setSid(data.sid);
    });

  }, []);

  const fetchPrice = useCallback(async () => {
    console.log("price");
    console.log(pickupLocation);
    console.log(destinationLocation);
    console.log(userData);
    // if (!pickupLocation || !destinationLocation || !userData) return;

    try {
      const queryParams = new URLSearchParams({
        user_id: userData.userId,
        vehicle_type: "cab",
        pickup_latitude: pickupLocation.latitude,
        pickup_longitude: pickupLocation.longitude,
        dropoff_latitude: destinationLocation.latitude,
        dropoff_longitude: destinationLocation.longitude,
      });

      const url = `http://localhost:3001/rides/estimate-fare?${queryParams}`;

      const response = await fetch(url);
      const data = await response.json();
      setPrice(`${data.amount} ${data.currency}`);
    } catch (error) {
      console.error("Failed to fetch price:", error);
    }
  }, [pickupLocation, destinationLocation, userData]);

  const handleOpen = useCallback(() => {
    fetchPrice(); // Fetch price when modal opens
  }, [fetchPrice]);

  const handleBookRide = async () => {
    if (!pickupLocation || !destinationLocation || !userData) return;
    if (!sid) {
      console.log('SID is not set yet. Waiting for WebSocket connection...');
      return;
    }
    const rideRequest = {
      user_id: userData.userId,
      driver_id: null,
      pickup_latitude: pickupLocation.latitude,
      pickup_longitude: pickupLocation.longitude,
      dropoff_latitude: destinationLocation.latitude,
      dropoff_longitude: destinationLocation.longitude,
      vehicle_type: "car",
      user_sid: sid,
    };

    try {
      setLoading(true);

      const response = await fetch("http://localhost:3001/rides/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rideRequest),
      });

      if (!response.ok) {
        throw new Error("Failed to request ride");
      }


      setLoading(false);
      setWaitingForDriver(true);
      waitingForDriverRef.current = true;
      setModalMessage("Waiting for drivers...");

      let timeoutId = setTimeout(() => {
        if (waitingForDriverRef.current) {
          setWaitingForDriver(false);
          setLoading(true);
          setModalMessage("No drivers available. Please try again ");
          socket.disconnect();
        }
      }, 10000); // Wait for 1 minute

      socket.on("request_accepted", (data) => {
        console.log("accept", data);
        setModalMessage(`Ride Accepted. Driver is on the way!`);
        // setWaitingForDriver(false);
        // setLoading(true);
        clearTimeout(timeoutId);
      });

    } catch (error) {
      setLoading(false);
      console.error("Failed to book ride:", error);
      Alert.alert("Error", "Failed to book ride. Please try again later.");
    }
  };

  
  const handleDismiss = () => {
    setLoading(false);
    setWaitingForDriver(false);
  };

  return (
    <BottomSheetModal
      handleIndicatorStyle={{ display: "none" }}
      backgroundStyle={{ borderRadius: 0, backgroundColor: Colors.lightGrey }}
      overDragResistanceFactor={0}
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      onAnimate={({ presenting }) => {
        handleOpen();
      }}
      onDismiss={handleDismiss}
    >
      {!(loading || waitingForDriver) ? (
        <View style={styles.contentContainer}>
          <Text style={styles.subheader}>Price</Text>
          <TouchableOpacity>
            <View style={styles.item}>
              <Ionicons name="cash-outline" size={20} color={Colors.medium} />
              <Text style={{ flex: 1 }}>{price}</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.subheader}>Payment</Text>
          <View style={styles.item}>
            <Ionicons name="cash-outline" size={20} color={Colors.medium} />
            <Text style={{ flex: 1 }}>Cash</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleBookRide}>
            <Text style={styles.buttonText}>Book Ride</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {waitingForDriver ? <ActivityIndicator size="large" color={"blue"} /> : <></>}
            <Text style={styles.modalText}>{modalMessage}</Text>
          </View>
        </View>
      )}
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    margin: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subheader: {
    fontSize: 16,
    fontWeight: '600',
    margin: 16,
  },
  item: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderColor: Colors.grey,
    borderWidth: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    color: Colors.mediumDark
  },
});

export default BottomSheet;
