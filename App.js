import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, Platform } from 'react-native';
import { Provider as PaperProvider, Button } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import stylesWeb from './style/stylesWeb';
import stylesIOS from './style/stylesIOS';

const styles = Platform.OS === 'web' ? stylesWeb : stylesIOS;

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
  <Tab.Navigator >
    <Tab.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
    <Tab.Screen name="Details" component={DetailsScreen} options={{headerShown: false}} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Nav" component={TabNavigator} options={{headerShown: false}}/>
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
