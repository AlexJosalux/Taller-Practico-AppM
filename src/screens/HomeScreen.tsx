import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Pressable, Alert } from 'react-native' 
import { Avatar, Button, Divider, FAB, IconButton, Modal, Portal, Text, TextInput } from 'react-native-paper'
import { styles } from '../theme/appStyles'
import firebase, { signOut, updateProfile } from 'firebase/auth';
import { auth, dbRealtime, storage } from '../configs/firebaseConfig';
import { FlatList } from 'react-native-gesture-handler';
import { MessageComponent } from '../../components/MessageComponent';
import { NewMessageComponent } from '../../components/NewMessageComponent';
import { onValue, ref } from 'firebase/database';
import { CommonActions, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { ref as refStorage, uploadBytes, getDownloadURL } from 'firebase/storage';

//interface para la información del usuario autenticado
interface User {
    name: string;
    photo: string;
}

//interface para los datos de los mensajes
export interface Message {
    id: string;
    to: string;
    subject: string;
    message: string;
}

export const HomeScreen = () => {

    // --- ESTADOS ORIGINALES ---
    const [user, setUser] = useState<User>({ name: "", photo: "" });
    const [showModal, setShowModal] = useState<boolean>(false);
    const [userAuth, setUserAuth] = useState<firebase.User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [showModalMessage, setShowModalMessage] = useState<boolean>(false);

    // --- ESTADOS DEL JUEGO (Agregados) ---
    const [targetNumber, setTargetNumber] = useState<number>(0);
    const [guess, setGuess] = useState<string>('');
    const [gameMsg, setGameMsg] = useState<string>('¡Adivina un número entre 1 y 100!');
    const [attempts, setAttempts] = useState<number>(0);
    const [gameOver, setGameOver] = useState<boolean>(false);

    //hook useEffect para obtener la información del usuario autenticado
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUserAuth(currentUser);
                setUser({
                    name: currentUser?.displayName ?? "",
                    photo: currentUser?.photoURL ?? ""
                })
            }
        });
        getAllMessages();
        initGame(); // Iniciar el juego al cargar
        return unsubscribe
    }, []);

    const navigation = useNavigation();

    // --- LÓGICA DEL JUEGO (Agregada) ---
    const initGame = () => {
        const randomNum = Math.floor(Math.random() * 100) + 1;
        setTargetNumber(randomNum);
        setGuess('');
        setGameMsg('¡Adivina un número entre 1 y 100!');
        setAttempts(0);
        setGameOver(false);
    };

    const handleGuess = () => {
        const guessNum = parseInt(guess, 10);
        if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
            Alert.alert('Error', 'Ingresa un número válido entre 1 y 100.');
            return;
        }
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (guessNum === targetNumber) {
            setGameMsg(`🎉 ¡Correcto! Era ${targetNumber}.\nLo lograste en ${newAttempts} intentos.`);
            setGameOver(true);
        } else {
            setGameMsg(guessNum < targetNumber ? '🔽 Demasiado bajo' : '🔼 Demasiado alto');
        }
        setGuess('');
    };

    // --- FUNCIONES ORIGINALES (Sin cambios) ---
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5
        });
        if (!result.canceled) { setUser({ ...user, photo: result.assets[0].uri }); }
    }

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Se requieren permisos para usar la cámara');
            return;
        }
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5
        });
        if (!result.canceled) { setUser({ ...user, photo: result.assets[0].uri }); }
    }

    const uploadImage = async (uri: string) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const fileRef = refStorage(storage, `avatars/${userAuth?.uid}`);
        await uploadBytes(fileRef, blob);
        return await getDownloadURL(fileRef);
    }

    const handleInputChange = (key: string, value: string) => {
        setUser({ ...user, [key]: value })
    }

    const handleUpdateUser = async () => {
        let photoURL = userAuth?.photoURL;
        if (user.photo && user.photo !== userAuth?.photoURL) {
            photoURL = await uploadImage(user.photo);
        }
        await updateProfile(userAuth!, {
            displayName: user.name,
            photoURL: photoURL
        })
        setShowModal(false);
        alert("Perfil actualizado correctamente");
    }

    const getAllMessages = () => {
        const dbRef = ref(dbRealtime, "messages");
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                setMessages([]);
                return;
            }
            const getKeys = Object.keys(data);
            const listMessages: Message[] = getKeys.map((key) => {
                return { ...data[key], id: key }
            });
            setMessages(listMessages);
        });
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }));
            setShowModal(false);
        } catch (error) { console.log(error); }
    }

    return (
        <>
            <View style={styles.containerHome}>
                <View style={styles.headerHome}>
                    {user.photo ? (
                        <Avatar.Image size={50} source={{ uri: user.photo }} />
                    ) : (
                        <Avatar.Text label='AR' size={50} />
                    )}
                    <View>
                        <Text variant='bodySmall'>Bienvenido</Text>
                        <Text variant='labelLarge'>{userAuth?.displayName}</Text>
                    </View>
                    <View style={styles.icon}>
                        <IconButton
                            icon="account-cog"
                            size={30}
                            mode="contained"
                            onPress={() => setShowModal(true)} />
                    </View>
                </View>

                {/* --- SECCIÓN DEL JUEGO (Implementada aquí) --- */}
                <View style={localStyles.gameCard}>
                    <Text style={localStyles.gameTitle}>🕹️ Adivinator</Text>
                    <Text style={localStyles.gameAttempts}>Intentos: {attempts}</Text>
                    <Text style={[localStyles.gameMessage, gameOver && localStyles.gameSuccess]}>
                        {gameMsg}
                    </Text>

                    {!gameOver ? (
                        <View style={localStyles.gameInputRow}>
                            <TextInput
                                mode="outlined"
                                style={localStyles.gameInput}
                                value={guess}
                                onChangeText={(v) => /^\d*$/.test(v) && setGuess(v)}
                                keyboardType="numeric"
                                placeholder="1-100"
                                maxLength={3}
                                dense
                            />
                            <Button 
                                mode="contained" 
                                onPress={handleGuess}
                                style={localStyles.gameButton}
                            >
                                OK
                            </Button>
                        </View>
                    ) : (
                        <Button 
                            mode="contained" 
                            onPress={initGame} 
                            style={localStyles.restartButton}
                        >
                            JUGAR DE NUEVO
                        </Button>
                    )}
                </View>

                <Divider style={{ marginVertical: 10 }} />

                <View style={{ flex: 1 }}>
                    <FlatList
                        data={messages}
                        renderItem={({ item }) => <MessageComponent message={item} />}
                        keyExtractor={item => item.id}
                    />
                </View>

                <Portal>
                    <Modal visible={showModal} onDismiss={() => setShowModal(false)} contentContainerStyle={styles.modal}>
                        <View style={styles.headerModal}>
                            <Text variant='headlineMedium'>Mi Perfil</Text>
                            <View style={styles.icon}>
                                <IconButton
                                    icon="close-circle"
                                    size={25}
                                    onPress={() => setShowModal(false)} />
                            </View>
                        </View>
                        <Divider bold={true} />
                        <View style={styles.containerImage}>
                            {user.photo ? (
                                <Avatar.Image size={100} source={{ uri: user.photo }} />
                            ) : (
                                <Avatar.Icon size={100} icon="account" />
                            )}
                            <View style={styles.containerIcons}>
                                <IconButton icon='image-album' mode='contained-tonal' size={25} onPress={pickImage} />
                                <IconButton icon='camera' mode='contained-tonal' size={25} onPress={takePhoto} />
                            </View>
                            <Text variant='labelSmall'>Cambiar foto de perfil</Text>
                        </View>
                        <TextInput
                            mode='outlined'
                            label="Nombre"
                            value={user.name}
                            onChangeText={(value) => handleInputChange("name", value)}
                        />
                        <TextInput
                            mode='outlined'
                            label="Correo Electrónico"
                            value={userAuth?.email!}
                            disabled
                        />
                        <Button mode='contained' onPress={handleUpdateUser}>
                            Actualizar
                        </Button>
                        <View style={styles.iconSingOut}>
                            <IconButton icon="logout" mode='contained' size={30} onPress={handleSignOut} />
                        </View>
                    </Modal>
                </Portal>
            </View>
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => setShowModalMessage(true)}
            />
            <NewMessageComponent
                visible={showModalMessage}
                hideModal={() => setShowModalMessage(false)} />
        </>
    )
}

// --- ESTILOS LOCALES ACTUALIZADOS ---
const localStyles = StyleSheet.create({
    gameCard: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 15,
        marginHorizontal: 20,
        marginVertical: 10,
        borderWidth: 2,
        borderColor: '#00FFFF', 
        alignItems: 'center',
        elevation: 8,
    },
    gameTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FF0077',
        marginBottom: 5,
    },
    gameAttempts: {
        fontSize: 12,
        color: '#00FFFF',
        marginBottom: 10,
    },
    gameMessage: {
        fontSize: 15,
        textAlign: 'center',
        color: '#E0E0E0',
        marginBottom: 15,
        minHeight: 40,
    },
    gameSuccess: {
        color: '#39FF14',
        fontWeight: 'bold',
    },
    gameInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    gameInput: {
        width: 100,
        backgroundColor: '#FFF',
    },
    gameButton: {
        backgroundColor: '#FF0077',
    },
    restartButton: {
        backgroundColor: '#673AB7',
        width: '100%',
    }
});