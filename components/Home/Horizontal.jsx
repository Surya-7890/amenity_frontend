import React from 'react'
import { View, Image,Text, TouchableOpacity, Pressable } from 'react-native'
import { PlusIcon, MinusIcon } from 'react-native-heroicons/outline'
import { useDispatch, useSelector } from 'react-redux'
import { addItem, increaseItemCount, decreaseItemCount } from '../../slices/cartSlice'
import Images from '../../assets/images';
export default function Horizontal({props}){

  const dispatch = useDispatch();
  const items = useSelector(store => store.cart.items);

  const item = items.find(element => element.itemId === props._id)

  const id = props._id;
  const { name, price } = props;

  const reduceCount = () => {
      dispatch(decreaseItemCount(id));
  }

  const newItem = () => {
    dispatch(addItem({ id, name, price }));
  }

  const increaseCount = () => {
    dispatch(increaseItemCount(id));
  }
  const url = props.name.split(" ").join("");
  return (
   <View style={{ display: 'flex', position: 'relative', alignItems: 'center', marginRight: 10, justifyContent: 'center' }}>
    <Image source={Images[url]} style={{ height: 100, width: 100 }}/>
  </View>  
  )
}
