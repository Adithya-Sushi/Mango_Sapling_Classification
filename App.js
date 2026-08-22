import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ModelProvider } from "./src/context/ModelContext";

import AboutScreen from "./src/screens/AboutScreen";
import CameraScreen from "./src/screens/CameraScreen";
import GalleryScreen from "./src/screens/GalleryScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import HomeScreen from "./src/screens/HomeScreen";
import PreviewScreen from "./src/screens/PreviewScreen";
import ResultScreen from "./src/screens/ResultScreen";
import SplashScreen from "./src/screens/SplashScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <ModelProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Gallery" component={GalleryScreen} />
            <Stack.Screen name="Camera" component={CameraScreen} />
            <Stack.Screen name="Preview" component={PreviewScreen} />
            <Stack.Screen name="Result" component={ResultScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ModelProvider>
    </SafeAreaProvider>
  );
}