import React from 'react';
import MapView, {Marker} from 'react-native-maps';
import { StyleSheet, View } from 'react-native';


const brnoRegion = {
    latitude: 49.1951,
    longitude: 16.6068,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
}

export const Map = () => {
    return (
        <View style={styles.container}>
            <MapView style={styles.map} initialRegion={brnoRegion} zoomControlEnabled>
                <Marker
                    coordinate={{
                        latitude: 49.1951,
                        longitude: 16.6068,
                    }}
                    title={"Brno"}
                    description={"This is a marker in Brno"}
                />
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
})
