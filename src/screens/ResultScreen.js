import { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Speech from "expo-speech";

export default function ResultScreen({
  route,
  navigation,
}) {
  const {
    image,
    result,
  } = route.params || {};

  if (!result) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorTitle}>
            No Prediction Available
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("Gallery")
            }
          >
            <Text style={styles.buttonText}>
              Choose Image
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const confidence =
    Number(result.confidence) || 0;

  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const handleSpeak = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    const readableName = result?.prediction
      ? result.prediction.replace(/_/g, " ")
      : "Unknown variety";
    const textToSpeak = `The predicted mango leaf variety is ${readableName}, with ${confidence.toFixed(1)} percent confidence.`;

    Speech.speak(textToSpeak, {
      pitch: 1.0,
      rate: 0.9,
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Prediction Result
        </Text>

        {image && (
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        <View style={styles.resultCard}>
          <Text style={styles.label}>
            Predicted Variety
          </Text>

          <Text style={styles.prediction}>
            {result.prediction}
          </Text>

          <Text style={styles.confidence}>
            {confidence.toFixed(2)}%
          </Text>

          <Text style={styles.confidenceLabel}>
            Confidence
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
                      confidence,
                      100
                    )}%`,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>
            Model Information
          </Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              Model
            </Text>

            <Text style={styles.rowValue}>
              {result.model || "MobileNetV2"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              Input
            </Text>

            <Text style={styles.rowValue}>
              224 × 224 × 3
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              Inference
            </Text>

            <Text style={styles.rowValue}>
              {result.inferenceTime} ms
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              Classes
            </Text>

            <Text style={styles.rowValue}>
              25 varieties
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>
            Top 3 Predictions
          </Text>

          {result.topPredictions?.map(
            (item, index) => (
              <View
                key={item.index}
                style={styles.predictionRow}
              >
                <View style={styles.rank}>
                  <Text
                    style={styles.rankText}
                  >
                    {index + 1}
                  </Text>
                </View>

                <Text
                  style={styles.predictionName}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>

                <Text
                  style={styles.predictionConfidence}
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
          style={[
            styles.speakButton,
            isSpeaking && styles.speakButtonActive,
          ]}
          onPress={handleSpeak}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.speakButtonText,
              isSpeaking && styles.speakButtonTextActive,
            ]}
          >
            {isSpeaking ? "⏹  Stop Reading" : "🔊  Read Result Aloud"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("Gallery")
          }
        >
          <Text style={styles.buttonText}>
            Scan Another Leaf
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() =>
            navigation.navigate("Home")
          }
        >
          <Text
            style={
              styles.secondaryButtonText
            }
          >
            Back to Home
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

    content: {
      padding: 20,
      paddingBottom: 40,
    },

    title: {
      fontSize: 30,
      fontWeight: "700",
      color: "#2D7D32",
      textAlign: "center",
      marginBottom: 20,
    },

    image: {
      width: "100%",
      height: 280,
      borderRadius: 18,
      backgroundColor: "#E8F1E8",
      marginBottom: 20,
    },

    resultCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      padding: 24,
      alignItems: "center",
      elevation: 4,
    },

    label: {
      fontSize: 16,
      color: "#777777",
      marginBottom: 8,
    },

    prediction: {
      fontSize: 27,
      fontWeight: "700",
      color: "#2D7D32",
      textAlign: "center",
    },

    confidence: {
      fontSize: 34,
      fontWeight: "700",
      color: "#222222",
      marginTop: 15,
    },

    confidenceLabel: {
      fontSize: 14,
      color: "#777777",
    },

    progressBackground: {
      width: "100%",
      height: 10,
      borderRadius: 10,
      backgroundColor: "#E0E0E0",
      marginTop: 15,
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
      marginTop: 18,
      elevation: 3,
    },

    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#333333",
      marginBottom: 12,
    },

    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 11,
      borderBottomWidth: 1,
      borderBottomColor: "#EEEEEE",
    },

    rowLabel: {
      fontSize: 15,
      color: "#777777",
    },

    rowValue: {
      fontSize: 15,
      fontWeight: "600",
      color: "#333333",
    },

    predictionRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#EEEEEE",
    },

    rank: {
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
      fontWeight: "700",
    },

    predictionName: {
      flex: 1,
      fontSize: 15,
      color: "#333333",
    },

    predictionConfidence: {
      fontSize: 15,
      fontWeight: "600",
      color: "#2D7D32",
      marginLeft: 8,
    },

    speakButton: {
      backgroundColor: "#E8F5E9",
      borderWidth: 1.5,
      borderColor: "#2D7D32",
      minHeight: 56,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
    },

    speakButtonActive: {
      backgroundColor: "#FFEBEE",
      borderColor: "#D32F2F",
    },

    speakButtonText: {
      color: "#2D7D32",
      fontSize: 16,
      fontWeight: "700",
    },

    speakButtonTextActive: {
      color: "#D32F2F",
    },

    button: {
      backgroundColor: "#2D7D32",
      minHeight: 58,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 14,
    },

    buttonText: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "700",
    },

    secondaryButton: {
      minHeight: 55,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 12,
    },

    secondaryButtonText: {
      color: "#2D7D32",
      fontSize: 16,
      fontWeight: "600",
    },

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 30,
    },

    errorTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: "#333333",
      marginBottom: 20,
    },
  });