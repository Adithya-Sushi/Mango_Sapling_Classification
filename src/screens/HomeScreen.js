import { useState } from "react";

import {
  Animated,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

import { MODELS } from "../ai/modelConfig";
import { useModelSelection } from "../context/ModelContext";
import COLORS from "../styles/colors";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeScreen({ navigation }) {
  const { selectedModelKey, setSelectedModelKey } =
    useModelSelection();

  const [advancedOpen, setAdvancedOpen] = useState(false);

  const toggleAdvanced = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );
    setAdvancedOpen((prev) => !prev);
  };

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

      {/* Advanced dropdown */}
      <TouchableOpacity
        style={styles.smallButton}
        onPress={toggleAdvanced}
      >
        <Text style={styles.smallButtonText}>
          Advanced {advancedOpen ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>

      {advancedOpen && (
        <View style={styles.advancedPanel}>
          <Text style={styles.advancedTitle}>
            Select Model
          </Text>

          {Object.values(MODELS).map((model) => {
            const isSelected = selectedModelKey === model.key;

            return (
              <TouchableOpacity
                key={model.key}
                style={[
                  styles.modelOption,
                  isSelected && styles.modelOptionSelected,
                ]}
                onPress={() => setSelectedModelKey(model.key)}
                activeOpacity={0.7}
              >
                <View style={styles.radioRow}>
                  <View
                    style={[
                      styles.radioOuter,
                      isSelected && styles.radioOuterSelected,
                    ]}
                  >
                    {isSelected && (
                      <View style={styles.radioInner} />
                    )}
                  </View>

                  <View style={styles.modelInfo}>
                    <Text
                      style={[
                        styles.modelName,
                        isSelected && styles.modelNameSelected,
                      ]}
                    >
                      {model.name}
                    </Text>

                    <Text style={styles.modelDescription}>
                      {model.description}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

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

  // Advanced panel styles
  advancedPanel: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  advancedTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 12,
  },

  modelOption: {
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },

  modelOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: "#E8F5E9",
  },

  radioRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#BDBDBD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  radioOuterSelected: {
    borderColor: COLORS.primary,
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },

  modelInfo: {
    flex: 1,
  },

  modelName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },

  modelNameSelected: {
    color: COLORS.primary,
  },

  modelDescription: {
    fontSize: 13,
    color: "#777777",
    marginTop: 2,
  },

});