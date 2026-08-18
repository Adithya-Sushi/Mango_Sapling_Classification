import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { predictMango } from "../ai/runModel";

export default function PreviewScreen({ navigation, route }) {
  const { image } = route.params;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function predict() {
    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await predictMango(image);

      navigation.replace("Result", {
        image,
        result,
      });
    } catch (error) {
      console.log("Prediction Error:", error);

      setError(
        error?.message || "Unable to predict the mango variety."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: image }}
        style={styles.image}
        resizeMode="contain"
      />

      {error ? (
        <Text style={styles.error}>
          {error}
        </Text>
      ) : null}

      <TouchableOpacity
        style={[
          styles.button,
          loading && styles.disabledButton,
        ]}
        onPress={predict}
        disabled={loading}
      >
        {loading ? (
          <>
            <ActivityIndicator color="#ffffff" />
            <Text style={styles.text}>
              Analyzing Leaf...
            </Text>
          </>
        ) : (
          <Text style={styles.text}>
            Predict Mango Variety
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  image: {
    flex: 1,
    width: "100%",
  },

  button: {
    backgroundColor: "#2D6A4F",
    padding: 18,
    margin: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 58,
  },

  disabledButton: {
    opacity: 0.7,
  },

  text: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 5,
  },

  error: {
    color: "#D32F2F",
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 5,
  },
});