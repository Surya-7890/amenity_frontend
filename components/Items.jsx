import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import React, {useState} from 'react';
import Images from '../assets/images';
import { useSelector, useDispatch } from 'react-redux';
import { PlusIcon, MinusIcon } from 'react-native-heroicons/outline'
import { increaseItemCount, decreaseItemCount } from '../slices/cartSlice'


export const Items = ({ props }) =>  {

  const width = Dimensions.get('screen').width;
  const height = Dimensions.get('screen').height;
  const amount = props.count;

  const dispatch = useDispatch();
  const [itemCount, setItemCount] = useState(amount);
  const id = props.itemId;
  
  const increaseCount = () => {
    setItemCount(prevCount => prevCount + 1);
    dispatch(increaseItemCount(id));
  }

  const reduceCount = () => {
    setItemCount(prevCount => prevCount - 1);
    dispatch(decreaseItemCount(id));
  }

  const url = props.name.split(" ").join('');
  return (
    <View style={{ width, flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
      <Image source={Images[url]} style={{ height: 100, width: 100 }}/>
      <View style={{ paddingLeft: 20 }}>
        <Text style={{ color: 'black' }}>{props.name}</Text>
        <Text style={{ color: '#9ca3af', paddingLeft: 20 }}>Rs.{props.price}</Text>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', position: 'absolute', right: 10 }}>
      <TouchableOpacity onPress={reduceCount} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 5 }}>
        <MinusIcon size={20} color='black'/>
      </TouchableOpacity>
      <Text style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 5 }}>{itemCount}</Text>
      <TouchableOpacity onPress={increaseCount} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 5 }}>
        <PlusIcon size={20} color='black'/>
      </TouchableOpacity>
    </View> 
    </View>
  )
}