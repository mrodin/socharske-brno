import { StatusBar } from 'expo-status-bar'
import { Button, StyleSheet, Text, View } from 'react-native'
import { useState } from 'react'
import { Map } from './app/screens/Map'
import { User } from './app/screens/User'

export default function App() {
  const [screen, setScreen] = useState('home')

  if (screen === 'home') {
    return (
      <View style={styles.container}>
        <Text>Sochařské brno app!</Text>
        <StatusBar style="auto" />
        <Button title="Map" onPress={() => setScreen('map')} />
        <Button title="User" onPress={() => setScreen('user')} />
      </View>
    )
  } else if (screen === 'map') {
    return <Map />
  } else if (screen === 'user') {
    return <User />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})