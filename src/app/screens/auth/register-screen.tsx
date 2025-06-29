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
import { useApiForm } from "@/src/hooks/useApi";

const RegisterScreen = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const navigation = useNavigation();

	const {
		loading,
		error,
		handleSubmit,
		formData,
		updateFormData,
	} = useApiForm(
		(data) => UserRepository.getInstance().save(data.name, data.email, data.password),
		{
			onSuccess: (user) => {
				Alert.alert(
					"Inscription réussie",
					"Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
					[
						{
							text: "OK",
							onPress: () => navigation.navigate("Login")
						}
					]
				);
			},
			onError: (error) => {
				console.error("Erreur d'inscription:", error);
				const errorMessage = error?.response?.data?.message || 
									error?.response?.data?.errors?.email?.[0] ||
									"Impossible de créer votre compte. Veuillez réessayer.";
				Alert.alert("Erreur d'inscription", errorMessage);
			}
		}
	);

	const handleRegister = async () => {
		// Validation des champs
		if (!name.trim() || !email.trim() || !password || !confirmPassword) {
			Alert.alert("Erreur", "Veuillez remplir tous les champs");
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
			return;
		}

		if (password.length < 6) {
			Alert.alert("Erreur", "Le mot de passe doit contenir au moins 6 caractères");
			return;
		}

		// Validation email basique
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			Alert.alert("Erreur", "Veuillez entrer une adresse email valide");
			return;
		}

		// Mise à jour des données du formulaire et soumission
		updateFormData({ name: name.trim(), email: email.trim(), password });
		await handleSubmit();
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
							label="Confirmer votre Mot de passe"
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
							style={[styles.registerButton, loading && styles.registerButtonDisabled]}
							onPress={handleRegister}
							disabled={loading}
						>
							<Text style={styles.registerButtonText}>
								{loading ? "Inscription en cours..." : "S'inscrire"}
							</Text>
						</TouchableOpacity>

						{error && (
							<Text style={styles.errorText}>{error}</Text>
						)}

						<View style={styles.loginContainer}>
							<Text style={styles.loginText}>Vous avez déjà un compte? </Text>
							<TouchableOpacity onPress={() => navigation.goBack()}>
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
	registerButtonDisabled: {
		backgroundColor: "#95a5a6",
		opacity: 0.7,
	},
	registerButtonText: {
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
