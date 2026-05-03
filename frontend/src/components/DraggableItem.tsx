import React from 'react';
import { View, Text } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, runOnJS } from 'react-native-reanimated';
import { PlacedItem, useAppStore } from '../store/useAppStore';

interface Props {
  item: PlacedItem;
}

export const DraggableItem: React.FC<Props> = ({ item }) => {
  const updateItemPosition = useAppStore((state) => state.updateItemPosition);
  
  // Protect against old corrupted state where item was just a string
  const safeItem = typeof item === 'string' ? { id: Math.random().toString(), name: item, x: 50, y: 50, rotation: 0 } : item;
  
  const translateX = useSharedValue(safeItem.x ?? 50);
  const translateY = useSharedValue(safeItem.y ?? 50);
  const isDragging = useSharedValue(false);

  const dragGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
    })
    .onUpdate((event) => {
      translateX.value = item.x + event.translationX;
      translateY.value = item.y + event.translationY;
    })
    .onEnd(() => {
      isDragging.value = false;
      const snappedX = Math.round(translateX.value / 20) * 20;
      const snappedY = Math.round(translateY.value / 20) * 20;
      translateX.value = withSpring(snappedX);
      translateY.value = withSpring(snappedY);
      runOnJS(updateItemPosition)(safeItem.id, snappedX, snappedY);
    })
    .onFinalize(() => {
      // Save position to store after animation
      // Note: we can't easily call JS functions from worklets without runOnJS,
      // so for this MVP, we rely on the state held in the shared values.
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${safeItem.rotation ?? 0}deg` }
      ],
      zIndex: isDragging.value ? 100 : 1,
      opacity: isDragging.value ? 0.8 : 1,
    };
  });

  return (
    <GestureDetector gesture={dragGesture}>
      <Animated.View
        style={[{ position: 'absolute', top: 0, left: 0 }, animatedStyle]}
        className="bg-white px-3 py-2 rounded-lg border-2 border-accent-blue shadow-lg items-center justify-center"
      >
        <Text className="text-[10px] font-bold text-primary">{safeItem.name}</Text>
      </Animated.View>
    </GestureDetector>
  );
};
