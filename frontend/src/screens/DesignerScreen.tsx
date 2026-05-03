import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigationStore } from "../store/navigationStore";
import { BACK_HIT_SLOP } from "../constants/layout";
import { useAppStore } from "../store/useAppStore";
import { useAuthStore } from "../store/authStore";
import { designsService } from "../services/designsService";
import { useDesignsNotifyStore } from "../store/designsNotifyStore";
import { DraggableItem } from "../components/DraggableItem";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";

const FURNITURE_CATALOG: Record<string, string[]> = {
  "Living Room": ["Sofa", "TV Unit", "Coffee Table", "Armchair", "Rug"],
  "Bedroom": ["Bed", "Wardrobe", "Side Table", "Dresser", "Chair"],
  "Kitchen": ["Dining Table", "Chair", "Kitchen Island", "Cabinet", "Fridge"],
  "Office": ["Desk", "Office Chair", "Bookshelf", "Lamp", "Armchair"],
};

const DEFAULT_CATALOG = ["Sofa", "Chair", "Table", "Bed"];

export const DesignerScreen: React.FC = () => {
  const navigate = useNavigationStore((state) => state.navigate);
  const { room, placedItems, addPlacedItem, undoPlaced } = useAppStore();
  const token = useAuthStore((s) => s.token);
  const bumpSavedList = useDesignsNotifyStore((s) => s.bumpSavedList);
  const [saving, setSaving] = React.useState(false);
  const viewShotRef = React.useRef(null);

  const captureAndShare = async () => {
    try {
      const uri = await captureRef(viewShotRef, {
        format: "png",
        quality: 1,
      });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Error", "Sharing is not available on this device");
      }
    } catch (e) {
      Alert.alert("Capture Failed", "Could not save the design layout");
    }
  };

  const count = placedItems.length;

  const onSave = async () => {
    if (!token) {
      Alert.alert("Login required", "Sign in to save this room to the cloud.", [
        { text: "Cancel", style: "cancel" },
        { text: "Go to login", onPress: () => navigate("Auth") },
      ]);
      return;
    }
    setSaving(true);
    try {
      await designsService.save({
        roomType: room.roomType,
        width: room.width,
        length: room.length,
        wallColor: room.wallColor,
        items: placedItems.map(item => JSON.stringify(item)),
      });
      bumpSavedList();
      Alert.alert("Saved", "Your room design was saved.");
    } catch (e) {
      Alert.alert("Save failed", e instanceof Error ? e.message : "Try again");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 pt-4">
        <TouchableOpacity
          onPress={() => navigate("RoomSetup")}
          className="mb-3 self-start py-2 pr-4"
          activeOpacity={0.7}
          hitSlop={BACK_HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Back to room setup"
        >
          <Text className="text-xl">← Back</Text>
        </TouchableOpacity>
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-lg font-extrabold text-primary">{room.roomType}</Text>
            <Text className="text-[10px] text-muted font-mono">
              {room.width} × {room.length} ft · {count} item{count === 1 ? "" : "s"}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity onPress={captureAndShare} className="bg-muted px-3 py-1.5 rounded-full" activeOpacity={0.8}>
              <Text className="text-white text-[10px] font-bold">📷 Capture</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-primary px-3 py-1.5 rounded-full" activeOpacity={0.8}>
              <Text className="text-white text-[10px] font-bold">3D ↗</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="w-full aspect-square bg-white border-2 border-border rounded-2xl overflow-hidden p-2">
          <ViewShot ref={viewShotRef} style={{ flex: 1, backgroundColor: 'white' }} collapsable={false}>
            <View
              className="flex-1 relative rounded-xl border border-dashed border-border overflow-hidden"
              style={{ backgroundColor: room.wallColor }}
              collapsable={false}
            >
              {/* Draw Grid Background */}
              <View className="absolute inset-0" style={{ opacity: 0.1 }}>
                {Array.from({ length: 20 }).map((_, i) => (
                  <View key={`h-${i}`} style={{ position: 'absolute', top: i * 20, left: 0, right: 0, height: 1, backgroundColor: '#000' }} />
                ))}
                {Array.from({ length: 20 }).map((_, i) => (
                  <View key={`v-${i}`} style={{ position: 'absolute', left: i * 20, top: 0, bottom: 0, width: 1, backgroundColor: '#000' }} />
                ))}
              </View>

              {count === 0 ? (
                <View className="flex-1 items-center justify-center">
                  <Text className="text-muted font-mono text-xs text-center px-4">
                    Tap furniture below to add pieces. Drag them to arrange.
                  </Text>
                </View>
              ) : (
                placedItems.map((item) => (
                  <DraggableItem key={item.id} item={item} />
                ))
              )}
            </View>
          </ViewShot>
        </View>

        <View className="flex-row gap-2 mt-4">
          <TouchableOpacity
            className="flex-1 bg-border py-3 rounded-xl"
            activeOpacity={0.85}
            onPress={() => undoPlaced()}
            disabled={count === 0}
            style={{ opacity: count === 0 ? 0.5 : 1 }}
          >
            <Text className="text-center font-bold text-muted">↺ Undo</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-border py-3 rounded-xl" activeOpacity={0.85}>
            <Text className="text-center font-bold text-muted">⟳ Rotate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-primary py-3 rounded-xl shadow-lg"
            activeOpacity={0.85}
            onPress={onSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-center font-bold text-white">Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text className="text-[10px] font-bold text-muted mt-6 mb-2 tracking-widest uppercase">
          Furniture catalog
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {(FURNITURE_CATALOG[room.roomType] || DEFAULT_CATALOG).map((item) => (
            <TouchableOpacity
              key={item}
              activeOpacity={0.8}
              onPress={() => addPlacedItem(item)}
              className="items-center px-4 py-3 bg-white border border-border rounded-xl"
            >
              <View className="w-6 h-4 bg-accent-blue rounded-sm mb-1" />
              <Text className="text-[10px] font-bold text-primary">+ {item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => navigate("RoomSetup")}
          className="mt-auto mb-4 py-3"
          activeOpacity={0.7}
          hitSlop={BACK_HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Back to room setup"
        >
          <Text className="text-center text-muted text-xs font-bold">← Back to Setup</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
