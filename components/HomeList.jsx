import React from 'react'
import { View, Image,Text, TouchableOpacity, Pressable } from 'react-native'
import { PlusIcon, MinusIcon } from 'react-native-heroicons/outline'
import { useDispatch, useSelector } from 'react-redux'
import { addItem, increaseItemCount, decreaseItemCount } from '../slices/cartSlice'
import Images from '../assets/images';
export const HomeList = ({props}) => {

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
   <View style={{ display: 'flex', flexDirection: 'row', paddingTop: 5, position: 'relative', marginBottom: 10, alignItems: 'center', height: 120 }}>
    <Image source={Images[url]} style={{ height: '100%', width: 150, borderRadius: 10 }}/> 
    <View style={{ marginLeft: 10, marginTop: 25 }}>
      <Text style={{ fontWeight: '500' }}>{props.name}</Text>
      <Text style={{ paddingLeft: 15, color: '#9ca3af' }}>Rs.{props.price}</Text>
    </View>
    { item && <View style={{ display: 'flex', flexDirection: 'row', position: 'absolute', right: 0, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={reduceCount} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 5 }}>
        <MinusIcon size={20} color='black'/>
      </TouchableOpacity>
      <Text style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 5 }}>{item.count}</Text>
      <TouchableOpacity onPress={increaseCount} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 5 }}>
        <PlusIcon size={20} color='black'/>
      </TouchableOpacity>
    </View> }
    { (!item || item === [])&& <View style={{ display: 'flex', flexDirection: 'row', position: 'absolute', right: 0 }}>
      <Pressable onPress={newItem}>
        <Text style={{ paddingLeft: 15, color: '#9ca3af', marginTop: 25 }}>Add To Cart</Text>
      </Pressable>
    </View>
    }
  </View>  
  )
}
