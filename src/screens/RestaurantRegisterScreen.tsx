// RestaurantRegisterScreen.tsx - criado automaticamente
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { validarCNPJ } from '../utils/validators';
import { formatarCNPJ } from '../utils/masks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';
import { Restaurante } from '../types/restaurante';
import { restaurant_register_styles } from '../styles/restaurant_register_styles';
import * as Location from 'expo-location';

type Props = NativeStackScreenProps<AppStackParamList, 'RestaurantRegister'>;


export const RestaurantRegisterScreen = ({ route, navigation }: Props) => {
  const restauranteEdit = route.params?.restaurante;

  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    if (restauranteEdit) {
      setNome(restauranteEdit.nome);
      setEndereco(restauranteEdit.endereco);
      setCnpj(restauranteEdit.cnpj);
      setLatitude(restauranteEdit.latitude);
      setLongitude(restauranteEdit.longitude);
    }
  }, [restauranteEdit]);

  const limparCampos = () => {
    setNome('');
    setEndereco('');
    setCnpj('');
    setLatitude('');
    setLongitude('');
  };

  const obterLocalizacaoAtual = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert('Permissão negada', 'Você precisa permitir acesso à localização para usar esta função.');
    return;
  }

  const location = await Location.getCurrentPositionAsync({});

  setLatitude(location.coords.latitude.toString());
  setLongitude(location.coords.longitude.toString());
  };

  const handleSubmit = async () => {
    if (!nome || !endereco || !cnpj || !latitude || !longitude) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }

    if (!validarCNPJ(cnpj)) {
      Alert.alert('Erro', 'CNPJ inválido!');
      return;
    }

    const lat = parseFloat(latitude);
    const long = parseFloat(longitude);
    if (isNaN(lat) || isNaN(long)) {
      Alert.alert('Erro', 'Latitude e Longitude devem ser números válidos!');
      return;
    }

    try {
      const dadosExistentes = await AsyncStorage.getItem('@RestauranteApp:restaurantes');
      const restaurantes = dadosExistentes ? JSON.parse(dadosExistentes) : [];

      if (restauranteEdit) {
        const restaurantesAtualizadas = restaurantes.map((r: Restaurante) =>
          r.id === restauranteEdit.id
            ? { ...r, nome, endereco, cnpj, latitude, longitude }
            : r
        );
        await AsyncStorage.setItem('@RestauranteApp:restaurantes', JSON.stringify(restaurantesAtualizadas));
        Alert.alert('Sucesso', 'Restaurante atualizada com sucesso!');
      } else {
        const novoRestaurante: Restaurante = {
          id: Date.now().toString(),
          nome,
          endereco,
          cnpj,
          latitude,
          longitude,
        };
        restaurantes.push(novoRestaurante);
        await AsyncStorage.setItem('@RestauranteApp:restaurantes', JSON.stringify(restaurantes));
        Alert.alert('Sucesso', 'Restaurante cadastrada com sucesso!');
        limparCampos();
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar o restaurante.');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={restaurant_register_styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={restaurant_register_styles.container} keyboardShouldPersistTaps="handled">
          <Text style={restaurant_register_styles.title}>{restauranteEdit ? 'Editar Restaurante' : 'Cadastro de Restaurante'}</Text>

          <Input label="Nome do Restaurante" value={nome} onChangeText={setNome} />
          <Input label="Endereço" value={endereco} onChangeText={setEndereco} />
          <Input
            label="CNPJ"
            value={cnpj}
            onChangeText={(text) => setCnpj(formatarCNPJ(text))}
            keyboardType="numeric"
          />
          <Input
            label="Latitude"
            value={latitude}
            onChangeText={setLatitude}
            keyboardType="numeric"
          />
          <Input
            label="Longitude"
            value={longitude}
            onChangeText={setLongitude}
            keyboardType="numeric"
          />
          <View style={{ marginVertical: 8 }}>
            <Button title="Usar Localização Atual" onPress={obterLocalizacaoAtual} />
          </View>

          <View style={{ marginTop: 24 }}>
            <Button title={restauranteEdit ? 'Salvar Alterações' : 'Cadastrar Restaurante'} onPress={handleSubmit} />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};