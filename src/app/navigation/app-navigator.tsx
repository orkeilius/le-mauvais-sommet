import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import {NavigationContainer} from "@react-navigation/native"
import {Feather} from "@expo/vector-icons"

// Écrans d'authentification
import LoginScreen from "../screens/auth/login-screen"
import RegisterScreen from "../screens/auth/register-screen"

// Écrans principaux
import AuctionsScreen from "../screens/home/auctions-screen"
import AuctionDetailScreen from "../screens/home/auction-detail-screen"
import ProfileScreen from "../screens/profile/profile-screen"
import SettingsScreen from "../screens/profile/settings-screen"
import MyProductsScreen from "../screens/products/my-products-screen"
import AddProductScreen from "../screens/products/add-product-screen"
import {AuthContext} from "@/src/app/Store/AuthStore";
import {useContext,} from "react";

// Définition des types pour les navigateurs
type AuthStackParamList = {
    Login: undefined
    Register: undefined
}

type MainStackParamList = {
    MainTabs: undefined
    AuctionDetail: { auctionId: string }
    Settings: undefined
    AddProduct: undefined
    EditProduct: { productId: string }
}

type MainTabsParamList = {
    Auctions: undefined
    MyProducts: undefined
    Profile: undefined
}

// Création des navigateurs
const AuthStack = createNativeStackNavigator<AuthStackParamList>()
const MainStack = createNativeStackNavigator<MainStackParamList>()
const MainTabs = createBottomTabNavigator<MainTabsParamList>()

// Navigateur d'authentification
const AuthNavigator = () => {
    return (
        <AuthStack.Navigator screenOptions={{headerShown: false}}>
            <AuthStack.Screen name="Login" component={LoginScreen}/>
            <AuthStack.Screen name="Register" component={RegisterScreen}/>
        </AuthStack.Navigator>
    )
}

// Navigateur des onglets principaux
const MainTabsNavigator = () => {
    return (
        <MainTabs.Navigator
            screenOptions={({route}) => ({
                headerShown: false,
                tabBarIcon: ({color, size}) => {
                    let iconName

                    if (route.name === "Auctions") {
                        iconName = "home"
                    } else if (route.name === "MyProducts") {
                        iconName = "package"
                    } else {
                        iconName = "user"
                    }

                    return <Feather name={iconName} size={size} color={color}/>
                },
                tabBarActiveTintColor: "#3498db",
                tabBarInactiveTintColor: "#999",
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "500",
                },
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: "#eee",
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
            })}
        >
            <MainTabs.Screen name="Auctions" component={AuctionsScreen} options={{tabBarLabel: "Enchères"}}/>
            <MainTabs.Screen name="MyProducts" component={MyProductsScreen} options={{tabBarLabel: "Mes Produits"}}/>
            <MainTabs.Screen name="Profile" component={ProfileScreen} options={{tabBarLabel: "Profil"}}/>
        </MainTabs.Navigator>
    )
}

// Navigateur principal
const MainNavigator = () => {
    return (
        <MainStack.Navigator screenOptions={{headerShown: false}}>
            <MainStack.Screen name="MainTabs" component={MainTabsNavigator}/>
            <MainStack.Screen name="AuctionDetail" component={AuctionDetailScreen}/>
            <MainStack.Screen name="Settings" component={SettingsScreen}/>
            <MainStack.Screen name="AddProduct" component={AddProductScreen}/>
        </MainStack.Navigator>
    )
}

const AppNavigator = () => {
    const authContext = useContext(AuthContext)

    return <NavigationContainer>{authContext.user !== null ? <MainNavigator/> : <AuthNavigator/>}</NavigationContainer>
}

export default AppNavigator

