import {SafeAreaProvider} from "react-native-safe-area-context"
import AppNavigator from "@/src/app/navigation/app-navigator"
import AuthStore from "@/src/app/Store/AuthStore";

export default function App() {
    //LoginRepository.getInstance().login("orkeilius@gmail.com", "bobPassword").then((instance) => {
    //    console.log(instance)
    //})


    return (
        <SafeAreaProvider>
            <AuthStore>
                <AppNavigator/>
            </AuthStore>
        </SafeAreaProvider>
    )
}

