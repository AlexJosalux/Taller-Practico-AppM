import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Button, Divider, Text, TextInput } from 'react-native-paper'
import { styles } from '../theme/appStyles'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Message } from './HomeScreen'
import { ref, remove, update } from 'firebase/database'
import { dbRealtime } from '../configs/firebaseConfig'

export const DetailMessageScreen = () => {
    //hook useRoute: permite paso de parámetros entre pantallas (navegación)
    const route = useRoute();
    //@ts-ignore
    const { message } = route.params;
    //console.log(message);

    //hook useState para el estado del formulario del mensaje
    const [formEdit, setFormEdit] = useState<Message>({
        id: '',
        to: '',
        subject: '',
        message: ''
    });

    //hook useEffect para cargar los datos del mensaje al estado del formulario
    useEffect(() => {
        setFormEdit(message)
    }, [])

    //hook useNavigation para la navegación entre pantallas
    const navigation = useNavigation();

    //Función para actualizar el estado del formulario del mensaje
    const handleInputChange = (key: string, value: string) => {
        setFormEdit({ ...formEdit, [key]: value })
    }

    //Función para actualizar el mensaje
    const handleUpdateMessage = async () => {
        //Colocar la referencia de la BDD
        const dbRef = ref(dbRealtime, "messages/" + formEdit.id)
        await update(dbRef, {
            message: formEdit.message
        });
        navigation.goBack();
        //console.log(formEdit);
    }

    //Función para eliminar el mensaje
    const handleDeleteMessage = async() => {
        //Colocar la referencia de la BDD
        const dbRef = ref(dbRealtime, "messages/" + formEdit.id)
        await remove(dbRef);
        navigation.goBack();
    }


    return (
        <View style={styles.containerDetail}>
            <View>
                <Text variant='headlineSmall'>Asunto: {formEdit.subject}</Text>
                <Divider bold={true} />
            </View>
            <View>
                <Text variant='bodyLarge'>Para: {formEdit.to}</Text>
                <Divider bold={true} />
            </View>
            <View style={{ gap: 20 }}>
                <Text style={styles.textMessage}>Mensaje</Text>
                <TextInput
                    value={formEdit.message}
                    multiline
                    style={styles.inputMessage}
                    onChangeText={(value) => handleInputChange('message', value)} />
            </View>
            <Button mode='contained'
                icon="email-sync"
                onPress={handleUpdateMessage}>
                Actualizar
            </Button>
            <Button mode='contained'
                icon="email-remove"
                onPress={handleDeleteMessage}>
                Eliminar
            </Button>
        </View>
    )
}