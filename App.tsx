import { SafeAreaProvider } from "react-native-safe-area-context"
import AppNavigator from "@/src/app/navigation/app-navigator"
import UserRepository from "@/src/Repository/UserRepository";

export default function App() {
    UserRepository.getInstance().getById(102).then(
        user => {
            console.log(user)
            user.getAuction().then(auction => {console.log(auction)})
        }
    )

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  )
}

