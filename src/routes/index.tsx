// index.tsx - criado automaticamente
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { StoreRegisterScreen } from '../screens/StoreRegisterScreen';
import { ProductRegisterScreen } from '../screens/ProductRegisterScreen';
import { ProductListScreen } from '../screens/ProductListScreen';
import { StoreListScreen } from '../screens/StoreListScreen';
import { ActivityIndicator, View } from 'react-native';
import { AuthStackParamList, AppStackParamList } from '../types/navigation';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

export function Routes() {
    const { isAuthenticated, loading } = useAuth();

  // Mostra loader enquanto verifica autenticação
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }
  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AppStack.Navigator id={undefined} >
          <AppStack.Screen name="Home" component={HomeScreen} />
          <AppStack.Screen name="StoreRegister" component={StoreRegisterScreen} />
          <AppStack.Screen name="ProductRegister" component={ProductRegisterScreen} />
          <AppStack.Screen name="ProductList" component={ProductListScreen} />
          <AppStack.Screen name="StoreList" component={StoreListScreen} />
        </AppStack.Navigator>
      ) : (
        <AuthStack.Navigator id={undefined}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
 