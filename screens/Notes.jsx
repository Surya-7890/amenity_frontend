import { Text, View, TextInput, Dimensions, Pressable } from 'react-native';
import React from 'react';
// import { } from 'react-native-heroicons/solid'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Notes() {

    const height = Dimensions.get('screen').height;

    const [input, setInput] = React.useState('');
    const [goals, setGoals] = React.useState([]);

    React.useEffect(() => {
        // (async() => {
        //     const response = await AsyncStorage.getItem('goals');
        //     let parsedGoals
        //     response && parsedGoals = JSON.parse(response);
        //     console.log(parsedGoals)
        //     // setGoals(parsedGoals);
        // })();
    },[]);

    const onSetGoals = async() => {
        setGoals([...goals, input]);
        const stringifiedGoals = JSON.stringify(goals);
        const find = await AsyncStorage.getItem('goals');
        find && await AsyncStorage.removeItem('goals');
        const setItems = await AsyncStorage.setItem('goals', stringifiedGoals);
    }

    return (
        <View>
            <View style={{ backgroundColor: '#bfafb2', height: height/6 }}>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TextInput value={input} placeholder='Enter a goal' onChangeText={(value)=>setInput(value)} style={{ fontSize: 18, marginRight: 10 }} />
                <Pressable>
                    <Text style={{ fontSize: 18, fontWeight: '600' }} onPress={onSetGoals}>+</Text>
                </Pressable>
            </View>
            <View>{goals && goals.map((element, index) => {
                return (
                    <View key={index}>
                        <Text>{element}</Text>
                    </View>
                )
            })}</View>
        </View>
    )
}