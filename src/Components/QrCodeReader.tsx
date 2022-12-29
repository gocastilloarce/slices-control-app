import { BarCodeScanner } from "expo-barcode-scanner";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from 'react-native';
import { styles } from "../styles";

export const QRCodeReader = ({handleBarCodeScanned}:any) => {
  const [hasPermission, setHasPermission] = useState(false);
  const getBarcodeScannerPermissions = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted')
  }

  useEffect(() => {
    getBarcodeScannerPermissions()
  }, [])

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {
        !hasPermission&&
        <Button title="Acceder a camara" onPress={getBarcodeScannerPermissions}/>
      }
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
}