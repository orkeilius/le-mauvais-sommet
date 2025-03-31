import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, Platform } from 'react-native';
import { Provider as PaperProvider, Button } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';

import stylesWeb from './style/stylesWeb';
import stylesIOS from './style/stylesIOS';

const styles = Platform.OS === 'web' ? stylesWeb : stylesIOS;

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const HomeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text>Home Screen</Text>
    <Button mode="contained" onPress={() => navigation.navigate('Details')} style={styles.button}>
      Go to Details
    </Button>
    <StatusBar style="auto" />
  </View>
);

const DetailsScreen = () => (
  <View style={styles.container}>
    <Text>Details Screen</Text>
    <StatusBar style="auto" />
  </View>
);

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Details" component={DetailsScreen} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Nav" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
