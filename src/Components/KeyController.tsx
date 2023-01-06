import { Pressable } from 'react-native';
import AntDesingn from "@expo/vector-icons/AntDesign"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { KeyActions, PresentationActions } from '../types';
import { Flex } from '@react-native-material/core';
import { Dimensions } from 'react-native';
import useWS from '../hooks/useWS'
import { useRef, useState, useEffect } from 'react';
export const KeyController = () => {
  const [connected, setConnected] = useState(false)
  const [presenting, setPresenting] = useState(false)
  const { sendKeyCommand, addConnectionHandler, removeConnectionHandler, sendPresentationCommand } = useRef(useWS).current

  useEffect(() => {
    addConnectionHandler("2", (value) => {
      setConnected(value)
    })
    return () => { removeConnectionHandler("2") }
  }, [])

  const handlePressNext = async () => {
    if (!connected) return
    sendKeyCommand(KeyActions.RIGHT)
  }

  const handlePressPrev = async () => {
    if (!connected) return
    sendKeyCommand(KeyActions.LEFT)
  }

  const handlePressPresentation = async () => {
    if (!connected) return
    if (presenting){
        sendPresentationCommand(PresentationActions.STOP)
    }else{
      sendPresentationCommand(PresentationActions.START)
    }
    setPresenting(!presenting)
  }

  return (
    <Flex fill justify='end'>
      <Flex fill />
      <Flex fill direction='row' justify='center'>
        <Pressable onPress={handlePressPresentation}>
            <MaterialIcons name={presenting?'cancel-presentation':'present-to-all'} size={Dimensions.get("screen").width / 2} color={presenting?"#5e000d":"#4a00ff"} />
        </Pressable>
      </Flex>
      <Flex direction='row' justify='center' h="50%" maxH="100%">
        <Pressable onPress={handlePressPrev}>
          <AntDesingn name='caretleft' size={Dimensions.get("screen").width / 2} color="#ff4400" />
        </Pressable>
        <Pressable onPress={handlePressNext}>
          <AntDesingn name='caretright' size={Dimensions.get("screen").width / 2} color="#0c86e7" />
        </Pressable>
      </Flex>
    </Flex>
  );
}