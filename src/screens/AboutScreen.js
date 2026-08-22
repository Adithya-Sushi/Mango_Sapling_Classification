import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import COLORS from "../styles/colors";

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>
          MangoLeaf AI
        </Text>

        <Text style={styles.heading}>
          Project
        </Text>

        <Text style={styles.content}>
          Offline Mango Variety Identification using MobileNetV2 and DenseNet121 TensorFlow Lite Models.
        </Text>

        <Text style={styles.heading}>
          Features
        </Text>

        <Text style={styles.content}>
          • Camera Prediction{"\n"}
          • Gallery Prediction{"\n"}
          • Offline AI{"\n"}
          • Top 3 Predictions{"\n"}
          • Confidence Score{"\n"}
          • Prediction History
        </Text>

        <Text style={styles.heading}>
          Developed At
        </Text>

        <Text style={styles.content}>
          VIT Vellore
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 30,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
  },
  content: {
    fontSize: 17,
    marginTop: 10,
    lineHeight: 28,
  },
});