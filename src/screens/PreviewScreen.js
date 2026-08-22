import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { predictMango } from "../ai/runModel";

export default function PreviewScreen({
  route,
  navigation,
}) {
  const image = route?.params?.image;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    runPrediction();
  }, []);

  const runPrediction = async () => {
    if (!image) {
      setLoading(false);
      setError(
        "No image was selected."
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log(
        "================================"
      );
      console.log(
        "PREVIEW SCREEN"
      );
      console.log(
        "Image:",
        image
      );
      console.log(
        "Starting prediction..."
      );
      console.log(
        "================================"
      );

      const result =
        await predictMango(image);

      console.log(
        "================================"
      );
      console.log(
        "PREDICTION RESULT"
      );
      console.log(result);
      console.log(
        "================================"
      );

      if (!result) {
        setError(
          "Prediction returned no result."
        );
        return;
      }

      if (!result.valid) {
        setError(
          result.error ||
            "The selected image does not appear to contain a mango leaf."
        );
        return;
      }

      console.log(
        "Valid mango leaf detected."
      );

      console.log(
        "Opening Result Screen..."
      );

      navigation.replace(
        "Result",
        {
          image: image,
          result: result,
        }
      );
    } catch (error) {
      console.log(
        "================================"
      );
      console.log(
        "PREVIEW PREDICTION ERROR"
      );
      console.log(error);
      console.log(
        "================================"
      );

      setError(
        error?.message ||
          "Unable to analyze the image."
      );
    } finally {
      setLoading(false);
    }
  };

  const tryAgain = () => {
    navigation.replace(
      "Gallery"
    );
  };

  const goBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View
          style={styles.loadingContainer}
        >
          {image && (
            <Image
              source={{
                uri: image,
              }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          )}

          <ActivityIndicator
            size="large"
            color="#2D7D32"
            style={styles.loader}
          />

          <Text
            style={styles.loadingTitle}
          >
            Analyzing Image
          </Text>

          <Text
            style={styles.loadingText}
          >
            MobileNetV2 is processing
            your image...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View
          style={styles.errorContainer}
        >
          {image && (
            <Image
              source={{
                uri: image,
              }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          )}

          <View
            style={styles.errorIcon}
          >
            <Text
              style={styles.errorIconText}
            >
              !
            </Text>
          </View>

          <Text
            style={styles.errorTitle}
          >
            Image Not Recognized
          </Text>

          <Text
            style={styles.errorMessage}
          >
            {error}
          </Text>

          <Text
            style={styles.errorHint}
          >
            Please select a clear mango
            leaf image and try again.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={tryAgain}
          >
            <Text
              style={styles.primaryButtonText}
            >
              Try Another Image
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={goBack}
          >
            <Text
              style={styles.secondaryButtonText}
            >
              Go Back
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
      <View
        style={styles.centerContainer}
      >
        <Text
          style={styles.title}
        >
          Preparing Result
        </Text>

        <ActivityIndicator
          size="large"
          color="#2D7D32"
        />
      </View>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F7F9F8",
    },

    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 25,
    },

    errorContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 25,
    },

    centerContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },

    previewImage: {
      width: "90%",
      height: 300,
      borderRadius: 20,
      backgroundColor: "#E8F1E8",
      marginBottom: 25,
    },

    loader: {
      marginTop: 5,
      marginBottom: 15,
    },

    loadingTitle: {
      fontSize: 25,
      fontWeight: "700",
      color: "#2D7D32",
      marginBottom: 8,
    },

    loadingText: {
      fontSize: 16,
      color: "#777777",
      textAlign: "center",
    },

    errorIcon: {
      width: 65,
      height: 65,
      borderRadius: 33,
      backgroundColor: "#E57373",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 18,
    },

    errorIconText: {
      color: "#FFFFFF",
      fontSize: 40,
      fontWeight: "700",
    },

    errorTitle: {
      fontSize: 27,
      fontWeight: "700",
      color: "#333333",
      textAlign: "center",
      marginBottom: 12,
    },

    errorMessage: {
      fontSize: 17,
      lineHeight: 25,
      color: "#555555",
      textAlign: "center",
      marginHorizontal: 15,
    },

    errorHint: {
      fontSize: 15,
      lineHeight: 22,
      color: "#777777",
      textAlign: "center",
      marginTop: 10,
      marginHorizontal: 20,
    },

    primaryButton: {
      width: "90%",
      minHeight: 58,
      backgroundColor: "#2D7D32",
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
    },

    primaryButtonText: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "700",
    },

    secondaryButton: {
      minHeight: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
      paddingHorizontal: 20,
    },

    secondaryButtonText: {
      color: "#2D7D32",
      fontSize: 16,
      fontWeight: "600",
    },

    title: {
      fontSize: 24,
      fontWeight: "700",
      color: "#2D7D32",
      marginBottom: 20,
    },
  });