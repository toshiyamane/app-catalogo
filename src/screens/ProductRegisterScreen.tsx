// ProductRegisterScreen.tsx - criado automaticamente
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';
import { Produto } from '../types/produto';
import { salvarProduto } from '../services/productService';
import { product_styles } from '../styles/product_styles';
import { Picker } from '@react-native-picker/picker';
import { Restaurante } from '../types/restaurante';
import AsyncStorage from '@react-native-async-storage/async-storage';


type Props = NativeStackScreenProps<AppStackParamList, 'ProductRegister'>;

export const ProductRegisterScreen = ({ route, navigation }: Props) => {
  const produtoEdicao = route.params?.produto;

  const [nome, setNome] = useState(produtoEdicao?.nome || '');
  const [descricao, setDescricao] = useState(produtoEdicao?.descricao || '');
  const [preco, setPreco] = useState(produtoEdicao?.preco || '');
  const [imagem, setImagem] = useState(produtoEdicao?.imagem || '');
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [restauranteId, setRestauranteId] = useState(produtoEdicao?.restauranteId || '');

  useEffect(() => {
    const carregarRestaurantes = async () => {
      const dados = await AsyncStorage.getItem('@RestauranteApp:restaurantes');
      const lista: Restaurante[] = dados ? JSON.parse(dados) : [];
      setRestaurantes(lista);
    };

  carregarRestaurantes();

  if (produtoEdicao) {
    navigation.setOptions({ title: 'Editar Produto' });
  }
  }, []);

  const limparCampos = () => {
    setNome('');
    setDescricao('');
    setPreco('');
    setImagem('');
  };

  const selecionarImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à galeria para selecionar imagens.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImagem(result.assets[0].uri);
    }
  };

   const handleSubmit = async () => {
    if (!nome || !descricao || !preco || !restauranteId) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const id = produtoEdicao?.id ?? Date.now().toString();

    const novoProduto: Produto = {
      id,
      nome,
      descricao,
      preco,
      imagem,
      restauranteId,
    };

    try {
      await salvarProduto(novoProduto);

      Alert.alert(
        'Sucesso',
        produtoEdicao ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!'
      );

      if (produtoEdicao) {
        navigation.goBack();
      } else {
        limparCampos();
         navigation.navigate('ProductList', { restauranteId: novoProduto.restauranteId });
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar o produto.');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={product_styles.container}>
        <Text style={product_styles.title}>
          {produtoEdicao ? 'Editar Produto' : 'Cadastro de Produto'}
        </Text>

        <Input label="Nome do Produto" value={nome} onChangeText={setNome} />
        <Input label="Descrição" value={descricao} onChangeText={setDescricao} />
        <Input label="Preço" value={preco} onChangeText={setPreco} keyboardType="numeric" />

        <Text style={{ fontSize: 16, marginTop: 16, marginBottom: 4 }}>Restaurante</Text>
        <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 16 }}>
          <Picker
            enabled={!produtoEdicao} // desabilita o picker se estiver editando
            selectedValue={restauranteId}
            onValueChange={(itemValue) => setRestauranteId(itemValue)}
          >
            <Picker.Item label="Selecione um restaurante" value="" />
            {restaurantes.map((rest) => (
              <Picker.Item key={rest.id} label={rest.nome} value={rest.id} />
            ))}
          </Picker>
        </View>

        <Button title="Selecionar Imagem" onPress={selecionarImagem} />

        {imagem !== '' && (
          <Image source={{ uri: imagem }} style={product_styles.previewImage} />
        )}

        <Button
          title={produtoEdicao ? 'Salvar Alterações' : 'Cadastrar Produto'}
          onPress={handleSubmit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
