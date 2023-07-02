import { Provider } from 'react-redux';
import { QueryClientProvider, QueryClient } from 'react-query';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from '../screens/Main'
import About from '../screens/About';
import Payment from '../screens/Payment';
import Home from '../screens/Home';
import MoneyTransfer from '../screens/MoneyTransfer';
import Recent from '../screens/Recent';
import { store } from '../store';
import { UserContext } from '../UserContext';
import { useEffect, useContext } from 'react';
import Loading from '../screens/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';


const queryClient = new QueryClient();
const HomeStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator()


const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false, statusBarStyle: 'light', statusBarColor: 'black' }}>
       <HomeStack.Screen name="Home" component={Home} />
       <HomeStack.Screen name="About" component={About} />
       <HomeStack.Screen name="Recent" component={Recent}/>
       <HomeStack.Screen name="Payment" component={Payment} />
       <HomeStack.Screen name="Transfer" component={MoneyTransfer}/>
     </HomeStack.Navigator>
    )  
}

const AuthStackScreen = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false, statusBarStyle: 'light', statusBarColor: 'black' }}>
      <AuthStack.Screen name="Main" component={Main} />
    </AuthStack.Navigator>
  )
}
export default function AppNav() {

  const { isLoading, setIsLoading, userToken, setUserToken } = useContext(UserContext);

  useEffect(()=>{
    const getData = async()=>{
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setUserToken(token);
      }
      setIsLoading(false);
    }
    getData();
  }, [])

  if (isLoading) {
    return <Loading/>
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
      <NavigationContainer>
        { userToken ? <HomeStackScreen/> : <AuthStackScreen/> }
      </NavigationContainer>
      </Provider>
    </QueryClientProvider>
  )
}