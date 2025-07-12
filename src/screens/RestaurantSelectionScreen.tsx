import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';
import { Restaurante } from '../types/restaurante';
import { restaurant_selection_styles } from '../styles/restaurant_selection_styles';

export const RestaurantSelectionScreen = () => {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [filtro, setFiltro] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  useEffect(() => {
    carregarRestaurantes();
  }, []);

  const carregarRestaurantes = async () => {
    const data = await AsyncStorage.getItem('@RestauranteApp:restaurantes');
    if (data) {
      setRestaurantes(JSON.parse(data));
    }
  };

  const selecionarRestaurante = (restauranteId: string) => {
    navigation.navigate('ProductList', { restauranteId } as never);
  };

  const restaurantesFiltrados = restaurantes.filter((r) =>
    r.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  const renderItem = ({ item }: { item: Restaurante }) => (
    <TouchableOpacity
      onPress={() => selecionarRestaurante(item.id)}
      style={restaurant_selection_styles.card}
    >
      <Text style={restaurant_selection_styles.nome}>{item.nome}</Text>
      <Text style={restaurant_selection_styles.endereco}>{item.endereco}</Text>
      <Text style={restaurant_selection_styles.coord}>
        Localização: {item.latitude}, {item.longitude}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={restaurant_selection_styles.container}>
      <Text style={restaurant_selection_styles.title}>Selecione o Restaurante</Text>

      <TextInput
        placeholder="Buscar restaurante por nome..."
        value={filtro}
        onChangeText={setFiltro}
        style={restaurant_selection_styles.input}
      />

      <FlatList
        data={restaurantesFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={restaurant_selection_styles.empty}>Nenhum restaurante encontrado.</Text>}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};
