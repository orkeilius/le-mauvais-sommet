import * as React from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

interface InputProps {
	label?: string;
	type?: string;
	icon?: React.ReactNode;
	placeholder?: string;
	leftIcon?: React.ReactNode;
    eye?: boolean;
}

const LMSTextInput = React.forwardRef<TextInput, InputProps>(
	({ label, placeholder,eye, type = "text", leftIcon, ...props }, ref) => {
		const [secureText, setSecureText] = React.useState(type === "password");

		return (
			<View style={styles.container}>
				{label && <Text style={styles.label}>{label}</Text>}
				<View style={styles.inputContainer}>
					{leftIcon && <View>{leftIcon}</View>}
					<TextInput
						ref={ref}
						style={(type === "label" || type === "password") ? styles.input : styles.description}
						secureTextEntry={secureText}
						placeholder={placeholder}
						{...props}
					/>
					{type === "password" && eye && (
						<TouchableOpacity onPress={() => setSecureText(!secureText)}>
							{secureText ? (
								<EyeOff style={styles.icon} />
							) : (
								<Eye style={styles.icon} />
							)}
						</TouchableOpacity>
					)}
				</View>
			</View>
		);
	},
);

LMSTextInput.displayName = "Input";
export { LMSTextInput };

const styles = StyleSheet.create({
	container: {
		width: "100%",
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
	input: {
		flex: 1,
		height: 50,
		fontSize: 16,
	},
	label: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 8,
		color: "#333",
	},
	icon: {
		color: "#777",
	},
    description: {
        flex: 1,
        height: 120,
        fontSize: 16,
        color: "#333",
        textAlignVertical: "top",
     
    },
});
