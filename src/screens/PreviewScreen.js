import {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { predictMango } from "../ai/runModel";
import { MODELS } from "../ai/modelConfig";
import { useModelSelection } from "../context/ModelContext";

export default function PreviewScreen({
  route,
  navigation,
}) {
  const image =
    route?.params?.image;

  const { selectedModelKey } =
    useModelSelection();

  const modelConfig =
    MODELS[selectedModelKey];

  const [loading, setLoading] =
    useState(true);

  const [result, setResult] =
    useState(null);

  const runPrediction =
    async () => {
      if (!image) {
        Alert.alert(
          "Error",
          "No image was selected."
        );

        navigation.goBack();

        return;
      }

      try {
        setLoading(true);

        console.log(
          "================================"
        );

        console.log(
          "PREVIEW SCREEN"
        );

        console.log(
          "Selected image:",
          image
        );

        const prediction =
          await predictMango(
            image,
            selectedModelKey
          );

        setResult(prediction);
      } catch (error) {
        console.log(
          "Preview Prediction Error:",
          error
        );

        setResult({
          valid: false,
          error:
            error?.message ||
            "Prediction failed.",
        });
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    runPrediction();
  }, []);

  const scanAnother =
    () => {
      navigation.replace(
        "Gallery"
      );
    };

  if (loading) {
    return (
      <SafeAreaView
        style={styles.loadingContainer}
      >
        <ActivityIndicator
          size="large"
          color="#2D7D32"
        />

        <Text
          style={styles.loadingText}
        >
          Analyzing leaf...
        </Text>

        <Text
          style={styles.loadingSubText}
        >
          {modelConfig.name} is processing the image
        </Text>
      </SafeAreaView>
    );
  }

  if (!result?.valid) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View
          style={styles.invalidContainer}
        >
          <Text
            style={styles.invalidIcon}
          >
            !
          </Text>

          <Text
            style={styles.invalidTitle}
          >
            Image Not Recognized
          </Text>

          <Text
            style={styles.invalidText}
          >
            The selected image does not
            appear to contain a mango leaf.
          </Text>

          <Text
            style={styles.invalidHint}
          >
            Please select a clear mango leaf
            image and try again.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={scanAnother}
          >
            <Text
              style={styles.primaryButtonText}
            >
              Try Another Image
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <Text
          style={styles.header}
        >
          Prediction Result
        </Text>

        <Image
          source={{
            uri: image,
          }}
          style={styles.image}
          resizeMode="contain"
        />

        <View
          style={styles.resultCard}
        >
          <Text
            style={styles.resultLabel}
          >
            Predicted Variety
          </Text>

          <Text
            style={styles.prediction}
          >
            {result.prediction}
          </Text>

          <Text
            style={styles.confidence}
          >
            Confidence:{" "}
            {result.confidence.toFixed(
              2
            )}
            %
          </Text>

          <View
            style={styles.progressBackground}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width:
                    `${Math.min(
                      result.confidence,
                      100
                    )}%`,
                },
              ]}
            />
          </View>
        </View>

        <View
          style={styles.infoCard}
        >
          <Text
            style={styles.sectionTitle}
          >
            Model Information
          </Text>

          <View
            style={styles.infoRow}
          >
            <Text
              style={styles.infoLabel}
            >
              Model
            </Text>

            <Text
              style={styles.infoValue}
            >
              {modelConfig.name}
            </Text>
          </View>

          <View
            style={styles.infoRow}
          >
            <Text
              style={styles.infoLabel}
            >
              Inference Time
            </Text>

            <Text
              style={styles.infoValue}
            >
              {result.inferenceTime} ms
            </Text>
          </View>

          <View
            style={styles.infoRow}
          >
            <Text
              style={styles.infoLabel}
            >
              Classes
            </Text>

            <Text
              style={styles.infoValue}
            >
              25 varieties
            </Text>
          </View>
        </View>

        <View
          style={styles.topCard}
        >
          <Text
            style={styles.sectionTitle}
          >
            Top Predictions
          </Text>

          {result.topPredictions.map(
            (item, index) => (
              <View
                key={item.index}
                style={styles.topRow}
              >
                <View
                  style={styles.rankCircle}
                >
                  <Text
                    style={styles.rankText}
                  >
                    {index + 1}
                  </Text>
                </View>

                <Text
                  style={styles.topLabel}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>

                <Text
                  style={styles.topConfidence}
                >
                  {item.confidence.toFixed(
                    2
                  )}
                  %
                </Text>
              </View>
            )
          )}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={scanAnother}
        >
          <Text
            style={styles.primaryButtonText}
          >
            Scan Another Leaf
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F7F9F8",
    },

    scrollContent: {
      padding: 24,
      paddingBottom: 40,
    },

    header: {
      fontSize: 32,
      fontWeight: "500",
      color: "#2D7D32",
      textAlign: "center",
      marginBottom: 25,
    },

    image: {
      width: "100%",
      height: 350,
      borderRadius: 20,
      backgroundColor: "#E8F1E8",
      marginBottom: 25,
    },

    resultCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      padding: 25,
      alignItems: "center",
      elevation: 4,
      shadowColor: "#000000",
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 3,
      },
    },

    resultLabel: {
      fontSize: 18,
      color: "#666666",
      marginBottom: 12,
    },

    prediction: {
      fontSize: 30,
      color: "#2D7D32",
      fontWeight: "600",
      textAlign: "center",
    },

    confidence: {
      fontSize: 20,
      color: "#222222",
      marginTop: 18,
    },

    progressBackground: {
      width: "100%",
      height: 10,
      backgroundColor: "#E0E0E0",
      borderRadius: 10,
      marginTop: 20,
      overflow: "hidden",
    },

    progressFill: {
      height: "100%",
      backgroundColor: "#2D7D32",
      borderRadius: 10,
    },

    infoCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 18,
      padding: 20,
      marginTop: 20,
      elevation: 3,
    },

    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: "#333333",
      marginBottom: 15,
    },

    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#EEEEEE",
    },

    infoLabel: {
      color: "#666666",
      fontSize: 16,
    },

    infoValue: {
      color: "#222222",
      fontSize: 16,
      fontWeight: "600",
    },

    topCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 18,
      padding: 20,
      marginTop: 20,
      elevation: 3,
    },

    topRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#EEEEEE",
    },

    rankCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "#2D7D32",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },

    rankText: {
      color: "#FFFFFF",
      fontWeight: "bold",
    },

    topLabel: {
      flex: 1,
      fontSize: 15,
      color: "#333333",
    },

    topConfidence: {
      fontSize: 15,
      fontWeight: "600",
      color: "#2D7D32",
      marginLeft: 8,
    },

    primaryButton: {
      backgroundColor: "#2D7D32",
      borderRadius: 14,
      minHeight: 58,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
      paddingHorizontal: 20,
    },

    primaryButtonText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "bold",
    },

    loadingContainer: {
      flex: 1,
      backgroundColor: "#F7F9F8",
      justifyContent: "center",
      alignItems: "center",
      padding: 30,
    },

    loadingText: {
      marginTop: 20,
      fontSize: 22,
      fontWeight: "600",
      color: "#2D7D32",
    },

    loadingSubText: {
      marginTop: 8,
      fontSize: 15,
      color: "#777777",
      textAlign: "center",
    },

    invalidContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 30,
    },

    invalidIcon: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: "#E57373",
      color: "#FFFFFF",
      textAlign: "center",
      textAlignVertical: "center",
      fontSize: 45,
      fontWeight: "bold",
      marginBottom: 25,
    },

    invalidTitle: {
      fontSize: 27,
      fontWeight: "600",
      color: "#333333",
      textAlign: "center",
    },

    invalidText: {
      fontSize: 17,
      color: "#555555",
      textAlign: "center",
      lineHeight: 25,
      marginTop: 15,
    },

    invalidHint: {
      fontSize: 15,
      color: "#777777",
      textAlign: "center",
      lineHeight: 22,
      marginTop: 10,
    },
  });