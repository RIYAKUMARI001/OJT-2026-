import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { env } from "./src/config/env";
import { HomeScreen } from "./src/screens/HomeScreen";

export default function App() {
  return (
    <View className="flex-1">
      <HomeScreen />
      <View className="absolute bottom-10 w-full items-center">
        <Text className="text-[10px] text-neutral-400">API: {env.apiBaseUrl}</Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
