import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import COLORS from "../styles/colors";

export default function ResultScreen({ navigation, route }) {

  const { image, result } = route.params;

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        🌿 Prediction Result
      </Text>

      <Image
        source={{ uri: image }}
        style={styles.image}
      />

      <View style={styles.card}>

        <Text style={styles.label}>
          Predicted Variety
        </Text>

        <Text style={styles.value}>
          {result.prediction}
        </Text>

        <Text style={styles.confidence}>
          Confidence : {result.confidence}%
        </Text>

      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>
          Scan Another Leaf
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 20,
  },

  image: {
    width: 250,
    height: 250,
    borderRadius: 15,
    resizeMode: "cover",
    marginBottom: 20,
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    elevation: 5,
    alignItems: "center",
  },

  label: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },

  value: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 15,
    textAlign: "center",
  },

  confidence: {
    marginTop: 15,
    fontSize: 18,
  },

  button: {
    marginTop: 30,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

});