// navigation.ts - criado automaticamente
import { RestaurantListScreen } from '../screens/RestaurantListScreen';
import { Restaurante } from './restaurante';
import { Produto } from './produto';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  RestaurantRegister: {restaurante?: Restaurante};
  ProductRegister: {produto?: Produto};
  ProductList:  { restauranteId?: string };
  RestaurantList: undefined;
  RestaurantSelection: undefined;
};


 