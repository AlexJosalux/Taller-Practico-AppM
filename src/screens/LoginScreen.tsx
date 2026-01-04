// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import {Button,Snackbar,Text,TextInput,useTheme} from 'react-native-paper';
import { styles } from '../theme/appStyles';
import { auth } from '../configs/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

interface FormLogin {
  email: string;
  password: string;
}

interface Message {
  visible: boolean;
  text: string;
  color: string;
}
const logoImage = require('../../assets/preg.png'); 
export const LoginScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [hiddenPassword, setHiddenPassword] = useState<boolean>(true);
  const [formLogin, setFormLogin] = useState<FormLogin>({
    email: '',
    password: '',
  });
  const [showMessage, setShowMessage] = useState<Message>({
    visible: false,
    text: '',
    color: '',
  });

  const handleInputChange = (key: string, value: string): void => {
    setFormLogin({ ...formLogin, [key]: value });
  };

  const handleSignIn = async () => {
    if (!formLogin.email || !formLogin.password) {
      setShowMessage({
        visible: true,
        text: 'Completa todos los campos',
        color: '#ef5350', // Rojo suave
      });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, formLogin.email, formLogin.password);
      
      // Añadida navegación para ir a la pantalla principal (asumida como 'Home')
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' as never }], // Redirige a la pantalla principal
        })
      );

      //   text: '¡Bienvenido! Inicio de sesión exitoso',
      //   color: '#4caf50', // Verde
      // });
      setFormLogin({ email: '', password: '' });

    } catch (error: any) {
      let msg = 'Correo o contraseña incorrectos';
      if (error.code === 'auth/user-not-found') {
        msg = 'Usuario no registrado';
      } else if (error.code === 'auth/invalid-credential') {
        msg = 'Credenciales inválidas';
      }
      setShowMessage({
        visible: true,
        text: msg,
        color: '#ef5350',
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logoImage} style={localStyles.logoImage} />
        <Text style={styles.text}>Adivina el Número</Text> 
        <Text style={styles.subtitle}>Inicia sesión para jugar</Text>
      </View>

      <TextInput
        mode="outlined"
        label="Correo electrónico"
        placeholder="ejemplo@correo.com"
        value={formLogin.email}
        onChangeText={(value) => handleInputChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
        left={<TextInput.Icon icon="email" />}
        style={styles.inputStyle}
      />

      <TextInput
        mode="outlined"
        label="Contraseña"
        placeholder="••••••••"
        value={formLogin.password}
        onChangeText={(value) => handleInputChange('password', value)}
        secureTextEntry={hiddenPassword}
        left={<TextInput.Icon icon="lock" />}
        right={
          <TextInput.Icon
            icon={hiddenPassword ? 'eye-off' : 'eye'}
            onPress={() => setHiddenPassword(!hiddenPassword)}
          />
        }
        style={styles.inputStyle}
      />

      <Button
        mode="contained"
        onPress={handleSignIn}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        icon="login"
      >
        Iniciar Sesión
      </Button>

      <Text
        style={styles.textRedirect}
        onPress={() => navigation.dispatch(CommonActions.navigate({ name: 'Register' }))}
      >
        ¿No tienes cuenta? Regístrate
      </Text>

      <Snackbar
        visible={showMessage.visible}
        onDismiss={() => setShowMessage({ ...showMessage, visible: false })}
        style={[styles.snackbar, { backgroundColor: showMessage.color }]}
        duration={3000}
      >
        {showMessage.text}
      </Snackbar>
    </View>
  );
  
};
const localStyles = StyleSheet.create({
  logoImage: {
    width: 100, 
    height: 100, 
    resizeMode: 'contain',
    marginBottom: 15, 
  },
});