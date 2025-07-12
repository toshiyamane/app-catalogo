import { StyleSheet } from 'react-native';

export const restaurant_selection_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // cinza claro
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  endereco: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  coord: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 6,
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
    color: '#6B7280',
    fontSize: 16,
  },
});
