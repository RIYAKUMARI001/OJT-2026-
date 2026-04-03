import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigationStore } from '../store/navigationStore';
import { BACK_HIT_SLOP } from '../constants/layout';
import { useAuthStore } from '../store/authStore';
import { designsService } from '../services/designsService';
import { useDesignsNotifyStore } from '../store/designsNotifyStore';
import { useAppStore } from '../store/useAppStore';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigationStore((state) => state.navigate);
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const savedVersion = useDesignsNotifyStore((s) => s.version);
  const resetPlaced = useAppStore((s) => s.resetPlaced);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    if (!hasHydrated || !token) {
      if (!hasHydrated) return;
      setSavedCount(0);
      return;
    }
    let cancelled = false;
    designsService
      .list()
      .then(({ designs }) => {
        if (!cancelled) setSavedCount(designs.length);
      })
      .catch(() => {
        if (!cancelled) setSavedCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, [hasHydrated, token, savedVersion]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-8 justify-center">
        {/* Logo/Icon Area */}
        <View className="w-16 h-16 bg-primary rounded-2xl items-center justify-center mb-8 shadow-xl">
           <View className="flex-row">
             <View className="w-4 h-3 bg-white opacity-90 rounded-sm m-0.5" />
             <View className="w-4 h-3 bg-white opacity-40 rounded-sm m-0.5" />
           </View>
           <View className="flex-row">
             <View className="w-4 h-3 bg-white opacity-40 rounded-sm m-0.5" />
             <View className="w-4 h-3 bg-white opacity-70 rounded-sm m-0.5" />
           </View>
        </View>

        {/* Title & Subhead */}
        <Text className="text-5xl font-extrabold text-primary mb-2 tracking-tight">
          Room{"\n"}Planner
        </Text>
        <Text className="text-lg text-muted mb-12 font-medium">
          Design your space before{"\n"}you buy.
        </Text>

        {/* Actions */}
        <TouchableOpacity 
          className="bg-primary py-5 rounded-2xl mb-4 shadow-lg active:scale-95 transition-all"
          activeOpacity={0.85}
          onPress={() => {
            resetPlaced();
            navigate('RoomSetup');
          }}
        >
          <Text className="text-white text-center text-lg font-bold">Start New Room</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-white py-5 rounded-2xl border-2 border-border active:bg-gray-50 transition-all"
          activeOpacity={0.85}
          onPress={() => navigate(token ? 'SavedDesigns' : 'Auth')}
        >
          <Text className="text-primary text-center text-lg font-bold">Load saved design</Text>
        </TouchableOpacity>

        <Text className="text-center text-muted text-sm mt-4 font-mono">
          {!hasHydrated
            ? " "
            : token
              ? `${savedCount} saved design${savedCount === 1 ? "" : "s"}`
              : "Sign in to save & load designs"}
        </Text>
      </View>

      {/* Bottom Nav Simulation */}
      <View className="flex-row justify-around py-4 border-t border-border bg-background">
        <View className="items-center">
          <View className="w-8 h-8 bg-primary rounded-lg items-center justify-center mb-1 shadow-sm">
             <Text className="text-white text-xs">🏠</Text>
          </View>
          <Text className="text-[10px] font-bold text-primary">Home</Text>
        </View>
        <TouchableOpacity
          className="items-center"
          activeOpacity={0.7}
          hitSlop={BACK_HIT_SLOP}
          onPress={() => navigate('SavedDesigns')}
        >
          <View className="w-8 h-8 bg-border rounded-lg items-center justify-center mb-1">
             <Text className="text-xs">📂</Text>
          </View>
          <Text className="text-[10px] font-bold text-muted">Designs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center"
          activeOpacity={0.7}
          hitSlop={BACK_HIT_SLOP}
          onPress={() => navigate('Auth')}
        >
          <View className="w-8 h-8 bg-border rounded-lg items-center justify-center mb-1">
             <Text className="text-xs">👤</Text>
          </View>
          <Text className="text-[10px] font-bold text-muted">Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
