import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from 'react';
import Definicoes from "../screens/Settings";
import Home from "../screens/Home";
const Stack = createNativeStackNavigator();


export default function Routes(): JSX.Element{
    return(
        <Stack.Navigator
            screenOptions={{
                headerShown:false
            }}
        >
            <Stack.Screen
                name="Home"
                component={Home}
            />
            <Stack.Screen
                name="Definicoes"
                component={Definicoes}
            />
        </Stack.Navigator>
    )
}