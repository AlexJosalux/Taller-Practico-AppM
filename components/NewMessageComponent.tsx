import React, { useState } from 'react'
import { styles } from '../src/theme/appStyles'
import { Button, Divider, IconButton, Modal, Portal, Text, TextInput } from 'react-native-paper'
import { Alert, View } from 'react-native';
import { push, ref, set } from 'firebase/database';
import { dbRealtime } from '../src/configs/firebaseConfig';

//interface para las propiedades de mi componente - modal
interface Props {
    visible: boolean;
    hideModal: () => void; //función
}

//interface para formulario del mensaje
interface FormMessage {
    to: string;
    subject: string;
    message: string;
}

export const NewMessageComponent = ({ visible, hideModal }: Props) => {
    //desestructuración del objeto
    //const {visible, hideModal}=props;
    //hook useState para el estado de los datos del mensaje
    const [formMessage, setFormMessage] = useState<FormMessage>({
        to: "",
        subject: "",
        message: ""
    });

    //función para actualizar el estado del formulario del mensaje
    const handleInputChange = (key: string, value: string) => {
        setFormMessage({ ...formMessage, [key]: value });
    }

    //función para guardar el mensaje
    const handleSaveMessage = async () => {
        if (formMessage.to === "" || formMessage.subject === "" || formMessage.message === "") {
            Alert.alert("Error", "Completa todos los campos");
            return;
        }

        //Guardar mensaje en la BDD
        //1. Referencia a la base de datos - tabla mensajes|
        const dbRef = ref(dbRealtime, "messages");
        //2. Guardar los datos en la referencia
        const saveMessage = push(dbRef);
        //3. Validar datos y establecer los datos en la tabla
        try {
            await set(saveMessage, formMessage);
            //limpiar el formulario para la próxima inserción
            setFormMessage({
                to: "",
                subject: "",
                message: ""
            })
        } catch (error) {
            console.log(error);

        }

        //console.log(formMessage);
        hideModal(); //cerrar el modal
    }

    return (
        <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
                <View style={styles.headerModal}>
                    <Text variant='headlineMedium'>Nuevo Mensaje</Text>
                    <View style={styles.icon}>
                        <IconButton
                            icon="close-circle"
                            size={25}
                            onPress={hideModal} />
                    </View>
                </View>
                <Divider bold={true} />
                <TextInput
                    label="Para"
                    mode='outlined'
                    onChangeText={(value) => handleInputChange("to", value)}
                />
                <TextInput
                    label="Asunto"
                    mode='outlined'
                    onChangeText={(value) => handleInputChange("subject", value)}
                />
                <TextInput
                    placeholder="Mensaje"
                    mode='outlined'
                    onChangeText={(value) => handleInputChange("message", value)}
                    multiline
                    numberOfLines={7}
                    style={styles.inputMessage}
                />
                <Button mode="contained" onPress={handleSaveMessage}>Enviar</Button>
            </Modal>
        </Portal>
    )
}