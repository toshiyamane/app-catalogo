// HomeScreen.tsx - criado automaticamente
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import home_styles from '../styles/home_styles';
import { OnlyAdmin } from '../components/OnlyAdmin';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const HomeScreen = () => {

  //   const limparBase = async () => {
  //   try {
  //     await AsyncStorage.clear();
  //     Alert.alert('Sucesso', 'Base de dados limpa!');
  //   } catch (error) {
  //     Alert.alert('Erro', 'Falha ao limpar a base.');
  //     console.error(error);
  //   }
  // };
  
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const tipo = user?.tipo;

  const MenuButton = ({
    title,
    screen,
    onPress,
    color = '#2563EB',
  }: {
    title: string;
    screen?: string;
    onPress?: () => void;
    color?: string;
  }) => (
    <TouchableOpacity
      style={[home_styles.menuItem, { backgroundColor: color }]}
      onPress={onPress ? onPress : () => navigation.navigate(screen as never)}
    >
      <Text style={home_styles.menuText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={home_styles.page}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={home_styles.welcome}>
          Bem-vindo, {user?.nome}!
        </Text>
       {user?.tipo && (
          <Text style={home_styles.welcomeTipo}>
            Perfil: {user.tipo === 'admin' ? 'Administrador' : 'Cliente'}
          </Text>
        )}

          <View style={home_styles.menuContainer}>
            <OnlyAdmin>
              <MenuButton title="Cadastrar Restaurante" screen="RestaurantRegister" />
              <MenuButton title="Cadastrar Produto" screen="ProductRegister" />
              <MenuButton title="Lista de Produtos" screen="ProductList" />
              <MenuButton title="Lista de Restaurantes" screen="RestaurantList" />
            </OnlyAdmin>
            
            {tipo === 'cliente' && (
              <MenuButton title="Ver Cardápio" screen="RestaurantSelection" />
            )}

            <MenuButton title="Sair" onPress={logout} color="#DC2626" />
          </View>
        </ScrollView>

       {/* <TouchableOpacity
        onPress={limparBase}
        style={{
          backgroundColor: '#DC2626',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Limpar Base de Dados</Text>
      </TouchableOpacity> */}
    </View>
  );
};