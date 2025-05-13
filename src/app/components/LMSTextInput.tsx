import {StyleSheet, Text, TextInput, TouchableOpacity, View,} from "react-native";
import {Eye, EyeOff} from "lucide-react-native";
import {useState} from "react";

interface InputProps {
    label?: string;
    placeholder: string;
    type: "label" | "password";
    value?: string;
    onChangeText?: (text: string) => void;
    icon?: React.ReactNode;
    leftIcon?: React.ReactNode;
}

export default function LMSTextInput(props: InputProps) {
    const [showInput, setShowInput] = useState(props.type !== "password");

    return (
        <View style={styles.container}>
            {props.label && <Text style={styles.label}>{props.label}</Text>}
            <View style={styles.inputContainer}>
                {props.leftIcon && <View>{props.leftIcon}</View>}
                <TextInput
                    style={(["label", "password"].includes(props.type)) ? styles.input : styles.description}
                    secureTextEntry={!showInput}
                    placeholder={props.placeholder}
                    value={props.value}
                    onChangeText={props.onChangeText}
                />
                {props.type === "password" && (
                    <TouchableOpacity onPress={() => setShowInput(!showInput)}>
                        {!showInput ? (
                            <EyeOff style={styles.icon}/>
                        ) : (
                            <Eye style={styles.icon}/>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

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
