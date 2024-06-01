import { create } from 'zustand';


const useLocationStore = create((set) => ({
  pickupLocation: null,
  destinationLocation: null,
  setPickupLocation: (location) =>
    set((state) => ({
      pickupLocation: {
        ...state.pickupLocation,
        ...location,
      },
    })),
  setDestinationLocation: (location) =>
    set((state) => ({
      destinationLocation: {
        ...state.destinationLocation,
        ...location,
      },
    })),
}));

export default useLocationStore;