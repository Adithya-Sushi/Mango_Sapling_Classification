import { useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import * as DocumentPicker from "expo-document-picker";

export default function GalleryScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const openGallery = async () => {
    try {
      setLoading(true);

      const result =
        await DocumentPicker.getDocumentAsync({
          type: "image/*",
          copyToCacheDirectory: true,
          multiple: false,
        });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];

      console.log("================================");
      console.log("DOCUMENT PICKER IMAGE");
      console.log("Name:", asset.name);
      console.log("URI:", asset.uri);
      console.log("Size:", asset.size);
      console.log("Mime type:", asset.mimeType);
      console.log("Width:", asset.width);
      console.log("Height:", asset.height);
      console.log("================================");

      navigation.replace("Preview", {
        image: asset.uri,
      });
    } catch (error) {
      console.log("Document Picker Error:", error);
      alert("Unable to select the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Choose Mango Leaf
      </Text>

      <Text style={styles.subtitle}>
        Select a mango leaf image from your device
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={openGallery}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color="#ffffff"
          />
        ) : (
          <Text style={styles.buttonText}>
            Choose Image
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>
          ← Back
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F8",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D6A4F",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 35,
  },

  button: {
    width: "90%",
    backgroundColor: "#2D6A4F",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 58,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },

  backButton: {
    marginTop: 25,
  },

  backText: {
    color: "#2D6A4F",
    fontSize: 17,
    fontWeight: "600",
  },
});