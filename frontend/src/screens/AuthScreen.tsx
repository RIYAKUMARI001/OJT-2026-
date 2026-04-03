import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigationStore } from '../store/navigationStore';
import { authService } from '../services/authService';
import { BACK_HIT_SLOP } from '../constants/layout';
import { useAuthStore } from '../store/authStore';

export const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigationStore((state) => state.navigate);
  const { token, userName, clearSession, setSession, hasHydrated } = useAuthStore();

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const data = (await authService.login(email, password)) as {
          token?: string;
          name?: string;
        };
        if (data.token) {
          setSession(data.token, data.name ?? null);
        }
        navigate('Home');
        Alert.alert('Success', 'Logged in successfully!');
      } else {
        const data = (await authService.register(name, email, password)) as {
          token?: string;
          name?: string;
        };
        if (data.token) {
          setSession(data.token, data.name ?? null);
        }
        navigate('Home');
        Alert.alert('Success', data.token ? 'Account created! You are signed in.' : 'Account created! Please login.');
        if (!data.token) setIsLogin(true);
      }
    } catch (error: any) {
      Alert.alert('Auth Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!hasHydrated) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="px-8">
          <TouchableOpacity
            onPress={() => navigate('Home')}
            className="mb-6 self-start py-2 pr-4"
            activeOpacity={0.7}
            hitSlop={BACK_HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel="Back to home"
          >
            <Text className="text-xl">← Back</Text>
          </TouchableOpacity>

          {token ? (
            <View className="mb-8">
              <View className="mb-4 p-4 bg-accent-blue rounded-2xl border border-border">
                <Text className="text-sm font-bold text-primary">
                  Signed in{userName ? ` as ${userName}` : ""}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigate("SavedDesigns")}
                className="bg-primary py-5 rounded-2xl mb-3"
              >
                <Text className="text-white text-center text-lg font-bold">My saved designs</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => clearSession()}
                className="bg-white py-4 rounded-2xl border-2 border-border"
              >
                <Text className="text-primary text-center font-bold">Log out</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {!token ? (
          <>
          <View className="mb-10">
            <Text className="text-4xl font-extrabold text-primary mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Text>
            <Text className="text-muted font-medium">
              {isLogin 
                ? 'Sign in to access your saved designs.' 
                : 'Start your interior design journey today.'}
            </Text>
          </View>

          <View className="space-y-4">
            {!isLogin && (
              <View>
                <Text className="text-[11px] font-bold text-muted mb-2 tracking-widest uppercase">Full Name</Text>
                <TextInput 
                  placeholder="Riya Kumari"
                  value={name}
                  onChangeText={setName}
                  className="bg-white p-4 rounded-2xl border-2 border-border text-primary font-bold"
                />
              </View>
            )}

            <View className="mt-4">
              <Text className="text-[11px] font-bold text-muted mb-2 tracking-widest uppercase">Email Address</Text>
              <TextInput 
                placeholder="riya@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                className="bg-white p-4 rounded-2xl border-2 border-border text-primary font-bold"
              />
            </View>

            <View className="mt-4">
              <Text className="text-[11px] font-bold text-muted mb-2 tracking-widest uppercase">Password</Text>
              <TextInput 
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                className="bg-white p-4 rounded-2xl border-2 border-border text-primary font-bold"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              className={`bg-primary py-5 rounded-2xl mt-8 shadow-xl active:scale-95 transition-all ${loading ? 'opacity-70' : ''}`}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center text-lg font-bold">
                  {isLogin ? 'Sign In' : 'Sign Up'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Toggle Switch */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-muted font-medium">{isLogin ? "Don't have an account? " : "Already have an account? "}</Text>
              <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text className="text-primary font-bold">{isLogin ? 'Sign Up' : 'Sign In'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-12">
             <View className="flex-row items-center mb-6">
                <View className="flex-1 h-[1px] bg-border" />
                <Text className="mx-4 text-[10px] font-bold text-muted uppercase">Or continue with</Text>
                <View className="flex-1 h-[1px] bg-border" />
             </View>
             
             <TouchableOpacity className="py-5 bg-white border-2 border-border rounded-2xl items-center active:bg-gray-50">
                <Text className="text-primary font-bold text-base">Sign in with Google</Text>
             </TouchableOpacity>
          </View>
          </>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
