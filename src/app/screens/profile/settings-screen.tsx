"use client";

import { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Switch,
	Alert,
	
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { LMSTextInput } from "../../components/LMSTextInput";

const SettingsScreen = () => {
	type RootStackParamList = {
		Login: undefined;
		// Add other routes here if needed
	};

	const navigation =
		useNavigation<
			import("@react-navigation/native").NavigationProp<RootStackParamList>
		>();
	const [notifications, setNotifications] = useState(true);
	const [darkMode, setDarkMode] = useState(false);
	const [emailNotifications, setEmailNotifications] = useState(true);
	const [bidConfirmation, setBidConfirmation] = useState(true);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleSaveProfile = () => {
		Alert.alert("Profil mis à jour", "Vos modifications ont été enregistrées.");
	};

	const handleChangePassword = () => {
		if (!currentPassword || !newPassword || !confirmPassword) {
			Alert.alert("Erreur", "Veuillez remplir tous les champs");
			return;
		}

		if (newPassword !== confirmPassword) {
			Alert.alert("Erreur", "Les nouveaux mots de passe ne correspondent pas");
			return;
		}

		// Intégration avec le backend existant
		// Exemple: await api.changePassword(currentPassword, newPassword);

		// Pour la démo, on simule une modification réussie
		Alert.alert(
			"Mot de passe modifié",
			"Votre mot de passe a été modifié avec succès",
		);
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
	};

	const handleLogout = () => {
		Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
			{ text: "Annuler", style: "cancel" },
			{
				text: "Déconnexion",
				style: "destructive",
				onPress: () => {
					// Pour la démo, on navigue vers l'écran de connexion
					navigation.reset({
						index: 0,
						routes: [{ name: "Login" }],
					});
				},
			},
		]);
	};

	const handleDeleteAccount = () => {
		Alert.alert(
			"Supprimer le compte",
			"Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
			[
				{ text: "Annuler", style: "cancel" },
				{
					text: "Supprimer",
					style: "destructive",
					onPress: () => {
						// Intégration avec le backend existant
						// Exemple: await api.deleteAccount();

						// Pour la démo, on affiche un message et on navigue vers l'écran de connexion
						Alert.alert(
							"Compte supprimé",
							"Votre compte a été supprimé avec succès.",
							[
								{
									text: "OK",
									onPress: () => {
										navigation.reset({
											index: 0,
											routes: [{ name: "Login" }],
										});
									},
								},
							],
						);
					},
				},
			],
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Feather name="arrow-left" size={24} color="#333" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Paramètres</Text>
				<View style={{ width: 24 }} />
			</View>

			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Préférences</Text>
					<View style={styles.settingItem}>
						<View style={styles.settingInfo}>
							<Feather name="bell" size={20} color="#666" />
							<Text style={styles.settingText}>Notifications push</Text>
						</View>
						<Switch
							value={notifications}
							onValueChange={setNotifications}
							trackColor={{ false: "#ddd", true: "#3498db" }}
							thumbColor="#fff"
						/>
					</View>

					<View style={styles.settingItem}>
						<View style={styles.settingInfo}>
							<Feather name="moon" size={20} color="#666" />
							<Text style={styles.settingText}>Mode sombre</Text>
						</View>
						<Switch
							value={darkMode}
							onValueChange={setDarkMode}
							trackColor={{ false: "#ddd", true: "#3498db" }}
							thumbColor="#fff"
						/>
					</View>

					<View style={styles.settingItem}>
						<View style={styles.settingInfo}>
							<Feather name="mail" size={20} color="#666" />
							<Text style={styles.settingText}>Notifications par email</Text>
						</View>
						<Switch
							value={emailNotifications}
							onValueChange={setEmailNotifications}
							trackColor={{ false: "#ddd", true: "#3498db" }}
							thumbColor="#fff"
						/>
					</View>

					<View style={styles.settingItem}>
						<View style={styles.settingInfo}>
							<Feather name="check-circle" size={20} color="#666" />
							<Text style={styles.settingText}>Confirmation d'enchère</Text>
						</View>
						<Switch
							value={bidConfirmation}
							onValueChange={setBidConfirmation}
							trackColor={{ false: "#ddd", true: "#3498db" }}
							thumbColor="#fff"
						/>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Modifier le mot de passe</Text>
					<View style={styles.passwordSection}>
				

            <LMSTextInput
							type="password"
							placeholder="Mot de passe actuel"
							value={currentPassword}
							onChangeText={setCurrentPassword}
							secureTextEntry
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
							placeholder="Nouveau mot de passe"
							value={newPassword}
							onChangeText={setNewPassword}
							secureTextEntry
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
							placeholder="Confirmer le nouveau mot de passe"
							value={confirmPassword}
							onChangeText={setConfirmPassword}
							secureTextEntry
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
							style={styles.button}
							onPress={handleChangePassword}
						>
							<Text style={styles.buttonText}>Changer le mot de passe</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Compte</Text>
					<TouchableOpacity
						style={styles.actionButton}
						onPress={handleSaveProfile}
					>
						<View style={styles.actionInfo}>
							<Feather name="save" size={20} color="#3498db" />
							<Text style={[styles.actionText, { color: "#3498db" }]}>
								Enregistrer les modifications
							</Text>
						</View>
						<Feather name="chevron-right" size={20} color="#ccc" />
					</TouchableOpacity>

					<TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
						<View style={styles.actionInfo}>
							<Feather name="log-out" size={20} color="#e74c3c" />
							<Text style={[styles.actionText, { color: "#e74c3c" }]}>
								Déconnexion
							</Text>
						</View>
						<Feather name="chevron-right" size={20} color="#ccc" />
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.actionButton}
						onPress={handleDeleteAccount}
					>
						<View style={styles.actionInfo}>
							<Feather name="trash-2" size={20} color="#e74c3c" />
							<Text style={[styles.actionText, { color: "#e74c3c" }]}>
								Supprimer mon compte
							</Text>
						</View>
						<Feather name="chevron-right" size={20} color="#ccc" />
					</TouchableOpacity>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Informations</Text>
					<TouchableOpacity style={styles.actionButton}>
						<View style={styles.actionInfo}>
							<Feather name="help-circle" size={20} color="#666" />
							<Text style={styles.actionText}>Aide et support</Text>
						</View>
						<Feather name="chevron-right" size={20} color="#ccc" />
					</TouchableOpacity>

					<TouchableOpacity style={styles.actionButton}>
						<View style={styles.actionInfo}>
							<Feather name="file-text" size={20} color="#666" />
							<Text style={styles.actionText}>Conditions générales</Text>
						</View>
						<Feather name="chevron-right" size={20} color="#ccc" />
					</TouchableOpacity>

					<TouchableOpacity style={styles.actionButton}>
						<View style={styles.actionInfo}>
							<Feather name="shield" size={20} color="#666" />
							<Text style={styles.actionText}>
								Politique de confidentialité
							</Text>
						</View>
						<Feather name="chevron-right" size={20} color="#ccc" />
					</TouchableOpacity>

					<TouchableOpacity style={styles.actionButton}>
						<View style={styles.actionInfo}>
							<Feather name="info" size={20} color="#666" />
							<Text style={styles.actionText}>À propos</Text>
						</View>
						<Feather name="chevron-right" size={20} color="#ccc" />
					</TouchableOpacity>
				</View>

				<Text style={styles.version}>Version 1.0.0</Text>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
	},
	section: {
		backgroundColor: "#fff",
		marginVertical: 10,
		paddingHorizontal: 20,
		paddingVertical: 15,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: "#eee",
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 15,
	},
	settingItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	settingInfo: {
		flexDirection: "row",
		alignItems: "center",
	},
	settingText: {
		fontSize: 16,
		color: "#333",
		marginLeft: 15,
	},
	passwordSection: {
		marginTop: 5,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#ddd",
		paddingHorizontal: 15,
		marginBottom: 15,
		height: 50,
	},
	inputIcon: {
		marginRight: 10,
	},
	input: {
		flex: 1,
		height: "100%",
		fontSize: 16,
	},
	button: {
		backgroundColor: "#3498db",
		borderRadius: 10,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 5,
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
	actionButton: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	actionInfo: {
		flexDirection: "row",
		alignItems: "center",
	},
	actionText: {
		fontSize: 16,
		color: "#333",
		marginLeft: 15,
	},
	version: {
		textAlign: "center",
		color: "#999",
		fontSize: 14,
		marginVertical: 20,
	},
});

export default SettingsScreen;
