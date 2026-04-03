import React, { useCallback, useState } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigationStore } from "../store/navigationStore";
import { BACK_HIT_SLOP } from "../constants/layout";
import { useAuthStore } from "../store/authStore";
import { designsService, type SavedDesignDto } from "../services/designsService";
import { useAppStore } from "../store/useAppStore";

export const SavedDesignsScreen: React.FC = () => {
  const navigate = useNavigationStore((state) => state.navigate);
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const loadSavedDesign = useAppStore((s) => s.loadSavedDesign);

  const [designs, setDesigns] = useState<SavedDesignDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!token) {
      setDesigns([]);
      setLoading(false);
      return;
    }
    try {
      const { designs: list } = await designsService.list();
      setDesigns(list);
    } catch (e) {
      Alert.alert("Could not load", e instanceof Error ? e.message : "Try again");
      setDesigns([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  React.useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  const onOpen = (d: SavedDesignDto) => {
    loadSavedDesign(
      {
        roomType: d.roomType,
        width: d.width,
        length: d.length,
        wallColor: d.wallColor,
      },
      d.items ?? []
    );
    navigate("Designer");
  };

  const onDelete = (id: string, title: string) => {
    Alert.alert(
      "Delete Design",
      `Are you sure you want to delete "${title || "this design"}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await designsService.delete(id);
              void load();
            } catch (e) {
              Alert.alert("Delete failed", e instanceof Error ? e.message : "Try again");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-8 pt-6">
        <TouchableOpacity
          onPress={() => navigate("Home")}
          className="mb-6 self-start py-2 pr-4"
          activeOpacity={0.7}
          hitSlop={BACK_HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Back to home"
        >
          <Text className="text-xl">← Back</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-primary mb-2">Saved designs</Text>

        {!hasHydrated ? (
          <ActivityIndicator className="mt-8" />
        ) : !token ? (
          <>
            <Text className="text-muted mb-8">
              Sign in to see rooms you saved from the designer.
            </Text>
            <TouchableOpacity
              onPress={() => navigate("Auth")}
              className="bg-primary py-4 rounded-2xl"
            >
              <Text className="text-white text-center font-bold">Go to login</Text>
            </TouchableOpacity>
          </>
        ) : loading ? (
          <ActivityIndicator className="mt-8" />
        ) : designs.length === 0 ? (
          <Text className="text-muted mt-4">
            No saved rooms yet. Open the designer, add furniture, tap Save.
          </Text>
        ) : (
          <FlatList
            data={designs}
            keyExtractor={(item) => String(item.id)}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => {
                setRefreshing(true);
                void load();
              }} />
            }
            contentContainerStyle={{ paddingBottom: 24 }}
            renderItem={({ item }) => (
              <View className="mb-4 bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
                <TouchableOpacity
                  onPress={() => onOpen(item)}
                  activeOpacity={0.6}
                  className="flex-row items-center p-5 justify-between"
                >
                  <View className="flex-1 pr-4">
                    <Text className="text-lg font-extrabold text-primary mb-1">
                      {item.title || item.roomType}
                    </Text>
                    <View className="flex-row items-center opacity-60">
                      <Ionicons name="resize-outline" size={12} color="#64748B" />
                      <Text className="text-[11px] font-bold text-muted ml-1 uppercase tracking-wider">
                        {item.width}×{item.length} ft · {(item.items?.length ?? 0)} items
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    onPress={() => onDelete(String(item.id), item.title || item.roomType)}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    className="w-10 h-10 rounded-full bg-accent-error/15 items-center justify-center active:bg-accent-error/30"
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
