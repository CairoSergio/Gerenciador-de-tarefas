import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native'
import Routes from './src/Routes';
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
        'inter-regular': require('./assets/fonts/static/Inter-Medium.ttf'),
        'noto': require('./assets/fonts/NotoSerif-Regular.ttf'),
        'noto-bold': require('./assets/fonts/NotoSerif-Bold.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
  
    <NavigationContainer>
      <Routes/>
    </NavigationContainer>
  );
}
