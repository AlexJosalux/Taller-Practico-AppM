import { createStackNavigator, Header } from '@react-navigation/stack';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from '@firebase/auth';
import { auth } from '../configs/firebaseConfig';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { View } from 'react-native';
import { styles } from '../theme/appStyles';
import { HomeScreen } from '../screens/HomeScreen';
import { DetailMessageScreen } from '../screens/DetailMessageScreen';

const Stack = createStackNavigator();

export const StackNavigator = () => {

    //hook state verificar si esta autenticado}
    const [isAuth, setisAuth] = useState<boolean>(false)

    //hook state para controlar el estado de carga
    const [isLoading, setisLoading] = useState<boolean>(true)

    ///hook useEffect para verificar el estado de autenticacion
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                //console.log(user);
                setisAuth(true);
            }
            setisLoading(false);

        })
    }, [])//si esta vacio se ejecuta una vez

    return (
        <>
            {
                isLoading ? (
                    <View style={styles.containerActivity}>
                        <ActivityIndicator size={30} />
                    </View>
                )
                    : (
                        <Stack.Navigator initialRouteName={isAuth ? 'Home' : 'Login'}>
                            <Stack.Screen name='Login' options={{ headerShown: false }} component={LoginScreen} />
                            <Stack.Screen name='Register' options={{ headerShown: false }} component={RegisterScreen} />
                            <Stack.Screen name='Home' options={{ headerShown: false }} component={HomeScreen} />
                            <Stack.Screen name='Detail' options={{ title: "Detalle Mensaje" }} component={DetailMessageScreen} />                            
                        </Stack.Navigator>
                    )
            }
        </>
    );
}