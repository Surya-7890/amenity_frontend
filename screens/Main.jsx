import { View, Text, TextInput, TouchableOpacity, Image, Dimensions } from 'react-native'
import React,{useState, useContext} from 'react';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from '../slices/cartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserContext } from '../UserContext';
import { Motion } from '@legendapp/motion';
import { Login } from '../assets/images'

export default function Main({ navigation }) {

    const { login } = useContext(UserContext);
    const [input, setInput] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const { id } = useSelector(state => state.cart);
    const handleChange = (value) => {
        setInput(value);
    }
    
    const width = Dimensions.get('screen').width;
    

    const handleSubmit = async()=>{

        if (input === '') {
            setErrorMessage('Please enter your roll no.')
            setTimeout(() => {
                setErrorMessage('')
            },2000)
        } else {
            setIsLoading(true);
            const res = await axios.post('https://backendamenity.onrender.com/user',{ id: input });
            const data = await res.data;
            await AsyncStorage.setItem('token', data?.token);
            await AsyncStorage.setItem('id', data.user?.id);
            const balance = JSON.stringify(data.user.balance);
            balance && await AsyncStorage.setItem('balance', balance);
            console.log(data);
            data.user ? login(data.token) : setErrorMessage(data.message);
        }
    }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ elevation: 1, height: '100%', width: '100%', opacity: 1 }}>
            <Image source={require('../assets/login.jpg')} style={{ height: '100%', width: '100%' }} />
        </View>
        <View style={{ position: 'absolute',  elevation: 10, top: 0, left: 0, height: '100%', width: '100%' }}>
        <View style={{ flex: 15,  width: '100%',   overflow: 'hidden', position: 'relative' }}>
            <Motion.View 
            style={{ borderWidth: 5,borderColor: '#9333ea', height: 100, width: 100, zIndex: 10 }}
            initial={{ x: -100, y: -100 }}
            animate={{ x: 0, y: 0 }}
            transition={{ duration: 10, type: 'spring', easing: 'easeIn' }}
            ></Motion.View>
            <Motion.View 
            style={{ borderWidth: 5,borderColor: '#c084fc', height: 100, width: 100,  zIndex: 1, position: 'absolute', top: 30, left: 30 }}
            initial={{ x: -120, y: -120 }}
            animate={{ x: 0, y: 0 }}
            transition={{ duration: 10, delay: 5, easing: 'easeIn' }}
            ></Motion.View>
        </View>
        <View style={{ width: '100%', justifyContent: 'space-evenly', alignItems: 'center',height: '35%', width, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
            <View>
                <Text style={{ fontSize: 40, fontWeight: '900', color: 'white' }}>LOGIN</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 15, fontWeight: '700', marginRight: 10, color: 'white' }}>Roll No :</Text>
                <TextInput value={input} onChangeText={(e) => setInput(e)} style={{ fontSize: 15, width: '40%', borderColor: 'white', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, color: 'white' }} />
            </View>
            <View style={{ paddingLeft: '25%' }}>
                <TouchableOpacity onPress={handleSubmit}>
                    <View style={{ backgroundColor: '#9333ea', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, width: 100, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 15 }}>Submit</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {errorMessage &&
             <View>
                <Text>{ errorMessage }</Text>
             </View>
            }
            { isLoading &&
                <View>
                    <Text style={{ color: 'white', fontSize: 30 }}>Loading...</Text>
                </View>
            }
        </View>
        <Motion.View 
        style={{ flex: 15, width: '100%',  justifyContent: 'flex-end', alignItems: 'flex-end'  }}
        >
            <View style={{ borderWidth: 5, borderColor: '#c084fc', height: 100, width: 100, position: 'absolute', bottom: 30, right: 30 }}
            initial={{ x: 120, y: 120 }}
            animate={{ x: 0, y: 0 }}
            transition={{ duration: 10, delay: 5, easing: 'easeIn' }}            
            ></View>
            <View style={{ borderWidth: 5, borderColor: '#9333ea', height: 100, width: 100 }}
            initial={{ x: 100, y: 100 }}
            animate={{ x: 0, y: 0 }}
            transition={{ duration: 10, easing: 'easeIn' }}
            ></View>   
        </Motion.View>
    </View>
    </View>
  )
}