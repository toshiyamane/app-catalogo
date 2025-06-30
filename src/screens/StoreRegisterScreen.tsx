// StoreRegisterScreen.tsx - criado automaticamente
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
import { Loja } from '../types/loja';

type Props = NativeStackScreenProps<AppStackParamList, 'StoreRegister'>;


export const StoreRegisterScreen = ({ route, navigation }: Props) => {
  const lojaEdit = route.params?.loja;

  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    if (lojaEdit) {
      setNome(lojaEdit.nome);
      setEndereco(lojaEdit.endereco);
      setCnpj(lojaEdit.cnpj);
      setLatitude(lojaEdit.latitude);
      setLongitude(lojaEdit.longitude);
    }
  }, [lojaEdit]);

  const limparCampos = () => {
    setNome('');
    setEndereco('');
    setCnpj('');
    setLatitude('');
    setLongitude('');
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
      const dadosExistentes = await AsyncStorage.getItem('@CatalogoDigitalApp:lojas');
      const lojas = dadosExistentes ? JSON.parse(dadosExistentes) : [];

      if (lojaEdit) {
        const lojasAtualizadas = lojas.map((l: Loja) =>
          l.id === lojaEdit.id
            ? { ...l, nome, endereco, cnpj, latitude, longitude }
            : l
        );
        await AsyncStorage.setItem('@CatalogoDigitalApp:lojas', JSON.stringify(lojasAtualizadas));
        Alert.alert('Sucesso', 'Loja atualizada com sucesso!');
      } else {
        const novaLoja: Loja = {
          id: Date.now().toString(),
          nome,
          endereco,
          cnpj,
          latitude,
          longitude,
        };
        lojas.push(novaLoja);
        await AsyncStorage.setItem('@CatalogoDigitalApp:lojas', JSON.stringify(lojas));
        Alert.alert('Sucesso', 'Loja cadastrada com sucesso!');
        limparCampos();
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar a loja.');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{lojaEdit ? 'Editar Loja' : 'Cadastro de Loja'}</Text>

          <Input label="Nome da Loja" value={nome} onChangeText={setNome} />
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

          <View style={{ marginTop: 24 }}>
            <Button title={lojaEdit ? 'Salvar Alterações' : 'Cadastrar Loja'} onPress={handleSubmit} />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 48,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});
 