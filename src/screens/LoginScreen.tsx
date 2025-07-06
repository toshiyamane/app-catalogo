// LoginScreen.tsx - criado automaticamente
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen = ({ navigation }: Props) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErro('');
    setLoading(true);

    const sucesso = await login(email, senha);

    setLoading(false);

    if (!sucesso) {
      setErro('Usuário ou senha inválidos');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/delicious-food.png')} style={styles.logo} />
      <Text style={styles.title}>Entrar no Delicious Food</Text>

      <Input label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Input label="Senha" value={senha} onChangeText={setSenha} secureTextEntry />

      {erro !== '' && <Text style={styles.error}>{erro}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 16 }} />
      ) : (
        <Button title="Entrar" onPress={handleLogin} />
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Não possui conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  logo: {
    width: 128,
    height: 128,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  error: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 8,
  },
  link: {
    color: '#2563EB',
    marginTop: 16,
  },
});
 