import { SafeAreaProvider } from "react-native-safe-area-context"
import AppNavigator from "@/src/app/navigation/app-navigator"

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  )
}

