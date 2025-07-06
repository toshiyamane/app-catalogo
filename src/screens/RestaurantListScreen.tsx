// RestaurantListScreen.tsx - criado automaticamente
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';

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

  useEffect(() => {
    carregarRestaurantes();
  }, []);

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
          await AsyncStorage.setItem('@RestauranteApp:Restaurantes', JSON.stringify(atualizadas));
        },
      },
    ]);
  };

  const editarRestaurante = (restaurante: Restaurante) => {
    console.log("teste");
    navigation.navigate('RestaurantRegister', { restaurante });
  };

  const renderItem = ({ item }: { item: Restaurante }) => (
    <View style={styles.card}>
      <View style={styles.details}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.endereco}>{item.endereco}</Text>
        <Text style={styles.cnpj}>CNPJ: {item.cnpj}</Text>
        <Text style={styles.coord}>Lat: {item.latitude} | Lon: {item.longitude}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => editarRestaurante(item)} style={styles.buttonEdit}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => excluirRestaurante(item.id)} style={styles.buttonDelete}>
            <Text style={styles.buttonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={restaurantes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma restaurante cadastrada.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  card: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9fafb',
  },
  details: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  endereco: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
  },
  cnpj: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  coord: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  buttonEdit: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonDelete: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: '#888',
  },
});
 