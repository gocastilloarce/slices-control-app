import { Text, Pressable } from 'react-native';
import { useState, useMemo, useRef, useEffect } from 'react';
import { Flex } from '@react-native-material/core';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import useWS from './hooks/useWS';
import Constants from 'expo-constants';
import { QRCodeReader } from './components/QrCodeReader';
import { KeyController } from './components/KeyController';

export default function Main() {
  const { connect, disconnect, addConnectionHandler, removeConnectionHandler } = useRef(useWS).current
  const [connected, setConnected] = useState(false)
  const [readingQR, setReadingQR] = useState(false)
  
  useEffect(()=>{
    addConnectionHandler("1", (value) => {
      setConnected(value)
    })
    return ()=>{removeConnectionHandler("1")}
  }, []) 
  
  const icon = useMemo(() => {
    const props = { size: 60 }
    if (readingQR) return <MaterialCommunityIcons name='close' color="#2300dd" {...props} />
    if (connected) return <MaterialCommunityIcons name='connection' color="#920015" {...props} />
    return <MaterialCommunityIcons name='qrcode' color="#2300dd" {...props} />
  }, [connected, readingQR])

  //Backend connection
  const [_, setServerAddress] = useState("")

  const handleBarCodeScanned = async ({ type, data }: any) => {
    connect(data)
    setServerAddress(data)
    setReadingQR(false)
  }

  const handlePressCornerButton = () => {
    if (connected) return disconnect();
    if (readingQR) return setReadingQR(false);
    setReadingQR(true);
  }

  return (
    <Flex fill top={Constants.statusBarHeight} bg="#40e0d0" >
      <Flex w="100%" direction='row' justify="between">
        <Text style={{ fontSize: 45 }}>{connected ? "Conectado" : "Desconectado"}</Text>
        <Pressable onPress={handlePressCornerButton}>
          {icon}
        </Pressable>
      </Flex>
      {
        readingQR ?
          <QRCodeReader
            handleBarCodeScanned={handleBarCodeScanned} /> :
          <>
            {
              connected ?
                <KeyController /> :
                <></>
            }
          </>
      }
    </Flex>
  )
}
