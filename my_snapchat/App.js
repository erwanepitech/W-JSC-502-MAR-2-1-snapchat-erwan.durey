import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from './page/Home';
import Login from './page/Login';
import Register from './page/Register';
import Camera from './page/Camera';
import Settings from './page/Settings';
import Reception from './page/Reception';
import Galery from './page/Galery';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

  const [session, setSession] = useState(false)
  const [getValue, setGetValue] = useState('')
  const [load, setLoad] = useState(false)

  useEffect(() => {
    if (getValue !== '') {
      setSession(true)
    } else {
      setSession(false)
    }
  }, [getValue])

  useEffect(() => {
    AsyncStorage.getItem('email').then((value) => {
      if (value !== null) {
        setGetValue(value)
      } else {
        setGetValue('')
      }
    })
  }, [load])


 const refresh = () => {
   if(load){
     setLoad(false)
   }else{
     setLoad(true)
   }
  }

  if (!session) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen
            name="Home"
            component={Home}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            initialParams={{ refresh }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
          />
        </Stack.Navigator>
      </NavigationContainer>

    )
  } else {
    return (
      <NavigationContainer >
        <Tab.Navigator
          initialRouteName='Camera'
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#ff9f1a',
            tabBarInactiveTintColor: '#3d3d3d',
            tabBarLabelStyle: { paddingBottom: 5, fontSize: 20 },
            tabBarStyle: { backgroundColor: '#fff200', height:'10%' },
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              let rn = route.name;

              if (rn === 'Reception') {
                iconName = focused ? 'people' : 'people-outline';

              } else if (rn === 'Camera') {
                iconName = focused ? 'camera' : 'camera-outline';

              } else if (rn === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';

              }else if (rn === 'Galery') {
                iconName = focused ? 'document' : 'document-outline';

              }
    

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}>
          <Tab.Screen
            name='Reception' component={Reception}
          />
          <Tab.Screen
            name='Camera' component={Camera}
          />
          <Tab.Screen
            name='Galery' component={Galery}
          />
          <Tab.Screen
            name='Settings' component={Settings}
            initialParams={{refresh}}
          />
        </Tab.Navigator>
      </NavigationContainer >
    );
  }
}