import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, ImageBackground } from 'react-native'
import { UserContext } from '../UserContext';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Money from '../assets/money.jpg'
import axios from 'axios';
import { io } from 'socket.io-client';
import { setUserInfo } from '../slices/cartSlice';

const socket = io('https://backendamenity.onrender.com', {secure: true, autoConnect: false});

export default function MoneyTransfer({ navigation }) {

    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const { logout, userToken } = useContext(UserContext);

    const getUserInfo = async () => {
      console.log(userToken);
      const res = await axios.get(`https://backendamenity.onrender.com/user/getInfo/${userToken}`);
      const data = await res.data;
      if (data.error) {
       getUserInfo(); 
      } else {
        dispatch(setUserInfo({ balance: data.user.balance, id: data.user.id }));
      }
    }
  

    useEffect(() => {
      socket.auth = { userName: id };
      socket.connect();
      socket.on('connect', () => {
        console.log('connected')
      });
      socket.on('gotMoney', () => {
        console.log('got money')
        getUserInfo()
      });
      socket.on('sentMoney', () => {
        console.log('sent money');
        getUserInfo()
      }) ;

      return ()=>{
        socket.disconnect();
        console.log('disconnected')
      }

    },[])
    
    const { id, balance } = useSelector(store => store.cart);
    const height = Dimensions.get('screen').height;

    const handleChangeInAmount = (value) => {
        const data = Number(value);
        setAmount(data);
    }
    
    const handleChangeInRecipientId = (value) => {
        setRecipient(value);
    }    

    const sendAmount = async()=>{
        const res = await axios.post('https://backendamenity.onrender.com/user/transfer',{ to: recipient, from: id, amount,  });
        const data = await res.data;
        const Count = balance - amount;
        setAmount(0)
        setRecipient('');
        setIsLoading(true);
        if ( !data.error ) {
          socket.emit('transfer', {id: recipient, amount })
          // dispatch(setUserInfo({ balance: Count, id }))
          setTimeout(() => {
            navigation.navigate("About");
          }, 2000)
        } else {
          console.log(data.error)
        }
    }    

    return (
    <View style={{ flex: 1, position: 'relative' }}>
      <View style={{ position: 'absolute', top: 0, height: '100%', width: '100%' }}>
        <ImageBackground source={require('../assets/money.jpg')} resizeMode="cover" style={{ height: '100%' }} />
      </View>
      <View style={{ backgroundColor: 'white', height: height/10, borderBottomRightRadius: 40, borderBottomLeftRadius: 40 }}>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
        <TextInput placeholder='Send To' value={recipient} onChangeText={handleChangeInRecipientId} placeholderTextColor='white' style={{ backgroundColor: '#4b5563', color: 'white', width: '50%', marginTop: 10, paddingHorizontal: 10, borderRadius: 5, paddingVertical: 5 }} /> 
        <TextInput placeholder='Amount' value={amount} keyboardType='numeric' onChangeText={handleChangeInAmount} placeholderTextColor='white' style={{ backgroundColor: '#4b5563', color: 'white', width: '50%', marginTop: 10, paddingHorizontal: 10, borderRadius: 5, paddingVertical: 5 }} /> 
        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity onPress={sendAmount}>
          <View style={{ marginTop: 15, backgroundColor: '#4ade80', width: '50%', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 5 }}>
            <Text style={{ color: 'white', fontSize: 15 }}>Send</Text>
          </View>
        </TouchableOpacity>
        { isLoading &&
        <View>
          <Text style={{ fontSize: 50, color: 'white' }}>LOADING...</Text>
        </View>
        }
        </View>
      </View>
    </View>
    )
}