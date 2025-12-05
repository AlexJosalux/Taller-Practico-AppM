import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,Pressable,StyleSheet,Alert,} from 'react-native';

export const JuegoScreen: React.FC = () => {
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [message, setMessage] = useState<string>('¡Adivina un número entre 1 y 100!');
  const [attempts, setAttempts] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    const randomNum = Math.floor(Math.random() * 100) + 1;
    setTargetNumber(randomNum);
    console.log('Número secreto:', randomNum);
  }, []);

  const handleInputChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      setGuess(value);
    }
  };

  const handleSubmit = () => {
    const guessNum = parseInt(guess, 10);

    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      Alert.alert('Entrada inválida', 'Ingresa un número entre 1 y 100.');
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (guessNum === targetNumber) {
      setMessage(`🎉 ¡Correcto! Era ${targetNumber}.\nLo lograste en ${newAttempts} intentos.`);
      setGameOver(true);
    } else if (guessNum < targetNumber) {
      setMessage('🔽 Demasiado bajo\n¡Intenta un número más alto!');
    } else {
      setMessage('🔼 Demasiado alto\n¡Intenta un número más bajo!');
    }

    setGuess('');
  };

  const handleRestart = () => {
    const randomNum = Math.floor(Math.random() * 100) + 1;
    setTargetNumber(randomNum);
    setGuess('');
    setMessage('¡Adivina un número entre 1 y 100!');
    setAttempts(0);
    setGameOver(false);
    console.log('Numero secreto:', randomNum);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🕹️ Adivinator</Text>
        
        <Text style={styles.attempts}>Intentos: {attempts}</Text>

        <Text 
          style={[
            styles.message, 
            gameOver && styles.messageSuccess, 
            message.includes('Demasiado') && styles.messageFeedback
          ]}
        >
          {message}
        </Text>

        {!gameOver ? (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={guess}
              onChangeText={handleInputChange}
              placeholder="1-100"
              placeholderTextColor="#99ff99"
              keyboardType="numeric"
              maxLength={3}
            />
            <Pressable 
              style={({ pressed }) => [
                styles.guessButton,
                pressed && { backgroundColor: '#FF2D6F' } // Color de presionado
              ]} 
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>ADIVINAR</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable 
            style={({ pressed }) => [
              styles.restartButton,
              pressed && { backgroundColor: '#6200EE' } // Color de presionado
            ]} 
            onPress={handleRestart}
          >
            <Text style={styles.buttonText}>JUGAR DE NUEVO</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff', 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {

    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 30,
    borderWidth: 2,
    borderColor: '#00FFFF', 
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 20, 
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FF0077', 
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: '#FF0077',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  attempts: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00FFFF', 
    marginBottom: 25,
    padding: 8,
    borderWidth: 1,
    borderColor: '#00FFFF80',
    borderRadius: 8,
    backgroundColor: '#00FFFF10',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 35,
    color: '#E0E0E0', 
    lineHeight: 26,
    paddingHorizontal: 10,
    minHeight: 50, 
  },
  messageSuccess: {

    color: '#39FF14', 
    fontWeight: 'bold',
    textShadowColor: '#39FF14',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  messageFeedback: {
    color: '#FFD700', 
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  input: {
    borderWidth: 2,
    borderColor: '#39FF14', 
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '700',
    color: '#39FF14',
    backgroundColor: '#121212', 
    flex: 1,
    maxWidth: 130,
    textShadowColor: '#39FF14',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  guessButton: {
    backgroundColor: '#FF0077', 
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 10,
    minWidth: 110,
    alignItems: 'center',
    shadowColor: '#FF0077',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 8,
  },
  restartButton: {

    backgroundColor: '#673AB7', 
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#673AB7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
});