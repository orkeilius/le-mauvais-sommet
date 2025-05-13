import { useState } from "react";
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
import UserRepository from "@/src/Repository/UserRepository";

const RegisterScreen = () => {


	const [name, setName] = useState("");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const navigation = useNavigation();

	const handleRegister = async () => {
		if (!name || !email || !password || !confirmPassword ) {
			Alert.alert("Erreur", "Veuillez remplir tous les champs");
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
			return;
		}

		try {
			UserRepository.getInstance().save(name, email, password).then(()=>navigation.navigate("Login"))
		} catch (error) {
			Alert.alert("Erreur d'inscription", "Impossible de créer votre compte");
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
						<Text style={styles.title}>Créer un compte</Text>
					</View>

					<View style={styles.formContainer}>
						<LMSTextInput
							label="Nom"
							placeholder="Votre nom"
							value={name}
              type="label"
							onChangeText={setName}
							leftIcon={
								<Feather
									name="user"
									size={20}
									color="#666"
									style={styles.inputIcon}
								/>
							}
						/>

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
              eye
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

						<LMSTextInput
							type="password"
							placeholder="Confirmer votre mot de passe"
							value={confirmPassword}
							onChangeText={setConfirmPassword}
              eye
							label="Confirmer votre Mot de passe"
							secureTextEntry={!showPassword}
							leftIcon={
								<Feather
									name="lock"
									size={20}
									color="#666"
									style={styles.inputIcon}
								/>
							}
						/>

						<TouchableOpacity
							style={styles.registerButton}
							onPress={handleRegister}
						>
							<Text style={styles.registerButtonText}>S'inscrire</Text>
						</TouchableOpacity>

						<View style={styles.loginContainer}>
							<Text style={styles.loginText}>Vous avez déjà un compte? </Text>
							<TouchableOpacity onPress={() => navigation.navigate("Login")}>
								<Text style={styles.loginLink}>Se connecter</Text>
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
		marginBottom: 30,
	},
	logo: {
		width: 80,
		height: 80,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
		marginTop: 10,
	},
	formContainer: {
		width: "100%",
	},
	inputIcon: {
		marginRight: 10,
	},

	registerButton: {
		backgroundColor: "#3498db",
		borderRadius: 10,
		height: 55,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
	},
	registerButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "600",
	},
	loginContainer: {
		flexDirection: "row",
		justifyContent: "center",
	},
	loginText: {
		color: "#666",
		fontSize: 14,
	},
	loginLink: {
		color: "#3498db",
		fontSize: 14,
		fontWeight: "600",
	},
});

export default RegisterScreen;
