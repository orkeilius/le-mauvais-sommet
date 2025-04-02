"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"

// Types
interface ProductData {
  id: string
  title: string
  description: string
  category: string
  price: number
  imageUrl: string
  isDraft: boolean
  duration: string
}

const EditProductScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { productId } = route.params as { productId: string }

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<ProductData>({
    id: "",
    title: "",
    description: "",
    category: "",
    price: 0,
    imageUrl: "",
    isDraft: false,
    duration: "3",
  })

  const categories = ["PDF", "Images", "Templates", "Vidéos", "Audio", "Autres"]
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)

  useEffect(() => {
    // Charger les données du produit
    const loadProductData = async () => {
      try {
        // Intégration avec le backend existant
        // Exemple: const response = await api.getProductById(productId);

        // Pour la démo, on simule des données
        setTimeout(() => {
          const mockProduct: ProductData = {
            id: productId,
            title: "Template site portfolio",
            description: "Template HTML/CSS pour portfolio de designer",
            category: "Templates",
            price: 15,
            imageUrl: "https://example.com/template.jpg",
            isDraft: true,
            duration: "5",
          }

          setForm(mockProduct)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Erreur lors du chargement du produit:", error)
        Alert.alert("Erreur", "Impossible de charger les détails du produit")
        navigation.goBack()
      }
    }

    loadProductData()
  }, [productId])

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      Alert.alert("Permission requise", "Vous devez autoriser l'accès à votre galerie de photos.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      setForm({ ...form, imageUrl: result.assets[0].uri })
    }
  }

  const handleSubmit = async () => {
    // Validation des champs
    if (!form.title || !form.description || !form.category || !form.price) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires")
      return
    }

    setSubmitting(true)

    try {
      // Intégration avec le backend existant
      // Exemple: const response = await api.updateProduct(productId, form);

      // Pour la démo, on simule une modification réussie
      setTimeout(() => {
        setSubmitting(false)
        Alert.alert("Succès", "Votre produit a été mis à jour avec succès", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ])
      }, 1500)
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit:", error)
      setSubmitting(false)
      Alert.alert("Erreur", "Une erreur est survenue lors de la mise à jour du produit")
    }
  }

  const toggleCategoryPicker = () => {
    setShowCategoryPicker(!showCategoryPicker)
  }

  const selectCategory = (category: string) => {
    setForm({ ...form, category })
    setShowCategoryPicker(false)
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Modifier le produit</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier le produit</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <View style={styles.imageContainer}>
              {form.imageUrl ? (
                <Image source={{ uri: form.imageUrl }} style={styles.productImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Feather name="image" size={50} color="#ccc" />
                  <Text style={styles.placeholderText}>Ajouter une image</Text>
                </View>
              )}

              <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
                <Feather name="edit-2" size={20} color="#3498db" />
                <Text style={styles.imageButtonText}>Modifier l'image</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Titre du produit</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Titre du produit"
                  value={form.title}
                  onChangeText={(text) => setForm({ ...form, title: text })}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <View style={[styles.inputContainer, styles.textareaContainer]}>
                <TextInput
                  style={styles.textarea}
                  placeholder="Description détaillée du produit"
                  value={form.description}
                  onChangeText={(text) => setForm({ ...form, description: text })}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Catégorie</Text>
              <TouchableOpacity style={styles.inputContainer} onPress={toggleCategoryPicker}>
                <Text style={form.category ? styles.input : styles.placeholderInput}>
                  {form.category || "Sélectionner une catégorie"}
                </Text>
                <Feather name={showCategoryPicker ? "chevron-up" : "chevron-down"} size={20} color="#666" />
              </TouchableOpacity>

              {showCategoryPicker && (
                <View style={styles.categoryPicker}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={styles.categoryItem}
                      onPress={() => selectCategory(category)}
                    >
                      <Text style={[styles.categoryText, form.category === category && styles.selectedCategoryText]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prix de départ (€)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  value={form.price.toString()}
                  onChangeText={(text) => setForm({ ...form, price: Number.parseFloat(text) || 0 })}
                  keyboardType="numeric"
                />
                <Text style={styles.currencySymbol}>€</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Durée de l'enchère</Text>
              <View style={styles.durationContainer}>
                {["1", "3", "5", "7", "14"].map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    style={[styles.durationOption, form.duration === duration && styles.selectedDurationOption]}
                    onPress={() => setForm({ ...form, duration })}
                  >
                    <Text style={[styles.durationText, form.duration === duration && styles.selectedDurationText]}>
                      {duration} {Number.parseInt(duration) === 1 ? "jour" : "jours"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.switchContainer}>
              <View style={styles.switchInfo}>
                <Feather name="edit-3" size={20} color="#666" />
                <Text style={styles.switchText}>Enregistrer comme brouillon</Text>
              </View>
              <Switch
                value={form.isDraft}
                onValueChange={(value) => setForm({ ...form, isDraft: value })}
                trackColor={{ false: "#ddd", true: "#3498db" }}
                thumbColor="#fff"
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Enregistrer les modifications</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    padding: 20,
  },
  imageContainer: {
    alignItems: "center",
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
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
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
})

export default EditProductScreen

