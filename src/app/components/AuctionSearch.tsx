import { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

interface AuctionSearchProps {
  onSearch: (query: string) => void;
}

const AuctionSearch: React.FC<AuctionSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Rechercher une enchère..."
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Rechercher" onPress={() => onSearch(query)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginRight: 8,
  },
});

export default AuctionSearch;

