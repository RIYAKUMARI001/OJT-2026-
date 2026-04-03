import React from 'react';
import { View, Text, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen } from './src/screens/HomeScreen';
import { RoomSetupScreen } from './src/screens/RoomSetupScreen';
import { DesignerScreen } from './src/screens/DesignerScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { SavedDesignsScreen } from './src/screens/SavedDesignsScreen';
import { useNavigationStore } from './src/store/navigationStore';

/**
 * Main Application Component
 */
export default function App() {
  const currentScreen = useNavigationStore((state) => state.currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen />;
      case 'RoomSetup':
        return <RoomSetupScreen />;
      case 'Designer':
        return <DesignerScreen />;
      case 'Auth':
        return <AuthScreen />;
      case 'SavedDesigns':
        return <SavedDesignsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      {Platform.OS === 'web' ? (
        <Text style={{ position: 'absolute', top: 8, left: 8, zIndex: 9999, color: '#111' }}>
          WEB RUNNING
        </Text>
      ) : null}
      {renderScreen()}
    </View>
  );
}
