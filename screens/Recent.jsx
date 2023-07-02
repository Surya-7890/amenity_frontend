import React, { useState, useEffect } from 'react';
import { View, Text, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Recent(){ 

    const [modalVisibility, setModalVisibility] = useState(false);

    useEffect(() => {
        (async()=>{
            const stringifiedArray = await AsyncStorage.getItem('recentOrders');
            const array = JSON.parse(stringifiedArray);
        })();
    },[])

    return (
        <View>
            <Modal visible={modalVisibility} animationType="slide" transparent={false} >

            </Modal>
        </View>
    )
}