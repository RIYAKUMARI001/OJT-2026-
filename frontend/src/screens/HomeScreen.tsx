import { Text, View } from "react-native";

export function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-base font-semibold">Room Planner (MVP)</Text>
      <Text className="mt-2 text-xs text-neutral-500">Expo + TypeScript scaffold</Text>
    </View>
  );
}

