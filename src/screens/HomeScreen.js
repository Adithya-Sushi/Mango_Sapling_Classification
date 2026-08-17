import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import COLORS from "../styles/colors";

export default function HomeScreen({ navigation }) {

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        🥭 MangoLeaf AI
      </Text>

      <Text style={styles.subtitle}>
        Identify Mango Leaf Varieties
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Camera")}
      >
        <Text style={styles.buttonText}>
          📷 Capture Leaf
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Gallery")}
      >
        <Text style={styles.buttonText}>
          🖼 Choose From Gallery
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.smallButton}
        onPress={() => navigation.navigate("History")}
      >
        <Text style={styles.smallButtonText}>
          History
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.smallButton}
        onPress={() => navigation.navigate("About")}
      >
        <Text style={styles.smallButtonText}>
          About
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.primary,
  },

  subtitle: {
    marginBottom: 40,
    color: COLORS.textSecondary,
    fontSize: 16,
  },

  button: {
    width: "90%",
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  smallButton: {
    marginTop: 10,
  },

  smallButtonText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 16,
  },

});