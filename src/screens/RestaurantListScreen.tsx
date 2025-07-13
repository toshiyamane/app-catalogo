// RestaurantListScreen.tsx - criado automaticamente
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';
import {restaurant_list_styles} from '../styles/restaurant_list_styles'
import { OnlyAdmin } from '../components/OnlyAdmin';

interface Restaurante {
  id: string;
  nome: string;
  endereco: string;
  cnpj: string;
  latitude: string;
  longitude: string;
}

export const RestaurantListScreen = () => {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [filtro, setFiltro] = useState('');

    const isFocused = useIsFocused();
    useEffect(() => {
      if (isFocused) {
        carregarRestaurantes();
      }
    }, [isFocused]);

  const carregarRestaurantes = async () => {
    const data = await AsyncStorage.getItem('@RestauranteApp:restaurantes');
    if (data) {
      setRestaurantes(JSON.parse(data));
    }
  };

  const excluirRestaurante = (id: string) => {
    Alert.alert('Excluir Restaurante', 'Tem certeza que deseja excluir este restaurante?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const atualizadas = restaurantes.filter((r) => r.id !== id);
          setRestaurantes(atualizadas);
          await AsyncStorage.setItem('@RestauranteApp:restaurantes', JSON.stringify(atualizadas));
           carregarRestaurantes();
        },
      },
    ]);
  };

  const editarRestaurante = (restaurante: Restaurante) => {
    navigation.navigate('RestaurantRegister', { restaurante });
  };

  const restaurantesFiltrados = restaurantes.filter((r) =>
    r.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  const renderItem = ({ item }: { item: Restaurante }) => (
    <View style={restaurant_list_styles.card}>
      <View style={restaurant_list_styles.details}>
        <Text style={restaurant_list_styles.nome}>{item.nome}</Text>
        <Text style={restaurant_list_styles.endereco}>{item.endereco}</Text>
        <Text style={restaurant_list_styles.cnpj}>CNPJ: {item.cnpj}</Text>
        <Text style={restaurant_list_styles.coord}>Lat: {item.latitude} | Lon: {item.longitude}</Text>
        <OnlyAdmin>
          <View style={restaurant_list_styles.actions}>
            <TouchableOpacity onPress={() => editarRestaurante(item)} style={restaurant_list_styles.buttonEdit}>
              <Text style={restaurant_list_styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => excluirRestaurante(item.id)} style={restaurant_list_styles.buttonDelete}>
              <Text style={restaurant_list_styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </OnlyAdmin>
      </View>
    </View>
  );

  return (
    <View style={restaurant_list_styles.container}>
      <TextInput
        placeholder="Buscar restaurante por nome..."
        value={filtro}
        onChangeText={setFiltro}
        style={restaurant_list_styles.input}
      />

      <FlatList
        data={restaurantesFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={restaurant_list_styles.empty}>Nenhum restaurante encontrado.</Text>}
      />
    </View>
  );
};
