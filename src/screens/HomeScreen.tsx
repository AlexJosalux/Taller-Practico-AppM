import React from 'react'
import { View } from 'react-native'
import { Avatar, Text } from 'react-native-paper'

export const HomeScreen = () => {
    return (
        <View>
            <Avatar.Text label='AG' size={60} />
            <View>
                <Text variant='bodySmall'>Bienvenido</Text>
                <Text variant='labelLarge'>Anderson Guabil</Text>
            </View>
        </View> 
    )
}
