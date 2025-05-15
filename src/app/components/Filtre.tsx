import {View, StyleSheet, TouchableOpacity,Text} from "react-native";


interface InputProps {
    filter: string,
    setFilter: (filter: string) => void;
    options: string[];
}

export default function LMSFilter(props : Readonly<InputProps>) {
    return (
        <View style={styles.filterContainer}>
            {props.options.map((option) => (

                <TouchableOpacity
                    key={option}
                    style={[styles.filterButton, props.filter === option && styles.activeFilter]}
                    onPress={() => props.setFilter(option)}
                >
                    <Text style={[styles.filterText, props.filter === option && styles.activeFilterText]}>{option}</Text>
                </TouchableOpacity>

            ))}
        </View>
)
}

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: "row",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    filterButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: "#f0f0f0",
    },
    activeFilter: {
        backgroundColor: "#3498db",
    },
    filterText: {
        fontSize: 14,
        color: "#666",
    },
    activeFilterText: {
        color: "#fff",
        fontWeight: "600",
    },

})
