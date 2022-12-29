import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export const styles = StyleSheet.create({
    container: {
        top: Constants.statusBarHeight,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height:"100%",
        width:"100%"
    },
    buttonContainer: {
        flexDirection: "row"
    },
    urlContainer: {
        width: "80%"
    },
    barcodeScanner: {
        width: "80%",
        height: "80%"
    }
});