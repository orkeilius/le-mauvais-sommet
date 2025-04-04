"use client";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LMSTextInput } from "../../components/LMSTextInput";

// Types
interface ProductData {
  id?: string;
  title: string;
  description: string;
  category: string;
  price: string;
  image: string | null;
  isDraft: boolean;
  duration: string;
}

const AddProductScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const productId = route.params?.productId; // Safely access productId with optional chaining
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ProductData>({
    id: "",
    title: "",
    description: "",
    category: "",
    price: "",
    image: null,
    isDraft: false,
    duration: "3", // Durée de l'enchère en jours
  });

  const categories = [
    "PDF",
    "Images",
    "Templates",
    "Vidéos",
    "Audio",
    "Autres",
  ];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  useEffect(() => {
    if (productId) {
      // If editing, load the product data
      loadProductData(productId);
    }
  }, [productId]);

  const loadProductData = async (id: string) => {
    // Replace with API call to load product data
    const mockProduct: ProductData = {
      id,
      title: "Template site portfolio",
      description: "Template HTML/CSS pour portfolio de designer",
      category: "Templates",
      price: "15",
      image: "https://example.com/template.jpg",
      isDraft: true,
      duration: "5",
    };

    setForm(mockProduct);
    setSelectedCategory(mockProduct.category);
  };

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission requise",
        "Vous devez autoriser l'accès à votre galerie de photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setForm({ ...form, image: result.assets[0].uri });
    }
  };

  const handleCameraCapture = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission requise",
        "Vous devez autoriser l'accès à votre caméra."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setForm({ ...form, image: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    // Validation des champs
    if (!form.title || !form.description || !selectedCategory || !form.price) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (!form.image) {
      Alert.alert("Erreur", "Veuillez ajouter une image pour votre produit");
      return;
    }

    setLoading(true);

    try {
      // Handle adding or editing product
      if (productId) {
        // Edit product logic (replace with actual API call)
        setTimeout(() => {
          setLoading(false);
          Alert.alert("Succès", "Votre produit a été modifié avec succès", [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]);
        }, 1500);
      } else {
        // Create product logic (replace with actual API call)
        setTimeout(() => {
          setLoading(false);
          Alert.alert("Succès", "Votre produit a été créé avec succès", [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]);
        }, 1500);
      }
    } catch (error) {
      console.error("Erreur lors de la création/édition du produit:", error);
      setLoading(false);
      Alert.alert("Erreur", "Une erreur est survenue");
    }
  };

  const toggleCategoryPicker = () => {
    setShowCategoryPicker(!showCategoryPicker);
  };

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryPicker(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="x" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {productId ? "Modifier le produit" : "Ajouter un produit"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <View style={styles.imageContainer}>
              {form.image ? (
                <Image source={{ uri: form.image }} style={styles.productImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Feather name="image" size={50} color="#ccc" />
                  <Text style={styles.placeholderText}>Ajouter une image</Text>
                </View>
              )}

              <View style={styles.imageButtons}>
                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={handleImagePick}
                >
                  <Feather name="folder" size={20} color="#3498db" />
                  <Text style={styles.imageButtonText}>Galerie</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={handleCameraCapture}
                >
                  <Feather name="camera" size={20} color="#3498db" />
                  <Text style={styles.imageButtonText}>Caméra</Text>
                </TouchableOpacity>
              </View>
            </View>

            <LMSTextInput
              label="Titre du produit"
              placeholder="Titre du produit"
              value={form.title}
              type="label"
              onChangeText={(text) => setForm({ ...form, title: text })}
            />

            <LMSTextInput
              label="Description"
              placeholder="Description détaillée du produit"
              multiline={true}
              numberOfLines={5}
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Catégorie</Text>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={toggleCategoryPicker}
              >
                <Text
                  style={selectedCategory ? styles.input : styles.placeholderInput}
                >
                  {selectedCategory || "Sélectionner une catégorie"}
                </Text>
                <Feather
                  name={showCategoryPicker ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>

              {showCategoryPicker && (
                <View style={styles.categoryPicker}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={styles.categoryItem}
                      onPress={() => selectCategory(category)}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          selectedCategory === category &&
                            styles.selectedCategoryText,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <LMSTextInput
              label="Prix de départ (€)"
              placeholder="0.00"
              value={form.price}
              keyboardType="numeric"
              type="label"
              onChangeText={(text) => setForm({ ...form, price: text })}
            />

            <View style={styles.switchContainer}>
              <Text style={styles.switchText}>
                Enregistrer comme brouillon
              </Text>
              <Switch
                value={form.isDraft}
                onValueChange={(value) => setForm({ ...form, isDraft: value })}
                trackColor={{ false: "#ddd", true: "#3498db" }}
                thumbColor="#fff"
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {productId ? "Mettre à jour le produit" : "Créer le produit"}
                </Text>
              )}
            </TouchableOpacity>
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
	formContainer: {
		padding: 20,
	},
	imageContainer: {
		marginBottom: 20,
	},
	productImage: {
		width: "100%",
		height: 200,
		borderRadius: 10,
		marginBottom: 10,
	},
	imagePlaceholder: {
		width: "100%",
		height: 200,
		borderRadius: 10,
		backgroundColor: "#f0f0f0",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10,
		borderWidth: 1,
		borderColor: "#ddd",
		borderStyle: "dashed",
	},
	placeholderText: {
		color: "#999",
		marginTop: 10,
		fontSize: 16,
	},
	imageButtons: {
		flexDirection: "row",
		justifyContent: "center",
	},
	imageButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f0f0f0",
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderRadius: 20,
		marginHorizontal: 5,
	},
	imageButtonText: {
		marginLeft: 5,
		color: "#3498db",
		fontWeight: "500",
	},
	inputGroup: {
		marginBottom: 20,
	},
	label: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 8,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#ddd",
		paddingHorizontal: 15,
		height: 50,
	},
	input: {
		flex: 1,
		fontSize: 16,
		color: "#333",
	},
	placeholderInput: {
		flex: 1,
		fontSize: 16,
		color: "#999",
	},
	textareaContainer: {
		height: 120,
		paddingVertical: 10,
	},
	textarea: {
		flex: 1,
		fontSize: 16,
		color: "#333",
	},
	currencySymbol: {
		fontSize: 18,
		color: "#666",
	},
	categoryPicker: {
		backgroundColor: "#fff",
		marginTop: 5,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#ddd",
		paddingVertical: 5,
	},
	categoryItem: {
		paddingVertical: 12,
		paddingHorizontal: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	categoryText: {
		fontSize: 16,
		color: "#333",
	},
	selectedCategoryText: {
		color: "#3498db",
		fontWeight: "600",
	},
	durationContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginTop: 5,
	},
	durationOption: {
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 20,
		backgroundColor: "#f0f0f0",
		marginRight: 10,
		marginBottom: 10,
	},
	selectedDurationOption: {
		backgroundColor: "#3498db",
	},
	durationText: {
		color: "#666",
		fontWeight: "500",
	},
	selectedDurationText: {
		color: "#fff",
	},
	switchContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 30,
		paddingVertical: 10,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: "#eee",
	},
	switchInfo: {
		flexDirection: "row",
		alignItems: "center",
	},
	switchText: {
		fontSize: 16,
		color: "#333",
		marginLeft: 15,
	},
	submitButton: {
		backgroundColor: "#3498db",
		borderRadius: 10,
		height: 55,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
	},
	submitButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "600",
	},
});

export default AddProductScreen;
