"use client";

import {useContext, useState} from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Image,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Alert,
} from "react-native";

import LMSTextInput from "../../components/LMSTextInput";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import LoginRepository from "@/src/Repository/LoginRepository";
import {AuthContext} from "@/src/app/Store/AuthStore";
import { useApi } from "@/src/hooks/useApi";

const LoginScreen = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const navigation = useNavigation();
	const authContext = useContext(AuthContext);

	const {
		loading,
		error,
		execute: loginUser
	} = useApi(
		(email: string, password: string) => 
			LoginRepository.getInstance().login(email, password),
		{
			onSuccess: (user) => {
				authContext.dispatch({action: "login", value: user});
				Alert.alert(
					"Connexion réussie",
					`Bienvenue ${user.name} !`,
					[{ 
						text: "OK", 
						onPress: () => {
							// La navigation se fera automatiquement grâce au AuthContext
							// L'AppNavigator détecte que authContext.user n'est plus null
						}
					}]
				);
			},
			onError: (error) => {
				console.error("Erreur de connexion:", error);
				const errorMessage = error?.response?.data?.message || 
									error?.message ||
									"Identifiants incorrects. Veuillez réessayer.";
				Alert.alert("Erreur de connexion", errorMessage);
			}
		}
	);

	const handleLogin = async () => {
		if (!email.trim() || !password) {
			Alert.alert("Erreur", "Veuillez remplir tous les champs");
			return;
		}

		// Validation email basique
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			Alert.alert("Erreur", "Veuillez entrer une adresse email valide");
			return;
		}

		try {
			await loginUser(email.trim(), password);
		} catch (err) {
			// L'erreur est déjà gérée par le hook useApi
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.keyboardAvoidingView}
			>
				<ScrollView contentContainerStyle={styles.scrollView}>
					<View style={styles.logoContainer}>
						<Image
							source={require("../../assets/logo.png")}
							style={styles.logo}
							resizeMode="contain"
						/>
						<Text style={styles.title}>Le mauvais sommet</Text>
					</View>

					<View style={styles.formContainer}>
						<LMSTextInput
							type="label"
							placeholder="Votre email"
							value={email}
							onChangeText={setEmail}
							label="Email"
							leftIcon={
								<Feather
									name="mail"
									size={20}
									color="#666"
									style={styles.inputIcon}
								/>
							}
						/>

						<LMSTextInput
							type="password"
							placeholder="Votre mot de passe"
							value={password}
							onChangeText={setPassword}
							label="Mot de passe"
							leftIcon={
								<Feather
									name="lock"
									size={20}
									color="#666"
									style={styles.inputIcon}
								/>
							}
						/>

						<TouchableOpacity style={styles.forgotPassword}>
							<Text style={styles.forgotPasswordText}>
								Mot de passe oublié?
							</Text>
						</TouchableOpacity>

						<TouchableOpacity 
							style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
							onPress={handleLogin}
							disabled={loading}
						>
							<Text style={styles.loginButtonText}>
								{loading ? "Connexion en cours..." : "Se connecter"}
							</Text>
						</TouchableOpacity>

						{error && (
							<Text style={styles.errorText}>{error}</Text>
						)}

						<View style={styles.registerContainer}>
							<Text style={styles.registerText}>
								Vous n'avez pas de compte?{" "}
							</Text>
							<TouchableOpacity onPress={() => navigation.goBack()}>
								<Text style={styles.registerLink}>S'inscrire</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	keyboardAvoidingView: {
		flex: 1,
	},
	scrollView: {
		flexGrow: 1,
		justifyContent: "center",
		padding: 20,
	},
	logoContainer: {
		alignItems: "center",
		marginBottom: 40,
	},
	logo: {
		width: 100,
		height: 100,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#3498db",
		marginTop: 10,
	},
	formContainer: {
		width: "100%",
	},
	label: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 8,
		color: "#333",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#ddd",
		paddingHorizontal: 15,
		marginBottom: 20,
	},
	inputIcon: {
		marginRight: 10,
	},
	input: {
		flex: 1,
		height: 50,
		fontSize: 16,
	},
	forgotPassword: {
		alignSelf: "flex-end",
		marginBottom: 20,
	},
	forgotPasswordText: {
		color: "#3498db",
		fontSize: 14,
	},
	loginButton: {
		backgroundColor: "#3498db",
		borderRadius: 10,
		height: 55,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
	},
	loginButtonDisabled: {
		backgroundColor: "#95a5a6",
		opacity: 0.7,
	},
	loginButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "600",
	},
	errorText: {
		color: "#e74c3c",
		fontSize: 14,
		textAlign: "center",
		marginBottom: 15,
		paddingHorizontal: 10,
	},
	registerContainer: {
		flexDirection: "row",
		justifyContent: "center",
	},
	registerText: {
		color: "#666",
		fontSize: 14,
	},
	registerLink: {
		color: "#3498db",
		fontSize: 14,
		fontWeight: "600",
	},
});

export default LoginScreen;
