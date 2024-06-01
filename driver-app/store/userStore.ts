import { create } from 'zustand';


const useUserStore = create((set) => ({
    firstName: '',
    lastName: '',
    jwtToken: '',
    userId: null,
    setUser: (userData) =>
      set((state) => ({
        firstName: userData.first_name,
        lastName: userData.last_name,
        jwtToken: userData.jwt_token,
        userId: userData.user_id,
      })),
  }));
  

export default useUserStore;