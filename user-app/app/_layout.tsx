import { Stack, useNavigation } from 'expo-router';
import CustomHeader from '@/Components/CustomHeader';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Colors from '../constants/Colors';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

export default function RootLayoutNav() {
  const navigation = useNavigation();

  return (
    <BottomSheetModalProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerTitle: 'Login',
            presentation: 'card',
            headerStyle: { padding: 1},
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('main');
                }}>
                <Ionicons name="arrow-forward" size={28} color={Colors.primary} />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            headerTitle: 'Sign Up',
            presentation: 'card',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('index');
                }}>
                <Ionicons name="arrow-back" size={28} color={Colors.primary} />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="main"
          options={{
            header: () => <CustomHeader />,
          }}
        />

        <Stack.Screen
          name="(modal)/location-search"
          options={{
            presentation: 'fullScreenModal',
            headerTitle: 'Select location',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}>
                <Ionicons name="close-outline" size={28} color={Colors.primary} />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>
    </BottomSheetModalProvider>
  );
}
