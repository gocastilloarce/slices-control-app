import { StatusBar } from 'expo-status-bar';
import { Button, TextInput, View, Text } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { styles } from './styles';
import { QRCodeReader } from './Components/QrCodeReader';

export default function Main() {
  var ws = useRef({})

  useEffect(()=>{
    console.log(ws.current)
    if(ws.current instanceof WebSocket) {
      const socket = ws.current as WebSocket 
      socket.onopen = ()=> {
        setConnected(true)
      }
      socket.onclose = ()=>{
        setConnected(false)
      }
      socket.onmessage=(e)=>{
        console.log("mensaje",e)
      }
    }
  }, [ws.current])

  const submsg = (message:string)=>{
    if(ws.current instanceof WebSocket) {
      const socket = ws.current
      if(socket.readyState === WebSocket.OPEN) {
        return socket.send(message)
      }
      alert("no conectado")
    }
  }
  //Backend connection
  const [serverAddress, setServerAddress] = useState("")
  const [readingQR, setReadingQR] = useState(false)
  const [connected, setConnected] = useState(false)
  const handlePressNext = async () => {
    if (serverAddress === '') return
    submsg(JSON.stringify({event:"key", body:{token:"holatoken", keypress:"right"}}))
  }

  const handlePressPrev = async () => {
    if (serverAddress === '') return
    submsg(JSON.stringify({event:"key", body:{token:"holatoken", keypress:"left"}}))
  }

  const postToServer = async (serverIp: string, pathname: string) => {
    try {
      if (serverIp === '') return
      let target = (serverIp.endsWith("/") && pathname.startsWith("/")) ? serverIp.slice(0, -1) + pathname : serverIp + pathname
      const response = await fetch(target, { method: 'POST' });
      if (!response.ok) {
        throw new Error('No se pudo hacer fetch')
      }
    } catch (err) {
      console.log("error1", err)
    }
  }

  const getToServer = async (serverIp: string, pathname: string) => {
    try {
      if (serverIp === '') return
      let target = (serverIp.endsWith("/") && pathname.startsWith("/")) ? serverIp.slice(0, -1) + pathname : serverIp + pathname
      const response = await fetch(target);
      if (!response.ok) {
        throw new Error('No se pudo hacer fetch')
      }
      return { res: response.body, status: response.status }
    } catch (err) {
      return { res: {}, status: 400 }
    }
  }

  const handleChangeServerIp = (value: string) => {
    setServerAddress(value)
  }

  const handlePressQR = () => {
    setReadingQR(true);
  }

  const handleBarCodeScanned = async({ type, data }: any) => {
    if(ws.current instanceof WebSocket) {
      ws.current.close()
    }
    const newWS=new WebSocket(data)
    ws.current = newWS
    setServerAddress(data)
    setReadingQR(false)
    if(newWS.readyState !== WebSocket.OPEN) {
      return setConnected(false)
    }
  }

  return (
    <>
      <StatusBar />
      <View style={styles.container}>
        <View style={styles.urlContainer}>
          <TextInput placeholder='Hola' onChangeText={handleChangeServerIp} value={serverAddress} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title='Anterior' onPress={handlePressPrev} />
          <Button title='Siguiente' onPress={handlePressNext} />
        </View>
        <Button title='QR' onPress={handlePressQR} />
        {
          !connected && <Text>No conectado</Text>
        }
        {
          readingQR &&
          <View style={styles.container}>
            <QRCodeReader handleBarCodeScanned={handleBarCodeScanned}></QRCodeReader>
          </View>
        }
      </View>
    </>
  );
}
