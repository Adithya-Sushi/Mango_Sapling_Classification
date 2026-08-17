import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { getModel } from "../ai/model";

export default function PreviewScreen({ navigation, route }) {
  const { image } = route.params;

  const [loading, setLoading] = useState(false);

  async function predict() {
    setLoading(true);

    try {
      const model = await getModel();

      console.log("Model:", model);

      Alert.alert(
        "Success",
        "✅ MobileNetV2 model loaded successfully!"
      );

      // We are NOT running inference yet.
      // Next step will resize the image and run the model.

    } catch (error) {
      console.log(error);

      Alert.alert(
        "Model Error",
        error.message
      );
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: image }}
        style={styles.image}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={predict}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
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
    backgroundColor: "#fff",
  },

  image: {
    flex: 1,
    resizeMode: "contain",
  },

  button: {
    backgroundColor: "#2D6A4F",
    padding: 18,
    margin: 20,
    borderRadius: 12,
    alignItems: "center",
  },

  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

});