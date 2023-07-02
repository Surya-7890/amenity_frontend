import { View, Text, Dimensions, Button, TouchableOpacity } from 'react-native'
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setUserInfo } from '../slices/cartSlice';
import { UserContext } from '../UserContext';
import io from "socket.io-client";
import { UserIcon, CurrencyRupeeIcon, BanknotesIcon, BuildingLibraryIcon, CreditCardIcon, ClockIcon } from 'react-native-heroicons/solid'
import AsyncStorage from '@react-native-async-storage/async-storage';

const socket = io('https://backendamenity.onrender.com', {secure: true, autoConnect: false});


export default function About({ navigation }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0);
  const dispatch = useDispatch();
  const { logout, userToken } = useContext(UserContext);


  const { id, balance } = useSelector(store => store.cart);

  const height = Dimensions.get('screen').height;


  const getUserInfo = async () => {
    const res = await axios.get(`https://backendamenity.onrender.com/user/getInfo/${userToken}`);
    const data = await res.data;
    if (data.error) {
     getUserInfo(); 
    } else {
      dispatch(setUserInfo({ balance: data.user.balance, id: data.user.id }));
    }
  }

  useEffect(()=>{
    socket.auth = { userName: id };
    socket.connect();
    socket.on('connect', () => {
      console.log('connected')
  })

    socket.on('gotMoney', () => {
      console.log('got money')
      getUserInfo()
    });
    socket.on('sentMoney', () => {
      console.log('sent money');
      getUserInfo()
    })
    return ()=>{
      socket.disconnect();
      console.log('disconnected')
    }
  }, [])  
  

  const sendAmount = async()=>{
    const res = await axios.post('https://backendamenity.onrender.com/user/transfer',{ to: recipient, from: id, amount,  });
    const data = await res.data;
    const Count = balance - amount;
    setAmount(0)
    setRecipient('');
    if ( !data.error && data.res1 && data.res2 ) {
      socket.emit('transfer', {id: recipient, amount })
      // dispatch(setUserInfo({ balance: Count, id }))
    } else {
      console.log(data.error)
    }
  }

  const signout = async()=>{
    await AsyncStorage.removeItem('token')
    logout();
  }

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <View style={{ backgroundColor: '#111827', height: height/10, borderBottomRightRadius: 40, borderBottomLeftRadius: 40 }}>
      </View>
      <View>
        <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', padding: 20, borderRadius: 5 }}>
            <UserIcon size={100} fill='white' />
            <Text style={{ color: 'white', fontSize: 15 }}>Id: {id}</Text>
          </View>
          <View style={{ backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', padding: 20, borderRadius: 5 }}>
            <CurrencyRupeeIcon size={100} color='white' />
            <Text style={{ color: 'white', fontSize: 15 }}>Balance: {balance}</Text>
          </View>
        </View>
        </View>
        <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 50 }}>
          <TouchableOpacity onPress={() => navigation.navigate("Transfer")}>
          <View style={{ backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', padding: 20, borderRadius: 5 }}>
            <BanknotesIcon size={100} fill='white' />
            <Text style={{ color: 'white', fontSize: 15 }}>Send Money</Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Recent")}>
          <View style={{ backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', padding: 20, borderRadius: 5 }}>
            <CreditCardIcon size={100} color='white' />
            <Text style={{ color: 'white', fontSize: 15 }}>Recharge</Text>
          </View>
          </TouchableOpacity>
        </View>
        </View>
      </View>
      <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 30 }}>
          <Button title='Logout' onPress={signout} />
      </View>
    </View>
  )
}