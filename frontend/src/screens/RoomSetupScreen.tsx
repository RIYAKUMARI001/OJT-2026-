import React, { useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  SafeAreaView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { useNavigationStore } from '../store/navigationStore';
import { BACK_HIT_SLOP } from '../constants/layout';

// Move pure constants outside to stabilize the component tree
const ROOM_TYPES = ['Living Room', 'Bedroom', 'Kitchen', 'Office'] as const;
const WALL_COLORS = [
  { value: '#F5F0E8', label: 'Warm White' },
  { value: '#E8F0F5', label: 'Cool Blue' },
  { value: '#F0E8F5', label: 'Soft Lilac' },
  { value: '#E8F5EE', label: 'Mint' },
  { value: '#F5E8E8', label: 'Rose' },
] as const;

export const RoomSetupScreen: React.FC = () => {
  const { room, setRoomType, setDimensions, setWallColor, resetPlaced } = useAppStore();
  const navigate = useNavigationStore((state) => state.navigate);

  // Local state for dimensions (strings to allow editing)
  const [w, setW] = useState(room.width.toString());
  const [l, setL] = useState(room.length.toString());

  const widthRef = useRef<TextInput>(null);
  const lengthRef = useRef<TextInput>(null);

  // Helper: Dismiss all inputs
  const endEditing = () => {
    widthRef.current?.blur();
    lengthRef.current?.blur();
    Keyboard.dismiss();
  };

  // Helper: Clamp values for the store
  const clampValue = (val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) return 8;
    return Math.min(Math.max(num, 8), 20);
  };

  // Logic: Validation (calculated every render for precision)
  const validate = (val: string) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= 8 && num <= 20;
  };

  const isWidthValid = validate(w);
  const isLengthValid = validate(l);
  const allValid = isWidthValid && isLengthValid;

  // Handle Generate Action
  const handleGenerate = () => {
    const finalW = clampValue(w);
    const finalL = clampValue(l);

    // Update local UI to match clamped values
    setW(finalW.toString());
    setL(finalL.toString());

    // Only reset furniture if dimensions actually changed
    if (finalW !== room.width || finalL !== room.length) {
      resetPlaced();
    }

    setDimensions(finalW, finalL);
    navigate('Designer');
  };

  // Shared content to avoid duplication bugs
  const renderForm = (
    <ScrollView
      className="flex-1 px-8 pt-6"
      // CRITICAL: Always persist taps so first click works while keyboard is open
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag"
      contentContainerStyle={{ paddingBottom: 160 }}
    >
      {/* Header */}
      <View className="flex-row items-center mb-10">
        <Pressable 
          onPress={() => {
            endEditing();
            navigate('Home');
          }}
          className="w-12 h-12 bg-border rounded-xl items-center justify-center mr-4 active:opacity-50"
          hitSlop={BACK_HIT_SLOP}
          android_ripple={{ color: '#CBD5E1', borderless: false }}
        >
          <Text className="text-xl">←</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-primary">Room Setup</Text>
      </View>

      {/* Room Type Selection */}
      <Text className="text-[11px] font-bold text-muted tracking-widest mb-4 uppercase">Room Type</Text>
      <View className="flex-row flex-wrap gap-2 mb-10">
        {ROOM_TYPES.map((type) => (
          <Pressable
            key={type}
            onPress={() => {
              // Note: Don't endEditing here to keep focus if desired
              setRoomType(type);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            android_ripple={{ color: '#CBD5E1' }}
            className={`px-5 py-3 rounded-full border-2 ${
              room.roomType === type ? 'bg-primary border-primary' : 'bg-white border-border'
            }`}
          >
            <Text className={`text-sm font-bold ${room.roomType === type ? 'text-white' : 'text-muted'}`}>
              {type}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Dimensions Inputs */}
      <Text className="text-[11px] font-bold text-muted tracking-widest mb-4 uppercase">Dimensions</Text>
      <View className="flex-row gap-4 mb-6">
        {/* Width Field */}
        <View className="flex-1">
          <Text className={`text-xs font-bold mb-2 ${!isWidthValid ? 'text-accent-error' : 'text-muted opacity-60'}`}>
             Width (ft) {!isWidthValid && '✕'}
          </Text>
          <TextInput
            ref={widthRef}
            keyboardType="numeric"
            value={w}
            onChangeText={(text) => {
              const sanitized = text.replace(/[^0-9]/g, '');
              setW(sanitized);
            }}
            maxLength={2}
            className={`p-5 rounded-2xl text-center text-xl font-bold border-2 ${
              !isWidthValid ? 'bg-white border-accent-error text-accent-error' : 'bg-white border-border'
            }`}
          />
        </View>

        {/* Length Field */}
        <View className="flex-1">
          <Text className={`text-xs font-bold mb-2 ${!isLengthValid ? 'text-accent-error' : 'text-muted opacity-60'}`}>
             Length (ft) {!isLengthValid && '✕'}
          </Text>
          <TextInput
            ref={lengthRef}
            keyboardType="numeric"
            value={l}
            onChangeText={(text) => {
              const sanitized = text.replace(/[^0-9]/g, '');
              setL(sanitized);
            }}
            maxLength={2}
            className={`p-5 rounded-2xl text-center text-xl font-bold border-2 ${
              !isLengthValid ? 'bg-white border-accent-error text-accent-error' : 'bg-white border-border'
            }`}
          />
        </View>
      </View>

      {/* Validation Message Box */}
      <View className={`p-4 rounded-2xl border-2 mb-10 ${
         allValid ? 'bg-accent-blue/10 border-accent-blue/20' : 'bg-accent-error/10 border-accent-error/20'
      }`}>
        {allValid ? (
          <Text className="text-accent-blue font-bold text-xs text-center">Valid range: 8 – 20 ft per side</Text>
        ) : (
          <View className="items-center">
             <Text className="text-accent-error font-extrabold text-xs uppercase tracking-tight mb-0.5">Invalid Dimensions</Text>
             <Text className="text-accent-error text-[10px]">Range: 8 ft to 20 ft.</Text>
          </View>
        )}
      </View>

      {/* Color Selection */}
      <Text className="text-[11px] font-bold text-muted tracking-widest mb-4 uppercase">Wall Color</Text>
      <View className="flex-row gap-3 mb-4">
        {WALL_COLORS.map((color) => (
          <Pressable
            key={color.value}
            onPress={() => {
              setWallColor(color.value);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            android_ripple={{ color: '#CBD5E1', borderless: false }}
            style={{ backgroundColor: color.value }}
            className={`w-12 h-12 rounded-xl border-4 ${
              room.wallColor === color.value ? 'border-primary' : 'border-border'
            }`}
          />
        ))}
      </View>
      <Text className="text-xs text-muted mb-12 italic">
        Selected: {WALL_COLORS.find((c) => c.value === room.wallColor)?.label ?? 'Custom'}
      </Text>

      {/* Action Button */}
      <Pressable 
        onPress={() => {
          endEditing();
          if (allValid) handleGenerate();
        }}
        // Still allow click to show feedback, but logic inside handleGenerate
        android_ripple={{ color: '#FFFFFF50' }}
        className={`py-5 rounded-2xl shadow-xl elevation-5 ${
          allValid ? 'bg-primary active:opacity-90' : 'bg-accent-error opacity-90'
        }`}
      >
        <Text className="text-white text-center text-lg font-bold">
          {allValid ? 'Generate Grid →' : 'Fix Invalid Sizes'}
        </Text>
      </Pressable>
      
      <View className="h-10" />
    </ScrollView>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView behavior="padding" className="flex-1">
          {renderForm}
        </KeyboardAvoidingView>
      ) : (
        // Android handles resize natively with windowSoftInputMode="adjustResize"
        <View className="flex-1">
          {renderForm}
        </View>
      )}
    </SafeAreaView>
  );
};
