// src/theme/appStyles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E0F7FA', 
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    containerActivity: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    logoContainer: {
        marginBottom: 20, 
        alignItems: 'center',
        backgroundColor: '#B2EBF2', 
        borderRadius: 20,
        padding: 25,
    },
    text: {
        fontSize: 26, 
        fontWeight: '700', 
        letterSpacing: 0.5,
        color: '#006064', 
        textAlign: 'center',
        marginBottom: 4,
    },

    subtitle: {
        fontSize: 14, 
        color: '#546e7a', 
        textAlign: 'center',
        marginBottom: 40, 
        marginTop: 4,
    },

    inputStyle: {
        width: '100%',
        backgroundColor: 'transparent', 
        borderRadius: 8,
        marginBottom: 15, 
        elevation: 0, 
        shadowOpacity: 0,
        borderBottomWidth: 2,
        borderColor: '#00ACC1', 
    },

    button: {
        width: '100%',
        paddingVertical: 10, 
        backgroundColor: '#00ACC1', 
        borderRadius: 25, 
        marginTop: 20,
        marginBottom: 16,
        elevation: 5, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    buttonLabel: {
        fontWeight: 'bold',
        fontSize: 18, 
    },


    textRedirect: {
        fontSize: 14,
        color: '#00ACC1', 
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 15,
        textDecorationLine: 'none', 
    },

    snackbar: {
        borderRadius: 10,
        marginBottom: 20,
    },
});