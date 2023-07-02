import React from 'react';
import AppNav from './components/AppNav';
import { UserProvider } from './UserContext';

export default function App() {
  return (
    <UserProvider>
     <AppNav/>
    </UserProvider>
  )
}