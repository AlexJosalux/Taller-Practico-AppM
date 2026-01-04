import React from 'react'
import { View } from 'react-native'
import { IconButton, Text } from 'react-native-paper'
import { styles } from '../src/theme/appStyles'
import { Message } from '../src/screens/HomeScreen'
import { CommonActions, useNavigation } from '@react-navigation/native';

//interface para los props del componente Message
interface Props {
    message: Message;
}

export const MessageComponent = ({ message }: Props) => {

    //hook useNavigation para la navegación entre pantallas
    const navigation = useNavigation();

    return (
        <View style={styles.containerMessage}>
            <View>
                <Text variant='labelLarge'>Para: {message.to}</Text>
                <Text variant='bodyMedium'>Asunto: {message.subject}</Text>
            </View>
            <View style={styles.icon}>
                <IconButton
                    icon="email-open"
                    size={30}
                    onPress={() => navigation.dispatch(CommonActions.navigate({ name: 'Detail', params: {message}}))} />
            </View>
        </View>

    )
}