import { View, TextInput, Text, Dimensions, Modal, Pressable, Button, FlatList } from 'react-native';
import { ShoppingBagIcon, Bars3Icon, MagnifyingGlassIcon, ArrowLeftIcon } from 'react-native-heroicons/outline';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { HomeList } from '../components/HomeList';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import { Items } from '../components/Items';
import { clearCart, placeOrder, setUserInfo } from '../slices/cartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from "socket.io-client";
import Horizontal  from '../components/Home/Horizontal';

const socket = io('https://backendamenity.onrender.com', {secure: true, autoConnect: false});


const getData = async()=>{
    const res = await axios.get('https://backendamenity.onrender.com/foods');
    const data = await res.data;
    return data;
}

export default function Main({ navigation }){
    const dispatch = useDispatch();
    const { amount, items, total, id, balance } = useSelector(store => store.cart);
    const width = Dimensions.get('screen').width;
    const height = Dimensions.get('window').height;

    useEffect(()=>{
        setIsLoading(false)
        socket.auth = { id };
        socket.connect();
    
        socket.on('orderPlaced', ()=>{
            console.log('hello');
        })
        const getUserInfo = async()=>{
            const token = await AsyncStorage.getItem('token');
            const res = await axios.get(`https://backendamenity.onrender.com/user/getInfo/${token}`);
            const data = await res.data;
            console.log(await AsyncStorage.removeItem('recentOrder'))
            console.log(data);
            dispatchUserInfo(data.user.id, data.user.balance);
        }
        getUserInfo();
        return () => {
            setIsLoading(false)
        }
    },[]);

    const dispatchUserInfo = ( id, StrBalance )=>{
        const balance = Number(StrBalance);
        dispatch(setUserInfo({ id, balance }));
    }

        
    const [searchData, setSearchData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('')
    const [modalVisibility, setModalVisibility] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const data = useQuery({
        queryKey: ['foods'],
        queryFn: getData
    });

    if (data.isLoading) {
        return <View><Text>Loading...</Text></View>
    }

    // handling searches in search bar
    const handleSearch = async(e) => {
        let filteredContent = [];
        await data.data.data.forEach(element => {
            let name = element.name.toLowerCase()
            if (name.includes(e.toLowerCase())) {
                filteredContent.push(element)
            }
        });
        setSearchData(filteredContent);
    }

    const setInfo = async(data)=>{
        const id = data.response._id
        await AsyncStorage.setItem('recentOrder', id);
        const isUpdated = await AsyncStorage.getItem('recentOrder');
        console.log(isUpdated);  
        setIsLoading(false);
        dispatch(placeOrder(total));
        navigation.navigate('Payment')
        setModalVisibility(!modalVisibility)
    }

    //upon successful payment
    const closeModalAndNavigate = async () => {
        if (total > balance) {
            setErrorMessage('Not enough money, try asking your friends to lend you some')
        } else {
            setIsLoading(true);
            const res = await axios.post('https://backendamenity.onrender.com/foods/order',{ client_id: id, foods: items, total });
            const data = await res.data;
            if (!data.error) {
                setInfo(data)
            } else {
                console.log(data.error);
                setErrorMessage(data.error);
            }
        }    
    }

    //upon canceling an order
    const closeAndGoBack = () => {
        setModalVisibility(!modalVisibility)
        setErrorMessage('')
        dispatch(clearCart())
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#111827' }}>
        
        <Modal visible={modalVisibility} animationType="slide" transparent={false} >
        <View style={{ flex: 1 }}> 
        <Pressable onPress={() => setModalVisibility(false)}>
        <View style={{ height: height/9, backgroundColor: '#111827', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, justifyContent: 'center', paddingHorizontal: 30 }}> 
            <ArrowLeftIcon size={35} color='white' />
        </View>
        </Pressable>
        <FlatList 
        data={items}
        renderItem={element => <Items props={element.item} />}
        keyExtractor={element => element.itemId}
        style={{ height: height/8, marginTop: 30, paddingHorizontal: 10 }} 
        showsVerticalScrollIndicator={false}
        />
           <View style={{ paddingBottom: 50,justifyContent: 'center', alignItems: 'center' }}>
             <Text style={{ fontSize: 30 }}>Total: {total}</Text>
             <View><Text style={{ color: 'red' }}>{errorMessage}</Text></View>
             { isLoading &&  <View><Text>Loading...</Text></View>}
           </View>
           <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 50 }}>
                <Button title='Cancel'onPress={closeAndGoBack} color='red' />
                <Button title='Order'onPress={closeModalAndNavigate} color='#4ade80' />
            </View>
        </View>
        </Modal>

        <View style={{ flex: 1, overflow: 'hidden', backgroundColor: '#e7e5e4' }}>
            <View style={{ height: 100, backgroundColor : '#111827' , display: 'flex', justifyContent: 'flex-end', padding: 5, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignContent: 'space-around', paddingHorizontal: 10 }}>
                    <View>
                      <Pressable onPress={() => navigation.navigate('About')} style={{ paddingRight: 7 }}>
                       <Bars3Icon color='white' size={40}/>
                      </Pressable>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#374151', paddingHorizontal: 10, paddingVertical: 3, width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                      <TextInput placeholder='Search here' placeholderTextColor='white' style={{ fontSize: 18, flexGrow: 1, color: 'white', font: 'medium' }} onChangeText={handleSearch} /> 
                      <MagnifyingGlassIcon color='white' size={25} />
                    </View>
                    <View style={{ position: 'relative', paddingLeft: 7 }}>
                        <Pressable onPress={()=>setModalVisibility(!modalVisibility)}>
                           <ShoppingBagIcon color='white' size={40} />
                        </Pressable>
                      <View style={{ backgroundColor: '#4b5563', height: 22, width: 22,  borderRadius: 11, position: 'absolute', top: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white' }}>{amount}</Text>
                      </View>
                    </View>
                </View>
            </View>
            <FlatList
            data={data.data.data}
            renderItem={item => <Horizontal props={item.item} />}
            keyExtractor={item => item._id} 
            horizontal={true} 
            style={{ height: '25%', borderWidth: 1, marginTop: 10, borderColor: 'gray' }}
            />
            {(searchData.length !== 0 ) &&
            <FlatList 
            data={searchData}
            renderItem={item => <HomeList props={item.item} />}
            keyExtractor={item => item._id}
            style={{ width: '100%', padding: 5 }} 
            showsVerticalScrollIndicator={false}/>
            }
            {(searchData.length === 0 ) &&
            <FlatList 
            data={data.data.data}
            renderItem={item => <HomeList props={item.item} />}
            keyExtractor={item => item._id}
            style={{  width: '100%', padding: 5 }} 
            showsVerticalScrollIndicator={false} />
            }
        </View>
        </View>
    )
}