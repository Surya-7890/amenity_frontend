import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import SvgQRCode from 'react-native-qrcode-svg';

export default function Payment() {

  const [qrText, setQrText] = useState('');

  const getId = async() => {
    const id = await AsyncStorage.getItem('recentOrder');
    setQrText(id);
    console.log('inside fn: ' + qrText)
  }

  useEffect(() => {
    getId();
  },[qrText]);
 
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      { (qrText !== '' && qrText) &&
        <SvgQRCode value={qrText} size={250} />
      }
    </View>
  )
}