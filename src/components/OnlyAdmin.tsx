import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: ReactNode;
}

export const OnlyAdmin = ({ children }: Props) => {
  const { user } = useAuth();

  if (user?.tipo !== 'admin') return null;

  return <>{children}</>;
};
