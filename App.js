import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, Platform } from 'react-native';
import { Provider as PaperProvider, Button } from 'react-native-paper';
import stylesWeb from './style/stylesWeb';
import stylesIOS from './style/stylesIOS';

const styles = Platform.OS === 'web' ? stylesWeb : stylesIOS;

export default function App() {
  const handlePress = (buttonName) => {
    Alert.alert(`Button ${buttonName} pressed`);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text>Test</Text>
        <Button mode="contained" onPress={() => handlePress('1')} style={styles.button}>
          Button 1
        </Button>
        <Button mode="contained" onPress={() => handlePress('2')} style={styles.button}>
          Button 2
        </Button>
        <Button mode="contained" onPress={() => handlePress('3')} style={styles.button}>
          Button 3
        </Button>
        <StatusBar style="auto" />
      </View>
    </PaperProvider>
  );
}
