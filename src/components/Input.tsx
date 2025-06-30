import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { imput_styles } from '../styles/imput';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const Input = ({ label, error, ...rest }: InputProps) => {
  return (
    <View style={imput_styles.container}>
      <Text style={imput_styles.label}>{label}</Text>
      <TextInput
        style={imput_styles.input}
        placeholderTextColor="#999"
        {...rest}
      />
      {error && <Text style={imput_styles.error}>{error}</Text>}
    </View>
  );
};


 